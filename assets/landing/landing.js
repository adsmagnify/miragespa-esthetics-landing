/* Mirage Spa - paid landing page */
(function () {
  'use strict';

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

  function initReviews() {
    var el = document.querySelector('.ed-testimonial__slider-2');
    if (!el || typeof window.Swiper === 'undefined') return;
    if (el.swiper) {
      el.swiper.destroy(true, true);
    }

    var swiper = new window.Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 16,
      watchOverflow: true,
      observer: true,
      observeParents: true,
      autoHeight: false,
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      breakpoints: {
        992: { slidesPerView: 2, spaceBetween: 24 }
      },
      on: {
        init: fitReviewHeight,
        imagesReady: fitReviewHeight,
        resize: fitReviewHeight
      }
    });

    function fitReviewHeight() {
      if (!swiper || !swiper.slides) return;
      var max = 0;
      var slides = swiper.slides;
      for (var i = 0; i < slides.length; i++) {
        slides[i].style.height = 'auto';
        max = Math.max(max, slides[i].offsetHeight);
      }
      if (max) {
        el.style.height = '';
        el.style.minHeight = (max + 56) + 'px';
        swiper.updateSize();
      }
    }

    el.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) {
        img.addEventListener('load', fitReviewHeight);
      }
    });
    window.addEventListener('load', fitReviewHeight);
  }

  function openItem(item, open) {
    item.classList.toggle('is-open', open);
    item.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function initCurriculumAccordion(root) {
    var preview = 5;
    var items = Array.prototype.slice.call(root.querySelectorAll('.curriculum-item'));
    items.forEach(function (item, index) {
      if (index >= preview) item.classList.add('is-extra');
      openItem(item, false);
      item.addEventListener('click', function () {
        var willOpen = !item.classList.contains('is-open');
        items.forEach(function (other) {
          openItem(other, willOpen && other === item);
        });
      });
    });

    if (items.length <= preview) return;

    var more = document.createElement('button');
    more.type = 'button';
    more.className = 'lp-curr-more';
    more.textContent = 'Show all ' + items.length + ' units';
    root.insertAdjacentElement('afterend', more);

    more.addEventListener('click', function () {
      var expanded = root.classList.toggle('is-expanded');
      more.textContent = expanded
        ? 'Show fewer units'
        : 'Show all ' + items.length + ' units';
      if (!expanded) {
        items.forEach(function (item) { openItem(item, false); });
      }
    });
  }

  function initCurriculum() {
    document.querySelectorAll('.ed-modern-curriculum').forEach(initCurriculumAccordion);

    var tabs = document.querySelectorAll('.lp-curr-tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('data-curr-tab');
        tabs.forEach(function (other) {
          var on = other === tab;
          other.classList.toggle('is-active', on);
          other.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        document.querySelectorAll('.lp-curr-panel').forEach(function (panel) {
          panel.classList.toggle('is-active', panel.id === 'curr-' + id);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initReviews();
      initCurriculum();
    });
  } else {
    initReviews();
    initCurriculum();
  }
})();
