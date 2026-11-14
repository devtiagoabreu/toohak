import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const user = session as any;

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">Toohak</div>
          <div className="navbar-links">
            <a href="/dashboard" style={{ color: "#0091FF", fontWeight: 600 }}>
              Painel
            </a>
            <a href="/quizzes">Meus Quizzes</a>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              {user.email}
            </span>
            <a href="/api/auth/signout" style={{ color: "#DC2626", fontWeight: 500 }}>
              Sair
            </a>
          </div>
        </div>
      </nav>

      <div className="container" style={{ marginTop: "2rem" }}>
        <div className="page-header">
          <h1>Painel de Controle</h1>
          <p>Bem-vindo de volta, {user.name || user.email}</p>
        </div>

        <div className="grid grid-cols-2" style={{ marginTop: "1.5rem" }}>
          <Card>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "650", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Criar Quiz
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Crie um novo quiz interativo com perguntas e alternativas.
            </p>
            <Button variant="primary" asChild fullWidth>
              <Link href="/quiz/create">Criar novo quiz</Link>
            </Button>
          </Card>
          <Card>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "650", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Minhas Configurações
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Configure SMTP, chaves de IA e perfil.
            </p>
            <Button variant="secondary" asChild fullWidth>
              <Link href="/settings">Acessar configurações</Link>
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
