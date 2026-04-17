// Markov chain simulation — random walk on a small web of pages
const { useState, useEffect, useRef, useCallback, useMemo } = React;

function MarkovSim() {
  // 4 pages with named transition probabilities (rows sum to 1)
  const PAGES = [
    { id: 'A', label: 'Início',     x: 0.22, y: 0.30 },
    { id: 'B', label: 'Catálogo',   x: 0.78, y: 0.22 },
    { id: 'C', label: 'Produto',    x: 0.78, y: 0.78 },
    { id: 'D', label: 'Carrinho',   x: 0.22, y: 0.78 },
  ];

  // Transition matrix P[i][j] = P(next=j | current=i)
  // Designed so stationary distribution is non-trivial
  const P = [
    [0.10, 0.55, 0.20, 0.15], // A -> ...
    [0.20, 0.10, 0.55, 0.15], // B
    [0.15, 0.30, 0.10, 0.45], // C
    [0.40, 0.10, 0.20, 0.30], // D
  ];

  const SIZE_W = 360;
  const SIZE_H = 280;

  const [current, setCurrent] = useState(0);
  const [counts, setCounts] = useState([1, 0, 0, 0]);
  const [history, setHistory] = useState([0]); // sequence of page indices, capped
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(8); // steps per second
  const [highlightEdge, setHighlightEdge] = useState(null); // [from, to]

  const tickRef = useRef(null);
  const total = counts.reduce((a,b) => a+b, 0);

  const reset = useCallback(() => {
    setRunning(false);
    setCurrent(0);
    setCounts([1, 0, 0, 0]);
    setHistory([0]);
    setHighlightEdge(null);
  }, []);

  const step = useCallback(() => {
    setCurrent(cur => {
      const r = Math.random();
      let acc = 0;
      let next = cur;
      for (let j = 0; j < 4; j++) {
        acc += P[cur][j];
        if (r < acc) { next = j; break; }
      }
      setCounts(c => {
        const nc = c.slice();
        nc[next] += 1;
        return nc;
      });
      setHistory(h => {
        const nh = [...h, next];
        return nh.length > 60 ? nh.slice(nh.length - 60) : nh;
      });
      setHighlightEdge([cur, next]);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = 1000 / speed;
    tickRef.current = setInterval(step, interval);
    return () => clearInterval(tickRef.current);
  }, [running, speed, step]);

  // theoretical stationary distribution (precomputed by power iteration)
  const stationary = useMemo(() => {
    let pi = [0.25, 0.25, 0.25, 0.25];
    for (let k = 0; k < 200; k++) {
      const next = [0,0,0,0];
      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
          next[j] += pi[i] * P[i][j];
        }
      }
      pi = next;
    }
    return pi;
  }, []);

  const empirical = counts.map(c => c / Math.max(1, total));

  return (
    <div className="mk">
      <div className="mc-head">
        <div>
          <div className="mc-eyebrow">Simulação interativa</div>
          <div className="mc-title">Cadeia de <em>Markov</em> · navegação web</div>
        </div>
        <div className="mc-readout">
          <div className="readout-pi">
            <span className="readout-num">{total}</span>
            <span className="readout-label">passos</span>
          </div>
        </div>
      </div>

      <div className="mk-body">
        {/* Graph + transition matrix */}
        <div className="mk-left">
          <div className="mk-graph">
            <svg viewBox={`0 0 ${SIZE_W} ${SIZE_H}`} width="100%" height="100%">
              {/* edges */}
              {PAGES.map((from, i) =>
                PAGES.map((to, j) => {
                  if (i === j) return null;
                  const p = P[i][j];
                  if (p < 0.05) return null;
                  const x1 = from.x * SIZE_W, y1 = from.y * SIZE_H;
                  const x2 = to.x * SIZE_W, y2 = to.y * SIZE_H;
                  // offset for parallel edges
                  const dx = x2 - x1, dy = y2 - y1;
                  const len = Math.hypot(dx, dy);
                  const nx = -dy / len, ny = dx / len;
                  const off = 6;
                  const sx = x1 + nx*off, sy = y1 + ny*off;
                  const ex = x2 + nx*off, ey = y2 + ny*off;
                  // shorten to not overlap node
                  const r = 22;
                  const ux = (ex - sx) / Math.hypot(ex-sx, ey-sy);
                  const uy = (ey - sy) / Math.hypot(ex-sx, ey-sy);
                  const sx2 = sx + ux*r, sy2 = sy + uy*r;
                  const ex2 = ex - ux*r, ey2 = ey - uy*r;
                  const isHi = highlightEdge && highlightEdge[0] === i && highlightEdge[1] === j;
                  return (
                    <g key={`${i}-${j}`} opacity={isHi ? 1 : 0.4}>
                      <line
                        x1={sx2} y1={sy2} x2={ex2} y2={ey2}
                        stroke={isHi ? 'var(--accent)' : 'var(--ink-3)'}
                        strokeWidth={isHi ? 1.75 : 0.75}
                        markerEnd={isHi ? 'url(#arrow-hi)' : 'url(#arrow)'}
                      />
                    </g>
                  );
                })
              )}
              {/* self-loops */}
              {PAGES.map((p, i) => P[i][i] >= 0.05 && (
                <g key={`self-${i}`} opacity={highlightEdge && highlightEdge[0] === i && highlightEdge[1] === i ? 1 : 0.4}>
                  <circle
                    cx={p.x * SIZE_W + 24} cy={p.y * SIZE_H - 24}
                    r="10"
                    fill="none"
                    stroke={highlightEdge && highlightEdge[0] === i && highlightEdge[1] === i ? 'var(--accent)' : 'var(--ink-3)'}
                    strokeWidth={highlightEdge && highlightEdge[0] === i && highlightEdge[1] === i ? 1.75 : 0.75}
                  />
                </g>
              ))}

              {/* nodes */}
              {PAGES.map((p, i) => (
                <g key={p.id} transform={`translate(${p.x * SIZE_W}, ${p.y * SIZE_H})`}>
                  <circle
                    r="22"
                    fill={i === current ? 'var(--accent)' : 'var(--surface)'}
                    stroke={i === current ? 'var(--accent)' : 'var(--line-2)'}
                    strokeWidth="1.5"
                    style={{transition: 'fill 200ms ease, stroke 200ms ease'}}
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fontFamily="var(--font-mono)"
                    fontSize="13"
                    fontWeight="500"
                    fill={i === current ? 'white' : 'var(--ink)'}
                  >{p.id}</text>
                  <text
                    textAnchor="middle"
                    y="38"
                    fontFamily="var(--font-ui)"
                    fontSize="11"
                    fill="var(--ink-2)"
                  >{p.label}</text>
                </g>
              ))}

              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--ink-3)"/>
                </marker>
                <marker id="arrow-hi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/>
                </marker>
              </defs>
            </svg>
          </div>

          <div className="mk-trail">
            <div className="chart-label"><span>Trajetória</span><span>{history.length} passos</span></div>
            <div className="trail-track">
              {history.map((h, idx) => (
                <span
                  key={idx}
                  className={`trail-step ${idx === history.length - 1 ? 'now' : ''}`}
                >{PAGES[h].id}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: matrix + distributions */}
        <div className="mk-right">
          <div className="mk-matrix">
            <div className="chart-label"><span>Matriz de transição P</span><span>4 × 4</span></div>
            <table>
              <thead>
                <tr>
                  <th></th>
                  {PAGES.map(p => <th key={p.id}>{p.id}</th>)}
                </tr>
              </thead>
              <tbody>
                {PAGES.map((from, i) => (
                  <tr key={from.id}>
                    <th>{from.id}</th>
                    {PAGES.map((to, j) => (
                      <td
                        key={to.id}
                        className={highlightEdge && highlightEdge[0] === i && highlightEdge[1] === j ? 'hi' : ''}
                        style={{
                          background: `oklch(0.96 ${0.04 * P[i][j] / 0.6} 265)`,
                        }}
                      >
                        {P[i][j].toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mk-dists">
            <div className="chart-label">
              <span>Distribuição empírica vs estacionária π</span>
            </div>
            {PAGES.map((p, i) => (
              <div key={p.id} className="dist-row">
                <span className="dist-id">{p.id}</span>
                <div className="dist-bars">
                  <div className="dist-bar empirical">
                    <span style={{width: `${empirical[i] * 100}%`}}/>
                  </div>
                  <div className="dist-bar theoretical">
                    <span style={{width: `${stationary[i] * 100}%`}}/>
                  </div>
                </div>
                <span className="dist-vals">
                  <span className="emp">{(empirical[i] * 100).toFixed(1)}%</span>
                  <span className="th">π {(stationary[i] * 100).toFixed(1)}%</span>
                </span>
              </div>
            ))}
            <div className="dist-legend">
              <span><i className="leg emp"/>Empírica</span>
              <span><i className="leg th"/>Estacionária π</span>
            </div>
          </div>

          <div className="mc-controls">
            <div style={{display:'flex', gap: 8}}>
              <button className="btn primary mc-btn" onClick={() => setRunning(r => !r)}>
                {running ? 'Pausar' : total > 1 ? 'Continuar' : 'Iniciar caminhada'}
              </button>
              <button className="btn ghost mc-btn" onClick={step} disabled={running}>1 passo</button>
            </div>
            <button className="btn ghost mc-btn" onClick={reset}>Reiniciar</button>
            <div className="mc-speed">
              <label>Velocidade</label>
              <input
                type="range" min="1" max="30" step="1"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
              />
              <span className="mc-speed-val">{speed} passos/s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mc-explain">
        <strong>Como funciona:</strong> em cada passo, sorteamos a próxima página segundo a linha atual de <em>P</em>.
        Conforme o número de passos cresce, a fração de visitas a cada página converge para a <em>distribuição estacionária π</em>,
        que satisfaz <em>π · P = π</em>. Aqui simulamos um modelo simplificado de navegação — base do algoritmo PageRank.
      </div>
    </div>
  );
}

window.MarkovSim = MarkovSim;
