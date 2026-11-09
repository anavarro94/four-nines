/**
 * FOUR NINES — Google Sheet backend (free)
 * ------------------------------------------------------------
 * What it does:
 *  • Receives quote requests from the website (form, photo quote, chat)
 *  • Saves customer photos to a private Drive folder
 *  • Emails you every request, with the photos attached
 *  • Stores everything in this Google Sheet
 *  • Powers the office app (admin.html): jobs, customers, quotes, invoices, expenses
 *
 * Setup (one time, about 10 minutes — see README):
 *  1. Change SECRET below to your own passcode (used to unlock the office app).
 *  2. Pick "setup" in the function menu → Run → allow permissions.
 *  3. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy.
 *  4. Copy the web app URL and send it to Claude (or paste it into config.js → scriptUrl).
 */

const SECRET = 'CHANGE-ME';                                   // ← your office-app passcode
const NOTIFY_EMAIL = 'a.navarro@fourninesenterprise.com';     // ← where quote requests are emailed
const PHOTO_FOLDER = 'Four Nines Quote Photos';
const TABLES = ['Requests', 'Customers', 'Jobs', 'Docs', 'Expenses'];
const BUSINESS_NAME = 'Four Nines Enterprise, LLC';
const DIGEST_HOUR = 20;                                        // ← daily to-do email time (24h clock, 20 = 8 PM)

// ---------- one-time setup ----------
function setup() {
  const ss = SpreadsheetApp.getActive();
  TABLES.forEach(t => {
    const sh = ss.getSheetByName(t) || ss.insertSheet(t);
    if (sh.getLastRow() === 0) { sh.appendRow(['id', 'created']); sh.setFrozenRows(1); }
  });
  const blank = ss.getSheetByName('Sheet1');
  if (blank && ss.getSheets().length > 1 && blank.getLastRow() === 0) ss.deleteSheet(blank);
  photoFolder_();
  // Touch MailApp so the permission prompt includes email.
  MailApp.getRemainingDailyQuota();
  // Daily to-do email (replaces any earlier one).
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'dailyDigest').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('dailyDigest').timeBased().everyDays(1).atHour(DIGEST_HOUR).create();
  Logger.log('Setup done. Now: Deploy → New deployment → Web app.');
}

// ---------- web entry points ----------
function doGet() { return json_({ ok: true, service: 'Four Nines' }); }

