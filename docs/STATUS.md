# STATUS - Toohak

> Documento vivo e compacto. **Ler sempre no início de cada sessão** para retomar contexto.

## Resumo
- Stack: Next.js 14 (App Router), NextAuth (JWT/Credentials), Drizzle ORM + Neon/Postgres, Ably (chave), UI em `app/(app)`.
- Estado: quizzes com mídia por **link/URL** (sem upload), shell/perfil autenticado real, página Configurações, testes Vitest+RTL, tema Vibrante com cores vivas, correções de contraste (Drácula e hover de botões), busca da topbar funcional, favicon/logo configurado, base de SEO (metadata/robots/sitemap/manifest). Sala ao vivo demo ainda usa BroadcastChannel (`lib/liveRoom.ts`). Atualizado: 16/11/2026 13:07.

## Feito (última entrega)
- **Perfil/sessão (UI)**: `AuthSessionProvider` no `app/layout.tsx`; `AppShell` com `useSession` + `lib/userDisplay.ts` (nome/iniciais/email reais, menu sair). Página `app/(app)/settings/page.tsx` (perfil, conta, "Sobre o Toohak" — criador Tiago de Abreu @devtiagoabreu, marido da Marina e pai da Rosa, Ágatha e Cecília). `/settings` protegido; `/dashboard` redireciona p/ `/library`; login pós-sucesso → `/library`.
- **Temas/contraste**: tema **Vibrante** com primárias vivas (pink `#ff1493`, roxo `#7b2cff`, verde `#00d26a`, laranja `#ff7a00`) e cards em gradiente; correção de contraste no **Drácula** no banner de cursos (`.course-intro`); correção de hover em botões para manter texto legível.
- **Busca e biblioteca**: barra de busca da topbar envia para `/library?q=...`; `app/(app)/library/page.tsx` lê `q`, filtra conteúdos e usa `Suspense` (corrigido encoding/arquivo corrompido que quebrava o build na Vercel).
- **Favicon/SEO (base)**: `icons` e OG/Twitter com `/toohak-logo.jpg` em `app/layout.tsx`; `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `lib/site.ts`, `app/join/layout.tsx`. Rotas privadas/API desindexadas no robots.
- **Testes**: Vitest+RTL configurado (`npm test`) — `__tests__/userDisplay.test.ts`, `__tests__/AppShell.test.tsx`, `__tests__/SettingsPage.test.tsx`.
- **(anteriores)**: schema/APIs de quizzes+questões+opções com mídia por URL; editor `/create` e biblioteca `/library`; fixes auth, remoção `EmailProvider`, Ably lazy.

## Dificuldades → soluções
- Sessão JWT não atualiza nome sem novo login → `refetchOnWindowFocus` + orientar sair/entrar e redeploy para renovar token.
- Contraste insuficiente (Drácula em `/courses` e hover de botões clareando fundo) → overrides de alto contraste e hover com `color-mix` mantendo cor do texto.
- Build Vercel falhou por `app/(app)/library/page.tsx` corrompido/encoding quebrado → arquivo reescrito em UTF-8 limpo.
- npm/peers/ambiente → installs com `--legacy-peer-deps`; Vitest com plugin React para JSX.

## Estado funcional
- Persistência real requer: `DATABASE_URL` + migrations (`npm run db:generate && npm run db:migrate`) + login. Sem isso, fallback local/exemplos.
- Mídia = **URL externa** (sem upload/blob).
- Deploy: `https://toohak-jet.vercel.app` — requer redeploy e novo login para refletir perfil/tema/SEO/contraste.

## Próximos passos
1. Indexação Google: configurar `NEXT_PUBLIC_APP_URL` no deploy, verificar no Search Console, enviar `/sitemap.xml`, garantir metadados por página pública.
2. Aplicar migrations no Neon e validar fluxo logado + perfil da Agatha em produção.
3. Ampliar testes (acessibilidade axe/contraste, segurança/APIs, fluxos críticos) e pipeline.
4. Estender schema/APIs p/ histórias/cursos e metadados; trocar BroadcastChannel por Ably/WebSocket.
5. Workspaces/autorização, importadores/LLM, limpar warnings dinâmicos do build.

## Comandos
`npm run dev` | `npm run build` | `npm test` | `npm run db:generate` | `npm run db:migrate` | `npm run db:studio`

