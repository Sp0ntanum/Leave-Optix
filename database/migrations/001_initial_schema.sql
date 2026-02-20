-- Workload360 Database Schema - Migration Script
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('employee', 'manager', 'admin');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'auto_approved');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'skipped');
CREATE TYPE half_day_period AS ENUM ('morning', 'afternoon');
CREATE TYPE notification_type AS ENUM ('leave_approved', 'leave_rejected', 'approval_request', 'workload_alert', 'system');

-- 1. Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    manager_id UUID REFERENCES auth.users(id),
    parent_team_id UUID REFERENCES teams(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'employee',
    team_id UUID REFERENCES teams(id),
    manager_id UUID REFERENCES auth.users(id),
    phone VARCHAR(50),
    department VARCHAR(100),
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Leave types
CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    default_days_per_year INTEGER DEFAULT 0,
    requires_approval BOOLEAN DEFAULT TRUE,
    is_paid BOOLEAN DEFAULT TRUE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Leave balances
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id),
    year INTEGER NOT NULL,
    total_days DECIMAL(5,2) DEFAULT 0,
    used_days DECIMAL(5,2) DEFAULT 0,
    pending_days DECIMAL(5,2) DEFAULT 0,
    carried_over_days DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, leave_type_id, year)
);

-- Add computed column for available days
ALTER TABLE leave_balances ADD COLUMN available_days DECIMAL(5,2) 
    GENERATED ALWAYS AS (total_days + carried_over_days - used_days - pending_days) STORED;

-- 5. Leave requests
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count DECIMAL(4,2) NOT NULL,
    is_half_day BOOLEAN DEFAULT FALSE,
    half_day_period half_day_period,
    reason TEXT NOT NULL,
    status leave_status DEFAULT 'pending',
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    auto_approved BOOLEAN DEFAULT FALSE,
    applied_rule_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (end_date >= start_date),
    CONSTRAINT half_day_check CHECK (
        (is_half_day = TRUE AND half_day_period IS NOT NULL) OR
        (is_half_day = FALSE AND half_day_period IS NULL)
    )
);

-- 6. Approval workflows
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leave_request_id UUID NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
    approver_id UUID NOT NULL REFERENCES auth.users(id),
    level INTEGER DEFAULT 1,
    status approval_status DEFAULT 'pending',
    comments TEXT,
    action_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Approval rules
CREATE TABLE approval_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    team_id UUID REFERENCES teams(id),
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    conditions JSONB NOT NULL,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Workload metrics
CREATE TABLE workload_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_members INTEGER DEFAULT 0,
    available_members INTEGER DEFAULT 0,
    on_leave_count INTEGER DEFAULT 0,
    capacity_percentage DECIMAL(5,2),
    workload_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, date)
);

-- 9. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Holidays
CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    is_working_day BOOLEAN DEFAULT FALSE,
    country VARCHAR(100),
    region VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, country, region)
);

-- 11. Team members junction table
CREATE TABLE team_members (
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY(team_id, user_id)
);

-- 12. Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_leave_requests_user_id ON leave_requests(user_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_requests_type ON leave_requests(leave_type_id);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

CREATE INDEX idx_workload_metrics_team_date ON workload_metrics(team_id, date);

CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_team ON team_members(team_id);

CREATE INDEX idx_audit_logs_user_entity ON audit_logs(user_id, entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

CREATE INDEX idx_approval_workflows_leave ON approval_workflows(leave_request_id);
CREATE INDEX idx_approval_workflows_approver ON approval_workflows(approver_id, status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON leave_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_approval_rules_updated_at BEFORE UPDATE ON approval_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default leave types
INSERT INTO leave_types (name, code, description, default_days_per_year, color) VALUES
    ('Vacation', 'VAC', 'Annual vacation leave', 20, '#3B82F6'),
    ('Sick Leave', 'SICK', 'Medical sick leave', 10, '#EF4444'),
    ('Personal', 'PER', 'Personal leave', 5, '#8B5CF6'),
    ('Unpaid', 'UNPAID', 'Unpaid leave', 0, '#6B7280'),
    ('Maternity', 'MAT', 'Maternity leave', 90, '#EC4899'),
    ('Paternity', 'PAT', 'Paternity leave', 14, '#10B981');
