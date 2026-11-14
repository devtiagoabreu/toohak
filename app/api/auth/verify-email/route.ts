import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verificationTokens, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json({ error: "Token e email são obrigatórios" }, { status: 400 });
    }

    const verificationToken = await getDb().query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.token, token),
        eq(verificationTokens.identifier, email)
      ),
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Token expirado" }, { status: 400 });
    }

    await getDb().update(users).set({ emailVerified: true }).where(eq(users.email, email));
    await getDb().delete(verificationTokens).where(eq(verificationTokens.id, verificationToken.id));

    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/auth/login?verified=1`);
  } catch (err: any) {
    console.error("Verify email error:", err);
    return NextResponse.json({ error: "Erro interno ao verificar email" }, { status: 500 });
  }
}
