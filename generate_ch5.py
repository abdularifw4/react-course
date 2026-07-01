#!/usr/bin/env python3
"""Generate chapter-5.html through chapter-8.html"""
import os

BASE = os.path.expanduser('~/react-course/chapters')

def sidebar(active_num):
    chapters = [
        (1, "Pengenalan React"), (2, "JSX & Elemen React"), (3, "Komponen & Props"),
        (4, "State & Lifecycle"), (5, "Advanced React Patterns"), (6, "React & TypeScript"),
        (7, "Next.js Fundamentals"), (8, "State Management"), (9, "React Router"),
        (10, "Project Akhir")
    ]
    links = []
    for num, title in chapters:
        is_active = num == active_num
        cls = 'nav-link active' if is_active else 'nav-link'
        badge_cls = 'w-7 h-7 bg-accent/20 rounded-lg flex items-center justify-center text-xs font-bold text-accent' if is_active else 'w-7 h-7 bg-dark-700 rounded-lg flex items-center justify-center text-xs font-bold'
        href = f'chapter-{num}.html' if num >= 5 else '#'
        links.append(f'            <a href="{href}" class="{cls} flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[40px] text-gray-400{" text-gray-400" if not is_active else ""}"><span class="{badge_cls}">{num}</span>{title}</a>')
    return '\n'.join(links)

def head(title):
    return f'''<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - React Course</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js"></script>
    <script>
        tailwind.config = {{
            theme: {{
                extend: {{
                    colors: {{
                        dark: {{ 900: '#0a0f2c', 800: '#111827', 700: '#1a2240', 600: '#243056' }},
                        accent: {{ DEFAULT: '#27d890', light: '#34e8a0', dark: '#1fb870' }}
                    }}
                }}
            }}
        }}
    </script>
    <style>
        * {{ scrollbar-width: thin; scrollbar-color: #27d890 #111827; -webkit-font-smoothing: antialiased; }}
        ::-webkit-scrollbar {{ width: 6px; }}
        ::-webkit-scrollbar-track {{ background: #111827; }}
        ::-webkit-scrollbar-thumb {{ background: #27d890; border-radius: 3px; }}
        .lesson-card {{ transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1); }}
        .lesson-card:hover {{ transform: translateY(-2px); box-shadow: 0 8px 30px rgba(39,216,144,0.12); }}
        .nav-link {{ transition: background-color 0.2s cubic-bezier(0.2,0,0.1), color 0.2s cubic-bezier(0.2,0,0.1); }}
        .nav-link:hover, .nav-link.active {{ background: rgba(39,216,144,0.1); color: #27d890; }}
        pre code {{ border-radius: 0.75rem; font-size: 0.875rem; }}
        h2 {{ text-wrap: balance; }}
        .fade-in {{ animation: fadeIn 0.4s cubic-bezier(0.2,0,0.1) both; }}
        .fade-in-delay-1 {{ animation-delay: 100ms; }}
        .fade-in-delay-2 {{ animation-delay: 200ms; }}
        .fade-in-delay-3 {{ animation-delay: 300ms; }}
        .fade-in-delay-4 {{ animation-delay: 400ms; }}
        .fade-in-delay-5 {{ animation-delay: 500ms; }}
        .fade-in-delay-6 {{ animation-delay: 600ms; }}
        .fade-in-delay-7 {{ animation-delay: 700ms; }}
        .fade-in-delay-8 {{ animation-delay: 800ms; }}
        @keyframes fadeIn {{ from {{ opacity: 0; transform: translateY(12px); }} to {{ opacity: 1; transform: translateY(0); }} }}
        .tip-box {{ border-left: 3px solid #27d890; background: rgba(39,216,144,0.08); }}
        .warning-box {{ border-left: 3px solid #f59e0b; background: rgba(245,158,11,0.08); }}
        .code-block {{ box-shadow: 0 4px 20px rgba(0,0,0,0.3); border: 1px solid #243056; }}
        .lesson-checkbox:checked + .lesson-label {{ text-decoration: line-through; color: #6b7280; }}
        button:active {{ transform: scale(0.96); }}
    </style>
</head>
'''

