/* global-nav.js — injects a small sitewide nav and smooth page transitions */
(function(){
  const NAV_HTML = `
  <nav class="navbar site-nav" role="navigation" aria-label="Main">
    <div class="nav-container">
      <div class="nav-logo">
        <span class="logo-text">Ashlyns BUSINESS</span>
        <span class="logo-subtitle">BUSINESS</span>
      </div>
      <ul class="nav-menu">
        <li><a class="nav-link" href="index.html">HOME</a></li>
        <li><a class="nav-link" href="mazda.html">MAZDA</a></li>
        <li><a class="nav-link" href="gallery.html">GALLERY</a></li>
        <li><a class="nav-link" href="reviews.html">REVIEWS</a></li>
        <li><a class="nav-link nav-cta" href="index.html#contact">CONNECT</a></li>
      </ul>
    </div>
  </nav>`;

  function supportsReducedMotion(){
    try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch(e){ return false; }
  }

  function mountNav(){
    // If the page already has a site navbar (legacy `.navbar`), reuse it
    const existing = document.querySelector('.navbar');
    if (existing) {
      existing.setAttribute('role','navigation');
      existing.setAttribute('aria-label','Main');
      highlightActive(existing);
      bindNav(existing);
      return;
    }

    if (document.querySelector('.site-nav')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = NAV_HTML;
    const nav = wrap.firstElementChild;
    document.body.prepend(nav);
    document.body.classList.add('has-site-nav');
    highlightActive(nav);
    bindNav(nav);
  }

  function highlightActive(nav){
    const links = nav.querySelectorAll('a');
    const path = location.pathname.split('/').pop().toLowerCase() || 'index.html';
    links.forEach(a => {
      const href = a.getAttribute('href').split('#')[0].split('/').pop().toLowerCase();
      if (!href) return;
      if (href === path || (href === 'index.html' && (path === '' || path === 'index.html')) ) a.classList.add('active');
    });
  }

  function bindNav(nav){
    // Delegate clicks for same-origin links to animate out, then navigate
    nav.addEventListener('click', (ev) => {
      const a = ev.target.closest('a');
      if (!a) return;
      const href = a.href;
      if (!href || a.target === '_blank') return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return; // external

      // if it's the same location/hash, let default behavior
      if (url.href === location.href) return;

      ev.preventDefault();
      if (supportsReducedMotion()) { location.href = url.href; return; }

      // animate fade out, then navigate
      document.documentElement.classList.add('page-exit');
      setTimeout(() => location.href = url.href, 260);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountNav);
  else mountNav();
})();
