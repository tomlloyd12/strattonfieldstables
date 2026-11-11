/* Stratton Field Livery Stables — nav, testimonial slider and photo lightbox. */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- Nav --- */

  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close the dropdown after picking a destination.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------- Slider --- */

  var track = document.getElementById('slider-track');

  if (track) {
    var slides = track.children;
    var count = slides.length;
    var index = 0;

    var show = function (i) {
      index = (i + count) % count;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
    };

    var prev = document.getElementById('slider-prev');
    var next = document.getElementById('slider-next');

    if (prev) prev.addEventListener('click', function () { show(index - 1); });
    if (next) next.addEventListener('click', function () { show(index + 1); });

    // Swipe on touch devices.
    var startX = null;

    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(dx < 0 ? index + 1 : index - 1);
      startX = null;
    });

    show(0);
  }

  /* ----------------------------------------------------------- Lightbox --- */

  // The "More photos" set. These URLs are written out in full, not built
  // from a base + filename: scripts/localise-images.sh rewrites literal URLs,
  // and anything assembled at runtime would slip past it and stay on Webflow.
  var morePhotos = [
    'images/meange-bit.jpg',
    'images/menage-barn-2.jpg',
    'images/horses-eye-mask.jpg',
    'images/horses-fields.jpg',
    'images/menage-barn.jpg',
    'images/barn.jpg',
    'images/horse-box.jpg',
    'images/fields2.jpg',
    'images/horse-in-stable.jpg',
    'images/tack-room.jpg',
    'images/cass-with-horses.jpg',
    'images/martin-with-horses.jpg',
    'images/horse-vertical.jpg',
    'images/cass-martin.jpg',
    'images/fields.jpg',
    'images/martin-tea.jpg',
    'images/fields-high.jpg'
  ];

  var box = document.getElementById('lightbox');
  var boxImage = document.getElementById('lightbox-image');

  if (box && boxImage) {
    var set = [];
    var at = 0;

    var render = function () {
      boxImage.src = set[at];
    };

    var open = function (images, start) {
      set = images;
      at = start;
      render();
      box.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    var close = function () {
      box.hidden = true;
      boxImage.src = '';
      document.body.style.overflow = '';
    };

    var step = function (delta) {
      at = (at + delta + set.length) % set.length;
      render();
    };

    // Each gallery tile opens the five featured photos, starting on itself.
    var tiles = Array.prototype.slice.call(
      document.querySelectorAll('.gallery-lightbox')
    );
    var featured = tiles.map(function (a) { return a.getAttribute('href'); });

    tiles.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        open(featured, i);
      });
    });

    var more = document.getElementById('gallery-more');
    if (more) {
      more.addEventListener('click', function (e) {
        e.preventDefault();
        open(morePhotos, 0);
      });
    }

    document.getElementById('lightbox-close').addEventListener('click', close);
    document.getElementById('lightbox-prev').addEventListener('click', function () { step(-1); });
    document.getElementById('lightbox-next').addEventListener('click', function () { step(1); });

    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }
})();
