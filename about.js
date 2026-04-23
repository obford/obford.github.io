document.addEventListener('DOMContentLoaded', () => {

    /* -------------------------------------------------------
       PHOTO CORNERS
       Injects four corner spans into every .img-block so CSS
       can render scrapbook-style folded corner tabs.
    ------------------------------------------------------- */
    document.querySelectorAll('.img-block').forEach(block => {
        const img = block.querySelector('img');
        if (!img) return;

        // Wrap the img so tape strips can be absolutely positioned
        const wrap = document.createElement('div');
        wrap.className = 'img-wrap';
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);

        // Two tape strips: top-left corner and bottom-right corner
        ['tape-tl', 'tape-br'].forEach(pos => {
            const tape = document.createElement('span');
            tape.className = `img-tape ${pos}`;
            wrap.appendChild(tape);
        });
    });


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
       POLAROID TAPE
       Injects two tape strips into every .polaroid
    ------------------------------------------------------- */
    document.querySelectorAll('.polaroid').forEach(polaroid => {
        ['tape-tl', 'tape-br'].forEach(pos => {
            const tape = document.createElement('span');
            tape.className = `polaroid-tape ${pos}`;
            polaroid.appendChild(tape);
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
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealTargets.forEach(el => observer.observe(el));
    }

});
