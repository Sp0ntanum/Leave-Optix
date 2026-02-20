```markdown
# Atomic Operations Deployment Guide

## Overview

This migration adds PostgreSQL RPC functions to prevent race conditions in leave management operations. **No schema changes required.**

## What's Fixed

1. **Leave Creation Race Condition** - Prevents concurrent requests from over-booking balance
2. **Approval Race Condition** - Prevents double approval and balance deduction
3. **Cancellation Race Condition** - Ensures atomic balance updates

## Deployment Steps

### Step 1: Apply Database Migration

Run the SQL migration on your Supabase database:

```bash
# Option A: Using Supabase CLI
supabase db push

# Option B: Using psql
psql -h your-supabase-host.supabase.co \
     -U postgres \
     -d postgres \
     -f database/migrations/004_atomic_operations.sql

# Option C: Via Supabase Dashboard
# 1. Go to SQL Editor in Supabase Dashboard
# 2. Copy contents of database/migrations/004_atomic_operations.sql
# 3. Execute the SQL
```

... (rest of deployment steps retained in original file)
