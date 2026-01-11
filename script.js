/* This JS has been written with the help of the Gemini AI LLM */
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================
       PART 1: DYNAMIC FAVICON (The Fix)
       ========================================================== */
    const updateFavicon = () => {
        // Look for the specific link tag with id="dynamic-favicon"
        const favicon = document.getElementById('dynamic-favicon');
        
        // If the tag isn't in the HTML (e.g. on an old page version), stop here.
        if (!favicon) return;

        // Check if user is in Dark Mode
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Dark Mode = Use White Icon (to contrast with dark tab)
        // Light Mode = Use Black Icon
        const folder = isDark ? 'obford-white-favicon' : 'obford-black-favicon';
        
        // Update the path. 
        // NOTE: Ensure your folder structure matches: assets/Logo/obford-black-favicon/
        favicon.href = `assets/Logo/${folder}/favicon-32x32.png`;
    };

    // Run immediately on load to set the correct icon
    updateFavicon();

    // Listen for system changes (e.g., if user toggles OS theme while reading)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);


    /* ==========================================================
       PART 2: SHARED UTILITIES
       ========================================================== */
    
    // Reveal Animation (Used on both pages if class 'reveal' exists)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        revealElements.forEach(el => observer.observe(el));
    }


    /* ==========================================================
       PART 3: LANDING PAGE LOGIC (index.html)
       Only runs if .mode-scroll is detected on body
       ========================================================== */
    
    if (document.body.classList.contains('mode-scroll')) {
        
        // Handle Arrow Clicks for Smooth Scrolling
        document.querySelectorAll('.arrow').forEach(arrow => {
            arrow.addEventListener('click', () => {
                const target = arrow.getAttribute('data-scroll');
                const targetEl = document.querySelector(target);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }


    /* ==========================================================
       PART 4: PROFILE APP LOGIC (about.html)
       Only runs if .mode-app is detected on body
       ========================================================== */

    if (document.body.classList.contains('mode-app')) {

        // --- CONFIGURATION: Define your views here ---
        const pageConfig = {
            'home': {
                topLeft: { text: 'Career', target: 'career-current' },
                topRight: { text: 'Projects', target: 'projects' } 
            },
            'career-current': {
                topLeft: { text: 'Return Home', target: 'home' },
                topRight: { text: 'Experience', target: 'career-history' }
            },
            'career-history': {
                topLeft: { text: 'Return Home', target: 'home' },
                topRight: { text: 'Current Role', target: 'career-current' }
            },
            // Placeholder for projects page
            'projects': {
                 topLeft: { text: 'Return Home', target: 'home' },
                 topRight: { text: '', target: '' } 
            }
        };

        let isAnimating = false;

        // Function to switch views
        window.showView = function(viewId) {
            if (isAnimating) return; 
            
            const currentView = document.querySelector('.view.active');
            const nextView = document.getElementById(viewId);

            if (!nextView) {
                console.warn(`View ID "${viewId}" not found in HTML.`);
                return;
            }
            if (currentView === nextView) return;

            isAnimating = true;

            // 1. Fade Out Current
            if (currentView) {
                currentView.classList.remove('active');
            }

            // 2. Wait for fade out (500ms), then swap
            setTimeout(() => {
                updateNav(viewId);
                nextView.classList.add('active');
                
                // Unlock after fade-in completes
                setTimeout(() => { isAnimating = false; }, 500);
            }, 500);
        };

        // Function to update corner text
        function updateNav(viewId) {
            const config = pageConfig[viewId];
            if (!config) return;

            const setLink = (elementId, data) => {
              const link = document.getElementById(elementId);
              if (!link) return;

              if (data && data.text) {
                  link.textContent = data.text;
                  link.style.display = 'block'; 
                  link.onclick = (e) => {
                      e.preventDefault();
                      showView(data.target);
                  };

                  // --- PULSE ANIMATION TRIGGER ---
                  link.classList.remove('updated'); // Reset class
                  void link.offsetWidth; // Force Reflow (Magic trick to restart CSS animation)
                  link.classList.add('updated'); // Apply class

              } else {
                  link.textContent = ''; 
                  link.style.display = 'none'; 
                  link.onclick = null;
              }
            };

            setLink('tl-link', config.topLeft);
            setLink('tr-link', config.topRight);
        }

        // Initialize: Set Home state
        updateNav('home');
    }

});