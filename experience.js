document.addEventListener('DOMContentLoaded', () => {

    /* Favicon */
    const updateFavicon = () => {
        const favicon = document.getElementById('dynamic-favicon');
        if (!favicon) return;
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        favicon.href = `assets/Logo/${isDark ? 'obford-white-favicon' : 'obford-black-favicon'}/favicon-32x32.png`;
    };
    updateFavicon();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);

    /* Header border on scroll */
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* Smooth scroll */
    document.querySelectorAll('[data-scroll]').forEach(el => {
        el.addEventListener('click', () => {
            const target = document.querySelector(el.getAttribute('data-scroll'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* Scroll reveal — uses is-visible to match styles.css */
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealEls.forEach(el => observer.observe(el));
    }

});
