// The Design Bench — small progressive-enhancement behaviors only.
// No dependencies, no build step.

(function () {
  // Mobile nav toggle
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close the menu after picking a link (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // "View Design" platform picker — opens a small menu of platform links
  // (Cults3D / Printables / MakerWorld / Thangs) so the right one can be
  // picked when a project is posted on more than one.
  //
  // While open, the menu is moved to a direct child of <body> and switched
  // to position:fixed with coordinates computed from the button's position.
  // Two reasons it has to be this involved rather than plain CSS
  // position:absolute:
  //   1. The portfolio page's rows scroll horizontally (overflow-x:auto),
  //      which forces every browser to also clip the Y axis — an
  //      absolutely-positioned menu inside one of those rows gets cut off
  //      instead of floating over the page.
  //   2. .project-card gets a `transform` on hover for the lift effect, and
  //      a CSS transform on any ancestor creates a new containing block for
  //      position:fixed descendants — so a fixed-position menu left inside
  //      a hovered card would be positioned relative to THAT card, not the
  //      viewport, landing in the wrong place the moment the card is
  //      hovered (i.e. right before every real click). Moving the menu out
  //      to <body> sidesteps both problems at once.
  // It closes on outside click / Escape.
  function closeAllPickers() {
    document.querySelectorAll('.platform-menu.is-open').forEach(function (menu) {
      menu.classList.remove('is-open');
      menu._homeParent.appendChild(menu);
      menu.style.position = '';
      menu.style.top = '';
      menu.style.left = '';
      if (menu._btn) menu._btn.setAttribute('aria-expanded', 'false');
    });
  }

  document.querySelectorAll('.view-design').forEach(function (wrapper) {
    var btn = wrapper.querySelector('.view-design-btn');
    var menu = wrapper.querySelector('.platform-menu');
    if (!btn || !menu) return;
    menu._homeParent = wrapper;
    menu._btn = btn;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = menu.classList.contains('is-open');
      closeAllPickers();
      if (!wasOpen) {
        var rect = btn.getBoundingClientRect();
        document.body.appendChild(menu);
        menu.style.position = 'fixed';
        var left = Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8);
        menu.style.top = (rect.bottom + 8) + 'px';
        menu.style.left = Math.max(8, left) + 'px';
        menu.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', closeAllPickers);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllPickers();
  });
})();
