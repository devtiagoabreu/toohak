# Toohak: Identidade e Arquitetura de Software

## Visão Geral

**Toohak: A Plataforma de Aprendizado Gamificado e Apresentações Interativas**

### Público-alvo
- Instituições de ensino (escolas, universidades)
- Empresas (treinamento corporativo)
- Palestrantes e organizadores de eventos

### Objetivo Principal
Engajar o público através da gamificação, tornando o aprendizado e as apresentações mais divertidos, interativos e eficazes.

---

## Funcionalidades Principais (Versão Paga)

### 1. Tipos de Perguntas Avançados

- **Slides de Conteúdo Nativo:** Insira slides de texto, imagens e vídeos diretamente entre as perguntas, eliminando a necessidade de outras ferramentas de apresentação.
- **Nuvem de Palavras (Word Cloud):** Visualize as respostas dos jogadores em tempo real, com as palavras mais frequentes em destaque.
- **Perguntas de Resposta Aberta (Open-Ended):** Colete feedbacks e opiniões com respostas curtas e livres.
- **Quebra-Cabeça (Puzzle):** Desafie os jogadores a ordenar respostas ou etapas de um processo.
- **Enquetes e Votações (Poll):** Colete opiniões e feedbacks sem respostas certas ou erradas.
- **Desenho (Draw):** Estimule a criatividade e a expressão com respostas desenhadas diretamente na tela.

### 2. Modos de Jogo e Dinâmicas

- **Modo Equipe (Team Mode):** Promova a colaboração e a competição estratégica entre grupos de jogadores.
- **Modo Desafio / Tarefa Assíncrona (Student-Paced Challenge):** Permita que os jogadores joguem no próprio ritmo, de onde e quando quiserem.
- **Modos de Batalha e Jogos de Ação:** Minigames temáticos que tornam o aprendizado ainda mais divertido e dinâmico.

### 3. Gestão e Relatórios

- **Alta Concorrência:** Suporte para centenas ou milhares de jogadores simultâneos sem perdas de desempenho.
- **Controle de Acesso e Contas de Alunos:** Gerencie perfis e rastreie o progresso individual dos alunos.
- **Relatórios Detalhados em Excel/CSV:** Exporte dados detalhados sobre o desempenho dos jogadores e as perguntas.
- **Visão Geral e Diagnóstico:** Painéis visuais para identificar os conceitos mais e menos compreendidos.

### 4. Customização e Marca

- **Inserção de Logotipo:** Personalize as telas de jogo e os relatórios com a marca da sua instituição ou empresa.
- **Banco de Mídia Integrado:** Acesse bibliotecas de imagens e GIFs para enriquecer as suas perguntas.

---

## Engenharia de Software (Toohak)

### Comunicação em Tempo Real
Utilização de WebSockets para conexões persistentes e bidirecionais, garantindo baixa latência nas interações.

### Processamento Assíncrono
Filas de mensagens e Pub/Sub (Publicador/Assinante) para lidar com picos de tráfego de forma escalável e eficiente.

### In-Memory Data Stores (Redis)
Cache em memória para armazenar o estado das partidas, permitindo operações atômicas em microssegundos.

### Escalabilidade Horizontal
Balanceadores de carga e microsserviços distribuídos para suportar um grande volume de usuários simultâneos.

---

## Arquitetura e DevOps (Toohak)

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| Frontend e Backend | Next.js (App Router) | Aplicação web moderna e eficiente |
| Hospedagem | Vercel | Deploy contínuo e infraestrutura Serverless |
| Banco de Dados | Neon DB (PostgreSQL Serverless) | Persistência de dados escalável e sob demanda |
| WebSockets Gerenciados | Ably ou Pusher | Camada de tempo real em ambientes Serverless |
| ORM | Drizzle ORM | Interação com Neon DB otimizada |
| CI/CD | GitHub Actions + Vercel | Automação e segurança |

---

## Toohak: Versão Gratuita

A versão gratuita do Toohak mantém todos os recursos essenciais para aprendizado gamificado, com cadastro por email, confirmação de conta, códigos de recuperação para 2FA, e suporte a configuração de SMTP próprio e chaves de API de IA (Gemini, ChatGPT, Groq) por usuário.

---

*Documento de identidade e arquitetura do Toohak.*