# Database Schema Documentation - Workload360

This document provides detailed information about the database schema, relationships, and design decisions.

## Entity Relationship Diagram

```
┌─────────────────┐
│   auth.users    │ (Supabase managed)
│  ─────────────  │
│  id (PK)        │
│  email          │
│  encrypted_pass │
└────────┬────────┘
         │ 1
         │
         │ 1
    ┌────▼─────────────┐
    │  user_profiles   │
    │  ──────────────  │
    │  id (PK, FK)     │◄─────────┐
    │  full_name       │           │
    │  role            │           │
    │  team_id (FK)    │───┐       │
    │  manager_id (FK) │   │       │ manager
    └──────────────────┘   │       │
                           │ *     │ 1
                           │       │
         ┌─────────────────┘       │
         │                         │
         │ *                       │
    ┌────▼──────────┐              │
    │    teams      │              │
    │  ───────────  │              │
    │  id (PK)      │              │
    │  name         │              │
    │  manager_id   │──────────────┘
    └───────────────┘

┌──────────────────┐       ┌─────────────────┐
│  leave_requests  │   *   │  leave_types    │
│  ──────────────  │───────│  ─────────────  │
│  id (PK)         │       │  id (PK)        │
│  user_id (FK)    │       │  name           │
│  leave_type_id   │───────┤  code           │
│  start_date      │       │  default_days   │
│  end_date        │       └─────────────────┘
│  status          │
│  approved_by     │
└──────────────────┘
         │
         │ 1
         │
         │ *
┌────────▼────────────┐
│ approval_workflows  │
│  ─────────────────  │
│  id (PK)            │
│  leave_request_id   │
│  approver_id (FK)   │
│  status             │
└─────────────────────┘

┌──────────────────┐
│  leave_balances  │
│  ──────────────  │
│  id (PK)         │
│  user_id (FK)    │
│  leave_type_id   │
│  year            │
│  total_days      │
│  used_days       │
│  pending_days    │
└──────────────────┘

┌──────────────────┐
│ workload_metrics │
│  ──────────────  │
│  id (PK)         │
│  team_id (FK)    │
│  date            │
│  total_members   │
│  on_leave_count  │
│  capacity_%      │
└──────────────────┘

┌──────────────────┐
│  notifications   │
│  ──────────────  │
│  id (PK)         │
│  user_id (FK)    │
│  type            │
│  message         │
│  is_read         │
└──────────────────┘
```

## Table Details

### 1. user_profiles

Extends Supabase's `auth.users` table with application-specific user data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users | User unique identifier |
| full_name | VARCHAR(255) | NOT NULL | User's full name |
| role | ENUM | DEFAULT 'employee' | User role: employee, manager, admin |
| team_id | UUID | FK → teams | User's primary team |
| manager_id | UUID | FK → auth.users | User's manager |
| phone | VARCHAR(50) | NULL | Contact number |
| department | VARCHAR(100) | NULL | Department name |
| hire_date | DATE | NULL | Date of joining |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Relationships:**
- Many-to-One with `teams` (team_id)
- Self-referencing (manager_id)

**Indexes:**
- `idx_user_profiles_team` on team_id
- `idx_user_profiles_manager` on manager_id

### 2. teams

Organizational teams structure with hierarchical support.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Team unique identifier |
| name | VARCHAR(255) | UNIQUE, NOT NULL | Team name |
| description | TEXT | NULL | Team description |
| manager_id | UUID | FK → auth.users | Team manager |
| parent_team_id | UUID | FK → teams | Parent team (for hierarchy) |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Features:**
- Supports hierarchical team structure
- Self-referencing for parent-child relationships

### 3. leave_types

Defines different types of leave available in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Leave type identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Leave type name |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Short code (e.g., VAC, SICK) |
| description | TEXT | NULL | Detailed description |
| default_days_per_year | INTEGER | DEFAULT 0 | Default annual allocation |
| requires_approval | BOOLEAN | DEFAULT TRUE | Needs manager approval |
| is_paid | BOOLEAN | DEFAULT TRUE | Paid or unpaid |
| color | VARCHAR(7) | DEFAULT '#3B82F6' | UI display color (hex) |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |

**Default Leave Types:**
- Vacation (20 days)
- Sick Leave (10 days)
- Personal (5 days)
- Unpaid (0 days)
- Maternity (90 days)
- Paternity (14 days)

### 4. leave_balances

Tracks leave balance for each user per leave type per year.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Balance record identifier |
| user_id | UUID | FK → auth.users | User reference |
| leave_type_id | UUID | FK → leave_types | Leave type reference |
| year | INTEGER | NOT NULL | Calendar year |
| total_days | DECIMAL(5,2) | DEFAULT 0 | Total allocated days |
| used_days | DECIMAL(5,2) | DEFAULT 0 | Days already taken |
| pending_days | DECIMAL(5,2) | DEFAULT 0 | Days in pending requests |
| carried_over_days | DECIMAL(5,2) | DEFAULT 0 | Carried from previous year |
| available_days | DECIMAL(5,2) | COMPUTED | Auto-calculated available |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Constraints:**
- UNIQUE(user_id, leave_type_id, year)

**Computed Column:**
```sql
available_days = total_days + carried_over_days - used_days - pending_days
```

### 5. leave_requests

Core table for leave request management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Request identifier |
| user_id | UUID | FK → auth.users | Requesting user |
| leave_type_id | UUID | FK → leave_types | Type of leave |
| start_date | DATE | NOT NULL | Leave start date |
| end_date | DATE | NOT NULL | Leave end date |
| days_count | DECIMAL(4,2) | NOT NULL | Number of days |
| is_half_day | BOOLEAN | DEFAULT FALSE | Half day flag |
| half_day_period | ENUM | NULL | 'morning' or 'afternoon' |
| reason | TEXT | NOT NULL | Reason for leave |
| status | ENUM | DEFAULT 'pending' | Request status |
| approved_by | UUID | FK → auth.users | Approving manager |
| approved_at | TIMESTAMP | NULL | Approval timestamp |
| rejection_reason | TEXT | NULL | Reason for rejection |
| auto_approved | BOOLEAN | DEFAULT FALSE | Auto-approved flag |
| applied_rule_id | UUID | FK → approval_rules | Applied rule if auto-approved |
| created_at | TIMESTAMP | DEFAULT NOW() | Request creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Status Values:**
- `pending`: Awaiting approval
- `approved`: Approved by manager
- `rejected`: Rejected by manager
- `cancelled`: Cancelled by user
- `auto_approved`: Automatically approved

**Constraints:**
- CHECK(end_date >= start_date)
- Half day validation

**Triggers:**
- `update_leave_balance()`: Updates balance on status change
- `notify_leave_request_update()`: Sends notifications

### 6. approval_workflows

Manages multi-level approval workflows.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Workflow step identifier |
| leave_request_id | UUID | FK → leave_requests | Related leave request |
| approver_id | UUID | FK → auth.users | Approver user |
| level | INTEGER | DEFAULT 1 | Approval level (for multi-level) |
| status | ENUM | DEFAULT 'pending' | Approval status |
| comments | TEXT | NULL | Approver comments |
| action_at | TIMESTAMP | NULL | Action timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation time |

**Status Values:**
- `pending`: Awaiting action
- `approved`: Approved
- `rejected`: Rejected
- `skipped`: Skipped (e.g., auto-approved)

### 7. approval_rules

Configurable auto-approval rules.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Rule identifier |
| name | VARCHAR(255) | NOT NULL | Rule name |
| description | TEXT | NULL | Rule description |
| team_id | UUID | FK → teams | Applicable team (NULL = all) |
| priority | INTEGER | DEFAULT 0 | Rule priority (higher first) |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| conditions | JSONB | NOT NULL | Rule conditions (flexible) |
| created_by | UUID | FK → auth.users | Rule creator |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Conditions Schema Example:**
```json
{
  "max_days": 3,
  "leave_types": ["vacation", "personal"],
  "advance_notice_days": 7,
  "max_team_absence_percentage": 0.2,
  "blackout_dates": []
}
```

