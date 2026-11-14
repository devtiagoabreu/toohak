import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
      <div className="container">
        <div className="page-header">
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem", color: "var(--text-primary)" }}>
            Bem-vindo ao Toohak
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "2rem" }}>
            Plataforma de aprendizado gamificado e apresentações interativas
          </p>
        </div>

        <div className="grid grid-cols-2" style={{ gap: "2rem" }}>
          <Card variant="lg">
            <h3 style={{ fontSize: "1.25rem", fontWeight: "650", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              O que é o Toohak?
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Toohak é uma plataforma gratuita para criar quizzes interativos e
              apresentações gamificadas. Crie salas ao vivo, convide participantes
              por código e acompanhe o placar em tempo real.
            </p>
            <Button variant="ai" fullWidth asChild>
              <Link href="/auth/register">Começar agora</Link>
            </Button>
          </Card>
          <Card variant="lg">
            <h3 style={{ fontSize: "1.25rem", fontWeight: "650", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              Funcionalidades
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "var(--text-secondary)" }}>
              <li style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#0091FF", fontWeight: "bold" }}>•</span>
                Quizzes interativos em tempo real
              </li>
              <li style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#0091FF", fontWeight: "bold" }}>•</span>
                Placar e pódio automático
              </li>
              <li style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#0091FF", fontWeight: "bold" }}>•</span>
                Tela do apresentador e do jogador
              </li>
              <li style={{ marginBottom: "0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#0091FF", fontWeight: "bold" }}>•</span>
                100% gratuito
              </li>
            </ul>
          </Card>
        </div>

        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <Button variant="primary" fullWidth style={{ maxWidth: "300px", margin: "0 auto", display: "block" }} asChild>
            <Link href="/auth/register">Criar conta gratuita</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
