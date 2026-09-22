const revealItems = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

revealItems.forEach(item => revealObserver.observe(item));

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('nav a').forEach(navLink => navLink.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'page');
  });
});

console.log('ONB Media initialized.');
