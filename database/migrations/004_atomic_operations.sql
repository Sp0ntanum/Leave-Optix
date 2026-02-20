-- Migration: Atomic Operations via RPC Functions
-- Purpose: Prevent race conditions in leave creation, approval, and cancellation
-- No schema changes required - only adds stored procedures

-- Function 1: Atomic Leave Request Creation
CREATE OR REPLACE FUNCTION create_leave_request_atomic(
    p_user_id UUID,
    p_leave_type TEXT,
    p_start_date DATE,
    p_end_date DATE,
    p_reason TEXT,
    p_days_count NUMERIC,
    p_is_half_day BOOLEAN,
    p_half_day_period TEXT
) RETURNS JSON AS $$
DECLARE
    v_balance RECORD;
    v_available NUMERIC;
    v_leave_id UUID;
    v_has_overlap BOOLEAN;
BEGIN
    SELECT * INTO v_balance FROM leave_balances
    WHERE user_id = p_user_id AND leave_type = p_leave_type FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Balance record not found';
    END IF;
    
    v_available := v_balance.total - v_balance.used - v_balance.pending;
    IF v_available < p_days_count THEN
        RAISE EXCEPTION 'Insufficient balance. Available: % days', v_available;
    END IF;
    
    SELECT EXISTS(
        SELECT 1 FROM leave_requests
        WHERE user_id = p_user_id AND status IN ('pending', 'approved', 'auto_approved')
        AND p_start_date <= end_date AND p_end_date >= start_date FOR UPDATE
    ) INTO v_has_overlap;
    
    IF v_has_overlap THEN
        RAISE EXCEPTION 'Overlapping leave request exists';
    END IF;
    
    INSERT INTO leave_requests (
        user_id, leave_type, start_date, end_date, reason,
        status, days_count, is_half_day, half_day_period, created_at, updated_at
    ) VALUES (
        p_user_id, p_leave_type, p_start_date, p_end_date, p_reason,
        'pending', p_days_count, p_is_half_day, p_half_day_period, NOW(), NOW()
    ) RETURNING id INTO v_leave_id;
    
    UPDATE leave_balances SET pending = pending + p_days_count, updated_at = NOW()
    WHERE id = v_balance.id;
    
    RETURN (SELECT row_to_json(lr) FROM leave_requests lr WHERE lr.id = v_leave_id);
END;
$$ LANGUAGE plpgsql;

-- Function 2: Atomic Approval Processing
CREATE OR REPLACE FUNCTION process_approval_atomic(
    p_leave_id UUID,
    p_manager_id UUID,
    p_status TEXT,
    p_comments TEXT
) RETURNS JSON AS $$
DECLARE
    v_leave RECORD;
BEGIN
    SELECT * INTO v_leave FROM leave_requests WHERE id = p_leave_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Leave request not found';
    END IF;
    
    IF v_leave.status != 'pending' THEN
        RAISE EXCEPTION 'Leave is not pending (current status: %)', v_leave.status;
    END IF;
    
    UPDATE leave_requests
    SET status = p_status, approved_by = p_manager_id, approved_at = NOW(),
        rejection_reason = CASE WHEN p_status = 'rejected' THEN p_comments ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_leave_id;
    
    IF p_status = 'approved' THEN
        UPDATE leave_balances
        SET used = used + v_leave.days_count,
            pending = GREATEST(0, pending - v_leave.days_count),
            updated_at = NOW()
        WHERE user_id = v_leave.user_id AND leave_type = v_leave.leave_type;
    ELSIF p_status = 'rejected' THEN
        UPDATE leave_balances
        SET pending = GREATEST(0, pending - v_leave.days_count), updated_at = NOW()
        WHERE user_id = v_leave.user_id AND leave_type = v_leave.leave_type;
    END IF;
    
    RETURN json_build_object(
        'leave_id', p_leave_id, 'status', p_status,
        'approved_by', p_manager_id, 'approved_at', NOW(), 'comments', p_comments
    );
END;
$$ LANGUAGE plpgsql;

-- Function 3: Atomic Cancellation
CREATE OR REPLACE FUNCTION cancel_leave_request_atomic(
    p_leave_id UUID,
    p_user_id UUID
) RETURNS JSON AS $$
DECLARE
    v_leave RECORD;
BEGIN
    SELECT * INTO v_leave FROM leave_requests
    WHERE id = p_leave_id AND user_id = p_user_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Leave request not found';
    END IF;
    
    IF v_leave.status NOT IN ('pending', 'approved') THEN
        RAISE EXCEPTION 'Cannot cancel leave with status: %', v_leave.status;
    END IF;
    
    UPDATE leave_requests SET status = 'cancelled', updated_at = NOW() WHERE id = p_leave_id;
    
    IF v_leave.status = 'pending' THEN
        UPDATE leave_balances
        SET pending = GREATEST(0, pending - v_leave.days_count), updated_at = NOW()
        WHERE user_id = p_user_id AND leave_type = v_leave.leave_type;
    ELSIF v_leave.status = 'approved' THEN
        UPDATE leave_balances
        SET used = GREATEST(0, used - v_leave.days_count), updated_at = NOW()
        WHERE user_id = p_user_id AND leave_type = v_leave.leave_type;
    END IF;
    
    RETURN json_build_object('success', true, 'leave_id', p_leave_id);
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION create_leave_request_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION process_approval_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_leave_request_atomic TO authenticated;
