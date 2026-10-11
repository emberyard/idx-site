import './styles.css';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'idx-site.theme';
const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: light)');

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function current(): Theme {
  return stored() ?? (media.matches ? 'light' : 'dark');
}

/** Screenshots ship in both themes: `data-dark` / `data-light` hold the two sources. */
function swapImages(theme: Theme): void {
  for (const img of document.querySelectorAll<HTMLImageElement>('img[data-dark][data-light]')) {
    const next = theme === 'light' ? img.dataset.light : img.dataset.dark;
    if (next && img.getAttribute('src') !== next) img.setAttribute('src', next);
  }
}

function apply(theme: Theme): void {
  root.setAttribute('data-theme', theme);
  swapImages(theme);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    toggle.setAttribute('aria-pressed', String(theme === 'light'));
  }
}

apply(current());

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next: Theme = current() === 'light' ? 'dark' : 'light';
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  apply(next);
});

media.addEventListener('change', () => {
  if (!stored()) apply(current());
});

// Mobile nav.
const menuButton = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
menuButton?.addEventListener('click', () => {
  const open = menu?.toggleAttribute('hidden') === false;
  menuButton.setAttribute('aria-expanded', String(open));
});
menu?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) {
    menu.setAttribute('hidden', '');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});
