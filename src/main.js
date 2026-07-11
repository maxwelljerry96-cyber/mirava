import './styles.css';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const header = $('.site-header');
const progress = $('.scroll-progress span');
const menuToggle = $('.menu-toggle');
const nav = $('.main-nav');
const cartDrawer = $('.cart-drawer');
const cartButton = $('.cart-button');
const cartClose = $('.cart-close');
const cartItemsEl = $('.cart-items');
const cartTotalEl = $('.cart-total');
const cartCountEl = $('.cart-count');
const toast = $('.toast');
const productTrack = $('.product-track');
const cart = [];

function onScroll() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
  progress.style.width = `${pct}%`;
  header.classList.toggle('scrolled', scrollTop > 16);

  const heroVisual = $('.hero-visual');
  if (heroVisual && scrollTop < window.innerHeight * 1.2 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const y = Math.min(scrollTop * 0.08, 42);
    heroVisual.style.transform = `translate3d(0, ${y}px, 0)`;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px' });
$$('.reveal-up, .reveal-left, .reveal-right').forEach((el) => revealObserver.observe(el));

menuToggle?.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
$$('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

function addDroplets() {
  const holder = $('.droplets');
  if (!holder) return;
  const positions = [
    [17, 13, 13], [31, 8, 9], [71, 9, 12], [86, 23, 16], [12, 50, 10],
    [92, 49, 8], [22, 76, 14], [76, 79, 9], [58, 5, 7], [45, 82, 11]
  ];
  positions.forEach(([x, y, s], i) => {
    const d = document.createElement('span');
    d.className = 'droplet';
    d.style.left = `${x}%`;
    d.style.top = `${y}%`;
    d.style.width = `${s}px`;
    d.style.height = `${s}px`;
    d.style.setProperty('--duration', `${3.4 + (i % 4) * .8}s`);
    d.style.setProperty('--delay', `${i * -.31}s`);
    d.style.setProperty('--dx', `${(i % 2 ? 1 : -1) * (7 + i)}px`);
    d.style.setProperty('--dy', `${-10 - (i % 5) * 5}px`);
    holder.appendChild(d);
  });
}
addDroplets();

const heroVisual = $('[data-parallax-root]');
if (heroVisual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroVisual.addEventListener('pointermove', (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    $('.hero-product', heroVisual).style.transform = `translate3d(${x * 12}px, ${y * 9}px, 0) rotate(${x * .7}deg)`;
    $$('.floating-fruit', heroVisual).forEach((fruit, index) => {
      const depth = (index + 1) * 8;
      fruit.style.marginLeft = `${x * depth}px`;
      fruit.style.marginTop = `${y * depth}px`;
    });
  });
  heroVisual.addEventListener('pointerleave', () => {
    $('.hero-product', heroVisual).style.transform = '';
    $$('.floating-fruit', heroVisual).forEach((fruit) => {
      fruit.style.marginLeft = '';
      fruit.style.marginTop = '';
    });
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cart-open');
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cart-open');
}
cartButton?.addEventListener('click', openCart);
cartClose?.addEventListener('click', closeCart);
cartDrawer?.addEventListener('click', (e) => { if (e.target === cartDrawer) closeCart(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });

const productImageMap = {
  'Mango Passion': '/assets/product-mango-passion.webp',
  'Berry Glow': '/assets/product-berry-glow.webp',
  'Lemon Yuzu': '/assets/product-lemon-yuzu.webp',
  'Lavender Lemon': '/assets/product-lavender-lemon.webp'
};

function renderCart() {
  cartCountEl.textContent = String(cart.length);
  cartCountEl.classList.toggle('has-items', cart.length > 0);
  cartItemsEl.innerHTML = '';
  if (!cart.length) {
    cartItemsEl.innerHTML = '<p class="empty-cart">Your bag is waiting for something juicy.</p>';
  } else {
    cart.forEach((item, index) => {
      const line = document.createElement('div');
      line.className = 'cart-line';
      line.innerHTML = `
        <img src="${productImageMap[item.name]}" alt="${item.name}">
        <div><h3>${item.name}</h3><p>Fruit Elixir · $${item.price.toFixed(2)}</p></div>
        <button class="remove-item" type="button" aria-label="Remove ${item.name}" data-index="${index}">×</button>`;
      cartItemsEl.appendChild(line);
    });
  }
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotalEl.textContent = `$${total.toFixed(2)}`;
  $$('.remove-item', cartItemsEl).forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.index), 1);
      renderCart();
      showToast('Item removed');
    });
  });
}
$$('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    cart.push({ name: card.dataset.product, price: Number(card.dataset.price) });
    renderCart();
    showToast(`${card.dataset.product} added to your bag`);
    button.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(.96)' },
      { transform: 'scale(1)' }
    ], { duration: 300, easing: 'ease-out' });
  });
});
renderCart();

$('.checkout-button')?.addEventListener('click', () => {
  showToast(cart.length ? 'Demo checkout ready for payment integration' : 'Your bag is empty');
});

$('.product-next')?.addEventListener('click', () => {
  productTrack.scrollBy({ left: productTrack.clientWidth * .78, behavior: 'smooth' });
});
$('.product-prev')?.addEventListener('click', () => {
  productTrack.scrollBy({ left: -productTrack.clientWidth * .78, behavior: 'smooth' });
});

$$('.product-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (window.innerWidth < 900) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-8px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

$('.newsletter-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('input', event.currentTarget);
  showToast(`Welcome to the fresh list, ${input.value}`);
  event.currentTarget.reset();
});

const sections = $$('main section[id]');
const navLinks = $$('.main-nav a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { threshold: .45 });
sections.forEach((section) => sectionObserver.observe(section));
