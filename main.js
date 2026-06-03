'use strict';

const hero       = document.querySelector('.hero');
const wordmark   = document.querySelector('.wordmark');
const expanded   = document.getElementById('expanded');
const expHeading = expanded.querySelector('.exp-heading');
const expBelow   = expanded.querySelector('.exp-below');
const expContent = expanded.querySelector('.exp-below-content p');

let isOpen = false;

function openPanel(entry) {
  if (isOpen) return;
  isOpen = true;

  expHeading.innerHTML = entry.querySelector('.row[role="button"]').innerHTML;
  expContent.textContent = entry.querySelector('.panel-content p').textContent;
  expanded.dataset.service = entry.dataset.service;
  expBelow.classList.remove('open');

  // 1. Fade out wordmark
  wordmark.style.transition = 'opacity 0.25s ease';
  wordmark.style.opacity = '0';

  setTimeout(() => {
    // 2. Wordmark úplně z layoutu, expanded nahoře
    wordmark.style.display = 'none';
    hero.classList.add('is-expanded');

    expanded.style.opacity = '0';
    expanded.style.display = 'flex';

    // 3. Fade in nadpisu (po renderu opacity:0)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      expanded.style.transition = 'opacity 0.3s ease';
      expanded.style.opacity = '1';

      // 4. Rozbalit dolů
      setTimeout(() => expBelow.classList.add('open'), 200);
    }));
  }, 270);
}

function closePanel() {
  if (!isOpen) return;
  isOpen = false;

  expBelow.classList.remove('open');

  setTimeout(() => {
    expanded.style.transition = 'opacity 0.25s ease';
    expanded.style.opacity = '0';

    setTimeout(() => {
      expanded.style.display = 'none';
      hero.classList.remove('is-expanded');

      // Fade in wordmark
      wordmark.style.transition = 'none';
      wordmark.style.opacity = '0';
      wordmark.style.display = '';

      requestAnimationFrame(() => requestAnimationFrame(() => {
        wordmark.style.transition = 'opacity 0.35s ease';
        wordmark.style.opacity = '1';
      }));
    }, 270);
  }, 500);
}

document.querySelectorAll('.entry').forEach(entry => {
  const btn = entry.querySelector('.row[role="button"]');
  btn.addEventListener('click', () => openPanel(entry));
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(entry); }
  });
});

const expClose = expanded.querySelector('.exp-close');

expHeading.addEventListener('click', closePanel);
expHeading.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
    e.preventDefault(); closePanel();
  }
});

expClose.addEventListener('click', closePanel);
