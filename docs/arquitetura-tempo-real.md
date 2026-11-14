# Arquitetura de Tempo Real e Backend — Toohak

Documento de engenharia que detalha os pilares de alta escala necessários para sustentar milhares de jogadores simultâneos na mesma sala virtual, incluindo o algoritmo matemático de pontuação por milissegundo.

---

## 1. O Problema do Thundering Herd (Efeito Manada)

Quando milhares de jogadores entram em uma mesma sala e enviam respostas no exato mesmo segundo, o sistema enfrenta um pico massivo de requisições simultâneas. Para evitar que o servidor caia ou que o placar trave, a arquitetura deve priorizar:

- **Baixa latência**
- **Concorrência extrema**
- **Persistência distribuída**

---

## 2. Protocolo de Comunicação: WebSockets vs. HTTP Tradicional

Em uma aplicação web comum, o navegador usa requisições HTTP tradicionais (Request-Response), onde cada clique exigiria abrir e fechar uma nova conexão. Isso geraria atraso inaceitável.

### Conexões Persistentes via WebSockets

Cada cliente (apresentador na tela grande e participantes nos celulares) mantém uma conexão bidirecional persistente via WebSockets (ou protocolos como Socket.io / gRPC para comunicação interna).

**Vantagem:** A conexão já está aberta. Quando um jogador clica em uma cor, ele apenas dispara um pacote de dados binário minúsculo através desse canal aberto, eliminando o custo do handshake de rede a cada interação.

---

## 3. Backend e In-Memory Data Stores (Redis)

Se milhares de cliques chegassem diretamente em um banco de dados relacional tradicional (PostgreSQL ou MySQL) a cada milissegundo, os discos rígidos e as tabelas travariam por locks de concorrência.

### Camada de Cache em Memória (Redis)

O coração do backend do Toohak é o Redis (ou banco NoSQL em memória equivalente).

Quando uma sala é criada, seu estado completo — perguntas, jogadores ativos, pontuações provisórias e estado atual do timer — é mantido inteiramente na memória RAM dos servidores.

O Redis lida com operações atômicas em microssegundos. Quando o clique de um usuário chega, a pontuação é calculada e somada instantaneamente na memória RAM antes de qualquer gravação em disco.

---

## 4. Processamento Assíncrono e Mensageria (Pub/Sub)

Para garantir que o servidor que recebe os cliques não fique sobrecarregado ao tentar atualizar a tela de todos ao mesmo tempo, a arquitetura utiliza um sistema de mensageria baseado em Pub/Sub (Publicador/Assinante):

1. **Ingestão:** Servidores de borda (Gateway WebSockets) recebem os pacotes de cliques dos celulares.
2. **Fila e Publicação:** Esses eventos são jogados em um barramento de mensagens de alta performance (Apache Kafka, RabbitMQ ou o próprio sistema de canais do Redis).
3. **Distribuição:** Servidores de processamento consomem esses eventos, calculam quem respondeu mais rápido (usando a precisão de milissegundos do carimbo de data/hora do servidor) e publicam a atualização do placar de volta para todos os clientes conectados àquela sala em frações de segundo.

---

## 5. Escalabilidade Horizontal e Balanceamento de Carga

Nenhum servidor isolado aguenta centenas de milhares de jogadores ativos simultâneos espalhados pelo mundo.

### Load Balancers

Distribuem o tráfego de entrada usando algoritmos inteligentes (como Least Connections) para servidores de aplicação diferentes.

### Microsserviços Distribuídos

- Um serviço gerencia autenticação e criação de quizzes.
- Outro serviço isolado (altamente otimizado em Go, Node.js ou Rust) gerencia exclusivamente o ciclo de vida das salas ativas e o tráfego de cliques em tempo real.

### Sticky Sessions

Garante que o WebSocket de um usuário específico permaneça roteado para o mesmo nó de servidor enquanto a partida estiver rolando, otimizando o fluxo de dados.

---

## 6. Algoritmo Matemático de Pontuação

A fórmula oficial implementada no backend calcula os pontos de uma resposta correta usando uma função linear decrescente com limite inferior (floor), garantindo que quem acerta nunca saia de mãos vazias, mas premiando fortemente quem responde mais rápido.

### Fórmula

```
Pontos = floor((1 - (Tempo de Resposta / Tempo Limite da Questão × 2)) × Pontos Máximos)
```

Onde:

| Variável | Descrição |
|----------|-----------|
| **Pontos Máximos** | Geralmente 1.000 pontos por pergunta padrão |
| **Tempo Limite da Questão** | Tempo total estipulado para a pergunta (ex: 30 segundos) |
| **Tempo de Resposta** | Registro exato de quando o clique foi processado no servidor (em milissegundos) |
| **floor(...)** | Função piso, arredonda para baixo para valores inteiros limpos no placar |

### Exemplo Prático

Questão com 1.000 pontos máximos e cronômetro de 30 segundos:

| Usuário | Tempo de Resposta | Cálculo | Pontos |
|---------|-------------------|---------|--------|
| Usuário A (super rápido) | 2 segundos (2.000 ms) | `(1 - (2 / 30 × 2)) × 1000 = (1 - 2/60) × 1000` | ≈ 967 |
| Usuário B (intermediário) | 15 segundos | `(1 - (15 / 30 × 2)) × 1000 = (1 - 0.25) × 1000` | 750 |
| Usuário C (lento, mas correto) | 30 segundos | `(1 - (30 / 30 × 2)) × 1000 = (1 - 0.5) × 1000` | 500 |

### Decisões de Engenharia

**O Piso de 50%:** O divisor utiliza o tempo limite multiplicado por 2. Isso significa que, independentemente de quão devagar o usuário responda (mesmo faltando frações de segundo para o cronômetro zerar), ele sempre ganhará pelo menos 50% dos pontos máximos caso acerte. Isso evita a frustração de zerar a pontuação de quem acertou uma questão difícil só por ter demorado a raciocinar.

**Respostas Erradas:** Se o jogador errar a alternativa, o algoritmo atribui imediatamente 0 pontos, independentemente da velocidade do clique.

---

## 7. Implementação de Referência (JavaScript/TypeScript)

```typescript
interface ScoreParams {
  responseTimeMs: number;
  timeLimitSeconds: number;
  maxPoints: number;
}

export function calculateScore(params: ScoreParams): number {
  const { responseTimeMs, timeLimitSeconds, maxPoints } = params;

  if (responseTimeMs < 0) return 0;

  const responseTimeSeconds = responseTimeMs / 1000;
  const ratio = responseTimeSeconds / (timeLimitSeconds * 2);
  const rawScore = (1 - ratio) * maxPoints;

  return Math.max(0, Math.floor(rawScore));
}

// Exemplos
console.log(calculateScore({ responseTimeMs: 2000, timeLimitSeconds: 30, maxPoints: 1000 })); // 967
console.log(calculateScore({ responseTimeMs: 15000, timeLimitSeconds: 30, maxPoints: 1000 })); // 750
console.log(calculateScore({ responseTimeMs: 30000, timeLimitSeconds: 30, maxPoints: 1000 })); // 500
```

---

*Documento de referência técnica para a arquitetura de tempo real e backend do Toohak.*