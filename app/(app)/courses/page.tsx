import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ArrowUpRight, BookOpen, Clock3, MoreHorizontal, Play, Plus, Video } from "lucide-react";

function FileGlyph() { return <span className="file-glyph">✦</span>; }

type CourseItem = {
  id: string;
  title: string;
  description: string;
  progress: number;
  activities: number;
  duration: string;
  tone: string;
  status: "published" | "draft";
  updatedAt: string;
};

const kindColor: Record<string, string> = { course: "blue" };

function formatUpdatedAt(value: unknown): string {
  if (!value) return "";
  const d = new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }).replace(":", "h");
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

async function fetchCourses(): Promise<CourseItem[]> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "";
  try {
    const res = await fetch(`${base}/api/courses`, { cache: "no-store" });
    if (!res.ok) throw new Error("falha");
    const data = await res.json();
    return (data.courses || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description || "",
      progress: c.progress ?? 0,
      activities: c.activities ?? 0,
      duration: c.duration ?? "30 min",
      tone: c.tone ?? "blue",
      status: c.status ?? "draft",
      updatedAt: formatUpdatedAt(c.updatedAt),
    }));
  } catch {
    return [];
  }
}

export default async function Courses() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  const demoCourses = [
    { id: "demo-1", title: "Onboarding em 10 minutos", description: "O essencial para começar bem e trabalhar com autonomia.", progress: 48, activities: 6, duration: "32 min", tone: "violet", status: "Rascunho" },
    { id: "demo-2", title: "Cultura de feedback", description: "Práticas leves para conversas mais claras e produtivas.", progress: 100, activities: 8, duration: "45 min", tone: "mint", status: "Publicado" },
    { id: "demo-3", title: "Produto para não especialistas", description: "Uma visão compartilhada de como decisões viram valor.", progress: 72, activities: 5, duration: "28 min", tone: "coral", status: "Publicado" },
  ];

  const courses = userId ? await fetchCourses() : demoCourses;

  return (
    <div className="courses-page">
      <div className="page-title-row">
        <div>
          <div className="eyebrow">TRILHAS DE APRENDIZAGEM</div>
          <h1>Cursos</h1>
          <p className="page-lede">Combine conteúdos em experiências que evoluem com as pessoas.</p>
        </div>
        <Link href="/courses?new=1" className="create-button"><Plus size={18} /> Criar curso</Link>
      </div>
      <div className="course-intro">
        <div>
          <span className="intro-kicker">UMA TRILHA, VÁRIOS MOMENTOS</span>
          <h2>De uma ideia solta<br /><em>a uma jornada que fica.</em></h2>
          <p>Costure quizzes, histórias, vídeos e documentos em uma sequência que faz sentido para o seu público.</p>
        </div>
        <div className="intro-stack">
          <div className="stack-card back"><FileGlyph /></div>
          <div className="stack-card middle"><Video size={28} /></div>
          <div className="stack-card front"><BookOpen size={30} /><span>08<br /><small>atividades</small></span></div>
        </div>
      </div>
      <div className="course-section-head">
        <div>
          <span className="eyebrow">SEU ESPAÇO</span>
          <h2>Trilhas em andamento</h2>
        </div>
        <button className="text-button">Ordenar <ArrowUpRight size={15} /></button>
      </div>
      <div className="course-grid">
        {courses.map(course => (
          <article className="course-card" key={course.id}>
            <div className={`course-cover ${course.tone}`}>
              <span className="course-status">{course.status}</span>
              <div className="course-cover-mark">{course.title.slice(0, 1)}</div>
              <button className="cover-more"><MoreHorizontal size={18} /></button>
            </div>
            <div className="course-body">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-meta">
                <span><BookOpen size={14} /> {course.activities} atividades</span>
                <span><Clock3 size={14} /> {course.duration}</span>
              </div>
              <div className="course-progress">
                <div><span>Progresso do conteúdo</span><strong>{course.progress}%</strong></div>
                <div className="progress-track"><i style={{ width: `${course.progress}%` }} /></div>
              </div>
              <div className="course-footer">
                <button className="secondary-button small"><Play size={14} /> Abrir curso</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
