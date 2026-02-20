# Database Schema for Workload360

## Overview
This document describes the database schema for the Workload360 application using Supabase (PostgreSQL).

## Tables

### 1. users (Handled by Supabase Auth + Extended Metadata)

Extended in `user_profiles` table:
- `id` (UUID, PK, references auth.users)
- `full_name` (VARCHAR)
- `role` (ENUM: 'employee', 'manager', 'admin')
- `team_id` (UUID, FK to teams)
- `manager_id` (UUID, FK to users)
- `phone` (VARCHAR, optional)
- `department` (VARCHAR, optional)
- `hire_date` (DATE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. teams
- `id` (UUID, PK)
- `name` (VARCHAR, unique)
- `description` (TEXT)
- `manager_id` (UUID, FK to users)
- `parent_team_id` (UUID, FK to teams, optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 3. leave_types
- `id` (UUID, PK)
- `name` (VARCHAR, unique) - vacation, sick, personal, etc.
- `code` (VARCHAR, unique)
- `description` (TEXT)
- `default_days_per_year` (INTEGER)
- `requires_approval` (BOOLEAN)
- `is_paid` (BOOLEAN)
- `color` (VARCHAR) - for UI display
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)

### 4. leave_balances
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `leave_type_id` (UUID, FK to leave_types)
- `year` (INTEGER)
- `total_days` (DECIMAL)
- `used_days` (DECIMAL)
- `pending_days` (DECIMAL)
- `available_days` (DECIMAL, computed)
- `carried_over_days` (DECIMAL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- UNIQUE(user_id, leave_type_id, year)

### 5. leave_requests
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `leave_type_id` (UUID, FK to leave_types)
- `start_date` (DATE)
- `end_date` (DATE)
- `days_count` (DECIMAL)
- `is_half_day` (BOOLEAN)
- `half_day_period` (ENUM: 'morning', 'afternoon', nullable)
- `reason` (TEXT)
- `status` (ENUM: 'pending', 'approved', 'rejected', 'cancelled', 'auto_approved')
- `approved_by` (UUID, FK to users, nullable)
- `approved_at` (TIMESTAMP, nullable)
- `rejection_reason` (TEXT, nullable)
- `auto_approved` (BOOLEAN, default false)
- `applied_rule_id` (UUID, FK to approval_rules, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 6. approval_workflows
- `id` (UUID, PK)
- `leave_request_id` (UUID, FK to leave_requests)
- `approver_id` (UUID, FK to users)
- `level` (INTEGER) - for multi-level approvals
- `status` (ENUM: 'pending', 'approved', 'rejected', 'skipped')
- `comments` (TEXT, nullable)
- `action_at` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP)

### 7. approval_rules
- `id` (UUID, PK)
- `name` (VARCHAR)
- `description` (TEXT)
- `team_id` (UUID, FK to teams, nullable)
- `priority` (INTEGER, default 0)
- `is_active` (BOOLEAN, default true)
- `conditions` (JSONB) - flexible rule conditions
  ```json
  {
    "max_days": 3,
    "leave_types": ["vacation"],
    "advance_notice_days": 7,
    "max_team_absence_percentage": 0.2
  }
  ```
- `created_by` (UUID, FK to users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 8. workload_metrics
- `id` (UUID, PK)
- `team_id` (UUID, FK to teams)
- `date` (DATE)
- `total_members` (INTEGER)
- `available_members` (INTEGER)
- `on_leave_count` (INTEGER)
- `capacity_percentage` (DECIMAL)
- `workload_score` (DECIMAL) - calculated metric
- `created_at` (TIMESTAMP)
- UNIQUE(team_id, date)

### 9. notifications
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `type` (ENUM: 'leave_approved', 'leave_rejected', 'approval_request', 'workload_alert')
- `title` (VARCHAR)
- `message` (TEXT)
- `related_entity_type` (VARCHAR) - 'leave_request', 'approval', etc.
- `related_entity_id` (UUID)
- `is_read` (BOOLEAN, default false)
- `read_at` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP)

### 10. holidays
- `id` (UUID, PK)
- `name` (VARCHAR)
- `date` (DATE)
- `is_working_day` (BOOLEAN, default false)
- `country` (VARCHAR, optional)
- `region` (VARCHAR, optional)
- `created_at` (TIMESTAMP)

### 11. team_members
- `team_id` (UUID, FK to teams)
- `user_id` (UUID, FK to users)
- `joined_at` (TIMESTAMP)
- PRIMARY KEY(team_id, user_id)

### 12. audit_logs
- `id` (UUID, PK)
- `user_id` (UUID, FK to users)
- `action` (VARCHAR)
- `entity_type` (VARCHAR)
- `entity_id` (UUID)
- `old_values` (JSONB, nullable)
- `new_values` (JSONB, nullable)
- `ip_address` (VARCHAR, nullable)
- `user_agent` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)

## Indexes

- `idx_leave_requests_user_id` on leave_requests(user_id)
- `idx_leave_requests_status` on leave_requests(status)
- `idx_leave_requests_dates` on leave_requests(start_date, end_date)
- `idx_notifications_user_unread` on notifications(user_id, is_read)
- `idx_workload_metrics_team_date` on workload_metrics(team_id, date)
- `idx_team_members_user` on team_members(user_id)
- `idx_audit_logs_user_entity` on audit_logs(user_id, entity_type, entity_id)

## Row Level Security (RLS) Policies

Enable RLS on all tables and create policies:

1. **users/user_profiles**: Users can read own profile, managers can read team members
2. **leave_requests**: Users can CRUD own requests, managers can read/approve team requests
3. **notifications**: Users can only access own notifications
4. **approval_rules**: Managers and admins can manage rules
5. **workload_metrics**: Read-only for employees, write for system/managers

## Functions & Triggers

1. **calculate_available_days**: Function to compute available leave days
2. **update_workload_metrics**: Trigger on leave_request changes
3. **send_notification**: Function to create notifications
4. **apply_approval_rules**: Function to check and auto-approve requests
5. **audit_log_trigger**: Trigger for all data changes
