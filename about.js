document.addEventListener('DOMContentLoaded', () => {

    /* Nav background on scroll */
    const nav = document.querySelector('.top-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* -------------------------------------------------------
       SECTION TOGGLE
       Wires up every .section-toggle button on the page.
       Works for any section — no hardcoded IDs.
    ------------------------------------------------------- */
    document.querySelectorAll('.section-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            const targetId   = btn.getAttribute('aria-controls');
            const content    = document.getElementById(targetId);
            const label      = btn.querySelector('.toggle-label');

            if (!content) return;

            if (isExpanded) {
                btn.setAttribute('aria-expanded', 'false');
                content.classList.add('is-collapsed');
                if (label) label.textContent = 'show';
            } else {
                btn.setAttribute('aria-expanded', 'true');
                content.classList.remove('is-collapsed');
                if (label) label.textContent = 'hide';
            }
        });
    });

    /* -------------------------------------------------------
       SCROLL REVEAL
    ------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
        '.hero-inner, .canvas-inner'
    );

    if (revealTargets.length > 0) {
        revealTargets.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${i * 0.04}s`;
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealTargets.forEach(el => observer.observe(el));
    }

});
