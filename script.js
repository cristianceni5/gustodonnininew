const menuData = Array.isArray(window.menu)
  ? window.menu
  : typeof menu !== 'undefined' && Array.isArray(menu)
    ? menu
    : [];
const filtersEl = document.querySelector('[data-filters]');
const menuEl = document.querySelector('[data-menu]');
const menuEmptyEl = document.querySelector('[data-menu-empty]');
const legendEl = document.querySelector('[data-legend]');
const orderListEl = document.querySelector('[data-order-list]');
const orderEmptyEl = document.querySelector('[data-order-empty]');
const orderTotalEl = document.querySelector('[data-order-total]');
const orderButtons = document.querySelectorAll('[data-whatsapp]');
const resetButton = document.querySelector('[data-reset-order]');
const searchInput = document.querySelector('[data-search]');
const searchClear = document.querySelector('[data-search-clear]');
const quickTotalEl = document.querySelector('[data-quick-total]');
const quickbarEl = document.querySelector('[data-quickbar]');
const modalEl = document.querySelector('[data-modal]');
const modalTitleEl = document.querySelector('[data-modal-title]');
const modalSubtitleEl = document.querySelector('[data-modal-subtitle]');
const modalBodyEl = document.querySelector('[data-modal-body]');
const modalTotalEl = document.querySelector('[data-modal-total]');
const modalQtyEl = document.querySelector('[data-modal-qty]');
const modalAddButton = document.querySelector('[data-modal-add]');
const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

const cart = new Map();
const menuItems = new Map();
const itemButtons = new Map();
const slugCounts = new Map();
const cardQtyEls = new Map();
const customTypeBaseKey = new Map();
const themeButtons = document.querySelectorAll('.theme-option');
const themeStorageKey = 'gusto-theme';
const themeClasses = Array.from(themeButtons)
  .map((button) => button.dataset.theme)
  .filter(Boolean);

let activeFilter = 'all';
let searchQuery = '';
let activeModalType = null;

const applyTheme = (theme) => {
  if (!document.body || !themeClasses.length) {
    return;
  }

  themeClasses.forEach((className) => document.body.classList.remove(className));
  if (theme) {
    document.body.classList.add(theme);
  }

  themeButtons.forEach((button) => {
    const isActive = button.dataset.theme === theme;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const initTheme = () => {
  if (!themeButtons.length || !themeClasses.length) {
    return;
  }
  const saved = localStorage.getItem(themeStorageKey);
  const initial = themeClasses.includes(saved) ? saved : themeClasses[0];
  applyTheme(initial);

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const next = button.dataset.theme;
      applyTheme(next);
      localStorage.setItem(themeStorageKey, next);
    });
  });
};

const allergenLabels = {
  glutine: 'Glutine',
  latte: 'Latte',
  uova: 'Uova',
  pesce: 'Pesce',
  piccante: 'Piccante',
};

const ingredientOptions = [
  { value: 'mozzarella', label: 'Mozzarella' },
  { value: 'prosciutto-cotto', label: 'Prosciutto cotto' },
  { value: 'prosciutto-crudo', label: 'Prosciutto crudo' },
  { value: 'salsiccia', label: 'Salsiccia' },
  { value: 'funghi', label: 'Funghi' },
  { value: 'carciofi', label: 'Carciofi' },
  { value: 'olive', label: 'Olive' },
  { value: 'cipolla', label: 'Cipolla' },
  { value: 'peperoni', label: 'Peperoni' },
  { value: 'zucchine', label: 'Zucchine' },
  { value: 'melanzane', label: 'Melanzane' },
  { value: 'gorgonzola', label: 'Gorgonzola' },
  { value: 'pecorino', label: 'Pecorino' },
  { value: 'rucola', label: 'Rucola' },
  { value: 'pomodorini', label: 'Pomodorini' },
];

