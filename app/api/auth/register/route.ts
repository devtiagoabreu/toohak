import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getDb } from "@/lib/db";
import { users, verificationTokens } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createSystemTransporter, sendEmail } from "@/lib/email";
import { generateRecoveryCodes } from "@/lib/utils";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Nome, email e senha são obrigatórios" }, { status: 400 });
    }

    const existingUser = await getDb().query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);

    const [newUser] = await getDb().insert(users).values({
      name,
      email,
      passwordHash,
      emailVerified: false,
    }).returning();

    const token = crypto.randomUUID();

    await getDb().insert(verificationTokens).values({
      identifier: email,
      token,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail(createSystemTransporter(), {
      to: email,
      subject: "Confirme seu email - Toohak",
      html: `
        <h1>Bem-vindo ao Toohak!</h1>
        <p>Olá ${name}, clique no link abaixo para confirmar seu email:</p>
        <a href="${verificationUrl}" style="background:#007bff;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">Confirmar Email</a>
        <p>O link expira em 24 horas.</p>
        <p>Se você não se cadastrou no Toohak, ignore este email.</p>
      `,
    });

    await generateRecoveryCodes(newUser.id);

    return NextResponse.json({ success: true, message: "Conta criada com sucesso. Verifique seu email." });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Erro interno ao cadastrar usuário" }, { status: 500 });
  }
}