def sidebar_html(active_num):
    sb = sidebar(active_num)
    return f'''<body class="bg-dark-900 text-gray-200 min-h-screen font-sans">

    <div id="sidebarOverlay" class="fixed inset-0 bg-black/60 z-40 hidden lg:hidden" onclick="toggleSidebar()"></div>

    <aside id="sidebar" class="fixed top-0 left-0 h-full w-72 bg-dark-800 border-r border-dark-600 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 cubic-bezier(0.4,0,0.2,1) overflow-y-auto">
        <div class="p-5 border-b border-dark-600">
            <a href="../index.html" class="flex items-center gap-3 min-h-[40px]">
                <div class="w-9 h-9 bg-accent/20 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <span class="text-lg font-bold text-white">React Course</span>
            </a>
        </div>
        <div class="p-4">
            <div class="relative">
                <input type="text" placeholder="Cari bab..." class="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-2.5 pl-10 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors duration-200 min-h-[40px]">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
        </div>
        <div class="px-4 pb-4">
            <div class="bg-dark-700 rounded-xl p-3">
                <div class="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Progress</span>
                    <span id="progressText">0/10</span>
                </div>
                <div class="w-full bg-dark-900 rounded-full h-2">
                    <div id="progressBar" class="bg-accent h-2 rounded-full transition-all duration-500 cubic-bezier(0.4,0,0.2,1)" style="width: 0%"></div>
                </div>
            </div>
        </div>
        <nav class="px-3 pb-6">
            <p class="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Daftar Bab</p>
{sb}
        </nav>
    </aside>
'''

def footer(chapter_num, next_chapter, summary_items):
    summary_li = '\n'.join(f'                    <li class="flex items-start gap-3"><span class="text-accent mt-1">✓</span><span>{item}</span></li>' for item in summary_items)
    return f'''
            <!-- Chapter Summary -->
            <section class="lesson-card bg-gradient-to-br from-accent/10 to-dark-800 rounded-2xl p-6 lg:p-8 mb-6 fade-in" id="summary">
                <div class="flex items-start gap-4 mb-6">
                    <div class="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div>
                        <h2 class="text-xl font-bold text-white">Ringkasan Bab {chapter_num}</h2>
                        <p class="text-sm text-gray-400 mt-1">Yang sudah kamu pelajari</p>
                    </div>
                </div>
                <ul class="space-y-3 text-gray-300">
{summary_li}
                </ul>
                <div class="mt-8 flex flex-col sm:flex-row gap-3">
                    <button onclick="markChapterComplete({chapter_num})" id="completeBtn{chapter_num}" class="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-dark-900 font-semibold px-6 py-3 rounded-xl transition-colors duration-200 min-h-[44px]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        Tandai Bab Selesai
                    </button>
                    <a href="chapter-{next_chapter}.html" class="flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium px-6 py-3 rounded-xl transition-colors duration-200 min-h-[44px]">
                        Lanjut ke Bab {next_chapter}
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </a>
                </div>
            </section>

        </div>
    </main>

    <button id="backToTop" onclick="window.scrollTo({{top:0,behavior:'smooth'}})" class="fixed bottom-6 right-6 w-12 h-12 bg-accent text-dark-900 rounded-full shadow-lg flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300 hover:bg-accent-dark z-30">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>
    </button>

    <script>
        function toggleSidebar() {{
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            sidebar.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        }}
        window.addEventListener('scroll', () => {{
            const btn = document.getElementById('backToTop');
            if (window.scrollY > 300) {{ btn.classList.remove('opacity-0','pointer-events-none'); btn.classList.add('opacity-100'); }}
            else {{ btn.classList.add('opacity-0','pointer-events-none'); btn.classList.remove('opacity-100'); }}
        }});
        hljs.highlightAll();
        function copyCode(btn) {{
            const code = btn.closest('.code-block').querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {{
                const original = btn.textContent;
                btn.textContent = 'Tersalin!';
                setTimeout(() => btn.textContent = original, 2000);
            }});
        }}
        function getProgress() {{ const saved = localStorage.getItem('react-course-progress'); return saved ? JSON.parse(saved) : {{}}; }}
        function saveProgress(data) {{ localStorage.setItem('react-course-progress', JSON.stringify(data)); }}
        function updateProgress() {{
            const progress = getProgress();
            const totalChecks = document.querySelectorAll('.lesson-checkbox').length;
            const checked = document.querySelectorAll('.lesson-checkbox:checked').length;
            progress['chapter-{chapter_num}'] = {{ completed: checked, total: totalChecks }};
            saveProgress(progress);
            renderGlobalProgress();
        }}
        function renderGlobalProgress() {{
            const progress = getProgress();
            let totalCompleted = 0, totalLessons = 0;
            for (let i = 1; i <= 10; i++) {{ const ch = progress[`chapter-${{i}}`]; if (ch) {{ totalCompleted += ch.completed; totalLessons += ch.total; }} }}
            const pct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
            const bar = document.getElementById('progressBar');
            const text = document.getElementById('progressText');
            if (bar) bar.style.width = pct + '%';
            if (text) text.textContent = `${{totalCompleted}}/${{totalLessons}}`;
        }}
        function markChapterComplete(ch) {{
            const progress = getProgress();
            const checks = document.querySelectorAll('.lesson-checkbox');
            checks.forEach(c => c.checked = true);
            progress[`chapter-${{ch}}`] = {{ completed: checks.length, total: checks.length }};
            saveProgress(progress);
            renderGlobalProgress();
            const btn = document.getElementById(`completeBtn${{ch}}`);
            if (btn) {{ btn.textContent = '✓ Bab Selesai!'; btn.classList.add('opacity-75'); btn.disabled = true; }}
        }}
        renderGlobalProgress();
    </script>
</body>
</html>'''

