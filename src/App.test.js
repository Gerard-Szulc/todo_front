import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders TODO app title', () => {
  const { getByText } = render(<App />);
  const titleElement = getByText(/TODO APP/i);
  expect(titleElement).toBeInTheDocument();
});
