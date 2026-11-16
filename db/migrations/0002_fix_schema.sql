-- Migration corrigida para alinhar o banco com o schema.ts
-- Executar no Neon com: psql "$DATABASE_URL" -f db/migrations/0002_fix_schema.sql

-- 1. Adicionar colunas faltantes em quizzes
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(1000);
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' NOT NULL;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;

-- 2. Criar tabela stories
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image_url VARCHAR(1000),
  status VARCHAR(20) DEFAULT 'draft' NOT NULL,
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Criar tabela story_blocks
CREATE TABLE IF NOT EXISTS story_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  content TEXT NOT NULL,
  media_url VARCHAR(1000),
  media_type VARCHAR(20),
  order_index INTEGER NOT NULL
);

-- 4. Criar tabela courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  cover_image_url VARCHAR(1000),
  status VARCHAR(20) DEFAULT 'draft' NOT NULL,
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 5. Criar tabela course_activities
CREATE TABLE IF NOT EXISTS course_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content_url VARCHAR(1000),
  order_index INTEGER NOT NULL,
  required BOOLEAN DEFAULT TRUE NOT NULL
);

-- 6. Índices
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_options_question_id ON options(question_id);
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_story_blocks_story_id ON story_blocks(story_id);
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_course_activities_course_id ON course_activities(course_id);
