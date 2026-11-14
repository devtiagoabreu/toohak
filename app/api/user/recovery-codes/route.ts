import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { recoveryCodes, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const codes = await getDb().query.recoveryCodes.findMany({
      where: eq(recoveryCodes.userId, userId),
    });

    return NextResponse.json({ codes: codes.map((c: { code: string }) => c.code) });
  } catch (err: any) {
    console.error("Recovery codes error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
