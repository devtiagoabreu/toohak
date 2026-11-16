import { ArrowDownRight, ArrowUpRight, BarChart3, CheckCircle2, ChevronDown, Download, Filter, MoreHorizontal, UsersRound } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { quizzes, stories, courses } from "@/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";

function Metric({ label, value, change, positive, icon }: { label: string; value: string; change: string; positive: boolean; icon: React.ReactNode }) {
  return (
    <div className="metric-card">
      <div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div>
      <strong>{value}</strong>
      <span className={positive ? "metric-change positive" : "metric-change negative"}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {change} <small>vs. período anterior</small>
      </span>
    </div>
  );
}

async function getReportsData() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const demoMetrics = [
    { label: "Participantes", value: "863", change: "18,4%", positive: true, icon: <UsersRound size={19} /> },
    { label: "Taxa de conclusão", value: "93,2%", change: "6,8%", positive: true, icon: <CheckCircle2 size={19} /> },
    { label: "Precisão média", value: "81,6%", change: "3,2%", positive: true, icon: <BarChart3 size={19} /> },
    { label: "Perguntas difíceis", value: "12", change: "2", positive: false, icon: <span className="metric-star">✦</span> },
  ];

  const demoRows = [
    { name: "Fundamentos de colaboração", participants: 248, accuracy: 82, completion: 96, date: "Hoje" },
    { name: "Segurança sem complicação", participants: 531, accuracy: 74, completion: 91, date: "10 nov" },
    { name: "A voz do cliente", participants: 84, accuracy: 88, completion: 100, date: "12 nov" },
  ];

  if (!userId) return { metrics: demoMetrics, rows: demoRows };

  try {
    const db = getDb();
    const [quizCount, storyCount, courseCount] = await Promise.all([
      db.select({ count: count() }).from(quizzes).where(eq(quizzes.userId, userId)),
      db.select({ count: count() }).from(stories).where(eq(stories.userId, userId)),
      db.select({ count: count() }).from(courses).where(eq(courses.userId, userId)),
    ]);

    const totalContent = quizCount[0].count + storyCount[0].count + courseCount[0].count;

    const metrics = [
      { label: "Conteúdos criados", value: String(totalContent), change: "0", positive: true, icon: <UsersRound size={19} /> },
      { label: "Quizzes", value: String(quizCount[0].count), change: "0", positive: true, icon: <BarChart3 size={19} /> },
      { label: "Histórias", value: String(storyCount[0].count), change: "0", positive: true, icon: <CheckCircle2 size={19} /> },
      { label: "Cursos", value: String(courseCount[0].count), change: "0", positive: true, icon: <span className="metric-star">✦</span> },
    ];

    const recentQuizzes = await db.query.quizzes.findMany({
      where: eq(quizzes.userId, userId),
      orderBy: [desc(quizzes.updatedAt)],
      limit: 3,
    });

    const rows = recentQuizzes.map((q: any) => ({
      name: q.title,
      participants: 0,
      accuracy: 0,
      completion: 0,
      date: q.updatedAt ? new Date(q.updatedAt).toLocaleDateString("pt-BR") : "",
    }));

    return { metrics, rows: rows.length ? rows : demoRows };
  } catch {
    return { metrics: demoMetrics, rows: demoRows };
  }
}

