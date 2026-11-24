'use strict';

const $ = (id) => document.getElementById(id);
const RELATIONSHIP_START = new Date('2023-06-04T23:00:00+04:30');
const BIRTH_START = new Date('1999-11-24T10:50:00+03:30');
const music = $('backgroundMusic');
const fa = (value) => new Intl.NumberFormat('fa-IR').format(value);

function updateTimers() {
  const now = new Date();
  const rel = Math.max(0, now - RELATIONSHIP_START);
  const relDays = Math.floor(rel / 86400000);
  const relHours = Math.floor(rel / 3600000) % 24;
  const relMinutes = Math.floor(rel / 60000) % 60;
  const relSeconds = Math.floor(rel / 1000) % 60;

  if ($('relDays')) $('relDays').textContent = fa(relDays);
  if ($('relHours')) $('relHours').textContent = fa(relHours);
  if ($('relMinutes')) $('relMinutes').textContent = fa(relMinutes);
  if ($('relSeconds')) $('relSeconds').textContent = fa(relSeconds);

  const age = Math.max(0, now - BIRTH_START);
  if ($('birthDays')) $('birthDays').textContent = fa(Math.floor(age / 86400000));

  if ($('birthClock')) {
    $('birthClock').textContent = [
      Math.floor(age / 3600000) % 24,
      Math.floor(age / 60000) % 60,
      Math.floor(age / 1000) % 60
    ].map(fa).join(' : ');
  }
}

updateTimers();
setInterval(updateTimers, 1000);

function makeStars() {
  const layer = $('stars');
  if (!layer) return;

  for (let i = 0; i < 100; i++) {
    const star = document.createElement('i');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    star.style.opacity = `${.25 + Math.random() * .75}`;
    layer.appendChild(star);
  }
}

makeStars();

const revealObserver = new IntersectionObserver((entries) => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}), { threshold: .08 });

document.querySelectorAll('.reveal,.story-card').forEach(el => revealObserver.observe(el));

function grandBurst() {
  const layer = $('burst');
  if (!layer) return;

  const icons = ['💗','♡','✨','🌸','💕','✦'];

  for (let i = 0; i < 22; i++) {
    const item = document.createElement('span');
    item.className = 'burst-item';
    item.textContent = icons[i % icons.length];
    item.style.left = `${Math.random() * 100}%`;
    item.style.top = `${35 + Math.random() * 50}%`;
    layer.appendChild(item);
    setTimeout(() => item.remove(), 3200);
  }
}

// Music
async function startMusic() {
  if (!music) return false;

  try {
    await music.play();

    if ($('musicToggle')) $('musicToggle').textContent = 'Ⅱ';
    if ($('musicLabel')) $('musicLabel').textContent = 'در حال پخش موسیقی';

    return true;
  } catch {
    if ($('musicLabel')) {
      $('musicLabel').textContent = 'برای پخش، دکمه‌ی موسیقی را لمس کن';
    }
    return false;
  }
}

if ($('musicToggle')) {
  $('musicToggle').addEventListener('click', async () => {
    if (!music) return;

    if (music.paused) {
      await startMusic();
    } else {
      music.pause();
      $('musicToggle').textContent = '♫';
      $('musicLabel').textContent = 'پیدام کن — یونس بیات';
    }
  });
}

// Envelope and letter modal
const envelope = $('openEnvelope');
const modal = $('letterModal');
const paper = document.querySelector('.letter-paper');
const backdrop = $('modalBackdrop');

let opened = false;
let closing = false;

function showLetter() {
  if (!modal) return;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function resetEnvelope() {
  if (envelope) envelope.classList.remove('opened');
  opened = false;
  closing = false;
}

function closeLetter() {
  if (!modal || closing || !modal.classList.contains('show')) return;

  closing = true;

  if (paper && envelope) {
    const a = paper.getBoundingClientRect();
    const b = envelope.getBoundingClientRect();

    paper.style.setProperty(
      '--return-x',
      `${b.left + b.width/2 - (a.left + a.width/2)}px`
    );

    paper.style.setProperty(
      '--return-y',
      `${b.top + b.height/2 - (a.top + a.height/2)}px`
    );

    paper.classList.add('returning');
  }

  if (backdrop) backdrop.classList.add('fading');

  setTimeout(() => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (paper) {
      paper.classList.remove('returning');
      paper.style.removeProperty('--return-x');
      paper.style.removeProperty('--return-y');
    }

    if (backdrop) backdrop.classList.remove('fading');

    resetEnvelope();
  }, 750);
}

