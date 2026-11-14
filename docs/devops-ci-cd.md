# DevOps, CI/CD e Configuração de Produção — Toohak

Documento de engenharia e DevOps que fecha a parte de infraestrutura, CI/CD e configuração do ambiente de produção para colocar o Toohak rodando perfeitamente na Vercel com o Neon DB, garantindo automação, segurança e performance.

---

## 1. Arquivo de Configuração de Deploy (vercel.json)

Embora a Vercel detecte projetos Next.js automaticamente, podemos explicitamente configurar variáveis de ambiente e regras de build no arquivo `vercel.json` na raiz do projeto:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## 2. Configuração do Banco de Dados com Drizzle ORM (lib/db.ts)

Para conectar o Next.js ao Neon DB de forma otimizada para ambientes Serverless, utilizamos o Drizzle ORM combinado com o driver nativo `@neondatabase/serverless`, que suporta conexões HTTP/WebSocket ideais para a Vercel:

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

// Garante que a string de conexão existe
const connectionString = process.env.DATABASE_URL!;

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
```

---

## 3. Pipeline de CI/CD (GitHub Actions + Vercel)

A estratégia de DevOps para o Toohak utiliza integração contínua automatizada:

### Versionamento

O código é empurrado para o GitHub (`main` para produção, `staging` para homologação).

### Deploy Automático na Vercel

- Cada **Push** ou **Pull Request** na branch `main` dispara um build automatizado na Vercel.
- A Vercel executa o build e roda as migrações do banco de dados (via Drizzle Kit) utilizando as credenciais seguras injetadas nas Environment Variables da plataforma.
- **Branch Previews:** A Vercel cria automaticamente um link de homologação exclusivo para cada Pull Request, permitindo testar novas funcionalidades de UI ou correções de bugs antes de irem para o ar.

---

## 4. Script de Migração do Banco de Dados (CI/CD)

O script de migração roda automaticamente nas pipelines de CI/CD utilizando o Drizzle Kit:

```bash
# Instala dependências
npm install

# Gera as migrações SQL a partir do schema do Drizzle
npx drizzle-kit generate

# Aplica as migrações no banco de produção (Neon DB)
npx drizzle-kit migrate
```

Variáveis de ambiente necessárias na Vercel e no GitHub Actions:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | String de conexão do Neon DB |
| `NEXT_PUBLIC_ABLY_KEY` | Chave pública do Ably (tempo real) |
| `ABLY_SECRET_KEY` | Chave secreta do Ably (somente servidor) |
| `NEXTAUTH_SECRET` | Segredo para autenticação NextAuth |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação |

---

*Documento de referência para infraestrutura, CI/CD e configuração de produção do Toohak.*