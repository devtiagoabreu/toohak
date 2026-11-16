# STATUS — Toohak

> Documento vivo e compacto. **Ler sempre no início de cada sessão** para retomar contexto.

## Resumo
- Stack: Next.js 14 (App Router), NextAuth, Drizzle ORM + Neon/Postgres, Ably (chave), UI em `app/(app)`.
- Estado: persistência inicial de quizzes + mídia por link/URL (sem upload). Sala ao vivo demo ainda usa BroadcastChannel (`lib/liveRoom.ts`).

## Feito (última entrega)
- **DB (`db/schema.ts`)**: `quizzes` +`coverImageUrl,status,updatedAt`; `questions` +`type,mediaUrl,mediaType,note`; `options` +`orderIndex`, `isCorrect` default.
- **APIs**: `GET/POST /api/quizzes`, `GET/PUT/DELETE /api/quizzes/[id]` (CRUD por usuário autenticado); `GET /api/media/suggest?q=` (links Google/Imagens/Pinterest).
- **Editor (`app/(app)/create/page.tsx`)**: mídia só por URL (imagem/vídeo/arquivo) via modal + prévia; sugestões de busca contextuais pela pergunta (Google Imagens/Pinterest/Google) para escolher/colar link; salvar/carregar no banco com fallback local; edição `?id=`; duplicar; `Suspense`.
- **Biblioteca (`app/(app)/library/page.tsx`)**: lista quizzes da API (mescla exemplos), abre `/create?id=` para editar.
- **Auth/infra**: `middleware.ts` protege `/dashboard,/create,/library,/courses,/reports,/present` (redirect login + `callbackUrl`); `lib/realtime.ts` lazy init Ably; tipos mídia em `lib/data.ts`; nota migrations em `.env.example`. `npm run build` OK.
- **Fix rotas auth**: páginas de verificação/recuperação movidas para `app/auth/verify-email` e `app/auth/recovery-codes` (antes em grupo `(auth)`, gerando `/verify-email` e 404 em `/auth/verify-email` usado no pós-registro).

## Dificuldades → soluções
- PowerShell sem heredoc `<<` → here-string `@'..'@` + `Out-File -LiteralPath/Set-Content`.
- Path `[id]` tratado como wildcard → `-LiteralPath`.
- `useSearchParams` exigiu Suspense em `/create` → split `CreateQuizInner` + wrapper `<Suspense>`.
- Ably top-level quebrava build sem env → `getAbly()` lazy.
- Patch em arquivo grande/encoding ruidoso → reescrita limpa de create/library.
- 404 em `/auth/verify-email` (pós-registro) → páginas estavam em `app/(auth)/...` (URL sem `/auth`); movidas para `app/auth/...` para casar com redirects/links.
- Warnings de rotas auth dinâmicas no prerender (build concluiu).

## Estado funcional
- Persistência real requer: `DATABASE_URL` + migrations (`npm run db:generate && npm run db:migrate`) + login. Sem isso, fallback local/exemplos.
- Mídia = **URL externa** (sem upload/blob).

## Próximos passos
1. Aplicar migrations no Neon e validar fluxo logado (criar→salvar→listar→reabrir).
2. Estender schema/APIs p/ histórias/cursos e metadados (visibilidade, capa, idioma).
3. Trocar BroadcastChannel por Ably/WebSocket (sessão, presença, respostas, placar).
4. Workspaces/autorização, importadores/LLM, testes críticos, limpar warnings dinâmicos.

## Comandos
`npm run dev` | `npm run build` | `npm run db:generate` | `npm run db:migrate` | `npm run db:studio`
