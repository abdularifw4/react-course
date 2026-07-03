# World-Class React Course Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the Indonesian React course (10 static HTML chapters) to a 15-chapter interactive course that takes complete beginners to senior level, worth Rp 5 million.

**Architecture:** Static HTML, no build step, no server. Shared CSS/JS extracted to `assets/`. Interactivity via vanilla JS + CDN (CodeMirror 5, Babel Standalone, React UMD) + localStorage. Sidebar nav rendered dynamically from a single `CHAPTERS` constant in `course.js` so adding chapters never requires editing 15 files.

**Tech Stack:** Tailwind CDN, highlight.js, CodeMirror 5 (CDN), Babel Standalone, React 18 UMD (playground iframe only), vanilla JS, localStorage.

**Design doc:** `docs/plans/2026-07-02-world-class-course-design.md`

**Language/tone:** Bahasa Indonesia santai "lo/gue", analogi kehidupan sehari-hari, seperti mentor senior yang asik. WAJIB konsisten di semua konten baru.

---

## Actual current chapter titles (use these, not the design doc's)

| # | File | Title | Lessons (checkboxes) |
|---|------|-------|----------------------|
| 1 | chapter-1.html | Pengenalan React | 13 |
| 2 | chapter-2.html | React Dasar | 12 |
| 3 | chapter-3.html | React Hooks Dasar | 12 |
| 4 | chapter-4.html | Hooks Advanced | 11 |
| 5 | chapter-5.html | Advanced Patterns | 13 |
| 6 | chapter-6.html | React & TypeScript | 13 |
| 7 | chapter-7.html | Next.js | 13 |
| 8 | chapter-8.html | State Management | 13 |
| 9 | chapter-9.html | React Testing | 9 |
| 10 | chapter-10.html | Performance | 9 |

**Level grouping (Awam → Senior):**
- 🟢 Fondasi: 0 (baru), 1, 2
- 🔵 Menengah: 3, 4, 5, 6, 7
- 🟣 Mahir: 8, 9, 10, 11 (baru), 12 (baru)
- 🔴 Senior: 13 (baru), 14 (baru)

**Known bug to fix during refactor:** `restoreChecks()` in every chapter is a no-op (`if (c.checked) c.checked = true;`) — checkbox state is saved as counts only, never restored per-lesson. The new `course.js` must save per-lesson IDs and restore them on load.

**Verification setup (used by many tasks):** run `python3 -m http.server 8080` from repo root in background; verify pages at `http://localhost:8080/...`. Word counts: `python3 -c "import re,sys,html; t=open(sys.argv[1]).read(); t=re.sub(r'<script.*?</script>|<style.*?</style>|<[^>]+>',' ',t,flags=re.S); print(len(html.unescape(t).split()))" <file>`.

---

# Phase 1 — Shared Infrastructure

## Task 1: Extract shared CSS to `assets/course.css`

**Files:**
- Create: `assets/course.css`
- Modify: `chapters/chapter-1.html` … `chapters/chapter-10.html` (replace inline `<style>` block)

