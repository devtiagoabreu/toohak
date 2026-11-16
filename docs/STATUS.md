# STATUS - Toohak

> Documento vivo e compacto. **Ler sempre no início de cada sessão** para retomar contexto.

## Resumo
- Stack: Next.js 14 (App Router), NextAuth (JWT/Credentials), Drizzle ORM + Neon/Postgres, Ably (chave), UI em `app/(app)`.
- Estado: quizzes + histórias + cursos com mídia por **link/URL** (sem upload), shell/perfil autenticado real, página Configurações, testes Vitest+RTL (24 passando), tema Vibrante com cores vivas, correções de contraste (Drácula e hover de botões), busca da topbar funcional, favicon/logo configurado, SEO completo (metadata/JSON-LD/robots/sitemap/manifest). Sala ao vivo demo ainda usa BroadcastChannel (`lib/liveRoom.ts`). Atualizado: 16/11/2026 13:46.

## Feito (última entrega)
- **Perfil/sessão (UI)**: `AuthSessionProvider` no `app/layout.tsx`; `AppShell` com `useSession` + `lib/userDisplay.ts` (nome/iniciais/email reais, menu sair). Página `app/(app)/settings/page.tsx` (perfil, conta, "Sobre o Toohak" — criador Tiago de Abreu @devtiagoabreu, marido da Marina e pai da Rosa, Ágatha e Cecília). `/settings` protegido; `/dashboard` redireciona p/ `/library`; login pós-sucesso → `/library`.
- **Busca e biblioteca**: barra de busca da topbar envia para `/library?q=...`; `app/(app)/library/page.tsx` lê `q`, filtra conteúdos e usa `Suspense`.
- **Temas/contraste**: tema **Vibrante** com primárias vivas (pink `#ff1493`, roxo `#7b2cff`, verde `#00d26a`, laranja `#ff7a00`) e cards em gradiente; correção de contraste no **Drácula** no banner de cursos (`.course-intro`); correção de hover em botões para manter texto legível.
- **SEO completo**: metadata global rica em `app/layout.tsx` (title template, description, OG/Twitter, robots, canonical, locale pt-BR, autores); JSON-LD (Organization/WebSite/SoftwareApplication) no root layout via `<script type="application/ld+json">`; `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `lib/site.ts`; layouts de metadata por página (`/auth/login`, `/auth/register` indexáveis; `/auth/verify-email`, `/auth/recovery-codes`, `/auth/error` noindex); ícones/favicon com `/toohak-logo.jpg`; `NEXT_PUBLIC_APP_URL` documentado em `.env.example`.
- **Schema/APIs estendidas**: novas tabelas `stories`, `story_blocks`, `courses`, `course_activities` em `db/schema.ts` e `db/migrations/0001_init.sql`; APIs `POST/GET /api/stories` e `POST/GET /api/courses` seguindo padrão de `/api/quizzes`.
- **Testes**: Vitest+RTL — `__tests__/userDisplay.test.ts`, `__tests__/AppShell.test.tsx`, `__tests__/SettingsPage.test.tsx`, `__tests__/contrast.test.ts` (WCAG AA), `__tests__/auth-flow.test.ts`, `__tests__/seo.test.ts` (24 passando).
- **Boas práticas Vercel**: skills oficiais `vercel-labs/agent-skills` instaladas em `.agents/skills/` (deploy-to-vercel, vercel-react-best-practices, web-design-guidelines).
- **(anteriores)**: fixes auth, remoção `EmailProvider`, Ably lazy, tema Vibrante.

## Dificuldades → soluções
- Sessão JWT não atualiza nome sem novo login → `refetchOnWindowFocus` + orientar sair/entrar e redeploy para renovar token.
- Contraste insuficiente (Drácula em `/courses`, hover de botões clareando fundo) → overrides de alto contraste e hover com `color-mix` mantendo cor do texto.
- Build Vercel falhou por `library/page.tsx` corrompido e `join/layout.tsx` sem `default export` → arquivo reescrito em UTF-8 limpo e layout ajustado para contrato do Next.js App Router.
- JSON-LD não cabe no tipo `other` do Metadata Next.js → movido para componente `<script type="application/ld+json">` no root layout.
- npm/peers/ambiente → installs com `--legacy-peer-deps`; Vitest com plugin React para JSX.

## Estado funcional
- Persistência real requer: `DATABASE_URL` + migrations (`npm run db:generate && npm run db:migrate`) + login. Sem isso, fallback local/exemplos.
- Mídia = **URL externa** (sem upload/blob).
- Deploy: `https://toohak-jet.vercel.app` — requer redeploy e novo login para refletir perfil/tema/SEO/contraste.

## Próximos passos
1. Indexação Google: configurar `NEXT_PUBLIC_APP_URL` no deploy (Vercel env), verificar no Search Console, enviar `/sitemap.xml`.
2. Aplicar migrations no Neon (usar `db/migrations/0001_init.sql`) e validar fluxo logado + perfil da Agatha em produção.
3. Ampliar testes (acessibilidade axe/contraste real, segurança/APIs, fluxos críticos) e pipeline CI.
4. Estender schema/APIs para históricos de jogos, rankings, workspaces.
5. Trocar BroadcastChannel por Ably/WebSocket.

## Comandos
`npm run dev` | `npm run build` | `npm test` | `npm run db:generate` | `npm run db:migrate` | `npm run db:studio`

