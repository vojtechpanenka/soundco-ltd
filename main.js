'use strict';

const hero       = document.querySelector('.hero');
const wordmark   = document.querySelector('.wordmark');
const expanded   = document.getElementById('expanded');
const expHeading = expanded.querySelector('.exp-heading');
const expBelow   = expanded.querySelector('.exp-below');
const expContent = expanded.querySelector('.exp-below-content');

let isOpen = false;

function openPanel(entry) {
  if (isOpen) return;
  isOpen = true;

  expHeading.innerHTML = entry.querySelector('.row[role="button"]').innerHTML;
  expContent.innerHTML = entry.querySelector('.panel-content').innerHTML;
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

// Hint blink — pouze na mobilu, 1× r1 pak 2× r2
if (window.matchMedia('(max-width: 480px)').matches) {
  function blink(row, times, onDone) {
    if (times <= 0) { onDone?.(); return; }
    const spans = row.querySelectorAll('.sound, .co, .suffix');
    const dimMs     = times > 1 ? 120 : 220;
    const recoveryMs = times > 1 ? 160 : 320;
    spans.forEach(s => s.style.opacity = '0.6');
    setTimeout(() => {
      spans.forEach(s => s.style.opacity = '');
      setTimeout(() => blink(row, times - 1, onDone), recoveryMs);
    }, dimMs);
  }

  const r1 = document.querySelector('.r1');
  const r2 = document.querySelector('.r2');
  const r3 = document.querySelector('.r3');
  const r4 = document.querySelector('.r4');

  function runCycle() {
    if (isOpen) return;
    blink(r1, 1, () => {
      setTimeout(() => blink(r2, 2, () => {
        setTimeout(() => blink(r3, 1, () => {
          setTimeout(() => blink(r4, 1, null), 500);
        }), 500);
      }), 500);
    });
  }

  let cycles = 0;
  function scheduleCycle() {
    if (cycles >= 3) return;
    cycles++;
    runCycle();
    setTimeout(scheduleCycle, 10000);
  }

  setTimeout(scheduleCycle, 2500);
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
