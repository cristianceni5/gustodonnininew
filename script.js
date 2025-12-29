// Developed by Cristian Ceni 2025, all the rights are reserved

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
const resetButtons = document.querySelectorAll('[data-reset-order]');
const searchInput = document.querySelector('[data-search]');
const searchClear = document.querySelector('[data-search-clear]');
const searchToggle = document.querySelector('[data-search-toggle]');
const searchPanel = document.querySelector('[data-search-panel]');
const getSearchToggleLabelEl = () => {
  if (!searchToggle) {
    return null;
  }
  const existing = searchToggle.querySelector('[data-search-toggle-label]');
  if (existing) {
    return existing;
  }

  const label = document.createElement('span');
  label.setAttribute('data-search-toggle-label', '');
  label.textContent = (searchToggle.textContent || '').trim() || 'Cerca';

  Array.from(searchToggle.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = '';
    }
  });

  searchToggle.appendChild(label);
  return label;
};

const searchToggleLabelEl = getSearchToggleLabelEl();
const searchToggleLabelClosed = searchToggle
  ? (searchToggle.dataset.labelClosed
    || (searchToggleLabelEl ? (searchToggleLabelEl.textContent || '').trim() : (searchToggle.textContent || '').trim())
    || 'Cerca')
  : 'Cerca';
const searchToggleLabelOpen = searchToggle
  ? (searchToggle.dataset.labelOpen || 'Chiudi')
  : 'Chiudi';
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

const scrollToTopInstant = () => {
  const root = document.documentElement;
  const prev = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.style.scrollBehavior = prev;
};

const forceStartAtTop = () => {
  if (location.hash) {
    history.replaceState(null, '', location.pathname + location.search);
  }
  scrollToTopInstant();
};

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('pageshow', () => {
  forceStartAtTop();
});

const cart = new Map();
const menuItems = new Map();
const itemButtons = new Map();
const slugCounts = new Map();
const cardQtyEls = new Map();
const customTypeBaseKey = new Map();
const orderEl = document.querySelector('#ordine');
const themeButtons = document.querySelectorAll('.theme-option');
const themeStorageKey = 'gusto-theme';
const themeClasses = Array.from(themeButtons)
  .map((button) => button.dataset.theme)
  .filter(Boolean);

let activeFilter = 'all';
let searchQuery = '';
let activeModalType = null;
let searchPanelBottomOffset = 0;

const applyTheme = (theme) => {
  const targets = [document.documentElement, document.body].filter(Boolean);
  if (!targets.length || !themeClasses.length) {
    return;
  }

  targets.forEach((target) => {
    themeClasses.forEach((className) => target.classList.remove(className));
    if (theme) {
      target.classList.add(theme);
    }
  });

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
  { value: 'mozzarella', label: 'Mozzarella di bufala' },
  { value: 'stracciatella', label: 'Stracciatella' },
  { value: 'prosciutto-cotto', label: 'Prosc. cotto' },
  { value: 'prosciutto-crudo', label: 'Prosc. crudo' },
  { value: 'salsiccia', label: 'Salsiccia' },
  { value: 'salamino', label: 'Salamino' },
  { value: 'nduja', label: "N'duja" },
  { value: 'wurstel', label: 'Wurstel' },
  { value: 'pancetta', label: 'Pancetta' },
  { value: 'speck', label: 'Speck' },
  { value: 'champignon', label: 'Champignon' },
  { value: 'porcini', label: 'Porcini' },
  { value: 'carciofi', label: 'Carciofi' },
  { value: 'olive', label: 'Olive' },
  { value: 'cipolla', label: 'Cipolla' },
  { value: 'porri', label: 'Porri' },
  { value: 'brie', label: 'Brie' },
  { value: 'zucchine', label: 'Zucchine' },
  { value: 'melanzane', label: 'Melanzane' },
  { value: 'gorgonzola', label: 'Gorgonzola' },
  { value: 'grana', label: 'Grana' },
  { value: 'rucola', label: 'Rucola' },
  { value: 'pomodorini', label: 'Pomodorini' },
];

