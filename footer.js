/* ==========================================================
   SHARED SITE FOOTER — logic ("Version A · Plain")
   Renders the footer into <footer id="site-footer"></footer> on every page.
   Edit the arrays/constants below to change a link, address or email
   everywhere at once — this is the single source of truth; nothing else on
   the site should hardcode footer markup.
   ========================================================== */
(function(){
  var FOOT_EXPLORE = [
    { label: 'Home', href: 'index.html' },
    { label: 'Product', href: 'products.html' },
    { label: 'Credentials', href: 'credentials.html' },
    { label: 'Milestones', href: 'milestones.html' }
  ];
  var FOOT_COMPANY = [
    { label: 'Triveni Group', href: 'triveni-group.html' },
    { label: 'Clients', href: 'clientele.html' },
    { label: 'Careers', href: 'careers.html' },
    { label: 'Contact us', href: 'contact.html' }
  ];
  var FOOT_LINKEDIN = 'https://www.linkedin.com/company/triveni-electroplast-pvt-ltd';
  var FOOT_ADDRESS = 'B-2, UPSIDC Industrial Area, Naini, Prayagraj – 211010, Uttar Pradesh, India';
  var FOOT_EMAIL = 'sales@triveniradiators.com';
  // No phone row: there is no confirmed number yet, and the brief is explicit
  // that this footer should not ship a placeholder like "+91 00000 00000".
  // Add a FOOT_PHONE constant + a matching .fx-touch block once one exists.

  function currentFile(){
    var path = window.location.pathname.split('/').pop();
    return path === '' || path === undefined ? 'index.html' : path;
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, function(ch){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch];
    });
  }

  function navLink(item, current){
    var isCurrent = item.href === current;
    var attrs = isCurrent ? ' class="current" aria-current="page"' : '';
    return '<a href="' + item.href + '"' + attrs + '>' + escapeHtml(item.label) + '</a>';
  }

  function navLinks(items, current){
    return items.map(function(it){ return navLink(it, current); }).join('');
  }

  function buildFooterHTML(){
    var current = currentFile();
    var year = new Date().getFullYear();

    return ''
      + '<div class="fx-container fx-cols">'
      +   '<div class="fx-col-brand">'
      +     '<a href="index.html" class="fx-logo"><img src="assets/triveni-logo.png" alt="Triveni Radiators"></a>'
      +     '<p class="fx-desc">Precision built radiators for power transformers, trusted by India’s leading OEMs and utilities.</p>'
      +     '<div class="fx-brand-links">'
      +       '<a href="' + FOOT_LINKEDIN + '" target="_blank" rel="noopener" class="fx-icon-link" aria-label="LinkedIn">'
      +         '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 9.5H5.67V18h2.67V9.5zM7 5.9a1.55 1.55 0 1 0 0 3.1 1.55 1.55 0 0 0 0-3.1zM18.33 18v-4.67c0-2.5-1.33-3.66-3.11-3.66-1.43 0-2.07.79-2.43 1.34V9.5h-2.67V18h2.67v-4.5c0-1.18.83-1.5 1.4-1.5.55 0 1.47.32 1.47 1.5V18h2.67z"/></svg>'
      +       '</a>'
      +       '<a href="mailto:' + FOOT_EMAIL + '" class="fx-icon-link" aria-label="Email">'
      +         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>'
      +       '</a>'
      +     '</div>'
      +   '</div>'

      +   '<nav class="fx-col" aria-label="Explore">'
      +     '<p class="fx-col-title">Explore</p>'
      +     navLinks(FOOT_EXPLORE, current)
      +   '</nav>'

      +   '<nav class="fx-col" aria-label="Company">'
      +     '<p class="fx-col-title">Company</p>'
      +     navLinks(FOOT_COMPANY, current)
      +   '</nav>'

      +   '<div class="fx-col">'
      +     '<p class="fx-col-title">Get in touch</p>'
      +     '<address class="fx-address">'
      +       '<div class="fx-touch">'
      +         '<span class="fx-touch-label">Works</span>'
      +         '<span class="fx-touch-value">' + escapeHtml(FOOT_ADDRESS) + '</span>'
      +       '</div>'
      +       '<div class="fx-touch">'
      +         '<span class="fx-touch-label">Email</span>'
      +         '<span class="fx-touch-value"><a href="mailto:' + FOOT_EMAIL + '">' + escapeHtml(FOOT_EMAIL) + '</a></span>'
      +       '</div>'
      +     '</address>'
      +   '</div>'
      + '</div>'

      + '<div class="fx-container fx-bottom">'
      +   '<p class="fx-copy">&copy; ' + year + ' Triveni Electroplast Pvt Ltd</p>'
      +   '<nav class="fx-legal" aria-label="Legal">'
      +     '<a href="privacy.html">Privacy policy</a>'
      +     '<a href="terms.html">Terms &amp; conditions</a>'
      +     '<a href="#top" data-totop>Back to top</a>'
      +   '</nav>'
      + '</div>';
  }

  function attachBackToTop(mount){
    var link = mount.querySelector('[data-totop]');
    if (!link) return;
    link.addEventListener('click', function(e){
      e.preventDefault();
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  function init(){
    var mount = document.getElementById('site-footer');
    if (!mount) return;
    mount.innerHTML = buildFooterHTML();
    attachBackToTop(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
