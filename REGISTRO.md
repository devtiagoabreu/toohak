# REGISTRO — Todas as entregas do Toohak

> Resumo completo de tudo que foi implementado, corrigido e configurado no projeto Toohak, desde o início até o estado atual.

---

## 1. Contexto do Projeto

- **Stack:** Next.js 14 (App Router), NextAuth (JWT/Credentials), Drizzle ORM + Neon/Postgres, Ably (lazy), UI em `app/(app)`.
- **Deploy:** `https://toohak-jet.vercel.app` (Vercel).
- **Banco de dados:** Neon Postgres (`DATABASE_URL` configurado na Vercel e localmente).
- **Usuária de teste:** `Ágatha Maria Cano de Abreu` (`agathamariachannel@gmail.com`, id `2533dba2-10c0-4176-aaa9-2f9e8307acdb`, `email_verified=true`).
- **Regra de mídia:** apenas links/URLs externos (sem upload de arquivos).

---

## 2. Autenticação e Sessão

| Recurso | Arquivo | Status |
|---------|---------|--------|
| NextAuth Credentials provider | `lib/auth.ts` | ✅ Implementado |
| Validação `emailVerified` + `passwordHash` | `lib/auth.ts` | ✅ Implementado |
| JWT session strategy | `lib/auth.ts` | ✅ Implementado |
| Callbacks JWT/Session (id, email, name) | `lib/auth.ts` | ✅ Implementado |
| Login page | `app/auth/login/page.tsx` | ✅ Implementado |
| Register page | `app/auth/register/page.tsx` | ✅ Implementado |
| Verify-email page | `app/auth/verify-email/page.tsx` | ✅ Implementado |
| Recovery-codes page | `app/auth/recovery-codes/page.tsx` | ✅ Implementado |
| Error page | `app/auth/error/page.tsx` | ✅ Implementado |
| NextAuth API route | `app/api/auth/[...nextauth]/route.ts` | ✅ Implementado |
| Register API | `app/api/auth/register/route.ts` | ✅ Implementado |
| Verify-email API | `app/api/auth/verify-email/route.ts` | ✅ Implementado |
| Recovery-codes API | `app/api/user/recovery-codes/route.ts` | ✅ Implementado |
| Middleware de proteção | `middleware.ts` | ✅ Implementado |

**Rotas protegidas:** `/dashboard, /create, /library, /courses, /reports, /present, /settings`  
**Redirecionamentos:** `/dashboard` → `/library`; login pós-sucesso → `/library`; páginas de auth quando logado → `/library`.

---

## 3. Banco de Dados (Drizzle + Neon)

### Tabelas criadas

| Tabela | Arquivo | Status |
|--------|---------|--------|
| users | `db/schema.ts` | ✅ |
| accounts | `db/schema.ts` | ✅ |
| sessions | `db/schema.ts` | ✅ |
| verification_tokens | `db/schema.ts` | ✅ |
| recovery_codes | `db/schema.ts` | ✅ |
| user_profiles | `db/schema.ts` | ✅ |
| user_smtp_configs | `db/schema.ts` | ✅ |
| user_api_keys | `db/schema.ts` | ✅ |
| quizzes | `db/schema.ts` | ✅ |
| questions | `db/schema.ts` | ✅ |
| options | `db/schema.ts` | ✅ |
| stories | `db/schema.ts` | ✅ |
| story_blocks | `db/schema.ts` | ✅ |
| courses | `db/schema.ts` | ✅ |
| course_activities | `db/schema.ts` | ✅ |

### Migrations aplicadas no Neon

| Arquivo | Conteúdo |
|---------|----------|
| `db/migrations/0001_init.sql` | Schema inicial completo |
| `db/migrations/0002_fix_schema.sql` | Colunas faltantes em `quizzes` (`cover_image_url`, `status`, `updated_at`, `is_public`) + tabelas `stories`, `story_blocks`, `courses`, `course_activities` + índices |

**Nota:** As migrations `0002` foram aplicadas diretamente no Neon via script Node (o driver `@neondatabase/serverless` não suportava `db.execute` para DDL).

---

## 4. APIs de Conteúdo

| Endpoint | Arquivo | Métodos | Status |
|----------|---------|---------|--------|
| `/api/quizzes` | `app/api/quizzes/route.ts` | GET, POST | ✅ |
| `/api/quizzes/[id]` | `app/api/quizzes/[id]/route.ts` | GET, PUT, DELETE | ✅ |
| `/api/stories` | `app/api/stories/route.ts` | GET, POST | ✅ |
| `/api/courses` | `app/api/courses/route.ts` | GET, POST | ✅ |
| `/api/library` | `app/api/library/route.ts` | GET | ✅ |
| `/api/media/suggest` | `app/api/media/suggest/route.ts` | GET | ✅ |

Todas as rotas de API possuem `export const dynamic = "force-dynamic"` para evitar erro de pré-renderização estática no Vercel (DYNAMIC_SERVER_USAGE).

---

## 5. Layout e Interface (UI)

