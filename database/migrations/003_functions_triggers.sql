-- Database Functions and Triggers for Workload360

-- Function to calculate leave days between dates (excluding weekends and holidays)
CREATE OR REPLACE FUNCTION calculate_leave_days(
    p_start_date DATE,
    p_end_date DATE,
    p_is_half_day BOOLEAN DEFAULT FALSE
) RETURNS DECIMAL AS $$
DECLARE
    v_days DECIMAL := 0;
    v_current_date DATE;
BEGIN
    v_current_date := p_start_date;
    
    WHILE v_current_date <= p_end_date LOOP
        -- Check if not weekend (Saturday=6, Sunday=0)
        IF EXTRACT(DOW FROM v_current_date) NOT IN (0, 6) THEN
            -- Check if not a holiday
            IF NOT EXISTS (
                SELECT 1 FROM holidays 
                WHERE date = v_current_date 
                AND is_working_day = FALSE
            ) THEN
                v_days := v_days + 1;
            END IF;
        END IF;
        
        v_current_date := v_current_date + 1;
    END LOOP;
    
    -- If half day, return 0.5
    IF p_is_half_day THEN
        RETURN 0.5;
    END IF;
    
    RETURN v_days;
END;
$$ LANGUAGE plpgsql;

-- Function to update leave balance when request is approved/rejected
CREATE OR REPLACE FUNCTION update_leave_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- If leave request is approved
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Decrease pending days and increase used days
        UPDATE leave_balances
        SET 
            pending_days = pending_days - NEW.days_count,
            used_days = used_days + NEW.days_count
        WHERE user_id = NEW.user_id
        AND leave_type_id = NEW.leave_type_id
        AND year = EXTRACT(YEAR FROM NEW.start_date);
        
    -- If leave request is rejected or cancelled
    ELSIF (NEW.status IN ('rejected', 'cancelled')) AND OLD.status = 'pending' THEN
        -- Just decrease pending days
        UPDATE leave_balances
        SET pending_days = pending_days - NEW.days_count
        WHERE user_id = NEW.user_id
        AND leave_type_id = NEW.leave_type_id
        AND year = EXTRACT(YEAR FROM NEW.start_date);
        
    -- If new pending leave request
    ELSIF NEW.status = 'pending' AND OLD.status IS NULL THEN
        -- Increase pending days
        UPDATE leave_balances
        SET pending_days = pending_days + NEW.days_count
        WHERE user_id = NEW.user_id
        AND leave_type_id = NEW.leave_type_id
        AND year = EXTRACT(YEAR FROM NEW.start_date);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for leave balance updates
CREATE TRIGGER trigger_update_leave_balance
    AFTER INSERT OR UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_leave_balance();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_title VARCHAR,
    p_message TEXT,
    p_entity_type VARCHAR DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id, type, title, message,
        related_entity_type, related_entity_id
    ) VALUES (
        p_user_id, p_type, p_title, p_message,
        p_entity_type, p_entity_id
    ) RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to send leave request notifications
CREATE OR REPLACE FUNCTION notify_leave_request_update()
RETURNS TRIGGER AS $$
DECLARE
    v_user_name VARCHAR;
    v_manager_id UUID;
