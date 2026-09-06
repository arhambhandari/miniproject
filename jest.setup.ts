import '@testing-library/jest-dom';

// Polyfill IntersectionObserver for framer-motion in test environment
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
  constructor(public callback: IntersectionObserverCallback) {}
};
