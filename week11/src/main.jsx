import { StrictMode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import './styles.css';

const ThemeContext = createContext('sunrise');

function useDocumentTitle(title) {
  document.title = `${title} | Hooks Lab`;
}

function LabShell() {
  const [theme, setTheme] = useState('sunrise');

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`app theme-${theme}`}>
        <header className="topbar">
          <Link className="wordmark" to="/">HOOKS<span>/</span>LAB</Link>
          <nav aria-label="Main navigation">
            <NavLink to="/hooks">Hooks</NavLink>
            <NavLink to="/router">Router</NavLink>
          </nav>
          <button className="theme-toggle" onClick={() => setTheme(theme === 'sunrise' ? 'night' : 'sunrise')}>
            {theme === 'sunrise' ? 'Night mode' : 'Day mode'}
          </button>
        </header>
        <main><Outlet /></main>
      </div>
    </ThemeContext.Provider>
  );
}

function Home() {
  useDocumentTitle('Start here');
  const navigate = useNavigate();
  return (
    <section className="hero page-wrap">
      <p className="kicker">Week 11 / React fundamentals</p>
      <h1>Make React<br /><em>remember.</em></h1>
      <p className="intro">A hands-on field guide to the hooks that control identity, performance, shared state, and the browser’s address bar.</p>
      <div className="hero-actions">
        <button className="primary" onClick={() => navigate('/hooks')}>Open the hooks lab <span>→</span></button>
        <Link className="text-link" to="/router">Explore routing <span>↗</span></Link>
      </div>
      <div className="principles">
        <article><span>01</span><h2>Preserve</h2><p><code>useRef</code> stores a value across renders without causing a render.</p></article>
        <article><span>02</span><h2>Compute</h2><p><code>useMemo</code> caches an expensive result until its inputs change.</p></article>
        <article><span>03</span><h2>Share</h2><p><code>useContext</code> reads a value from a nearby provider.</p></article>
      </div>
    </section>
  );
}

function HooksLab() {
  useDocumentTitle('Hooks lab');
  const inputRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current += 1;
  const [text, setText] = useState('');
  const [items, setItems] = useState(['React', 'Router', 'Hooks']);
  const [accent, setAccent] = useState(false);
  const theme = useContext(ThemeContext);
  const focusInput = useCallback(() => inputRef.current?.focus(), []);
  const sortedItems = useMemo(() => [...items].sort(), [items]);

  return (
    <section className="page-wrap">
      <SectionHeader number="01" title="Hooks lab" description="Run each example, then read the small reason it exists." />
      <div className="lab-grid">
        <article className="demo-card wide">
          <div className="card-label">useRef</div><h2>Keep a handle</h2>
          <p>Refs point to a DOM node or preserve a mutable value between renders. Updating a ref does not trigger a render.</p>
          <div className="control-row"><input ref={inputRef} value={text} onChange={(event) => setText(event.target.value)} placeholder="Type, then focus me" /><button onClick={focusInput}>Focus input</button></div>
          <small>Render count: {renderCount.current} · Ref value: {text.length} characters</small>
        </article>
        <article className="demo-card">
          <div className="card-label">useMemo</div><h2>Cache a result</h2>
          <p>The sorted list is recomputed only when <code>items</code> changes, not when unrelated state changes.</p>
          <div className="chip-list">{sortedItems.map((item) => <span key={item}>{item}</span>)}</div>
          <button onClick={() => setAccent(!accent)}>{accent ? 'Reset accent' : 'Change unrelated state'}</button>
        </article>
        <article className="demo-card">
          <div className="card-label">useCallback</div><h2>Keep a function</h2>
          <p><code>focusInput</code> keeps the same function identity between renders, useful when passing callbacks to memoized children.</p>
          <div className="signal"><span className={accent ? 'signal-dot active' : 'signal-dot'} /> Callback ready</div>
        </article>
        <article className="demo-card wide">
          <div className="card-label">useContext + custom hook</div><h2>Read shared atmosphere</h2>
          <p><code>useContext</code> avoids threading the theme through every component. The custom <code>useDocumentTitle</code> hook packages reusable behavior behind a small API.</p>
          <div className="context-readout"><span>Current context</span><strong>{theme}</strong></div>
        </article>
      </div>
    </section>
  );
}

function SectionHeader({ number, title, description }) {
  return <div className="section-header"><span className="section-number">{number}</span><div><h1>{title}</h1><p>{description}</p></div></div>;
}

function RouterOverview() {
  useDocumentTitle('Router');
  return (
    <section className="page-wrap">
      <SectionHeader number="02" title="Router map" description="Routes turn the URL into application state. Try the nested screens and dynamic profiles." />
      <div className="router-layout">
        <aside className="route-menu"><p>ROUTE TREE</p><NavLink end to="/router">/router</NavLink><NavLink to="/router/concepts">/router/concepts</NavLink><NavLink to="/router/profile/ada">/router/profile/:name</NavLink></aside>
        <div className="route-content"><Outlet /></div>
      </div>
    </section>
  );
}

function RouterHome() {
  const navigate = useNavigate();
  return <div className="route-panel"><span className="card-label">Routes</span><h2>A route is a contract with the URL.</h2><p><code>Routes</code> matches the address, <code>Route</code> renders a screen, and <code>Link</code> navigates without a full page reload.</p><button className="primary" onClick={() => navigate('/router/profile/ada')}>Try a dynamic profile →</button></div>;
}

function RouterConcepts() {
  return <div className="route-panel"><span className="card-label">Nested routes</span><h2>Layouts can stay while content changes.</h2><p>The router renders this page inside the parent layout through <code>Outlet</code>. That keeps the route tree and navigation visible while the child screen swaps.</p><Link className="text-link" to="/hooks">Jump to hooks lab ↗</Link></div>;
}

function Profile() {
  const { name } = useParams();
  return <div className="route-panel profile"><span className="card-label">Params</span><div className="avatar">{name?.[0]?.toUpperCase()}</div><h2>Hello, {name}.</h2><p><code>useParams()</code> reads the <code>:name</code> segment from <code>/router/profile/:name</code>.</p><Link className="text-link" to="/router/concepts">See nested routing ↗</Link></div>;
}

function App() {
  return <Routes><Route path="/" element={<LabShell />}><Route index element={<Home />} /><Route path="hooks" element={<HooksLab />} /><Route path="router" element={<RouterOverview />}><Route index element={<RouterHome />} /><Route path="concepts" element={<RouterConcepts />} /><Route path="profile/:name" element={<Profile />} /></Route></Route></Routes>;
}

createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>);
