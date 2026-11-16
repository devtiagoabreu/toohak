import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

async function run(db: any, label: string, sql: any) {
  try {
    await db.execute(sql);
    return { label, ok: true };
  } catch (e: any) {
    return { label, ok: false, error: e.message };
  }
}

export async function GET() {
  const db = getDb();
  const results: any[] = [];

  results.push(await run(db, "quizzes.cover_image_url",
    db.execute`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(1000)`));
  results.push(await run(db, "quizzes.status",
    db.execute`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' NOT NULL`));
  results.push(await run(db, "quizzes.updated_at",
    db.execute`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL`));
  results.push(await run(db, "quizzes.is_public",
    db.execute`ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT TRUE NOT NULL`));
  results.push(await run(db, "CREATE TABLE stories",
    db.execute`CREATE TABLE IF NOT EXISTS stories (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(200) NOT NULL, description TEXT, cover_image_url VARCHAR(1000), status VARCHAR(20) DEFAULT 'draft' NOT NULL, is_public BOOLEAN DEFAULT TRUE NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL, updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL)`));
  results.push(await run(db, "CREATE TABLE story_blocks",
    db.execute`CREATE TABLE IF NOT EXISTS story_blocks (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE, type VARCHAR(30) NOT NULL, content TEXT NOT NULL, media_url VARCHAR(1000), media_type VARCHAR(20), order_index INTEGER NOT NULL)`));
  results.push(await run(db, "CREATE TABLE courses",
    db.execute`CREATE TABLE IF NOT EXISTS courses (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, title VARCHAR(200) NOT NULL, description TEXT, cover_image_url VARCHAR(1000), status VARCHAR(20) DEFAULT 'draft' NOT NULL, is_public BOOLEAN DEFAULT TRUE NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL, updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL)`));
  results.push(await run(db, "CREATE TABLE course_activities",
    db.execute`CREATE TABLE IF NOT EXISTS course_activities (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE, type VARCHAR(30) NOT NULL, title VARCHAR(200) NOT NULL, content_url VARCHAR(1000), order_index INTEGER NOT NULL, required BOOLEAN DEFAULT TRUE NOT NULL)`));

  return NextResponse.json({ results });
}
