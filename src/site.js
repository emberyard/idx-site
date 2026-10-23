// Small progressive enhancements. The site works without this file (tabs stack, theme follows the system).
(function () {
  var d = document, root = d.documentElement;
  var tb = d.getElementById('theme-toggle');
  if (tb) tb.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    if (!cur) cur = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    var next = cur === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
  var mb = d.getElementById('menu-btn'), mn = d.getElementById('mobile-nav');
  if (mb && mn) mb.addEventListener('click', function () {
    var open = mn.classList.toggle('open');
    mb.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // tabs (product tour)
  d.querySelectorAll('[data-tour]').forEach(function (tour) {
    var tabs = [].slice.call(tour.querySelectorAll('[role=tab]'));
    var panels = [].slice.call(tour.querySelectorAll('[role=tabpanel]'));
    function select(i, focus) {
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = tabs.length;
        if (k === 'ArrowRight') { e.preventDefault(); select((i + 1) % n, true); }
        else if (k === 'ArrowLeft') { e.preventDefault(); select((i + n - 1) % n, true); }
        else if (k === 'Home') { e.preventDefault(); select(0, true); }
        else if (k === 'End') { e.preventDefault(); select(n - 1, true); }
      });
    });
    select(0);
  });
  // friction calculator (the visitor's own numbers; nothing is sent anywhere)
  var calc = d.querySelector('[data-calc]');
  if (calc) {
    var out = calc.querySelector('output');
    var upd = function () {
      var a = +calc.querySelector('[name=times]').value || 0, b = +calc.querySelector('[name=mins]').value || 0, c = +calc.querySelector('[name=days]').value || 0;
      var h = a * b * c / 60;
      out.textContent = (Math.round(h * 10) / 10) + ' hours a month';
    };
    calc.addEventListener('input', upd); upd();
  }
  // copy buttons
  d.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = d.getElementById(b.getAttribute('data-copy'));
      if (!el || !navigator.clipboard) return;
      navigator.clipboard.writeText(el.innerText.trim()).then(function () {
        var t = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = t; }, 1500);
      });
    });
  });
  // changelog: a link to an older release opens the folded list first
  var openOlder = function () {
    var id = decodeURIComponent(location.hash.slice(1)), t = id && d.getElementById(id), o = d.getElementById('older');
    if (t && o && o.contains(t) && !o.open) { o.open = true; t.scrollIntoView(); }
  };
  openOlder(); window.addEventListener('hashchange', openOlder);
})();
