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
  { id: 12, file: 'chapter-12.html', short: 'Arsitektur',     title: 'Arsitektur & Design Patterns', level: 'mahir' },
  { id: 13, file: 'chapter-13.html', short: 'Projects',       title: 'Capstone Projects',     level: 'senior' },
  { id: 14, file: 'chapter-14.html', short: 'Interview',      title: 'Interview Prep & Career',    level: 'senior' },
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
function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.removeItem('react-course-progress'); // clean stale v1 key
  } catch { /* storage unavailable (e.g. Safari private mode) — progress just won't persist */ }
}

/* current chapter id from <body data-chapter="N"> */
function currentChapter() {
  const v = document.body.dataset.chapter;
  return v === undefined ? null : Number(v);
}

/* ---- Sidebar (collapsible chapters + lesson sub-links) ---- */
const SIDEBAR_EXPAND_KEY = 'sidebar-expanded';
function getExpanded() {
  try { return new Set(JSON.parse(localStorage.getItem(SIDEBAR_EXPAND_KEY) || '[]')); }
  catch { return new Set(); }
}
function setExpanded(set) {
  try { localStorage.setItem(SIDEBAR_EXPAND_KEY, JSON.stringify([...set])); } catch { /* storage blocked */ }
}
function sideEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function sideMark(done) {
  return done
    ? '<svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>'
    : '<span class="w-[5px] h-[5px] rounded-full bg-black/20"></span>';
}

function renderSidebar() {
  const mount = document.getElementById('sidebarNav');
  if (!mount) return;
  const cur = currentChapter();
  const LES = window.LESSONS || {};
  const progress = getProgress();
  const expanded = getExpanded();
  if (cur !== null) expanded.add(cur); // current chapter is always open

  let html = '';
  let lastLevel = null;
  for (const ch of CHAPTERS) {
    if (ch.level !== lastLevel) {
      lastLevel = ch.level;
      const lv = LEVELS[ch.level];
      html += `<p class="px-3 mt-4 mb-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full" style="background:${lv.dot}"></span>${lv.label}</p>`;
    }
    const active = ch.id === cur;
    const lessons = LES[String(ch.id)] || [];
    const isOpen = expanded.has(ch.id);
    const doneSet = new Set(((progress['chapter-' + ch.id] || {}).done) || []);

    html += `<div class="side-ch ${isOpen ? 'open' : ''}" data-ch="${ch.id}">
      <div class="side-ch-row flex items-center">
        <a href="${ch.file}" class="nav-link ${active ? 'active' : ''} flex items-center gap-3 flex-1 min-w-0 px-3 py-2 rounded-lg text-sm font-medium ${active ? 'text-ink' : 'text-muted'}">
          <span class="w-6 h-6 shrink-0 ${active ? 'bg-ink text-white' : 'bg-black/5 text-muted'} rounded flex items-center justify-center text-xs font-bold tabular-nums">${ch.id}</span>
          <span class="truncate">${sideEsc(ch.short)}</span>
        </a>`;
    if (lessons.length) {
      html += `<button class="side-toggle shrink-0 p-2 rounded-md text-muted-light hover:text-ink hover:bg-black/5" aria-label="Buka daftar lesson bab ${ch.id}" aria-expanded="${isOpen}" data-ch="${ch.id}">
          <svg class="side-chevron w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>`;
    }
    html += `</div>`;
    if (lessons.length) {
      html += `<ul class="side-lessons ml-[1.35rem] pl-2 border-l border-black/[0.07] mt-0.5 mb-1 space-y-px">`;
      for (const ls of lessons) {
        const href = active ? `#${ls.id}` : `${ch.file}#${ls.id}`;
        const done = ls.c && doneSet.has(ls.c);
        const numHtml = ls.n != null ? `<span class="tabular-nums text-muted-light mr-1">${ls.n}.</span>` : '';
        html += `<li><a href="${href}" class="side-lesson ${active ? 'is-current-ch' : ''} flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-md text-[13px] leading-snug text-muted hover:text-ink hover:bg-black/[0.03]" data-target="${ls.id}">
            <span class="side-mark shrink-0 w-3.5 h-3.5 flex items-center justify-center">${sideMark(done)}</span>
            <span class="truncate">${numHtml}${sideEsc(ls.t)}</span>
          </a></li>`;
      }
      html += `</ul>`;
    }
    html += `</div>`;
  }
  mount.innerHTML = html;
}

