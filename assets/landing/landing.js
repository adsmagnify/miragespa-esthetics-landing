/* Mirage Spa - esthetics & spa therapy landing page (paid traffic) */
(function () {
  'use strict';

  // CTA hook: every conversion element carries data-cta="<name>".
  // Wire your ad platform's conversion call inside this listener.
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', function () {
      var name = el.getAttribute('data-cta');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'cta_click', { cta: name });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'CTAClick', { cta: name });
      }
    });
  });

  // In-page anchors. GSAP ScrollSmoother owns the scroll position, so hand the
  // jump to it when it is running; fall back to native scrolling if it is not.
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      var smoother = (window.ScrollSmoother && window.ScrollSmoother.get)
        ? window.ScrollSmoother.get() : null;
      if (smoother) {
        smoother.scrollTo(target, true, 'top 100px');
        return;
      }
      var top = target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
