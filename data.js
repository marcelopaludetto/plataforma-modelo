// Modelo Computacional — course data
window.COURSE = {
  title: "Modelo Computacional",
  subtitle: "Pensamento Computacional Aplicado",
  units: [
    { id: 1, num: "U01", title: "Fundamentos de Modelagem", state: "done" },
    { id: 2, num: "U02", title: "Sistemas Determinísticos", state: "done" },
    { id: 3, num: "U03", title: "Modelos Estocásticos", state: "active" },
    { id: 4, num: "U04", title: "Simulação Discreta", state: "todo" },
    { id: 5, num: "U05", title: "Modelos Baseados em Agentes", state: "todo" },
    { id: 6, num: "U06", title: "Validação e Verificação", state: "todo" },
    { id: 7, num: "U07", title: "Aplicações em Sistemas Complexos", state: "todo" },
  ],
  unit: {
    num: "Unidade 03",
    weeks: "Semanas 5 — 6",
    duration: "≈ 8 h",
    title: "Modelos Estocásticos",
    titleEm: "Estocásticos",
    desc: "Compreender como a aleatoriedade se incorpora em modelos computacionais. Construir simulações de Monte Carlo, processos de Markov e cadeias de eventos para descrever fenômenos com incerteza.",
    objectives: [
      { num: "01", text: "Diferenciar modelos determinísticos e estocásticos a partir de exemplos aplicados." },
      { num: "02", text: "Implementar simulações de Monte Carlo em Python para estimar grandezas integrais." },
      { num: "03", text: "Modelar processos com cadeias de Markov e analisar suas propriedades de convergência." },
    ],
    progress: { pct: 42, completed: 3, total: 7, time: "3h 20m" },
    lessons: [
      { id: "l1", title: "Introdução à aleatoriedade em modelos", kind: "Vídeo", time: "18 min", done: true,
        desc: "Por que introduzimos aleatoriedade? Discutimos os limites do determinismo, ruído de medição e a diferença entre incerteza epistêmica e aleatória." },
      { id: "l2", title: "Variáveis aleatórias e distribuições", kind: "Leitura", time: "25 min", done: true,
        desc: "Revisão de distribuições uniformes, normais, exponenciais e suas aplicações. Geradores pseudo-aleatórios em NumPy." },
      { id: "l3", title: "Simulação de Monte Carlo: fundamentos", kind: "Notebook", time: "40 min", done: true,
        desc: "Construímos do zero uma estimativa de π, em seguida estimamos integrais definidas via amostragem. Notebook interativo em Python." },
      { id: "l4", title: "Cadeias de Markov em tempo discreto", kind: "Vídeo", time: "32 min", done: false,
        desc: "Definição formal, matrizes de transição, distribuições estacionárias. Exemplo: comportamento de navegação em páginas web." },
      { id: "l5", title: "Implementação: PageRank simplificado", kind: "Notebook", time: "55 min", done: false,
        desc: "Implementação passo a passo de uma versão simplificada do algoritmo PageRank usando cadeias de Markov." },
      { id: "l6", title: "Estudo de caso: difusão de partículas", kind: "Estudo", time: "45 min", done: false,
        desc: "Aplicação em movimento browniano. Comparamos resultados analíticos com simulações." },
      { id: "l7", title: "Discussão e síntese da unidade", kind: "Fórum", time: "30 min", done: false,
        desc: "Discussão guiada com pares sobre os limites e potências dos modelos estocásticos." },
    ],
    resources: [
      { kind: "Notebook", title: "MonteCarlo_Pi.ipynb", meta: "Jupyter · 2.1 MB", icon: "code" },
      { kind: "Dataset", title: "transicao_estados.csv", meta: "CSV · 184 KB · 1.2k linhas", icon: "data" },
      { kind: "Bibliografia", title: "Stochastic Modeling — Pinsky & Karlin", meta: "Capítulos 3—4 · PDF", icon: "book" },
      { kind: "Slides", title: "Aula 03 — Markov Chains", meta: "PDF · 38 páginas", icon: "slides" },
    ],
    assignment: {
      title: "Projeto: Simulando uma fila M/M/1",
      desc: "Implemente em Python uma simulação de uma fila M/M/1 com taxa de chegada e atendimento configuráveis. Compare os resultados empíricos com as fórmulas analíticas e produza um relatório de até 4 páginas.",
      due: "28 de abril",
      weight: "20%",
      submission: "Notebook + PDF",
    }
  }
};