**Step 1: Create `assets/course.css`** with the union of all inline styles currently in chapters (they are near-identical; chapter-5's block is the canonical version). Content:

```css
/* React Course — shared styles */
* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body { font-family: 'Inter', system-ui, sans-serif; }
:root {
    --shadow-sm: 0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.04);
    --shadow-md: 0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.05), 0 4px 12px -2px rgba(0,0,0,0.05);
    --shadow-md-hover: 0 0 0 1px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.06), 0 8px 20px -4px rgba(0,0,0,0.07);
    --shadow-lg: 0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px -4px rgba(0,0,0,0.08), 0 16px 48px -8px rgba(0,0,0,0.06);
    --shadow-xl: 0 0 0 1px rgba(0,0,0,0.06), 0 12px 32px -4px rgba(0,0,0,0.1), 0 24px 64px -12px rgba(0,0,0,0.08);
}
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; }
.shadow-card { box-shadow: var(--shadow-md); transition: box-shadow .2s ease, transform .2s ease; }
.shadow-card:hover { box-shadow: var(--shadow-md-hover); transform: translateY(-2px); }
.shadow-soft { box-shadow: var(--shadow-sm); }
.shadow-lifted { box-shadow: var(--shadow-lg); }
.shadow-window { box-shadow: var(--shadow-xl); }
.press { transition: transform .15s ease; }
.press:active { transform: scale(.96); }
.lesson-card { box-shadow: var(--shadow-sm); transition: box-shadow .2s ease; }
.lesson-card:hover { box-shadow: var(--shadow-md); }
.nav-link { transition: background .15s ease, color .15s ease; }
.nav-link:hover, .nav-link.active { background: #F3F0FA; color: #0B0B0B; }
.nav-link.active span:first-child { background: #0B0B0B !important; color: white !important; }
.nav-underline { position: relative; }
.nav-underline::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background: #0B0B0B; transform: scaleX(0); transform-origin: left; transition: transform .2s ease; }
.nav-underline:hover::after { transform: scaleX(1); }
pre code { border-radius: 0; font-size: .825rem; line-height: 1.6; }
.code-block { box-shadow: var(--shadow-sm); border-radius: .75rem; overflow: hidden; }
.tip-box { border-left: 3px solid #0B0B0B; background: #F3F0FA; }
.warning-box { border-left: 3px solid #f59e0b; background: #FFF7ED; }
.fade-in { opacity: 0; transform: translateY(16px); animation: enter .4s cubic-bezier(.2,0,0,1) forwards; }
.fade-in-d1 { animation-delay: 80ms; }
.fade-in-d2 { animation-delay: 160ms; }
.fade-in-d3 { animation-delay: 240ms; }
.enter { opacity: 0; transform: translateY(16px); animation: enter .5s cubic-bezier(.2,0,0,1) forwards; }
.enter-d1 { animation-delay: 80ms; }
.enter-d2 { animation-delay: 160ms; }
.enter-d3 { animation-delay: 240ms; }
.stagger > * { opacity: 0; transform: translateY(16px); animation: enter .5s cubic-bezier(.2,0,0,1) forwards; }
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 60ms; }
.stagger > *:nth-child(3) { animation-delay: 120ms; }
.stagger > *:nth-child(4) { animation-delay: 180ms; }
.stagger > *:nth-child(5) { animation-delay: 240ms; }
.stagger > *:nth-child(6) { animation-delay: 300ms; }
.stagger > *:nth-child(7) { animation-delay: 360ms; }
.stagger > *:nth-child(8) { animation-delay: 420ms; }
.stagger > *:nth-child(9) { animation-delay: 480ms; }
.stagger > *:nth-child(10) { animation-delay: 540ms; }
@keyframes enter { to { opacity: 1; transform: translateY(0); } }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0,0,0,.12); border-radius: 5px; border: 2px solid #fff; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.2); }
.lesson-checkbox:checked + .lesson-label { text-decoration: line-through; color: #999; }
.mobile-menu { transition: max-height .3s ease; max-height: 0; overflow: hidden; }
.mobile-menu.open { max-height: 500px; }

/* ===== Quiz ===== */
.quiz-option { border: 1px solid rgba(0,0,0,.08); transition: border-color .15s, background .15s; cursor: pointer; }
.quiz-option:hover { border-color: rgba(0,0,0,.25); background: #FAFAFA; }
.quiz-option.correct { border-color: #16a34a; background: #F0FDF4; }
.quiz-option.wrong { border-color: #dc2626; background: #FEF2F2; }
.quiz-option.disabled { pointer-events: none; opacity: .7; }
.quiz-option.correct, .quiz-option.wrong { opacity: 1; }

/* ===== Playground ===== */
.playground { box-shadow: var(--shadow-md); border-radius: .75rem; overflow: hidden; }
.playground .CodeMirror { height: auto; min-height: 180px; font-family: 'JetBrains Mono', monospace; font-size: .825rem; line-height: 1.6; }
.playground iframe { width: 100%; min-height: 160px; border: 0; background: #fff; }

/* ===== Exercise accordion ===== */
details.exercise summary { cursor: pointer; list-style: none; }
details.exercise summary::-webkit-details-marker { display: none; }

@media print { .no-print { display: none !important; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
```

**Step 2:** In each `chapters/chapter-N.html` (N=1..10), replace the whole inline `<style>…</style>` block with:

```html
<link rel="stylesheet" href="../assets/course.css">
```

Do NOT touch `index.html` yet (it is rebuilt in Phase 4).

**Step 3: Verify** — `python3 -m http.server 8080` then open `http://localhost:8080/chapters/chapter-5.html`; visual layout must be identical (sidebar, cards, code blocks, tip boxes). Also `grep -c 'course.css' chapters/*.html` → 10 files show 1.

**Step 4: Commit** — `git add -A && git commit -m "refactor: extract shared CSS to assets/course.css"`

## Task 2: Shared `assets/course.js` — dynamic sidebar + fixed progress

**Files:**
- Create: `assets/course.js`
- Modify: `chapters/chapter-1.html` … `chapter-10.html` (remove inline script, remove hardcoded sidebar `<nav>` list, add data attribute + script tag)

**Step 1: Create `assets/course.js`:**

```js
/* React Course — shared runtime: sidebar, progress, copy code */

const CHAPTERS = [
  { id: 0,  file: 'chapter-0.html',  short: 'JS Dasar',       title: 'JavaScript Essentials', level: 'fondasi' },
  { id: 1,  file: 'chapter-1.html',  short: 'Intro',          title: 'Pengenalan React',      level: 'fondasi' },
  { id: 2,  file: 'chapter-2.html',  short: 'React Dasar',    title: 'React Dasar',           level: 'fondasi' },
  { id: 3,  file: 'chapter-3.html',  short: 'Hooks Dasar',    title: 'React Hooks Dasar',     level: 'menengah' },
  { id: 4,  file: 'chapter-4.html',  short: 'Hooks Advanced', title: 'Hooks Advanced',        level: 'menengah' },
  { id: 5,  file: 'chapter-5.html',  short: 'Patterns',       title: 'Advanced Patterns',     level: 'menengah' },
  { id: 6,  file: 'chapter-6.html',  short: 'TypeScript',     title: 'React & TypeScript',    level: 'menengah' },
  { id: 7,  file: 'chapter-7.html',  short: 'Next.js',        title: 'Next.js',               level: 'menengah' },
  { id: 8,  file: 'chapter-8.html',  short: 'State Mgmt',     title: 'State Management',      level: 'mahir' },
  { id: 9,  file: 'chapter-9.html',  short: 'Testing',        title: 'React Testing',         level: 'mahir' },
  { id: 10, file: 'chapter-10.html', short: 'Performance',    title: 'Performance',           level: 'mahir' },
  { id: 11, file: 'chapter-11.html', short: 'Internals',      title: 'React Internals',       level: 'mahir' },
  { id: 12, file: 'chapter-12.html', short: 'Arsitektur',     title: 'Arsitektur & Patterns', level: 'mahir' },
  { id: 13, file: 'chapter-13.html', short: 'Projects',       title: 'Capstone Projects',     level: 'senior' },
  { id: 14, file: 'chapter-14.html', short: 'Interview',      title: 'Interview & Career',    level: 'senior' },
];
const LEVELS = {
  fondasi:  { label: 'Fondasi',  dot: '#16a34a' },
  menengah: { label: 'Menengah', dot: '#2563eb' },
  mahir:    { label: 'Mahir',    dot: '#9333ea' },
  senior:   { label: 'Senior',   dot: '#dc2626' },
};

const STORAGE_KEY = 'react-course-progress-v2';

function getProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

/* current chapter id from <body data-chapter="N"> */
function currentChapter() {
  const v = document.body.dataset.chapter;
  return v === undefined ? null : Number(v);
}

/* ---- Sidebar (rendered dynamically) ---- */
function renderSidebar() {
  const mount = document.getElementById('sidebarNav');
  if (!mount) return;
  const cur = currentChapter();
  let html = '';
  let lastLevel = null;
  for (const ch of CHAPTERS) {
    if (ch.level !== lastLevel) {
      lastLevel = ch.level;
      const lv = LEVELS[ch.level];
      html += `<p class="px-3 mt-4 mb-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full" style="background:${lv.dot}"></span>${lv.label}</p>`;
    }
    const active = ch.id === cur;
    html += `<a href="${ch.file}" class="nav-link ${active ? 'active' : ''} flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${active ? 'text-ink' : 'text-muted'}">
      <span class="w-6 h-6 ${active ? 'bg-ink text-white' : 'bg-black/5 text-muted'} rounded flex items-center justify-center text-xs font-bold tabular-nums">${ch.id}</span>
      ${ch.short}</a>`;
  }
  mount.innerHTML = html;
}

/* ---- Per-lesson progress (fixes old no-op restoreChecks) ---- */
function updateProgress() {
  const cur = currentChapter();
  if (cur === null) return;
  const progress = getProgress();
  const boxes = [...document.querySelectorAll('.lesson-checkbox')];
  const done = boxes.filter(b => b.checked).map(b => b.id);
  progress['chapter-' + cur] = { done, total: boxes.length };
  saveProgress(progress);
  renderGlobalProgress();
}

function restoreChecks() {
  const cur = currentChapter();
  if (cur === null) return;
  const saved = getProgress()['chapter-' + cur];
  if (!saved || !saved.done) return;
  for (const id of saved.done) {
    const box = document.getElementById(id);
    if (box) box.checked = true;
  }
}

function renderGlobalProgress() {
  const progress = getProgress();
  let completed = 0, total = 0;
  for (const ch of CHAPTERS) {
    const p = progress['chapter-' + ch.id];
    if (p) { completed += p.done.length; total += p.total; }
  }
  const pct = total > 0 ? Math.round(completed / total * 100) : 0;
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  if (bar) bar.style.width = pct + '%';
  if (text) text.textContent = completed + '/' + total;
}

function markChapterComplete(ch) {
  document.querySelectorAll('.lesson-checkbox').forEach(c => c.checked = true);
  updateProgress();
  const btn = document.getElementById('completeBtn' + ch);
  if (btn) { btn.textContent = '✓ Bab Selesai!'; btn.classList.add('opacity-75'); btn.disabled = true; }
}

/* ---- Copy code ---- */
function copyCode(btn) {
  const code = btn.closest('.code-block').querySelector('code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Tersalin!';
    setTimeout(() => btn.textContent = original, 2000);
  });
}

/* ---- Sidebar toggle (mobile) ---- */
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('-translate-x-full');
  document.getElementById('sidebarOverlay').classList.toggle('hidden');
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  restoreChecks();
  renderGlobalProgress();
  if (window.hljs) hljs.highlightAll();
});
```

**Step 2:** In each chapter file:
1. Add `data-chapter="N"` to `<body>`.
2. Replace the hardcoded chapter list inside `<nav class="px-2 pb-6 …">` with `<nav id="sidebarNav" class="px-2 pb-6 space-y-0.5"></nav>` (keep the "Daftar Bab" heading out — course.js renders level headers).
3. Delete the entire inline `<script>` block at the bottom (copyCode/progress/etc.) and replace with `<script src="../assets/course.js"></script>` placed before `</body>`.
4. Keep the `hljs` CDN script tags in `<head>`.

**Step 3: Verify** in browser: sidebar shows 15 chapters grouped by 4 level headers; checking a lesson, reloading the page → checkbox stays checked (this was broken before); progress bar updates. Console has no errors. Links to chapter-0/11-14 will 404 until Phase 2 — acceptable.

**Step 4:** Note: old localStorage key `react-course-progress` is abandoned (schema changed from counts to id list); new key is `react-course-progress-v2`. No migration needed (counts can't be mapped back to specific lessons).

**Step 5: Commit** — `refactor: shared course.js — dynamic 15-chapter sidebar, fix progress restore`

## Task 3: Live playground — `assets/playground.js`

**Files:**
- Create: `assets/playground.js`
- Create: `test-playground.html` (temporary test page, deleted after Phase 3)

**Design:** A `<div class="playground-mount" data-code-id="X">` next to a `<script type="text/plain" id="X">…JSX…</script>` becomes: CodeMirror editor + "▶ Jalankan" button + iframe preview. Run = build an iframe srcdoc containing React UMD + Babel Standalone + the user's code, so user code executes isolated in the iframe (not the course page).

**Step 1: Create `assets/playground.js`:**

```js
/* React Course — live playground: CodeMirror + Babel + iframe preview */

const PG_CDN = {
  cmCss: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css',
  cmJs:  'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js',
  cmJsx: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/jsx/jsx.min.js',
  cmXml: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js',
  cmJsMode: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js',
};

let pgLoaded = null;
function pgLoadDeps() {
  if (pgLoaded) return pgLoaded;
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = PG_CDN.cmCss;
  document.head.appendChild(css);
  const load = src => new Promise((ok, err) => {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = err;
    document.head.appendChild(s);
  });
  pgLoaded = load(PG_CDN.cmJs)
    .then(() => Promise.all([load(PG_CDN.cmXml), load(PG_CDN.cmJsMode)]))
    .then(() => load(PG_CDN.cmJsx));
  return pgLoaded;
}

function pgSrcdoc(code) {
  return `<!DOCTYPE html><html><head>
<script src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<style>body{font-family:system-ui,sans-serif;margin:12px;color:#111}
button{font:inherit;padding:4px 12px;border-radius:6px;border:1px solid #ccc;background:#f5f5f5;cursor:pointer}
input,select,textarea{font:inherit;padding:4px 8px;border:1px solid #ccc;border-radius:6px}
.pg-error{color:#dc2626;font-family:ui-monospace,monospace;font-size:13px;white-space:pre-wrap}</style>
</head><body><div id="root"></div>
<script>
window.onerror = function(msg){ document.getElementById('root').innerHTML = '<div class="pg-error">❌ ' + String(msg).replace(/</g,'&lt;') + '</div>'; };
try {
  var compiled = Babel.transform(${JSON.stringify(code)}, { presets: [['react', {runtime:'classic'}]] }).code;
  var fn = new Function('React', 'ReactDOM', compiled + ';\\nif (typeof App !== "undefined") { ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App)); }');
  fn(React, ReactDOM);
} catch (e) {
  document.getElementById('root').innerHTML = '<div class="pg-error">❌ ' + String(e.message).replace(/</g,'&lt;') + '</div>';
}
<\/script></body></html>`;
}

function initPlaygrounds() {
  const mounts = document.querySelectorAll('.playground-mount');
  if (!mounts.length) return;
  pgLoadDeps().then(() => {
    mounts.forEach(mount => {
      const codeEl = document.getElementById(mount.dataset.codeId);
      const initial = codeEl ? codeEl.textContent.trim() : '';
      mount.innerHTML = `
        <div class="playground bg-white">
          <div class="bg-[#F5F4F1] px-4 py-2 flex items-center justify-between border-b border-black/[0.06]">
            <span class="text-xs text-muted font-medium">⚡ Live Playground — edit kodenya, klik Jalankan</span>
            <div class="flex gap-2">
              <button class="pg-reset text-xs text-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-black/5">Reset</button>
              <button class="pg-run text-xs font-semibold bg-ink text-white px-3 py-1 rounded-lg press">▶ Jalankan</button>
            </div>
          </div>
          <div class="pg-editor"></div>
          <div class="border-t border-black/[0.06] bg-[#FAFAFA] px-4 py-1.5"><span class="text-[10px] uppercase tracking-wider font-semibold text-muted">Preview</span></div>
          <iframe sandbox="allow-scripts"></iframe>
        </div>`;
      const cm = CodeMirror(mount.querySelector('.pg-editor'), {
        value: initial, mode: 'jsx', lineNumbers: true, viewportMargin: Infinity, tabSize: 2,
      });
      const iframe = mount.querySelector('iframe');
      const run = () => { iframe.srcdoc = pgSrcdoc(cm.getValue()); };
      mount.querySelector('.pg-run').addEventListener('click', run);
      mount.querySelector('.pg-reset').addEventListener('click', () => { cm.setValue(initial); run(); });
      run(); // auto-run initial code
    });
  });
}
document.addEventListener('DOMContentLoaded', initPlaygrounds);
```

**Embed template** (this exact pattern is used in chapter content — the code lives in a `text/plain` script so HTML entities are not needed):

```html
<script type="text/plain" id="pg-1-3">function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Tambah</button>
    </div>
  );
}</script>
<div class="playground-mount mt-4 mb-4" data-code-id="pg-1-3"></div>
```

Convention: playground code defines `function App()`; the runner renders `<App />` automatically. IDs: `pg-<chapter>-<n>`.

**Step 2: Create `test-playground.html`** at repo root: minimal page with course.css, one playground embed (counter example above), `<script src="assets/playground.js"></script>`.

**Step 3: Verify** at `http://localhost:8080/test-playground.html`: editor renders with syntax highlighting; initial code auto-runs showing a working counter; clicking button in preview increments; breaking the code (delete a brace) + Jalankan shows ❌ error message; Reset restores.

**Step 4: Commit** — `feat: live playground (CodeMirror + Babel + sandboxed iframe)`

## Task 4: Quiz + challenge engine — `assets/quiz.js`

**Files:**
- Create: `assets/quiz.js`
- Modify: `test-playground.html` (add a quiz + a challenge for testing)

**Design:**
- Quiz: `<div class="quiz-mount" data-quiz-id="quiz-N"></div>` + `<script type="application/json" id="quiz-N">[…]</script>`. Renders one question at a time, click answer → instant correct/wrong coloring + explanation box, then "Lanjut". End screen: score X/Y + "Ulangi". Score saved to progress storage under `quiz` field.
- Challenge: playground variant with hidden tests. `<script type="text/plain" id="ch-N">starter code</script>` + `<script type="text/plain" id="ch-N-test">assertion code</script>` + `<div class="challenge-mount" data-code-id="ch-N">`. Test code runs in the iframe after user code; calls `parent.postMessage({challenge:'ch-N', pass:true/false, msg}, '*')`. quiz.js listens and shows ✅ badge + saves to storage.

**Step 1: Create `assets/quiz.js`:**

```js
/* React Course — quiz + coding challenge engine */

/* ---------- Quiz ---------- */
function initQuizzes() {
  document.querySelectorAll('.quiz-mount').forEach(mount => {
    const dataEl = document.getElementById(mount.dataset.quizId);
    if (!dataEl) return;
    const questions = JSON.parse(dataEl.textContent);
    renderQuiz(mount, mount.dataset.quizId, questions);
  });
}

function renderQuiz(mount, quizId, questions) {
  let idx = 0, score = 0;
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');

  function showQuestion() {
    const q = questions[idx];
    mount.innerHTML = `
      <div class="bg-white rounded-2xl p-6 shadow-soft">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-muted uppercase tracking-wider">\u{1F9E0} Quiz — Soal ${idx + 1}/${questions.length}</span>
          <span class="text-xs text-muted tabular-nums">Skor: ${score}</span>
        </div>
        <p class="font-semibold text-ink mb-4">${q.q}</p>
        <div class="space-y-2">${q.options.map((o, i) =>
          `<div class="quiz-option rounded-xl px-4 py-3 text-sm" data-i="${i}">${esc(o)}</div>`).join('')}
        </div>
        <div class="quiz-explain hidden mt-4 tip-box rounded-xl p-4 text-sm"></div>
        <button class="quiz-next hidden mt-4 bg-ink text-white text-sm font-medium px-4 py-2 rounded-lg press">
          ${idx + 1 === questions.length ? 'Lihat Hasil' : 'Lanjut →'}</button>
      </div>`;
    mount.querySelectorAll('.quiz-option').forEach(opt => opt.addEventListener('click', () => {
      const i = Number(opt.dataset.i);
      mount.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));
      mount.querySelectorAll('.quiz-option')[q.answer].classList.add('correct');
      if (i === q.answer) score++;
      else opt.classList.add('wrong');
      const ex = mount.querySelector('.quiz-explain');
      ex.innerHTML = `<strong>${i === q.answer ? '✅ Benar!' : '❌ Belum tepat.'}</strong> ${q.explain}`;
      ex.classList.remove('hidden');
      mount.querySelector('.quiz-next').classList.remove('hidden');
    }));
    mount.querySelector('.quiz-next').addEventListener('click', () => {
      idx++;
      idx < questions.length ? showQuestion() : showResult();
    });
  }

  function showResult() {
    saveQuizScore(quizId, score, questions.length);
    const pct = Math.round(score / questions.length * 100);
    const msg = pct === 100 ? '\u{1F3C6} Sempurna! Lo udah nguasain bab ini.'
      : pct >= 70 ? '\u{1F4AA} Solid! Review lagi soal yang salah, terus lanjut.'
      : '\u{1F4DA} Belum lulus. Baca ulang babnya — fondasi yang kuat itu segalanya.';
    mount.innerHTML = `
      <div class="bg-white rounded-2xl p-6 shadow-soft text-center">
        <p class="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Hasil Quiz</p>
        <p class="text-4xl font-extrabold text-ink tabular-nums mb-1">${score}/${questions.length}</p>
        <p class="text-sm text-muted mb-4">${msg}</p>
        <button class="quiz-retry text-sm font-medium border border-black/10 px-4 py-2 rounded-lg press hover:bg-black/5">↺ Ulangi Quiz</button>
      </div>`;
    mount.querySelector('.quiz-retry').addEventListener('click', () => { idx = 0; score = 0; showQuestion(); });
  }
  showQuestion();
}

function saveQuizScore(quizId, score, total) {
  const progress = getProgress();
  progress.quiz = progress.quiz || {};
  const prev = progress.quiz[quizId];
  if (!prev || score > prev.score) progress.quiz[quizId] = { score, total };
  saveProgress(progress);
}

/* ---------- Coding challenge ---------- */
function initChallenges() {
  const mounts = document.querySelectorAll('.challenge-mount');
  if (!mounts.length) return;
  pgLoadDeps().then(() => mounts.forEach(mount => {
    const id = mount.dataset.codeId;
    const starter = document.getElementById(id).textContent.trim();
    const testCode = document.getElementById(id + '-test').textContent.trim();
    mount.innerHTML = `
      <div class="playground bg-white">
        <div class="bg-[#0B0B0B] px-4 py-2 flex items-center justify-between">
          <span class="text-xs text-white/80 font-medium">\u{1F3AF} Challenge — lengkapi kodenya sampai semua test lulus</span>
          <div class="flex items-center gap-2">
            <span class="ch-badge text-xs text-white/50">belum dites</span>
            <button class="ch-run text-xs font-semibold bg-white text-ink px-3 py-1 rounded-lg press">▶ Test</button>
          </div>
        </div>
        <div class="pg-editor"></div>
        <iframe sandbox="allow-scripts" style="min-height:120px"></iframe>
      </div>`;
    const cm = CodeMirror(mount.querySelector('.pg-editor'), {
      value: starter, mode: 'jsx', lineNumbers: true, viewportMargin: Infinity, tabSize: 2,
    });
    const saved = (getProgress().challenges || {})[id];
    const badge = mount.querySelector('.ch-badge');
    if (saved) { badge.textContent = '✅ Lulus'; badge.className = 'ch-badge text-xs text-green-400 font-semibold'; }
    mount.querySelector('.ch-run').addEventListener('click', () => {
      const full = cm.getValue() + '\n\n/* ---- tests ---- */\n' + challengeTestRunner(id, testCode);
      mount.querySelector('iframe').srcdoc = pgSrcdoc(full);
    });
  }));
  window.addEventListener('message', e => {
    if (!e.data || !e.data.challenge) return;
    const mount = document.querySelector(`.challenge-mount[data-code-id="${e.data.challenge}"]`);
    if (!mount) return;
    const badge = mount.querySelector('.ch-badge');
    if (e.data.pass) {
      badge.textContent = '✅ Lulus';
      badge.className = 'ch-badge text-xs text-green-400 font-semibold';
      const progress = getProgress();
      progress.challenges = progress.challenges || {};
      progress.challenges[e.data.challenge] = true;
      saveProgress(progress);
    } else {
      badge.textContent = '❌ ' + (e.data.msg || 'gagal');
      badge.className = 'ch-badge text-xs text-red-400 font-semibold';
    }
  });
}

function challengeTestRunner(id, testCode) {
  return `
setTimeout(function() {
  var results = [];
  function expect(desc, cond) { results.push({desc: desc, pass: !!cond}); }
  try { ${testCode} } catch (e) { results.push({desc: e.message, pass: false}); }
  var failed = results.filter(function(r){ return !r.pass; });
  var el = document.createElement('div');
  el.style.cssText = 'margin-top:12px;padding:8px 12px;border-radius:8px;font-size:13px;font-family:ui-monospace,monospace;background:' + (failed.length ? '#FEF2F2' : '#F0FDF4');
  el.innerHTML = results.map(function(r){ return (r.pass ? '✅ ' : '❌ ') + r.desc; }).join('<br>');
  document.body.appendChild(el);
  parent.postMessage({challenge: ${JSON.stringify(id)}, pass: failed.length === 0, msg: failed.length ? failed.length + ' test gagal' : ''}, '*');
}, 300);`;
}

document.addEventListener('DOMContentLoaded', () => { initQuizzes(); initChallenges(); });
```

Note: `quiz.js` depends on `getProgress`/`saveProgress` (course.js) and `pgLoadDeps`/`pgSrcdoc` (playground.js). Load order in every chapter: course.js → playground.js → quiz.js.

**Quiz JSON format** (content tasks use this):

```html
<script type="application/json" id="quiz-1">
[
  {"q": "JSX itu sebenarnya apa?", "options": ["HTML di dalam JS", "Sugar syntax untuk React.createElement", "Template engine", "Bahasa baru"], "answer": 1, "explain": "JSX di-compile jadi panggilan React.createElement() — hasil akhirnya object JavaScript biasa."}
]
</script>
<div class="quiz-mount mt-6" data-quiz-id="quiz-1"></div>
```

**Challenge test convention:** test code runs inside the iframe after user code + React render. It can query the DOM (`document.querySelector`) and use `expect(desc, cond)`. Example test: `expect('Ada tombol', document.querySelector('button') !== null)`.

**Step 2:** Add one quiz (2 questions) and one challenge to `test-playground.html`.

**Step 3: Verify** in browser: quiz answer flow works (colors, explanation, score, retry); challenge with intentionally-incomplete starter fails with ❌, fixing the code and re-running shows ✅ and badge persists after reload.

**Step 4: Commit** — `feat: quiz + coding challenge engine`

---

# Phase 2 — New Chapters (0, 11, 12, 13, 14)

**Every new chapter uses this page skeleton** (copy the `<head>`, sidebar `<aside>`, topbar, and footer nav structure from `chapters/chapter-5.html` AFTER Tasks 1–2 are done, so it already uses shared assets):

- `<head>`: fonts, Tailwind CDN + config (keep inline — it must run before Tailwind), hljs CDN, `<link rel="stylesheet" href="../assets/course.css">`
- `<body data-chapter="N">`
- Sidebar with `<nav id="sidebarNav">`
- Hero header: chapter number badge + title + subtitle + level chip (🟢/🔵/🟣/🔴)
- 8–10 `<section class="lesson-card">` lessons, each with checkbox `id="check-N-M"`, reading-time label, content
- Section "⚠️ Kesalahan Umum" (bagian dari lesson terakhir sebelum quiz)
- Exercises: 2–3 `<details class="exercise">` with hidden solutions
- Quiz block (6–8 soal) at the end
- Prev/next chapter buttons + "Tandai Bab Selesai" button
- Scripts: `../assets/course.js`, `../assets/playground.js`, `../assets/quiz.js`

**Content quality bar per chapter (WAJIB):**
- ≥ 4.000 kata (verify with word-count command above)
- ≥ 10 code blocks
- ≥ 2 live playgrounds (`pg-N-*`), ≥ 1 challenge (`ch-N-*`)
- Gaya "lo/gue", minimal 3 analogi kehidupan sehari-hari
- Setiap lesson ada tip-box "💡 OH TERNYATA GITU!" atau warning-box "⚠️ JANGAN TERJERAT!"

**Exercise accordion template:**

```html
<details class="exercise bg-white rounded-xl shadow-soft mt-4">
  <summary class="px-5 py-4 flex items-center justify-between">
    <span class="font-semibold text-ink text-sm">✏️ Latihan 1: [judul]</span>
    <span class="text-xs text-muted">klik untuk lihat solusi</span>
  </summary>
  <div class="px-5 pb-5 border-t border-black/[0.06] pt-4">
    <!-- solusi: code block + penjelasan -->
  </div>
</details>
```

## Task 5: Bab 0 — JavaScript Essentials untuk React

**Files:** Create `chapters/chapter-0.html`

Lessons (9): 1) Kenapa harus jago JS dulu sebelum React (+ cara pakai browser console); 2) Variabel & tipe data — let/const, string, number, boolean, null/undefined; 3) Function — deklarasi, arrow function, parameter default, kenapa React penuh arrow function; 4) Array & method wajib — map, filter, find, reduce, some/every (map = jantung render list di React); 5) Object & destructuring — akses, spread, rest, destructuring di parameter (== props!); 6) Template literals & conditional — ternary, &&, || (== conditional rendering); 7) Modules — import/export, default vs named; 8) Async — callback → promise → async/await, fetch dasar; 9) DOM & events singkat — apa yang React otomatisasi. Kesalahan umum: mutasi array (push vs spread), `==` vs `===`, lupa return di arrow function dengan body `{}`.

