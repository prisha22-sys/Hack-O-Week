import { createContext, createRoot, useContext, useReducer, useState } from 'react';
import './styles.css';

const UserContext = createContext(null);

const initialTasks = [
  { id: 1, label: 'Read the Context API guide', done: true },
  { id: 2, label: 'Compare prop drilling', done: false },
  { id: 3, label: 'Try a styling approach', done: false },
];

function taskReducer(tasks, action) {
  if (action.type === 'toggle') return tasks.map((task) => task.id === action.id ? { ...task, done: !task.done } : task);
  if (action.type === 'add') return [...tasks, { id: Date.now(), label: action.label, done: false }];
  return tasks;
}

function UserBadge({ user }) {
  return <div className="user-badge"><span>{user.name[0]}</span><div><strong>{user.name}</strong><small>{user.role}</small></div></div>;
}

function PropDrillingDemo({ user }) {
  return <div className="demo-surface"><div className="flow-label">App → Dashboard → Toolbar → UserBadge</div><UserBadge user={user} /><p>The user travels through every component as a prop, even when the middle components do not use it.</p></div>;
}

function ContextBadge() {
  const user = useContext(UserContext);
  return <div className="demo-surface context-surface"><div className="flow-label">App → UserContext.Provider → UserBadge</div><UserBadge user={user} /><p><code>UserBadge</code> reads the nearest provider directly. No intermediate component needs to forward the prop.</p></div>;
}

function StatePatterns() {
  const [activePattern, setActivePattern] = useState('local');
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);
  const [newTask, setNewTask] = useState('');
  const completed = tasks.filter((task) => task.done).length;
  const patterns = {
    local: { title: 'Local state', summary: 'Keep state in the component that owns the interaction.', use: 'Form inputs, toggles, and temporary UI state.' },
    lifted: { title: 'Lifted state', summary: 'Move shared state to the closest common parent.', use: 'Two sibling components that must stay in sync.' },
    context: { title: 'Context state', summary: 'Provide shared values to a whole subtree.', use: 'Theme, locale, auth, or user preferences.' },
    reducer: { title: 'Reducer state', summary: 'Centralize transitions as explicit actions.', use: 'Several related values or complex update rules.' },
  };
  const current = patterns[activePattern];
  return <section className="state-section">
    <div className="section-heading"><span>02 / PATTERNS</span><h2>Choose the smallest tool that fits.</h2></div>
    <div className="pattern-tabs">{Object.keys(patterns).map((pattern) => <button className={activePattern === pattern ? 'selected' : ''} onClick={() => setActivePattern(pattern)} key={pattern}>{patterns[pattern].title}</button>)}</div>
    <div className="pattern-detail"><div><span className="eyebrow">{current.title}</span><h3>{current.summary}</h3><p><strong>Good for:</strong> {current.use}</p></div>{activePattern === 'reducer' ? <div className="task-widget"><div className="task-count">{completed}/{tasks.length} complete</div>{tasks.map((task) => <label key={task.id}><input type="checkbox" checked={task.done} onChange={() => dispatch({ type: 'toggle', id: task.id })} /> <span className={task.done ? 'done' : ''}>{task.label}</span></label>)}<form onSubmit={(event) => { event.preventDefault(); if (newTask.trim()) { dispatch({ type: 'add', label: newTask.trim() }); setNewTask(''); } }}><input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task" /><button>+</button></form></div> : <div className="pattern-graphic"><span>{activePattern === 'local' ? 'one component' : activePattern === 'lifted' ? 'one parent' : 'one provider'}</span><i>→</i><b>shared truth</b></div>}</div>
  </section>;
}

const styleExamples = [
  { name: 'CSS Modules', marker: '01', className: 'module-card', description: 'Scoped class names keep styles local to a component. Great for predictable, component-level CSS.', code: `import styles from './Card.module.css';\n\n<div className={styles.card}>Hello</div>` },
  { name: 'Tailwind CSS', marker: '02', className: 'tailwind-card', description: 'Utility classes keep styles close to markup and make rapid, consistent composition easy.', code: `<div className="rounded-lg bg-slate-900\n  p-6 text-white shadow-xl">Hello</div>` },
  { name: 'styled-components', marker: '03', className: 'styled-card', description: 'Styles live in JavaScript and can respond to props. Useful for dynamic, theme-aware components.', code: `const Card = styled.div\`\n  padding: 1.5rem;\n  background: #19231e;\n\`;` },
];

function StylingSection() {
  return <section className="styling-section"><div className="section-heading"><span>03 / STYLING</span><h2>Three ways to give components a voice.</h2></div><div className="style-grid">{styleExamples.map((style) => <article className="style-card" key={style.name}><div className={`style-preview ${style.className}`}><span>{style.marker}</span><strong>Component</strong></div><h3>{style.name}</h3><p>{style.description}</p><pre><code>{style.code}</code></pre></article>)}</div><div className="compare-note"><strong>How to choose:</strong> CSS Modules are a solid default for traditional CSS, Tailwind is efficient for a design system built from utilities, and styled-components suits prop-driven or colocated styling. They can coexist, but keep conventions clear.</div></section>;
}

function App() {
  const user = { name: 'Maya Chen', role: 'Frontend learner' };
  return <UserContext.Provider value={user}><div className="app"><header><div className="brand">STATE<span>/</span>STUDIO</div><span className="week-label">WEEK 13—14</span></header><main><section className="hero"><span className="eyebrow">React architecture / a practical field guide</span><h1>Where should<br /><em>state live?</em></h1><p>Understand the distance between a component and the data it needs, then choose a styling language that keeps your UI legible.</p></section><section className="context-section"><div className="section-heading"><span>01 / SHARING</span><h2>One user. Two delivery paths.</h2><p>Prop drilling is explicit and simple. Context removes repetitive plumbing when many descendants need the same value.</p></div><div className="comparison"><div><h3>Prop drilling</h3><PropDrillingDemo user={user} /></div><div><h3>Context API</h3><ContextBadge /></div></div><div className="rule"><strong>Use props</strong> when data has a clear parent-to-child path. <strong>Use Context</strong> when a value is truly shared across a subtree and passing it manually becomes noisy.</div></section><StatePatterns /><StylingSection /></main><footer>React state & styling / built for study</footer></div></UserContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App />);
