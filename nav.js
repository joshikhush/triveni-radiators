/* ==========================================================
   SHARED SITE NAV — logic ("slim / premium").
   Renders into <nav id="site-nav"></nav> on every page and wires:
   the Company dropdown, the 40px scroll state, and the full-screen
   mobile menu. Single source of truth for the top nav — edit the
   arrays below to change links everywhere at once.
   ========================================================== */
(function(){
  var TOP = [
    { key:'home',           label:'Home',           href:'index.html' },
    { key:'products',       label:'Products',       href:'products.html' },
    { key:'sustainability', label:'Sustainability', href:'sustainability.html' },
    { key:'clients',        label:'Clients',        href:'clientele.html' },
    { key:'gallery',        label:'Gallery',        href:'gallery.html' }
  ];
  var COMPANY = [
    { label:'Triveni Group', href:'triveni-group.html' },
    { label:'Milestones',    href:'milestones.html' },
    { label:'Credentials',   href:'credentials.html' },
    { label:'Careers',       href:'careers.html' }
  ];
  var CONTACT = { label:'Contact Us', href:'contact.html' };
  var LOGO = { href:'index.html', img:'assets/triveni-logo.png', alt:'Triveni Radiators' };

  /* which top-level item owns the current page (incl. pages not in the bar) */
  var OWNER = {
    'index.html':'home',
    'products.html':'products', 'products-all.html':'products',
    'sustainability.html':'sustainability',
    'clientele.html':'clients', 'major-customers-directory.html':'clients', 'end-customers-directory.html':'clients',
    'gallery.html':'gallery',
    'triveni-group.html':'company', 'milestones.html':'company', 'credentials.html':'company',
    'careers.html':'company', 'leadership.html':'company'
  };

  function currentFile(){
    var p = window.location.pathname.split('/').pop();
    return (!p) ? 'index.html' : p;
  }
  function esc(s){ return String(s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  var caretSVG = '<svg class="sn-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var arrowSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>';

  function build(){
    var cur = currentFile();
    var owner = OWNER[cur] || '';

    var topLinks = TOP.map(function(it){
      var on = owner === it.key ? ' is-active' : '';
      var cur2 = cur === it.href ? ' aria-current="page"' : '';
      return '<li><a class="sn-link'+on+'" href="'+it.href+'"'+cur2+'>'+esc(it.label)+'</a></li>';
    }).join('');

    var companyItems = COMPANY.map(function(it){
      var on = cur === it.href ? ' class="is-active" aria-current="page"' : '';
      return '<li><a href="'+it.href+'"'+on+'>'+esc(it.label)+'</a></li>';
    }).join('');
    var companyOn = owner === 'company' ? ' is-active' : '';
    var company =
      '<li class="sn-item--has-menu">'
      + '<button class="sn-link'+companyOn+'" type="button" aria-haspopup="true" aria-expanded="false">Company'+caretSVG+'</button>'
      + '<ul class="sn-menu">'+companyItems+'</ul>'
      + '</li>';

    var mobileLinks = TOP.concat(COMPANY).map(function(it){
      var on = cur === it.href ? ' class="is-active" aria-current="page"' : '';
      return '<li><a href="'+it.href+'"'+on+'>'+esc(it.label)+'</a></li>';
    }).join('');

    return ''
      + '<div class="sn-bar">'
      +   '<a class="sn-logo" href="'+LOGO.href+'" aria-label="Triveni Radiators — home"><img src="'+LOGO.img+'" alt="'+esc(LOGO.alt)+'"></a>'
      +   '<ul class="sn-links">'+topLinks+company+'</ul>'
      +   '<a class="sn-cta" href="'+CONTACT.href+'">'+esc(CONTACT.label)+'<span class="sn-cta-arrow">'+arrowSVG+'</span></a>'
      +   '<button class="sn-toggle" id="snToggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>'
      + '</div>'
      + '<div class="sn-mobile" id="snMobile">'
      +   '<ul class="sn-mlinks">'+mobileLinks+'</ul>'
      +   '<a class="sn-mcta" href="'+CONTACT.href+'">'+esc(CONTACT.label)+'</a>'
      + '</div>';
  }

  function init(){
    var mount = document.getElementById('site-nav');
    if(!mount) return;
    mount.innerHTML = build();

    /* ---- scroll state (restyle after 40px) ---- */
    var ticking = false;
    function onScroll(){
      mount.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    }
    addEventListener('scroll', function(){
      if(!ticking){ requestAnimationFrame(onScroll); ticking = true; }
    }, { passive:true });
    onScroll();

    /* ---- Company dropdown (click/keyboard; hover handled in CSS) ---- */
    var item = mount.querySelector('.sn-item--has-menu');
    var btn  = item && item.querySelector('.sn-link');
    if(item && btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var open = item.classList.toggle('sn-item--open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      item.querySelectorAll('.sn-menu a').forEach(function(a){
        a.addEventListener('click', function(){ item.classList.remove('sn-item--open'); btn.setAttribute('aria-expanded','false'); });
      });
      document.addEventListener('click', function(e){
        if(!item.contains(e.target)){ item.classList.remove('sn-item--open'); btn.setAttribute('aria-expanded','false'); }
      });
    }

    /* ---- mobile full-screen menu ---- */
    var toggle = document.getElementById('snToggle');
    var mobile = document.getElementById('snMobile');
    function setMenu(open){
      mount.classList.toggle('menu-open', open);
      if(toggle){ toggle.setAttribute('aria-expanded', open ? 'true':'false'); toggle.setAttribute('aria-label', open ? 'Close menu':'Open menu'); }
      document.body.style.overflow = open ? 'hidden' : '';
    }
    if(toggle){ toggle.addEventListener('click', function(){ setMenu(!mount.classList.contains('menu-open')); }); }
    if(mobile){ mobile.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); }); }

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        setMenu(false);
        if(item){ item.classList.remove('sn-item--open'); if(btn) btn.setAttribute('aria-expanded','false'); }
      }
    });
    /* leaving mobile width open then resizing to desktop clears the lock */
    addEventListener('resize', function(){ if(window.innerWidth >= 1024 && mount.classList.contains('menu-open')) setMenu(false); });
  }

  if(document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();