Playgrounds: `pg-0-1` (array map render list — pakai vanilla, bukan React: cukup App yang me-render hasil map), `pg-0-2` (destructuring + template literal). Challenge `ch-0-1`: "pakai filter + map untuk render list belanja di atas 10rb".

Quiz 8 soal. Commit: `feat: Bab 0 — JavaScript Essentials untuk React`

## Task 6: Bab 11 — React Internals

**Files:** Create `chapters/chapter-11.html`

Lessons (9): 1) Kenapa senior harus paham internals (debugging & interview); 2) Dari JSX ke element object — createElement, element tree; 3) Virtual DOM: mitos vs fakta — apa yang sebenarnya di-diff; 4) Render & commit phase — dua fase yang beda tugas; 5) Reconciliation — algoritma diffing, kenapa `key` bukan sekadar aturan lint (demo bug list tanpa key di playground); 6) Fiber architecture — kenapa React ditulis ulang, unit of work, interruptible rendering; 7) Batching & scheduling — automatic batching React 18, prioritas update; 8) Concurrent features — useTransition, useDeferredValue, Suspense (kapan dipakai beneran); 9) StrictMode & double render — kenapa efek jalan 2x di dev. Kesalahan umum: index sebagai key, mutasi state langsung, salah paham "VDOM itu cepat".

