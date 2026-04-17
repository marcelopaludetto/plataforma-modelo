// Monte Carlo π estimator simulation
// Original interactive piece for the "Simulação de Monte Carlo" lesson.

const { useState, useEffect, useRef, useCallback } = React;

function MonteCarloSim() {
  const SIZE = 360;            // square canvas px
  const CHART_W = 360;
  const CHART_H = 110;
  const MAX_POINTS = 5000;     // hard cap

  const [points, setPoints] = useState([]); // {x,y,inside}
  const [history, setHistory] = useState([]); // {n, pi}
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(40);    // points per tick

  const rafRef = useRef(null);
  const tickRef = useRef(0);

  const inside = points.filter(p => p.inside).length;
  const total = points.length;
  const piEst = total > 0 ? (4 * inside) / total : 0;
  const err = total > 0 ? Math.abs(piEst - Math.PI) : 0;

  const reset = useCallback(() => {
    setRunning(false);
    setPoints([]);
    setHistory([]);
    tickRef.current = 0;
  }, []);

  const step = useCallback((batch) => {
    setPoints(prev => {
      if (prev.length >= MAX_POINTS) { setRunning(false); return prev; }
      const room = Math.min(batch, MAX_POINTS - prev.length);
      const next = prev.slice();
      let newInside = prev.filter(p => p.inside).length;
      for (let i = 0; i < room; i++) {
        const x = Math.random();
        const y = Math.random();
        const isIn = (x*x + y*y) <= 1;
        if (isIn) newInside++;
        next.push({ x, y, inside: isIn });
      }
      const n = next.length;
      const pi = (4 * newInside) / n;
      // sample history every few points to keep array small
      tickRef.current++;
      setHistory(h => {
        const last = h[h.length - 1];
        if (!last || n - last.n >= Math.max(5, Math.floor(n / 200))) {
          return [...h, { n, pi }];
        }
        return h;
      });
      return next;
    });
  }, []);

  // animation loop
  useEffect(() => {
    if (!running) return;
    let alive = true;
    const loop = () => {
      if (!alive) return;
      step(speed);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { alive = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running, speed, step]);

  // chart path
  const chartPath = (() => {
    if (history.length < 2) return '';
    const xs = history.map(h => h.n);
    const xMax = xs[xs.length - 1];
    const yMin = 2.6, yMax = 3.6;
    const sx = (n) => (n / xMax) * CHART_W;
    const sy = (p) => CHART_H - ((p - yMin) / (yMax - yMin)) * CHART_H;
    return history.map((h, i) => `${i===0?'M':'L'}${sx(h.n).toFixed(2)},${sy(h.pi).toFixed(2)}`).join(' ');
  })();

  // π reference line y
  const piY = (() => {
    const yMin = 2.6, yMax = 3.6;
    return CHART_H - ((Math.PI - yMin) / (yMax - yMin)) * CHART_H;
  })();

  // Render points as SVG circles. Cap visible points to last 1500 for perf.
  const visiblePoints = points.length > 1500 ? points.slice(points.length - 1500) : points;

  return (
    <div className="mc">
      <div className="mc-head">
        <div>
          <div className="mc-eyebrow">Simulação interativa</div>
          <div className="mc-title">Estimando <em>π</em> com Monte Carlo</div>
        </div>
        <div className="mc-readout">
          <div className="readout-pi">
            <span className="readout-num">{total === 0 ? '—' : piEst.toFixed(5)}</span>
            <span className="readout-label">π estimado</span>
          </div>
        </div>
      </div>

      <div className="mc-body">
        {/* dart board */}
        <div className="mc-board">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" height="100%" className="mc-svg">
            {/* axes */}
            <rect x="0" y="0" width={SIZE} height={SIZE} fill="var(--surface)" stroke="var(--line)" strokeWidth="1"/>
            {/* grid */}
            {[0.25, 0.5, 0.75].map(t => (
              <g key={t} stroke="var(--line)" strokeDasharray="2 3" strokeWidth="0.5">
                <line x1={t*SIZE} y1="0" x2={t*SIZE} y2={SIZE}/>
                <line x1="0" y1={t*SIZE} x2={SIZE} y2={t*SIZE}/>
              </g>
            ))}
            {/* quarter circle (origin top-left in svg, so we draw with origin bottom-left) */}
            <path
              d={`M 0 ${SIZE} A ${SIZE} ${SIZE} 0 0 0 ${SIZE} 0 L ${SIZE} ${SIZE} Z`}
              fill="var(--accent-soft)"
              stroke="var(--accent)"
              strokeWidth="1.25"
            />
            {/* points */}
            {visiblePoints.map((p, i) => (
              <circle
                key={i + (points.length - visiblePoints.length)}
                cx={p.x * SIZE}
                cy={SIZE - p.y * SIZE}
                r="1.6"
                fill={p.inside ? 'var(--accent-ink)' : 'var(--ink-3)'}
                opacity={p.inside ? 0.85 : 0.55}
              />
            ))}
            {/* axis labels */}
            <text x="6" y={SIZE - 6} fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)">0</text>
            <text x={SIZE - 12} y={SIZE - 6} fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)">1</text>
            <text x="6" y="12" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-3)">1</text>
          </svg>
          <div className="mc-formula">
            <span>π ≈ 4 ·</span>
            <span className="frac">
              <span className="num">{inside}</span>
              <span className="den">{total || '—'}</span>
            </span>
          </div>
        </div>

        {/* side panel */}
        <div className="mc-side">
          <div className="mc-stats">
            <div className="stat">
              <span className="stat-num">{total.toLocaleString('pt-BR')}</span>
              <span className="stat-label">Amostras</span>
            </div>
            <div className="stat">
              <span className="stat-num accent">{inside.toLocaleString('pt-BR')}</span>
              <span className="stat-label">Dentro do quadrante</span>
            </div>
            <div className="stat">
              <span className="stat-num">{total > 0 ? `±${err.toFixed(4)}` : '—'}</span>
              <span className="stat-label">Erro absoluto</span>
            </div>
          </div>

          <div className="mc-chart">
            <div className="chart-label">
              <span>Convergência para π</span>
              <span className="chart-pi">π = {Math.PI.toFixed(5)}</span>
            </div>
            <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} width="100%" height={CHART_H} preserveAspectRatio="none">
              <rect x="0" y="0" width={CHART_W} height={CHART_H} fill="transparent" stroke="var(--line)" strokeWidth="0.75"/>
              <line x1="0" y1={piY} x2={CHART_W} y2={piY} stroke="var(--accent)" strokeWidth="0.75" strokeDasharray="3 3"/>
              {chartPath && <path d={chartPath} fill="none" stroke="var(--ink)" strokeWidth="1.25" vectorEffect="non-scaling-stroke"/>}
            </svg>
            <div className="chart-axis">
              <span>0</span>
              <span>{total.toLocaleString('pt-BR')} amostras</span>
            </div>
          </div>

          <div className="mc-controls">
            <button className="btn primary mc-btn" onClick={() => setRunning(r => !r)} disabled={total >= MAX_POINTS}>
              {running ? 'Pausar' : total > 0 ? 'Continuar' : 'Iniciar simulação'}
            </button>
            <button className="btn ghost mc-btn" onClick={reset}>Reiniciar</button>
            <div className="mc-speed">
              <label>Velocidade</label>
              <input
                type="range"
                min="5" max="200" step="5"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
              />
              <span className="mc-speed-val">{speed}/quadro</span>
            </div>
          </div>

          {total >= MAX_POINTS && (
            <div className="mc-note">Limite de {MAX_POINTS.toLocaleString('pt-BR')} amostras atingido — reinicie para continuar.</div>
          )}
        </div>
      </div>

      <div className="mc-explain">
        <strong>Como funciona:</strong> sorteamos pontos uniformemente em um quadrado [0,1]×[0,1].
        Um ponto cai dentro do quadrante de círculo unitário quando x² + y² ≤ 1. A razão entre pontos internos
        e o total aproxima a razão de áreas (π/4) — daí a fórmula <em>π ≈ 4 × dentro / total</em>.
        Quanto mais amostras, menor o erro: ele decai com 1/√n.
      </div>
    </div>
  );
}

window.MonteCarloSim = MonteCarloSim;
