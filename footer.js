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
    { label: 'Milestones', href: 'milestones.html' },
    { label: 'Triveni Group', href: 'triveni-group.html' },
    { label: 'Clients', href: 'clientele.html' },
    { label: 'Careers', href: 'careers.html' }
  ];
  var FOOT_SUPPORT = [
    { label: 'Contact us', href: 'contact.html' },
    { label: 'Enquiry', href: 'contact.html' }
  ];
  var FOOT_LINKEDIN = 'https://www.linkedin.com/company/triveni-electroplast-pvt-ltd';
  var FOOT_ADDRESS = 'B-2, UPSIDC Industrial Area, Naini, Prayagraj – 211010, Uttar Pradesh, India';
  var FOOT_EMAIL = 'info@triveniradiators.com';
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
      +       '<a href="' + FOOT_LINKEDIN + '" target="_blank" rel="noopener">LinkedIn</a>'
      +       '<a href="mailto:' + FOOT_EMAIL + '">Email</a>'
      +     '</div>'
      +   '</div>'

      +   '<nav class="fx-col" aria-label="Explore">'
      +     '<p class="fx-col-title">Explore</p>'
      +     navLinks(FOOT_EXPLORE, current)
      +   '</nav>'

      +   '<nav class="fx-col" aria-label="Support">'
      +     '<p class="fx-col-title">Support</p>'
      +     navLinks(FOOT_SUPPORT, current)
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
