(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll and count up stats
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  const fmt = (n, el) => (el.dataset.sep ? Math.round(n).toLocaleString('en-US') : n.toFixed(+el.dataset.dec || 0)) + (el.dataset.suffix || '');
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    co.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, t0 = performance.now();
    if (calm) { el.textContent = fmt(to, el); return; }
    (function tick(t) {
      const p = Math.min((t - t0) / 1400, 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), el);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }), { threshold: .6 });
  $$('[data-to]').forEach(el => co.observe(el));

  // Rotating role in hero
  const roles = ['frontend developer', 'quality assurance', 'data analyst', 'AI and ML learner'], roleEl = $('#role');
  if (!calm) {
    let i = 0;
    setInterval(() => {
      roleEl.classList.add('out');
      setTimeout(() => { roleEl.textContent = roles[i = (i + 1) % roles.length]; roleEl.classList.remove('out'); }, 350);
    }, 2600);
  }

  // Tabs (chips and project tabs), with arrow key support
  $$('[data-tabs]').forEach(list => {
    const tabs = $$('[role=tab]', list);
    const pick = t => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.tabIndex = i ? -1 : 0;
      t.addEventListener('click', () => pick(t));
      t.addEventListener('keydown', e => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!d) return;
        const n = tabs[(i + d + tabs.length) % tabs.length];
        n.focus(); pick(n);
      });
    });
  });

  // Menus
  const burger = $('.burger'), menu = $('#menu'), dd = $('.has-dd'), ddBtn = $('.dd');
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', menu.classList.toggle('open')));
  ddBtn.addEventListener('click', e => { e.stopPropagation(); ddBtn.setAttribute('aria-expanded', dd.classList.toggle('open')); });
  const closeAll = () => { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded', false); menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); };
  document.addEventListener('click', e => { if (!dd.contains(e.target)) { dd.classList.remove('open'); ddBtn.setAttribute('aria-expanded', false); } });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  $$('.menu a').forEach(a => a.addEventListener('click', closeAll));

  // Gifs: hide the image if the file is missing, the button still works
  $$('.shot img').forEach(img => img.addEventListener('error', () => { img.style.display = 'none'; }));

  // Scroll: progress bar, back to top, active nav, breadcrumbs
  const bar = $('#progress'), top = $('.top'), crumbs = $('#crumbs');
  const secs = $$('section'), projs = $$('.project, .compact'), links = $$('.menu > li > a');
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }));
  let last = '';
  const update = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    top.classList.toggle('show', y > 700);
    const probe = y + 160;
    const at = list => list.filter(s => s.offsetTop <= probe && s.offsetTop + s.offsetHeight > probe)[0];
    const sec = at(secs), pr = at(projs);
    links.forEach(a => a.classList.toggle('on', !!sec && a.getAttribute('href') === '#' + sec.id));
    const trail = [['Home', '#top']];
    if (sec) trail.push([sec.dataset.crumb, '#' + sec.id]);
    if (sec && sec.id === 'projects' && pr) trail.push([pr.dataset.crumb, '#' + pr.id]);
    const key = trail.map(t => t[0]).join('|');
    if (key === last) return;
    last = key;
    crumbs.innerHTML = trail.map((t, i) => i === trail.length - 1
      ? `<li aria-current="page">${t[0]}</li>` : `<li><a href="${t[1]}">${t[0]}</a></li>`).join('');
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
})();
