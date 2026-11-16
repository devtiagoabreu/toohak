import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { courses, courseActivities } from "@/db/schema";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const rows = await getDb().query.courses.findMany({
      where: eq(courses.userId, userId),
      orderBy: [desc(courses.updatedAt)],
    });
    return NextResponse.json({ courses: rows });
  } catch (err) {
    console.error("GET /api/courses error", err);
    return NextResponse.json({ error: "Erro ao listar cursos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const body = await req.json();
    const title = (body.title || "Curso sem título").toString().slice(0, 200);
    const description = body.description ? body.description.toString() : null;
    const coverImageUrl = body.coverImageUrl ? body.coverImageUrl.toString() : null;
    const status = body.status === "published" ? "published" : "draft";
    const isPublic = body.isPublic !== false;
    const activities = Array.isArray(body.activities) ? body.activities : [];

    const db = getDb();
    const [course] = await db.insert(courses).values({
      userId, title, description, coverImageUrl, status, isPublic, updatedAt: new Date(),
    }).returning();

    for (let i = 0; i < activities.length; i++) {
      const a = activities[i];
      await db.insert(courseActivities).values({
        courseId: course.id,
        type: (a.type || "quiz").toString(),
        title: (a.title || "Atividade").toString(),
        contentUrl: a.contentUrl ? a.contentUrl.toString() : null,
        orderIndex: i,
        required: a.required !== false,
      });
    }

    return NextResponse.json({ course });
  } catch (err) {
    console.error("POST /api/courses error", err);
    return NextResponse.json({ error: "Erro ao criar curso" }, { status: 500 });
  }
}