const customizationConfigs = {
  pizza: {
    title: 'Pizza personalizzata',
    subtitle: 'Base covaccino, bianca o rossa. Ingredienti extra: EUR 1 ciascuno.',
    fields: [
      {
        id: 'base',
        label: 'Base',
        type: 'select',
        required: true,
        defaultValue: 'covaccino',
        options: [
          { value: 'covaccino', label: 'Covaccino', price: 5 },
          { value: 'bianca', label: 'Bianca', price: 6 },
          { value: 'rossa', label: 'Rossa', price: 6 },
        ],
      },
      {
        id: 'ingredienti',
        label: 'Ingredienti extra (EUR 1 ciascuno)',
        type: 'checkbox',
        pricePerItem: 1,
        options: ingredientOptions,
      },
      {
        id: 'glutenfree',
        label: 'Impasto senza glutine (EUR 1)',
        type: 'checkbox',
        pricePerItem: 1,
        options: [{ value: 'senza-glutine', label: 'Senza glutine' }],
      },
      {
        id: 'note',
        label: 'Note',
        type: 'text',
        placeholder: 'Es. ben cotta',
      },
    ],
  },
  calzone: {
    title: 'Calzone personalizzato',
    subtitle: 'Ripieno a scelta. Ingredienti extra: EUR 1 ciascuno.',
    fields: [
      {
        id: 'base',
        label: 'Calzone',
        type: 'select',
        required: true,
        defaultValue: 'calzone',
        options: [{ value: 'calzone', label: 'Calzone', price: 8.5 }],
      },
      {
        id: 'ingredienti',
        label: 'Ripieno extra (EUR 1 ciascuno)',
        type: 'checkbox',
        pricePerItem: 1,
        options: ingredientOptions,
      },
      {
        id: 'glutenfree',
        label: 'Impasto senza glutine (EUR 1)',
        type: 'checkbox',
        pricePerItem: 1,
        options: [{ value: 'senza-glutine', label: 'Senza glutine' }],
      },
      {
        id: 'note',
        label: 'Note',
        type: 'text',
        placeholder: 'Es. senza cipolla',
      },
    ],
  },
  vino: {
    title: 'Vino',
    subtitle: 'Scegli formato e tipologia.',
    fields: [
      {
        id: 'formato',
        label: 'Formato',
        type: 'select',
        required: true,
        defaultValue: 'calice',
        options: [
          { value: 'calice', label: 'Calice', price: 3.5 },
          { value: 'bottiglia', label: 'Bottiglia', price: 15 },
        ],
      },
      {
        id: 'tipo',
        label: 'Tipo',
        type: 'select',
        required: true,
        defaultValue: 'rosso',
        options: [
          { value: 'rosso', label: 'Rosso' },
          { value: 'bianco', label: 'Bianco' },
          { value: 'rosato', label: 'Rosato' },
          { value: 'prosecco', label: 'Prosecco' },
        ],
      },
      {
        id: 'note',
        label: 'Note',
        type: 'text',
        placeholder: 'Es. etichetta o annata',
      },
    ],
  },
  gin: {
    title: 'Gin tonic',
    subtitle: 'Scegli il gin. I prezzi sono generici.',
    fields: [
      {
        id: 'gin',
        label: 'Gin',
        type: 'select',
        required: true,
        defaultValue: 'classico',
        options: [
          { value: 'classico', label: 'Gin classico', price: 6 },
          { value: 'premium', label: 'Gin premium', price: 8 },
          { value: 'top', label: 'Gin top', price: 10 },
        ],
      },
      {
        id: 'tonica',
        label: 'Tonica',
        type: 'select',
        required: false,
        defaultValue: '',
        options: [
          { value: '', label: 'Seleziona' },
          { value: 'indian', label: 'Indian' },
          { value: 'mediterranea', label: 'Mediterranea' },
          { value: 'secca', label: 'Secca' },
        ],
      },
      {
        id: 'guarnizione',
        label: 'Guarnizione',
        type: 'text',
        placeholder: 'Es. lime, rosmarino',
      },
    ],
  },
  birra: {
    title: 'Birra',
    subtitle: 'Formato rapido con prezzi generici.',
    fields: [
      {
        id: 'formato',
        label: 'Formato',
        type: 'select',
        required: true,
        defaultValue: 'spina-piccola',
        options: [
          { value: 'spina-piccola', label: 'Spina piccola', price: 3.5 },
          { value: 'spina-media', label: 'Spina media', price: 4.5 },
          { value: 'bottiglia', label: 'Bottiglia', price: 5 },
        ],
      },
      {
        id: 'tipo',
        label: 'Tipo',
        type: 'select',
        required: false,
        defaultValue: '',
        options: [
          { value: '', label: 'Seleziona' },
          { value: 'chiara', label: 'Chiara' },
          { value: 'rossa', label: 'Rossa' },
          { value: 'ipa', label: 'IPA' },
        ],
      },
      {
        id: 'marca',
        label: 'Marca',
        type: 'text',
        placeholder: 'Es. Moretti, Ichnusa',
      },
    ],
  },
};

const customItemMap = new Map([
  ['Personalizzata', 'pizza'],
  ['Personalizzato', 'calzone'],
  ['Gin Tonic', 'gin'],
  ['Vino (bottiglia, calice)', 'vino'],
]);

const formatPrice = (price) => {
  if (!Number.isFinite(price)) {
    return '';
  }
  const formatted = price.toFixed(2).replace('.', ',');
  return `EUR ${formatted}`;
};

const normalizeText = (value) => String(value || '').toLowerCase();

const stripTags = (value) => String(value || '').replace(/<[^>]+>/g, '');

const slugify = (value) => {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const uniqueSlug = (value) => {
  const base = slugify(value) || 'categoria';
  const count = (slugCounts.get(base) || 0) + 1;
  slugCounts.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
};

const sanitizeDescription = (value) => {
  if (!value) {
    return '';
  }
  let cleaned = String(value);
  cleaned = cleaned.replace(/<\/?p>/gi, '');
  cleaned = cleaned.replace(/<\s*b\s*>/gi, '<strong>');
  cleaned = cleaned.replace(/<\s*\/\s*b\s*>/gi, '</strong>');
  cleaned = cleaned.replace(/<(?!\/?strong\b|br\b)[^>]+>/gi, '');
  return cleaned;
};

const categories = menuData.filter((group) => Array.isArray(group.prodotti) && group.prodotti.length);

const getAllergens = () => {
  const set = new Set();
  menuData.forEach((group) => {
    (group.prodotti || []).forEach((item) => {
      (item.allergeni || []).forEach((allergen) => {
        if (allergen) {
          set.add(allergen);
        }
      });
    });
  });
  return Array.from(set);
};

const createChip = (label, filter, isActive) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `chip${isActive ? ' is-active' : ''}`;
  button.dataset.filter = filter;
  button.textContent = label;
  return button;
};

const buildFilters = (groups) => {
  if (!filtersEl) {
    return;
  }
  filtersEl.innerHTML = '';
  filtersEl.appendChild(createChip('Tutto', 'all', true));
  groups.forEach((group) => {
    filtersEl.appendChild(createChip(group.categoria, group.slug, false));
  });
};

const enableDragScroll = (element) => {
  if (!element) {
    return;
  }
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let dragged = false;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let rafId = 0;

  const stopMomentum = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const startMomentum = () => {
    const friction = 0.95;
    const minVelocity = 0.2;

    const step = () => {
      element.scrollLeft -= velocity;
      velocity *= friction;
      if (Math.abs(velocity) > minVelocity) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = 0;
      }
    };

    if (Math.abs(velocity) > minVelocity) {
      rafId = requestAnimationFrame(step);
    }
  };

  element.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') {
      return;
    }
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }
    stopMomentum();
    isDown = true;
    dragged = false;
    startX = event.clientX;
    scrollLeft = element.scrollLeft;
    lastX = event.clientX;
    lastTime = performance.now();
    velocity = 0;
    element.classList.add('is-dragging');
  });

  element.addEventListener('pointermove', (event) => {
    if (!isDown) {
      return;
    }
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 6) {
      dragged = true;
    }
    element.scrollLeft = scrollLeft - delta;
    const now = performance.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocity = (event.clientX - lastX) / dt;
    }
    lastX = event.clientX;
    lastTime = now;
  });

  const stopDrag = (event) => {
    if (!isDown) {
      return;
    }
    isDown = false;
    element.classList.remove('is-dragging');
    if (dragged) {
      element.dataset.dragged = 'true';
    }
    if (event.pointerType === 'mouse') {
      velocity = velocity * 16;
      startMomentum();
    }
  };

  element.addEventListener('pointerup', stopDrag);
  element.addEventListener('pointercancel', stopDrag);
  element.addEventListener('pointerleave', stopDrag);
};