Playgrounds: `pg-11-1` (bug key: list dengan input, hapus item pakai index key → state nyasar), `pg-11-2` (useTransition: filter list besar). Challenge `ch-11-1`: perbaiki komponen list yang pakai index key.

Quiz 8 soal. Commit: `feat: Bab 11 — React Internals`

## Task 7: Bab 12 — Arsitektur & Design Patterns

**Files:** Create `chapters/chapter-12.html`

Lessons (9): 1) Kenapa arsitektur = pembeda junior vs senior; 2) Struktur folder production — by-feature vs by-type, contoh nyata app skala menengah; 3) Component design — presentational vs container (versi modern), kapan memecah komponen; 4) Custom hooks sebagai unit arsitektur — ekstraksi logic, hook composition; 5) Compound components — pattern Tab/Accordion dengan Context; 6) Render optimization patterns — children as props, component composition untuk hindari re-render; 7) Feature-sliced design — layers, slices, public API per feature; 8) Dependency boundaries — kenapa UI nggak boleh import dari fitur lain sembarangan, dependency arrows; 9) Code review mindset — apa yang dilihat senior saat review PR React (checklist nyata). Kesalahan umum: folder components/ raksasa, prop drilling 5 level, "utils.js" jadi tempat sampah.

Playgrounds: `pg-12-1` (compound component Tabs), `pg-12-2` (composition menghindari re-render — dengan console.log render counter). Challenge `ch-12-1`: refactor komponen monolitik jadi compound components.

