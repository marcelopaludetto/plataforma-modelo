// Modelo Computacional — main app
const { useState, useEffect } = React;

function App() {
  const data = window.COURSE;
  const [activeUnitId, setActiveUnitId] = useState(3);
  const [lessons, setLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('mc.lessons');
      if (saved) return JSON.parse(saved);
    } catch {}
    return data.unit.lessons;
  });
  const [modal, setModal] = useState(null);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('mc.theme') || 'indigo'; } catch { return 'indigo'; }
  });
  const [toast, setToast] = useState(null);

  // persist
  useEffect(() => {
    try { localStorage.setItem('mc.lessons', JSON.stringify(lessons)); } catch {}
  }, [lessons]);
  useEffect(() => {
    try { localStorage.setItem('mc.theme', theme); } catch {}
    const t = window.THEMES[theme];
    if (t) {
      document.documentElement.style.setProperty('--accent', t.accent);
      document.documentElement.style.setProperty('--accent-soft', t.soft);
      document.documentElement.style.setProperty('--accent-ink', t.ink);
    }
  }, [theme]);

  // Tweaks protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({type: '__edit_mode_available'}, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const toggleLesson = (id) => {
    setLessons(prev => {
      const next = prev.map(l => l.id === id ? { ...l, done: !l.done } : l);
      const lesson = next.find(l => l.id === id);
      setToast(lesson.done ? `Aula marcada como concluída` : `Aula marcada como pendente`);
      setTimeout(() => setToast(null), 2200);
      return next;
    });
  };

  const completedCount = lessons.filter(l => l.done).length;

  const handleSelectUnit = (id) => {
    setActiveUnitId(id);
    if (id !== 3) setToast(`Unidade ${String(id).padStart(2,'0')} ainda em preparação`);
    else setToast(null);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="app" data-screen-label="01 Unit Overview">
      <Sidebar units={data.units} activeUnitId={activeUnitId} onSelect={handleSelectUnit}/>
      <main className="main">
        <div className="crumbs">
          <a href="#">Cursos</a>
          <span className="sep">/</span>
          <a href="#">{data.title}</a>
          <span className="sep">/</span>
          <span style={{color:'var(--ink)'}}>{data.unit.num}</span>
        </div>
        <Hero unit={data.unit} completedCount={completedCount} totalCount={lessons.length}/>
        <Objectives objectives={data.unit.objectives}/>
        <Lessons lessons={lessons} onToggle={toggleLesson} onOpen={(l) => setModal(l)}/>
        <Resources resources={data.unit.resources} onOpen={(r) => setModal(r)}/>
        <Assignment a={data.unit.assignment} onOpen={(a) => setModal(a)}/>
      </main>
      <Modal item={modal} onClose={() => setModal(null)} onToggle={toggleLesson}/>
      <Tweaks open={tweaksOpen} theme={theme} setTheme={setTheme}/>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
