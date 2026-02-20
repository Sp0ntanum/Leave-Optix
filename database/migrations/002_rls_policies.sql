-- Row Level Security (RLS) Policies for Workload360

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workload_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Managers can view team member profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles manager
            WHERE manager.id = auth.uid()
            AND manager.role IN ('manager', 'admin')
            AND user_profiles.manager_id = manager.id
        )
    );

-- Leave Requests Policies
CREATE POLICY "Users can view own leave requests" ON leave_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own leave requests" ON leave_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending leave requests" ON leave_requests
    FOR UPDATE USING (
        auth.uid() = user_id AND status = 'pending'
    );

CREATE POLICY "Managers can view team leave requests" ON leave_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = leave_requests.user_id
            AND up.manager_id = auth.uid()
        )
    );

CREATE POLICY "Managers can update team leave requests" ON leave_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = leave_requests.user_id
            AND up.manager_id = auth.uid()
            AND up.role IN ('manager', 'admin')
        )
    );

-- Leave Balances Policies
CREATE POLICY "Users can view own leave balances" ON leave_balances
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Managers can view team leave balances" ON leave_balances
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.id = leave_balances.user_id
            AND up.manager_id = auth.uid()
        )
    );

-- Leave Types Policies (Read-only for all authenticated users)
CREATE POLICY "Anyone can view active leave types" ON leave_types
    FOR SELECT USING (is_active = TRUE);

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
    FOR INSERT WITH CHECK (TRUE);

-- Approval Rules Policies
CREATE POLICY "Managers can view approval rules" ON approval_rules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role IN ('manager', 'admin')
        )
    );

CREATE POLICY "Managers can manage approval rules" ON approval_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role IN ('manager', 'admin')
        )
    );

-- Workload Metrics Policies
CREATE POLICY "Team members can view team workload metrics" ON workload_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM team_members
            WHERE team_members.team_id = workload_metrics.team_id
            AND team_members.user_id = auth.uid()
        )
    );

-- Holidays Policies (Read-only for all authenticated users)
CREATE POLICY "Anyone can view holidays" ON holidays
    FOR SELECT USING (TRUE);

-- Teams Policies
CREATE POLICY "Users can view own team" ON teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.team_id = teams.id
        )
    );

CREATE POLICY "Managers can view and manage teams" ON teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role IN ('manager', 'admin')
        )
    );

-- Team Members Policies
CREATE POLICY "Users can view team members" ON team_members
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM user_profiles
            WHERE user_profiles.id = auth.uid()
        )
    );

-- Audit Logs Policies (Admin only)
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = 'admin'
        )
    );