function doPost(e) {
  let p;
  try { p = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'Bad request' }); }
  try {
    if (p.action === 'quote') return json_(quote_(p.request || {}));
    if (SECRET === 'CHANGE-ME') return json_({ ok: false, error: 'Set your passcode (SECRET) in the script first.' });
    if (p.key !== SECRET) return json_({ ok: false, error: 'Wrong passcode' });
    if (p.action === 'list')   return json_({ ok: true, data: listAll_() });
    if (p.action === 'save')   { checkTable_(p.table); upsert_(p.table, p.row || {}); return json_({ ok: true }); }
    if (p.action === 'delete') { checkTable_(p.table); remove_(p.table, p.id); return json_({ ok: true }); }
    if (p.action === 'sendDoc') { sendDoc_(p); return json_({ ok: true }); }
    if (p.action === 'digest')  { dailyDigest(); return json_({ ok: true }); }
    return json_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

// ---------- website quote requests ----------
function quote_(r) {
  const clip = (s, n) => String(s == null ? '' : s).slice(0, n);
  const req = {
    id: Utilities.getUuid().slice(0, 12),
    created: new Date().toISOString(),
    status: 'New',
    name: clip(r.name, 120), phone: clip(r.phone, 40), email: clip(r.email, 160),
    address: clip(r.address, 300), service: clip(r.service, 120),
    details: clip(r.details, 3000), preferredTime: clip(r.preferredTime, 600),
    photos: ''
  };
  if (!req.name || (!req.phone && !req.email)) return { ok: false, error: 'Name and a phone or email are required.' };

  // Save photos (max 5) to a private Drive folder.
  const blobs = [], links = [];
  const photos = Array.isArray(r.photos) ? r.photos.slice(0, 5) : [];
  if (photos.length) {
    const folder = photoFolder_();
    photos.forEach((b64, i) => {
      try {
        const blob = Utilities.newBlob(Utilities.base64Decode(String(b64)), 'image/jpeg',
          `${req.created.slice(0, 10)} ${req.name} ${i + 1}.jpg`);
        const f = folder.createFile(blob);
        links.push(f.getUrl()); blobs.push(blob);
      } catch (err) { /* skip a bad photo, keep the request */ }
    });
  }
  req.photos = links.join(' ');

  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { upsert_('Requests', req); } finally { lock.releaseLock(); }

  // Email you the request.
  if (NOTIFY_EMAIL) {
    const lines = [
      `Name: ${req.name}`,
      req.phone ? `Phone: ${req.phone}` : '',
      req.email ? `Email: ${req.email}` : '',
      `Address/town: ${req.address}`,
      `Service: ${req.service}`,
      `Details: ${req.details}`,
      req.preferredTime ? `Best times: ${req.preferredTime}` : '',
      links.length ? `\nPhotos (${links.length}) are attached and saved in Drive → ${PHOTO_FOLDER}.` : '\nNo photos.',
      '\nOpen your office app to turn this into a job: https://fourninesenterprise.com/admin.html'
    ].filter(Boolean).join('\n');
    const opts = { name: 'Four Nines Website', attachments: blobs };
    if (req.email) opts.replyTo = req.email;
    MailApp.sendEmail(NOTIFY_EMAIL, `New quote request: ${req.service || 'Job'} — ${req.name}`, lines, opts);
  }
  return { ok: true };
}

// ---------- email a quote/invoice as a PDF ----------
function sendDoc_(p) {
  if (!p.to || !/@/.test(p.to)) throw new Error('Customer has no email address');
  const name = String(p.filename || 'Four Nines').replace(/[\\/:*?"<>|]/g, '');
  const pdf = Utilities.newBlob(String(p.html || ''), MimeType.HTML, name + '.html').getAs(MimeType.PDF).setName(name + '.pdf');
  MailApp.sendEmail({ to: p.to, subject: String(p.subject || name), body: String(p.body || ''), attachments: [pdf],
    name: BUSINESS_NAME, replyTo: NOTIFY_EMAIL, bcc: NOTIFY_EMAIL });
}

// ---------- daily to-do email ----------
function dailyDigest() {
  if (!NOTIFY_EMAIL) return;
  const db = listAll_(), tz = Session.getScriptTimeZone();
  const day = n => Utilities.formatDate(new Date(Date.now() + n * 864e5), tz, 'yyyy-MM-dd');
  const today = day(0), tomorrow = day(1), week = day(7);
  const cust = id => (db.Customers.find(c => c.id === id) || {});
  const money = n => '$' + (Math.round((+n || 0) * 100) / 100).toFixed(2);
  const total = d => { let it = d.items; if (typeof it === 'string') { try { it = JSON.parse(it); } catch (e) { it = []; } }
    const sub = (it || []).reduce((a, i) => a + (+i.qty || 0) * (+i.rate || 0), 0); return sub * (1 + (+d.taxRate || 0) / 100); };
  const ageDays = s => s ? Math.floor((Date.now() - new Date(String(s).slice(0, 10) + 'T12:00:00').getTime()) / 864e5) : 0;
  const when = s => { const d = new Date(s); return isNaN(d) ? s : Utilities.formatDate(d, tz, String(s).length > 10 ? 'EEE M/d h:mm a' : 'EEE M/d'); };
  const esc = s => String(s == null ? '' : s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const open = j => ['Done', 'Paid'].indexOf(j.status) < 0;

  const sched = db.Jobs.filter(j => j.scheduled && open(j)).sort((a, b) => String(a.scheduled).localeCompare(String(b.scheduled)));
  const tmr = sched.filter(j => String(j.scheduled).slice(0, 10) === tomorrow);
  const later = sched.filter(j => { const k = String(j.scheduled).slice(0, 10); return k > tomorrow && k <= week; });
  const newReq = db.Requests.filter(r => !r.status || r.status === 'New');
  const todo = [];
  db.Jobs.forEach(j => {
    const docs = db.Docs.filter(d => d.jobId === j.id && d.status !== 'Void'), c = cust(j.customerId).name || 'customer';
    if (j.status === 'Lead' && !docs.some(d => d.type === 'quote')) todo.push(`Send a quote to ${c} (${j.title})`);
    if (j.status === 'Done' && !docs.some(d => d.type === 'invoice')) todo.push(`Invoice ${c} (${j.title})`);
    if (j.scheduled && open(j) && String(j.scheduled).slice(0, 10) < today) todo.push(`Update ${c}'s job — it was scheduled ${when(j.scheduled)}`);
  });
  db.Docs.forEach(d => {
    const c = cust(d.customerId).name || 'customer', a = ageDays(d.date);
    if (d.type === 'quote' && d.status === 'Sent' && a >= 3) todo.push(`Follow up with ${c} on quote ${d.number} (${money(total(d))}, ${a} days)`);
    if (d.type === 'invoice' && d.status === 'Sent' && a >= 7) todo.push(`Collect ${money(total(d))} from ${c} (${d.number}, ${a} days)`);
  });
  const owed = db.Docs.filter(d => d.type === 'invoice' && ['Paid', 'Void', 'Draft'].indexOf(d.status) < 0).reduce((a, d) => a + total(d), 0);

  if (!tmr.length && !later.length && !newReq.length && !todo.length && !owed) return; // nothing to report

  const jobLine = j => { const c = cust(j.customerId); return `<li><b>${esc(when(j.scheduled))}</b> — ${esc(j.title)} for ${esc(c.name || '')}${(j.address || c.address) ? ' · ' + esc(j.address || c.address) : ''}${c.phone ? ' · ' + esc(c.phone) : ''}</li>`; };
  const sec = (title, inner) => `<h3 style="font-family:Arial;color:#1F4A5C;border-bottom:2px solid #A36F2B;padding-bottom:4px;margin:22px 0 8px">${title}</h3>${inner}`;
  const list = a => `<ul style="padding-left:18px;margin:0;line-height:1.6">${a.join('')}</ul>`;
  let html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1B2A31;max-width:600px">`
    + `<div style="background:#14323F;color:#E6D8BC;padding:16px 18px;border-left:6px solid #A36F2B"><b style="font-size:20px;color:#fff">FOUR NINES · TOMORROW</b><br>${tmr.length} job${tmr.length === 1 ? '' : 's'} tomorrow · ${newReq.length} new request${newReq.length === 1 ? '' : 's'}${owed ? ' · ' + money(owed) + ' owed' : ''}</div>`;
  html += sec('Tomorrow', tmr.length ? list(tmr.map(jobLine)) : '<p style="margin:0;color:#5D6B71">Nothing scheduled.</p>');
  if (newReq.length) html += sec('New requests — reply to these', list(newReq.map(r => `<li><b>${esc(r.name)}</b> — ${esc(r.service)} · ${esc(r.address || '')}${r.photos ? ' · 📷' : ''}</li>`)));
  if (todo.length) html += sec('To do', list(todo.map(t => `<li>${esc(t)}</li>`)));
  if (later.length) html += sec('Later this week', list(later.map(jobLine)));
  html += `<p style="margin-top:24px"><a href="https://fourninesenterprise.com/admin.html" style="background:#A36F2B;color:#fff;padding:10px 16px;text-decoration:none;font-weight:bold">Open the office app</a></p></div>`;
  const text = html.replace(/<li>/g, '\n• ').replace(/<h3[^>]*>/g, '\n\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
  MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: `Four Nines — tomorrow: ${tmr.length} job${tmr.length === 1 ? '' : 's'}, ${newReq.length} new request${newReq.length === 1 ? '' : 's'}${todo.length ? ', ' + todo.length + ' to-do' : ''}`,
    body: text, htmlBody: html, name: 'Four Nines Office' });
}

function photoFolder_() {
  const it = DriveApp.getFoldersByName(PHOTO_FOLDER);
  return it.hasNext() ? it.next() : DriveApp.createFolder(PHOTO_FOLDER);
}

// ---------- sheet storage (one column per field) ----------
function checkTable_(t) { if (TABLES.indexOf(t) < 0) throw new Error('Unknown list: ' + t); }

function sheet_(t) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(t) || ss.insertSheet(t);
  if (sh.getLastRow() === 0) { sh.appendRow(['id', 'created']); sh.setFrozenRows(1); }
  return sh;
}

function headers_(sh) { return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String); }

function listAll_() {
  const out = {};
  TABLES.forEach(t => {
    const sh = sheet_(t), last = sh.getLastRow();
    if (last < 2) { out[t] = []; return; }
    const h = headers_(sh);
    out[t] = sh.getRange(2, 1, last - 1, h.length).getDisplayValues().map(row => {
      const o = {};
      h.forEach((k, i) => {
        let v = row[i];
        if (k === 'items' && v) { try { v = JSON.parse(v); } catch (e) {} }
        o[k] = v;
      });
      return o;
    }).filter(o => o.id);
  });
  return out;
}

function upsert_(t, row) {
  if (!row.id) throw new Error('Missing id');
  const sh = sheet_(t);
  let h = headers_(sh);
  // Add any new fields as columns.
  Object.keys(row).forEach(k => { if (h.indexOf(k) < 0) { sh.getRange(1, h.length + 1).setValue(k); h.push(k); } });
  const vals = h.map(k => {
    const v = row[k];
    if (v == null) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
  });
  const ids = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(r => String(r[0])) : [];
  const i = ids.indexOf(String(row.id));
  const target = i >= 0 ? i + 2 : sh.getLastRow() + 1;
  const range = sh.getRange(target, 1, 1, h.length);
  range.setNumberFormat('@');       // keep phone numbers, zips and dates exactly as typed
  range.setValues([vals]);
}

function remove_(t, id) {
  const sh = sheet_(t);
  if (sh.getLastRow() < 2) return;
  const ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(r => String(r[0]));
  const i = ids.indexOf(String(id));
  if (i >= 0) sh.deleteRow(i + 2);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
