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

  /* ---------- forms: post to Formspree so every lead is logged ---------- */
  // Paste the Formspree form URL here (https://formspree.io/f/xxxxxxxx).
  // While it's blank, forms fall back to opening the visitor's email app.
  const FORM_ENDPOINT = '';
  const DEST_EMAIL = 'Xtreme.windows77@gmail.com';

  document.querySelectorAll('form[data-mailto]').forEach(form => {
    const status = form.querySelector('.form-status');
    const note = form.querySelector('.form-note');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (FORM_ENDPOINT && note) {
      note.textContent = "We'll follow up by email or phone, usually within one business day. Prefer to talk? Call 780-203-6289.";
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (FORM_ENDPOINT) {
        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        status.textContent = '';

        try {
          const body = new FormData(form);
          body.append('_subject', form.dataset.subject || 'Website enquiry');
          body.append('Source page', location.pathname.split('/').pop() || 'index.html');

          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            body,
            headers: { Accept: 'application/json' }
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          form.reset();
          status.textContent = "Thanks! Your request was sent. We'll be in touch soon.";
        } catch (err) {
          status.textContent = 'Sorry, that did not send. Please call 780-203-6289 or email ' + DEST_EMAIL + '.';
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
        return;
      }

      const data = new FormData(form);
      const subject = form.dataset.subject || 'Website enquiry';
      const lines = [];

      form.querySelectorAll('[name]:not([name="_gotcha"])').forEach(field => {
        const label = field.closest('.field')?.querySelector('label')?.textContent?.trim() || field.name;
        const value = data.get(field.name);
        if (value) lines.push(`${label}: ${value}`);
      });

      const body = lines.join('\n');
      const mailto = `mailto:${DEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      status.textContent = 'Opening your email app with these details filled in…';

      window.location.href = mailto;
    });
  });

});
