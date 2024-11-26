// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// Mock matchMedia for Ant Design
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return false; },
    media: '',
    onchange: null,
  };
};

// Mock ResizeObserver for Ant Design
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = window.ResizeObserver || ResizeObserverMock;

// Mock IntersectionObserver for Ant Design
interface IntersectionObserverMockProps {
  root: Element | null;
  rootMargin: string;
  thresholds: number[];
  observe: () => void;
  unobserve: () => void;
  disconnect: () => void;
}

class IntersectionObserverMock implements IntersectionObserverMockProps {
  root: Element | null;
  rootMargin: string;
  thresholds: number[];

  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = window.IntersectionObserver || IntersectionObserverMock;

// Mock fetch for RTK Query
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    clone: () => ({
      json: () => Promise.resolve({})
    })
  })
) as jest.Mock;

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Suppress specific warnings during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Ignore specific warnings
    if (
      /Warning: ReactDOM.render is no longer supported/.test(args[0]) ||
      /Warning: An update to Component inside a test was not wrapped in act/.test(args[0]) ||
      /Warning: `ReactDOMTestUtils.act` is deprecated/.test(args[0]) ||
      /An unhandled error occurred processing a request for the endpoint/.test(args[0])
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