### Shell da aplicação

| Recurso | Arquivo | Status |
|---------|---------|--------|
| Root Layout com providers | `app/layout.tsx` | ✅ |
| AppShell (sidebar + topbar) | `components/AppShell.tsx` | ✅ |
| AuthSessionProvider | `components/AuthSessionProvider.tsx` | ✅ |
| ThemeProvider (6 temas) | `components/ThemeProvider.tsx` | ✅ |
| App layout wrapper | `app/(app)/layout.tsx` | ✅ |

### Temas disponíveis

1. **Vibrante** — pink `#ff1493`, roxo `#7b2cff`, verde `#00d26a`, laranja `#ff7a00`
2. **Drácula** — contraste noturno
3. **Apple sóbrio**
4. **Ubuntu**
5. **Windows**
6. **Clássico Toohak**

### Elementos do shell

- Sidebar com logo, workspace switcher, navegação principal
- Navegação colaborar (Grupos, Entrar em sessão)
- Theme picker com swatches de cores
- Botão "Desbloqueie mais" (upgrade)
- Link Configurações
- Perfil do usuário com nome real, iniciais, email e menu sair
- Topbar com busca funcional, botão Criar (dropdown: Quiz, História, Curso), Ajuda, avatar
- Menu mobile com scrim

---

## 6. Páginas do App Autenticado

| Página | Arquivo | Status | Dados reais? |
|--------|---------|--------|--------------|
| Dashboard (home) | `app/(app)/page.tsx` | ✅ | Sim (via Drizzle) |
| Biblioteca | `app/(app)/library/page.tsx` | ✅ | Sim (via API `/api/library`) |
| Criar (editor quiz) | `app/(app)/create/page.tsx` | ✅ | Sim (salva no banco) |
| Cursos | `app/(app)/courses/page.tsx` | ✅ | Sim (via API `/api/courses`) |
| Relatórios | `app/(app)/reports/page.tsx` | ✅ | Sim (métricas reais) |
| Apresentar | `app/(app)/present/page.tsx` | ✅ | Sim (LiveSession) |
| Configurações | `app/(app)/settings/page.tsx` | ✅ | Sim (perfil do usuário) |

Todas as páginas têm fallback para `demoContent` quando não há banco ou usuário não logado.

---

## 7. Páginas Públicas

| Página | Arquivo | Status |
|--------|---------|--------|
| Join (entrar sessão ao vivo) | `app/join/page.tsx` | ✅ |
| Login | `app/auth/login/page.tsx` | ✅ |
| Register | `app/auth/register/page.tsx` | ✅ |
| Verify-email | `app/auth/verify-email/page.tsx` | ✅ |
| Recovery-codes | `app/auth/recovery-codes/page.tsx` | ✅ |
| Error | `app/auth/error/page.tsx` | ✅ |

---

## 8. SEO e Indexação

| Recurso | Arquivo | Status |
|---------|---------|--------|
| Metadata global (title, description, OG, Twitter) | `app/layout.tsx` | ✅ |
| JSON-LD (Organization, WebSite, SoftwareApplication) | `app/layout.tsx` | ✅ |
| Ícones/favicon (`/toohak-logo.jpg`) | `app/layout.tsx` | ✅ |
| Robots.txt dinâmico | `app/robots.ts` | ✅ |
| Sitemap.xml dinâmico | `app/sitemap.ts` | ✅ |
| Manifest PWA | `app/manifest.ts` | ✅ |
| Config site | `lib/site.ts` | ✅ |
| Layouts metadata por página auth | `app/auth/*/layout.tsx` | ✅ |

**Rotas indexáveis:** `/`, `/join`, `/auth/login`, `/auth/register`  
**Rotas noindex:** `/auth/verify-email`, `/auth/recovery-codes`, `/auth/error`  
**Rotas privadas (desindexadas no robots):** `/dashboard`, `/create`, `/library`, `/courses`, `/reports`, `/present`, `/settings`, `/api/*`

---

## 9. CSS e Design System

| Recurso | Arquivo | Status |
|---------|---------|--------|
| Variáveis CSS globais | `app/design-system.css` | ✅ |
| Temas (6 variações com overrides) | `app/design-system.css` | ✅ |
| Contraste Drácula (`.course-intro`) | `app/design-system.css` | ✅ |
| Contraste hover botões | `app/design-system.css` | ✅ |
| Layouts (sidebar, topbar, cards, editor, live) | `app/design-system.css` | ✅ |

---

## 10. Testes

| Arquivo | O que cobre | Status |
|---------|-------------|--------|
| `userDisplay.test.ts` | Funções puras de nome/iniciais | ✅ |
| `AppShell.test.tsx` | Componente com mock de navegação | ✅ |
| `SettingsPage.test.tsx` | Página de configurações | ✅ |
| `contrast.test.ts` | WCAG AA (cores) | ✅ |
| `auth-flow.test.ts` | Validação de email/senha | ✅ |
| `seo.test.ts` | Rotas públicas/privadas, sitemap, robots | ✅ |

