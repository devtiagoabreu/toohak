import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { and, asc, eq } from "drizzle-orm";
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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const db = getDb();
    const quiz = await db.query.quizzes.findFirst({ where: and(eq(quizzes.id, params.id), eq(quizzes.userId, userId)) });
    if (!quiz) return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    const qs = await db.query.questions.findMany({ where: eq(questions.quizId, quiz.id), orderBy: [asc(questions.orderIndex)] });
    const qsWithOptions = [] as any[];
    for (const q of qs) {
      const opts = await db.query.options.findMany({ where: eq(options.questionId, q.id), orderBy: [asc(options.orderIndex)] });
      qsWithOptions.push({ ...q, options: opts });
    }
    return NextResponse.json({ quiz: { ...quiz, questions: qsWithOptions } });
  } catch (err) {
    console.error("GET /api/quizzes/[id] error", err);
    return NextResponse.json({ error: "Erro ao carregar quiz" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const db = getDb();
    const existing = await db.query.quizzes.findFirst({ where: and(eq(quizzes.id, params.id), eq(quizzes.userId, userId)) });
    if (!existing) return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    const body = await req.json();
    const title = (body.title || existing.title).toString().slice(0, 200);
    const description = body.description !== undefined ? (body.description ? body.description.toString() : null) : existing.description;
    const coverImageUrl = body.coverImageUrl !== undefined ? (body.coverImageUrl ? body.coverImageUrl.toString() : null) : (existing as any).coverImageUrl;
    const status = body.status === "published" ? "published" : body.status === "draft" ? "draft" : existing.status;
    const isPublic = body.isPublic !== undefined ? !!body.isPublic : existing.isPublic;
    const qs: InputQuestion[] = Array.isArray(body.questions) ? body.questions : [];

    await db.update(quizzes).set({ title, description, coverImageUrl, status, isPublic, updatedAt: new Date() }).where(eq(quizzes.id, params.id));
    await db.delete(questions).where(eq(questions.quizId, params.id));

    for (let i = 0; i < qs.length; i++) {
      const q = qs[i];
      const [insertedQ] = await db.insert(questions).values({
        quizId: params.id,
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PUT /api/quizzes/[id] error", err);
    return NextResponse.json({ error: "Erro ao salvar quiz" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    const db = getDb();
    const existing = await db.query.quizzes.findFirst({ where: and(eq(quizzes.id, params.id), eq(quizzes.userId, userId)) });
    if (!existing) return NextResponse.json({ error: "Quiz não encontrado" }, { status: 404 });
    await db.delete(quizzes).where(eq(quizzes.id, params.id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/quizzes/[id] error", err);
    return NextResponse.json({ error: "Erro ao excluir quiz" }, { status: 500 });
  }
}