export default async function Reports() {
  const { metrics, rows } = await getReportsData();

  return (
    <div className="reports-page">
      <div className="page-title-row">
        <div>
          <div className="eyebrow">ACOMPANHAMENTO</div>
          <h1>Relatórios</h1>
          <p className="page-lede">Entenda onde as pessoas avançaram — e onde vale voltar.</p>
        </div>
        <div className="title-actions">
          <button className="secondary-button"><Download size={16} /> Exportar</button>
          <button className="filter-button"><Filter size={16} /> Últimos 30 dias <ChevronDown size={15} /></button>
        </div>
      </div>
      <div className="report-tabs">
        <button className="active">Visão geral</button>
        <button>Ao vivo <span>8</span></button>
        <button>Atribuições <span>4</span></button>
        <button>Cursos</button>
      </div>
      <div className="metrics-grid">
        {metrics.map(m => (
          <Metric key={m.label} label={m.label} value={m.value} change={m.change} positive={m.positive} icon={m.icon} />
        ))}
      </div>
      <div className="reports-main-grid">
        <section className="chart-card">
          <div className="card-heading">
            <div>
              <span className="eyebrow">RITMO DE PARTICIPAÇÃO</span>
              <h2>Mais gente está chegando</h2>
            </div>
            <button className="icon-button"><MoreHorizontal size={19} /></button>
          </div>
          <div className="chart-summary">
            <strong>{metrics[0]?.value} <small>conteúdos</small></strong>
            <span className="positive-change"><ArrowUpRight size={15} /> 18,4% vs. período anterior</span>
          </div>
          <div className="line-chart">
            <div className="chart-y"><span>300</span><span>200</span><span>100</span><span>0</span></div>
            <div className="chart-area">
              <div className="grid-line one" />
              <div className="grid-line two" />
              <div className="grid-line three" />
              <svg viewBox="0 0 680 220" preserveAspectRatio="none" role="img" aria-label="Gráfico de participantes">
                <defs>
                  <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#eb6f5c" stopOpacity=".28" />
                    <stop offset="1" stopColor="#eb6f5c" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 188 C58 168 75 174 118 143 C165 109 184 145 224 118 C270 88 292 113 338 80 C389 44 409 93 450 68 C492 43 511 70 548 38 C588 8 627 36 680 12 L680 220 L0 220Z" fill="url(#fill)" />
                <path d="M0 188 C58 168 75 174 118 143 C165 109 184 145 224 118 C270 88 292 113 338 80 C389 44 409 93 450 68 C492 43 511 70 548 38 C588 8 627 36 680 12" fill="none" stroke="#eb6f5c" strokeWidth={4} strokeLinecap="round" />
              </svg>
              <div className="chart-x"><span>16 out</span><span>21 out</span><span>26 out</span><span>31 out</span><span>05 nov</span><span>10 nov</span><span>14 nov</span></div>
            </div>
          </div>
        </section>
        <section className="insight-panel">
          <div className="insight-panel-head">
            <span className="insight-spark">✦</span>
            <span>LEITURA RÁPIDA</span>
          </div>
          <h2>Onde agir agora</h2>
          <div className="insight-item">
            <div className="insight-number coral">01</div>
            <div>
              <strong>O que é um bom objetivo?</strong>
              <p>42% de acerto em Quiz de colaboração</p>
            </div>
            <ArrowDownRight size={17} />
          </div>
          <div className="insight-item">
            <div className="insight-number violet">02</div>
            <div>
              <strong>12 pessoas não concluíram</strong>
              <p>Onboarding em 10 minutos ontem</p>
            </div>
            <ArrowDownRight size={17} />
          </div>
          <button className="text-button">Ver todos os pontos de atenção <ArrowUpRight size={15} /></button>
        </section>
      </div>
      <section className="reports-table-card">
        <div className="card-heading">
          <div>
            <span className="eyebrow">ATIVIDADE</span>
            <h2>Desempenho por conteúdo</h2>
          </div>
          <button className="text-button">Ver histórico <ArrowUpRight size={15} /></button>
        </div>
        <div className="report-table">
          <div className="report-table-head">
            <span>Conteúdo</span>
            <span>Participantes</span>
            <span>Precisão</span>
            <span>Conclusão</span>
            <span>Quando</span>
            <span /></div>
          {rows.map((row: any) => (
            <div className="report-table-row" key={row.name}>
              <strong>{row.name}</strong>
              <span>{row.participants}</span>
              <div className="progress-cell"><span>{row.accuracy}%</span><div className="progress-track"><i style={{ width: `${row.accuracy}%` }} /></div></div>
              <div className="progress-cell"><span>{row.completion}%</span><div className="progress-track mint"><i style={{ width: `${row.completion}%` }} /></div></div>
              <span className="muted-text">{row.date}</span>
              <button className="icon-button"><MoreHorizontal size={18} /></button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
