-- ============================================
-- Atomic Operations for Leave-Optix
-- Prevent race conditions in leave lifecycle
-- ============================================

-- ============================================
-- 1️⃣ Atomic Leave Creation
-- ============================================

CREATE OR REPLACE FUNCTION create_leave_request_atomic(
    p_user_id UUID,
    p_leave_type_id UUID,
    p_start_date DATE,
    p_end_date DATE,
    p_reason TEXT,
    p_days_count NUMERIC,
    p_is_half_day BOOLEAN,
    p_half_day_period half_day_period
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_balance RECORD;
    v_leave_id UUID;
    v_year INTEGER;
    v_has_overlap BOOLEAN;
BEGIN
    v_year := EXTRACT(YEAR FROM p_start_date);

    -- Lock balance row
    SELECT * INTO v_balance
    FROM leave_balances
    WHERE user_id = p_user_id
      AND leave_type_id = p_leave_type_id
      AND year = v_year
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Leave balance not found for user/year';
    END IF;

    -- Check available balance
    IF v_balance.available_days < p_days_count THEN
        RAISE EXCEPTION 'Insufficient leave balance. Available: % days', v_balance.available_days;
    END IF;

    -- Overlap check (lock potential conflicts)
    SELECT EXISTS(
        SELECT 1 FROM leave_requests
        WHERE user_id = p_user_id
          AND status IN ('pending', 'approved', 'auto_approved')
          AND p_start_date <= end_date
          AND p_end_date >= start_date
        FOR UPDATE
    ) INTO v_has_overlap;

    IF v_has_overlap THEN
        RAISE EXCEPTION 'Overlapping leave request exists';
    END IF;

    -- Insert leave request
    INSERT INTO leave_requests (
        user_id,
        leave_type_id,
        start_date,
        end_date,
        days_count,
        is_half_day,
        half_day_period,
        reason,
        status,
        created_at,
        updated_at
    ) VALUES (
        p_user_id,
        p_leave_type_id,
        p_start_date,
        p_end_date,
        p_days_count,
        p_is_half_day,
        p_half_day_period,
        p_reason,
        'pending',
        NOW(),
        NOW()
    )
    RETURNING id INTO v_leave_id;

    -- Update pending balance
    UPDATE leave_balances
    SET pending_days = pending_days + p_days_count,
        updated_at = NOW()
    WHERE id = v_balance.id;

    RETURN json_build_object(
        'success', true,
        'leave_id', v_leave_id,
        'status', 'pending'
    );
END;
$$;


-- ============================================
-- 2️⃣ Atomic Approval Processing
-- ============================================

CREATE OR REPLACE FUNCTION process_approval_atomic(
    p_leave_id UUID,
    p_manager_id UUID,
    p_status leave_status,
    p_comments TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_leave RECORD;
    v_year INTEGER;
BEGIN
    -- Lock leave row
    SELECT * INTO v_leave
    FROM leave_requests
    WHERE id = p_leave_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Leave request not found';
    END IF;

    IF v_leave.status != 'pending' THEN
        RAISE EXCEPTION 'Leave is not pending. Current status: %', v_leave.status;
    END IF;

    v_year := EXTRACT(YEAR FROM v_leave.start_date);

    -- Update leave status
    UPDATE leave_requests
    SET status = p_status,
        approved_by = p_manager_id,
        approved_at = NOW(),
        rejection_reason = CASE WHEN p_status = 'rejected' THEN p_comments ELSE NULL END,
        updated_at = NOW()
    WHERE id = p_leave_id;

    -- Update balance accordingly
    IF p_status IN ('approved', 'auto_approved') THEN
        UPDATE leave_balances
        SET used_days = used_days + v_leave.days_count,
            pending_days = GREATEST(0, pending_days - v_leave.days_count),
            updated_at = NOW()
        WHERE user_id = v_leave.user_id
          AND leave_type_id = v_leave.leave_type_id
          AND year = v_year;

    ELSIF p_status = 'rejected' THEN
        UPDATE leave_balances
        SET pending_days = GREATEST(0, pending_days - v_leave.days_count),
            updated_at = NOW()
        WHERE user_id = v_leave.user_id
          AND leave_type_id = v_leave.leave_type_id
          AND year = v_year;
    END IF;

    RETURN json_build_object(
        'success', true,
        'leave_id', p_leave_id,
        'status', p_status
    );
END;
$$;


-- ============================================
-- 3️⃣ Atomic Cancellation
-- ============================================

CREATE OR REPLACE FUNCTION cancel_leave_request_atomic(
    p_leave_id UUID,
    p_user_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    v_leave RECORD;
    v_year INTEGER;
BEGIN
    -- Lock leave
    SELECT * INTO v_leave
    FROM leave_requests
    WHERE id = p_leave_id
      AND user_id = p_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Leave request not found or unauthorized';
    END IF;

    IF v_leave.status NOT IN ('pending', 'approved', 'auto_approved') THEN
        RAISE EXCEPTION 'Cannot cancel leave with status: %', v_leave.status;
    END IF;

    v_year := EXTRACT(YEAR FROM v_leave.start_date);

    -- Update leave status
    UPDATE leave_requests
    SET status = 'cancelled',
        updated_at = NOW()
    WHERE id = p_leave_id;

    -- Adjust balance
    IF v_leave.status = 'pending' THEN
        UPDATE leave_balances
        SET pending_days = GREATEST(0, pending_days - v_leave.days_count),
            updated_at = NOW()
        WHERE user_id = p_user_id
          AND leave_type_id = v_leave.leave_type_id
          AND year = v_year;

    ELSIF v_leave.status IN ('approved', 'auto_approved') THEN
        UPDATE leave_balances
        SET used_days = GREATEST(0, used_days - v_leave.days_count),
            updated_at = NOW()
        WHERE user_id = p_user_id
          AND leave_type_id = v_leave.leave_type_id
          AND year = v_year;
    END IF;

    RETURN json_build_object(
        'success', true,
        'leave_id', p_leave_id,
        'status', 'cancelled'
    );
END;
$$;


-- ============================================
-- Permissions
-- ============================================

GRANT EXECUTE ON FUNCTION create_leave_request_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION process_approval_atomic TO authenticated;
GRANT EXECUTE ON FUNCTION cancel_leave_request_atomic TO authenticated;