const customizationConfigs = {
  pizza: {
    title: 'Pizza personalizzata',
    subtitle: 'Base covaccino, bianca, rossa  o margherita. Ingredienti extra: € 1 ciascuno. Senza lattosio: nessun supplemento.',
    fields: [
      {
        id: 'base',
        label: 'Base',
        type: 'select',
        required: true,
        defaultValue: 'margherita',
        options: [
          { value: 'covaccino', label: 'Covaccino', price: 5 },
          { value: 'bianca', label: 'Bianca', price: 6 },
          { value: 'rossa', label: 'Rossa', price: 6 },
          { value: 'margherita', label: 'Margherita', price: 6 },
        ],
      },
      {
        id: 'ingredienti',
        label: 'Ingredienti extra (€ 1 ciascuno)',
        type: 'checkbox',
        pricePerItem: 1,
        options: ingredientOptions,
      },
      {
        id: 'glutenfree',
        label: 'Impasto senza glutine (€ 1)',
        type: 'checkbox',
        pricePerItem: 1,
        options: [{ value: 'senza-glutine', label: 'Senza glutine' }],
      },
      {
        id: 'lactosefree',
        label: 'Senza lattosio',
        type: 'checkbox',
        pricePerItem: 0,
        options: [{ value: 'senza-lattosio', label: 'Senza lattosio' }],
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
    subtitle: 'Ripieno a scelta. Ingredienti extra: € 1 ciascuno. Senza lattosio: nessun supplemento.',
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
        label: 'Ripieno extra (€ 1 ciascuno)',
        type: 'checkbox',
        pricePerItem: 1,
        options: ingredientOptions,
      },
      {
        id: 'glutenfree',
        label: 'Impasto senza glutine (€ 1)',
        type: 'checkbox',
        pricePerItem: 1,
        options: [{ value: 'senza-glutine', label: 'Senza glutine' }],
      },
      {
        id: 'lactosefree',
        label: 'Senza lattosio',
        type: 'checkbox',
        pricePerItem: 0,
        options: [{ value: 'senza-lattosio', label: 'Senza lattosio' }],
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
        defaultValue: 'tanqueray',
        options: [
          { value: 'tanqueray', label: 'Tanqueray', price: 5 },
          { value: 'bombay', label: 'Bombay', price: 6 },
          { value: 'mare', label: 'Gin Mare', price: 7 },
          { value: 'selva', label: 'Selvapura', price: 7 },
          { value: 'vallombrosa', label: 'Gin Vallombrosa', price: 8 },
          { value: 'ginepraio', label: 'Ginepraio', price: 7.5 },
          { value: 'num', label: 'Num. 3', price: 7.5 },
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
  bottiglia: {
    title: 'Varie in bottiglia',
    subtitle: 'Seleziona una bibita.',
    fields: [
      {
        id: 'bibite',
        label: 'Bibite',
        type: 'radio',
        required: true,
        pricePerItem: 2.5,
        options: [
          { value: 'coca', label: 'Coca' },
          { value: 'coca-zero', label: 'Coca Zero' },
          { value: 'fanta', label: 'Fanta' },
          { value: 'sprite', label: 'Sprite' },
          { value: 'lemon', label: 'Lemon' },
          { value: 'tonica', label: 'Tonica' },
          { value: 'chinotto', label: 'Chinotto' },
          { value: 'cedrata', label: 'Cedrata' },
        ],
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
  'acqua-naturale': {
    title: 'Acqua naturale',
    subtitle: 'Scegli formato.',
    fields: [
      {
        id: 'formato',
        label: 'Formato',
        type: 'radio',
        required: true,
        defaultValue: 'mezzo',
        options: [
          { value: 'mezzo', label: '1/2 litro', price: 1 },
          { value: 'litro', label: '1 litro', price: 2 },
        ],
      },
    ],
  },
  'acqua-frizzante': {
    title: 'Acqua frizzante',
    subtitle: 'Scegli formato.',
    fields: [
      {
        id: 'formato',
        label: 'Formato',
        type: 'radio',
        required: true,
        defaultValue: 'mezzo',
        options: [
          { value: 'mezzo', label: '1/2 litro', price: 1 },
          { value: 'litro', label: '1 litro', price: 2 },
        ],
      },
    ],
  },
};

const customItemMap = new Map([
  ['Personalizzata', 'pizza'],
  ['Personalizzato', 'calzone'],
  ['Gin Tonic', 'gin'],
  ['Vino (bottiglia, calice)', 'vino'],
  ['Varie in bottiglia', 'bottiglia'],
  ['Acqua naturale', 'acqua-naturale'],
  ['Acqua frizzante', 'acqua-frizzante'],
]);

const formatPrice = (price) => {
  if (!Number.isFinite(price)) {
    return '';
  }
  const formatted = price.toFixed(2).replace('.', ',');
  return `€ ${formatted}`;
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

const closeInfoPanels = () => {
  document.querySelectorAll('.menu__info-panel.is-open').forEach((panel) => {
    panel.classList.remove('is-open');
    const button = panel.closest('.menu__item')?.querySelector('.menu__info');
    if (button) {
      button.setAttribute('aria-expanded', 'false');
    }
  });
};

const resetOrder = (delayMs = 0) => {
  const doReload = () => {
    window.location.reload();
  };
  if (delayMs > 0) {
    setTimeout(doReload, delayMs);
    return;
  }
  doReload();
};

const startResetCountdown = (button, seconds = 3) => {
  if (!button || button.dataset.countdown === 'true') {
    return;
  }
  const label = button.dataset.resetLabel || button.textContent.trim();
  button.dataset.resetLabel = label;
  let remaining = Number.isFinite(seconds) ? Math.max(1, Math.round(seconds)) : 3;
  button.dataset.countdown = 'true';
  button.classList.add('is-countdown');
  if ('disabled' in button) {
    button.disabled = true;
  }

  const updateLabel = () => {
    button.textContent = `${label} tra ${remaining}`;
  };

  updateLabel();

  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      clearInterval(timer);
      button.textContent = label;
      if ('disabled' in button) {
        button.disabled = false;
      }
      button.classList.remove('is-countdown');
      delete button.dataset.countdown;
      resetOrder(0);
      return;
    }
    updateLabel();
  }, 1000);
};

const preloadLogoSource = (src) => {
  if (!src) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    if (typeof img.decode === 'function') {
      img.decode().then(resolve).catch(resolve);
    } else {
      img.onload = resolve;
      img.onerror = resolve;
    }
  });
};

const initLogoSwap = () => {
  const logos = document.querySelectorAll('img[data-logo-primary][data-logo-secondary]');
  logos.forEach((logo) => {
    const primary = logo.dataset.logoPrimary || '';
    const secondary = logo.dataset.logoSecondary || '';
    preloadLogoSource(primary);
    preloadLogoSource(secondary);
    logo.addEventListener('click', () => {
      if (logo.dataset.swapping === 'true') {
        return;
      }
      if (!primary || !secondary) {
        return;
      }
      const currentSrc = logo.getAttribute('src') || '';
      const isPrimary = currentSrc.endsWith(primary);
      const nextSrc = isPrimary ? secondary : primary;
      logo.dataset.swapping = 'true';
      preloadLogoSource(nextSrc).then(() => {
        logo.classList.remove('is-swapping');
        void logo.offsetWidth;
        logo.classList.add('is-swapping');
        const duration = parseFloat(getComputedStyle(logo).animationDuration) || 0.8;
        const durationMs = duration * 1000;
        const swapDelay = Math.max(0, durationMs * 0.5);
        setTimeout(() => {
          logo.src = nextSrc;
        }, swapDelay);
        logo.addEventListener(
          'animationend',
          () => {
            logo.classList.remove('is-swapping');
            delete logo.dataset.swapping;
          },
          { once: true }
        );
      });
    });
  });
};

const formatItemLabel = (item) => {
  const baseName = item && item.nome ? item.nome : 'Piatto';
  const note = item && item.customNote ? String(item.customNote).trim() : '';
  if (!note) {
    return baseName;
  }
  const normalized = normalizeText(note);
  const hasGlutenFree = normalized.includes('senza glutine');
  const hasLactoseFree = normalized.includes('senza lattosio');
  if (hasGlutenFree || hasLactoseFree) {
    const onlyFlags =
      normalized.replace(/senza glutine|senza lattosio|\||,|;|\s+/g, '').trim() === '';
    if (onlyFlags) {
      const flags = [
        hasGlutenFree ? 'senza glutine' : null,
        hasLactoseFree ? 'senza lattosio' : null,
      ].filter(Boolean);
      return `${baseName} - ${flags.join(', ')}`;
    }
  }
  return `${baseName} - ${note}`;
};

const shortenOrderLabel = (label, maxLength = 56) => {
  const text = String(label || '')
    .replace(/\s+/g, ' ')
    .replace(/^ingredienti:\s*/i, 'Ingredienti: ')
    .trim();
  if (!text) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }

  const stopWords = new Set([
    'e',
    'ed',
    'con',
    'senza',
    'di',
    'del',
    'della',
    'dello',
    'dei',
    'degli',
    'delle',
    'al',
    'allo',
    'alla',
    'ai',
    'agli',
    'alle',
    'da',
    'in',
    'su',
    'per',
    'il',
    'lo',
    'la',
    'i',
    'gli',
    'le',
  ]);

  const abbreviations = new Map([
    ['ingredienti:', 'Ing.'],
    ['salsiccia', 'sals.'],
    ['friarielli', 'friar.'],
    ['prosciutto', 'prosc.'],
    ['mozzarella', 'mozz.'],
    ['pomodoro', 'pomod.'],
    ['funghi', 'fung.'],
    ['peperoni', 'peper.'],
    ['cipolla', 'cipol.'],
    ['patatine', 'patat.'],
    ['melanzane', 'melan.'],
    ['zucchine', 'zucc.'],
    ['wurstel', 'wurst.'],
  ]);

  const abbreviateToken = (token) => {
    const match = token.match(/^(.+?)([.,;:!?)]*)$/);
    const word = match ? match[1] : token;
    const punctuation = match ? match[2] : '';
    const normalized = word.toLowerCase();
    if (abbreviations.has(normalized)) {
      return `${abbreviations.get(normalized)}${punctuation}`;
    }
    if (word.length <= 4) {
      return `${word}${punctuation}`;
    }
    if (word.length <= 7) {
      return `${word.slice(0, 4)}.${punctuation}`;
    }
    return `${word.slice(0, 5)}.${punctuation}`;
  };

  const tokens = text.split(' ');
  const out = [];
  for (const token of tokens) {
    const normalized = token.toLowerCase().replace(/[.,;:!?)]*$/g, '');
    if (out.length > 1 && stopWords.has(normalized)) {
      continue;
    }
    out.push(abbreviateToken(token));
    const built = out.join(' ');
    if (built.length >= maxLength) {
      break;
    }
  }

  let result = out.join(' ').trim();
  if (result.length > maxLength) {
    result = result.slice(0, Math.max(0, maxLength - 1)).trimEnd();
  }
  if (!result.endsWith('…')) {
    result = `${result}…`;
  }
  return result;
};

