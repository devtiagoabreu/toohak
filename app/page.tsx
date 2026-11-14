import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

const featureGrid = [
  {
    color: "#7612FA",
    title: "Quizzes em Tempo Real",
    description: "Crie salas ao vivo e veja o placar atualizar instantaneamente para todos os participantes.",
  },
  {
    color: "#0091FF",
    title: "4 Blocos Coloridos",
    description: "Vermelho triângulo, azul losango, amarelo círculo e verde quadrado — toque rápido e certeiro.",
  },
  {
    color: "#FF007A",
    title: "Modo Equipe",
    description: "Divida os jogadores em times e promova colaboração estratégica entre grupos.",
  },
  {
    color: "#FFC107",
    title: "Desafio Assíncrono",
    description: "Gere um link para o quiz rodar sozinho. Os jogadores entram quando quiserem.",
  },
  {
    color: "#202020",
    title: "Relatórios Detalhados",
    description: "Exporte Excel/CSV com aproveitamento por aluno, tempo de resposta e taxa de erro por pergunta.",
  },
  {
    color: "#00D084",
    title: "White Label",
    description: "Insira o logotipo da sua escola ou empresa nas telas de carregamento e relatórios.",
  },
];

const stepGrid = [
  {
    number: "1",
    color: "#FF007A",
    title: "Crie seu quiz",
    description: "Monte perguntas com 4 alternativas coloridas, adicione imagens e defina o tempo.",
  },
  {
    number: "2",
    color: "#7612FA",
    title: "Abra a sala",
    description: "Gere um código de sala. Os jogadores entram pelo celular ou tablet.",
  },
  {
    number: "3",
    color: "#0091FF",
    title: "Jogue ao vivo",
    description: "Responda rápido, suba no pódio e acompanhe o placar em tempo real na tela grande.",
  },
];

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-app)" }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <Link href="/" className="navbar-brand" style={{ textDecoration: "none" }}>
            <span style={{ color: "#7612FA", fontWeight: "bold", marginRight: "4px" }}>too</span>
            <span style={{ color: "#202020", fontWeight: "bold" }}>hak</span>
          </Link>
          <div className="navbar-links">
            <Link href="/dashboard" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
              Painel
            </Link>
            <Link href="#funcionalidades" style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
              Funcionalidades
            </Link>
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}></span>
            <Button variant="primary" asChild href="/auth/register">
              Criar conta grátis
            </Button>
            <Button variant="outline" asChild href="/auth/login" style={{ marginLeft: "0.5rem" }}>
              Entrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #7612FA 0%, #202020 100%)",
          color: "#FFFFFF",
          padding: "4rem 1rem",
          textAlign: "center",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: "0.5rem 1rem",
              borderRadius: "9999px",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Plataforma de aprendizado gamificado
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: "700",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
              color: "#FFFFFF",
            }}
          >
            Aprendizado <br />
            <span style={{ color: "#FF007A" }}>gamificado</span> que funciona de verdade.
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "rgba(255,255,255,0.9)",
              maxWidth: "600px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.6,
            }}
          >
            Crie quizzes interativos, apresente na tela grande e veja os jogadores competirem em
            tempo real. 100% gratuito, sem planos pagos.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button variant="ai" asChild href="/auth/register" size="lg" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
              Começar agora grátis
            </Button>
            <Button variant="outline" asChild href="#como-funciona" size="lg" style={{ padding: "1rem 2rem", fontSize: "1.1rem", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.5)" }}>
              Como funciona
            </Button>
          </div>
        </div>
        {/* Elementos decorativos abstratos */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-10%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(255,0,122,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(0,145,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" style={{ padding: "4rem 1rem", backgroundColor: "#FFFFFF" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              Como funciona o Toohak
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Três passos simples para transformar qualquer aula ou apresentação em um jogo.
            </p>
          </div>
          <div className="grid grid-cols-3" style={{ gap: "1.5rem" }}>
            {stepGrid.map((step) => (
              <Card key={step.number} variant="sm">
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: step.color,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                    marginBottom: "1rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {step.number}
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "650", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                  {step.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" style={{ padding: "4rem 1rem", backgroundColor: "var(--bg-app)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
              Funcionalidades
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Tudo que você precisa para criar apresentações interativas envolventes.
            </p>
          </div>
          <div className="grid grid-cols-3" style={{ gap: "1.5rem" }}>
            {featureGrid.map((feature) => (
              <Card key={feature.title}>
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: feature.color,
                    borderRadius: "12px",
                    marginBottom: "1rem",
                  }}
                />
                <h3 style={{ fontSize: "1.125rem", fontWeight: "650", marginBottom: "0.5rem", color: "var(--text-primary)" }}>
                  {feature.title}
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.5, marginBottom: "1rem" }}>
                  {feature.description}
                </p>
                <Link href="#funcionalidades" style={{ color: "#0091FF", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}>
                  Saiba mais →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section
        style={{
          padding: "4rem 1rem",
          textAlign: "center",
        }}
      >
        <div className="container">
          <Card variant="lg" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "var(--text-primary)" }}>
              Pronto para começar?
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", marginBottom: "2rem", lineHeight: 1.6 }}>
              Cadastre-se gratuitamente e crie seu primeiro quiz em menos de 2 minutos.
            </p>
            <Button variant="ai" asChild href="/auth/register" size="lg" style={{ width: "100%", padding: "1rem" }}>
              Criar conta grátis
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem 1rem",
          borderTop: "1px solid var(--border-light)",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div className="navbar-brand" style={{ fontSize: "1.25rem" }}>
              <span style={{ color: "#7612FA", fontWeight: "bold", marginRight: "4px" }}>too</span>
              <span style={{ color: "#202020", fontWeight: "bold" }}>hak</span>
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              Toohak — Aprendizado gamificado. 100% gratuito.
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              <Link href="#" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Privacidade</Link>
              <Link href="#" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Termos</Link>
              <Link href="#" style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
