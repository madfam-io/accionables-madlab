-- ============================================================================
-- Initial Schema Migration
-- Created: 2025-11-23
-- Description: Creates all tables for MADLAB project management system
-- ============================================================================

-- Create ENUMS
CREATE TYPE "project_status" AS ENUM ('planning', 'active', 'on-hold', 'completed', 'archived');
CREATE TYPE "task_status" AS ENUM ('not-started', 'in-progress', 'completed', 'blocked', 'cancelled');
CREATE TYPE "task_difficulty" AS ENUM ('easy', 'medium', 'hard', 'expert');

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "janua_id" VARCHAR(255) NOT NULL UNIQUE,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "display_name" VARCHAR(255),
  "avatar_url" TEXT,
  "role" VARCHAR(50) DEFAULT 'member',
  "is_active" BOOLEAN DEFAULT TRUE NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "last_seen_at" TIMESTAMP
);

CREATE INDEX idx_users_janua_id ON "users"("janua_id");
CREATE INDEX idx_users_email ON "users"("email");

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "projects" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "name_en" VARCHAR(255),
  "description" TEXT,
  "description_en" TEXT,
  "status" "project_status" DEFAULT 'planning' NOT NULL,
  "start_date" TIMESTAMP,
  "target_end_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "created_by" UUID REFERENCES "users"("id"),
  "metadata" JSONB,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_projects_status ON "projects"("status");
CREATE INDEX idx_projects_created_by ON "projects"("created_by");

-- ============================================================================
-- TASKS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "tasks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "legacy_id" VARCHAR(50) UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "title_en" VARCHAR(255),
  "description" TEXT,
  "description_en" TEXT,
  "status" "task_status" DEFAULT 'not-started' NOT NULL,
  "assignee_id" UUID REFERENCES "users"("id"),
  "estimated_hours" INTEGER,
  "difficulty" "task_difficulty",
  "phase" INTEGER DEFAULT 1,
  "section" VARCHAR(255),
  "section_en" VARCHAR(255),
  "progress" INTEGER DEFAULT 0,
  "actual_hours" INTEGER,
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "completed_at" TIMESTAMP,
  "dependencies" JSONB DEFAULT '[]',
  "metadata" JSONB,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_tasks_project_id ON "tasks"("project_id");
CREATE INDEX idx_tasks_assignee_id ON "tasks"("assignee_id");
CREATE INDEX idx_tasks_status ON "tasks"("status");
CREATE INDEX idx_tasks_phase ON "tasks"("phase");
CREATE INDEX idx_tasks_legacy_id ON "tasks"("legacy_id");

-- ============================================================================
-- TASK_COMMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "task_comments" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "task_id" UUID NOT NULL REFERENCES "tasks"("id") ON DELETE CASCADE,
  "author_id" UUID NOT NULL REFERENCES "users"("id"),
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updated_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_task_comments_task_id ON "task_comments"("task_id");
CREATE INDEX idx_task_comments_author_id ON "task_comments"("author_id");

-- ============================================================================
-- PROJECT_MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "project_members" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_id" UUID NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role" VARCHAR(50) DEFAULT 'member' NOT NULL,
  "joined_at" TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE("project_id", "user_id")
);

CREATE INDEX idx_project_members_project_id ON "project_members"("project_id");
CREATE INDEX idx_project_members_user_id ON "project_members"("user_id");

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON "projects"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON "tasks"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_comments_updated_at BEFORE UPDATE ON "task_comments"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
