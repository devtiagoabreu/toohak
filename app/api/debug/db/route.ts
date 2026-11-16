import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { quizzes } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const info: any = {
    env: {
      DATABASE_URL: !!process.env.DATABASE_URL ? "set" : "MISSING",
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? "set" : "MISSING",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "MISSING",
    },
    db: null as any,
    session: null as any,
    error: null as string | null,
  };

  try {
    const session = await getServerSession(authOptions);
    info.session = {
      authenticated: !!session,
      userId: (session?.user as any)?.id || null,
      userEmail: (session?.user as any)?.email || null,
    };

    const db = getDb();
    const rows = await db.select().from(quizzes).limit(1);
    info.db = { connected: true, quizCount: rows.length };

    // Nao usa db.execute (incompatível com essa versao do driver Neon)
    info.db.columnsNote = "use Neon SQL Editor para verificar colunas";
  } catch (err: any) {
    info.error = err.message;
    info.stack = err.stack;
  }

  return NextResponse.json(info);
}
