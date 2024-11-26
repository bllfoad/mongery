import React from 'react';
import { render, screen } from './utils/test-utils';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
});
