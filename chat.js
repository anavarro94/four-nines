// ============================================================
//  FOUR NINES — free website chat assistant (no AI, no cost)
//  Answers common questions and walks customers through a quote
//  request. Everything it says comes from config.js.
// ============================================================
(function () {
  const C = window.FN_CONFIG;
  if (!C) return;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fmtPhone = p => { const d = String(p).replace(/\D/g,''); return d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}` : p; };
  const tel = 'tel:' + C.phone, sms = 'sms:' + C.phone, ph = fmtPhone(C.phone);
  const HAS_PHONE = String(C.phone || '').replace(/\D/g, '').length >= 10, mail = 'mailto:' + C.email;
  const reach = HAS_PHONE ? `<a href="${sms}">text us at ${esc(ph)}</a> or <a href="${tel}">call</a>` : `email us at <a href="${mail}">${esc(C.email)}</a>`;

  // ---------- styles ----------
  const css = `
  .fnc-btn{position:fixed;right:18px;bottom:22px;z-index:40;width:62px;height:62px;border-radius:50%;border:0;cursor:pointer;
    background:#A36F2B;color:#fff;box-shadow:0 10px 28px #14323f66;display:grid;place-items:center;transition:transform .15s}
  .fnc-btn:hover{transform:scale(1.06)}
  .fnc-btn svg{width:28px;height:28px}.fnc-btn img{width:52px;height:52px;margin-top:4px}.fnc-av svg{width:22px;height:22px}
  .fnc-btn .dot{position:absolute;top:4px;right:4px;width:14px;height:14px;border-radius:50%;background:#2e9d5b;border:2px solid #fff}
  .fnc-hint{position:fixed;right:90px;bottom:34px;z-index:40;background:#fff;color:#1F4A5C;font:600 .9rem/1.3 Inter,system-ui,sans-serif;
    padding:10px 14px;border-radius:14px 14px 4px 14px;box-shadow:0 8px 24px #14323f33;max-width:220px;cursor:pointer}
  @media(max-width:799px){.fnc-btn{bottom:92px;right:14px;width:56px;height:56px}.fnc-hint{bottom:100px;right:80px}}
  .fnc{position:fixed;right:18px;bottom:22px;z-index:50;width:380px;height:min(640px,calc(100vh - 44px));background:#F6F1E7;border-radius:20px;
    box-shadow:0 30px 80px #0b1d2577;display:flex;flex-direction:column;overflow:hidden;font-family:Inter,system-ui,sans-serif;
    transform:translateY(16px) scale(.98);opacity:0;pointer-events:none;transition:.2s}
  .fnc.open{transform:none;opacity:1;pointer-events:auto}
  @media(max-width:600px){.fnc{inset:0;width:auto;height:auto;border-radius:0}}
  .fnc-hd{background:#14323F;color:#E6D8BC;padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:4px solid #A36F2B}
  .fnc-av{width:42px;height:42px;border-radius:10px;background:#E6D8BC;color:#1F4A5C;display:grid;place-items:center;
    font:700 1rem "Playfair Display",Georgia,serif;flex:none}
  .fnc-hd b{display:block;color:#fff;font-size:1rem}
  .fnc-hd small{font-size:.78rem;opacity:.8;display:flex;align-items:center;gap:6px}
  .fnc-hd small::before{content:"";width:8px;height:8px;border-radius:50%;background:#2e9d5b}
  .fnc-x{margin-left:auto;background:#ffffff14;border:0;color:#fff;width:36px;height:36px;border-radius:10px;font-size:1.3rem;cursor:pointer}
  .fnc-log{flex:1;overflow-y:auto;padding:18px 14px;display:flex;flex-direction:column;gap:10px}
  .fnc-m{max-width:85%;padding:11px 14px;border-radius:16px;font-size:.95rem;line-height:1.45;animation:fncIn .2s ease}
  .fnc-m.bot{background:#fff;color:#1B2A31;border-bottom-left-radius:4px;box-shadow:0 1px 2px #14323f14}
  .fnc-m.me{align-self:flex-end;background:#1F4A5C;color:#fff;border-bottom-right-radius:4px}
  .fnc-m a{color:#A36F2B;font-weight:700}
  .fnc-m.me a{color:#E6D8BC}
  .fnc-typing{display:inline-flex;gap:4px}.fnc-typing i{width:7px;height:7px;border-radius:50%;background:#9aa7ac;animation:fncDot 1s infinite}
  .fnc-typing i:nth-child(2){animation-delay:.15s}.fnc-typing i:nth-child(3){animation-delay:.3s}
  @keyframes fncDot{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-3px)}}
  @keyframes fncIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .fnc-opts{display:flex;flex-wrap:wrap;gap:8px;padding:2px 0 4px}
  .fnc-opts button{border:1.5px solid #A36F2B;background:#fff;color:#7d5420;border-radius:20px;padding:9px 14px;
    font:600 .88rem Inter,system-ui,sans-serif;cursor:pointer}
  .fnc-opts button:hover{background:#A36F2B;color:#fff}
  .fnc-in{display:flex;gap:8px;padding:12px;background:#fff;border-top:1px solid #E3D7BF}
  .fnc-in input{flex:1;min-width:0;border:1.5px solid #E3D7BF;border-radius:12px;padding:12px 14px;font:inherit;font-size:16px;color:#1B2A31}
  .fnc-in input:focus{outline:2px solid #1F4A5C;border-color:transparent}
  .fnc-in button{border:0;border-radius:12px;background:#1F4A5C;color:#fff;width:48px;cursor:pointer;display:grid;place-items:center}
  .fnc-in button svg{width:20px;height:20px}
  .fnc-in[hidden]{display:none}
  .fnc-file{display:none}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------- markup ----------
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const send = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>';
  document.body.insertAdjacentHTML('beforeend', `
    <button class="fnc-btn" aria-label="Chat with Four Nines">${icon}<span class="dot"></span></button>
    <div class="fnc-hint" hidden>Need a quote? Chat with us 👋</div>
    <div class="fnc" role="dialog" aria-label="Four Nines chat">
      <div class="fnc-hd"><div class="fnc-av">${icon}</div><div><b>Four Nines Assistant</b><small>Usually replies instantly</small></div>
        <button class="fnc-x" aria-label="Close chat">×</button></div>
      <div class="fnc-log" aria-live="polite"></div>
      <form class="fnc-in" hidden><input autocomplete="off" aria-label="Type your answer"><button aria-label="Send">${send}</button></form>
      <input class="fnc-file" type="file" accept="image/*" multiple>
    </div>`);
  const $ = s => document.querySelector(s);
  const box = $('.fnc'), log = $('.fnc-log'), form = $('.fnc-in'), input = form.querySelector('input'), file = $('.fnc-file'), hint = $('.fnc-hint');

  // ---------- helpers ----------
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const scroll = () => log.scrollTop = log.scrollHeight;
  async function bot(html, delay = 550) {
    const t = document.createElement('div'); t.className = 'fnc-m bot';
    t.innerHTML = '<span class="fnc-typing"><i></i><i></i><i></i></span>'; log.appendChild(t); scroll();
    await wait(delay); t.innerHTML = html; scroll();
  }
  function me(text) { const m = document.createElement('div'); m.className = 'fnc-m me'; m.textContent = text; log.appendChild(m); scroll(); }
  function opts(list) { // list of [label, fn]
    return new Promise(res => {
      const w = document.createElement('div'); w.className = 'fnc-opts';
      list.forEach(([label, val]) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
        b.onclick = () => { w.remove(); me(label); res(val ?? label); }; w.appendChild(b); });
      log.appendChild(w); scroll();
    });
  }
  function ask(placeholder, type = 'text', check) {
    return new Promise(res => {
      form.hidden = false; input.type = type; input.placeholder = placeholder; input.value = ''; setTimeout(() => input.focus(), 50);
      form.onsubmit = async e => { e.preventDefault(); const v = input.value.trim(); if (!v) return;
        if (check && !check(v)) { me(v); input.value = ''; await bot(check.msg); return; }
        form.hidden = true; me(v); res(v); };
    });
  }

  // ---------- conversation ----------
  const menu = [['📷 Quick photo quote','photo'],['Get a free quote','quote'],['Prices','prices'],['Service area','area'],['When can you come?','hours'],['How do I pay?','pay'],['Talk to a person','person']];
  async function mainMenu(first) {
    if (!first) await bot('Anything else I can help with?', 400);
    const pick = await opts(menu);
    ({ photo, quote, prices, area, hours, pay, person })[pick]();
  }
  async function photo() {
    const fast = document.getElementById('fast');
    if (!fast) return quote();
    await bot("Easiest way — snap a photo and we'll send you a price. Taking you there now 👇", 500);
    await wait(700); box.classList.remove('open'); fast.scrollIntoView({ behavior: 'smooth' });
  }
  async function prices() {
    await bot('Here are our starting prices:<br><br>' + C.services.map(s => `<b>${esc(s.name)}</b> — ${esc(s.price)}`).join('<br>') +
      '<br><br>Every job gets a written quote before work starts, so you always know the price up front.', 800);
    const n = await opts([['Get a free quote','q'],['Back to menu','m']]); n === 'q' ? quote() : mainMenu();
  }
  async function area() {
    await bot(`We're based in Elgin and serve <b>${esc(C.serviceArea)}</b>. Just outside that? Ask anyway — we can usually make it work.`);
    mainMenu();
  }
  async function hours() {
    await bot(`We work <b>${esc(C.hours.toLowerCase())}</b>. Tell us your best days and times when you request a quote, and we'll find a slot that works for you.`);
    mainMenu();
  }
  async function pay() { await bot(esc(C.paymentNote) + ' No deposit needed for most small jobs.'); mainMenu(); }
  async function person() {
    await bot(`Sure! The quickest way is to ${reach}. If we're on a job, we'll get right back to you.`);
    mainMenu();
  }

  async function quote() {
    const q = {};
    await bot("Great — I'll get your info to us so we can send a free quote. First, what do you need help with?");
    q.service = await opts([...C.services.map(s => [s.name]), ['Something else']]);
    await bot('Got it. Describe the job in a sentence or two — the more detail, the better the quote.', 450);
    q.details = await ask('e.g. Hole in hallway drywall, about fist-size');
    await bot('Want to add photos? They help us quote without a visit.', 450);
    const ph1 = await opts([['📷 Add photos','yes'],['Skip','no']]);
    q.files = [];
    if (ph1 === 'yes') {
      q.files = await new Promise(res => {
        const w = document.createElement('div'); w.className = 'fnc-opts';
        const pickBtn = document.createElement('button'); pickBtn.type = 'button'; pickBtn.textContent = '📷 Choose photos';
        const skipBtn = document.createElement('button'); skipBtn.type = 'button'; skipBtn.textContent = 'Continue without photos';
        w.append(pickBtn, skipBtn); log.appendChild(w); scroll();
        pickBtn.onclick = () => { file.value = ''; file.click(); };
        skipBtn.onclick = () => { w.remove(); me('No photos'); res([]); };
        file.onchange = () => { if (!file.files.length) return; w.remove(); res([...file.files].slice(0, 5)); };
        file.click();
      });
      if (q.files.length) await bot(`Thanks — ${q.files.length} photo${q.files.length > 1 ? 's' : ''} attached. 👍`, 350);
    }
    await bot("What's the job address?", 400);
    q.address = await ask('Street address and town');
    await bot('When works best for you?', 400);
    q.preferredTime = await opts([['Weekday evenings'],['Saturday'],['Sunday'],["I'm flexible"]]);
    await bot("Almost done. What's your name?", 400);
    q.name = await ask('Your name');
    const phoneCheck = v => v.replace(/\D/g,'').length >= 10; phoneCheck.msg = 'Hmm, that number looks short — could you enter your full 10-digit phone number?';
    await bot(`Thanks, ${esc(q.name.split(' ')[0])}! And the best phone number to reach you?`, 400);
    q.phone = await ask('Phone number', 'tel', phoneCheck);

    await bot(`Here's what I have:<br><br><b>${esc(q.service)}</b><br>${esc(q.details)}<br>📍 ${esc(q.address)}<br>🗓 ${esc(q.preferredTime)}<br>👤 ${esc(q.name)} · ${esc(q.phone)}` +
      (q.files.length ? `<br>📷 ${q.files.length} photo(s)` : '') + '<br><br>Send it?', 600);
    const ok = await opts([['✅ Send request','send'],['Start over','redo']]);
    if (ok === 'redo') return quote();
    submit(q);
  }

  async function shrink(f, max = 1280) {
    const url = URL.createObjectURL(f);
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const s = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    return c.toDataURL('image/jpeg', 0.8).split(',')[1];
  }

  async function submit(q) {
    const req = { name: q.name, phone: q.phone, email: '', address: q.address, service: q.service,
      details: q.details + ' (via website chat)', preferredTime: q.preferredTime };
    if (!C.scriptUrl) { // Sheet not connected yet → hand off as a text message
      await bot(`Tap below to send it to us by ${HAS_PHONE ? 'text' : 'email'} — it's already filled in for you.`);
      const body = `Quote request — ${req.name}, ${req.phone}\n${req.address}\n${req.service}: ${q.details}\nBest time: ${req.preferredTime}` +
        (q.files.length ? '\n(I have photos to send too)' : '');
      log.insertAdjacentHTML('beforeend', `<div class="fnc-opts"><button type="button" onclick="location.href='${HAS_PHONE ? sms + '?&body=' : mail + '?subject=Quote%20request&body='}${encodeURIComponent(body).replace(/'/g,'%27')}'">📩 Send it</button></div>`);
      scroll(); return;
    }
    await bot('Sending…', 300);
    try {
      const photos = []; for (const f of q.files) photos.push(await shrink(f));
      const r = await fetch(C.scriptUrl, { method: 'POST', signal: (AbortSignal.timeout ? AbortSignal.timeout(60000) : undefined), body: JSON.stringify({ action: 'quote', request: { ...req, photos } }) });
      const j = await r.json(); if (!j.ok) throw new Error(j.error);
      await bot(`All set, ${esc(q.name.split(' ')[0])}! ✅ We got your request and will reach out within one business day with your quote.`, 500);
      try { localStorage.setItem('fnc-sent', '1'); } catch (e) {}
      mainMenu();
    } catch (e) {
      await bot(`Sorry — that didn't go through. Please ${reach} and we'll take care of you.`);
    }
  }

  // ---------- open / close ----------
  let started = false;
  function open() {
    box.classList.add('open'); hint.hidden = true;
    if (!started) { started = true;
      (async () => { await bot("Hey there! 👋 Need something fixed? I can get you a price or answer a quick question.", 400); mainMenu(true); })(); }
  }
  $('.fnc-btn').onclick = open; hint.onclick = open;
  $('.fnc-x').onclick = () => box.classList.remove('open');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') box.classList.remove('open'); });
  // Small nudge after a few seconds, once per visit
  let seen = false; try { seen = sessionStorage.getItem('fnc-hint') === '1'; } catch (e) {}
  if (!seen) setTimeout(() => { if (!box.classList.contains('open')) { hint.hidden = false; try { sessionStorage.setItem('fnc-hint', '1'); } catch (e) {} } }, 6000);
  window.FN_CHAT_OPEN = open;
})();
