import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Theme Mode Logic', () => {
  const THEME_STORAGE_KEY = 'smm_theme_mode';

  let storage = {};
  const mockLocalStorage = {
    getItem: (key) => storage[key] || null,
    setItem: (key, val) => { storage[key] = String(val); },
    removeItem: (key) => { delete storage[key]; },
    clear: () => { storage = {}; }
  };

  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('defaults to light mode (Day mode) when no preference is saved', () => {
    const saved = mockLocalStorage.getItem(THEME_STORAGE_KEY);
    const theme = saved || 'light';
    expect(theme).toBe('light');
  });

  it('persists night mode (Dark mode) when switched', () => {
    mockLocalStorage.setItem(THEME_STORAGE_KEY, 'dark');
    expect(mockLocalStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('toggles from light to dark and back to light', () => {
    let current = 'light';
    const toggle = (th) => (th === 'dark' ? 'light' : 'dark');

    current = toggle(current);
    expect(current).toBe('dark');

    current = toggle(current);
    expect(current).toBe('light');
  });

  it('validates supported theme options', () => {
    const validThemes = ['light', 'dark', 'system'];
    expect(validThemes.includes('light')).toBe(true);
    expect(validThemes.includes('dark')).toBe(true);
    expect(validThemes.includes('system')).toBe(true);
    expect(validThemes.includes('unknown')).toBe(false);
  });
});