Quiz 8 soal. Commit: `feat: Bab 12 — Arsitektur & Design Patterns`

## Task 8: Bab 13 — Capstone Projects

**Files:** Create `chapters/chapter-13.html`

Struktur berbeda: 3 "project section" (bukan lesson biasa), masing-masing dengan milestone checklist (pakai lesson-checkbox per milestone supaya masuk progress).

- **Project 1 — Habit Tracker (🟢→🔵):** setup Vite, komponen form + list, useState + useEffect, persist localStorage, streak counter. 5 milestones, tiap milestone: deskripsi target, hint, lalu `<details>` solusi lengkap dengan kode.
- **Project 2 — Toko Online Mini (🔵→🟣):** React Router, fetch produk dari fakestoreapi.com, halaman detail, cart global (Context/Zustand), checkout form + validasi. 6 milestones.
- **Project 3 — Dashboard Realtime (🟣→🔴):** simulasi data stream (setInterval + random walk — jelaskan cara upgrade ke WebSocket beneran), chart (recharts), memoization untuk row list besar, virtual list sederhana, dark mode. 6 milestones.

Setiap project: arsitektur folder yang dianjurkan, kode solusi per milestone, section "Upgrade Ideas" untuk portfolio. Total ≥ 5.000 kata. Playground tidak wajib di bab ini (proyek dikerjakan di editor lokal) tapi tetap ≥ 1 playground untuk demo konsep kunci. Quiz diganti "Project Checklist" self-assessment.

