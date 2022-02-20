import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import GetData from './test/testdata';
import HandleMissingData from './test/handleMissing';
import { mockComponent } from 'react-dom/test-utils';
beforeEach(() => {
  render(<App />);
});

test('render page', () => {
  const linkElement = screen.getByLabelText('Click me to start!');
  expect(linkElement).toBeInTheDocument();
});

// test('error message show', () => {
//   const input = screen.getByTestId('search');
//   input.value = 'qqqq';
//   fireEvent.change(input);
//   jest.fn(() => jest.setTimeout(() => {}), 1500);
//   mock
//   const errorMessage = screen.getByTestId('errorMsg');
//   expect(errorMessage.value).toBe('No data found with the input: qqqq');
// });

// test('check data', () => {
//   const rawData = GetData();
//   const handledData = HandleMissingData(rawData)
//   handledData.map(value => {
//     expect(value).toHaveProperty('index');
//   })
// });