if (envelope) {
  envelope.addEventListener('click', () => {
    if (opened || closing) return;

    opened = true;
    envelope.classList.add('opened');

    startMusic();
    grandBurst();

    setTimeout(showLetter, 1150);
  });
}

if ($('closeLetter')) {
  $('closeLetter').addEventListener('click', closeLetter);
}

if (backdrop) {
  backdrop.addEventListener('click', closeLetter);
}

if (paper) {
  paper.addEventListener('click', e => {
    if (e.target === paper) closeLetter();
  });
}

if ($('finishLetter')) {
  $('finishLetter').addEventListener('click', () => {
    closeLetter();

    setTimeout(() => {
      $('finalScreen')?.classList.add('show');
      $('finalScreen')?.setAttribute('aria-hidden', 'false');
      grandBurst();
    }, 820);
  });
}

if ($('backToPage')) {
  $('backToPage').addEventListener('click', () => {
    $('finalScreen')?.classList.remove('show');
    $('finalScreen')?.setAttribute('aria-hidden', 'true');
    $('gallerySection')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// Photo gallery
const gallery = $('gallery');

if (gallery && Array.isArray(window.PARINAZ_PHOTOS) && window.PARINAZ_PHOTOS.length) {
  gallery.innerHTML = '';

  window.PARINAZ_PHOTOS.forEach((photo, index) => {
    const card = document.createElement('figure');
    card.className = 'photo-card reveal';

    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt || `خاطره ${index + 1}`;
    img.loading = 'lazy';

    const caption = document.createElement('figcaption');
    caption.textContent = photo.caption || 'یک خاطره‌ی دوست‌داشتنی';

    card.append(img, caption);
    gallery.appendChild(card);
    revealObserver.observe(card);
  });
}

// Welcome Intro
const welcomeScreen = $('welcomeScreen');
const welcomeButton = $('welcomeButton');

if (welcomeScreen && welcomeButton) {
  welcomeButton.addEventListener('click', () => {
    if (welcomeScreen.classList.contains('leaving')) return;

    welcomeButton.disabled = true;

    // شروع موسیقی
    startMusic();

    // آزاد کردن اسکرول صفحه
    document.body.classList.remove('intro-locked');

    // محو شدن صفحه خوشامدگویی
    welcomeScreen.classList.add('leaving');

    setTimeout(() => {
      welcomeScreen.remove();
    }, 2900);
  });
}

// Daily message
const dailyNotes = [
  'امروز هم یک دلیل تازه دارم که از بودنت خوشحال باشم. ❤️',
  'پریناز، امیدوارم امروز حتی یک لبخند کوچیک مهمون دلت بشه.',
  'لازم نیست روزت بی‌نقص باشه؛ همین که خودت باشی قشنگه.',
  'اگر امروز خسته‌ای، یادت باشه که برای من همیشه عزیزی.',
  'از بین تمام اتفاق‌های دنیا، آشنایی با تو هنوز یکی از محبوب‌ترین‌هاست.',
  'یک روزی فاصله‌ها فقط بخشی از خاطره‌هامون می‌شن. 🌙',
  'امروز هم از ته قلبم آرزو می‌کنم به چیزهایی که دوست داری برسی.'
];

const todayKey = new Date().toLocaleDateString('en-CA');

if ($('dailyMessage')) {
  $('dailyMessage').textContent =
    dailyNotes[Math.floor(new Date(todayKey).getTime() / 86400000) % dailyNotes.length];
}

// Virtual hug
$('hugButton')?.addEventListener('click', () => {
  $('hugResult').textContent =
    'یه بغل محکم و طولانی از طرف من برای تو... 🫂❤️ چشم‌هات رو ببند و تصور کن هیچ فاصله‌ای بینمون نیست.';

  grandBurst();
});

// Comfort letters
const comfortTexts = {
  sad: 'پریناز قشنگم، لازم نیست همیشه قوی باشی یا وانمود کنی حالت خوبه. حق داری بعضی روزها خسته و دلگیر باشی. امیدوارم این روز زودتر بگذره؛ من همین خود واقعی‌ات رو دوست دارم. ❤️',

  miss: 'اگه دلتنگی، بدون که منم گاهی به لحظه‌ای فکر می‌کنم که فاصله‌ای بینمون نباشه. تا اون روز، این چند خط رو مثل یک آغوش از راه دور نگه دار.',

  alone: 'حتی اگر الان کنار هم نیستیم، این به معنی بی‌اهمیت بودن تو نیست. تو برای من عزیزی و حضورت در زندگی‌ام ارزش داره.',

  doubt: 'لازم نیست همه‌چیز رو بلد باشی یا همیشه بهترین نسخه‌ی خودت باشی. تو با تمام نقص‌ها، ترس‌ها و توانایی‌هات ارزشمندی. به خودت فرصت بده.',

  love: 'دوستت دارم؛ نه فقط برای لبخندت یا روزهای خوبت. برای خودت، برای دنیای رنگی و خاصت، و برای تمام چیزهایی که تو رو پریناز می‌کنن. ❤️'
};

document.querySelectorAll('[data-letter]').forEach(btn => {
  btn.addEventListener('click', () => {
    $('comfortLetter').textContent = comfortTexts[btn.dataset.letter];
  });
});

// Love wheel
const wheelLines = [
  'امروز هم انتخابت می‌کنم. ❤️',
  'یه بغل محکم طلبت! 🫂',
  'لبخندت از دور هم قشنگه.',
  'تو یکی از اتفاق‌های خوب زندگی منی.',
  'به خودت افتخار کن، پریناز. ✨',
  'دلم می‌خواد زودتر ببینمت.'
];

$('spinWheel')?.addEventListener('click', () => {
  const wheel = $('loveWheel');

  wheel.classList.remove('spinning');
  void wheel.offsetWidth;
  wheel.classList.add('spinning');

  $('wheelResult').textContent =
    wheelLines[Math.floor(Math.random() * wheelLines.length)];
});

// Memory box
$('memoryBoxButton')?.addEventListener('click', () => {
  const box = $('memoryBoxButton');
  const contents = $('memoryBoxContents');

  const isOpen = box.classList.toggle('open');

  box.setAttribute('aria-expanded', String(isOpen));
  contents.hidden = !isOpen;

  if (isOpen) markExplored('memories');
});

document.querySelectorAll('.memory-card').forEach(card => {
  card.addEventListener('click', () => {
    $('memoryDetail').textContent = card.dataset.memory;
  });
});

// Time capsule
const CAPSULE_KEY = 'parinaz_time_capsules_v1';

function getCapsules() {
  try {
    return JSON.parse(localStorage.getItem(CAPSULE_KEY) || '[]');
  } catch {
    return [];
  }
}

function renderCapsules() {
  const list = $('capsuleList');
  if (!list) return;

  list.innerHTML = '';

  getCapsules().forEach(item => {
    const el = document.createElement('div');
    el.className = 'capsule-item';

    const title = document.createElement('b');
    title.textContent = `نامه برای تولد ${fa(item.year)}`;

    const body = document.createElement('p');
    body.textContent = item.text;

    el.append(title, body);
    list.appendChild(el);
  });
}

$('saveCapsule')?.addEventListener('click', () => {
  const year = Number($('capsuleYear').value);
  const text = $('capsuleText').value.trim();

  if (!Number.isInteger(year) || year < 2027 || year > 2100 || !text) {
    $('capsuleStatus').textContent = 'لطفاً یک سال معتبر و متن نامه رو وارد کن.';
    return;
  }

  const items = getCapsules();

  items.push({
    year,
    text,
    createdAt: new Date().toISOString()
  });

  localStorage.setItem(CAPSULE_KEY, JSON.stringify(items));

  $('capsuleText').value = '';
  $('capsuleStatus').textContent =
    'نامه‌ات مهر و موم شد و روی همین مرورگر ذخیره شد. 💌';

  renderCapsules();
  markExplored('time-capsule');
});

renderCapsules();

// Star memories
document.querySelectorAll('#memorySky button').forEach(btn => {
  btn.addEventListener('click', () => {
    $('starMessage').textContent = btn.dataset.star;
    markExplored('night-sky');
  });
});

// Ten-heart hunt
const heartField = $('heartField');
let foundHearts = 0;

if (heartField) {
  for (let i = 0; i < 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'hunt-heart';
    btn.textContent = '♡';
    btn.setAttribute('aria-label', `قلب شماره ${i + 1}`);

    btn.addEventListener('click', () => {
      if (btn.classList.contains('found')) return;

      btn.classList.add('found');
      btn.textContent = '♥';

      foundHearts++;

      $('heartCount').textContent = `${fa(foundHearts)} از ۱۰ قلب`;
      $('heartProgress').style.width = `${foundHearts * 10}%`;

      if (foundHearts === 10) {
        $('secretHeartMessage').hidden = false;
        grandBurst();
        markExplored('heart-hunt');
      }
    });

    heartField.appendChild(btn);
  }
}

// Hidden heart messages
document.querySelectorAll('.hidden-heart').forEach(btn => {
  btn.addEventListener('click', () => {
    $('hiddenHeartMessage').textContent = btn.dataset.hidden;
    btn.textContent = '♥';
    markExplored('hidden-notes');
  });
});

// Choose a memory
const choiceTexts = {
  'شروع': '۱۴ خرداد ۱۴۰۲، ساعت ۲۳:۰۰؛ از همون شب، یک قصه‌ی تازه به زندگی من اضافه شد. 🌙',

  'دلتنگی': 'دلتنگی همیشه آسون نیست، اما یادآوری می‌کنه یک نفر چقدر برامون مهمه. ❤️',

  'آینده': 'امیدوارم آینده برامون پر از دیدارهای واقعی، خنده‌های بلند و خاطره‌های تازه باشه. ✨'
};

document.querySelectorAll('[data-memory-choice]').forEach(btn => {
  btn.addEventListener('click', () => {
    $('chosenMemory').textContent = choiceTexts[btn.dataset.memoryChoice];
    markExplored('choose-memory');
  });
});

// Cinematic gallery
let cinemaTimer = null;

$('cinemaPlay')?.addEventListener('click', () => {
  const overlay = $('cinemaOverlay');
  const slides = $('cinemaSlides');

  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');
  slides.innerHTML = '';

  const photos = Array.isArray(window.PARINAZ_PHOTOS)
    ? window.PARINAZ_PHOTOS
    : [];

  if (!photos.length) {
    slides.innerHTML =
      '<div class="cinema-caption">هنوز عکسی اضافه نشده؛ وقتی عکس‌ها رو در photos.js قرار بدی، این نمایش با عکس‌های خودتون اجرا می‌شه. ❤️</div>';
  } else {
    let i = 0;

    const show = () => {
      const photo = photos[i % photos.length];

      slides.innerHTML = '';

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt || 'خاطره';

      const cap = document.createElement('div');
      cap.className = 'cinema-caption';
      cap.textContent = photo.caption || 'یک قاب از قصه‌ی ما';

      slides.append(img, cap);
      i++;
    };

    show();
    cinemaTimer = setInterval(show, 3200);
  }

  markExplored('cinema-gallery');
});

function closeCinema() {
  $('cinemaOverlay')?.classList.remove('show');
  $('cinemaOverlay')?.setAttribute('aria-hidden', 'true');
  clearInterval(cinemaTimer);
}

$('closeCinema')?.addEventListener('click', closeCinema);

// Mouse parallax
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    const x = (e.clientX / innerWidth - .5) * 12;
    const y = (e.clientY / innerHeight - .5) * 12;

    const moon = document.querySelector('.moon');

    if (moon) {
      moon.style.transform = `translate(${x}px,${y}px)`;
    }

    const stars = $('stars');

    if (stars) {
      stars.style.transform = `translate(${-x * .35}px,${-y * .35}px)`;
    }
  }, { passive: true });
}

