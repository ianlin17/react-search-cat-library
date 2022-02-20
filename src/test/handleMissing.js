function HandleMissingData(breeds) {
  for (var i = 0; i < breeds.length; i++) {
    const { weight, reference_image_id } = breeds[i];
    breeds[i] = _addIndex(breeds[i], i);
    if (!weight) breeds[i] = _setFakeWeight(breeds[i]);
    if (!reference_image_id) breeds[i] = _setMissingImg(breeds[i]);
  }
	return breeds;
};

export default HandleMissingData