def lesson(num, title, subtitle, delay, paragraphs, code_title, code, box_type, box_text):
    delay_cls = f'fade-in-delay-{delay}' if delay > 0 else 'fade-in'
    paras = '\n'.join(f'                    <p>{p}</p>' for p in paragraphs)
    box_cls = 'tip-box' if box_type == 'tip' else 'warning-box'
    box_strong = '<strong class="text-accent">💡 Analogi:</strong>' if box_type == 'tip' else '<strong class="text-yellow-400">⚠️ Perhatian:</strong>'
    return f'''
            <!-- Lesson {num}: {title} -->
            <section class="lesson-card bg-dark-800 rounded-2xl p-6 lg:p-8 mb-6 {delay_cls}" id="lesson-{num}">
                <div class="flex items-start gap-4 mb-6">
                    <div class="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="text-accent font-bold text-sm">{num:02d}</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-1">
                            <h2 class="text-xl font-bold text-white">{title}</h2>
                            <input type="checkbox" id="check-5-{num}" class="lesson-checkbox hidden" onchange="updateProgress()">
                            <label for="check-5-{num}" class="lesson-label text-xs text-gray-500 cursor-pointer px-2 py-1 rounded-lg hover:bg-dark-700 transition-colors duration-200">Selesai</label>
                        </div>
                        <p class="text-sm text-gray-500">{subtitle}</p>
                    </div>
                </div>
                <div class="space-y-4 text-gray-300 leading-relaxed">
{paras}
                </div>
                <div class="mt-6 space-y-4">
                    <div class="code-block rounded-xl overflow-hidden">
                        <div class="bg-dark-700 px-4 py-2 flex items-center justify-between border-b border-dark-600">
                            <span class="text-xs text-gray-400 font-medium">{code_title}</span>
                            <button onclick="copyCode(this)" class="text-xs text-gray-500 hover:text-accent transition-colors duration-200 px-2 py-1 rounded-lg hover:bg-dark-600 min-h-[32px] min-w-[32px]">Salin</button>
                        </div>
                        <pre><code class="language-javascript">{code}</code></pre>
                    </div>
                </div>
                <div class="{box_cls} rounded-xl p-4 mt-6">
                    <p class="text-sm text-gray-300">{box_strong} {box_text}</p>
                </div>
            </section>'''