/* Toggle expand/collapse (event-delegated) + close mobile drawer on lesson tap */
function initSidebar() {
  const mount = document.getElementById('sidebarNav');
  if (!mount) return;
  mount.addEventListener('click', (e) => {
    const tog = e.target.closest('.side-toggle');
    if (tog) {
      e.preventDefault();
      const id = Number(tog.dataset.ch);
      const box = tog.closest('.side-ch');
      const open = box.classList.toggle('open');
      tog.setAttribute('aria-expanded', String(open));
      const set = getExpanded();
      open ? set.add(id) : set.delete(id);
      setExpanded(set);
      return;
    }
    const les = e.target.closest('.side-lesson');
    if (les && window.matchMedia('(max-width: 1023px)').matches) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && !sidebar.classList.contains('-translate-x-full')) setTimeout(toggleSidebar, 60);
    }
  });
}

/* Keep sidebar lesson marks in sync with progress on the current chapter */
function updateSidebarDone() {
  const cur = currentChapter();
  const mount = document.getElementById('sidebarNav');
  if (cur === null || !mount) return;
  const box = mount.querySelector(`.side-ch[data-ch="${cur}"]`);
  if (!box) return;
  const done = new Set((getProgress()['chapter-' + cur] || {}).done || []);
  const lessons = (window.LESSONS || {})[String(cur)] || [];
  for (const ls of lessons) {
    if (!ls.c) continue;
    const link = box.querySelector(`.side-lesson[data-target="${CSS.escape(ls.id)}"]`);
    const mark = link && link.querySelector('.side-mark');
    if (mark) mark.innerHTML = sideMark(done.has(ls.c));
  }
}

/* Scrollspy: highlight the lesson currently in view (current chapter only) */
function initScrollspy() {
  const cur = currentChapter();
  const mount = document.getElementById('sidebarNav');
  if (cur === null || !mount || !('IntersectionObserver' in window)) return;
  const links = [...mount.querySelectorAll('.side-lesson.is-current-ch')];
  const map = new Map();
  links.forEach(a => { const s = document.getElementById(a.dataset.target); if (s) map.set(s, a); });
  if (!map.size) return;
  const visible = new Set();
  const setActive = (a) => {
    links.forEach(l => l.classList.toggle('active', l === a));
    if (a) a.scrollIntoView({ block: 'nearest' });
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
    let best = null, top = Infinity;
    visible.forEach(s => { const t = s.getBoundingClientRect().top; if (t < top) { top = t; best = s; } });
    setActive(best ? map.get(best) : null);
  }, { rootMargin: '0px 0px -55% 0px', threshold: 0 });
  map.forEach((a, s) => io.observe(s));
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
  updateSidebarDone();
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
  // chapter fully done → reflect it on the "Tandai Bab Selesai" button
  if (saved.total > 0 && saved.done.length === saved.total) {
    const btn = document.getElementById('completeBtn' + cur);
    if (btn) { btn.textContent = '✓ Bab Selesai!'; btn.classList.add('opacity-75'); btn.disabled = true; }
  }
  updateSidebarDone();
}

function renderGlobalProgress() {
  const progress = getProgress();
  let completed = 0, total = 0;
  for (const ch of CHAPTERS) {
    const p = progress['chapter-' + ch.id];
    if (p) { completed += (p.done || []).length; total += p.total || 0; }
  }
  const pct = total > 0 ? Math.round(completed / total * 100) : 0;
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  if (bar) bar.style.width = pct + '%';
  if (text) text.textContent = completed + '/' + total;
}

