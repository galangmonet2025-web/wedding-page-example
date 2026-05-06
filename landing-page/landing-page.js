/* =============================================
   KUNDANGAN – main.js
============================================= */

// ---- NAV scroll ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ---- Reveal on scroll ----
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ---- Count-up stats ----
function countUp(el, target, duration = 1600) {
  const start = performance.now();
  const isFloat = target < 10;
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = Math.round(eased * target);
    el.textContent = val >= 1000 ? (val / 1000).toFixed(0) + 'k+' : val + (isFloat ? '' : target === 99 ? '%' : '+');
    if (progress < 1) requestAnimationFrame(update);
    else {
      if (target === 99) el.textContent = '99%';
      else if (target === 5) el.textContent = '5';
      else if (target === 50) el.textContent = '50+';
      else el.textContent = '10.000+';
    }
  };
  requestAnimationFrame(update);
}

const statsSection = document.querySelector('.stats');
let statsDone = false;
const statsIO = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsDone) {
    statsDone = true;
    document.querySelectorAll('.stat__num').forEach(el => {
      countUp(el, +el.dataset.target);
    });
  }
}, { threshold: 0.4 });
if (statsSection) statsIO.observe(statsSection);

// ---- Templates data ----
const templates = [
  { name: 'Ivory Bloom', cat: 'elegan', price: 'Rp 149k', colors: ['#F5EAE0', '#C9A96E', '#A0785A'], emoji: '🌸' },
  { name: 'Bismillah Gold', cat: 'islami', price: 'Rp 149k', colors: ['#1A1209', '#C9A96E', '#F5EAE0'], emoji: '☪️' },
  { name: 'Midnight Modern', cat: 'modern', price: 'Rp 149k', colors: ['#0D1117', '#6C9DFF', '#E8E8E8'], emoji: '✨' },
  { name: 'Rose Garden', cat: 'elegan', price: 'Rp 149k', colors: ['#FDE8E8', '#C97A7A', '#8B3030'], emoji: '🌹' },
  { name: 'Sacred Veil', cat: 'islami', price: 'Rp 149k', colors: ['#F0F4E8', '#6B8C4A', '#2D4A1E'], emoji: '🕌' },
  { name: 'Neon Luxe', cat: 'modern', price: 'Rp 149k', colors: ['#0A0A0F', '#FF6EC7', '#C9A96E'], emoji: '💎' },
  { name: 'Botanical Dream', cat: 'elegan', price: 'Rp 149k', colors: ['#EBF0E5', '#7A9E7E', '#3D5A42'], emoji: '🌿' },
  { name: 'Crescent Star', cat: 'islami', price: 'Rp 149k', colors: ['#1C2A4A', '#D4AF37', '#FAFAF0'], emoji: '🌙' },
];

function renderTemplates(cat) {
  const grid = document.getElementById('templatesGrid');
  grid.innerHTML = '';
  const filtered = cat === 'semua' ? templates : templates.filter(t => t.cat === cat);
  filtered.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="template-card__thumb" style="background:linear-gradient(135deg,${t.colors[0]},${t.colors[1]})">
        <div style="text-align:center;color:${t.colors[2]};text-shadow:0 1px 6px rgba(0,0,0,.3)">
          <div style="font-size:2rem;margin-bottom:.3rem">${t.emoji}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:1rem">${t.name}</div>
        </div>
      </div>
      <div class="template-card__body">
        <div class="template-card__name">${t.name}</div>
        <div class="template-card__cat">${t.cat}</div>
        <div class="template-card__price">${t.price}</div>
        <div class="template-card__actions">
          <a href="#demo" class="btn btn--outline">Preview</a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Tabs
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderTemplates(tab.dataset.cat);
  });
});
renderTemplates('semua');

// ---- FAQ accordion ----
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-item__q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ---- Countdown (demo section) ----
function updateDemoCountdown() {
  const target = new Date('2025-10-20T10:00:00');
  const now = new Date();
  const diff = target - now;
  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const el = document.getElementById('cdDay');
    if (el) el.textContent = days;
  }
}
updateDemoCountdown();
setInterval(updateDemoCountdown, 60000);

// ---- Smooth section fade on nav links ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- RSVP button interactivity in hero ----
document.querySelectorAll('.rsvp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.rsvp-btns').querySelectorAll('.rsvp-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ---- Urgency counter (fake real-time) ----
const urgencyEl = document.querySelector('.cta-closing__urgency');
if (urgencyEl) {
  let slots = 47;
  setInterval(() => {
    if (slots > 5 && Math.random() < 0.3) {
      slots -= 1;
      urgencyEl.innerHTML = `<span class="pulse-dot"></span> ${slots} dari 100 slot gratis tersisa`;
    }
  }, 12000);
}

// ---- WhatsApp Form Handler ----
const contactForm = document.getElementById('waContactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('waName').value;
    const packageSelected = document.getElementById('waPackage').value;
    const message = document.getElementById('waMessage').value;
    
    const waNumber = "6287873369841";
    const text = `Halo Kundangan! Saya ${name} tertarik dengan ${packageSelected}. \n\nPesan: ${message}`;
    const encodedText = encodeURIComponent(text);
    
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  });
}