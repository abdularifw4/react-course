#!/bin/bash
# Build script for chapter-3.html
cat > /data/data/com.termux/files/home/react-course/chapters/chapter-3.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="id" class="scroll-smooth antialiased">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bab 3: React Hooks Dasar — React Course</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js"></script>
    <script>tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
                    },
                    colors: {
                        ink: { DEFAULT: '#0B0B0B', soft: '#1A1A1A' },
                        muted: { DEFAULT: '#666666', light: '#999999' },
                        lavender: '#F3F0FA',
                        cream: '#FAF8F1',
                        surface: '#FAFAFA',
                    },
                }
            }
        }</script>
    <style>
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        body { font-family: 'Inter', system-ui, sans-serif; }
        :root {
            --shadow-sm: 0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.04);
            --shadow-md: 0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.05), 0 4px 12px -2px rgba(0,0,0,0.05);
            --shadow-md-hover: 0 0 0 1px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.06), 0 8px 20px -4px rgba(0,0,0,0.07);
        }
        h1, h2, h3 { text-wrap: balance; }
        p { text-wrap: pretty; }
        .shadow-card { box-shadow: var(--shadow-md); transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .shadow-card:hover { box-shadow: var(--shadow-md-hover); transform: translateY(-2px); }
        .shadow-soft { box-shadow: var(--shadow-sm); }
        .press { transition: transform 0.15s ease; }
        .press:active { transform: scale(0.96); }
        .lesson-card { box-shadow: var(--shadow-sm); transition: box-shadow 0.2s ease; }
        .lesson-card:hover { box-shadow: var(--shadow-md); }
        .nav-link { transition: background 0.15s ease, color 0.15s ease; }
        .nav-link:hover, .nav-link.active { background: #F3F0FA; color: #0B0B0B; }
        .nav-link.active span:first-child { background: #0B0B0B !important; color: white !important; }
        pre code { border-radius: 0; font-size: 0.825rem; line-height: 1.6; }
        .code-block { box-shadow: var(--shadow-sm); border-radius: 0.75rem; overflow: hidden; }
        .tip-box { border-left: 3px solid #0B0B0B; background: #F3F0FA; }
        .warning-box { border-left: 3px solid #f59e0b; background: #FFF7ED; }
        .fade-in { opacity: 0; transform: translateY(16px); animation: enter 0.4s cubic-bezier(0.2,0,0,1) forwards; }
        .fade-in-d1 { animation-delay: 80ms; }
        .fade-in-d2 { animation-delay: 160ms; }
        @keyframes enter { to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 5px; border: 2px solid #fff; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
        .lesson-checkbox:checked + .lesson-label { text-decoration: line-through; color: #999; }
        button:active { transform: scale(0.96); }
        @media print { .no-print { display: none !important; } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
</style>
</head>
<body class="bg-white text-ink min-h-screen">

    <div id="sidebarOverlay" class="fixed inset-0 bg-black/20 z-40 hidden lg:hidden" onclick="toggleSidebar()"></div>
    <aside id="sidebar" class="fixed top-0 left-0 h-full w-72 bg-white border-r border-black/[0.06] z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-200 overflow-y-auto no-print">
        <div class="p-5 border-b border-black/[0.06]">
            <a href="../index.html" class="flex items-center gap-2.5">
                <div class="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <span class="text-[15px] font-semibold tracking-tight">react course</span>
            </a>
        </div>
        <div class="p-3">
            <div class="relative">
                <input type="text" placeholder="Cari bab..." class="w-full bg-surface border border-black/[0.06] rounded-lg px-3.5 py-2.5 pl-9 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:border-black/20 transition-colors">
                <svg class="absolute left-3 top-3 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
        </div>
        <div class="px-3 pb-3">
            <div class="bg-surface rounded-lg p-3">
                <div class="flex justify-between text-xs text-muted mb-2">
                    <span>Progress</span>
                    <span id="progressText" class="tabular-nums">0/10</span>
                </div>
                <div class="w-full bg-black/5 rounded-full h-1.5">
                    <div id="progressBar" class="bg-ink h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
            </div>
        </div>
        <nav class="px-2 pb-6 space-y-0.5">
            <p class="px-3 mb-1.5 text-[10px] font-semibold text-muted uppercase tracking-wider">Daftar Bab</p>
            <a href="chapter-1.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">1</span>
                Intro
            </a>
            <a href="chapter-2.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">2</span>
                React Dasar
            </a>
            <a href="chapter-3.html" class="nav-link active flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink">
                <span class="w-6 h-6 bg-ink text-white rounded flex items-center justify-center text-xs font-bold tabular-nums">3</span>
                Hooks Dasar
            </a>
            <a href="chapter-4.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">4</span>
                Hooks Advanced
            </a>
            <a href="chapter-5.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">5</span>
                Patterns
            </a>
            <a href="chapter-6.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">6</span>
                TypeScript
            </a>
            <a href="chapter-7.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">7</span>
                Next.js
            </a>
            <a href="chapter-8.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">8</span>
                State Mgmt
            </a>
            <a href="chapter-9.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">9</span>
                Testing
            </a>
            <a href="chapter-10.html" class="nav-link  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted">
                <span class="w-6 h-6 bg-black/5 text-muted rounded flex items-center justify-center text-xs font-bold tabular-nums">10</span>
                Performance
            </a>
        </nav>
    </aside>

    <!-- Main -->
    <main class="lg:ml-72 min-h-screen">
        <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] no-print">
            <div class="flex items-center justify-between px-4 lg:px-8 h-16">
                <div class="flex items-center gap-4">
                    <button onclick="toggleSidebar()" class="lg:hidden press p-2 rounded-lg hover:bg-black/5 transition-colors flex items-center justify-center" style="min-width:40px;min-height:40px">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                    </button>
                    <div class="flex items-baseline gap-3">
                        <span class="text-xs font-mono text-muted tabular-nums">Ch.03</span>
                        <h1 class="text-base lg:text-lg font-semibold tracking-tight">React Hooks Dasar</h1>
                    </div>
                </div>
                <a href="chapter-4.html" class="press inline-flex items-center gap-2 bg-ink hover:bg-ink-soft text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Bab 4
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>
        </header>

        <!-- Content -->
        <div class="px-4 lg:px-10 py-8 max-w-4xl">

            <!-- ===== LESSON 1: Kenapa Hooks Penting ===== -->
            <section class="lesson-card bg-[#FAFAFA] rounded-2xl p-6 lg:p-8 mb-6 fade-in" id="lesson-1">
                <div class="flex items-start gap-4 mb-6">
                    <div class="w-10 h-10 bg-lavender rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="text-ink font-bold text-sm">01</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-1">
                            <h2 class="text-xl font-bold text-ink">KENAPA SIH HOOKS ITU PENTING BANGET? 🤔</h2>
                            <input type="checkbox" id="check-3-1" class="lesson-checkbox hidden" onchange="updateProgress()">
                            <label for="check-3-1" class="lesson-label text-xs text-muted cursor-pointer px-2 py-1 rounded-lg hover:bg-[#F5F4F1] transition-colors duration-200">Selesai</label>
                        </div>
                        <p class="text-sm text-muted">Konsep inti &middot; 8 menit baca</p>
                    </div>
                </div>

                <div class="space-y-4 text-[#333] leading-relaxed">
                    <p>Oke, bayangin kamu lagi bikin aplikasi e-commerce. User klik tombol "Tambah ke Keranjang" — tapi <strong class="text-ink">angkanya nggak berubah</strong>. Di layar tetap nol. User klik lagi, tetap nol. User frustasi, kamu juga frustasi. 😔</p>

                    <p>Nah itu masalahnya kalau komponen kamu nggak punya <em class="text-ink">state</em>. Komponen fungsional dulu itu kayak kertas — sekali ditulis, selesai. Nggak bisa ngubah apa-apa setelah itu. Setiap kali user berinteraksi, komponen di-render ulang dari nol, tanpa ingatan sedikitpun. Kayak film <em>50 First Dates</em> — bangun tidur, lupa semuanya. 😅</p>

                    <p>Sebelum React 16.8 (dirilis 2019), kalau mau punya state, kamu <strong class="text-ink">harus</strong> pakai class component. Nulis <code class="bg-[#F5F4F1] px-2 py-0.5 rounded text-ink text-xs">constructor()</code>, <code class="bg-[#F5F4F1] px-2 py-0.5 rounded text-ink text-xs">this.setState()</code>, <code class="bg-[#F5F4F1] px-2 py-0.5 rounded text-ink text-xs">componentDidMount()</code> — belajar hal-hal yang sebenernya nggak perlu buat yang baru mulai. 🤯</p>

                    <div class="code-block rounded-xl overflow-hidden mt-4 mb-4">
                        <div class="bg-[#F5F4F1] px-4 py-2 flex items-center justify-between border-b border-black/[0.06]">
                            <span class="text-xs text-muted font-medium">Hooks vs Class Component — merasa bedanya?</span>
                            <button onclick="copyCode(this)" class="text-xs text-muted hover:text-ink transition-colors px-2 py-1 rounded-lg hover:bg-black/5">Salin</button>
                        </div>
                        <pre><code class="language-javascript">// ❌ Dulu — Class Component (banyak boilerplate!)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ count: this.state.count + 1 });
  }
  render() {
    return &lt;button onClick={this.handleClick}&gt;Count: {this.state.count}&lt;/button&gt;;
  }
}

// ✅ Sekarang — Hooks (bersih, simpel!)
function Counter() {
  const [count, setCount] = useState(0);
  return &lt;button onClick={() =&gt; setCount(count + 1)}&gt;Count: {count}&lt;/button&gt;;
}</code></pre>
                    </div>

                    <p>Masuklah <strong class="text-ink">React Hooks</strong>. Hooks itu cara React bilang ke komponen fungsional: <em>"Hei, kamu sekarang bisa punya memori sendiri, lho!"</em> 🧠 Dengan hooks, komponen fungsional yang tadinya cuma bisa render statis sekarang bisa punya state, lifecycle, dan semua kemampuan class component.</p>

                    <p>Analoginya gini: Hooks itu kayak <strong class="text-ink">upgrade gratis buat motor kamu</strong>. Dari yang awalnya cuma bisa jalan lurus (komponen tanpa state), jadi bisa belok, ngerem, ngebut, dan punya GPS (punya state, lifecycle, ref, dll). Tanpa perlu ganti motor — tetap pakai fungsi biasa yang ringan dan enak dibaca. ✨</p>

                    <p>Di bab ini, kita bakal bahas 6 hooks dasar yang bakal kamu pakai di hampir setiap proyek: <strong class="text-ink">useState</strong> (memori), <strong class="text-ink">useEffect</strong> (side effect), <strong class="text-ink">useRef</strong> (laci rahasia), <strong class="text-ink">useMemo</strong> (cache), <strong class="text-ink">useCallback</strong> (cache fungsi), dan <strong class="text-ink">useContext</strong> (global state). Siap? Gaspol! 🚀</p>
                </div>

                <div class="tip-box rounded-xl p-4 mt-6">
                    <p class="text-sm text-[#333]"><strong class="text-ink">💡 Kenapa namanya "Hooks"?</strong> Karena hooks secara literal "mengaitkan" (hook into) fitur React ke komponen fungsional. useState mengaitkan fitur state, useEffect mengaitkan fitur lifecycle. Kalau ada function yang diawali <code class="bg-[#F5F4F1] px-2 py-0.5 rounded text-ink text-xs">use</code>, itu artinya dia lagi "mengaitkan" sesuatu ke komponen kamu. 😎</p>
                </div>
            </section>
HTMLEOF
echo "Part 1 written"
