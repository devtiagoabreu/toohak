# 🎯 Toohak

**Plataforma de quizzes interativos e aprendizado gamificado.**

Crie, jogue e compartilhe quizzes, histórias e cursos com mídia por link e sessões ao vivo. Ideal para educadores, treinadores corporais e equipes que querem engajar seu público com conteúdo dinâmico.

[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://toohak-jet.vercel.app)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-blue?style=for-the-badge)](https://orm.drizzle.team)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-Auth-blueviolet?style=for-the-badge)](https://next-auth.js.org)
[![Neon Postgres](https://img.shields.io/badge/Database-Neon-pink?style=for-the-badge)](https://neon.tech)
[![Vitest](https://img.shields.io/badge/Testing-Vitest-yellow?style=for-the-badge)](https://vitest.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📖 Sobre o Projeto

O **Toohak** é uma plataforma completa para criar experiências de aprendizagem gamificada. Com foco em simplicidade e engajamento, permite que qualquer pessoa crie quizzes interativos, narrativas em blocos (histórias) e trilhas de aprendizado (cursos) — tudo com mídia inserida por **URL externa** (sem upload de arquivos).

### ✨ Principais Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **📝 Quizzes** | Crie quizzes com múltiplas alternativas, mídia por link, tempo por pergunta e pontuação personalizada. |
| **📚 Histórias** | Narrativas em blocos (texto, imagem, vídeo, questão, reflexão) com ordem sequencial. |
| **🎓 Cursos** | Trilhas de aprendizado com atividades obrigatórias e opcionais (quiz, história, vídeo, leitura). |
| **🔐 Autenticação** | Login/cadastro próprio com verificação de e-mail, códigos de recuperação e sessão JWT. |
| **🎨 Temas** | Sistema de temas com cores vivas (Vibrante, Drácula e outros) e persistência de preferência. |
| **🔍 Busca** | Busca global na biblioteca por título, acessível da topbar. |
| **⚙️ Configurações** | Página de perfil, conta e informações sobre o criador do Toohak. |
| **📊 SEO** | Indexação pública otimizada com sitemap, robots, JSON-LD, Open Graph e metadados por página. |
| **📱 PWA** | Manifest e ícones para instalação como aplicativo progressivo. |

---

## 🚀 Começando

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Conta no [Neon](https://neon.tech) (PostgreSQL) para persistência real
- Conta na [Vercel](https://vercel.app) para deploy (opcional para desenvolvimento local)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/devtiagoabreu/toohak.git
cd toohak

# Instale as dependências
npm install --legacy-peer-deps

# Copie o arquivo de variáveis de ambiente
cp .env.example .env.local
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` com as seguintes variáveis:

```env
# Banco de dados (Neon Postgres)
DATABASE_URL=postgresql://user:password@neon-db-endpoint.neon.tech/dbname?sslmode=require

# NextAuth
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=http://localhost:3000

# URL pública da aplicação (usada em SEO e sitemap)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Ably (sala ao vivo - opcional, usa BroadcastChannel por padrão)
NEXT_PUBLIC_ABLY_KEY=sua-chave-publica-ably
ABLY_SECRET_KEY=sua-chave-secreta-ably

# Criptografia
ENCRYPTION_PASSWORD=sua-senha-de-criptografia

# E-mail do sistema (opcional)
SYSTEM_EMAIL_USER=seu-email@gmail.com
SYSTEM_EMAIL_PASSWORD=sua-senha-de-app
```

> 💡 Gere um `NEXTAUTH_SECRET` com: `openssl rand -base64 32`

### Banco de Dados

```bash
# Gere as migrations (requer DATABASE_URL)
npm run db:generate

# Aplique as migrations no Neon
npm run db:migrate

# (Opcional) Abra o Drizzle Studio
npm run db:studio
```

### Execução Local

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🏗️ Estrutura do Projeto

```
toohak/
├── app/                          # Next.js App Router
│   ├── (app)/                    # Rotas autenticadas (shell)
│   │   ├── create/               # Editor de quizzes/histórias/cursos
│   │   ├── library/              # Biblioteca de conteúdos
│   │   ├── courses/              # Página de cursos
│   │   ├── settings/             # Configurações de perfil/conta
│   │   └── page.tsx              # Dashboard
│   ├── auth/                     # Rotas de autenticação
│   │   ├── login/                # Login
│   │   ├── register/             # Cadastro
│   │   ├── verify-email/         # Verificação de e-mail
│   │   └── recovery-codes/       # Códigos de recuperação
│   ├── api/                      # API Routes (Route Handlers)
│   │   ├── quizzes/              # CRUD de quizzes
│   │   ├── stories/              # CRUD de histórias
│   │   ├── courses/              # CRUD de cursos
│   │   ├── auth/                 # NextAuth + registro + verificação
│   │   └── media/suggest/        # Sugestão de mídia por URL
│   ├── join/                     # Página pública para entrar em sessão ao vivo
│   ├── layout.tsx                # Layout raiz (providers + JSON-LD + metadata)
│   ├── robots.ts                 # Robots.txt dinâmico
│   ├── sitemap.ts                # Sitemap XML dinâmico
│   ├── manifest.ts               # Manifest PWA
│   └── globals.css               # Estilos globais
├── components/                   # Componentes React
│   ├── AppShell.tsx              # Shell autenticado (sidebar, topbar, perfil)
│   ├── AuthSessionProvider.tsx   # Provider de sessão NextAuth
│   ├── ThemeProvider.tsx         # Provider de temas
│   ├── Button.tsx                # Botão reutilizável
│   ├── Card.tsx                  # Card reutilizável
│   └── live/                     # Views de sessão ao vivo
├── db/                           # Esquema e migrations do banco
│   ├── schema.ts                 # Definição das tabelas (Drizzle)
│   └── migrations/               # Arquivos SQL de migration
├── lib/                          # Utilitários
│   ├── auth.ts                   # Configuração NextAuth
│   ├── db.ts                     # Conexão Drizzle + Neon
│   ├── site.ts                   # Configuração de site/SEO
│   ├── seo.ts                    # Helpers de SEO
│   ├── userDisplay.ts            # Nome/iniciais do usuário
│   └── realtime.ts               # Ably (lazy) para tempo real
├── __tests__/                    # Testes Vitest + React Testing Library
├── .agents/skills/               # Skills de boas práticas Vercel
├── docs/STATUS.md                # Estado vivo do projeto
└── README.md                     # Este arquivo
```

---

## 🧪 Testes

O projeto usa **Vitest** + **React Testing Library**.

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch
npm run test:watch
```

### Cobertura Atual

| Arquivo de Teste | O que cobre |
|---|---|
| `userDisplay.test.ts` | Funções de exibição de nome e iniciais |
| `AppShell.test.tsx` | Shell autenticado, sessão, perfil |
| `SettingsPage.test.tsx` | Página de configurações |
| `contrast.test.ts` | Contraste de cores (WCAG AA 4.5:1) |
| `auth-flow.test.ts` | Validação de login/cadastro |
| `seo.test.ts` | Rotas públicas/privadas, sitemap, robots |

---

## 🏗️ Build e Deploy

### Build de Produção

```bash
npm run build
```

### Deploy na Vercel

1. Importe o repositório em [vercel.com/new](https://vercel.com/new)
2. Configure o preset **Next.js**
3. Adicione as variáveis de ambiente (incluindo `NEXT_PUBLIC_APP_URL` como **Config**, não Secret)
4. Faça deploy da branch `main`

> ⚠️ `NEXT_PUBLIC_APP_URL` deve ser do tipo **Config** para estar disponível no navegador e no build.

---

## 🔍 SEO e Indexação

O Toohak está preparado para indexação no Google:

- ✅ Sitemap dinâmico (`/sitemap.xml`)
- ✅ Robots dinâmico (`/robots.txt`) — rotas privadas desindexadas
- ✅ JSON-LD (Organization, WebSite, SoftwareApplication)
- ✅ Open Graph e Twitter Cards
- ✅ Metadados por página (título, descrição, canonical)
- ✅ Ícones/favicon e manifest PWA

Para concluir a indexação:
1. Configure `NEXT_PUBLIC_APP_URL` na Vercel
2. Verifique a propriedade no [Google Search Console](https://search.google.com/search-console/)
3. Envie o sitemap: `https://toohak-jet.vercel.app/sitemap.xml`

---

## 🛠️ Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm start` | Inicia o servidor de produção |
| `npm test` | Executa os testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run db:generate` | Gera migrations do Drizzle |
| `npm run db:migrate` | Aplica migrations no banco |
| `npm run db:studio` | Abre o Drizzle Studio |

---

## 👥 Sobre o Criador

**Tiago de Abreu** — marido da Marina e pai da Rosa, Ágatha e Cecília.

- GitHub: [@devtiagoabreu](https://github.com/devtiagoabreu)
- Deploy: [https://toohak-jet.vercel.app](https://toohak-jet.vercel.app)

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona minha feature'`)
4. Push para a branch (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

<div align="center">
  <sub>Feito com ❤️ por Tiago de Abreu</sub>
</div>
