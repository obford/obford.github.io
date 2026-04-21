document.addEventListener('DOMContentLoaded', () => {

    /* Nav background on scroll */
    const nav = document.querySelector('.top-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* Scroll reveal */
    const revealTargets = document.querySelectorAll(
        '.timeline-item, .roadmap-block, .personal-body, .personal-title, .interests, .hero-inner'
    );

    if (revealTargets.length > 0) {
        revealTargets.forEach(el => el.classList.add('reveal'));

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${i * 0.06}s`;
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealTargets.forEach(el => observer.observe(el));
    }

});
