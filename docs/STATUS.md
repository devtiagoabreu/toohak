# STATUS - Toohak

> Documento vivo e compacto. **Ler sempre no início de cada sessão** para retomar contexto.

## Resumo
- Stack: Next.js 14 (App Router), NextAuth (JWT/Credentials), Drizzle ORM + Neon/Postgres, Ably (chave), UI em `app/(app)`.
- Estado: quizzes com mídia por **link/URL** (sem upload), shell autenticado com perfil real, página de Configurações criada, testes unitários/integração (Vitest+RTL) para perfil. Sala ao vivo demo ainda usa BroadcastChannel (`lib/liveRoom.ts`).

## Feito (última entrega)
- **Perfil/sessão (UI)**: `components/AuthSessionProvider.tsx` (`SessionProvider` c/ `refetchOnWindowFocus`) no `app/layout.tsx`; `components/AppShell.tsx` usa `useSession` + `lib/userDisplay.ts` (`getDisplayName/getInitials`) para exibir nome/iniciais/email reais (sidebar/topo) e menu de sair — remove "Ana Martins/AM/Plano gratuito" hardcoded.
- **Páginas/fluxo de usuário**: `app/(app)/settings/page.tsx` criada (perfil, conta/logout e crédito "Sobre o Toohak"); `app/dashboard/page.tsx` agora redireciona para `/library` via `getServerSession`; login (`app/auth/login/page.tsx`) pós-sucesso vai para `/library`; `middleware.ts` protege `/settings`.
- **Crédito**: Criador do Toohak — Tiago de Abreu (@devtiagoabreu), marido da Marina e pai da Rosa, Ágatha e Cecília (exibido em Configurações).
- **Testes**: infra Vitest+RTL (`vitest.config.ts`, `test/setup.ts`, scripts `test`/`test:watch`, deps dev) e testes passando: `__tests__/userDisplay.test.ts`, `__tests__/AppShell.test.tsx`, `__tests__/SettingsPage.test.tsx` (perfil real renderizado). Comando: `npm test`.
- **(entregas anteriores)**: schema/migrations de quizzes+questões+opções com mídia por URL; APIs `GET/POST/PUT/DELETE /api/quizzes` e `/api/media/suggest`; editor `/create` (URL+preview+sugestões, salvar/carregar, `?id=`) e biblioteca `/library`; fixes rotas auth (`/auth/verify-email`, `/auth/recovery-codes`), remoção `EmailProvider` (Credentials), `lib/realtime.ts` lazy Ably.

## Dificuldades → soluções
- `getSession` (client) em Server Component (`app/dashboard`) causava comportamento incorreto → troca para `getServerSession` + redirect.
- Nome pode não atualizar se o JWT da sessão for antigo → `refetchOnWindowFocus` no provider; **usuário deve sair e entrar novamente** (e redeploy no Vercel) para renovar token com `name/email`.
- Instalação npm quebrou com peer deps (next-auth/nodemailer) e crash do node/npm no ambiente → `npm install -D ... --legacy-peer-deps`; ajuste de teste para iniciais e JSX no Vitest (plugin React).

## Estado funcional
- Persistência real requer: `DATABASE_URL` + migrations (`npm run db:generate && npm run db:migrate`) + login. Sem isso, fallback local/exemplos.
- Mídia = **URL externa** (sem upload/blob).
- Deploy: `https://toohak-jet.vercel.app` — requer redeploy com commits recentes e novo login para refletir perfil/correções.

## Próximos passos
1. Aplicar migrations no Neon e validar fluxo logado (criar→salvar→listar→reabrir) + confirmar perfil da Agatha em produção.
2. Ampliar testes (acessibilidade axe, segurança/APIs, fluxos críticos) e pipeline de verificação.
3. Estender schema/APIs p/ histórias/cursos e metadados (visibilidade, capa, idioma).
4. Trocar BroadcastChannel por Ably/WebSocket (sessão, presença, respostas, placar).
5. Workspaces/autorização, importadores/LLM, limpar warnings dinâmicos do build.

## Comandos
`npm run dev` | `npm run build` | `npm test` | `npm run db:generate` | `npm run db:migrate` | `npm run db:studio`
