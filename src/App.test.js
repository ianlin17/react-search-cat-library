import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
test('render page', async () => {
  const page = await render(<App />);;
  const linkElement = page.getByLabelText('Enter');
  expect(linkElement).toBeInTheDocument();
});

test('error message show', async () => {
  const page = await render(<App />);
  const input = page.getByLabelText('Enter');
  await new Promise((r) => setTimeout(r, 500));
  fireEvent(
    input, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  await new Promise((r) => setTimeout(r, 500));
  const placeholder = screen.findByPlaceholderText('ex. Abyssinian');
  const typeingWord = screen.findByDisplayValue(/Typing/i);
  expect(placeholder).toBeTruthy();
  expect(typeingWord).toBeTruthy();
});
