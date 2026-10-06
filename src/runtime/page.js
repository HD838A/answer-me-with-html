(() => {
  const root = document.documentElement;
  const cycle = (list, cur) => list[(list.indexOf(cur) + 1) % list.length];
  const label = (btn, value) => {
    const map = JSON.parse(btn.dataset.labels || '{}');
    btn.textContent = map[value] || value;
  };
  const bind = (name, attr, values) => {
    const btn = document.querySelector(`[data-am="${name}"]`);
    if (!btn) return;
    label(btn, root.getAttribute(attr));
    btn.addEventListener('click', () => {
      const next = cycle(values, root.getAttribute(attr));
      root.setAttribute(attr, next);
      label(btn, next);
    });
  };
  bind('theme', 'data-theme', ['blueprint', 'shadcn']);
  bind('mode', 'data-mode', ['auto', 'light', 'dark']);

  const copyBtn = document.querySelector('[data-am="copy"]');
  copyBtn?.addEventListener('click', async () => {
    const nodes = document.querySelectorAll('#am-source');
    const text = nodes[nodes.length - 1]?.value ?? '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.append(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    const original = copyBtn.textContent;
    copyBtn.textContent = copyBtn.dataset.done;
    setTimeout(() => { copyBtn.textContent = original; }, 1400);
  });

  // Markdown / HTML 中的图片按内容区和视口缩放；点击后在遮罩层中查看大图。
  const images = [...document.querySelectorAll('.am-md img, .am-intro img, .am-panel-body img[src]')];
  if (images.length && document.body) {
    const lang = (root.getAttribute('lang') || '').toLowerCase();
    const closeLabel = lang.startsWith('zh') ? '关闭大图' : lang.startsWith('ja') ? '大きな画像を閉じる' : 'Close image';
    const openLabel = lang.startsWith('zh') ? '点击查看大图' : lang.startsWith('ja') ? 'クリックして拡大表示' : 'Open image';
    const labelSeparator = lang.startsWith('zh') ? '，' : ': ';
    const lightbox = document.createElement('div');
    lightbox.className = 'am-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', closeLabel);
    lightbox.innerHTML = '<button class="am-lightbox-close" type="button" aria-label="' + closeLabel + '">×</button><img alt="">';
    document.body.append(lightbox);
    const large = lightbox.querySelector('img');
    const close = lightbox.querySelector('.am-lightbox-close');
    let active = null;

    const hide = () => {
      if (lightbox.hidden) return;
      lightbox.hidden = true;
      document.body.classList.remove('am-lightbox-open');
      active?.focus();
      active = null;
    };
    const show = (image) => {
      active = image;
      large.src = image.currentSrc || image.src;
      large.alt = image.alt || '';
      lightbox.hidden = false;
      document.body.classList.add('am-lightbox-open');
      close.focus();
    };

    for (const image of images) {
      image.loading ||= 'lazy';
      image.decoding ||= 'async';
      image.tabIndex = 0;
      image.setAttribute('role', 'button');
      image.setAttribute('aria-label', image.alt ? `${image.alt}${labelSeparator}${openLabel}` : openLabel);
      image.addEventListener('click', (event) => {
        event.preventDefault();
        show(image);
      });
      image.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        show(image);
      });
    }
    close.addEventListener('click', hide);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox || event.target === large) hide();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hide();
    });
  }
})();
