/* React Course — live playground: CodeMirror + Babel + iframe preview */

/* Semua CDN dipin ke versi exact + SRI hash (sha384, dihitung dari file asli).
   Task 4 (quiz.js) memakai pgLoadDeps() dan pgSrcdoc() — jangan diubah jadi non-global. */
const PG_CDN = {
  cmCss: {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css',
    sri: 'sha384-zaeBlB/vwYsDRSlFajnDd7OydJ0cWk+c2OWybl3eSUf6hW2EbhlCsQPqKr3gkznT',
  },
  cmJs: {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js',
    sri: 'sha384-ZYmwuq4n2gOcNxMSiJ6jyTj+BbIrilr7p6dlq6q5nmSWKmsH9UU4K1qqjycMkfmR',
  },
  cmJsx: {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/jsx/jsx.min.js',
    sri: 'sha384-sLgXazKMlwaztnwzCyUw9IWq+TCVLC3RjhJ+zZbaIMjQUQa1pey4J4+n2/MtxGHM',
  },
  cmXml: {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js',
    sri: 'sha384-xPpkMo5nDgD98fIcuRVYhxkZV6/9Y4L8s3p0J5c4MxgJkyKJ8BJr+xfRkq7kn6Tw',
  },
  cmJsMode: {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js',
    sri: 'sha384-g0o+WW9mdIxA7LaaCKTkRm0M5TVT+Bb4s9eocxPsI2G0Xm0POG9iD6G6qP1IIsfS',
  },
  react: {
    url: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
    sri: 'sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z',
  },
  reactDom: {
    url: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
    sri: 'sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1',
  },
  babel: {
    url: 'https://unpkg.com/@babel/standalone@7.26.4/babel.min.js',
    sri: 'sha384-x/ilTFv/u/eu6YSmkFDZl5V5Mm/pkxxcVv2cVJOrr1J0rvILhMvRBCy6yA75wYBj',
  },
};

let pgLoaded = null;
function pgLoadDeps() {
  if (pgLoaded) return pgLoaded;
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = PG_CDN.cmCss.url;
  css.integrity = PG_CDN.cmCss.sri;
  css.crossOrigin = 'anonymous';
  document.head.appendChild(css);
  const load = dep => new Promise((ok, err) => {
    const s = document.createElement('script');
    s.src = dep.url;
    s.integrity = dep.sri;
    s.crossOrigin = 'anonymous';
    s.onload = ok; s.onerror = err;
    document.head.appendChild(s);
  });
  pgLoaded = load(PG_CDN.cmJs)
    .then(() => Promise.all([load(PG_CDN.cmXml), load(PG_CDN.cmJsMode)]))
    .then(() => load(PG_CDN.cmJsx));
  return pgLoaded;
}

function pgSrcdoc(code) {
  return `<!DOCTYPE html><html><head>
<script src="${PG_CDN.react.url}" integrity="${PG_CDN.react.sri}" crossorigin="anonymous"><\/script>
<script src="${PG_CDN.reactDom.url}" integrity="${PG_CDN.reactDom.sri}" crossorigin="anonymous"><\/script>
<script src="${PG_CDN.babel.url}" integrity="${PG_CDN.babel.sri}" crossorigin="anonymous"><\/script>
<style>body{font-family:system-ui,sans-serif;margin:12px;color:#111}
button{font:inherit;padding:4px 12px;border-radius:6px;border:1px solid #ccc;background:#f5f5f5;cursor:pointer}
input,select,textarea{font:inherit;padding:4px 8px;border:1px solid #ccc;border-radius:6px}
.pg-error{color:#dc2626;font-family:ui-monospace,monospace;font-size:13px;white-space:pre-wrap}</style>
</head><body><div id="root"></div>
<script>
window.onerror = function(msg){ document.getElementById('root').innerHTML = '<div class="pg-error">❌ ' + String(msg).replace(/</g,'&lt;') + '</div>'; };
try {
  var compiled = Babel.transform(${JSON.stringify(code).replace(/<\//g, '<\\/')}, { presets: [['react', {runtime:'classic'}]] }).code;
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
      if (!codeEl) console.warn('playground: missing code element', mount.dataset.codeId);
      const initial = codeEl ? codeEl.textContent.trim() : '';
      mount.innerHTML = `
        <div class="playground bg-white">
          <div class="bg-[#F5F4F1] px-4 py-2 flex items-center justify-between border-b border-black/[0.06]">
            <span class="text-xs text-muted font-medium">⚡ Live Playground. Edit kodenya, klik Jalankan</span>
            <div class="flex gap-2">
              <button class="pg-reset text-xs text-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-black/5">Reset</button>
              <button class="pg-run text-xs font-semibold bg-ink text-white px-3 py-1 rounded-lg press">▶ Jalankan</button>
            </div>
          </div>
          <div class="pg-editor"></div>
          <div class="border-t border-black/[0.06] bg-[#FAFAFA] px-4 py-1.5"><span class="text-[10px] uppercase tracking-wider font-semibold text-muted">Preview</span></div>
          <iframe title="Preview hasil kode" sandbox="allow-scripts"></iframe>
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
  }).catch(() => {
    // CDN/SRI gagal — degradasi: tampilkan kode read-only, jangan biarkan kosong
    mounts.forEach(mount => {
      const codeEl = document.getElementById(mount.dataset.codeId);
      mount.innerHTML = '<div class="playground bg-white p-4"><p class="text-xs text-muted">⚠ Playground gagal dimuat. Cek koneksi, lalu reload halaman.</p><pre class="text-xs mt-2 whitespace-pre-wrap"></pre></div>';
      if (codeEl) mount.querySelector('pre').textContent = codeEl.textContent.trim();
    });
  });
}
document.addEventListener('DOMContentLoaded', initPlaygrounds);
