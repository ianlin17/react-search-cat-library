const handlemissing = require('./handlemissing');
const GetData = require('./testdata');
test('test handle missing data', () => {
  const originData = GetData();
  const testData = JSON.parse(JSON.stringify(originData));
  const modifiedData = handlemissing.HandleMissingData(testData);
  expect(originData).not.toEqual(modifiedData);
});