/* ---- Landing page dashboard (only runs where #dashboardMount exists) ---- */
function renderDashboard() {
  const mount = document.getElementById('dashboardMount');
  if (!mount) return; // no-op on chapter pages
  const base = mount.dataset.base || ''; // e.g. "chapters/" from repo root
  const progress = getProgress();

  // Aggregate overall + per-level completion, track last-touched chapter.
  let doneAll = 0, totalAll = 0, lastId = -1;
  const levelAgg = {}; // level key -> { done, total }
  for (const ch of CHAPTERS) {
    const p = progress['chapter-' + ch.id];
    const d = p && Array.isArray(p.done) ? p.done.length : 0;
    const t = p && p.total ? p.total : 0;
    doneAll += d;
    totalAll += t;
    if (!levelAgg[ch.level]) levelAgg[ch.level] = { done: 0, total: 0 };
    levelAgg[ch.level].done += d;
    levelAgg[ch.level].total += t;
    if (d > 0 && ch.id > lastId) lastId = ch.id;
  }

  // No progress → render nothing (degrades gracefully, no chrome left behind).
  if (doneAll === 0 || lastId < 0) { mount.innerHTML = ''; return; }

  const pct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;
  const last = CHAPTERS.find(c => c.id === lastId) || CHAPTERS[0];

  // If the last-touched chapter is fully done, point "Lanjut" to the next one.
  const lastP = progress['chapter-' + last.id];
  const lastDone = lastP && lastP.total > 0 && (lastP.done || []).length >= lastP.total;
  let target = last;
  if (lastDone) {
    const nxt = CHAPTERS.find(c => c.id === last.id + 1);
    if (nxt) target = nxt;
  }
  const targetLevel = LEVELS[target.level] || { label: '', dot: '#0B0B0B' };

  // Per-level bars in fixed pedagogical order.
  const order = ['fondasi', 'menengah', 'mahir', 'senior'];
  const bars = order.map(key => {
    const lv = LEVELS[key];
    const agg = levelAgg[key] || { done: 0, total: 0 };
    const lp = agg.total > 0 ? Math.round((agg.done / agg.total) * 100) : 0;
    return `
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="flex items-center gap-1.5 text-xs font-medium text-ink">
            <span class="w-1.5 h-1.5 rounded-full" style="background:${lv.dot}"></span>${lv.label}
          </span>
          <span class="text-xs text-muted tabular-nums">${lp}%</span>
        </div>
        <div class="w-full bg-black/[0.06] rounded-full h-1.5">
          <div class="h-1.5 rounded-full transition-all duration-500" style="width:${lp}%;background:${lv.dot}"></div>
        </div>
      </div>`;
  }).join('');

  mount.innerHTML = `
    <div class="mt-10 bg-white rounded-2xl shadow-card p-6 sm:p-8 border border-black/[0.06]">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <div class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Lanjutkan belajar</div>
          <div class="flex items-center gap-3 mb-2">
            <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style="background:${targetLevel.dot}1A;color:${targetLevel.dot}">${targetLevel.label}</span>
            <span class="text-xs font-mono text-muted-light tabular-nums">Bab ${String(target.id).padStart(2, '0')}</span>
          </div>
          <h3 class="text-2xl font-bold tracking-tight text-ink mb-4">${target.title}</h3>
          <div class="flex items-center gap-4">
            <a href="${base}${target.file}" class="press inline-flex items-center gap-2 bg-ink text-white text-sm font-medium pl-5 pr-4 py-2.5 rounded-full hover:bg-ink-soft transition-colors">
              Lanjut
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </a>
            <span class="text-sm text-muted"><strong class="text-ink tabular-nums">${doneAll}</strong> dari <span class="tabular-nums">${totalAll}</span> lesson selesai</span>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-ink">Progress keseluruhan</span>
            <span class="text-sm font-bold text-ink tabular-nums">${pct}%</span>
          </div>
          <div class="w-full bg-black/[0.06] rounded-full h-2 mb-6">
            <div class="bg-ink h-2 rounded-full transition-all duration-500" style="width:${pct}%"></div>
          </div>
          <div class="grid grid-cols-2 gap-x-6 gap-y-4">${bars}</div>
        </div>
      </div>
    </div>`;
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
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.toggle('-translate-x-full');
  if (overlay) overlay.classList.toggle('hidden');
}

/* ---- Back to top button ---- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.remove('opacity-0', 'pointer-events-none');
      btn.classList.add('opacity-100');
    } else {
      btn.classList.add('opacity-0', 'pointer-events-none');
      btn.classList.remove('opacity-100');
    }
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  initSidebar();
  restoreChecks();
  renderGlobalProgress();
  renderDashboard();
  initBackToTop();
  initScrollspy();
  if (window.hljs) hljs.highlightAll();
});