Commit: `feat: Bab 13 — 3 Capstone Projects bertingkat`

## Task 9: Bab 14 — Interview Prep & Career

**Files:** Create `chapters/chapter-14.html`

Lessons (8): 1) Peta karir React di Indonesia — junior/mid/senior, range gaji realistis 2026, remote vs lokal; 2) Menyusun portfolio yang dilirik — 3 proyek > 30 tutorial clone, README yang menjual, deploy; 3) CV & LinkedIn untuk frontend — keyword ATS, cara nulis impact; 4) 25 pertanyaan interview React paling sering + jawaban model (state vs props, useEffect lifecycle, key, memo, closure stale state, dll — format Q&A accordion `<details>`); 5) Live coding interview — strategi, think-aloud, contoh soal umum (counter, todo, fetch + loading state) dengan walkthrough; 6) Frontend system design dasar — komponen design interview: routing, state, caching, error handling (contoh: "design halaman feed"); 7) Take-home project — cara ngerjain yang bikin reviewer terkesan; 8) Negosiasi & first 90 days — negosiasi offer, ekspektasi probation, cara naik cepat. Kesalahan umum: apply spray-and-pray, portfolio isinya clone semua, nggak nanya balik saat interview.

Quiz 8 soal (berbasis pertanyaan interview nyata). Challenge `ch-14-1`: soal live-coding klasik (buat komponen SearchableList).

