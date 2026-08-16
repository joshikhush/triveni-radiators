const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Mobile nav toggle */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

/* Reveal on scroll */
const io = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Client marquee (only if present) */
const mtrack = document.getElementById('mtrack');
if (mtrack) {
  const clients = ["Siemens", "GE T&D", "Hitachi Energy", "Toshiba T&D", "ABB", "TBEA India", "PGCIL", "RDSO", "AYR Energy"];
  const cli = n => `<div class="cli"><span>${n}</span></div>`;
  mtrack.innerHTML = clients.map(cli).join('') + clients.map(cli).join('');
}

/* Timeline (only if present) */
const tl = document.getElementById('tl');
const tlfill = document.getElementById('tlfill');
if (tl) {
  const ms = [["2012","Founded","MOU with a French multinational. India's first fully automatic radiator line, Naini, Prayagraj.","Origin"],["2013","PGCIL 400kV Approval","PGCIL approval for 400kV class transformers & reactors, via Alstom T&D. First major certification.","Certification"],["2015","PGCIL 765kV Approval","Elevated to 765kV — India's highest rating class — via Siemens T&D.","Milestone"],["2016","Landmark Siemens Order","Largest order to date: 1008 radiators for Siemens' 765kV/500MVA PGCIL project at BHUJ.","Record Order"],["2017","First International Project","Bangladesh project completed for Siemens Ltd — our first international exposure.","First Export"],["2018","Largest Supplier Status","Largest radiator supplier for GE T&D, Toshiba, Hitachi Energy, Siemens & TBEA India.","Industry Leader"],["2019","RDSO Specialist","One of the largest RDSO traction transformer sources via Hitachi Energy India. Railways now a core vertical.","New Vertical"],["2020","Unbroken Through COVID-19","Maintained consistent supply to every customer through COVID-19.","Resilience"],["2021–22","IEEE & Global Approvals","IEEE approval for USA markets. HDG services launched. Offset radiators added with Toshiba India.","Global Expansion"],["2022–23","PGCIL Grade A Certificate","PGCIL Grade A certificate received. 1500+ offset radiators supplied. Customer base expanded nationwide.","Top Certification"],["2023–24","Automation & Scale","Welding automation introduced. Recognised as a major export supplier by India's transformer industry.","Automation"],["2024–25","Export Journey Begins","190 radiators supplied to Toshiba for GE USA's solar transformer project. Direct exports to AYR Energy USA begin — 5% of sales. New line and paint shop commissioned.","Direct Exports"]];
  ms.forEach(([y,t,d,g]) => { const r = document.createElement('div'); r.className = 'tl-row'; r.innerHTML = `<div class="tl-year">${y}</div><div class="tl-head"><div class="tl-title">${t}</div><div class="tl-tag">${g}</div></div><div class="tl-desc">${d}</div>`; tl.appendChild(r); });
}

/* Stat count-up (only if present) */
const animateCount = el => {
  const target = +el.dataset.count, suffix = el.dataset.suffix || '', plain = el.dataset.plain;
  const dur = 2600, t0 = performance.now();
  const tick = now => { const p = Math.min((now - t0) / dur, 1); const eased = 1 - Math.pow(1 - p, 3);
    let v = Math.round(eased * target);
    el.innerHTML = (plain ? v : v.toLocaleString('en-IN')) + (suffix ? '<em>' + suffix + '</em>' : '');
    if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
};
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  if (reduce) { counters.forEach(el => { const s = el.dataset.suffix || ''; el.innerHTML = (el.dataset.plain ? el.dataset.count : (+el.dataset.count).toLocaleString('en-IN')) + (s ? '<em>' + s + '</em>' : ''); }); }
  else { const co = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } }); }, { threshold: 0.6 }); counters.forEach(el => co.observe(el)); }
}

/* Scroll: nav shadow + parallax orbs + timeline fill */
const orbs = [...document.querySelectorAll('[data-depth]')];
const navbar = document.getElementById('navbar');
const rows = () => [...document.querySelectorAll('.tl-row')];
let ticking = false;
function onScroll() {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (!reduce) orbs.forEach(o => { const d = +o.dataset.depth; o.style.transform = `translate3d(0,${y * d}px,0)`; });
    if (tl && tlfill) {
      const rect = tl.getBoundingClientRect(); const vh = innerHeight * 0.55;
      const prog = Math.min(Math.max((vh - rect.top) / rect.height, 0), 1);
      tlfill.style.height = (prog * 100) + '%';
      rows().forEach(r => { const rb = r.getBoundingClientRect(); r.classList.toggle('lit', rb.top < vh); });
    }
    ticking = false;
  });
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* Contact form (only if present) */
const cf = document.getElementById('contactForm');
if (cf) {
  cf.addEventListener('submit', e => {
    e.preventDefault();
    if (!cf.checkValidity()) { cf.reportValidity(); return; }
    cf.style.display = 'none';
    const ok = document.getElementById('contactSuccess');
    if (ok) ok.style.display = 'block';
  });
}
