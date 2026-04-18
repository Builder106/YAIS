import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadPrefs, savePrefs, PREFS_STORAGE_KEY } from './AppContext';

function makeMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  } as Storage;
}

beforeEach(() => {
  vi.stubGlobal('window', { localStorage: makeMemoryStorage() } as unknown as Window);
});

describe('AppContext preference persistence', () => {
  it('returns empty object when nothing is stored', () => {
    expect(loadPrefs()).toEqual({});
  });

  it('round-trips role, lang, and currentPatientId through localStorage', () => {
    savePrefs({ role: 'patient', lang: 'fr', currentPatientId: 'PAT-042' });
    expect(loadPrefs()).toEqual({ role: 'patient', lang: 'fr', currentPatientId: 'PAT-042' });
  });

  it('uses the versioned storage key', () => {
    savePrefs({ role: 'admin' });
    const raw = (window as unknown as { localStorage: Storage }).localStorage.getItem(PREFS_STORAGE_KEY);
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!)).toEqual({ role: 'admin' });
  });

  it('rejects unknown roles when loading', () => {
    (window as unknown as { localStorage: Storage }).localStorage.setItem(
      PREFS_STORAGE_KEY,
      JSON.stringify({ role: 'hacker', lang: 'en' })
    );
    expect(loadPrefs()).toEqual({ lang: 'en' });
  });

  it('rejects unknown languages when loading', () => {
    (window as unknown as { localStorage: Storage }).localStorage.setItem(
      PREFS_STORAGE_KEY,
      JSON.stringify({ role: 'doctor', lang: 'xx' })
    );
    expect(loadPrefs()).toEqual({ role: 'doctor' });
  });

  it('returns empty object for malformed JSON', () => {
    (window as unknown as { localStorage: Storage }).localStorage.setItem(PREFS_STORAGE_KEY, '{not json');
    expect(loadPrefs()).toEqual({});
  });

  it('accepts all five supported languages', () => {
    for (const lang of ['en', 'fr', 'ar', 'sw', 'ha'] as const) {
      savePrefs({ lang });
      expect(loadPrefs().lang).toBe(lang);
    }
  });

  it('accepts all three roles', () => {
    for (const role of ['patient', 'doctor', 'admin'] as const) {
      savePrefs({ role });
      expect(loadPrefs().role).toBe(role);
    }
  });
});
