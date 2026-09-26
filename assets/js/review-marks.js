/* ===================================================
   REVIEW MARKS — flags content that is still PARTIAL: waiting on the client,
   or on a decision from the site owner. Shown only on a local preview
   (localhost / 127.0.0.1 / file://) or when the URL has ?review; never on
   the live site unless asked for. Add ?review=0 to hide it locally.

   Each mark is { page, sel, has | html, note, who }: the first element
   matching `sel` whose text contains `has` (or whose markup contains `html`) gets an amber outline, a PENDING chip, and
   a line in the "Pending review" panel. Content is re-scanned whenever the
   page re-renders (tabs, map views, customer cards), so marks follow it.
   Remove an entry here once the item is resolved.
   =================================================== */
(function () {
  var q = location.search;
  var local = /^(localhost|127\.0\.0\.1|)$/.test(location.hostname) || location.protocol === 'file:';
  var on = /[?&]review(=1)?(&|$)/.test(q) || (local && !/[?&]review=0/.test(q));
  if (!on) return;

  var page = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  var CLIENT = 'Needs client input', YOU = 'Your decision';

  var MARKS = [
    /* ---- Clients page: Our Customers ---- */
    { page: 'clientele', sel: '.oc-row', has: 'Toshiba T&D', who: CLIENT,
      note: 'Toshiba start year 2024 comes from the dispatch sheet (first dispatch Nov 2024). Milestones & Triveni Group pages mention Toshiba from 2018 — confirm the real start year.' },
    { page: 'clientele', sel: '#ocFeatureInner', has: 'Toshiba T&D', who: YOU,
      note: 'Toshiba location: "Hyderabad" here, "Sangareddy" on the map and supply record (address: Sangareddy district, Hyderabad). Pick one.' },

    /* ---- Clients page: Global Reach ---- */
    { page: 'clientele', sel: '.gr-statcell', has: 'Export orders', who: CLIENT,
      note: 'Export orders (15) excludes Moldova, Oman and USA — the international sites sheet gives no order counts for them.' },
    { page: 'clientele', sel: '.gr-infocard', has: 'Naidupeta', who: CLIENT,
      note: 'Meiden T&D is placed at Naidupeta (sheet: "Nellore District: Tirupati 524126"; PIN 524126 = Naidupeta). Confirm.' },

    /* ---- Clients page: Project Proof ---- */
    { page: 'clientele', sel: '.pp-statcell', has: 'single RDSO order', who: YOU,
      note: 'The 2,200+ RDSO order comes from the ABB Power Products & Systems India letter — that customer was removed from the directory. Keep or drop this stat together with its supply-record group.' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'TBEA Energy', who: YOU,
      note: 'Tanzania rows use two project names ("International Power Transmission Projects" / "International Grid Project"); the certificate names neither. Choose one, or keep as is.' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'Siemens Energy India', who: CLIENT,
      note: 'The Aug 2021 Siemens letter gives no end customer for its 8 jobs (shown "—").' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'CG Power', who: CLIENT,
      note: 'One 2022 row (64 radiators, job BH11290) has no rating, voltage or end customer in the letter.' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'ABB Power Products', who: YOU,
      note: 'Customer removed from the directory per client, but its Jul 2021 letter is still listed here (and feeds the 2,200+ RDSO stat). Keep or remove. The letter also gives no years.' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'ABB India', who: CLIENT,
      note: 'The Apr 2019 ABB India letter gives no years or end customers (shown "—").' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'Shirdi Sai', who: CLIENT,
      note: 'The Jan 2025 Shirdi Sai letter gives no end customers (shown "—").' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'Toshiba Transmission', who: YOU,
      note: 'Toshiba radiators go into GE USA transformers ("Toshiba GEP") — count as exports or keep domestic? The sheet gives sizes, not rating/voltage.' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'AYR Energy India', who: CLIENT,
      note: 'The AYR dispatch sheet gives quantities and months only — no radiator size, rating or voltage.' },
    { page: 'clientele', sel: '.pp-row-grouphead', has: 'Other export supplies', who: CLIENT,
      note: 'Export list / sheet give no rating or voltage for these 13 supplies. SEIL\'s 14 Turkmenistan radiators are left out pending client confirmation.' },
    { page: 'clientele', sel: '.pp-spotlight-card', has: 'Moldova', who: CLIENT,
      note: 'Moldova: awaiting application, transformer rating, voltage class and operating range. Bulgaria: no data received yet — its Spotlight card can\'t be added.' },

    /* ---- Credentials (the Jul 2021 "ABB" letter is ABB Power Products & Systems India's) ---- */
    { page: 'credentials', sel: '.crd-perf-card', html: 'abb-2021.jpg', who: YOU,
      note: 'This "ABB" letter (Jul 2021) is from ABB Power Products & Systems India — a customer removed from the directory. Keep or remove. (milestones.html also lists it in PROOF_LIBRARY, which is data only and not shown.)' },

    /* ---- Careers ---- */
    { page: 'careers', sel: '.cr-nstat', has: 'States Supplied', who: CLIENT,
      note: '"20+ States Supplied" — the customer map shows direct customers in 12 states. Confirm the figure (radiators may reach more states through OEM transformers).' }
  ];
  var mine = MARKS.filter(function (m) { return m.page === page; });
  if (!mine.length) return;

  var css = document.createElement('style');
  css.textContent =
    '.rv-marked{outline:2px dashed #F59E0B !important;outline-offset:3px;position:relative}' +
    '.rv-chip{position:absolute;z-index:30;top:-10px;right:-6px;padding:2px 7px;border-radius:999px;background:#F59E0B;color:#1E1828;' +
      'font:700 9.5px/1.4 Inter,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;pointer-events:auto;cursor:help;white-space:nowrap}' +
    'tr.rv-marked{outline-offset:-2px}' +
    '.rv-panel{position:fixed;z-index:9999;right:14px;bottom:14px;width:min(360px,calc(100vw - 28px));max-height:min(60vh,520px);' +
      'display:flex;flex-direction:column;background:#1E1828;color:#fff;border:2px solid #F59E0B;border-radius:12px;' +
      'box-shadow:0 18px 40px -12px rgba(0,0,0,.55);font:13px/1.45 Inter,system-ui,sans-serif}' +
    '.rv-panel-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.12)}' +
    '.rv-panel-head b{color:#F59E0B;font-size:12px;letter-spacing:.08em;text-transform:uppercase}' +
    '.rv-panel button{background:none;border:1px solid rgba(255,255,255,.3);color:#fff;border-radius:6px;padding:2px 8px;cursor:pointer;font:inherit;font-size:11px}' +
    '.rv-list{list-style:none;margin:0;padding:6px 12px 10px;overflow:auto}' +
    '.rv-list li{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)}' +
    '.rv-list li:last-child{border-bottom:none}' +
    '.rv-who{display:inline-block;margin-bottom:3px;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}' +
    '.rv-who.is-client{background:#F59E0B;color:#1E1828}.rv-who.is-you{background:#8B5CF6;color:#fff}' +
    '.rv-list a{color:#FCD34D;cursor:pointer;text-decoration:underline}' +
    '.rv-panel.is-min .rv-list{display:none}' +
    '.rv-state{font-size:10.5px;color:rgba(255,255,255,.5);margin-left:4px}';
  document.head.appendChild(css);

  var panel = document.createElement('aside');
  panel.className = 'rv-panel';
  panel.setAttribute('aria-label', 'Pending review items');
  panel.innerHTML = '<div class="rv-panel-head"><b>Pending review · ' + mine.length + '</b>' +
    '<span><button type="button" data-rv="min">Hide</button></span></div><ul class="rv-list"></ul>';
  var listEl = panel.querySelector('.rv-list');
  listEl.innerHTML = mine.map(function (m, i) {
    return '<li data-i="' + i + '"><span class="rv-who ' + (m.who === CLIENT ? 'is-client' : 'is-you') + '">' + m.who + '</span>' +
      '<span class="rv-state"></span><br>' + m.note + ' <a data-go="' + i + '">Show</a></li>';
  }).join('');
  panel.addEventListener('click', function (e) {
    if (e.target.dataset.rv === 'min') {
      panel.classList.toggle('is-min');
      e.target.textContent = panel.classList.contains('is-min') ? 'Show' : 'Hide';
    }
    var go = e.target.dataset.go;
    if (go != null) { var t = find(mine[go]); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  });
  document.body.appendChild(panel);

  function textOf(n) { return (n.textContent || '').replace(/\s+/g, ' '); }
  function find(m) {
    if (m.sel === '*') {
      /* smallest element containing the text, lifted to its card */
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {   /* rendered text only — not the page's own script data */
          var tag = n.parentElement && n.parentElement.tagName;
          return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEMPLATE' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      var node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue.indexOf(m.has) >= 0 && !panel.contains(node)) {
          var el = node.parentElement;
          return el.closest('[class*="card"], [class*="doc"], li, article') || el;
        }
      }
      return null;
    }
    var all = document.querySelectorAll(m.sel);
    for (var i = 0; i < all.length; i++) {
      if (panel.contains(all[i])) continue;
      if (m.html ? all[i].innerHTML.indexOf(m.html) >= 0 : textOf(all[i]).indexOf(m.has) >= 0) return all[i];
    }
    return null;
  }
  function apply() {
    mine.forEach(function (m, i) {
      var el = find(m);
      var li = listEl.querySelector('li[data-i="' + i + '"] .rv-state');
      var state = el ? '' : '(not on screen right now — open its tab / view)';
      if (li && li.textContent !== state) li.textContent = state;   /* only on change, or the observer would loop */
      if (!el || el.classList.contains('rv-marked')) return;
      el.classList.add('rv-marked');
      var chip = document.createElement('span');
      chip.className = 'rv-chip';
      chip.textContent = 'Pending';
      chip.title = m.who + ': ' + m.note;
      /* table rows can't hold an absolutely positioned child reliably — put the chip in the first cell */
      var host = el.tagName === 'TR' ? el.firstElementChild : el;
      if (host && getComputedStyle(host).position === 'static') host.style.position = 'relative';
      (host || el).appendChild(chip);
    });
  }
  var t = null;
  new MutationObserver(function () { clearTimeout(t); t = setTimeout(apply, 120); })
    .observe(document.body, { childList: true, subtree: true });
  apply();
  setTimeout(apply, 1500);
})();
