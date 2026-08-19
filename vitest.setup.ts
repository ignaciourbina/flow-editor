import '@testing-library/jest-dom/vitest';

// Provide a localStorage implementation for Zustand persist middleware.
// jsdom's built-in Storage can be incomplete depending on the version.
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });
