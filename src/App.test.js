import { render, screen, fireEvent } from '@testing-library/react';
const axios = require('axios');
import App from './App';

test('render page', async () => {
  const page = await render(<App />);
  const linkElement = page.getByLabelText('Click me to start!');
  expect(linkElement).toBeInTheDocument();
});

test('error message show', async () => {
  const page = await render(<App />);
  const input = page.getByLabelText('Click me to start!');
  await new Promise((r) => setTimeout(r, 500));
  fireEvent(
    input, new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
  await new Promise((r) => setTimeout(r, 500));
  const inputt = screen.findByPlaceholderText('ex. Abyssinian')
  const typeingWord = screen.findByDisplayValue(/Typing/i);
  expect(typeingWord).toBeTruthy();
});

// test('check data', () => {
//   const rawData = GetData();
//   const handledData = HandleMissingData(rawData)
//   handledData.map(value => {
//     expect(value).toHaveProperty('index');
//   })
// });
