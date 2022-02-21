const handlemissing = require('./handlemissing');
const GetData = require('./testdata');
test('test handle missing data', () => {
  const data = GetData();
  expect(handlemissing.HandleMissingData(data)).toBeTruthy();
});