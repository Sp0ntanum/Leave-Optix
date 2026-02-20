-- Create auto_approval_rules table
CREATE TABLE IF NOT EXISTS auto_approval_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    leave_type VARCHAR(50),
    max_duration_days INTEGER,
    min_notice_days INTEGER,
    max_team_absence_percent INTEGER,
    min_leave_balance INTEGER,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_auto_approval_rules_active ON auto_approval_rules(is_active, priority);

-- Insert default rules
INSERT INTO auto_approval_rules (name, description, leave_type, max_duration_days, min_notice_days, max_team_absence_percent, min_leave_balance, priority)
VALUES 
    ('Short Leave Auto-Approval', 'Auto-approve leaves up to 3 days with 7 days notice', NULL, 3, 7, 30, 3, 1),
    ('Emergency Leave', 'Auto-approve emergency leaves up to 2 days', 'Emergency', 2, 0, 40, 2, 2),
    ('Sick Leave Quick Approval', 'Auto-approve sick leaves up to 5 days', 'Sick Leave', 5, 1, 35, 5, 3);

-- Function to calculate team absence percentage
CREATE OR REPLACE FUNCTION calculate_team_absence(start_date DATE, end_date DATE)
RETURNS INTEGER AS $$
DECLARE
    total_team INTEGER;
    absent_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_team FROM users WHERE role IN ('employee', 'manager');
    
    SELECT COUNT(DISTINCT user_id) INTO absent_count
    FROM leave_requests
    WHERE status = 'Approved'
    AND (
        (start_date BETWEEN $1 AND $2) OR
        (end_date BETWEEN $1 AND $2) OR
        ($1 BETWEEN start_date AND end_date)
    );
    
    IF total_team = 0 THEN
        RETURN 0;
    END IF;
    
    RETURN (absent_count * 100 / total_team);
END;
$$ LANGUAGE plpgsql;
