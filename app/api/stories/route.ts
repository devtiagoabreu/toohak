import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { desc, eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { stories, storyBlocks } from "@/db/schema";

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const rows = await getDb().query.stories.findMany({
      where: eq(stories.userId, userId),
      orderBy: [desc(stories.updatedAt)],
    });
    return NextResponse.json({ stories: rows });
  } catch (err) {
    console.error("GET /api/stories error", err);
    return NextResponse.json({ error: "Erro ao listar histórias" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const body = await req.json();
    const title = (body.title || "História sem título").toString().slice(0, 200);
    const description = body.description ? body.description.toString() : null;
    const coverImageUrl = body.coverImageUrl ? body.coverImageUrl.toString() : null;
    const status = body.status === "published" ? "published" : "draft";
    const isPublic = body.isPublic !== false;
    const blocks = Array.isArray(body.blocks) ? body.blocks : [];

    const db = getDb();
    const [story] = await db.insert(stories).values({
      userId, title, description, coverImageUrl, status, isPublic, updatedAt: new Date(),
    }).returning();

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      await db.insert(storyBlocks).values({
        storyId: story.id,
        type: (b.type || "text").toString(),
        content: (b.content || "").toString(),
        mediaUrl: b.mediaUrl ? b.mediaUrl.toString() : null,
        mediaType: b.mediaType ? b.mediaType.toString() : null,
        orderIndex: i,
      });
    }

    return NextResponse.json({ story });
  } catch (err) {
    console.error("POST /api/stories error", err);
    return NextResponse.json({ error: "Erro ao criar história" }, { status: 500 });
  }
}
