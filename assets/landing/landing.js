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

  var reviewsResizeBound = false;
  var reviewsLastWidth = 0;
  var reviewsSwiper = null;

  function slideNode(slide) {
    if (!slide) return null;
    if (slide.style) return slide;
    return slide.el || null;
  }

  function equalizeReviewHeights(swiper) {
    var slides = swiper.slides || [];
    var max = 0;
    var i;
    var node;
    for (i = 0; i < slides.length; i += 1) {
      node = slideNode(slides[i]);
      if (node) node.style.height = 'auto';
    }
    for (i = 0; i < slides.length; i += 1) {
      node = slideNode(slides[i]);
      if (node) max = Math.max(max, node.offsetHeight);
    }
    if (!max) return;
    for (i = 0; i < slides.length; i += 1) {
      node = slideNode(slides[i]);
      if (node) node.style.height = max + 'px';
    }
  }

  function initReviews() {
    var el = document.querySelector('.ed-testimonial__slider-2');
    if (!el || typeof window.Swiper === 'undefined') return;
    if (el.swiper) {
      el.swiper.destroy(true, true);
    }

    reviewsLastWidth = window.innerWidth;
    reviewsSwiper = new window.Swiper(el, {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 16,
      watchOverflow: true,
      autoHeight: false,
      allowTouchMove: true,
      centeredSlides: false,
      roundLengths: true,
      speed: 450,
      pagination: {
        el: el.querySelector('.swiper-pagination'),
        clickable: true
      },
      on: {
        init: function () {
          equalizeReviewHeights(this);
        }
      }
    });

    if (!reviewsResizeBound) {
      reviewsResizeBound = true;
      window.addEventListener('resize', function () {
        if (!reviewsSwiper || window.innerWidth === reviewsLastWidth) return;
        reviewsLastWidth = window.innerWidth;
        equalizeReviewHeights(reviewsSwiper);
        reviewsSwiper.update();
      });
    }
  }

  function openItem(item, open) {
    item.classList.toggle('is-open', open);
    item.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function initVideoStories() {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.lp-video-card'));
    if (!cards.length) return;

    function pauseOthers(active) {
      cards.forEach(function (card) {
        if (card === active) return;
        var other = card.querySelector('video');
        if (other && !other.paused) other.pause();
      });
    }

    cards.forEach(function (card) {
      var video = card.querySelector('video');
      var play = card.querySelector('.lp-video-card__play');
      if (!video || !play) return;

      video.addEventListener('loadedmetadata', function () {
        if (video.videoWidth > video.videoHeight) {
          card.classList.add('is-landscape');
        } else {
          card.classList.remove('is-landscape');
        }
      });

      function togglePlay() {
        if (video.paused) {
          pauseOthers(card);
          video.setAttribute('controls', 'controls');
          var playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {});
          }
        } else {
          video.pause();
        }
      }

      play.addEventListener('click', togglePlay);
      video.addEventListener('click', function () {
        if (!card.classList.contains('is-playing')) togglePlay();
      });
      video.addEventListener('play', function () {
        card.classList.add('is-playing');
        pauseOthers(card);
      });
      video.addEventListener('pause', function () {
        if (video.ended) return;
        card.classList.remove('is-playing');
      });
      video.addEventListener('ended', function () {
        card.classList.remove('is-playing');
        video.removeAttribute('controls');
      });
    });
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

  function bootLanding() {
    initReviews();
    initVideoStories();
    initCurriculum();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootLanding);
  } else {
    bootLanding();
  }
  window.addEventListener('load', initReviews);
})();