# ============================================================
# CHAPTER 5: Advanced React Patterns
# ============================================================
ch5_lessons = [
    lesson(1, 'HOC (Higher-Order Components)', 'Pattern Lanjutan · 7 menit baca', 0,
        [
            '<strong class="text-white">Higher-Order Component (HOC)</strong> adalah pattern di mana sebuah fungsi menerima komponen sebagai argumen dan mengembalikan komponen baru yang telah "ditingkatkan" dengan fungsionalitas tambahan. HOC bukan komponen — ia adalah pola arsitektural yang memungkinkan kamu memisahkan logika reusable dari komponen presentasi.',
            'HOC sangat berguna untuk <strong class="text-accent">cross-cutting concerns</strong> seperti autentikasi, logging, pelacakan analytics, atau pemuatan data. Alih-alih menulis logika yang sama berulang-ulang, kamu membungkusnya sekali dalam HOC dan mengaplikasikannya ke komponen mana pun.',
            'Perlu diingat bahwa HOC memiliki beberapa kelemahan: mereka bisa menyebabkan <em>wrapping hell</em>, membuat debugging sulit, dan bisa bentrok dengan props. Di era Hooks modern, banyak kasus HOC sudah bisa digantikan dengan Custom Hooks.'
        ],
        'HOC — withAuth &amp; withLogger',
'''// HOC: withAuth — melindungi komponen
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const isLoggedIn = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" />;
    return <WrappedComponent {...props} />;
  };
}

// HOC: withLogger — menambahkan logging lifecycle
function withLogger(WrappedComponent, name) {
  return function LoggedComponent(props) {
    useEffect(() => {
      console.log(`[${name}] mounted`);
      return () => console.log(`[${name}] unmounted`);
    }, []);
    return <WrappedComponent {...props} />;
  };
}

// Penggunaan:
const ProtectedDashboard = withAuth(Dashboard);
const LoggedProfile = withLogger(Profile, 'Profile');''',
        'tip', 'Bayangkan HOC seperti jas hujan. Kamu punya baju biasa (komponen asli), lalu HOC membungkus baju itu sehingga kamu mendapat fungsionalitas tambahan. Baju di dalam tetap sama, tapi kemampuannya meningkat.'),

    lesson(2, 'Render Props', 'Pattern Lanjutan · 6 menit baca', 1,
        [
            '<strong class="text-white">Render Props</strong> adalah pattern di mana sebuah komponen menerima fungsi (biasanya sebagai children prop) yang mengembalikan elemen React. Komponen induk bertanggung jawab atas state dan logika, sementara konsumen mengontrol bagaimana hasilnya dirender.',
            'Pattern ini memecahkan masalah yang sama dengan HOC tetapi dengan cara yang lebih deklaratif dan mudah dibaca. Alih-alih membungkus komponen dalam banyak lapisan, kamu cukup menempatkan fungsi render di dalam body komponen.',
            'Di era modern, sebagian besar render props sudah bisa digantikan dengan Custom Hooks. Namun pattern ini tetap berguna ketika kamu perlu memberikan kontrol rendering penuh kepada pengguna komponen.'
        ],
        'Render Props — MouseTracker',
'''function MouseTracker({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return children({ x: position.x, y: position.y });
}

// Penggunaan — kontrol penuh rendering
function App() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <div>
          <h1>Posisi mouse: ({x}, {y})</h1>
          <div style={{
            position: 'absolute', left: x, top: y,
            width: 20, height: 20,
            background: '#27d890', borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }} />
        </div>
      )}
    </MouseTracker>
  );
}''',
        'tip', 'Render Props itu seperti memesan makanan di restoran. Koki (komponen induk) menyiapkan bahan (state/logika), lalu meletakkannya di meja. Kamu (children fungsi) yang menentukan mau diapakan bahan itu — mau digoreng, direbus, atau dibuat salad.'),

    lesson(3, 'Compound Components', 'Pattern Lanjutan · 7 menit baca', 2,
        [
            '<strong class="text-white">Compound Components</strong> adalah pattern di mana beberapa komponen bekerja sama untuk membentuk satu unit UI yang koheren. Komponen-komponen ini berbagi state secara implisit melalui React Context.',
            'Contoh nyata dari pattern ini adalah elemen HTML <code class="bg-dark-700 px-2 py-0.5 rounded text-accent text-xs">&lt;select&gt;</code> dan <code class="bg-dark-700 px-2 py-0.5 rounded text-accent text-xs">&lt;option&gt;</code>. Kamu tidak perlu menghubungkan keduanya secara manual — mereka sudah saling memahami.',
            'Keuntungan utamanya adalah <strong class="text-accent">API yang deklaratif dan fleksibel</strong>. Library populer seperti Radix UI dan Headless UI banyak menggunakan pattern ini.'
        ],
        'Compound Components — Accordion',
'''const AccordionContext = createContext();

function Accordion({ children, defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const toggleItem = (index) => {
    setActiveIndex(prev => prev === index ? -1 : index);
  };
  return (
    <AccordionContext.Provider value={{ activeIndex, toggleItem }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ index, children }) {
  const { activeIndex, toggleItem } = useContext(AccordionContext);
  const isOpen = activeIndex === index;
  return (
    <div className="accordion-item">
      {typeof children === 'function'
        ? children({ isOpen, toggle: () => toggleItem(index) })
        : children}
    </div>
  );
}

// Penggunaan deklaratif:
function FAQ() {
  return (
    <Accordion>
      <AccordionItem index={0}>
        {({ isOpen, toggle }) => (
          <>
            <button onClick={toggle}>Apa itu React? {isOpen ? '▲' : '▼'}</button>
            {isOpen && <p>React adalah library JavaScript untuk UI.</p>}
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
}''',
        'tip', 'Compound Components itu seperti orkestra. Setiap pemain (sub-komponen) punya peran sendiri, tapi mereka berbagi skor musik (Context) yang sama. Tanpa konduktor eksplisit, mereka bisa bermain harmoni bersama.'),

    lesson(4, 'Provider Pattern', 'Pattern Lanjutan · 6 menit baca', 3,
        [
            '<strong class="text-white">Provider Pattern</strong> menggunakan React Context untuk menyebarkan data ke seluruh komponen tree tanpa harus mengoper props secara manual di setiap level (<em>prop drilling</em>). Pattern ini sangat berguna untuk data global.',
            'Pattern ini terdiri dari dua bagian: <strong class="text-accent">Provider</strong> yang membungkus aplikasi dan menyediakan data, serta <strong class="text-accent">Custom Hook</strong> yang memungkinkan komponen mana pun mengakses data tersebut.',
            'Penting untuk memisahkan Provider ke file tersendiri dan mengekspor Custom Hook yang menyertainya. Ini membuat API lebih bersih dan memastikan Provider digunakan dengan benar.'
        ],
        'Provider Pattern — ThemeProvider',
'''const ThemeContext = createContext(undefined);

function ThemeProvider({ children, defaultTheme = 'dark' }) {
  const [theme, setTheme] = useState(defaultTheme);
  const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error('useTheme harus di dalam ThemeProvider');
  return context;
}

// Gunakan di mana saja
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <nav style={{ background: theme === 'dark' ? '#111' : '#fff' }}>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}

// Wrap aplikasi
function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Navbar /><MainContent />
    </ThemeProvider>
  );
}''',
        'warning', 'Jangan gunakan Context untuk data yang berubah sangat sering (seperti posisi mouse). Setiap perubahan Context akan me-rerender semua konsumen. Untuk data yang sering berubah, gunakan state lokal atau library state management.'),

    lesson(5, 'Container vs Presentational', 'Arsitektur · 5 menit baca', 4,
        [
            'Pattern <strong class="text-white">Container vs Presentational</strong> memisahkan komponen menjadi dua jenis: <strong class="text-accent">Container</strong> yang bertanggung jawab atas logika (fetching data, state management), dan <strong class="text-accent">Presentational</strong> yang fokus pada tampilan.',
            'Container tidak memiliki styling sendiri dan berkomunikasi dengan Presentational melalui props. Presentational tidak memiliki state sendiri dan berfungsi murni sebagai "template" yang menerima data dan merender UI.',
            'Meskipun pattern ini kurang populer di era Hooks (karena Custom Hooks bisa memisahkan logika tanpa memerlukan komponen terpisah), konsep pemisahan concern antara logika dan tampilan tetap relevan.'
        ],
        'Container vs Presentational — UserList',
'''// Presentational Component — fokus pada tampilan
function UserList({ users, isLoading, error }) {
  if (isLoading) return <p>Memuat...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}

// Container Component — fokus pada logika
function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return <UserList users={users} isLoading={loading} error={error} />;
}

// Penggunaan di App:
function App() {
  return (
    <div>
      <h1>Daftar User</h1>
      <UserListContainer />
    </div>
  );
}''',
        'tip', 'Bayangkan Container sebagai chef di dapur yang menyiapkan bahan, dan Presentational sebagai pelayan yang menyajikan makanan di meja tamu. Chef tidak bertemu tamu, pelayan tidak memasak — masing-masing punya tugas jelas.'),

    lesson(6, 'Props Getters & Control Props', 'Pattern Lanjutan · 7 menit baca', 5,
        [
            '<strong class="text-white">Props Getters</strong> adalah pattern di mana komponen menyediakan fungsi yang mengembalikan prop objek yang sudah dikonfigurasi, sehingga pengguna bisa menyebarkan props tersebut ke elemen DOM. Ini mengurangi boilerplate dan memastikan konsistensi.',
            '<strong class="text-accent">Control Props</strong> melangkah lebih jauh — komponen bisa dikontrol sepenuhnya dari luar (controlled) atau mengelola state sendiri (uncontrolled), atau bahkan campuran keduanya. Pattern ini memberikan fleksibilitas maksimal.',
            'Kedua pattern ini banyak digunakan di library headless UI seperti Downshift, React Table, dan Radix UI. Mereka memungkinkan kamu membangun komponen yang bisa digunakan dengan berbagai gaya tanpa mengunci pengguna ke implementasi tertentu.'
        ],
        'Props Getters — Toggle',
'''// Props Getter Pattern
function Toggle({ defaultOn = false, onToggle }) {
  const [isOn, setIsOn] = useState(defaultOn);

  const toggle = () => {
    const next = !isOn;
    setIsOn(next);
    onToggle?.(next);
  };

  // getTogglerProps mengembalikan semua props yang dibutuhkan
  const getTogglerProps = (props = {}) => ({
    'aria-pressed': isOn,
    onClick: (e) => {
      props.onClick?.(e);
      toggle();
    },
    ...props,
  });

  return { isOn, toggle, getTogglerProps };
}

// Penggunaan:
function App() {
  const { isOn, getTogglerProps } = Toggle({ defaultOn: false });

  return (
    <button
      {...getTogglerProps({
        style: { background: isOn ? '#27d890' : '#6b7280' },
      })}
    >
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}''',
        'tip', 'Props Getters itu seperti kunci pintu otomatis di hotel. Kamu cukup menggesek kartu (memanggil getter), dan pintu terbuka dengan konfigurasi yang tepat — tanpa perlu tahu mekanisme internalnya.'),
]