BEGIN
    SELECT full_name, manager_id INTO v_user_name, v_manager_id
    FROM user_profiles
    WHERE id = NEW.user_id;
    
    -- Notify user when status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        IF NEW.status = 'approved' THEN
            PERFORM create_notification(
                NEW.user_id,
                'leave_approved',
                'Leave Request Approved',
                'Your leave request from ' || NEW.start_date || ' to ' || NEW.end_date || ' has been approved.',
                'leave_request',
                NEW.id
            );
        ELSIF NEW.status = 'rejected' THEN
            PERFORM create_notification(
                NEW.user_id,
                'leave_rejected',
                'Leave Request Rejected',
                'Your leave request from ' || NEW.start_date || ' to ' || NEW.end_date || ' has been rejected.',
                'leave_request',
                NEW.id
            );
        END IF;
    END IF;
    
    -- Notify manager on new request
    IF OLD.id IS NULL AND NEW.status = 'pending' AND v_manager_id IS NOT NULL THEN
        PERFORM create_notification(
            v_manager_id,
            'approval_request',
            'New Leave Approval Request',
            v_user_name || ' has requested leave from ' || NEW.start_date || ' to ' || NEW.end_date || '.',
            'leave_request',
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for leave request notifications
CREATE TRIGGER trigger_notify_leave_request
    AFTER INSERT OR UPDATE ON leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_leave_request_update();

-- Function to update workload metrics
CREATE OR REPLACE FUNCTION update_team_workload_metrics(
    p_team_id UUID,
    p_date DATE
) RETURNS VOID AS $$
DECLARE
    v_total_members INTEGER;
    v_on_leave INTEGER;
    v_available INTEGER;
    v_capacity DECIMAL;
BEGIN
    -- Count total team members
    SELECT COUNT(*) INTO v_total_members
    FROM team_members
    WHERE team_id = p_team_id;
    
    -- Count members on leave for the date
    SELECT COUNT(DISTINCT user_id) INTO v_on_leave
    FROM leave_requests lr
    JOIN user_profiles up ON lr.user_id = up.id
    WHERE up.team_id = p_team_id
    AND lr.status = 'approved'
    AND p_date BETWEEN lr.start_date AND lr.end_date;
    
    v_available := v_total_members - v_on_leave;
    v_capacity := CASE 
        WHEN v_total_members > 0 THEN (v_available::DECIMAL / v_total_members) * 100
        ELSE 100
    END;
    
    -- Insert or update metrics
    INSERT INTO workload_metrics (
        team_id, date, total_members, available_members,
        on_leave_count, capacity_percentage, workload_score
    ) VALUES (
        p_team_id, p_date, v_total_members, v_available,
        v_on_leave, v_capacity, 100 - v_capacity
    )
    ON CONFLICT (team_id, date) DO UPDATE SET
        total_members = EXCLUDED.total_members,
        available_members = EXCLUDED.available_members,
        on_leave_count = EXCLUDED.on_leave_count,
        capacity_percentage = EXCLUDED.capacity_percentage,
        workload_score = EXCLUDED.workload_score,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check and apply auto-approval rules
CREATE OR REPLACE FUNCTION check_auto_approval_rules(
    p_leave_request_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_leave_request leave_requests%ROWTYPE;
    v_rule approval_rules%ROWTYPE;
    v_team_id UUID;
    v_should_auto_approve BOOLEAN := FALSE;
BEGIN
    -- Get leave request details
    SELECT * INTO v_leave_request
    FROM leave_requests
    WHERE id = p_leave_request_id;
    
    -- Get user's team
    SELECT team_id INTO v_team_id
    FROM user_profiles
    WHERE id = v_leave_request.user_id;
    
    -- Check applicable rules (order by priority)
    FOR v_rule IN
        SELECT * FROM approval_rules
        WHERE is_active = TRUE
        AND (team_id IS NULL OR team_id = v_team_id)
        ORDER BY priority DESC
    LOOP
        -- Check conditions (simplified - extend as needed)
        IF v_rule.conditions->>'max_days' IS NOT NULL THEN
            IF v_leave_request.days_count <= (v_rule.conditions->>'max_days')::DECIMAL THEN
                v_should_auto_approve := TRUE;
            END IF;
        END IF;
        
        -- If rule matches, apply it
        IF v_should_auto_approve THEN
            UPDATE leave_requests
            SET 
                status = 'auto_approved',
                auto_approved = TRUE,
                applied_rule_id = v_rule.id,
                approved_at = NOW()
            WHERE id = p_leave_request_id;
            
            RETURN TRUE;
        END IF;
    END LOOP;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to initialize leave balance for new user
CREATE OR REPLACE FUNCTION initialize_user_leave_balance()
RETURNS TRIGGER AS $$
DECLARE
    v_leave_type RECORD;
    v_current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
BEGIN
    -- Create leave balance for each active leave type
    FOR v_leave_type IN
        SELECT * FROM leave_types WHERE is_active = TRUE
    LOOP
        INSERT INTO leave_balances (
            user_id, leave_type_id, year, total_days
        ) VALUES (
            NEW.id, v_leave_type.id, v_current_year, v_leave_type.default_days_per_year
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to initialize leave balance for new users
CREATE TRIGGER trigger_initialize_leave_balance
    AFTER INSERT ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION initialize_user_leave_balance();