Commit: `feat: Bab 14 — Interview Prep & Career`

---

# Phase 3 — Deepen Chapters 1–10

## Task 10–19: Satu task per bab (chapter-1 … chapter-10)

**Per chapter, tambahkan (jangan menulis ulang konten yang sudah bagus):**

1. **Section "⚠️ Kesalahan Umum"** sebelum bagian akhir — 4–6 kesalahan nyata pemula/menengah di topik bab itu, masing-masing: kode salah → kenapa salah → kode benar.
2. **2–3 Latihan** (`<details class="exercise">`) dengan solusi lengkap.
3. **Quiz 6–8 soal** (`quiz-N`) di akhir bab, sebelum tombol "Tandai Bab Selesai".
4. **2 playground** (`pg-N-1`, `pg-N-2`) di lesson paling penting — konversi code block statis yang paling "pengen dicoba" jadi playground. Kandidat per bab: Bab 1 (JSX + komponen pertama), Bab 2 (props + list rendering), Bab 3 (useState + useEffect), Bab 4 (useRef + useReducer), Bab 5 (form controlled + router mental model — router tidak jalan di playground, pakai state-based tab), Bab 6 (typing props — playground JSX tanpa TS checking, beri catatan), Bab 7 (konsep saja, playground opsional — Next.js tidak bisa jalan di playground; ganti dengan 1 challenge logika), Bab 8 (Context + reducer global), Bab 9 (tidak ada test runner di playground — challenge berbasis DOM assertion), Bab 10 (React.memo + render counter).
5. **1 challenge** (`ch-N-1`) yang menguji skill inti bab.
6. **Script tags**: pastikan `playground.js` + `quiz.js` ter-include.
7. **Konten senior**: tiap bab tambah 1 lesson baru "Level Senior:" yang mengangkat topik bab ke konteks production (contoh — Bab 3: "Level Senior: useEffect yang bener — race condition, cleanup, AbortController"; Bab 8: "Level Senior: kapan Zustand, kapan Context, kapan server state"; Bab 9: "Level Senior: testing strategy — apa yang TIDAK perlu dites").

**Target per bab setelah deepening:** ≥ 5.000 kata, ≥ 1 lesson baru, quiz + exercises + playgrounds terpasang.