// Falling cherry-blossom petals
const petalsLayer = $('petals');

function makePetal() {
  if (!petalsLayer || document.hidden) return;

  const petal = document.createElement('span');

  petal.className = 'sakura-petal';
  petal.textContent = Math.random() > .5 ? '✿' : '❀';

  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.fontSize = `${10 + Math.random() * 13}px`;
  petal.style.animationDuration = `${7 + Math.random() * 7}s`;

  petal.style.setProperty(
    '--drift',
    `${-90 + Math.random() * 180}px`
  );

  petalsLayer.appendChild(petal);
  setTimeout(() => petal.remove(), 15000);
}

setInterval(makePetal, 850);

// Extra hidden hearts
const floatingMessages = [
  'یک قلب کوچیک فقط برای تو. ❤️',
  'تو دلیل لبخندهای بی‌خبر منی.',
  'این گوشه هم دوستت دارم!',
  'پریناز، یادت نره چقدر عزیزی.'
];

for (let i = 0; i < 7; i++) {
  const heart = document.createElement('button');

  heart.className = 'floating-hidden-heart';
  heart.textContent = '♡';
  heart.setAttribute('aria-label', 'پیام مخفی');

  heart.style.left = `${8 + Math.random() * 84}%`;
  heart.style.top = `${18 + Math.random() * 75}%`;
  heart.style.background = 'transparent';
  heart.style.border = '0';
  heart.style.padding = '8px';

  heart.addEventListener('click', () => {
    const note = document.createElement('div');

    note.className = 'floating-note';
    note.textContent = floatingMessages[i % floatingMessages.length];

    document.body.appendChild(note);

    setTimeout(() => note.remove(), 3200);

    heart.classList.add('used');
    markExplored('hidden-notes');
  });

  document.body.appendChild(heart);
}

