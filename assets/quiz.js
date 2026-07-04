/* React Course — quiz + coding challenge engine
   Depends on: getProgress/saveProgress (course.js), pgLoadDeps/pgSrcdoc (playground.js).
   Load order di setiap halaman: course.js → playground.js → quiz.js.

   Catatan keamanan: JSON quiz & kode challenge adalah konten kursus yang ditulis
   penulis (trusted, embedded di halaman yang sama) — bukan input user. Teks soal
   dan opsi tetap di-escape; `explain` sengaja dirender sebagai HTML supaya penulis
   bisa pakai tag <code>/<strong> di penjelasan. */

/* ---- Quiz ---- */
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
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function showQuestion() {
    const q = questions[idx];
    mount.innerHTML = `
      <div class="bg-white rounded-2xl p-6 shadow-soft">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-muted uppercase tracking-wider">Quiz, soal ${idx + 1}/${questions.length}</span>
          <span class="text-xs text-muted tabular-nums">Skor: ${score}</span>
        </div>
        <p class="font-semibold text-ink mb-4">${esc(q.q)}</p>
        <div class="space-y-2">${q.options.map((o, i) =>
          `<div class="quiz-option rounded-xl px-4 py-3 text-sm" data-i="${i}">${esc(o)}</div>`).join('')}
        </div>
        <div class="quiz-explain hidden mt-4 tip-box rounded-xl p-4 text-sm"></div>
        <button class="quiz-next hidden mt-4 bg-coral text-white text-sm font-medium px-4 py-2 rounded-lg press">
          ${idx + 1 === questions.length ? 'Lihat Hasil' : 'Lanjut →'}</button>
      </div>`;
    mount.querySelectorAll('.quiz-option').forEach(opt => opt.addEventListener('click', () => {
      if (opt.classList.contains('disabled')) return;
      const i = Number(opt.dataset.i);
      mount.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));
      mount.querySelectorAll('.quiz-option')[q.answer].classList.add('correct');
      if (i === q.answer) score++;
      else opt.classList.add('wrong');
      const ex = mount.querySelector('.quiz-explain');
      /* q.explain: trusted authored HTML (boleh mengandung <code> dsb.) */
      ex.innerHTML = `<strong class="${i === q.answer ? 'text-emerald-600' : 'text-red-600'}">${i === q.answer ? 'Benar.' : 'Belum tepat.'}</strong> ${q.explain}`;
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
    const msg = pct === 100 ? 'Sempurna! Lo udah nguasain bab ini.'
      : pct >= 70 ? 'Solid! Review lagi soal yang salah, terus lanjut.'
      : 'Belum lulus. Baca ulang babnya. Fondasi yang kuat itu segalanya.';
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

/* ---- Coding challenge ---- */
function initChallenges() {
  const mounts = document.querySelectorAll('.challenge-mount');
  if (!mounts.length) return;
  pgLoadDeps().then(() => mounts.forEach(mount => {
    const id = mount.dataset.codeId;
    const starterEl = document.getElementById(id);
    const testEl = document.getElementById(id + '-test');
    if (!starterEl || !testEl) return;
    const starter = starterEl.textContent.trim();
    const testCode = testEl.textContent.trim();
    mount.innerHTML = `
      <div class="playground bg-white">
        <div class="bg-teal-darkest px-4 py-2 flex items-center justify-between">
          <span class="text-xs text-white/80 font-medium">Challenge, lengkapi kodenya sampai semua test lulus</span>
          <div class="flex items-center gap-2">
            <span class="ch-badge text-xs text-white/50">belum dites</span>
            <button class="ch-run text-xs font-semibold bg-white text-ink px-3 py-1 rounded-lg press">▶ Test</button>
          </div>
        </div>
        <div class="pg-editor"></div>
        <iframe title="Hasil test challenge" sandbox="allow-scripts" style="min-height:120px"></iframe>
      </div>`;
    const cm = CodeMirror(mount.querySelector('.pg-editor'), {
      value: starter, mode: 'jsx', lineNumbers: true, viewportMargin: Infinity, tabSize: 2,
    });
    const saved = (getProgress().challenges || {})[id];
    const badge = mount.querySelector('.ch-badge');
    if (saved) { badge.textContent = 'Lulus'; badge.className = 'ch-badge text-xs text-green-400 font-semibold'; }
    mount.querySelector('.ch-run').addEventListener('click', () => {
      const full = cm.getValue() + '\n\n/* ---- tests ---- */\n' + challengeTestRunner(id, testCode);
      mount.querySelector('iframe').srcdoc = pgSrcdoc(full);
    });
  })).catch(() => {
    // CDN/SRI gagal — degradasi sama seperti playground.js: tampilkan starter read-only
    mounts.forEach(mount => {
      const starterEl = document.getElementById(mount.dataset.codeId);
      mount.innerHTML = '<div class="playground bg-white p-4"><p class="text-xs text-muted">Challenge gagal dimuat. Cek koneksi, lalu reload halaman.</p><pre class="text-xs mt-2 whitespace-pre-wrap"></pre></div>';
      if (starterEl) mount.querySelector('pre').textContent = starterEl.textContent.trim();
    });
  });
  /* Iframe di-sandbox allow-scripts (origin opaque) → listener harus origin-agnostic.
     Validasi bentuk data secara defensif: hanya terima {challenge: string, pass, msg}. */
  window.addEventListener('message', e => {
    if (!e.data || typeof e.data !== 'object' || typeof e.data.challenge !== 'string') return;
    const mount = document.querySelector(`.challenge-mount[data-code-id="${CSS.escape(e.data.challenge)}"]`);
    if (!mount) return;
    const badge = mount.querySelector('.ch-badge');
    if (e.data.pass === true) {
      badge.textContent = 'Lulus';
      badge.className = 'ch-badge text-xs text-green-400 font-semibold';
      const progress = getProgress();
      progress.challenges = progress.challenges || {};
      progress.challenges[e.data.challenge] = true;
      saveProgress(progress);
    } else {
      badge.textContent = (typeof e.data.msg === 'string' && e.data.msg ? e.data.msg : 'Gagal');
      badge.className = 'ch-badge text-xs text-red-400 font-semibold';
    }
  });
}

/* Test code berjalan di dalam iframe SETELAH kode user + render React.
   Konvensi: pakai expect(desc, cond) dan query DOM biasa (document.querySelector). */
function challengeTestRunner(id, testCode) {
  return `
setTimeout(function() {
  var results = [];
  function expect(desc, cond) { results.push({desc: desc, pass: !!cond}); }
  try { ${testCode} } catch (e) { results.push({desc: e.message, pass: false}); }
  var failed = results.filter(function(r){ return !r.pass; });
  var el = document.createElement('div');
  el.style.cssText = 'margin-top:12px;padding:8px 12px;border-radius:8px;font-size:13px;font-family:ui-monospace,monospace;background:' + (failed.length ? '#FEF2F2' : '#F0FDF4');
  el.innerHTML = results.map(function(r){ return (r.pass ? '✓ ' : '✗ ') + r.desc; }).join('<br>');
  document.body.appendChild(el);
  parent.postMessage({challenge: ${JSON.stringify(id)}, pass: failed.length === 0, msg: failed.length ? failed.length + ' test gagal' : ''}, '*');
}, 300);`;
}

document.addEventListener('DOMContentLoaded', () => { initQuizzes(); initChallenges(); });
