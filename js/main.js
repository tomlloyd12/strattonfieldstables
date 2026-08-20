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
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc1b0ee91ffe6fe5726_meange%20bit.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc122ce747fadd2e61b_menage%20barn%202.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc122ce740a84d2e626_horses%20eye%20mask.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc2ca7be6fc6476f9f6_horses%20fields.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc1439fa64116f165b7_menage%20barn.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc04361af8b00ccc2c6_barn.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc1b0d76c8d663afd08_horse%20box.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc1f01cad42757c6a88_Fields2.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc0350a38ccd63f18da_Horse%20in%20stable.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dbfb7ad65f2051f7664_Tack%20Room.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc224ba583ccb298a90_Cass%20with%20horses.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc2dac694170bc59fd7_Martin%20with%20horses.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc0b0d76c0ee43afd03_Horse%20vertical.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dbfa0f2841ddbd38f00_cass%20martin.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc2f4c914885576b7c2_Fields.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc04361af3ccbccc2c5_Martin%20tea.jpg',
    'https://cdn.prod.website-files.com/62a0a825ae0cda6968caf141/63027dc179dc34fb948ec733_fields%20high.jpg'
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
