const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const loader = $('#loader');
const videos = $$('.motion-video');
const sceneSections = $$('.scene-section[data-scene]');
const siteHeader = $('#siteHeader');
const scrollProgress = $('#scrollProgress');
let activeScene = 0;

const safelyPlay = (video) => {
  if (!video) return;
  video.muted = true;
  const promise = video.play();
  if (promise?.catch) promise.catch(() => {});
};

const activateScene = (index) => {
  if (activeScene === index && videos[index]?.classList.contains('active')) return;
  activeScene = index;
  videos.forEach((video, i) => {
    const active = i === index;
    video.classList.toggle('active', active);
    if (active) {
      video.preload = 'auto';
      safelyPlay(video);
    } else {
      video.pause();
    }
  });
};

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(entry => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) activateScene(Number(visible.target.dataset.scene));
}, { threshold: [0.18, 0.35, 0.55, 0.75] });
sceneSections.forEach(section => observer.observe(section));

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => loader.classList.add('hidden'), 650);
  safelyPlay(videos[0]);
});

// Never leave the visitor trapped behind the loader if a remote video is slow.
setTimeout(() => loader.classList.add('hidden'), 2600);

window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.height = `${Math.min(100, (window.scrollY / max) * 100)}%`;
  siteHeader.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

const cursor = $('.cursor');
if (cursor && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  $$('a, button, input, .magnetic-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

const menuButton = $('#menuButton');
const mobileMenu = $('#mobileMenu');
const closeMenu = () => {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};
menuButton.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
$$('a', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));

const ingredientNote = $('#ingredientNote');
$$('.ingredient').forEach(button => {
  button.addEventListener('click', () => {
    $$('.ingredient').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    ingredientNote.animate([{opacity:0, transform:'translateY(6px)'},{opacity:1, transform:'none'}], {duration:350});
    ingredientNote.textContent = button.dataset.note;
  });
});

let selectedPack = { name: 'Single bottle', price: 24 };
$$('.pack').forEach(button => {
  button.addEventListener('click', () => {
    $$('.pack').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    selectedPack = { name: button.dataset.pack, price: Number(button.dataset.price) };
    $('#price').textContent = `$${selectedPack.price}`;
  });
});

const bagDrawer = $('#bagDrawer');
const drawerBackdrop = $('#drawerBackdrop');
const bagEmpty = $('#bagEmpty');
const bagItem = $('#bagItem');
const openBag = () => {
  bagDrawer.classList.add('open');
  bagDrawer.setAttribute('aria-hidden', 'false');
  drawerBackdrop.classList.add('show');
  document.body.classList.add('drawer-open');
};
const closeBag = () => {
  bagDrawer.classList.remove('open');
  bagDrawer.setAttribute('aria-hidden', 'true');
  drawerBackdrop.classList.remove('show');
  document.body.classList.remove('drawer-open');
};
$('#bagButton').addEventListener('click', openBag);
$('#closeBag').addEventListener('click', closeBag);
drawerBackdrop.addEventListener('click', closeBag);

$('#addButton').addEventListener('click', () => {
  $('#bagCount').textContent = '1';
  $('#bagPack').textContent = selectedPack.name;
  $('#bagPrice').textContent = `$${selectedPack.price}`;
  $('#bagTotal').textContent = `$${selectedPack.price}`;
  bagEmpty.hidden = true;
  bagItem.hidden = false;
  openBag();
});

$('#removeItem').addEventListener('click', () => {
  $('#bagCount').textContent = '0';
  $('#bagTotal').textContent = '$0';
  bagEmpty.hidden = false;
  bagItem.hidden = true;
});

$('#checkoutButton').addEventListener('click', () => {
  const button = $('#checkoutButton');
  const original = button.textContent;
  button.textContent = 'Demo only — no payment taken';
  setTimeout(() => button.textContent = original, 2200);
});

$('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = $('#email');
  $('#formMessage').textContent = `You’re on the list, ${email.value}.`;
  email.value = '';
});

// Lightweight parallax for the main product frame.
const heroCard = $('.hero-product-card');
window.addEventListener('scroll', () => {
  if (!heroCard || window.scrollY > window.innerHeight * 1.3) return;
  heroCard.style.transform = `translateY(${window.scrollY * .08}px) rotate(${1.5 - window.scrollY * .001}deg)`;
}, { passive: true });

// Reveal text blocks as they enter the viewport.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.animate([
      { opacity: 0, transform: 'translateY(28px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 850, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .15 });
$$('.manifesto-grid, .botanical-layout, .ritual-heading, .ritual-steps, .product-grid, .newsletter > *').forEach(el => {
  el.style.opacity = '0';
  revealObserver.observe(el);
});
