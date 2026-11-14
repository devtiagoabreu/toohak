# Deploy Toohak na Vercel + Neon DB

## Passo 1: Banco de Dados Neon

1. Acesse https://neon.tech e crie uma conta
2. Crie um novo projeto (ex: "toohak")
3. Copie a string de conexão (DATABASE_URL) — formato:
   `postgresql://user:password@neon-db-endpoint.neon.tech/dbname?sslmode=require`

## Passo 2: Variáveis de Ambiente na Vercel

Acesse https://vercel.com/dashboard > seu projeto > Settings > Environment Variables

Adicione cada uma das seguintes variáveis:

| Nome | Valor |
|------|-------|
| `DATABASE_URL` | (sua string de conexão do Neon) |
| `NEXTAUTH_SECRET` | `toohak-nextauth-secret-2026-change-in-production` |
| `NEXTAUTH_URL` | `https://seu-dominio.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://seu-dominio.vercel.app` |
| `NEXT_PUBLIC_ABLY_KEY` | (sua chave pública Ably) |
| `ABLY_SECRET_KEY` | (sua chave secreta Ably) |
| `ENCRYPTION_PASSWORD` | `Toohak_Enc_Pass_2026_xK9mP2vL8nQ4wR7tY3uI6oP1aS5dF7gH8jK0lZ2xC4vB6nM8` |
| `SYSTEM_EMAIL_USER` | `toohakgame@gmail.com` |
| `SYSTEM_EMAIL_PASSWORD` | `grxv czdt ezzx vxbs` |
| `GEMINI_API_KEY` | (sua chave Gemini) |
| `GROQ_API_KEY` | (sua chave Groq) |

## Passo 3: Migrações do Banco

Após conectar o repositório na Vercel e adicionar as variáveis, rode as migrações localmente ou via Vercel CLI:

```bash
npm install
npm run db:generate
npm run db:migrate
```

Ou diretamente no Neon DB usando o SQL do arquivo `docs/deploy-vercel-neon.md`.

## Passo 4: Deploy

1. Conecte seu repositório GitHub na Vercel
2. O build será executado automaticamente
3. Após o deploy, acesse `https://seu-dominio.vercel.app`

## Arquivos de Referência

- `.env` — variáveis locais (desenvolvimento)
- `.env.vercel` — variáveis para copiar na Vercel
- `docs/deploy-vercel-neon.md` — documentação completa de deploy
- `docs/devops-ci-cd.md` — CI/CD e migrações

## Segurança

⚠️ Nunca commite o arquivo `.env` com valores reais. Ele está no `.gitignore`.
Use apenas o `.env.example` como modelo no repositório.
