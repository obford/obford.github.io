/* Obford Site Interactions */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle && navList){
  navToggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, {threshold:.15});
reveals.forEach(el => io.observe(el));

// Basic demo contact handler
function submitContact(e){
  e.preventDefault();
  const form = e.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  console.log('Contact form payload:', data);
  alert('Thanks! Your message has been captured in the console for this static demo. Replace submitContact() with your backend endpoint.');
  form.reset();
  return false;
}
