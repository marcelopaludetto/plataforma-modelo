// Modelo Computacional — components

const { useState, useEffect, useMemo } = React;

// ---------- tiny inline icons ----------
const Icon = {
  Check: ({ size = 10 }) => (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 6.5L5 9l4.5-5.5" />
    </svg>
  ),
  Chevron: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4l4 4-4 4" />
    </svg>
  ),
  Close: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  ),
  Code: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4L1 8l4 4M11 4l4 4-4 4" />
    </svg>
  ),
  Data: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="8" cy="3.5" rx="5.5" ry="1.8"/>
      <path d="M2.5 3.5v5c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8v-5"/>
      <path d="M2.5 8.5v4c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8v-4"/>
    </svg>
  ),
  Book: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3v10a1 1 0 001 1h11V2H3a1 1 0 00-1 1z"/>
      <path d="M5 6h6M5 9h4"/>
    </svg>
  ),
  Slides: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="9" rx="1"/>
      <path d="M5 14h6"/><path d="M8 12v2"/>
    </svg>
  ),
  Settings: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2"/>
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3"/>
    </svg>
  ),
};

// ---------- Sidebar ----------
function Sidebar({ units, activeUnitId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">M</div>
        <div className="brand-text">
          <div className="brand-name">Modelo Computacional</div>
          <div className="brand-sub">Curso · 2026.1</div>
        </div>
      </div>

      <div>
        <div className="section-label">
          <span>Unidades</span>
          <span className="count">7</span>
        </div>
        <ul className="unit-list">
          {units.map(u => (
            <li key={u.id}>
              <button
                className={`unit-item ${u.id === activeUnitId ? 'is-active' : ''}`}
                onClick={() => onSelect(u.id)}
              >
                <span className="unit-num">{u.num}</span>
                <span className="unit-title">{u.title}</span>
                <span className={`unit-state ${u.state === 'done' ? 'done' : u.state === 'active' ? 'partial' : ''}`}>
                  {u.state === 'done' && <Icon.Check />}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="avatar">JC</div>
        <div className="user-meta">
          Júlia Carvalho<br/>
          <small>Engenharia de Software · 4º sem</small>
        </div>
      </div>
    </aside>
  );
}

// ---------- Hero ----------
function Hero({ unit, completedCount, totalCount }) {
  const pct = Math.round((completedCount / totalCount) * 100);
  return (
    <section className="hero">
      <div>
        <div className="hero-meta">
          <span>{unit.num}</span>
          <span className="dot"/>
          <span>{unit.weeks}</span>
          <span className="dot"/>
          <span>{unit.duration}</span>
        </div>
        <h1 className="hero-title">
          Modelos <em>{unit.titleEm}</em>
        </h1>
        <p className="hero-desc">{unit.desc}</p>
      </div>
      <div className="progress-card">
        <div className="progress-row">
          <span className="progress-pct">{pct}%</span>
          <span className="progress-label">Progresso</span>
        </div>
        <div className="progress-bar"><span style={{width: `${pct}%`}} /></div>
        <div className="progress-stats">
          <div>
            <strong>{completedCount}/{totalCount}</strong>
            <span>Aulas</span>
          </div>
          <div>
            <strong>{unit.progress.time}</strong>
            <span>Estudados</span>
          </div>
          <div>
            <strong>0/1</strong>
            <span>Projetos</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Objectives ----------
function Objectives({ objectives }) {
  return (
    <div className="block">
      <div className="block-head">
        <h2 className="block-title">Objetivos de aprendizagem</h2>
        <span className="block-meta">3 itens</span>
      </div>
      <div className="objectives">
        {objectives.map(o => (
          <div className="obj" key={o.num}>
            <div className="obj-num">{o.num}</div>
            <div className="obj-text">{o.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Lessons ----------
function Lessons({ lessons, onToggle, onOpen }) {
  return (
    <div className="block">
      <div className="block-head">
        <h2 className="block-title">Aulas e atividades</h2>
        <span className="block-meta">{lessons.filter(l=>l.done).length}/{lessons.length} concluídas</span>
      </div>
      <div className="lessons">
        {lessons.map((l, i) => (
          <button className="lesson" key={l.id} onClick={() => onOpen(l)}>
            <span
              className={`lesson-check ${l.done ? 'done' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggle(l.id); }}
              role="checkbox"
              aria-checked={l.done}
            >
              {l.done && <Icon.Check />}
            </span>
            <div className="lesson-body">
              <div className={`lesson-title ${l.done ? 'done' : ''}`}>{l.title}</div>
              <div className="lesson-sub">
                <span style={{fontFamily:'var(--font-mono)', fontSize: 11}}>{String(i+1).padStart(2,'0')}</span>
                <span className="dot"/>
                <span>{l.kind === 'Notebook' ? 'Python · Jupyter' : l.kind === 'Vídeo' ? 'Aula gravada' : l.kind === 'Leitura' ? 'Material em PDF' : l.kind === 'Estudo' ? 'Caso aplicado' : 'Discussão guiada'}</span>
              </div>
            </div>
            <span className="lesson-kind">{l.kind}</span>
            <span className="lesson-time">{l.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Resources ----------
function Resources({ resources, onOpen }) {
  const iconFor = (k) => k === 'code' ? <Icon.Code/> : k === 'data' ? <Icon.Data/> : k === 'book' ? <Icon.Book/> : <Icon.Slides/>;
  return (
    <div className="block">
      <div className="block-head">
        <h2 className="block-title">Materiais de apoio</h2>
        <span className="block-meta">4 arquivos</span>
      </div>
      <div className="resources">
        {resources.map((r, i) => (
          <button className="resource" key={i} onClick={() => onOpen(r)}>
            <div className="resource-head">
              <span className="resource-kind">{r.kind}</span>
              <span className="resource-icon">{iconFor(r.icon)}</span>
            </div>
            <div className="resource-title">{r.title}</div>
            <div className="resource-meta">{r.meta}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Assignment ----------
function Assignment({ a, onOpen }) {
  return (
    <div className="block" style={{marginBottom: 0}}>
      <div className="block-head">
        <h2 className="block-title">Avaliação da unidade</h2>
        <span className="block-meta">Entrega individual</span>
      </div>
      <div className="assignment">
        <div>
          <div className="assignment-title">{a.title}</div>
          <p className="assignment-desc">{a.desc}</p>
          <div className="assignment-meta">
            <span>Prazo: <strong>{a.due}</strong></span>
            <span>Peso: <strong>{a.weight}</strong></span>
            <span>Formato: <strong>{a.submission}</strong></span>
          </div>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap: 8}}>
          <button className="btn primary" onClick={() => onOpen({assignment: a})}>
            Abrir projeto <Icon.Chevron size={11} />
          </button>
          <button className="btn ghost">Ver rubrica</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Modal ----------
function Modal({ item, onClose, onToggle }) {
  if (!item) return null;
  const isAssignment = !!item.assignment;
  const isResource = !!item.kind && !item.lessonOf; // resource has 'kind' but not lesson shape
  const isLesson = !isAssignment && !!item.title && item.lessonOf !== false && !!item.id;

  // Decide based on shape
  const lesson = item.id && item.kind && item.time ? item : null;
  const resource = item.kind && !lesson && !isAssignment ? item : null;
  const assignment = item.assignment ? item.assignment : null;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="modal-kind">
            {lesson ? `Aula · ${lesson.kind}` : resource ? `Material · ${resource.kind}` : 'Avaliação'}
          </span>
          <button className="modal-close" onClick={onClose}><Icon.Close/></button>
        </div>

        {lesson && (
          <>
            <h2 className="modal-title">{lesson.title}</h2>
            <div className="modal-meta">
              <span>{lesson.time}</span>
              <span>·</span>
              <span>{lesson.done ? 'Concluída' : 'Não iniciada'}</span>
            </div>
            {lesson.id === 'l3' ? (
              <window.MonteCarloSim/>
            ) : lesson.id === 'l4' ? (
              <window.MarkovSim/>
            ) : lesson.id === 'l5' ? (
              <window.PageRankSim/>
            ) : (
              <div className="placeholder-img">
                [ {lesson.kind === 'Notebook' ? 'preview do notebook Jupyter' : lesson.kind === 'Vídeo' ? 'player de vídeo' : 'preview do material'} ]
              </div>
            )}
            <div className="modal-body" style={{marginTop: (lesson.id === 'l3' || lesson.id === 'l4' || lesson.id === 'l5') ? 24 : 0}}>
              <p>{lesson.desc}</p>
              {lesson.id !== 'l3' && lesson.id !== 'l4' && lesson.id !== 'l5' && <p>Ao concluir esta aula, você terá ferramentas para abordar o estudo de caso da próxima sessão.</p>}
            </div>
            <div className="modal-actions">
              <button className="btn primary" onClick={() => { onToggle(lesson.id); onClose(); }}>
                {lesson.done ? 'Marcar como pendente' : 'Marcar como concluída'} <Icon.Check size={11}/>
              </button>
              <button className="btn ghost" onClick={onClose}>Continuar depois</button>
            </div>
          </>
        )}

        {resource && (
          <>
            <h2 className="modal-title">{resource.title}</h2>
            <div className="modal-meta">
              <span>{resource.kind}</span>
              <span>·</span>
              <span>{resource.meta}</span>
            </div>
            <div className="placeholder-img">[ preview do arquivo ]</div>
            <div className="modal-body">
              <p>Material de apoio referenciado nas aulas 4 e 5. Recomendado para preparação prévia ao estudo de caso.</p>
            </div>
            <div className="modal-actions">
              <button className="btn primary">Baixar arquivo <Icon.Chevron size={11}/></button>
              <button className="btn ghost" onClick={onClose}>Fechar</button>
            </div>
          </>
        )}

        {assignment && (
          <>
            <h2 className="modal-title">{assignment.title}</h2>
            <div className="modal-meta">
              <span>Entrega: {assignment.due}</span>
              <span>·</span>
              <span>Peso {assignment.weight}</span>
              <span>·</span>
              <span>{assignment.submission}</span>
            </div>
            <div className="modal-body">
              <p>{assignment.desc}</p>
              <p><strong style={{color:'var(--ink)', fontWeight: 500}}>Critérios de avaliação:</strong> implementação correta, comparação rigorosa com resultados teóricos, qualidade da escrita técnica e reprodutibilidade do código.</p>
            </div>
            <div className="modal-actions">
              <button className="btn primary">Iniciar projeto <Icon.Chevron size={11}/></button>
              <button className="btn ghost">Baixar enunciado</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Tweaks ----------
const THEMES = {
  indigo:    { accent: 'oklch(0.45 0.15 265)', soft: 'oklch(0.96 0.04 265)', ink: 'oklch(0.32 0.15 265)' },
  forest:    { accent: 'oklch(0.45 0.13 155)', soft: 'oklch(0.96 0.035 155)', ink: 'oklch(0.32 0.13 155)' },
  rust:      { accent: 'oklch(0.5 0.15 38)',   soft: 'oklch(0.96 0.04 38)',  ink: 'oklch(0.36 0.15 38)' },
  plum:      { accent: 'oklch(0.42 0.15 330)', soft: 'oklch(0.96 0.035 330)', ink: 'oklch(0.32 0.15 330)' },
  graphite:  { accent: 'oklch(0.32 0.02 270)', soft: 'oklch(0.94 0.005 270)', ink: 'oklch(0.22 0.02 270)' },
};

function Tweaks({ open, theme, setTheme }) {
  return (
    <div className={`tweaks ${open ? 'open' : ''}`}>
      <div className="tweaks-title">Tweaks · Tema</div>
      <div className="swatches">
        {Object.entries(THEMES).map(([key, val]) => (
          <button
            key={key}
            className={`swatch ${theme === key ? 'active' : ''}`}
            style={{background: val.accent}}
            onClick={() => setTheme(key)}
            title={key}
          />
        ))}
      </div>
      <div className="swatch-label">{theme}</div>
    </div>
  );
}

// expose
Object.assign(window, { Sidebar, Hero, Objectives, Lessons, Resources, Assignment, Modal, Tweaks, Icon, THEMES });
