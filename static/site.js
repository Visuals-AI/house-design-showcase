(() => {
  'use strict';
  const menu = document.getElementById('menu-toggle');
  menu?.addEventListener('click', () => {
    const open = document.getElementById('sidebar').classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.print-button').forEach(button => button.addEventListener('click', () => window.print()));
  document.getElementById('room-search')?.addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll('.room-card').forEach(card => {
      card.hidden = !card.dataset.search.toLowerCase().includes(query);
      if (!card.hidden) visible++;
    });
    document.getElementById('no-results').hidden = visible > 0;
  });
  document.querySelectorAll('.filters').forEach(filters => {
    filters.addEventListener('click', event => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;
      filters.querySelectorAll('button').forEach(b => {b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button));});
      filters.closest('section').querySelectorAll('.media-card').forEach(card => {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.kind !== button.dataset.filter;
      });
    });
  });
  const dialog = document.getElementById('lightbox');
  const preview = document.createElement('div');
  preview.className = 'image-preview'; preview.hidden = true;
  const previewImage = document.createElement('img');
  previewImage.alt = ''; preview.append(previewImage); document.body.append(preview);
  const hidePreview = () => { preview.hidden = true; };
  document.querySelectorAll('a[data-preview], table a[data-lightbox]').forEach(link => {
    const showPreview = () => {
      if (dialog.open) return;
      previewImage.src = link.dataset.preview || link.href;
      const rect = link.getBoundingClientRect();
      const width = Math.min(300, window.innerWidth - 24);
      preview.style.width = `${width}px`;
      preview.style.left = `${Math.max(12, Math.min(rect.right + 12, window.innerWidth - width - 12))}px`;
      preview.style.top = `${Math.max(12, Math.min(rect.top, window.innerHeight - 340))}px`;
      preview.hidden = false;
    };
    link.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') showPreview(); });
    link.addEventListener('pointerleave', hidePreview);
    link.addEventListener('focus', showPreview);
    link.addEventListener('blur', hidePreview);
    link.addEventListener('click', hidePreview);
  });
  window.addEventListener('scroll', hidePreview, true);
  window.addEventListener('resize', hidePreview);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hidePreview(); });
  let items = [], index = 0, opener = null;
  function show(next) {
    index = (next + items.length) % items.length;
    const link = items[index];
    document.getElementById('lightbox-image').src = link.href;
    document.getElementById('lightbox-image').alt = link.dataset.title || '';
    document.getElementById('lightbox-title').textContent = `${index + 1} / ${items.length}  ·  ${link.dataset.title || ''}${link.dataset.kindLabel ? ' · ' + link.dataset.kindLabel : ''}`;
    document.getElementById('open-image').href = link.href;
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-lightbox]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !dialog?.showModal) return;
    event.preventDefault(); opener = link;
    items = Array.from(document.querySelectorAll('a[data-lightbox]')).filter(a => a.dataset.lightbox === link.dataset.lightbox && !a.closest('[hidden]'));
    show(items.indexOf(link)); dialog.showModal();
  });
  document.getElementById('prev-image')?.addEventListener('click', () => show(index - 1));
  document.getElementById('next-image')?.addEventListener('click', () => show(index + 1));
  document.getElementById('close-lightbox')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {event.preventDefault(); show(index - 1);}
    if (event.key === 'ArrowRight') {event.preventDefault(); show(index + 1);}
  });
  dialog?.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
  dialog?.addEventListener('close', () => opener?.focus());
})();
