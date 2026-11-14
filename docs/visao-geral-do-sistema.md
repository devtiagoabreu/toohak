# Visão Geral de Requisitos do Sistema: Toohak

Documento central de desenvolvimento do Toohak — plataforma de aprendizado gamificado e apresentações interativas.

---

## Parte 1: O que é o Toohak e Como se Brinca? (Explicação para Crianças)

Imagine que você está na escola ou em uma festa, e a televisão da sala mostra um jogo colorido com uma musiquinha animada. Cada pergunta aparece na tela grande, e você tem um celular ou tablet na mão.

### O Objetivo
Acertar as perguntas o mais rápido possível para ganhar pontos e subir no pódio (1º, 2º e 3º lugar).

### Como funciona o jogo passo a passo

**A Tela Principal (O Mestre)**
Quem comanda o jogo (o professor ou apresentador) coloca a pergunta na tela grande junto com quatro blocos coloridos (Vermelho com um triângulo, Azul com um losango, Amarelo com um círculo e Verde com um quadrado).

**O Seu Aparelho (O Controle)**
No seu celular ou tablet aparecem apenas as formas geométricas e cores. Você olha para a pergunta na tela grande e aperta no seu celular a cor/forma certa.

**A Corrida dos Pontos**
Quem responde mais rápido ganha mais pontos! Se errar, não ganha pontos, mas não é eliminado. No final, o pódio comemora os vencedores.

---

## Parte 2: Especificação Técnica e Funcional (Versão Paga do Toohak)

Do ponto de vista de engenharia de software, a versão paga remove limitações de capacidade, adiciona novos tipos de nós de entrada de dados (tipos de perguntas), ferramentas analíticas avançadas e opções de customização de marca (white-label).

A seguir, o inventário completo item por item das funcionalidades disponíveis na versão paga:

### 1. Tipos de Perguntas e Blocos de Conteúdo Avançados

Enquanto a versão gratuita limita-se ao básico de múltipla escolha, a paga libera uma suíte completa de interatividade:

- **Slides de Conteúdo Nativo:** Permite inserir slides tradicionais de texto, imagens e vídeos diretamente entre as perguntas, eliminando a necessidade de usar o PowerPoint ou Google Slides separado.
- **Nuvem de Palavras (Word Cloud):** Os jogadores digitam uma palavra curta como resposta. O sistema gera uma nuvem visual onde as palavras mais repetidas aparecem maiores.
- **Perguntas de Resposta Aberta (Open-Ended):** Os participantes digitam uma frase livre curta. As respostas aparecem na tela para votação ou discussão em grupo.
- **Quebra-Cabeça (Puzzle):** Os jogadores precisam colocar quatro respostas na ordem correta (ex: ordenar eventos cronológicos ou etapas de um processo).
- **Enquetes e Votações (Poll):** Perguntas sem resposta "certa" ou "errada", ideais para coletar opiniões, feedbacks ou fazer votações democráticas.
- **Desenho (Draw):** Permite que os participantes desenhem a resposta diretamente na tela do dispositivo touch (ótimo para fórmulas, esboços rápidos ou criatividade).

### 2. Modos de Jogo e Dinâmicas de Grupo

- **Modo Equipe (Team Mode):** Os jogadores podem competir divididos em equipes (com ou sem dispositivos compartilhados), promovendo colaboração estratégica.
- **Modo Desafio / Tarefa Assíncrona (Student-Paced Challenge):** O criador do jogo gera um link para o quiz rodar sozinho. Os jogadores podem entrar dias depois e jogar no próprio ritmo de casa.
- **Modos de Batalha e Jogos de Ação:** Minigames temáticos (como torres de blocos ou corridas espaciais) onde as respostas corretas ajudam a construir estruturas ou avançar no cenário do jogo.

### 3. Gestão de Participantes e Capacidade de Escala

- **Alta Concorrência:** Suporte a centenas ou milhares de jogadores simultâneos na mesma sala virtual sem queda de desempenho ou latência nos cliques.
- **Controle de Acesso e Contas de Alunos:** Criação de perfis gerenciados para turmas inteiras, permitindo rastrear o progresso individual ao longo do tempo.

### 4. Relatórios, Análises e Inteligência de Dados (Analytics)

- **Relatórios Detalhados em Excel/CSV:** Exportação de planilhas completas com o aproveitamento de cada aluno, quais perguntas tiveram maior taxa de erro e o tempo médio de resposta.
- **Visão Geral e Diagnóstico:** Painéis visuais que indicam instantaneamente quais conceitos a turma entendeu bem e quais precisam de reforço pedagógico.

### 5. Customização e Recursos de Marca (Branding)

- **Inserção de Logotipo:** Capacidade de substituir a marca padrão do Toohak pelo logotipo da empresa ou da escola nas telas de carregamento e nos relatórios.
- **Banco de Mídia Integrado:** Acesso ilimitado a bibliotecas de imagens em alta definição e GIFs animados direto no criador de perguntas.

---

## Arquitetura de Tempo Real (Complemento)

Para suportar milhares de cliques simultâneos, o Toohak utiliza:

- **WebSockets** como canal principal de comunicação bidirecional entre dispositivos dos jogadores e a tela mestre, garantindo baixa latência na transmissão de respostas e atualizações de placar.
- **Pub/Sub (Publicar/Assinar)** para distribuir eventos de sala (nova pergunta, resposta recebida, mudança de placar) para todos os clientes conectados naquela sala.
- **Balanceamento de carga** com sticky sessions ou Redis Adapter para escalar horizontalmente múltiplos nós de socket sem perder o estado das salas ativas.
- **Banco de dados em memória (Redis)** para armazenar o estado volátil das salas (pergunta atual, respostas recebidas, temporizadores) com acesso de milissegundos.
- **Persistência assíncrona** de resultados finais em banco relacional/NoSQL após o encerramento de cada partida, evitando bloqueio no caminho crítico de tempo real.
- **Rate limiting e validação de assinatura** por dispositivo para evitar spam de cliques e garantir integridade das respostas.

---

*Documento gerado como referência central de requisitos e escopo funcional do Toohak (versão paga/Pro/Premium).*