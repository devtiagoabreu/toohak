"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ChevronDown, Clock3, Copy, ExternalLink, Eye, FileText, GripVertical, ImagePlus, MoreHorizontal, Plus, Save, Search, Sparkles, Trash2, Video, X } from "lucide-react";
import { demoQuestions, marineQuestions, type AnswerOption, type QuestionType, type QuizQuestion } from "@/lib/data";

const questionTypes: { id: QuestionType; label: string }[] = [
  { id: "multiple-choice", label: "Múltipla escolha" },
  { id: "true-false", label: "Verdadeiro ou falso" },
  { id: "poll", label: "Enquete" },
  { id: "open-ended", label: "Resposta aberta" },
  { id: "word-cloud", label: "Nuvem de palavras" },
];

const cloneQuestions = (source: QuizQuestion[]) => source.map(question => ({ ...question, answers: question.answers.map(answer => ({ ...answer })) }));

function toApiQuestions(questions: QuizQuestion[]) {
  return questions.map(q => ({
    type: q.type,
    prompt: q.prompt,
    timeLimit: q.timeLimit,
    points: q.points,
    note: q.note,
    mediaUrl: q.mediaUrl,
    mediaType: q.mediaType,
    answers: q.answers.map(a => ({ text: a.text, correct: !!a.correct })),
  }));
}

