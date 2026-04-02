-- Initial Prisma migration for B-HackMe
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" VARCHAR(50) NOT NULL UNIQUE,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password_hash" VARCHAR(255) NOT NULL,
  "full_name" VARCHAR(150),
  "avatar_url" VARCHAR(500),
  "role" VARCHAR(20) NOT NULL DEFAULT 'student',
  "level" VARCHAR(20) NOT NULL DEFAULT 'beginner',
  "total_xp" INTEGER NOT NULL DEFAULT 0,
  "badges" TEXT[] NOT NULL DEFAULT '{}',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "last_login" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "chapters" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "title_bn" VARCHAR(255),
  "description" TEXT,
  "level" VARCHAR(20) NOT NULL,
  "order_index" INTEGER NOT NULL,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "thumbnail_url" VARCHAR(500),
  "xp_reward" INTEGER NOT NULL DEFAULT 100,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "lessons" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "chapter_id" UUID NOT NULL REFERENCES "chapters"("id") ON DELETE CASCADE,
  "title" VARCHAR(255) NOT NULL,
  "title_bn" VARCHAR(255),
  "content_md" TEXT NOT NULL,
  "order_index" INTEGER NOT NULL,
  "xp_reward" INTEGER NOT NULL DEFAULT 50,
  "is_published" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "tasks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "lesson_id" UUID NOT NULL REFERENCES "lessons"("id") ON DELETE CASCADE,
  "description" TEXT NOT NULL,
  "expected_output" TEXT,
  "validation_type" VARCHAR(20) NOT NULL DEFAULT 'contains',
  "validation_rule" TEXT,
  "hint" TEXT,
  "xp_reward" INTEGER NOT NULL DEFAULT 25,
  "order_index" INTEGER NOT NULL
);

CREATE TABLE "user_progress" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "chapter_id" UUID REFERENCES "chapters"("id"),
  "lesson_id" UUID REFERENCES "lessons"("id"),
  "task_id" UUID NOT NULL REFERENCES "tasks"("id"),
  "status" VARCHAR(20) NOT NULL DEFAULT 'not_started',
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "completed_at" TIMESTAMP,
  "xp_earned" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "user_id_task_id" UNIQUE ("user_id", "task_id")
);

CREATE TABLE "user_sessions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "container_id" VARCHAR(255),
  "container_ip" VARCHAR(50),
  "started_at" TIMESTAMP NOT NULL DEFAULT NOW(),
  "last_active" TIMESTAMP NOT NULL DEFAULT NOW(),
  "expires_at" TIMESTAMP,
  "is_active" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "badges" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(100) NOT NULL UNIQUE,
  "description" TEXT,
  "icon_url" VARCHAR(500),
  "criteria_type" VARCHAR(50),
  "criteria_value" INTEGER
);

CREATE INDEX "idx_lessons_chapter" ON "lessons"("chapter_id");
CREATE INDEX "idx_tasks_lesson" ON "tasks"("lesson_id");
CREATE INDEX "idx_progress_user" ON "user_progress"("user_id");
CREATE INDEX "idx_sessions_user" ON "user_sessions"("user_id");
CREATE INDEX "idx_users_xp" ON "users"("total_xp" DESC);
