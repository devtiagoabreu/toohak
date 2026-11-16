import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { desc, eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { options, questions, quizzes } from "@/db/schema";

type InputOption = { text: string; correct?: boolean; colorCode?: string };
type InputQuestion = {
  type: string;
  prompt: string;
  timeLimit: number;
  points: number;
  note?: string;
  mediaUrl?: string;
  mediaType?: string;
  answers: InputOption[];
};

async function getUserId() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const rows = await getDb().query.quizzes.findMany({
      where: eq(quizzes.userId, userId),
      orderBy: [desc(quizzes.updatedAt)],
    });
    return NextResponse.json({ quizzes: rows });
  } catch (err) {
    console.error("GET /api/quizzes error", err);
    return NextResponse.json({ error: "Erro ao listar quizzes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const body = await req.json();
    const title = (body.title || "Quiz sem título").toString().slice(0, 200);
    const description = body.description ? body.description.toString() : null;
    const coverImageUrl = body.coverImageUrl ? body.coverImageUrl.toString() : null;
    const status = body.status === "published" ? "published" : "draft";
    const isPublic = body.isPublic !== false;
    const qs: InputQuestion[] = Array.isArray(body.questions) ? body.questions : [];

    const db = getDb();
    const [quiz] = await db.insert(quizzes).values({
      userId, title, description, coverImageUrl, status, isPublic, updatedAt: new Date(),
    }).returning();

    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const [insertedQ] = await db.insert(questions).values({
        quizId: quiz.id,
        type: (q.type || "multiple-choice").toString(),
        questionText: (q.prompt || "").toString(),
        timeLimit: Number(q.timeLimit) || 30,
        pointsMultiplier: Number(q.points) || 0,
        orderIndex: i,
        mediaUrl: q.mediaUrl ? q.mediaUrl.toString() : null,
        mediaType: q.mediaType ? q.mediaType.toString() : null,
        note: q.note ? q.note.toString() : null,
      }).returning();
      const ans = Array.isArray(q.answers) ? q.answers : [];
      if (ans.length) {
        await db.insert(options).values(ans.map((a, idx) => ({
          questionId: insertedQ.id,
          optionText: (a.text || "").toString(),
          isCorrect: !!a.correct,
          colorCode: a.colorCode || null,
          orderIndex: idx,
        })));
      }
    }

    return NextResponse.json({ quiz });
  } catch (err) {
    console.error("POST /api/quizzes error", err);
    return NextResponse.json({ error: "Erro ao criar quiz" }, { status: 500 });
  }
}
