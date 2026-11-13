(function () {
  var root = document.documentElement;

  /* ---------- Year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var toggle = document.querySelector('.theme-toggle');
  var media = window.matchMedia('(prefers-color-scheme: dark)');
  function isDark() { var t = root.dataset.theme; return t ? t === 'dark' : media.matches; }
  function syncTheme() {
    root.classList.toggle('is-dark', isDark());
    if (toggle) toggle.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      root.dataset.theme = isDark() ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
      syncTheme();
    });
  }
  if (media.addEventListener) media.addEventListener('change', syncTheme);
  syncTheme();

  /* ---------- Hairline under the header once scrolled ---------- */
  var topbar = document.querySelector('.topbar');
  function onScroll() { if (topbar) topbar.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shortUrl(u) { return String(u || '').replace(/^https?:\/\//, '').replace(/\/$/, ''); }

  /* ---------- Mock screens, shown until a real screenshot exists ---------- */
  var MOCKS = {
    tiffin: function () {
      var rows = [
        ['Mehta family', 'Sector 21, 2 tiffins', 'ok', 'Delivered'],
        ['R. Iyer', 'Model Town, 1 tiffin', 'ok', 'Delivered'],
        ['Kapoor', 'Civil Lines, 3 tiffins', 'go', 'On the way'],
        ['S. Bansal', 'Sector 14', '', 'Paused till 12 Nov'],
        ['A. Khan', 'Rajouri Garden, 2 tiffins', 'go', 'On the way'],
        ['Verma PG', 'Sector 15, 6 tiffins', '', 'Packing'],
        ['N. Joshi', 'Model Town, 1 tiffin', '', 'Packing']
      ];
      return '<div class="mock">' +
        '<div class="m-head"><span class="m-title">Lunch, Friday 6 November</span><span class="m-sub mono">Route 2</span></div>' +
        '<div class="m-stats">' +
          '<div><b>58</b><span>Tiffins today</span></div>' +
          '<div><b>6</b><span>Paused</span></div>' +
          '<div><b>₹1,84,200</b><span>Collected in November</span></div>' +
        '</div>' +
        '<div class="m-rows">' + rows.map(function (r) {
          return '<div class="m-row"><span>' + r[0] + '</span><span class="m-sub">' + r[1] + '</span>' +
            '<span class="m-status"><span class="m-dot' + (r[2] ? ' m-dot--' + r[2] : '') + '"></span>' + r[3] + '</span></div>';
        }).join('') + '</div>' +
      '</div>';
    },
    queueless: function () {
      return '<div class="mock mock--tv">' +
        '<span class="tv-label mono">Now seeing</span>' +
        '<div class="tv-now"><span class="tv-num">24</span>' +
          '<span class="tv-room">Dr. Sharma<small>Room 2, average wait 11 min</small></span></div>' +
        '<div class="tv-next"><span>25</span><span>26</span><span>27</span><span>28</span></div>' +
      '</div>';
    },
    mess: function () {
      var bars = [['Dal too watery', 38], ['Breakfast late on Tuesday', 21], ['Not enough rotis at dinner', 17], ['Cold tea in the morning', 9]];
      var max = bars[0][1];
      return '<div class="mock">' +
        '<div class="m-head"><span class="m-title">Week 44, Hostel B</span><span class="m-sub mono">412 ratings</span></div>' +
        '<div class="m-stats"><div><b>3.6 / 5</b><span>Average dinner rating</span></div><div><b>85</b><span>Problems reported</span></div></div>' +
        '<div class="m-bars">' + bars.map(function (b, i) {
          return '<div class="m-bar' + (i === 0 ? ' m-bar--top' : '') + '"><span>' + b[0] + '</span><b>' + b[1] + '</b>' +
            '<div class="m-bar__track"><div class="m-bar__fill" style="width:' + Math.round(b[1] / max * 100) + '%"></div></div></div>';
        }).join('') + '</div>' +
      '</div>';
    },
    paperboy: function () {
      return '<div class="mock mock--term">' +
        '<div class="t-cmd">paperboy run</div>' +
        '<div class="t-dim">fetching 23 feeds</div>' +
        '<div>  hacker news ........ 12 items</div>' +
        '<div>  the hindu tech ..... 8 items</div>' +
        '<div>  julia evans ........ 1 item</div>' +
        '<div>  go blog ............ 1 item</div>' +
        '<div class="t-dim">  19 more feeds, 31 items</div>' +
        '<div class="t-dim">laying out 53 articles</div>' +
        '<div class="t-ok">wrote paper-2026-11-06.pdf, 14 pages</div>' +
      '</div>';
    }
  };

  function windowFrame(p) {
    var link = p.live || p.code || '';
    var lock = '<svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2.5" y="5.5" width="7" height="5" rx="1"/><path d="M4 5.5V4a2 2 0 0 1 4 0v1.5"/></svg>';
    var bar = link
      ? '<a class="window__url" href="' + esc(link) + '" target="_blank" rel="noopener" tabindex="-1">' + lock + '<span>' + esc(shortUrl(link)) + '</span></a>'
      : '<span class="window__url">' + lock + '<span>' + esc(p.title.toLowerCase()) + '</span></span>';
    var mock = p.mock && MOCKS[p.mock] ? MOCKS[p.mock]() : '';
    var img = p.image
      ? '<img src="' + esc(p.image) + '" alt="Screenshot of ' + esc(p.title) + '" loading="lazy" width="1600" height="1000" ' +
        'onload="this.parentNode.classList.add(\'has-img\')" onerror="this.remove()">'
      : '';
    return '<div class="window"><div class="window__bar">' + bar + '</div>' +
      '<div class="window__view">' + mock + img + '</div></div>';
  }

  function project(p, i) {
    var link = p.live || p.code || '';
    var title = link ? '<a href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(p.title) + '</a>' : esc(p.title);
    var links = '';
    if (p.live) links += '<a href="' + esc(p.live) + '" target="_blank" rel="noopener">Visit the site</a>';
    if (p.code) links += '<a href="' + esc(p.code) + '" target="_blank" rel="noopener">Read the code</a>';
    var meta = [p.year, p.role, p.category].filter(Boolean).map(esc).join(' · ');
    var cls = 'project' + (p.featured ? ' project--feature' : '') + (!p.featured && i % 2 === 0 ? ' project--flip' : '');

    return '<article class="' + cls + '" data-cat="' + esc(p.category || '') + '">' +
      '<div class="project__shot">' + windowFrame(p) + '</div>' +
      '<div class="project__text">' +
        (meta ? '<p class="project__meta mono">' + meta + '</p>' : '') +
        '<h3>' + title + '</h3>' +
        '<p class="project__desc">' + esc(p.description) + '</p>' +
        ((p.tags || []).length ? '<p class="project__stack mono">' + p.tags.map(esc).join(' / ') + '</p>' : '') +
        (links ? '<p class="project__links">' + links + '</p>' : '') +
      '</div>' +
    '</article>';
  }

  var projects = window.PROJECTS || [];
  var list = document.getElementById('projects');
  if (list) list.innerHTML = projects.map(project).join('');

  /* Hero: if there is no photo yet, show the featured project's window instead */
  var heroMock = document.querySelector('.hero__mock');
  var featured = projects.filter(function (p) { return p.featured; })[0] || projects[0];
  if (heroMock && featured) heroMock.innerHTML = windowFrame(featured);

  /* ---------- Filter tabs ---------- */
  var filterBar = document.querySelector('.filters');
  var cats = [];
  projects.forEach(function (p) { if (p.category && cats.indexOf(p.category) === -1) cats.push(p.category); });
  if (filterBar && list && cats.length > 1) {
    var count = function (c) { return c === 'All' ? projects.length : projects.filter(function (p) { return p.category === c; }).length; };
    filterBar.innerHTML = ['All'].concat(cats).map(function (c, i) {
      return '<button class="filter" type="button" aria-pressed="' + (i === 0) + '" data-cat="' + esc(c) + '">' +
        esc(c) + '<span>' + count(c) + '</span></button>';
    }).join('');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      var cat = btn.getAttribute('data-cat');
      filterBar.querySelectorAll('.filter').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      list.querySelectorAll('.project').forEach(function (el) {
        el.hidden = !(cat === 'All' || el.getAttribute('data-cat') === cat);
      });
    });
  }

  /* ---------- Current section in the nav ---------- */
  var navLinks = document.querySelectorAll('.nav a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.querySelector('.copy-btn');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(copyBtn.getAttribute('data-copy')).then(function () {
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1600);
      }, function () {});
    });
  }
})();
