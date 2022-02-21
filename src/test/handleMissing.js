const addIndex = require('./addIndex');
const addWeight = require('./addIndex');
const addId = require('./addId');
const handlemissing = {
  HandleMissingData: function(breeds) {
    for (var i = 0; i < breeds.length; i++) {
      const { weight, reference_image_id } = breeds[i];
      breeds[i] = addIndex._addIndex(breeds[i], i);
      if (!weight) breeds[i] = addWeight._setFakeWeight(breeds[i]);
      if (!reference_image_id) breeds[i] = addId._setMissingImg(breeds[i]);
    }
	  return breeds;
  }
};

module.exports = handlemissing;