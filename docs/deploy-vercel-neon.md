# Deploy e Persistência — Toohak na Vercel com Neon DB

Documento de engenharia que desenha a arquitetura completa de deploy e persistência para colocar o Toohak no ar utilizando Next.js, Vercel e Neon DB (PostgreSQL Serverless).

---

## 1. Stack Tecnológica Escolhida

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| Frontend e Backend | Next.js (App Router) | Telas dos jogadores, rotas de API e Server Actions em um único repositório |
| Hospedagem e Infraestrutura | Vercel | Deploy contínuo integrado ao GitHub, funções Serverless |
| Banco de Dados Relacional | Neon DB (PostgreSQL Serverless) | Dados duráveis: usuários, quizzes, perguntas, alternativas, histórico de relatórios |

---

## 2. O Desafio Arquitetural: Vercel vs. WebSockets

A Vercel opera com funções Serverless (sem servidor fixo). Quando um usuário faz uma requisição, um container sobe, processa e morre logo depois.

**O Problema:** Servidores Serverless não mantêm conexões de WebSocket abertas de forma persistente como um servidor Node.js tradicional (tipo VPS ou Docker na AWS/Render) faria.

**A Solução de Engenharia:** Para contornar isso na Vercel, o backend do Toohak delega a camada de tempo real para um serviço externo gerenciado de WebSockets, como **Ably** ou **Pusher**.

O Next.js apenas recebe o clique via requisição HTTP rápida (ou Server Action), valida a resposta e publica o evento no canal do Ably, que transmite instantaneamente para a tela do apresentador.

---

## 3. Modelagem do Banco de Dados no Neon DB (PostgreSQL)

O Neon DB traz o poder do PostgreSQL com separação de armazenamento e computação, permitindo escalar o banco sob demanda.

```sql
-- Tabela de Usuários (Professores/Criadores)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Quizzes
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Questões
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    time_limit INT DEFAULT 30, -- em segundos
    points_multiplier INT DEFAULT 1000,
    order_index INT NOT NULL
);

-- Tabela de Alternativas
CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    color_code VARCHAR(20) -- ex: 'red', 'blue', etc.
);
```

---

## 4. Estrutura de Pastas no Next.js (App Router)

```
toohak/
├── app/
│   ├── api/
│   │   ├── quiz/          # Rotas para CRUD de criar/editar quizzes no Neon DB
│   │   └── game/          # Endpoints para gerenciar salas ativas
│   ├── play/              # Tela do jogador (mobile-first para apertar as cores)
│   ├── host/              # Tela do apresentador (exibida na TV/Projetor)
│   └── dashboard/         # Painel administrativo do criador do quiz
├── lib/
│   ├── db.ts              # Conexão com o Neon DB usando Drizzle ORM ou Prisma
│   └── realtime.ts        # Configuração do cliente de WebSockets (ex: Ably/Pusher)
└── package.json
```

---

*Documento de referência para deploy e persistência do Toohak na stack Next.js + Vercel + Neon DB.*