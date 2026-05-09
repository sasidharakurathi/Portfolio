
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;


if (window.matchMedia("(pointer: coarse)").matches) {
  cursor.style.display = 'none';
  cursorRing.style.display = 'none';
}

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateCursorRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top = ringY + 'px';
  requestAnimationFrame(animateCursorRing);
}
animateCursorRing();

document.querySelectorAll('a, button, .filter-btn, .project-card, .skill-tag, .exp-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('expanded'); cursorRing.classList.add('expanded'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('expanded'); cursorRing.classList.remove('expanded'); });
});


const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .exp-item, .project-card').forEach(el => {
  revealObserver.observe(el);
});


document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.style.display = '';
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.style.display = 'none';
      }
    });
  });
});


document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 0.07) + 's';
});

document.querySelectorAll('.exp-item').forEach((item, i) => {
  item.style.transitionDelay = (i * 0.1) + 's';
});


window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(6,8,16,0.95)';
  } else {
    nav.style.background = 'rgba(6,8,16,0.7)';
  }
});


const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      icon.setAttribute('data-lucide', 'menu');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
}




const headline = document.querySelector('.hero-headline');
if (headline) {
  const text = headline.textContent;
  headline.textContent = '';
  headline.style.opacity = '1';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      headline.textContent += text[i++];
      setTimeout(type, 28);
    }
  };
  setTimeout(type, 600);
}


document.addEventListener('mousemove', e => {
  const cards = document.querySelectorAll('.ai-console-card');
  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});