// Exploration tracker
const EXPLORE_KEY = 'parinaz_explored_v1';

const exploreIds = [
  'memories',
  'time-capsule',
  'night-sky',
  'heart-hunt',
  'hidden-notes',
  'explore-memories',
  'cinema-gallery',
  'feelings'];

let explored = new Set();

try {
  explored = new Set(
    JSON.parse(localStorage.getItem(EXPLORE_KEY) || '[]')
  );
} catch {}

function updateExploreUI() {
  const count = exploreIds.filter(id => explored.has(id)).length;

  if ($('exploreCount')) {
    $('exploreCount').textContent = `${fa(count)} از ۸ بخش کشف شده`;
  }

  if ($('exploreProgress')) {
    $('exploreProgress').style.width =
      `${count / exploreIds.length * 100}%`;
  }

  const button = $('unlockSecret');

  if (button) {
    button.disabled = count < exploreIds.length;

    $('secretGate')?.classList.toggle(
      'unlocked',
      count === exploreIds.length
    );
  }
}

function markExplored(id) {
  if (!exploreIds.includes(id)) return;

  explored.add(id);

  localStorage.setItem(
    EXPLORE_KEY,
    JSON.stringify([...explored])
  );

  updateExploreUI();
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (
      entry.isIntersecting &&
      exploreIds.includes(entry.target.id)
    ) {
      markExplored(entry.target.id);
    }
  });
}, { threshold: .25 });

