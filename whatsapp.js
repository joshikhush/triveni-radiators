/* ==========================================================
   SHARED WHATSAPP CONTACT CONFIG
   Single source for the WhatsApp business number so it can't drift between
   pages. Set TRIVENI_WHATSAPP_NUMBER (E.164, digits only, no + or spaces,
   e.g. "911204308000") once the business number is confirmed — leave it
   blank until then. Never fill this with a guessed or placeholder number.

   Any element with [data-whatsapp-link] gets its href wired to
   https://wa.me/<number>?text=<message> automatically. Until the number is
   set, those links are inert (aria-disabled, click does nothing) rather
   than pointing at a broken destination.
   ========================================================== */
window.TRIVENI_WHATSAPP_NUMBER = '';
window.TRIVENI_WHATSAPP_MESSAGE = "Hi Triveni Radiators, I'd like to enquire about transformer radiators.";

window.triveniWhatsAppHref = function () {
  var n = window.TRIVENI_WHATSAPP_NUMBER;
  if (!n) return null;
  return 'https://wa.me/' + n + '?text=' + encodeURIComponent(window.TRIVENI_WHATSAPP_MESSAGE || '');
};

(function () {
  function wire() {
    document.querySelectorAll('[data-whatsapp-link]').forEach(function (a) {
      var href = window.triveniWhatsAppHref();
      if (href) {
        a.href = href;
        a.removeAttribute('aria-disabled');
      } else {
        a.href = '#';
        a.setAttribute('aria-disabled', 'true');
        a.addEventListener('click', function (e) { e.preventDefault(); });
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
