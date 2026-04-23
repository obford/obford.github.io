document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       FAVICON
       ========================================================== */
    const updateFavicon = () => {
        const favicon = document.getElementById('dynamic-favicon');
        if (!favicon) return;
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        favicon.href = `assets/Logo/${isDark ? 'obford-white-favicon' : 'obford-black-favicon'}/favicon-32x32.png`;
    };
    updateFavicon();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);


    /* ==========================================================
       SCROLL REVEAL
       ========================================================== */
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


    /* ==========================================================
       HEADER - border appears on scroll
       ========================================================== */
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }


    /* ==========================================================
       SMOOTH SCROLL - scroll cue button
       ========================================================== */
    document.querySelectorAll('[data-scroll]').forEach(el => {
        el.addEventListener('click', () => {
            const target = document.querySelector(el.getAttribute('data-scroll'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });


    /* ==========================================================
       EASTER EGG - double-click or long-press on OBFORD heading
       ========================================================== */
    const trigger = document.getElementById('easter-egg-trigger');

    if (trigger) {
        trigger.addEventListener('dblclick', activateEgg);

        let pressTimer = null;
        trigger.addEventListener('touchstart', () => {
            pressTimer = setTimeout(activateEgg, 600);
        }, { passive: true });
        trigger.addEventListener('touchend',  () => clearTimeout(pressTimer));
        trigger.addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });
    }

    function activateEgg() {
        const t = document.getElementById('easter-egg-trigger');
        if (!t) return;
        t.classList.add('egg-activated');
        t.addEventListener('animationend', () => {
            window.location.href = 'about.html';
        }, { once: true });
    }

});
