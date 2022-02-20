import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
beforeEach(() => {
  render(<App />);
});

test('render page', () => {
  const linkElement = screen.getByLabelText('Welcome to cat library');
  expect(linkElement).toBeInTheDocument();
});

test('error message show', () => {
  const input = screen.getByTestId('search');
  input.value = 'qqqq';
  fireEvent.change(input);
  const errorMessage = screen.getByTestId('errorMsg');
  expect(errorMessage.value).toBe('No data found with the input: qqqq');
});
