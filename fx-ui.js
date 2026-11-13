// Four Nines — page animations (no libraries).
// Headline reveal, words that flip up into place, drawn underlines, counters and 3-D step numbers.
// Everything is skipped for visitors who turn off motion, and all text stays readable if this file fails.
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('fx');

  // Split a heading's words into spans so they can flip up one at a time (keeps <em> and <br>)
  function split(el, start = 0, step = 0.07) {
    let i = 0;
    (function walk(node) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = p;
            s.style.setProperty('--d', (start + i++ * step).toFixed(2) + 's');
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR' && n.tagName !== 'SVG') walk(n);
      });
    })(el);
    el.classList.add('split');
  }

  // Watch elements and add .in when they scroll into view
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' })
    : null;
  const watch = el => io ? io.observe(el) : el.classList.add('in');

  // ---- Hero: words flip up, then a rust underline draws under "done right" ----
  const h1 = document.getElementById('tagline');
  if (h1) { split(h1, 0.35, 0.09); h1.classList.add('in'); }

  // ---- Section headings ----
  document.querySelectorAll('main h2, section h2').forEach(h => {
    if (h.closest('.hero') || h.closest('#chat') || h.closest('.cb')) return;
    split(h, 0.05, 0.06); watch(h);
  });
  document.querySelectorAll('section .eyebrow').forEach(e => { if (!e.closest('.hero')) watch(e); });

  // ---- At-a-glance numbers flip in, "How it works" steps draw in ----
  ['.stats', '.steps', '.about .chip', '.checks'].forEach(sel => document.querySelectorAll(sel).forEach(watch));

  // ---- 99.99% counts up ----
  const chipNum = document.querySelector('.about .chip b');
  if (chipNum && /99\.99/.test(chipNum.textContent)) {
    const run = () => {
      const t0 = performance.now(), dur = 1600;
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
        chipNum.textContent = (99.99 * e).toFixed(2) + '%';
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); o.disconnect(); } }, { threshold: 0.6 });
      o.observe(chipNum);
    }
  }

  // ---- Scroll progress bar in the header (rust line that fills as you read) ----
  const bar = document.createElement('div'); bar.className = 'scrollbar'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
  addEventListener('scroll', upd, { passive: true }); upd();
})();
