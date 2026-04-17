// PageRank simplified — power iteration on a small directed web graph
const { useState, useEffect, useRef, useCallback, useMemo } = React;

function PageRankSim() {
  const PAGES = [
    { id: 'A', label: 'Início',     x: 0.20, y: 0.25 },
    { id: 'B', label: 'Catálogo',   x: 0.55, y: 0.18 },
    { id: 'C', label: 'Produto',    x: 0.85, y: 0.40 },
    { id: 'D', label: 'Reviews',    x: 0.78, y: 0.78 },
    { id: 'E', label: 'Carrinho',   x: 0.40, y: 0.82 },
    { id: 'F', label: 'Suporte',    x: 0.12, y: 0.62 },
  ];

  // out-edges (adjacency list)
  const LINKS = {
    A: ['B', 'F'],
    B: ['C', 'A', 'D'],
    C: ['D', 'E'],
    D: ['B', 'C'],
    E: ['A'],
    F: ['A', 'D', 'E'],
  };

  const SIZE_W = 380;
  const SIZE_H = 300;
  const N = PAGES.length;
  const idx = Object.fromEntries(PAGES.map((p,i) => [p.id, i]));

  // Build column-stochastic transition matrix M for power iteration:
  // r' = d * M * r + (1-d)/N * 1
  const buildM = () => {
    const M = Array.from({length: N}, () => Array(N).fill(0));
    for (let j = 0; j < N; j++) {
      const out = LINKS[PAGES[j].id];
      if (!out || out.length === 0) {
        // dangling — distribute uniformly
        for (let i = 0; i < N; i++) M[i][j] = 1 / N;
      } else {
        for (const t of out) M[idx[t]][j] = 1 / out.length;
      }
    }
    return M;
  };

  const M = useMemo(buildM, []);
  const [damping, setDamping] = useState(0.85);

  const [rank, setRank] = useState(() => Array(N).fill(1 / N));
  const [iter, setIter] = useState(0);
  const [history, setHistory] = useState([Array(N).fill(1 / N)]); // for convergence chart
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(2); // iterations per second
  const [pulseEdges, setPulseEdges] = useState(false);

  const tickRef = useRef(null);

  // theoretical PageRank (converged) for current damping
  const theoretical = useMemo(() => {
    let r = Array(N).fill(1 / N);
    for (let k = 0; k < 200; k++) {
      const next = Array(N).fill((1 - damping) / N);
      for (let i = 0; i < N; i++) {
        let s = 0;
        for (let j = 0; j < N; j++) s += M[i][j] * r[j];
        next[i] += damping * s;
      }
      r = next;
    }
    return r;
  }, [M, damping]);

  const reset = useCallback(() => {
    setRunning(false);
    const init = Array(N).fill(1 / N);
    setRank(init);
    setIter(0);
    setHistory([init]);
  }, []);

  const step = useCallback(() => {
    setRank(prev => {
      const next = Array(N).fill((1 - damping) / N);
      for (let i = 0; i < N; i++) {
        let s = 0;
        for (let j = 0; j < N; j++) s += M[i][j] * prev[j];
        next[i] += damping * s;
      }
      setHistory(h => {
        const nh = [...h, next];
        return nh.length > 30 ? nh.slice(nh.length - 30) : nh;
      });
      setIter(it => it + 1);
      setPulseEdges(true);
      setTimeout(() => setPulseEdges(false), 300);
      return next;
    });
  }, [M, damping]);

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(step, 1000 / speed);
    return () => clearInterval(tickRef.current);
  }, [running, speed, step]);

  // diff from theoretical
  const err = Math.sqrt(rank.reduce((s, r, i) => s + (r - theoretical[i])**2, 0));

  // chart geometry
  const CHART_W = 360, CHART_H = 90;
  const yMin = 0, yMax = 0.42;
  const xMax = Math.max(history.length - 1, 1);
  const sx = (i) => (i / xMax) * CHART_W;
  const sy = (v) => CHART_H - ((v - yMin) / (yMax - yMin)) * CHART_H;
  const lineColors = ['oklch(0.45 0.15 265)', 'oklch(0.55 0.13 200)', 'oklch(0.5 0.14 30)', 'oklch(0.5 0.13 150)', 'oklch(0.5 0.14 320)', 'oklch(0.4 0.05 260)'];

  // sorted ranking
  const ranked = PAGES.map((p, i) => ({ ...p, rank: rank[i], theo: theoretical[i], idx: i })).sort((a, b) => b.rank - a.rank);
  const maxRank = Math.max(...rank);

  return (
    <div className="mk pr">
      <div className="mc-head">
        <div>
          <div className="mc-eyebrow">Notebook interativo</div>
          <div className="mc-title">PageRank <em>simplificado</em></div>
        </div>
        <div className="mc-readout">
          <div className="readout-pi">
            <span className="readout-num">{iter}</span>
            <span className="readout-label">iterações</span>
          </div>
        </div>
      </div>

      <div className="mk-body pr-body">
        <div className="mk-left">
          {/* Graph */}
          <div className="mk-graph" style={{aspectRatio: `${SIZE_W} / ${SIZE_H}`}}>
            <svg viewBox={`0 0 ${SIZE_W} ${SIZE_H}`} width="100%" height="100%">
              {/* edges */}
              {PAGES.map((from, j) =>
                LINKS[from.id].map((to, k) => {
                  const i = idx[to];
                  const x1 = from.x * SIZE_W, y1 = from.y * SIZE_H;
                  const x2 = PAGES[i].x * SIZE_W, y2 = PAGES[i].y * SIZE_H;
                  const dx = x2 - x1, dy = y2 - y1;
                  const len = Math.hypot(dx, dy);
                  const r = 16 + rank[i] * 80; // shorten to nodes' scaled radius
                  const r2 = 16 + rank[j] * 80;
                  const ux = dx / len, uy = dy / len;
                  const sxp = x1 + ux * r2, syp = y1 + uy * r2;
                  const exp_ = x2 - ux * r, eyp = y2 - uy * r;
                  return (
                    <line
                      key={`${from.id}-${to}`}
                      x1={sxp} y1={syp} x2={exp_} y2={eyp}
                      stroke="var(--ink-3)"
                      strokeWidth="0.75"
                      opacity={pulseEdges ? 0.7 : 0.35}
                      markerEnd="url(#pr-arrow)"
                      style={{transition: 'opacity 200ms ease'}}
                    />
                  );
                })
              )}

              {/* nodes — radius scales with rank */}
              {PAGES.map((p, i) => {
                const r = 16 + rank[i] * 80;
                return (
                  <g key={p.id} transform={`translate(${p.x * SIZE_W}, ${p.y * SIZE_H})`}>
                    <circle
                      r={r}
                      fill={rank[i] === maxRank ? 'var(--accent)' : 'var(--accent-soft)'}
                      stroke={rank[i] === maxRank ? 'var(--accent)' : 'var(--accent)'}
                      strokeWidth="1.25"
                      opacity={rank[i] === maxRank ? 0.95 : 0.85}
                      style={{transition: 'r 400ms cubic-bezier(.2,.7,.2,1), fill 300ms ease'}}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontFamily="var(--font-mono)"
                      fontSize="13"
                      fontWeight="500"
                      fill={rank[i] === maxRank ? 'white' : 'var(--accent-ink)'}
                    >{p.id}</text>
                    <text
                      textAnchor="middle"
                      y={r + 14}
                      fontFamily="var(--font-ui)"
                      fontSize="10.5"
                      fill="var(--ink-2)"
                    >{p.label}</text>
                  </g>
                );
              })}

              <defs>
                <marker id="pr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-3)"/>
                </marker>
              </defs>
            </svg>
          </div>

          {/* convergence chart */}
          <div className="mc-chart">
            <div className="chart-label">
              <span>Convergência por página</span>
              <span className="chart-pi">‖r − r∞‖ = {err.toFixed(4)}</span>
            </div>
            <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} preserveAspectRatio="none">
              <rect x="0" y="0" width={CHART_W} height={CHART_H} fill="transparent" stroke="var(--line)" strokeWidth="0.75"/>
              {[0.1, 0.2, 0.3, 0.4].map(g => (
                <line key={g} x1="0" y1={sy(g)} x2={CHART_W} y2={sy(g)} stroke="var(--line)" strokeWidth="0.5" strokeDasharray="2 3"/>
              ))}
              {PAGES.map((p, i) => {
                const path = history.map((h, k) => `${k===0?'M':'L'}${sx(k).toFixed(2)},${sy(h[i]).toFixed(2)}`).join(' ');
                return <path key={p.id} d={path} fill="none" stroke={lineColors[i]} strokeWidth="1.25" vectorEffect="non-scaling-stroke"/>;
              })}
            </svg>
            <div className="chart-axis">
              <span>iter 0</span>
              <span>iter {iter}</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="mk-right">
          <div className="mk-matrix pr-ranking">
            <div className="chart-label">
              <span>Ranking por PageRank</span>
              <span>Σ = {rank.reduce((a,b)=>a+b,0).toFixed(3)}</span>
            </div>
            <ol className="rank-list">
              {ranked.map((p, pos) => (
                <li key={p.id}>
                  <span className="rank-pos">{String(pos + 1).padStart(2, '0')}</span>
                  <span className="rank-id">{p.id}</span>
                  <span className="rank-name">{p.label}</span>
                  <span className="rank-bar"><span style={{width: `${(p.rank / 0.4) * 100}%`, background: lineColors[p.idx]}}/></span>
                  <span className="rank-val">{(p.rank * 100).toFixed(2)}%</span>
                </li>
              ))}
            </ol>
          </div>

          {/* code preview */}
          <div className="pr-code">
            <div className="chart-label" style={{padding: '0 0 6px'}}>
              <span>Algoritmo (Python)</span>
              <span>iter = {iter}</span>
            </div>
            <pre>{`def pagerank(M, d=${damping.toFixed(2)}, n_iter=${iter || 1}):
    N = M.shape[0]
    r = np.ones(N) / N
    for _ in range(n_iter):
        r = (1 - d) / N + d * (M @ r)
    return r`}</pre>
          </div>

          <div className="mc-controls">
            <div style={{display:'flex', gap: 8}}>
              <button className="btn primary mc-btn" onClick={() => setRunning(r => !r)}>
                {running ? 'Pausar' : iter > 0 ? 'Continuar' : 'Iniciar iteração'}
              </button>
              <button className="btn ghost mc-btn" onClick={step} disabled={running}>1 iter</button>
            </div>
            <button className="btn ghost mc-btn" onClick={reset}>Reiniciar</button>
            <div className="mc-speed">
              <label>Damping factor d</label>
              <input
                type="range" min="0" max="100" step="5"
                value={damping * 100}
                onChange={(e) => { setDamping(parseInt(e.target.value) / 100); }}
              />
              <span className="mc-speed-val">d = {damping.toFixed(2)}</span>
            </div>
            <div className="mc-speed">
              <label>Velocidade</label>
              <input
                type="range" min="1" max="10" step="1"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
              />
              <span className="mc-speed-val">{speed} iter/s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mc-explain">
        <strong>Como funciona:</strong> PageRank modela um navegador aleatório. A cada iteração, calculamos
        <em> r ← (1 − d)/N + d · M · r</em>. O termo <em>(1 − d)/N</em> representa a probabilidade de "teleportar" para
        qualquer página; o termo <em>d · M · r</em> distribui rank pelos links de saída. Após poucas iterações,
        <em> r</em> converge para o vetor próprio principal de <em>M</em> — a importância relativa de cada página.
      </div>
    </div>
  );
}

window.PageRankSim = PageRankSim;
