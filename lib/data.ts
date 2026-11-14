export type ContentKind = "quiz" | "story" | "course";
export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "poll"
  | "open-ended"
  | "word-cloud";

export interface AnswerOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  answers: AnswerOption[];
  timeLimit: number;
  points: number;
  note?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  kind: ContentKind;
  status: "published" | "draft" | "shared";
  updatedAt: string;
  plays: number;
  color: string;
  description: string;
}

export const demoQuestions: QuizQuestion[] = [
  { id: "q1", type: "multiple-choice", prompt: "Qual é a melhor forma de começar um projeto colaborativo?", answers: [{ id: "a1", text: "Definir o objetivo e o público", correct: true }, { id: "a2", text: "Escolher as cores primeiro" }, { id: "a3", text: "Publicar sem revisar" }, { id: "a4", text: "Remover o feedback" }], timeLimit: 30, points: 1000, note: "Use esta pergunta para alinhar expectativas da equipe." },
  { id: "q2", type: "true-false", prompt: "Um bom quiz mede somente velocidade, nunca compreensão.", answers: [{ id: "b1", text: "Verdadeiro" }, { id: "b2", text: "Falso", correct: true }], timeLimit: 20, points: 1000 },
  { id: "q3", type: "poll", prompt: "Qual formato ajuda mais sua equipe a aprender?", answers: [{ id: "c1", text: "Exemplo prático" }, { id: "c2", text: "Debate guiado" }, { id: "c3", text: "Desafio rápido" }], timeLimit: 30, points: 0 },
];

export const marineQuestions: QuizQuestion[] = [
  { id: "marine-1", type: "multiple-choice", prompt: "Qual animal é conhecido por mudar de cor e usar três corações?", answers: [{ id: "m1a", text: "Polvo", correct: true }, { id: "m1b", text: "Tubarão" }, { id: "m1c", text: "Golfinho" }, { id: "m1d", text: "Cavalo-marinho" }], timeLimit: 30, points: 1000, note: "O polvo tem três corações e uma inteligência surpreendente." },
  { id: "marine-2", type: "true-false", prompt: "As baleias são peixes porque vivem no oceano.", answers: [{ id: "m2a", text: "Verdadeiro" }, { id: "m2b", text: "Falso", correct: true }], timeLimit: 20, points: 1000 },
  { id: "marine-3", type: "multiple-choice", prompt: "Qual é a maior espécie de animal que já viveu no planeta?", answers: [{ id: "m3a", text: "Baleia-azul", correct: true }, { id: "m3b", text: "Lula-gigante" }, { id: "m3c", text: "Tubarão-baleia" }, { id: "m3d", text: "Orca" }], timeLimit: 30, points: 1000 },
  { id: "marine-4", type: "poll", prompt: "Qual ambiente marinho você gostaria de explorar?", answers: [{ id: "m4a", text: "Recife de coral" }, { id: "m4b", text: "Mar profundo" }, { id: "m4c", text: "Floresta de algas" }], timeLimit: 30, points: 0 },
];

export const demoContent: ContentItem[] = [
  { id: "content-marine", title: "Animais marinhos — descobertas do oceano", kind: "quiz", status: "draft", updatedAt: "Agora", plays: 0, color: "blue", description: "Quiz criado com assistência para explorar criaturas e habitats do oceano." },
  { id: "content-1", title: "Fundamentos de colaboração", kind: "quiz", status: "published", updatedAt: "Hoje, 09:42", plays: 248, color: "coral", description: "Uma trilha curta para alinhar práticas de trabalho em equipe." },
  { id: "content-2", title: "Onboarding em 10 minutos", kind: "course", status: "draft", updatedAt: "Ontem, 16:10", plays: 0, color: "violet", description: "Curso com vídeo, história e dois desafios de revisão." },
  { id: "content-3", title: "A voz do cliente", kind: "story", status: "shared", updatedAt: "12 nov, 14:25", plays: 84, color: "mint", description: "História interativa para discutir decisões de produto." },
  { id: "content-4", title: "Segurança sem complicação", kind: "quiz", status: "published", updatedAt: "10 nov, 11:03", plays: 531, color: "blue", description: "Verificação rápida de conhecimentos essenciais." },
];

export const reportRows = [
  { name: "Fundamentos de colaboração", participants: 248, accuracy: 82, completion: 96, date: "Hoje" },
  { name: "Segurança sem complicação", participants: 531, accuracy: 74, completion: 91, date: "10 nov" },
  { name: "A voz do cliente", participants: 84, accuracy: 88, completion: 100, date: "12 nov" },
];
