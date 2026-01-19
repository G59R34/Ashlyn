// gallery.js — lightweight accessible lightbox and slideshow
(function(){
	function init(){
		const items = Array.from(document.querySelectorAll('.gallery-item'));
		const lb = document.getElementById('lightbox');
		if (!lb || !items.length) return;

		const lbImg = lb.querySelector('.lb-img');
		const lbClose = lb.querySelector('.lb-close');
		const lbPrev = lb.querySelector('.lb-prev');
		const lbNext = lb.querySelector('.lb-next');
		const lbCaption = lb.querySelector('.lb-caption');

		const sources = items.map(btn => ({ src: btn.dataset.src, alt: (btn.querySelector('img')||{}).alt || '' }));
		let current = 0;
		let autoplayTimer = null;
		const AUTOPLAY_MS = 4000;

		function show(index){
			current = (index + sources.length) % sources.length;
			lbImg.style.opacity = 0;
			lbImg.onload = () => {
				lbCaption.textContent = sources[current].alt || '';
				requestAnimationFrame(() => { lbImg.style.opacity = 1; });
			};
			lbImg.src = sources[current].src;
			lbImg.alt = sources[current].alt || '';
		}

		function open(index){
			lb.classList.add('open');
			lb.setAttribute('aria-hidden','false');
			document.body.style.overflow = 'hidden';
			show(index);
			startAutoplay();
			lbClose.focus();
		}

		function close(){
			lb.classList.remove('open');
			lb.setAttribute('aria-hidden','true');
			document.body.style.overflow = '';
			stopAutoplay();
		}

		function prev(){ show(current - 1); restartAutoplay(); }
		function next(){ show(current + 1); restartAutoplay(); }

		function startAutoplay(){ stopAutoplay(); autoplayTimer = setInterval(()=> next(), AUTOPLAY_MS); }
		function stopAutoplay(){ if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
		function restartAutoplay(){ stopAutoplay(); startAutoplay(); }

		items.forEach((btn, i) => {
			btn.addEventListener('click', () => open(i));
			btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
		});

		lbClose.addEventListener('click', close);
		if (lbPrev) lbPrev.addEventListener('click', prev);
		if (lbNext) lbNext.addEventListener('click', next);

		lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
		lb.addEventListener('mouseenter', stopAutoplay);
		lb.addEventListener('mouseleave', startAutoplay);
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') close();
			if (e.key === 'ArrowLeft') prev();
			if (e.key === 'ArrowRight') next();
		});
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
	else init();
})();

