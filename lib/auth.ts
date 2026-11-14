import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { users, verificationTokens } from "@/db/schema";
import { createSystemTransporter } from "@/lib/email";
import { compare } from "bcryptjs";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email e senha são obrigatórios");
      }

      const db = getDb();
      const user = await db.query.users.findFirst({
        where: eq(users.email, credentials.email),
      });

      if (!user || !user.passwordHash) {
        throw new Error("Email ou senha inválidos");
      }

      if (!user.emailVerified) {
        throw new Error("Email não verificado. Verifique sua caixa de entrada.");
      }

      const isValid = await compare(credentials.password, user.passwordHash);
      if (!isValid) {
        throw new Error("Email ou senha inválidos");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

// Adiciona EmailProvider apenas se as variáveis de SMTP estiverem configuradas
if (process.env.SYSTEM_EMAIL_USER && process.env.SYSTEM_EMAIL_PASSWORD) {
  const EmailProvider = (await import("next-auth/providers/email")).default;
  providers.push(
    EmailProvider({
      server: createSystemTransporter(),
      from: `"Toohak" <${process.env.SYSTEM_EMAIL_USER}>`,
      async sendVerificationRequest(params) {
        const { identifier: email, token, url } = params;

        const db = getDb();
        await db.insert(verificationTokens).values({
          identifier: email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        await sendEmail(createSystemTransporter(), {
          to: email,
          subject: "Confirme seu email - Toohak",
          html: `
            <h1>Bem-vindo ao Toohak!</h1>
            <p>Clique no link abaixo para confirmar seu email:</p>
            <a href="${url}" style="background:#007bff;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;">Confirmar Email</a>
            <p>O link expira em 24 horas.</p>
          `,
        });
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
};

async function sendEmail(transporter: any, options: any) {
  await transporter.sendMail({
    from: `"Toohak" <${process.env.SYSTEM_EMAIL_USER || "noreply@toohak.local"}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