**Total: 24 testes passando** (`npm test`)

---

## 11. Documentação

| Arquivo | Status |
|---------|--------|
| `docs/STATUS.md` | ✅ Atualizado com estado completo |
| `AGENTS.md` | ✅ Presente |
| `README.md` | ✅ Profissional com badges, estrutura, instalação, SEO, testes, contribuição |
| `.env.example` | ✅ Presente com todas as variáveis |

---

## 12. Boas Práticas Vercel

| Skill | Local | Status |
|-------|-------|--------|
| deploy-to-vercel | `.agents/skills/` | ✅ Instalada |
| vercel-react-best-practices | `.agents/skills/` | ✅ Instalada |
| web-design-guidelines | `.agents/skills/` | ✅ Instalada |

---

## 13. Histórico de Commits

| Commit | Mensagem | Conteúdo principal |
|--------|----------|-------------------|
| `fb2215a` | docs: banco Neon conectado e migrations aplicadas em producao | STATUS atualizado com estado final |
| `4d09a80` | fix(build): adiciona force-dynamic a rotas de API e corrige debug/db | Correção de build Vercel + debug |
| `75be3cb` | feat(debug): aplica migrations faltantes no banco de producao | Endpoint de aplicação de migrations |
| `6614211` | fix(debug): corrigir consulta de colunas no endpoint de diagnostico | Debug de colunas da tabela quizzes |
| `8be9261` | feat(debug): endpoint de diagnostico banco para erro 500 quiz | Endpoint de diagnóstico |
| `bd69a1f` | feat(db): aplica migration no Neon e conecta todas as rotas ao banco real | Banco conectado + rotas reais |
| `c1f7e4e` | docs: atualiza STATUS com rotas do menu consumindo banco real | Documentação |
| `2c25f89` | feat(menu): todas as rotas consomem dados reais do banco | Home, biblioteca, cursos, relatórios |
| `ecb6d1e` | feat(library+courses+home): consumir dados reais do banco via API | API library + páginas |
| `1a7e074` | docs: adiciona README profissional e atualiza STATUS | README + STATUS |
| `ccda72f` | fix(ui): contraste em hover de botões, busca funcional e favicon | Contraste, busca, favicon |
| `f7e21b8` | fix: perfil real no app, pagina de configuracoes e testes | Perfil, settings, testes |
| `f2b774e` | fix: remover EmailProvider para evitar erro de config no NextAuth | Auth fix |
| `84d2b16` | fix: mover paginas de verify-email e recovery-codes para /auth | Rotas de auth |
| `83c5965` | feat: persist quizzes with link-based media and add docs/STATUS | Quizzes + schema inicial |
| `df4c2a0` | feat: portar design system, temas e paginas do app de exemplo | Design system base |
| `3fa1baf` | fix: remover await de nível de módulo em auth.ts | Fix build |
| `9dd762c` | feat: home Kahoot-style e correção NextAuth SMTP opcional | Home |
| `89f629e` | fix: usar --legacy-peer-deps no install da Vercel | Fix npm |
| `2efe19b` | feat: Toohak MVP fase 1 - Auth, DB, Design System e estrutura base | MVP inicial |
| `90ace8a` | Initial commit | Início do projeto |

---

## 14. Estado Funcional Atual

- ✅ **Persistência real:** Funcionando — `DATABASE_URL` no Neon + migrations aplicadas + login
- ✅ **Cadastro/Login:** Funcionando (usuária Agatha no banco, email verificado)
- ✅ **Criar quiz/história/curso:** Funcionando (salva no banco)
- ✅ **Biblioteca:** Funcionando (exibe dados reais do usuário logado)
- ✅ **Home:** Funcionando (exibe conteúdos reais do banco)
- ✅ **Relatórios:** Funcionando (métricas reais do banco)
- ✅ **Cursos:** Funcionando (exibe cursos reais)
- ✅ **SEO:** Configurado (sitemap, robots, JSON-LD, OG, Twitter)
- ✅ **Build:** Passando no Vercel
- ✅ **Testes:** 24/24 passando localmente

---

## 15. Próximos Passos Pendentes

1. Verificar `NEXT_PUBLIC_APP_URL` como **Config** (não Secret) na Vercel para SEO
2. Validar fluxo end-to-end em produção: logar como Agatha → criar quiz/história/curso → verificar na home/biblioteca/relatórios
3. Enviar sitemap ao Google Search Console
4. Ampliar testes (acessibilidade axe, segurança de APIs, fluxos críticos E2E)
5. Trocar BroadcastChannel por Ably/WebSocket para sala ao vivo real
6. Estender schema para históricos de jogos, rankings, workspaces

---

## 16. Comandos

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm test             # Testes (Vitest + RTL)
npm run db:generate  # Gerar migrations Drizzle
npm run db:migrate   # Aplicar migrations no banco
npm run db:studio    # Abrir Drizzle Studio
```

---

*Registro gerado automaticamente. Última atualização: 16/11/2026.*