**Verifikasi per bab:** buka di browser — playground jalan, quiz jalan, tidak ada error console, progress checkbox tetap berfungsi. Word count ≥ 5.000.

**Commit per bab:** `deepen: Bab N — kesalahan umum, latihan, quiz, playground, lesson senior`

**Urutan pengerjaan:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10. Bab-bab ini independen; boleh diparalelkan dengan subagent per bab bila memakai worktree isolation (file berbeda, aman — tapi commit tetap berurutan).

## Task 20: Hapus file test

Delete `test-playground.html` dan `generate_ch5.py` (sisa build lama). Commit: `chore: remove temp files`.

---

# Phase 4 — Landing Page

## Task 21: Rebuild `index.html`

**Files:** Modify `index.html`

Keep: navbar structure, Swiss-minimalist look, tailwind config, fonts. Replace content sections:

1. **Hero:** headline baru — "Dari Nol Sampai Senior React Developer" + subhead nilai (15 bab, ~120 lessons, 3 capstone projects, playground interaktif, interview prep). CTA "Mulai dari Bab 0" + secondary "Lihat Jalur Belajar".
2. **Learning path section (visual utama):** 4 level (🟢 Fondasi → 🔵 Menengah → 🟣 Mahir → 🔴 Senior) sebagai timeline/stepper vertikal, tiap level menampilkan chapter cards-nya. Card: nomor, judul, deskripsi 1 kalimat, jumlah lessons, estimasi jam.
3. **Progress dashboard:** kalau localStorage punya progress → tampilkan "Lanjutkan belajar" card (bab terakhir yang dibuka + progress bar per level + skor quiz). Rendered oleh course.js — index pakai `<div id="dashboardMount">` dan fungsi baru `renderDashboard()` di course.js (tambahkan di task ini).
4. **"Kenapa course ini beda" section:** 6 cards — Live playground di browser; Quiz + challenge dengan skor; React Internals (materi yang jarang dibahas); 3 capstone projects; Interview prep lengkap; Bahasa manusia, bukan textbook.
5. **FAQ:** update — "Gue gaptek total, bisa ikut?" (→ Bab 0), "Berapa lama sampai job-ready?", "Kenapa Rp 5 juta?" (bandingkan dengan bootcamp Rp 15–30jt), dll.
6. **Stats bar:** angka final dihitung dari file nyata (jumlah bab, total lessons = hitung `lesson-checkbox`, total playground, total soal quiz) — jangan mengarang angka.

**Also modify `assets/course.js`:** add `renderDashboard()` — reads progress, renders per-level progress bars + continue button; called on DOMContentLoaded if `#dashboardMount` exists. Note: index.html is at repo root so chapter links are `chapters/<file>` — `renderSidebar`/`renderDashboard` must prefix paths correctly (add `data-base="chapters/"` on body of index).

**Verify:** buka index, cek dashboard muncul setelah menyelesaikan beberapa lesson di bab lain; semua link bab valid; lighthouse-style sanity (tidak ada 404 di console).

**Commit:** `feat: landing page baru — jalur Awam→Senior, dashboard progress, framing premium`

## Task 22: Final QA sweep

1. `grep -L 'course.js' chapters/*.html` → kosong (semua bab pakai shared assets).
2. Klik-through semua 15 bab dari sidebar; cek prev/next di tiap bab menunjuk bab yang benar (0→1→…→14).
3. Semua playground auto-run tanpa error; semua quiz selesai sampai layar hasil; semua challenge bisa lulus dengan solusi yang disediakan (test solusinya!).
4. Word count semua bab ≥ 4.000 (bab baru) / ≥ 5.000 (bab lama yang diperdalam); catat angka final untuk stats landing page.
5. Cek responsive mobile (sidebar toggle) di 1 bab lama + 1 bab baru.
6. Commit: `chore: final QA fixes` (jika ada perbaikan).

---

## Security: Subresource Integrity (SRI) untuk semua CDN

Semua `<script>`/`<link>` CDN di halaman course (Tailwind, highlight.js, fonts) dan script yang dimuat dinamis oleh `playground.js` WAJIB:

1. **Pin versi exact** — jangan pakai URL floating seperti `react@18`; pakai `react@18.3.1` (SRI tidak mungkin untuk URL yang isinya bisa berubah). Pinned: `react@18.3.1`, `react-dom@18.3.1`, `@babel/standalone@7.26.4`, CodeMirror `5.65.16`, highlight.js `11.9.0`.
2. **Tambahkan `integrity="sha384-…" crossorigin="anonymous"`** — generate hash saat implementasi:
   ```bash
   curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A
   ```
   Untuk script dinamis di `playground.js`: set `s.integrity = '…'; s.crossOrigin = 'anonymous';` sebelum append. Simpan hash sebagai konstanta di samping URL di `PG_CDN`.
3. **Pengecualian:** `https://cdn.tailwindcss.com` (Play CDN) sengaja floating dan tidak mendukung SRI — ini kelemahan yang sudah ada di codebase; biarkan untuk sekarang, dicatat sebagai known issue di Task 22.
4. Script di dalam iframe srcdoc playground (React UMD, Babel) juga diberi `integrity` + `crossorigin` di template `pgSrcdoc()`.

## Execution notes

- **Phase order is strict:** 1 → 2 → 3 → 4. Dalam Phase 2 dan 3, task antar-bab independen (file berbeda) — bisa diparalelkan dengan subagent + worktree.
- **Content is the product.** Untuk task konten (5–19), outline lesson di atas adalah kontrak minimum — penulis boleh menambah, tidak boleh mengurangi. Tone "lo/gue" wajib; baca 2–3 lesson dari chapter-1.html dulu untuk meniru gaya.
- **JSX di dalam `text/plain` script tidak perlu HTML-escape**, tapi TIDAK boleh mengandung string `</script` (tulis `<\/script>` bila perlu — praktisnya hindari saja).
- **Jangan mengarang statistik** di landing page — hitung dari file.