const groupCartItems = (entries) => {
  const grouped = new Map();
  const categoryOrder = categories.map((group) => group.categoria);
  const orderIndex = new Map(categoryOrder.map((name, index) => [name, index]));

  entries.forEach((entry) => {
    const category = entry.item && entry.item.category ? entry.item.category : 'Personalizzati';
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category).push(entry);
  });

  const orderedCategories = Array.from(grouped.keys()).sort((a, b) => {
    const aIndex = orderIndex.has(a) ? orderIndex.get(a) : Number.MAX_SAFE_INTEGER;
    const bIndex = orderIndex.has(b) ? orderIndex.get(b) : Number.MAX_SAFE_INTEGER;
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }
    return a.localeCompare(b);
  });

  return { grouped, orderedCategories };
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
  const searchToggleInline = filtersEl.querySelector('[data-search-toggle]');
  filtersEl.innerHTML = '';
  if (searchToggleInline) {
    filtersEl.appendChild(searchToggleInline);
  }
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

  const allergens = Array.isArray(item.allergeni) ? item.allergeni.filter(Boolean) : [];
  const hasDescription = Boolean(item.descrizione);
  const hasAllergens = allergens.length > 0;

  let infoButton = null;
  let infoPanel = null;
  if (hasDescription || hasAllergens) {
    if (hasAllergens && !hasDescription) {
      card.classList.add('menu__item--allergens-only');
    }
    const infoId = `info-${key.replace(/[^a-z0-9]+/gi, '-')}`;
    infoButton = document.createElement('button');
    infoButton.type = 'button';
    infoButton.className = 'menu__info';
    infoButton.setAttribute('aria-label', 'Info');
    infoButton.setAttribute('aria-expanded', 'false');
    infoButton.setAttribute('aria-controls', infoId);
    infoButton.textContent = 'i';

    infoPanel = document.createElement('div');
    infoPanel.className = 'menu__info-panel';
    infoPanel.id = infoId;
    infoPanel.setAttribute('role', 'tooltip');

    if (hasDescription) {
      const infoText = document.createElement('p');
      infoText.className = 'menu__info-text';
      infoText.innerHTML = sanitizeDescription(item.descrizione);
      infoPanel.appendChild(infoText);
    }

    if (hasAllergens) {
      const infoAllergens = document.createElement('div');
      infoAllergens.className = 'menu__info-allergens';

      const infoLabel = document.createElement('span');
      infoLabel.className = 'menu__info-label';
      infoLabel.textContent = 'Allergeni';
      infoAllergens.appendChild(infoLabel);

      allergens.forEach((allergen) => {
        const badge = document.createElement('span');
        badge.className = 'menu__allergen';
        badge.textContent = allergenLabels[allergen] || allergen;
        infoAllergens.appendChild(badge);
      });
      infoPanel.appendChild(infoAllergens);
    }

    infoButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = infoPanel.classList.contains('is-open');
      closeInfoPanels();
      if (!isOpen) {
        infoPanel.classList.add('is-open');
        infoButton.setAttribute('aria-expanded', 'true');
      }
    });

    infoPanel.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    card.appendChild(infoButton);
    card.appendChild(infoPanel);
  }

  const customType = customItemMap.get(item.nome);
  const isCustom = Boolean(customType);
  const basePrice = Number(item.prezzo);
  const hasBasePrice = Number.isFinite(basePrice);
  const togglesWrap = document.createElement('div');
  togglesWrap.className = 'menu__toggles';
  let hasToggles = false;

  let glutenInput = null;
  let lactoseInput = null;
  const categoryName = normalizeText(category.categoria || '');

  if (!isCustom && categoryName.includes('pizze')) {
    const hasGluten = allergens.includes('glutine');
    if (hasGluten) {
      const glutenWrap = document.createElement('label');
      glutenWrap.className = 'menu__gluten';

      glutenInput = document.createElement('input');
      glutenInput.type = 'checkbox';
      glutenInput.className = 'menu__gluten-input';

      const glutenText = document.createElement('span');
      glutenText.textContent = 'Senza glutine';

      glutenWrap.appendChild(glutenInput);
      glutenWrap.appendChild(glutenText);
      togglesWrap.appendChild(glutenWrap);
      hasToggles = true;
    }
  }

  if (!isCustom && (categoryName.includes('pizze') || categoryName.includes('calzoni'))) {
    const hasDairy = allergens.includes('latte');
    if (hasDairy) {
      const lactoseWrap = document.createElement('label');
      lactoseWrap.className = 'menu__lactose';
      if (glutenInput) {
        lactoseWrap.classList.add('menu__lactose--stacked');
      }

      lactoseInput = document.createElement('input');
      lactoseInput.type = 'checkbox';
      lactoseInput.className = 'menu__lactose-input';

      const lactoseText = document.createElement('span');
      lactoseText.textContent = 'Senza lattosio';

      lactoseWrap.appendChild(lactoseInput);
      lactoseWrap.appendChild(lactoseText);
      togglesWrap.appendChild(lactoseWrap);
      hasToggles = true;
    }
  }

  if (hasToggles) {
    content.appendChild(togglesWrap);
  }

  const meta = document.createElement('div');
  meta.className = 'menu__meta';

  const price = document.createElement('span');
  price.className = 'menu__price';
  if (isCustom) {
    price.classList.add('menu__price--custom');
    const label = document.createElement('span');
    label.className = 'menu__price-label';
    label.textContent = 'A partire da';

    const value = document.createElement('span');
    value.className = 'menu__price-value';
    value.textContent = formatPrice(basePrice);

    price.append(label, value);
  } else {
    price.textContent = formatPrice(basePrice);
  }

  meta.appendChild(price);
  content.appendChild(meta);

  const updateDisplayedPrice = () => {
    if (!hasBasePrice) {
      return;
    }
    const extra = glutenInput && glutenInput.checked ? 1 : 0;
    price.textContent = formatPrice(basePrice + extra);
  };

  if (glutenInput) {
    glutenInput.addEventListener('change', updateDisplayedPrice);
  }
  if (lactoseInput) {
    lactoseInput.addEventListener('change', updateDisplayedPrice);
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
    if (event.target.closest('.menu__lactose')) {
      return;
    }
    if (event.target.closest('.menu__info') || event.target.closest('.menu__info-panel')) {
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
    const modifiers = [];
    const notes = [];
    let priceExtra = 0;
    if (glutenInput && glutenInput.checked) {
      modifiers.push('gluten');
      notes.push('Senza glutine');
      priceExtra += 1;
    }
    if (lactoseInput && lactoseInput.checked) {
      modifiers.push('lactose');
      notes.push('Senza lattosio');
    }

    if (modifiers.length) {
      targetKey = `${key}::${modifiers.join('::')}`;
      if (!menuItems.has(targetKey)) {
        menuItems.set(targetKey, {
          ...item,
          prezzo: basePrice + priceExtra,
          customNote: notes.join(' | '),
          category: category.categoria,
          baseKey: key,
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
  const isSearching = Boolean(query);
  let anyVisible = false;
  let firstVisibleSection = null;

  document.querySelectorAll('.menu__section').forEach((section) => {
    const sectionMatches = isSearching || activeFilter === 'all' || section.dataset.section === activeFilter;
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
      if (!firstVisibleSection) {
        firstVisibleSection = section;
      }
    }
  });

  if (menuEmptyEl) {
    menuEmptyEl.style.display = anyVisible ? 'none' : 'block';
  }

  if (isSearching && firstVisibleSection) {
    requestAnimationFrame(() => {
      firstVisibleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
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

  quickTotalEl.textContent = formatPrice(total) || '€ 0,00';
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

  const { grouped, orderedCategories } = groupCartItems(items);

  orderedCategories.forEach((category) => {
    const heading = document.createElement('li');
    heading.className = 'order__category';
    heading.textContent = category;
    orderListEl.appendChild(heading);

    grouped.get(category).forEach((entry) => {
      const itemRow = document.createElement('li');
      itemRow.className = 'order__item';

      const detail = document.createElement('span');
      detail.className = 'order__detail';
      const qty = document.createElement('span');
      qty.className = 'order__qty';
      qty.textContent = `${entry.qty}x`;

      const label = document.createElement('span');
      label.className = 'order__label';
      const fullLabel = formatItemLabel(entry.item);
      label.textContent = shortenOrderLabel(fullLabel);
      label.title = fullLabel;

      detail.appendChild(qty);
      detail.appendChild(label);

      const meta = document.createElement('div');
      meta.className = 'order__item-meta';

      const price = document.createElement('span');
      price.textContent = formatPrice(entry.lineTotal) || '€ 0,00';

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'order__remove';
      remove.append('Rimuovi');
      remove.addEventListener('click', () => removeFromCart(entry.key));

      meta.appendChild(price);
      meta.appendChild(remove);

      itemRow.appendChild(detail);
      itemRow.appendChild(meta);

      orderListEl.appendChild(itemRow);
    });
  });

  orderTotalEl.textContent = formatPrice(total) || '€ 0,00';
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
  let category = item.category;
  if (!category && baseKey && menuItems.has(baseKey)) {
    category = menuItems.get(baseKey).category;
  }
  const storedItem = baseKey ? { ...item, baseKey, category } : { ...item, category };
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

  const lines = [];

  const customerName = document.querySelector('[data-field="customer-name"]');
  const customerTable = document.querySelector('[data-field="customer-table"]');
  const customerNote = document.querySelector('[data-field="customer-note"]');
  const staffTable = document.querySelector('[data-field="staff-table"]');
  const staffCovers = document.querySelector('[data-field="staff-covers"]');
  const staffSurname = document.querySelector('[data-field="staff-surname"]');
  const staffNote = document.querySelector('[data-field="staff-note"]');

  if (scope === 'customer' && customerName && customerName.value.trim()) {
    lines.push(`*Nome:* ${customerName.value.trim()}`);
  }

  if (scope === 'customer' && customerTable && customerTable.value.trim()) {
    lines.push(`*Tavolo:* ${customerTable.value.trim()}`);
  }

  if (scope === 'staff' && staffTable && staffTable.value.trim()) {
    lines.push(`*Tavolo:* ${staffTable.value.trim()}`);
  }

  if (scope === 'staff' && staffCovers && staffCovers.value.trim()) {
    lines.push(`*Coperti:* ${staffCovers.value.trim()}`);
  }

  if (scope === 'staff' && staffSurname && staffSurname.value.trim()) {
    lines.push(`*Cognome:* ${staffSurname.value.trim()}`);
  }

  const { grouped, orderedCategories } = groupCartItems(items);
  if (lines.length) {
    lines.push('');
  }

  orderedCategories.forEach((category, index) => {
    let categoryTotal = 0;
    lines.push(`*${category}*`);
    grouped.get(category).forEach((entry) => {
      const price = Number(entry.item.prezzo);
      const lineTotal = Number.isFinite(price) ? price * entry.qty : 0;
      categoryTotal += lineTotal;
      lines.push(`- ${entry.qty}x ${formatItemLabel(entry.item)}`);
    });
    lines.push(`Totale ${category}: ${formatPrice(categoryTotal)}`);
    if (index < orderedCategories.length - 1) {
      lines.push('');
    }
  });

  lines.push(`*Totale ordine:* ${formatPrice(total)}`);

  const note = scope === 'staff' ? staffNote : customerNote;
  if (note && note.value.trim()) {
    lines.push('');
    lines.push(`*Note:* ${note.value.trim()}`);
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

const buildRadioField = (field) => {
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
    input.type = 'radio';
    input.name = `modal-${field.id}`;
    input.dataset.modalRadio = field.id;
    input.dataset.label = option.label;
    input.value = option.value;
    if (Number.isFinite(option.price)) {
      input.dataset.price = String(option.price);
    }
    if (field.defaultValue !== undefined && option.value === field.defaultValue) {
      input.checked = true;
    }

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
      if (field.required && !items.length) {
        isValid = false;
      }
      const extras = items.length * (field.pricePerItem || 0);
      baseTotal += extras;
      values[field.id] = { items, total: extras };
    }

    if (field.type === 'radio') {
      const input = modalBodyEl.querySelector(`input[data-modal-radio="${field.id}"]:checked`);
      const value = input ? input.value : '';
      const label = input ? input.dataset.label || input.value : '';
      const price = Number(input && input.dataset.price);
      if (field.required && !value) {
        isValid = false;
      }
      if (Number.isFinite(price)) {
        baseTotal += price;
      } else if (value) {
        baseTotal += field.pricePerItem || 0;
      }
      values[field.id] = {
        value,
        label,
        price: Number.isFinite(price) ? price : value ? field.pricePerItem || 0 : 0,
      };
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

  modalTotalEl.textContent = formatPrice(state.total) || '€ 0,00';
  modalAddButton.disabled = !state.isValid;
};

const resetSearchPanelClamp = () => {
  if (!searchPanel) {
    return;
  }
  searchPanel.classList.remove('is-clamped');
  searchPanel.style.position = '';
  searchPanel.style.top = '';
  searchPanel.style.bottom = '';
};

const updateSearchPanelMetrics = () => {
  if (!searchPanel) {
    return;
  }
  if (searchPanel.classList.contains('is-clamped')) {
    return;
  }
  const computedBottom = parseFloat(getComputedStyle(searchPanel).bottom);
  if (Number.isFinite(computedBottom)) {
    searchPanelBottomOffset = Math.max(0, computedBottom);
    return;
  }
  const rect = searchPanel.getBoundingClientRect();
  if (rect.height) {
    searchPanelBottomOffset = Math.max(0, window.innerHeight - rect.bottom);
  }
};

const clampSearchPanel = () => {
  if (!searchPanel || !orderEl) {
    return;
  }
  if (!searchPanel.classList.contains('is-open')) {
    if (!searchPanel.classList.contains('is-closing')) {
      resetSearchPanelClamp();
    }
    return;
  }

  updateSearchPanelMetrics();

  const panelHeight = searchPanel.offsetHeight || 0;
  const orderRect = orderEl.getBoundingClientRect();
  const orderStart = window.scrollY + orderRect.top;
  const gapPad = 12;
  const maxTop = orderStart - panelHeight - gapPad;
  const fixedTop = window.scrollY + window.innerHeight - searchPanelBottomOffset - panelHeight;

  if (fixedTop < maxTop) {
    resetSearchPanelClamp();
    return;
  }

  const top = Math.max(0, maxTop);

  searchPanel.style.position = 'absolute';
  searchPanel.style.top = `${top}px`;
  searchPanel.style.bottom = 'auto';
  searchPanel.classList.add('is-clamped');
};

const handleSearchPanelTransition = (event) => {
  if (!searchPanel || event.propertyName !== 'opacity') {
    return;
  }
  if (searchPanel.classList.contains('is-open')) {
    return;
  }
  if (!searchPanel.classList.contains('is-closing')) {
    return;
  }
  searchPanel.classList.remove('is-closing');
  resetSearchPanelClamp();
};

const setSearchPanelOpen = (isOpen) => {
  if (!searchPanel || !searchToggle) {
    return;
  }
  searchPanel.classList.toggle('is-open', isOpen);
  searchToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  if (searchToggleLabelEl) {
    searchToggleLabelEl.textContent = isOpen ? searchToggleLabelOpen : searchToggleLabelClosed;
  }
  searchToggle.classList.toggle('is-active', isOpen);
  if (isOpen && searchInput) {
    searchInput.focus();
  }
  if (!isOpen) {
    searchPanel.classList.add('is-closing');
    if (searchInput) {
      searchInput.value = '';
      searchInput.blur();
    }
    searchQuery = '';
    applyFilters();
    return;
  }
  searchPanel.classList.remove('is-closing');
  requestAnimationFrame(() => {
    updateSearchPanelMetrics();
    clampSearchPanel();
  });
};

const adjustQtyInput = (button) => {
  const rawStep = button.dataset.qtyStep;
  let step = Number(rawStep);
  if (!Number.isFinite(step)) {
    if (rawStep === 'up') {
      step = 1;
    } else if (rawStep === 'down') {
      step = -1;
    } else {
      const text = (button.textContent || '').trim();
      step = text.includes('-') ? -1 : 1;
    }
  }
  const wrapper = button.closest('.qty-stepper');
  const input = wrapper ? wrapper.querySelector('input[type="number"]') : null;
  if (!input) {
    return;
  }
  const min = Math.max(1, Number(input.min) || 1);
  const rawMax = input.max;
  const max = rawMax === '' ? null : Number(rawMax);
  const stepSize = Number(input.step) || 1;
  const current = Number(input.value) || min;
  let next = current + step * stepSize;
  next = Math.max(min, next);
  if (max !== null && Number.isFinite(max)) {
    next = Math.min(max, next);
  }
  input.value = String(next);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  syncQtyStepper(input);
};

const syncQtyStepper = (input) => {
  if (!input) {
    return;
  }
  const wrapper = input.closest('.qty-stepper');
  if (!wrapper) {
    return;
  }
  const min = Math.max(1, Number(input.min) || 1);
  const rawMax = input.max;
  const max = rawMax === '' ? null : Number(rawMax);
  const value = Number(input.value) || min;
  const downButton = wrapper.querySelector('[data-qty-step="-1"], [data-qty-step="down"]');
  const upButton = wrapper.querySelector('[data-qty-step="1"], [data-qty-step="up"]');

  if (downButton) {
    downButton.disabled = value <= min;
  }
  if (upButton) {
    upButton.disabled = max !== null && Number.isFinite(max) ? value >= max : false;
  }
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
    if (values.lactosefree && values.lactosefree.items.length) {
      notes.push('Senza lattosio');
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
    if (values.lactosefree && values.lactosefree.items.length) {
      notes.push('Senza lattosio');
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

  if (type === 'bottiglia') {
    nome = 'Varie in bottiglia';
    const scelta = values.bibite ? values.bibite.label : '';
    if (scelta) {
      notes.push(`Scelta: ${scelta}`);
    }
  }

  if (type === 'acqua-naturale' || type === 'acqua-frizzante') {
    const formato = values.formato ? values.formato.label : '';
    nome = type === 'acqua-naturale' ? 'Acqua naturale' : 'Acqua frizzante';
    if (formato) {
      nome = `${nome} ${formato}`;
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
    if (field.type === 'radio') {
      modalBodyEl.appendChild(buildRadioField(field));
    }
    if (field.type === 'text') {
      modalBodyEl.appendChild(buildTextField(field));
    }
  });

  if (modalQtyEl) {
    modalQtyEl.value = 1;
    syncQtyStepper(modalQtyEl);
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
  initLogoSwap();

  const mappedCategories = categories.map((group) => ({
    ...group,
    slug: uniqueSlug(group.categoria),
  }));

  buildFilters(mappedCategories);
  buildSections(mappedCategories);
  renderLegend();
  const defaultCategory = mappedCategories.find(
    (group) => normalizeText(group.categoria) === 'caffetteria'
  );
  if (defaultCategory) {
    setActiveFilter(defaultCategory.slug);
  } else {
    applyFilters();
  }

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
      const nextFilter = button.dataset.filter;
      const filter = nextFilter === activeFilter ? 'all' : nextFilter;
      setActiveFilter(filter);
      scrollToSection(filter);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchQuery = event.target.value;
      applyFilters();
    });
    searchInput.addEventListener('focus', () => {
      setSearchPanelOpen(true);
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
  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      if (!searchPanel) {
        return;
      }
      const nextState = !searchPanel.classList.contains('is-open');
      setSearchPanelOpen(nextState);
    });
  }
  if (searchInput && searchInput.value.trim()) {
    setSearchPanelOpen(true);
  }

  if (searchPanel) {
    searchPanel.addEventListener('transitionend', handleSearchPanelTransition);
    window.addEventListener('scroll', clampSearchPanel, { passive: true });
    window.addEventListener('resize', () => {
      resetSearchPanelClamp();
      updateSearchPanelMetrics();
      clampSearchPanel();
    });
  }

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => handleWhatsApp(button));
  });

  resetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      startResetCountdown(button, 3);
    });
  });

  if (modalBodyEl) {
    modalBodyEl.addEventListener('input', updateModalTotal);
    modalBodyEl.addEventListener('change', updateModalTotal);
  }

  if (modalQtyEl) {
    modalQtyEl.addEventListener('input', (event) => {
      syncQtyStepper(event.target);
      updateModalTotal();
    });
    modalQtyEl.addEventListener('change', (event) => {
      syncQtyStepper(event.target);
      updateModalTotal();
    });
  }

  if (modalAddButton) {
    modalAddButton.addEventListener('click', handleModalAdd);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-qty-step]');
    if (!button) {
      return;
    }
    event.preventDefault();
    adjustQtyInput(button);
  });

  modalCloseButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('click', (event) => {
    if (event.target.closest('.menu__info') || event.target.closest('.menu__info-panel')) {
      return;
    }
    closeInfoPanels();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (modalEl && modalEl.classList.contains('is-open')) {
        closeModal();
      }
      closeInfoPanels();
    }
  });

  updateCartUI();
};

init();