ch5_summary = [
    'HOC membungkus komponen untuk menambahkan fungsionalitas reusable, meski di era Hooks penggunaannya berkurang',
    'Render Props memberikan state/logika melalui fungsi children untuk kontrol rendering penuh',
    'Compound Components membuat sub-komponen yang berbagi state via Context untuk API deklaratif',
    'Provider Pattern menyebarkan data global tanpa prop drilling menggunakan React Context',
    'Container vs Presentational memisahkan logika dan tampilan ke komponen terpisah',
    'Props Getters & Control Props memberikan fleksibilitas maksimal pada pengguna komponen',
]

ch5_content = '\n'.join(ch5_lessons)
ch5 = head('Bab 5: Advanced React Patterns') + sidebar_html(5) + f'''
    <main class="lg:ml-72 min-h-screen">
        <header class="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-dark-600">
            <div class="flex items-center justify-between px-4 lg:px-8 py-4">
                <div class="flex items-center gap-4">
                    <button onclick="toggleSidebar()" class="lg:hidden p-2 rounded-xl hover:bg-dark-700 transition-colors duration-200 min-w-[40px] min-h-[40px] flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>
                    <div>
                        <h1 class="text-xl lg:text-2xl font-bold text-white">Bab 5: Advanced React Patterns</h1>
                        <p class="text-sm text-gray-400 mt-0.5">6 pelajaran &middot; ~38 menit</p>
                    </div>
                </div>
                <a href="chapter-6.html" class="hidden sm:flex items-center gap-2 bg-accent hover:bg-accent-dark text-dark-900 font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 min-h-[40px]">
                    Bab Selanjutnya
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>
        </header>

        <div class="px-4 lg:px-8 py-8 max-w-4xl">
''' + ch5_content + footer(5, 6, ch5_summary)

