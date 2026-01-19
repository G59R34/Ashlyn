// Page-specific interaction for mazda.html
(function(){
  function init() {
    const frame = document.getElementById('photo-frame');
    const img = frame ? frame.querySelector('.ashlyn-photo') : null;
    if (!frame || !img) return;

    // subtle parallax tilt based on pointer position
    frame.addEventListener('pointermove', (ev) => {
      const r = frame.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
      const py = (ev.clientY - r.top) / r.height - 0.5;
      const rotateY = px * 8; // degrees
      const rotateX = -py * 8;
      img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
    });

    // reset on leave
    frame.addEventListener('pointerleave', () => {
      img.style.transform = '';
    });

    // gentle reveal on load
    requestAnimationFrame(() => {
      img.style.opacity = 0;
      img.style.transition = 'opacity 420ms ease, transform 420ms ease';
      requestAnimationFrame(() => img.style.opacity = 1);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
