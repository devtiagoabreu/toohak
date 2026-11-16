import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { quizzes, stories, courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

type LibraryItem = {
  id: string;
  title: string;
  kind: "quiz" | "story" | "course";
  status: "published" | "draft" | "shared";
  updatedAt: string;
  plays: number;
  color: string;
  description: string;
};

const kindColor: Record<string, string> = { quiz: "coral", story: "mint", course: "blue" };

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const db = getDb();
    const [qRows, sRows, cRows] = await Promise.all([
      db.query.quizzes.findMany({ where: eq(quizzes.userId, userId), orderBy: [desc(quizzes.updatedAt)] }),
      db.query.stories.findMany({ where: eq(stories.userId, userId), orderBy: [desc(stories.updatedAt)] }),
      db.query.courses.findMany({ where: eq(courses.userId, userId), orderBy: [desc(courses.updatedAt)] }),
    ]);

    const items: LibraryItem[] = [
      ...qRows.map((q: any) => ({
        id: q.id,
        title: q.title,
        kind: "quiz",
        status: (q.status as any) ?? "draft",
        updatedAt: q.updatedAt ? new Date(q.updatedAt).toISOString() : new Date().toISOString(),
        plays: 0,
        color: kindColor.quiz,
        description: q.description || "",
      })),
      ...sRows.map((s: any) => ({
        id: s.id,
        title: s.title,
        kind: "story",
        status: (s.status as any) ?? "draft",
        updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : new Date().toISOString(),
        plays: 0,
        color: kindColor.story,
        description: s.description || "",
      })),
      ...cRows.map((c: any) => ({
        id: c.id,
        title: c.title,
        kind: "course",
        status: (c.status as any) ?? "draft",
        updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
        plays: 0,
        color: kindColor.course,
        description: c.description || "",
      })),
    ];

    items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/library error", err);
    return NextResponse.json({ error: "Erro ao carregar biblioteca" }, { status: 500 });
  }
}