# ============================================================
# CHAPTER 6: React & TypeScript
# ============================================================
ch6_lessons = [
    lesson(1, 'Setup React + TypeScript', 'Persiapan · 5 menit baca', 0,
        [
            '<strong class="text-white">TypeScript</strong> adalah superset JavaScript yang menambahkan static typing. Saat digunakan bersama React, TypeScript membantu mendeteksi error lebih awal, memberikan autocompletion yang lebih baik di IDE, dan membuat kode lebih mudah dipahami.',
            'Cara paling mudah untuk memulai proyek React + TypeScript adalah dengan <strong class="text-accent">Vite</strong>. Vite mendukung template TypeScript secara native, sehingga kamu tidak perlu konfigurasi tambahan. Cukup tambahkan flag <code class="bg-dark-700 px-2 py-0.5 rounded text-accent text-xs">--template react-ts</code> saat membuat proyek.',
            'File komponen React + TypeScript menggunakan ekstensi <code class="bg-dark-700 px-2 py-0.5 rounded text-accent text-xs">.tsx</code> (TypeScript + JSX), sedangkan file utility biasa menggunakan <code class="bg-dark-700 px-2 py-0.5 rounded text-accent text-xs">.ts</code>. Vite secara otomatis mengkonfigurasi <code class="bg-dark-700 px-2 py-0.5 rounded text-accent text-xs">tsconfig.json</code> untuk mendukung JSX.'
        ],
        'Terminal — Setup React + TypeScript',
'''# Buat proyek React + TypeScript
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev

# tsconfig.json akan terbuat otomatis dengan:
# - "jsx": "react-jsx" (untuk JSX transform baru)
# - "strict": true (mode ketat aktif)
# - Path aliases bisa ditambahkan manual''',
        'tip', 'TypeScript itu seperti spell checker untuk kode kamu. Seperti halnya spell checker menangkap typo sebelum kamu mengirim email, TypeScript menangkap error type sebelum kamu deploy aplikasi.'),

    lesson(2, 'Typing Props & State', 'Fundamental · 8 menit baca', 1,
        [
            'Cara paling umum untuk mendefinisikan tipe props komponen React adalah menggunakan <strong class="text-white">interface</strong> atau <strong class="text-white">type alias</strong>. Keduanya berfungsi serupa di TypeScript, tapi <code class="bg-dark-700 px-2 py-0.5 rounded text-accent text-xs">interface</code> lebih direkomendasikan untuk props karena bisa di-extend (diperluas) dan lebih familiar bagi developer React.',
            'Untuk state, gunakan <strong class="text-accent">generic type parameter</strong> pada useState. TypeScript akan secara otomatis menyimpul