const createMenuItem = (item, category) => {
  const key = `${category.slug}::${item.nome}`;
  menuItems.set(key, { ...item, category: category.categoria, baseKey: key });

  const card = document.createElement('article');
  card.className = 'menu__item';

  const searchText = normalizeText(
    `${item.nome || ''} ${stripTags(item.descrizione || '')} ${category.categoria || ''}`
  );
  card.dataset.search = searchText;

  const media = document.createElement('div');
  media.className = 'menu__media';

  if (item.immagine) {
    const img = document.createElement('img');
    img.src = item.immagine;
    img.alt = item.nome ? `Foto ${item.nome}` : 'Foto piatto';
    img.loading = 'lazy';
    media.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'menu__placeholder';
    placeholder.textContent = 'Foto in arrivo';
    media.appendChild(placeholder);
  }

  const content = document.createElement('div');
  content.className = 'menu__content';

  const title = document.createElement('h3');
  title.textContent = item.nome || 'Piatto';

  content.appendChild(title);

  if (item.descrizione) {
    const description = document.createElement('p');
    description.innerHTML = sanitizeDescription(item.descrizione);
    content.appendChild(description);
  }

  const allergens = Array.isArray(item.allergeni) ? item.allergeni.filter(Boolean) : [];
  if (allergens.length) {
    const allergenWrap = document.createElement('div');
    allergenWrap.className = 'menu__allergens';
    allergens.forEach((allergen) => {
      const badge = document.createElement('span');
      badge.className = 'menu__allergen';
      badge.textContent = allergenLabels[allergen] || allergen;
      allergenWrap.appendChild(badge);
    });
    content.appendChild(allergenWrap);
  }

  const customType = customItemMap.get(item.nome);
  const isCustom = Boolean(customType);
  const basePrice = Number(item.prezzo);
  const hasBasePrice = Number.isFinite(basePrice);

  let glutenInput = null;
  if (!isCustom && category.categoria && category.categoria.toLowerCase().includes('pizze')) {
    const hasGluten = allergens.includes('glutine');
    if (hasGluten) {
      const glutenWrap = document.createElement('label');
      glutenWrap.className = 'menu__gluten';

      glutenInput = document.createElement('input');
      glutenInput.type = 'checkbox';
      glutenInput.className = 'menu__gluten-input';

      const glutenText = document.createElement('span');
      glutenText.textContent = 'Senza glutine (+EUR 1)';

      glutenWrap.appendChild(glutenInput);
      glutenWrap.appendChild(glutenText);
      content.appendChild(glutenWrap);
    }
  }

  const meta = document.createElement('div');
  meta.className = 'menu__meta';

  const price = document.createElement('span');
  price.className = 'menu__price';
  price.textContent = isCustom ? 'Personalizza' : formatPrice(basePrice);

  meta.appendChild(price);
  content.appendChild(meta);

  if (glutenInput) {
    glutenInput.addEventListener('change', () => {
      if (hasBasePrice) {
        const extra = glutenInput.checked ? 1 : 0;
        price.textContent = formatPrice(basePrice + extra);
      }
    });
  }

  card.appendChild(media);
  card.appendChild(content);

  const qtyBadge = document.createElement('span');
  qtyBadge.className = 'menu__qty';
  qtyBadge.dataset.baseKey = key;
  qtyBadge.textContent = '0';
  card.appendChild(qtyBadge);
  cardQtyEls.set(key, qtyBadge);

  if (isCustom) {
    customTypeBaseKey.set(customType, key);
  }

  card.addEventListener('click', (event) => {
    if (event.target.closest('.menu__gluten')) {
      return;
    }
    if (isCustom) {
      openModal(customType);
      return;
    }
    if (!hasBasePrice) {
      return;
    }

    let targetKey = key;
    if (glutenInput && glutenInput.checked) {
      targetKey = `${key}::gluten`;
      if (!menuItems.has(targetKey)) {
        menuItems.set(targetKey, {
          ...item,
          nome: `${item.nome} (senza glutine)`,
          prezzo: basePrice + 1,
          customNote: 'Senza glutine',
        });
      }
    }

    addToCart(targetKey, card);
  });

  return card;
};

const buildSections = (groups) => {
  if (!menuEl) {
    return;
  }
  menuEl.innerHTML = '';
  if (!groups.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Menu in aggiornamento.';
    menuEl.appendChild(empty);
    return;
  }
  groups.forEach((group) => {
    const section = document.createElement('section');
    section.className = 'menu__section';
    section.dataset.section = group.slug;
    section.id = group.slug;

    const header = document.createElement('div');
    header.className = 'menu__header';

    const title = document.createElement('h2');
    title.textContent = group.categoria;

    const count = document.createElement('p');
    count.textContent = `${group.prodotti.length} piatti`;

    header.appendChild(title);
    header.appendChild(count);

    const grid = document.createElement('div');
    grid.className = 'menu__grid';

    group.prodotti.forEach((item) => {
      grid.appendChild(createMenuItem(item, group));
    });

    section.appendChild(header);
    section.appendChild(grid);
    menuEl.appendChild(section);
  });
};

