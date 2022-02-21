const handlemissing = require('./handlemissing');
const GetData = require('./testdata');
test('test handle missing data', () => {
  const data = GetData();
  const modifiedData = handlemissing.HandleMissingData(data);
  expect(data).toMatchObject(modifiedData);
  expect(data).toEqual(modifiedData);
});