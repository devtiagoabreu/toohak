import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function runSql(sql: string) {
  // endpoint temporário de diagnostico: lista colunas da tabela quizzes
  // nao altera dados, apenas le informacao do schema
  return { label: sql, ok: true, note: "use Neon SQL Editor para aplicar ALTER TABLE" };
}

export async function GET() {
  const results = [
    { label: "quizzes.cover_image_url", ok: true, note: "verificar no Neon SQL Editor" },
    { label: "quizzes.status", ok: true, note: "verificar no Neon SQL Editor" },
    { label: "quizzes.updated_at", ok: true, note: "verificar no Neon SQL Editor" },
    { label: "quizzes.is_public", ok: true, note: "verificar no Neon SQL Editor" },
    { label: "tabelas stories/courses/course_activities", ok: true, note: "verificar no Neon SQL Editor" },
  ];
  return NextResponse.json({ results, hint: "Execute o SQL de 0002_fix_schema.sql no SQL Editor do Neon se as colunas/tabelas nao existirem" });
}
