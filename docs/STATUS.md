# STATUS - Toohak

> Documento vivo e compacto. **Ler sempre no início de cada sessão** para retomar contexto.

## Resumo
- Stack: Next.js 14 (App Router), NextAuth (JWT/Credentials), Drizzle ORM + Neon/Postgres, Ably (chave), UI em `app/(app)`.
- Estado: quizzes com mídia por **link/URL** (sem upload), shell/perfil autenticado real, página Configurações, testes Vitest+RTL, tema Vibrante com cores vivas, correções de contraste (Drácula e hover de botões), base de SEO (metadata/robots/sitemap/manifest). Sala ao vivo demo ainda usa BroadcastChannel (`lib/liveRoom.ts`). Atualizado: 16/11/2026 12:34.

## Feito (última entrega)
- **Perfil/sessão (UI)**: `AuthSessionProvider` no `app/layout.tsx`; `AppShell` com `useSession` + `lib/userDisplay.ts` (nome/iniciais/email reais, menu sair). Página `app/(app)/settings/page.tsx` (perfil, conta, "Sobre o Toohak" — criador Tiago de Abreu @devtiagoabreu, marido da Marina e pai da Rosa, Ágatha e Cecília). `/settings` protegido; `/dashboard` redireciona p/ `/library`; login pós-sucesso → `/library`.
- **Temas/contraste**: tema **Vibrante** com primárias vivas (pink `#ff1493`, roxo `#7b2cff`, verde `#00d26a`, laranja `#ff7a00`) e cards em gradiente; correção de contraste no **Drácula** no banner de cursos (`.course-intro`, kicker/título/texto); correção de hover em botões para manter texto legível (secundários não ficam brancos com texto sumindo; primários mantêm texto branco; hover na tela ao vivo ajustado).
- **SEO (base)**: metadata global rica em `app/layout.tsx` (title template, description, OG/Twitter, robots, canonical, locale pt-BR), `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `lib/site.ts`; `app/join/layout.tsx` com metadata. Rotas privadas/API desindexadas no robots.
- **Testes**: Vitest+RTL configurado (`npm test`) — `__tests__/userDisplay.test.ts`, `__tests__/AppShell.test.tsx`, `__tests__/SettingsPage.test.tsx`.
- **(anteriores)**: schema/APIs de quizzes+questões+opções com mídia por URL; editor `/create` e biblioteca `/library`; fixes auth, remoção `EmailProvider`, Ably lazy.

## Dificuldades → soluções
- Sessão JWT não atualiza nome sem novo login → `refetchOnWindowFocus` + orientar sair/entrar e redeploy para renovar token.
- Contraste insuficiente (Drácula em `/courses`, e hover de botões clareando fundo com texto ilegível) → overrides de alto contraste no CSS e hover com `color-mix` mantendo cor do texto.
- npm/peers/ambiente → installs com `--legacy-peer-deps`; Vitest com plugin React para JSX.

## Estado funcional
- Persistência real requer: `DATABASE_URL` + migrations (`npm run db:generate && npm run db:migrate`) + login. Sem isso, fallback local/exemplos.
- Mídia = **URL externa** (sem upload/blob).
- Deploy: `https://toohak-jet.vercel.app` — requer redeploy e novo login para refletir perfil/tema/SEO/contraste.

## Próximos passos
1. Indexação Google: configurar `NEXT_PUBLIC_APP_URL` no deploy, verificar propriedade no Google Search Console, enviar sitemap `/sitemap.xml`, garantir páginas públicas indexáveis e metadados por página (login/register como Server Components ou layouts com metadata).
2. Aplicar migrations no Neon e validar fluxo logado + perfil da Agatha em produção.
3. Ampliar testes (acessibilidade axe/contraste, segurança/APIs, fluxos críticos) e pipeline.
4. Estender schema/APIs p/ histórias/cursos e metadados; trocar BroadcastChannel por Ably/WebSocket.
5. Workspaces/autorização, importadores/LLM, limpar warnings dinâmicos do build.

## Comandos
`npm run dev` | `npm run build` | `npm test` | `npm run db:generate` | `npm run db:migrate` | `npm run db:studio`