exploreIds.forEach(id => {
  const el = $(id);
  if (el) sectionObserver.observe(el);
});

$('unlockSecret')?.addEventListener('click', () => {
  if (explored.size >= exploreIds.length) {
    $('secretEnding')?.classList.add('show');
    $('secretEnding')?.setAttribute('aria-hidden', 'false');
    grandBurst();
  }
});

$('closeSecret')?.addEventListener('click', () => {
  $('secretEnding')?.classList.remove('show');
  $('secretEnding')?.setAttribute('aria-hidden', 'true');
});

updateExploreUI();

// Keyboard accessibility
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCinema();

    $('secretEnding')?.classList.remove('show');

    if (modal?.classList.contains('show')) {
      closeLetter();
    }
  }
});
// Virtual Hug Animation
(() => {
  const scene = document.getElementById('hugScene');
  const stage = document.querySelector('.hug-stage');
  const start = document.getElementById('startHug');
  const again = document.getElementById('hugAgain');
  const caption = document.getElementById('hugCaption');

  if (!scene || !stage || !start || !again || !caption) return;

  let hugTimer;
  let separationTimer;

  function playHug() {
    clearTimeout(hugTimer);
    clearTimeout(separationTimer);

    scene.classList.remove('is-hugging');
    stage.classList.remove('is-finished');

    start.hidden = false;
    again.hidden = true;

    caption.textContent = 'دارم میام تا محکم بغلت کنم...';

    void scene.offsetWidth;

    setTimeout(() => {
      scene.classList.add('is-hugging');

      hugTimer = setTimeout(() => {
        stage.classList.add('is-finished');
        caption.textContent = 'کاش همین الان واقعاً کنارم بودی...';

        start.hidden = true;
        again.hidden = false;

        // بعد از پایان آغوش، شخصیت‌ها از هم جدا می‌شوند
        separationTimer = setTimeout(() => {
          scene.classList.remove('is-hugging');
        }, 1800);

      }, 2200);
    }, 100);
  }

  start.addEventListener('click', playHug);
  again.addEventListener('click', playHug);
})();