// ============================================================
// Xtreme Window & Gutter Cleaning — shared behavior
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile nav ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const overlay = document.querySelector('.nav-overlay');

  if (menuBtn && overlay) {
    const closeMenu = () => {
      overlay.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    const openMenu = () => {
      overlay.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- scroll reveal (squeegee wipe + fade-up) ---------- */
  const revealEls = document.querySelectorAll('.wipe, .reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- forms: build a mailto so submissions land in the inbox ---------- */
  const DEST_EMAIL = 'Xtreme.windows77@gmail.com';

  document.querySelectorAll('form[data-mailto]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const subject = form.dataset.subject || 'Website enquiry';
      const lines = [];

      form.querySelectorAll('[name]').forEach(field => {
        const label = field.closest('.field')?.querySelector('label')?.textContent?.trim() || field.name;
        const value = data.get(field.name);
        if (value) lines.push(`${label}: ${value}`);
      });

      const body = lines.join('\n');
      const mailto = `mailto:${DEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Opening your email app with these details filled in…';
      }

      window.location.href = mailto;
    });
  });

});