function CreateQuizInner() {
  const searchParams = useSearchParams();
  const isAi = searchParams.get("mode") === "ai";
  const editId = searchParams.get("id");
  const [quizId, setQuizId] = useState<string | null>(editId);
  const [title, setTitle] = useState(isAi ? "Animais marinhos — descobertas do oceano" : "Fundamentos de colaboração");
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => cloneQuestions(isAi ? marineQuestions : demoQuestions));
  const [activeId, setActiveId] = useState(() => (isAi ? marineQuestions[0].id : demoQuestions[0].id));
  const [saved, setSaved] = useState(isAi ? "Rascunho assistido pronto" : "Não salvo");
  const [preview, setPreview] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [mediaPicker, setMediaPicker] = useState<"image" | "video" | "file" | null>(null);
  const [mediaUrlInput, setMediaUrlInput] = useState("");
  const active = questions.find(question => question.id === activeId) ?? questions[0];

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quizzes/${editId}`);
        if (!res.ok) throw new Error("Falha ao carregar quiz");
        const data = await res.json();
        if (cancelled) return;
        const quiz = data.quiz;
        setTitle(quiz.title || "Quiz sem título");
        const mapped: QuizQuestion[] = (quiz.questions || []).map((q: any, idx: number) => ({
          id: q.id || `q-${idx}`,
          type: (q.type || "multiple-choice") as QuestionType,
          prompt: q.questionText || "",
          timeLimit: q.timeLimit || 30,
          points: q.pointsMultiplier || 0,
          note: q.note || "",
          mediaUrl: q.mediaUrl || "",
          mediaType: q.mediaType || undefined,
          answers: (q.options || []).map((o: any, i: number) => ({ id: o.id || `a-${idx}-${i}`, text: o.optionText || "", correct: !!o.isCorrect })),
        }));
        if (mapped.length) {
          setQuestions(mapped);
          setActiveId(mapped[0].id);
        }
        setSaved("Carregado");
      } catch {
        setSaved("Erro ao carregar (usando rascunho local)");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [editId]);

  const updateActive = (patch: Partial<QuizQuestion>) => setQuestions(current => current.map(question => question.id === active.id ? { ...question, ...patch } : question));
  const updateAnswer = (answerId: string, patch: Partial<AnswerOption>) => updateActive({ answers: active.answers.map(answer => answer.id === answerId ? { ...answer, ...patch } : answer) });
  const addQuestion = (type: QuestionType = "multiple-choice") => { const id = `q-${Date.now()}`; const baseAnswers = type === "true-false" ? [{ id: `${id}-1`, text: "Verdadeiro" }, { id: `${id}-2`, text: "Falso", correct: true }] : [{ id: `${id}-1`, text: "Nova resposta", correct: true }, { id: `${id}-2`, text: "Outra resposta" }]; const next: QuizQuestion = { id, type, prompt: "Escreva sua pergunta aqui", answers: baseAnswers, timeLimit: 30, points: type === "poll" || type === "open-ended" || type === "word-cloud" ? 0 : 1000 }; setQuestions(current => [...current, next]); setActiveId(id); setShowTypes(false); };
  const removeActive = () => { if (questions.length === 1) return; const next = questions.filter(question => question.id !== active.id); setQuestions(next); setActiveId(next[0].id); };
  const generateWithAi = () => { setTitle("Animais marinhos — descobertas do oceano"); setQuestions(cloneQuestions(marineQuestions)); setActiveId(marineQuestions[0].id); setSaved("Rascunho sobre animais marinhos gerado"); };
  const saveDraft = async () => {
    localStorage.setItem("toohak-draft", JSON.stringify({ title, questions }));
    setSaved("Salvando...");
    try {
      const payload = { title, description: null, status: "draft", questions: toApiQuestions(questions) };
      const res = quizId
        ? await fetch(`/api/quizzes/${quizId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/quizzes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("save failed");
      if (!quizId) {
        const data = await res.json();
        if (data.quiz?.id) { setQuizId(data.quiz.id); window.history.replaceState(null, "", `/create?id=${data.quiz.id}`); }
      }
      setSaved("Salvo no banco");
    } catch {
      setSaved("Salvo localmente (falha ao persistir)");
    }
  };

  const searchQuery = encodeURIComponent((active?.prompt || title || "").trim().slice(0, 120));
  const searchLinks = {
    google: searchQuery ? `https://www.google.com/search?q=${searchQuery}` : "",
    googleImages: searchQuery ? `https://www.google.com/search?tbm=isch&q=${searchQuery}` : "",
    pinterest: searchQuery ? `https://www.pinterest.com/search/pins/?q=${searchQuery}` : "",
  };

  const openMediaPicker = (type: "image" | "video" | "file") => { setMediaPicker(type); setMediaUrlInput(active?.mediaType === type ? (active?.mediaUrl || "") : ""); };
  const applyMedia = () => { if (!mediaPicker) return; updateActive({ mediaUrl: mediaUrlInput.trim() || undefined, mediaType: mediaUrlInput.trim() ? mediaPicker : undefined }); setMediaPicker(null); setMediaUrlInput(""); };

  if (!active) return null;
  if (loading) return <div className="editor-page"><div style={{ padding: 40 }}>Carregando quiz...</div></div>;

  return <div className="editor-page"><header className="editor-topbar"><div className="editor-breadcrumb"><Link href="/library">Biblioteca</Link><span>/</span><strong>{quizId ? "Editar quiz" : "Novo quiz"}</strong></div><div className="editor-actions"><span className="save-status"><span className="save-dot" /> {saved}</span><button className="secondary-button small" onClick={() => setPreview(true)}><Eye size={16} /> Visualizar</button><button className="primary-button small" onClick={saveDraft}><Save size={16} /> Salvar</button><button className="icon-button"><MoreHorizontal size={19} /></button></div></header><div className="editor-layout"><aside className="question-sidebar"><div className="editor-side-heading"><span>PERGUNTAS <b>{questions.length}</b></span><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="question-list">{questions.map((question, index) => <button key={question.id} className={`question-item ${question.id === active.id ? "active" : ""}`} onClick={() => setActiveId(question.id)}><GripVertical size={15} className="drag-icon" /><span className="question-number">{String(index + 1).padStart(2, "0")}</span><span className="question-item-copy"><strong>{question.prompt || "Sem título"}</strong><small>{questionTypes.find(type => type.id === question.type)?.label}</small></span><span className="question-item-check">{question.answers.some(answer => answer.correct) && <Check size={14} />}</span></button>)}</div><div className="add-question-wrap"><button className="add-question-button" onClick={() => setShowTypes(value => !value)}><Plus size={17} /> Adicionar pergunta <ChevronDown size={15} /></button>{showTypes && <div className="question-type-menu">{questionTypes.map(type => <button key={type.id} onClick={() => addQuestion(type.id)}><span className={`type-mini-icon ${type.id}`} />{type.label}</button>)}</div>}</div><div className="editor-tips"><Sparkles size={16} /><div><strong>Dica de criação</strong><p>Use links de imagem/vídeo (Google, Pinterest, YouTube etc.) na pergunta.</p></div></div></aside><section className="question-editor"><div className="editor-canvas"><div className="canvas-topline"><span className="question-label">PERGUNTA {String(questions.findIndex(question => question.id === active.id) + 1).padStart(2, "0")}</span><div className="canvas-tools"><button className="tool-button" onClick={() => { const copy = { ...active, id: `q-${Date.now()}`, answers: active.answers.map(a => ({ ...a, id: `a-${Date.now()}-${Math.random()}` })) }; const idx = questions.findIndex(q => q.id === active.id); const next = [...questions]; next.splice(idx + 1, 0, copy); setQuestions(next); setActiveId(copy.id); }}><Copy size={15} /> Duplicar</button><button className="tool-button danger" onClick={removeActive}><Trash2 size={15} /> Excluir</button></div></div><div className="title-field"><label htmlFor="quiz-title">Título da experiência</label><input id="quiz-title" value={title} onChange={event => setTitle(event.target.value)} /></div><div className="question-type-row"><div className="type-select"><span className={`type-dot ${active.type}`} /><select value={active.type} onChange={event => updateActive({ type: event.target.value as QuestionType })}>{questionTypes.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}</select><ChevronDown size={16} /></div><div className="question-setting"><Clock3 size={16} /><span>Tempo</span><select value={active.timeLimit} onChange={event => updateActive({ timeLimit: Number(event.target.value) })}><option value={20}>20 s</option><option value={30}>30 s</option><option value={60}>1 min</option><option value={120}>2 min</option></select></div><div className="question-setting"><span>Pontos</span><select value={active.points} onChange={event => updateActive({ points: Number(event.target.value) })}><option value={0}>Sem pontos</option><option value={1000}>Padrão</option><option value={2000}>Dobro</option></select></div></div><div className="prompt-field"><textarea value={active.prompt} onChange={event => updateActive({ prompt: event.target.value })} aria-label="Texto da pergunta" rows={3} /><span className="character-count">{active.prompt.length}/120</span></div><div className="media-row"><button className={`media-button ${active.mediaType === "image" && active.mediaUrl ? "active" : ""}`} onClick={() => openMediaPicker("image")}><ImagePlus size={18} /><span>{active.mediaType === "image" && active.mediaUrl ? "Imagem (link)" : "Adicionar imagem (link)"}</span></button><button className={`media-button ${active.mediaType === "video" && active.mediaUrl ? "active" : ""}`} onClick={() => openMediaPicker("video")}><Video size={18} /><span>{active.mediaType === "video" && active.mediaUrl ? "Vídeo (link)" : "Adicionar vídeo (link)"}</span></button><button className={`media-button ${active.mediaType === "file" && active.mediaUrl ? "active" : ""}`} onClick={() => openMediaPicker("file")}><FileText size={18} /><span>{active.mediaType === "file" && active.mediaUrl ? "Arquivo (link)" : "Adicionar arquivo (link)"}</span></button></div>{active.mediaUrl && <div className="media-preview" style={{ margin: "8px 0", padding: 10, border: "1px solid #eee", borderRadius: 8, display: "flex", gap: 10, alignItems: "center" }}>{active.mediaType === "image" ? <img src={active.mediaUrl} alt="Mídia da pergunta" style={{ maxWidth: 160, maxHeight: 90, objectFit: "cover", borderRadius: 6 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} /> : <span>{active.mediaType}: {active.mediaUrl}</span>}<a href={active.mediaUrl} target="_blank" rel="noreferrer">Abrir link</a><button onClick={() => updateActive({ mediaUrl: undefined, mediaType: undefined })}>Remover</button></div>}<div className="answers-grid">{active.answers.map((answer, index) => <div className={`answer-editor answer-${index % 4}`} key={answer.id}><button className={`correct-toggle ${answer.correct ? "checked" : ""}`} onClick={() => updateAnswer(answer.id, { correct: !answer.correct })} aria-label={`Marcar resposta ${index + 1} como correta`}>{answer.correct && <Check size={15} />}</button><input value={answer.text} onChange={event => updateAnswer(answer.id, { text: event.target.value })} /><span className="answer-label">{String.fromCharCode(65 + index)}</span></div>)}{active.type !== "true-false" && active.answers.length < 6 && <button className="add-answer" onClick={() => updateActive({ answers: [...active.answers, { id: `a-${Date.now()}`, text: "Nova resposta" }] })}><Plus size={16} /> Adicionar resposta</button>}</div><div className="note-box"><Sparkles size={16} /><input value={active.note ?? ""} placeholder="Adicione uma nota para orientar quem apresenta esta pergunta..." onChange={event => updateActive({ note: event.target.value })} /></div></div></section><aside className="editor-inspector"><div className="inspector-heading"><span>DETALHES</span></div><div className="inspector-preview"><div className="preview-label">PRÉVIA DO CARTÃO</div><div className="preview-card"><div className={`preview-type ${active.type}`}>{active.type === "multiple-choice" ? "A" : active.type === "true-false" ? "V/F" : "?"}</div><strong>{active.prompt}</strong>{active.mediaUrl && <div style={{ fontSize: 11, marginTop: 6, opacity: 0.8 }}>Mídia: {active.mediaType}</div>}</div></div><div className="inspector-section"><span className="inspector-label">BUSCAR MÍDIA (por pergunta)</span><p style={{ fontSize: 12, opacity: 0.8, margin: "6px 0 8px" }}>Pesquise com base no texto da pergunta e cole o link escolhido.</p><div style={{ display: "grid", gap: 6 }}>{searchLinks.googleImages && <a className="ai-action" href={searchLinks.googleImages} target="_blank" rel="noreferrer"><Search size={16} /><span><strong>Google Imagens</strong><small>Buscar imagens para esta pergunta</small></span><ExternalLink size={14} /></a>}{searchLinks.pinterest && <a className="ai-action" href={searchLinks.pinterest} target="_blank" rel="noreferrer"><ImagePlus size={16} /><span><strong>Pinterest</strong><small>Buscar ideias/imagens no Pinterest</small></span><ExternalLink size={14} /></a>}{searchLinks.google && <a className="ai-action" href={searchLinks.google} target="_blank" rel="noreferrer"><FileText size={16} /><span><strong>Google</strong><small>Buscar vídeos, arquivos e referências</small></span><ExternalLink size={14} /></a>}</div></div><div className="inspector-section"><span className="inspector-label">ASSISTENTE</span><button className="ai-action" onClick={generateWithAi}><Sparkles size={16} /><span><strong>Gerar quiz de animais marinhos</strong><small>Preenche com exemplo demonstrativo</small></span></button></div><div className="inspector-footer"><button className="secondary-button full" onClick={() => setPreview(true)}><Eye size={16} /> Abrir modo de prévia</button></div></aside></div>

    {mediaPicker && <div className="modal-scrim" onClick={() => setMediaPicker(null)}><div className="preview-modal" onClick={event => event.stopPropagation()}><div className="preview-modal-top"><span>Adicionar {mediaPicker === "image" ? "imagem" : mediaPicker === "video" ? "vídeo" : "arquivo"} por link</span><button className="icon-button" onClick={() => setMediaPicker(null)}><X size={18} /></button></div><div style={{ padding: 20, display: "grid", gap: 12 }}><p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>Cole a URL (imagem, vídeo do YouTube, PDF, etc.). Para imagens, você pode pesquisar no Google Imagens/Pinterest e copiar o endereço da imagem.</p><input value={mediaUrlInput} onChange={e => setMediaUrlInput(e.target.value)} placeholder="https://..." style={{ width: "100%", padding: 10 }} /><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{searchLinks.googleImages && <a className="secondary-button small" href={searchLinks.googleImages} target="_blank" rel="noreferrer">Abrir Google Imagens</a>}{searchLinks.pinterest && <a className="secondary-button small" href={searchLinks.pinterest} target="_blank" rel="noreferrer">Abrir Pinterest</a>}{searchLinks.google && <a className="secondary-button small" href={searchLinks.google} target="_blank" rel="noreferrer">Abrir Google</a>}</div><div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}><button className="secondary-button" onClick={() => setMediaPicker(null)}>Cancelar</button><button className="primary-button" onClick={applyMedia}>Usar este link</button></div></div></div></div>}

    {preview && <div className="modal-scrim" onClick={() => setPreview(false)}><div className="preview-modal" onClick={event => event.stopPropagation()}><div className="preview-modal-top"><span>Prévia do participante</span><button className="icon-button" onClick={() => setPreview(false)}><X size={18} /></button></div><div className="live-preview"><div className="live-kicker">QUIZ</div><h2>{active.prompt}</h2>{active.mediaUrl && active.mediaType === "image" && <img src={active.mediaUrl} alt="" style={{ maxWidth: "100%", maxHeight: 220, objectFit: "contain", borderRadius: 8, marginBottom: 12 }} />}{active.mediaUrl && active.mediaType !== "image" && <div style={{ marginBottom: 12 }}><a href={active.mediaUrl} target="_blank" rel="noreferrer">Abrir mídia ({active.mediaType})</a></div>}<div className="live-options">{active.answers.map((answer, index) => <button key={answer.id}><span>{String.fromCharCode(65 + index)}</span>{answer.text}</button>)}</div><div className="live-footer"><span>Tempo restante</span><strong>{active.timeLimit}s</strong></div></div></div></div>}
  </div>;
}

export default function CreateQuizPage() {
  return <Suspense fallback={<div className="editor-page"><div style={{ padding: 40 }}>Carregando editor...</div></div>}><CreateQuizInner /></Suspense>;
}
