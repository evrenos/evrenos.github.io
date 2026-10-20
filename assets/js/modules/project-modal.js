import { $, $$ } from './utils.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function checkIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', '#i-check');
  svg.append(use);
  return svg;
}

/**
 * Clicking a project card opens a details dialog populated from the card's own markup
 * (title, platform, meta, optional description / workstreams), so the
 * content lives once in the HTML and stays indexable.
 */
export function initProjectModal() {
  const dialog = $('#pmodal');
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const media = $('#pmodal-media');
  const title = $('#pmodal-title');
  const platform = $('#pmodal-platform');
  const desc = $('#pmodal-desc');
  const wsWrap = $('#pmodal-ws-wrap');
  const wsList = $('#pmodal-ws');
  const metaSlot = $('#pmodal-meta');
  const closeBtn = $('#pmodal-close');
  let opener = null;

  const open = (card, trigger) => {
    opener = trigger;

    media.replaceChildren(...[...$('.card__media', card).children].map((n) => n.cloneNode(true)));
    const img = $('img', media);
    if (img) { img.loading = 'eager'; img.removeAttribute('decoding'); }

    title.textContent = $('.card__title', card).textContent;
    platform.textContent = $('.card__platform', card).textContent;

    const d = $('.card__desc', card);
    desc.hidden = !d;
    desc.textContent = d ? d.textContent : '';

    const ws = $$('.card__workstreams li', card);
    wsWrap.hidden = ws.length === 0;
    wsList.replaceChildren(...ws.map((li) => {
      const item = document.createElement('li');
      item.append(checkIcon(), document.createTextNode(li.textContent));
      return item;
    }));

    metaSlot.replaceChildren($('.card__meta', card).cloneNode(true));

    dialog.showModal();
    dialog.scrollTop = 0;
    closeBtn.focus();
  };

  const close = () => dialog.close();
  closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('close', () => { opener?.focus({ preventScroll: true }); });

  for (const btn of $$('.card__open')) {
    btn.addEventListener('click', () => open(btn.closest('.card'), btn));
  }
}
