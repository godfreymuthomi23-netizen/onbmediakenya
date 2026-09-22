const revealItems = document.querySelectorAll('[data-reveal]');
const sections = document.querySelectorAll('main section[id]');
const navigationLinks = document.querySelectorAll('nav a[href^="#"]');
const eatClock = document.querySelector('[data-eat-clock]');

const updateEatClock = () => {
  if (!eatClock) return;
  const now = new Date();
  eatClock.textContent = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now);
  eatClock.dateTime = now.toISOString();
};

updateEatClock();
window.setInterval(updateEatClock, 1000);

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

revealItems.forEach(item => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach(link => {
      link.toggleAttribute('aria-current', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = card.getBoundingClientRect();
    const rotateX = ((event.clientY - bounds.top) / bounds.height - .5) * -5;
    const rotateY = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

const videoFrame = document.querySelector('[data-video-frame]');
const videoEmbed = videoFrame?.querySelector('.video-embed');

const sendVideoCommand = command => {
  videoEmbed?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: command, args: [] }), '*');
};

const requestVideoQuality = () => {
  videoEmbed?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['hd1080'] }), '*');
};

if (videoFrame && videoEmbed) {
  videoEmbed.addEventListener('load', () => {
    sendVideoCommand('mute');
    requestVideoQuality();
  });
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => sendVideoCommand(entry.isIntersecting ? 'playVideo' : 'pauseVideo'));
  }, { threshold: 0.45, rootMargin: '180px 0px' });
  videoObserver.observe(videoFrame);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    navigationLinks.forEach(navLink => navLink.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'page');
  });
});

console.log('ONB Media initialized.');