const applyFilters = () => {
  const query = normalizeText(searchQuery.trim());
  let anyVisible = false;

  document.querySelectorAll('.menu__section').forEach((section) => {
    const sectionMatches = activeFilter === 'all' || section.dataset.section === activeFilter;
    if (!sectionMatches) {
      section.style.display = 'none';
      return;
    }

    let sectionVisible = false;
    section.querySelectorAll('.menu__item').forEach((item) => {
      const matches = !query || (item.dataset.search || '').includes(query);
      item.style.display = matches ? '' : 'none';
      if (matches) {
        sectionVisible = true;
      }
    });

    section.style.display = sectionVisible ? 'grid' : 'none';
    if (sectionVisible) {
      anyVisible = true;
    }
  });

  if (menuEmptyEl) {
    menuEmptyEl.style.display = anyVisible ? 'none' : 'block';
  }
};

const setActiveFilter = (filter) => {
  activeFilter = filter;
  const buttons = filtersEl ? filtersEl.querySelectorAll('.chip') : [];
  buttons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.filter === filter);
  });
  applyFilters();
};

const scrollToSection = (filter) => {
  if (!menuEl || !filter || filter === 'all') {
    return;
  }
  const target = menuEl.querySelector(`.menu__section[data-section="${filter}"]`);
  if (!target) {
    return;
  }
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

const getCartSummary = () => {
  const items = [];
  let total = 0;

  cart.forEach((entry) => {
    const price = Number(entry.item.prezzo);
    const lineTotal = Number.isFinite(price) ? price * entry.qty : 0;
    total += lineTotal;
    items.push({ ...entry, lineTotal });
  });

  return { items, total };
};

const updateButtonLabel = (key, qty) => {
  const button = itemButtons.get(key);
  if (!button) {
    return;
  }
  const count = qty || 0;
  button.textContent = count > 0 ? `Aggiungi (${count})` : 'Aggiungi';
};

const updateQuickbar = (items, total) => {
  if (!quickTotalEl || !quickbarEl) {
    return;
  }

  quickTotalEl.textContent = formatPrice(total) || 'EUR 0,00';
  quickbarEl.classList.toggle('is-active', items.length > 0);
};

const updateCardQuantities = () => {
  const counts = new Map();
  cart.forEach((entry) => {
    const baseKey = entry.item.baseKey || entry.key;
    const current = counts.get(baseKey) || 0;
    counts.set(baseKey, current + entry.qty);
  });

  cardQtyEls.forEach((badge, baseKey) => {
    const qty = counts.get(baseKey) || 0;
    badge.textContent = String(qty);
    badge.classList.toggle('is-visible', qty > 0);
  });
};

const updateCartUI = () => {
  if (!orderListEl || !orderEmptyEl || !orderTotalEl) {
    return;
  }

  const { items, total } = getCartSummary();
  orderListEl.innerHTML = '';

  if (!items.length) {
    orderEmptyEl.style.display = 'block';
  } else {
    orderEmptyEl.style.display = 'none';
  }

  items.forEach((entry) => {
    const itemRow = document.createElement('li');
    itemRow.className = 'order__item';

    const detail = document.createElement('span');
    detail.className = 'order__detail';
    const note = entry.item.customNote ? ` - ${entry.item.customNote}` : '';
    detail.textContent = `${entry.qty}x ${entry.item.nome}${note}`;

    const meta = document.createElement('div');
    meta.className = 'order__item-meta';

    const price = document.createElement('span');
    price.textContent = formatPrice(entry.lineTotal) || 'EUR 0,00';

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'order__remove';
    remove.textContent = 'Rimuovi';
    remove.addEventListener('click', () => removeFromCart(entry.key));

    meta.appendChild(price);
    meta.appendChild(remove);

    itemRow.appendChild(detail);
    itemRow.appendChild(meta);

    orderListEl.appendChild(itemRow);
  });

  orderTotalEl.textContent = formatPrice(total) || 'EUR 0,00';
  updateQuickbar(items, total);
  updateCardQuantities();
};

const addToCart = (key, sourceEl) => {
  const item = menuItems.get(key);
  if (!item) {
    return;
  }

  const current = cart.get(key);
  const qty = current ? current.qty + 1 : 1;
  cart.set(key, { key, item, qty });
  updateButtonLabel(key, qty);
  updateCartUI();

  if (sourceEl) {
    sourceEl.classList.remove('is-added');
    void sourceEl.offsetWidth;
    sourceEl.classList.add('is-added');
  }
};

const addCustomToCart = (item, qty) => {
  const key = `custom::${slugify(item.nome)}::${Date.now()}`;
  const baseKey = customTypeBaseKey.get(activeModalType);
  const storedItem = baseKey ? { ...item, baseKey } : item;
  cart.set(key, { key, item: storedItem, qty });
  updateCartUI();
};

const removeFromCart = (key) => {
  const current = cart.get(key);
  if (!current) {
    return;
  }

  const qty = current.qty - 1;
  if (qty <= 0) {
    cart.delete(key);
  } else {
    cart.set(key, { ...current, qty });
  }

  updateButtonLabel(key, Math.max(qty, 0));
  updateCartUI();
};

const buildMessage = (scope) => {
  const { items, total } = getCartSummary();
  if (!items.length) {
    return null;
  }

  const lines = ['Ordine Gusto Donnini'];

  if (scope === 'staff') {
    lines.push('Area personale');
  }

  const customerName = document.querySelector('[data-field="customer-name"]');
  const customerNote = document.querySelector('[data-field="customer-note"]');
  const staffTable = document.querySelector('[data-field="staff-table"]');
  const staffCovers = document.querySelector('[data-field="staff-covers"]');
  const staffSurname = document.querySelector('[data-field="staff-surname"]');
  const staffNote = document.querySelector('[data-field="staff-note"]');

  if (scope === 'customer' && customerName && customerName.value.trim()) {
    lines.push(`Nome: ${customerName.value.trim()}`);
  }

  if (scope === 'staff' && staffTable && staffTable.value.trim()) {
    lines.push(`Tavolo: ${staffTable.value.trim()}`);
  }

  if (scope === 'staff' && staffCovers && staffCovers.value.trim()) {
    lines.push(`Coperti: ${staffCovers.value.trim()}`);
  }

  if (scope === 'staff' && staffSurname && staffSurname.value.trim()) {
    lines.push(`Cognome: ${staffSurname.value.trim()}`);
  }

  lines.push('Articoli:');

  items.forEach((entry) => {
    const note = entry.item.customNote ? ` - ${entry.item.customNote}` : '';
    lines.push(`- ${entry.qty}x ${entry.item.nome}${note} (${formatPrice(Number(entry.item.prezzo))})`);
  });

  lines.push(`Totale: ${formatPrice(total)}`);

  const note = scope === 'staff' ? staffNote : customerNote;
  if (note && note.value.trim()) {
    lines.push(`Note: ${note.value.trim()}`);
  }

  return lines.join('\n');
};

const handleWhatsApp = (button) => {
  const scope = button.dataset.whatsapp;
  const phone = (button.dataset.phone || '').replace(/\D/g, '');
  const message = buildMessage(scope);

  if (!message) {
    window.alert('Aggiungi almeno un prodotto.');
    return;
  }

  if (!phone) {
    window.alert('Imposta il numero WhatsApp.');
    return;
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

const renderLegend = () => {
  if (!legendEl) {
    return;
  }
  legendEl.innerHTML = '';
  const allergens = getAllergens();
  if (!allergens.length) {
    const empty = document.createElement('span');
    empty.textContent = 'Nessun allergene segnalato.';
    legendEl.appendChild(empty);
    return;
  }
  allergens.forEach((allergen) => {
    const badge = document.createElement('span');
    badge.className = 'legend__item';
    badge.textContent = allergenLabels[allergen] || allergen;
    legendEl.appendChild(badge);
  });
};

const buildSelectField = (field) => {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';

  const label = document.createElement('span');
  label.textContent = field.label;

  const select = document.createElement('select');
  select.dataset.modalField = field.id;

  field.options.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.dataset.label = option.label;
    if (Number.isFinite(option.price)) {
      opt.dataset.price = option.price;
      opt.textContent = `${option.label} - ${formatPrice(option.price)}`;
    } else {
      opt.textContent = option.label;
    }
    select.appendChild(opt);
  });

  if (field.defaultValue !== undefined) {
    select.value = field.defaultValue;
  }

  wrapper.appendChild(label);
  wrapper.appendChild(select);

  return wrapper;
};

const buildCheckboxField = (field) => {
  const group = document.createElement('div');
  group.className = 'modal__group';

  const label = document.createElement('div');
  label.className = 'modal__label';
  label.textContent = field.label;

  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'modal__options';

  field.options.forEach((option) => {
    const optionLabel = document.createElement('label');
    optionLabel.className = 'modal__option';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.value = option.value;
    input.dataset.modalCheckbox = field.id;
    input.dataset.label = option.label;

    const text = document.createElement('span');
    text.textContent = option.label;

    optionLabel.appendChild(input);
    optionLabel.appendChild(text);
    optionsWrap.appendChild(optionLabel);
  });

  group.appendChild(label);
  group.appendChild(optionsWrap);
  return group;
};

const buildTextField = (field) => {
  const wrapper = document.createElement('label');
  wrapper.className = 'field';

  const label = document.createElement('span');
  label.textContent = field.label;

  const input = document.createElement('input');
  input.type = 'text';
  input.dataset.modalField = field.id;
  input.placeholder = field.placeholder || '';

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  return wrapper;
};

const buildModalState = () => {
  const config = customizationConfigs[activeModalType];
  if (!config || !modalBodyEl) {
    return null;
  }

  const values = {};
  let baseTotal = 0;
  let isValid = true;

  config.fields.forEach((field) => {
    if (field.type === 'select') {
      const select = modalBodyEl.querySelector(`[data-modal-field="${field.id}"]`);
      const option = select && select.selectedOptions ? select.selectedOptions[0] : null;
      const value = select ? select.value : '';
      const label = option ? option.dataset.label || option.textContent : '';
      const price = Number(option && option.dataset.price);

      if (field.required && !value) {
        isValid = false;
      }
      if (Number.isFinite(price)) {
        baseTotal += price;
      }

      values[field.id] = {
        value,
        label,
        price: Number.isFinite(price) ? price : 0,
      };
    }

    if (field.type === 'checkbox') {
      const inputs = modalBodyEl.querySelectorAll(`input[data-modal-checkbox="${field.id}"]`);
      const items = [];
      inputs.forEach((input) => {
        if (input.checked) {
          items.push(input.dataset.label || input.value);
        }
      });
      const extras = items.length * (field.pricePerItem || 0);
      baseTotal += extras;
      values[field.id] = { items, total: extras };
    }

    if (field.type === 'text') {
      const input = modalBodyEl.querySelector(`[data-modal-field="${field.id}"]`);
      values[field.id] = { value: input ? input.value.trim() : '' };
    }
  });

  const qty = Math.max(1, Number(modalQtyEl && modalQtyEl.value) || 1);
  const total = baseTotal * qty;

  return {
    values,
    qty,
    baseTotal,
    total,
    isValid,
  };
};

const updateModalTotal = () => {
  if (!modalEl || !modalTotalEl || !modalAddButton) {
    return;
  }

  const state = buildModalState();
  if (!state) {
    return;
  }

  modalTotalEl.textContent = formatPrice(state.total) || 'EUR 0,00';
  modalAddButton.disabled = !state.isValid;
};

const buildModalItem = (type, state) => {
  const values = state.values;
  const notes = [];
  let nome = 'Personalizzazione';

  if (type === 'pizza') {
    const base = values.base ? values.base.label : 'Pizza';
    nome = `Pizza ${base}`;
    const extras = values.ingredienti ? values.ingredienti.items : [];
    if (extras.length) {
      notes.push(`Ingredienti: ${extras.join(', ')}`);
    }
    if (values.glutenfree && values.glutenfree.items.length) {
      notes.push('Impasto senza glutine');
    }
  }

  if (type === 'calzone') {
    nome = 'Calzone personalizzato';
    const extras = values.ingredienti ? values.ingredienti.items : [];
    if (extras.length) {
      notes.push(`Ingredienti: ${extras.join(', ')}`);
    }
    if (values.glutenfree && values.glutenfree.items.length) {
      notes.push('Impasto senza glutine');
    }
  }

  if (type === 'vino') {
    const formato = values.formato ? values.formato.label : 'Calice';
    const tipo = values.tipo ? values.tipo.label : 'Rosso';
    nome = `${formato} di vino ${tipo}`;
  }

  if (type === 'gin') {
    const gin = values.gin ? values.gin.label : 'Gin';
    nome = `Gin tonic ${gin}`;
    if (values.tonica && values.tonica.value) {
      notes.push(`Tonica: ${values.tonica.label}`);
    }
    if (values.guarnizione && values.guarnizione.value) {
      notes.push(`Guarnizione: ${values.guarnizione.value}`);
    }
  }

  if (type === 'birra') {
    const formato = values.formato ? values.formato.label : 'Birra';
    nome = `Birra ${formato}`;
    if (values.tipo && values.tipo.value) {
      notes.push(`Tipo: ${values.tipo.label}`);
    }
    if (values.marca && values.marca.value) {
      notes.push(`Marca: ${values.marca.value}`);
    }
  }

  if (values.note && values.note.value) {
    notes.push(`Note: ${values.note.value}`);
  }

  return {
    nome,
    note: notes.join(' | '),
  };
};

const openModal = (type) => {
  const config = customizationConfigs[type];
  if (!config || !modalEl || !modalBodyEl) {
    return;
  }

  activeModalType = type;
  modalBodyEl.innerHTML = '';

  if (modalTitleEl) {
    modalTitleEl.textContent = config.title;
  }
  if (modalSubtitleEl) {
    modalSubtitleEl.textContent = config.subtitle || '';
  }

  config.fields.forEach((field) => {
    if (field.type === 'select') {
      modalBodyEl.appendChild(buildSelectField(field));
    }
    if (field.type === 'checkbox') {
      modalBodyEl.appendChild(buildCheckboxField(field));
    }
    if (field.type === 'text') {
      modalBodyEl.appendChild(buildTextField(field));
    }
  });

  if (modalQtyEl) {
    modalQtyEl.value = 1;
  }

  updateModalTotal();
  modalEl.classList.add('is-open');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('is-locked');

  const firstInput = modalBodyEl.querySelector('select, input, textarea');
  if (firstInput) {
    firstInput.focus();
  }
};

const closeModal = () => {
  if (!modalEl) {
    return;
  }
  modalEl.classList.remove('is-open');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('is-locked');
  activeModalType = null;
};

const handleModalAdd = () => {
  const state = buildModalState();
  if (!state || !activeModalType || !state.isValid) {
    window.alert('Completa le scelte richieste.');
    return;
  }

  const built = buildModalItem(activeModalType, state);
  const customItem = {
    nome: built.nome,
    prezzo: state.baseTotal,
    customNote: built.note || '',
  };

  addCustomToCart(customItem, state.qty);
  closeModal();
};

const init = () => {
  initTheme();

  const mappedCategories = categories.map((group) => ({
    ...group,
    slug: uniqueSlug(group.categoria),
  }));

  buildFilters(mappedCategories);
  buildSections(mappedCategories);
  renderLegend();
  applyFilters();

  if (filtersEl) {
    enableDragScroll(filtersEl);
    filtersEl.addEventListener('click', (event) => {
      if (filtersEl.dataset.dragged === 'true') {
        delete filtersEl.dataset.dragged;
        return;
      }
      const button = event.target.closest('button[data-filter]');
      if (!button) {
        return;
      }
      setActiveFilter(button.dataset.filter);
      scrollToSection(button.dataset.filter);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchQuery = event.target.value;
      applyFilters();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      applyFilters();
      searchInput.focus();
    });
  }

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => handleWhatsApp(button));
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      cart.clear();
      updateCartUI();
      document.querySelectorAll('[data-field^="staff-"]').forEach((field) => {
        if ('value' in field) {
          field.value = '';
        }
      });
    });
  }

  if (modalBodyEl) {
    modalBodyEl.addEventListener('input', updateModalTotal);
    modalBodyEl.addEventListener('change', updateModalTotal);
  }

  if (modalQtyEl) {
    modalQtyEl.addEventListener('input', updateModalTotal);
  }

  if (modalAddButton) {
    modalAddButton.addEventListener('click', handleModalAdd);
  }

  modalCloseButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalEl && modalEl.classList.contains('is-open')) {
      closeModal();
    }
  });

  updateCartUI();
};

init();
