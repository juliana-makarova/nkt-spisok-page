const tabs = document.querySelectorAll('[data-series]');

const heroVideo = document.querySelector('#heroVideo');
if (heroVideo) {
  heroVideo.addEventListener('loadeddata', () => heroVideo.closest('.hero-visual').classList.add('has-video'));
  heroVideo.addEventListener('error', () => heroVideo.closest('.hero-visual').classList.remove('has-video'));
}
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.toggle('active', item === tab));
  tabs.forEach(item => item.setAttribute('aria-selected', item === tab ? 'true' : 'false'));
  document.querySelectorAll('.series-panel').forEach(panel => {
    const active = panel.id === tab.dataset.series;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
}));

document.querySelectorAll('[data-slider]').forEach(slider => {
  const slides = [...slider.querySelectorAll('.slide-placeholder')];
  const counter = slider.querySelector('[data-counter]');
  let current = 0;
  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === current));
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  slider.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
  slider.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
});

const fileInput = document.querySelector('#fileInput');
fileInput.addEventListener('change', () => {
  document.querySelector('#fileName').textContent = fileInput.files[0]?.name || 'Прикрепить техническое задание или схему';
});

const dialog = document.querySelector('#successDialog');
document.querySelector('#requestForm').addEventListener('submit', event => {
  event.preventDefault(); dialog.showModal();
});
dialog.querySelectorAll('button').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const documentDialog = document.querySelector('#documentDialog');
document.querySelectorAll('[data-document]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#documentTitle').textContent = `Даташит ${link.dataset.document}`;
  documentDialog.showModal();
}));
documentDialog.querySelectorAll('button').forEach(button => button.addEventListener('click', () => documentDialog.close()));
documentDialog.addEventListener('click', event => { if (event.target === documentDialog) documentDialog.close(); });

const menu = document.querySelector('.menu-button');
menu.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.site-header nav a').forEach(link => link.addEventListener('click', () => document.body.classList.remove('menu-open')));
