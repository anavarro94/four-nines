// Four Nines — free, privacy-friendly visitor counts (GoatCounter). No cookies, no banner needed.
// Turns on once `goatcounter` in config.js is set to your GoatCounter code.
(function () {
  const code = (window.FN_CONFIG || {}).goatcounter;
  window.fnTrack = function (name) { try { window.goatcounter && window.goatcounter.count && window.goatcounter.count({ path: name, title: name, event: true }); } catch (e) {} };
  if (!code || /admin|preview/.test(location.pathname)) return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = 'https://' + code + '.goatcounter.com/count';
  document.head.appendChild(s);
  // Count clicks on email / call / text buttons as events
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="mailto:"],a[href^="tel:"],a[href^="sms:"]');
    if (a) window.fnTrack(a.href.split(':')[0] + '-click');
  });
})();
