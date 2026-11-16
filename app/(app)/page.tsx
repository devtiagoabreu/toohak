import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { quizzes, stories, courses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ArrowUpRight, BookOpen, FileText, Play, Plus, Sparkles, UploadCloud, UsersRound } from "lucide-react";
import { demoContent } from "@/lib/data";

const quickActions = [
  { title: "Começar do zero", detail: "Monte perguntas em poucos passos", href: "/create", icon: Plus, tone: "coral" },
  { title: "Gerar com assistente", detail: "Transforme um tema em um rascunho", href: "/create?mode=ai", icon: Sparkles, tone: "violet", badge: "IA" },
  { title: "Importar material", detail: "Use um PDF, texto ou apresentação", href: "/create?mode=import", icon: UploadCloud, tone: "blue", badge: "NOVO" },
];

type HomeItem = {
  id: string;
  title: string;
  kind: "quiz" | "story" | "course";
  status: "published" | "draft" | "shared";
  updatedAt: string;
  plays: number;
  color: string;
  description: string;
};

const kindColor: Record<string, string> = { quiz: "coral", story: "mint", course: "blue" };

function formatUpdatedAt(value: unknown): string {
  if (!value) return "";
  const d = new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h");
  }
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

async function getHomeItems(userId: string): Promise<HomeItem[]> {
  const db = getDb();
  const [qRows, sRows, cRows] = await Promise.all([
    db.query.quizzes.findMany({ where: eq(quizzes.userId, userId), orderBy: [desc(quizzes.updatedAt)] }),
    db.query.stories.findMany({ where: eq(stories.userId, userId), orderBy: [desc(stories.updatedAt)] }),
    db.query.courses.findMany({ where: eq(courses.userId, userId), orderBy: [desc(courses.updatedAt)] }),
  ]);

  const items: HomeItem[] = [
    ...qRows.map((q: any) => ({
      id: q.id,
      title: q.title,
      kind: "quiz",
      status: (q.status as any) ?? "draft",
      updatedAt: formatUpdatedAt(q.updatedAt),
      plays: 0,
      color: kindColor.quiz,
      description: q.description || "",
    })),
    ...sRows.map((s: any) => ({
      id: s.id,
      title: s.title,
      kind: "story",
      status: (s.status as any) ?? "draft",
      updatedAt: formatUpdatedAt(s.updatedAt),
      plays: 0,
      color: kindColor.story,
      description: s.description || "",
    })),
    ...cRows.map((c: any) => ({
      id: c.id,
      title: c.title,
      kind: "course",
      status: (c.status as any) ?? "draft",
      updatedAt: formatUpdatedAt(c.updatedAt),
      plays: 0,
      color: kindColor.course,
      description: c.description || "",
    })),
  ];

  return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  let items: HomeItem[] = [];
  let totalPlays = 0;

  if (userId) {
    try {
      items = await getHomeItems(userId);
      totalPlays = items.reduce((acc, it) => acc + it.plays, 0);
    } catch {
      items = [];
      totalPlays = 0;
    }
  }

  const recentItems = items.length ? items.slice(0, 3) : demoContent.slice(0, 3);
  const hasRealData = items.length > 0;

  return (
    <div className="dashboard-page">
      <section className="hero-row">
        <div>
          <div className="eyebrow">QUARTA-FEIRA, 14 DE NOVEMBRO</div>
          <h1>Faça a aprendizagem <em>ganhar ritmo.</em></h1>
          <p className="hero-copy">Crie experiências que fazem as pessoas pensar, conversar e lembrar — no seu tempo e do seu jeito.</p>
        </div>
        <div className="hero-illustration" aria-hidden="true">
          <div className="orb orb-a" /><div className="orb orb-b" />
          <div className="hero-note"><span>01</span><strong>Ideia → interação</strong><small>Um bom encontro começa com uma boa pergunta.</small></div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <div className="eyebrow">COMECE AQUI</div>
            <h2>O que você quer criar?</h2>
          </div>
          <Link href="/library" className="text-link">Ver tudo <ArrowUpRight size={16} /></Link>
        </div>
        <div className="quick-grid">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Link
                href={action.href}
                className={`quick-card ${action.tone}`}
                key={action.title}
              >
                <div className="quick-icon"><Icon size={21} /></div>
                {action.badge && <span className="card-badge">{action.badge}</span>}
                <h3>{action.title}</h3>
                <p>{action.detail}</p>
                <span className="quick-arrow"><ArrowUpRight size={18} /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="split-section">
        <div className="section-block recent-block">
          <div className="section-heading">
            <div>
              <div className="eyebrow">MOVIMENTO RECENTE</div>
              <h2>Seus conteúdos</h2>
            </div>
            <Link href="/library" className="text-link">Abrir biblioteca <ArrowUpRight size={16} /></Link>
          </div>
          <div className="content-list">
            {recentItems.map(item => (
              <Link
                href={item.kind === "quiz" ? `/create?id=${item.id}` : `/courses`}
                className="content-row"
                key={item.id}
              >
                <div className={`content-thumb ${item.color}`}>
                  <span>{item.kind === "quiz" ? "Q" : item.kind === "story" ? "S" : "C"}</span>
                </div>
                <div className="content-row-copy">
                  <strong>{item.title}</strong>
                  <span>{item.kind === "quiz" ? "Quiz" : item.kind === "story" ? "História" : "Curso"} · {item.updatedAt}</span>
                </div>
                <span className={`status-dot ${item.status}`} />
                <span className="content-plays">{item.plays ? `${item.plays} sessões` : "Rascunho"}</span>
                <ArrowUpRight size={16} className="row-arrow" />
              </Link>
            ))}
          </div>
        </div>

        <aside className="insight-card">
          <div className="insight-top">
            <div className="insight-icon">
              <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
                <path d="M5 31V21M14 31V13M23 31V18M32 31V7" stroke="currentColor" strokeWidth={4} strokeLinecap="round" />
              </svg>
            </div>
            <span>ESTA SEMANA</span>
          </div>
          <h3>Seu espaço está<br /><em>em movimento.</em></h3>
          <p>{totalPlays} pessoas passaram por uma experiência criada por você.</p>
          <div className="mini-chart">
            <span style={{ height: "30%" }} />
            <span style={{ height: "48%" }} />
            <span style={{ height: "35%" }} />
            <span style={{ height: "67%" }} />
            <span style={{ height: "56%" }} />
            <span style={{ height: "82%" }} />
            <span style={{ height: "100%" }} />
          </div>
          <Link href="/reports" className="insight-link">Ver meus relatórios <ArrowUpRight size={16} /></Link>
        </aside>
      </section>

      <section className="callout-row">
        <div className="callout-icon"><UsersRound size={20} /></div>
        <div>
          <strong>Convide sua equipe para criar junto</strong>
          <p>Compartilhe um espaço de trabalho e transforme ideias isoladas em experiências coletivas.</p>
        </div>
        <button className="secondary-button">Convidar pessoas <ArrowUpRight size={16} /></button>
      </section>

      {!hasRealData && userId && (
        <div className="eyebrow" style={{ marginTop: 24, color: "var(--muted)" }}>
          Nenhum conteúdo ainda. Crie seu primeiro quiz, história ou curso.
        </div>
      )}
    </div>
  );
}