### 8. workload_metrics

Stores calculated workload metrics per team per day.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Metric record identifier |
| team_id | UUID | FK → teams | Team reference |
| date | DATE | NOT NULL | Metric date |
| total_members | INTEGER | DEFAULT 0 | Total team size |
| available_members | INTEGER | DEFAULT 0 | Available count |
| on_leave_count | INTEGER | DEFAULT 0 | Members on leave |
| capacity_percentage | DECIMAL(5,2) | NULL | Team capacity % |
| workload_score | DECIMAL(5,2) | NULL | Workload intensity score |
| created_at | TIMESTAMP | DEFAULT NOW() | Calculation time |

**Constraints:**
- UNIQUE(team_id, date)

**Calculations:**
```
capacity_percentage = (available_members / total_members) * 100
workload_score = 100 - capacity_percentage
```

### 9. notifications

User notification system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Notification identifier |
| user_id | UUID | FK → auth.users | Recipient user |
| type | ENUM | NOT NULL | Notification type |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| related_entity_type | VARCHAR(50) | NULL | Related entity type |
| related_entity_id | UUID | NULL | Related entity ID |
| is_read | BOOLEAN | DEFAULT FALSE | Read status |
| read_at | TIMESTAMP | NULL | Read timestamp |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Notification Types:**
- `leave_approved`: Leave request approved
- `leave_rejected`: Leave request rejected
- `approval_request`: New approval request
- `workload_alert`: Workload capacity alert
- `system`: System notifications

## Database Functions

### 1. calculate_leave_days()

Calculates working days between two dates, excluding weekends and holidays.

```sql
SELECT calculate_leave_days('2024-03-15', '2024-03-20', FALSE);
-- Returns: 4 (excluding weekend days)
```

### 2. update_leave_balance()

Trigger function that automatically updates leave balances when leave request status changes.

### 3. create_notification()

Helper function to create notifications.

```sql
SELECT create_notification(
  user_id := 'uuid',
  p_type := 'leave_approved',
  p_title := 'Leave Approved',
  p_message := 'Your leave has been approved'
);
```

### 4. update_team_workload_metrics()

Calculates and updates workload metrics for a team on a specific date.

```sql
SELECT update_team_workload_metrics('team-uuid', '2024-03-15');
```

### 5. check_auto_approval_rules()

Evaluates auto-approval rules for a leave request.

```sql
SELECT check_auto_approval_rules('leave-request-uuid');
-- Returns: TRUE if auto-approved, FALSE otherwise
```

## Indexing Strategy

### Query Performance Indexes

1. **Leave Requests:**
   - `idx_leave_requests_user_id`: Fast user leave lookups
   - `idx_leave_requests_status`: Status-based queries
   - `idx_leave_requests_dates`: Date range queries

2. **Notifications:**
   - `idx_notifications_user_unread`: Unread notifications
   - `idx_notifications_created`: Recent notifications

3. **Workload Metrics:**
   - `idx_workload_metrics_team_date`: Team capacity lookups

## Data Integrity

### Foreign Key Constraints
All relationships use ON DELETE CASCADE or appropriate referential actions.

### Check Constraints
- Date validation (end_date >= start_date)
- Half-day field consistency
- Status transitions

### Triggers
- Auto-update timestamps
- Balance calculations
- Notification generation
- Audit logging

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies:

1. **Users see own data**
2. **Managers see team data**
3. **Admins see all data**

Example policy:
```sql
CREATE POLICY "Users can view own leave requests"
  ON leave_requests
  FOR SELECT
  USING (auth.uid() = user_id);
```

## Migration Strategy

Migrations are versioned and applied sequentially:

1. `001_initial_schema.sql`: Core tables and structure
2. `002_rls_policies.sql`: Security policies
3. `003_functions_triggers.sql`: Database functions

## Performance Considerations

- Use indexes for frequently queried columns
- Computed columns for derived values
- Triggers for automatic calculations
- Partitioning for large historical data (future)
- Archiving old data (implement as needed)
