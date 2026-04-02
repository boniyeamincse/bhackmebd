-- B-HackMe Database Initialization
-- PostgreSQL 16

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(150),
  avatar_url    VARCHAR(500),
  role          VARCHAR(20)  NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin','instructor')),
  level         VARCHAR(20)  NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced','hacker')),
  total_xp      INTEGER      NOT NULL DEFAULT 0,
  badges        TEXT[]       NOT NULL DEFAULT '{}',
  is_active     BOOLEAN      NOT NULL DEFAULT true,
  last_login    TIMESTAMP,
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Chapters
CREATE TABLE IF NOT EXISTS chapters (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255) NOT NULL,
  title_bn      VARCHAR(255),
  description   TEXT,
  level         VARCHAR(20)  NOT NULL CHECK (level IN ('beginner','intermediate','advanced','hacker')),
  order_index   INTEGER      NOT NULL,
  is_published  BOOLEAN      NOT NULL DEFAULT false,
  thumbnail_url VARCHAR(500),
  xp_reward     INTEGER      NOT NULL DEFAULT 100,
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id   UUID         NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  title_bn     VARCHAR(255),
  content_md   TEXT         NOT NULL,
  order_index  INTEGER      NOT NULL,
  xp_reward    INTEGER      NOT NULL DEFAULT 50,
  is_published BOOLEAN      NOT NULL DEFAULT false,
  created_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id       UUID         NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  description     TEXT         NOT NULL,
  expected_output TEXT,
  validation_type VARCHAR(20)  NOT NULL DEFAULT 'contains' CHECK (validation_type IN ('exact','contains','regex','custom')),
  validation_rule TEXT,
  hint            TEXT,
  xp_reward       INTEGER      NOT NULL DEFAULT 25,
  order_index     INTEGER      NOT NULL
);

-- User Progress
CREATE TABLE IF NOT EXISTS user_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES users(id),
  chapter_id   UUID         REFERENCES chapters(id),
  lesson_id    UUID         REFERENCES lessons(id),
  task_id      UUID         NOT NULL REFERENCES tasks(id),
  status       VARCHAR(20)  NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
  attempts     INTEGER      NOT NULL DEFAULT 0,
  completed_at TIMESTAMP,
  xp_earned    INTEGER      NOT NULL DEFAULT 0,
  UNIQUE(user_id, task_id)
);

-- User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES users(id),
  container_id VARCHAR(255),
  container_ip VARCHAR(50),
  started_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
  last_active  TIMESTAMP    NOT NULL DEFAULT NOW(),
  expires_at   TIMESTAMP,
  is_active    BOOLEAN      NOT NULL DEFAULT true
);

-- Badges
CREATE TABLE IF NOT EXISTS badges (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(100) UNIQUE NOT NULL,
  description    TEXT,
  icon_url       VARCHAR(500),
  criteria_type  VARCHAR(50),
  criteria_value INTEGER
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lessons_chapter    ON lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_tasks_lesson       ON tasks(lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_user      ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user      ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_xp           ON users(total_xp DESC);

-- Seed default badges
INSERT INTO badges (name, description, criteria_type, criteria_value) VALUES
  ('First Step',    'Complete your first lesson',       'lesson_count',    1),
  ('Streak 7',      '7-day login streak',               'streak_days',     7),
  ('Terminal Pro',  '100 commands executed',            'command_count', 100),
  ('Key Hunter',    'First CTF flag captured',          'ctf_captured',    1),
  ('1000 XP',       'Reach 1000 XP',                   'xp_milestone',  1000),
  ('Hacker Level',  'Reach Hacker level',               'level_reached',   4),
  ('Speed Demon',   'Complete a lesson under 5 minutes','speed_lesson',    1)
ON CONFLICT (name) DO NOTHING;
