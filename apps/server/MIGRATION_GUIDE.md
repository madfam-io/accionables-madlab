# Database Migration & Seed Guide

This guide walks you through migrating the database schema and seeding it with the 109 legacy tasks.

## Prerequisites

- Docker and Docker Compose installed
- Services running: `docker compose up -d`

## Step 1: Apply Database Schema Changes

The schema has been updated with:
- `legacyId` field on tasks table for idempotent seeding
- Updated difficulty enum (`easy`, `medium`, `hard`, `expert`)
- Enhanced users table with `displayName`, `avatarUrl`, and `metadata`
- Enhanced projects table with `targetEndDate`
- Metadata fields for flexible data storage

### Option A: Using Drizzle Push (Recommended for Development)

This directly syncs your schema without creating migration files:

```bash
# Inside the server container
docker compose exec server npm run db:push
```

### Option B: Using Migrations (Recommended for Production)

Generate and apply migrations:

```bash
# Generate migration
docker compose exec server npm run db:generate

# Apply migration
docker compose exec server npm run db:migrate
```

## Step 2: Run the Seed Script

The seed script will:
1. Create 5 team members (Aldo, Nuri, Luis, Silvia, Caro)
2. Create the main "MADLAB Educational Platform" project
3. Migrate all 109 tasks from the legacy static data
4. Map legacy fields to new schema
5. Store additional metadata in JSONB columns

Run the seed:

```bash
docker compose exec server npm run seed
```

### Expected Output

```
🌱 Starting database seed...

👥 Step 1: Upserting team members...
  ✓ Created user: Aldo (uuid-here)
  ✓ Created user: Nuri (uuid-here)
  ✓ Created user: Luis (uuid-here)
  ✓ Created user: Silvia (uuid-here)
  ✓ Created user: Caro (uuid-here)
  ✅ Processed 5 team members

📁 Step 2: Creating main project...
  ✅ Created project: uuid-here

👥 Step 3: Adding team members to project...
  ✅ Added 5 members to project

📝 Step 4: Loading legacy tasks...
  ✓ Loaded 110 tasks from client data

📝 Step 5: Inserting tasks into database...
  ✓ Inserted 10/110 tasks...
  ✓ Inserted 20/110 tasks...
  ...
  ✓ Inserted 110/110 tasks...
  ✅ Inserted 110 tasks (skipped 0 duplicates)

🎉 Seed completed successfully!

Summary:
  - Team Members: 5
  - Projects: 1
  - Tasks: 110
  - Total Duration: 522.5 hours

✅ Database verification: 110 tasks in database

🔌 Database connection closed
✅ Seed script finished successfully
```

### Re-running the Seed

The seed script is **idempotent** - you can run it multiple times safely:
- Existing users won't be duplicated (checked by email)
- Existing projects won't be duplicated (checked by name)
- Existing tasks won't be duplicated (checked by `legacyId`)

## Step 3: Verify the Migration

### Check Task Count

```bash
docker compose exec server sh -c 'echo "SELECT COUNT(*) FROM tasks;" | psql $DATABASE_URL'
```

Expected: `110` (or `109` depending on actual task count)

### Check Sample Data

```bash
# View first 5 tasks
docker compose exec server sh -c 'echo "SELECT id, title, phase, assignee_id FROM tasks LIMIT 5;" | psql $DATABASE_URL'
```

### Test API Endpoints

```bash
# Get all projects
curl http://localhost:3001/api/projects | jq

# Get all tasks
curl http://localhost:3001/api/tasks | jq

# Get tasks for specific phase
curl "http://localhost:3001/api/tasks?phase=1" | jq

# Get tasks for specific assignee (replace with actual UUID from seed output)
curl "http://localhost:3001/api/tasks?assigneeId=ALDO_UUID_HERE" | jq
```

## Troubleshooting

### Error: "relation does not exist"

The migration hasn't been applied. Run:
```bash
docker compose exec server npm run db:push
```

### Error: "duplicate key value violates unique constraint"

The seed has already been run. This is normal - the script skips duplicates.

### Error: "cannot find module"

The client data isn't accessible. Check that you're running from the monorepo root and that `apps/client/src/data` exists.

### Error: "column does not exist"

Schema mismatch. Drop and recreate the database:
```bash
docker compose down -v
docker compose up -d
docker compose exec server npm run db:push
docker compose exec server npm run seed
```

## Field Mapping Reference

| Legacy Field | New Field | Notes |
|-------------|-----------|-------|
| `task.name` | `tasks.title` | Spanish version |
| `task.nameEn` | `tasks.titleEn` | English version |
| `task.hours` | `tasks.estimatedHours` | Direct mapping |
| `task.assignee` (string) | `tasks.assigneeId` (UUID) | Resolved via user lookup |
| `task.difficulty` (1-5) | `tasks.difficulty` (enum) | 1-2→easy, 3→medium, 4→hard, 5→expert |
| `task.dependencies` | `tasks.dependencies` (JSONB array) | Direct mapping |
| `task.phase` | `tasks.phase` | Direct mapping |
| `task.section` | `metadata.section` | Stored in JSONB |
| `task.sectionEn` | `metadata.sectionEn` | Stored in JSONB |
| `task.manualStatus` | `metadata.manualStatus` | Stored in JSONB |
| `task.statusHistory` | `metadata.statusHistory` | Stored in JSONB |

## Next Steps

After successful migration:

1. **Test Frontend Integration**: Update client to use new API endpoints
2. **Implement Real-time Updates**: Add WebSocket support for collaborative editing
3. **Add Authentication**: Replace mock JWT with real Janua IdP integration
4. **Deploy to Enclii**: Use production Docker Compose configuration

## Database Backup

Before running migrations in production, always backup:

```bash
# Create backup
docker compose exec postgres pg_dump -U madlab madlab > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup (if needed)
docker compose exec -T postgres psql -U madlab madlab < backup_20250101_120000.sql
```
