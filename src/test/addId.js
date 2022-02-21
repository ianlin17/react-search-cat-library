const addId = {
  _setMissingImg: function(breed) {
    return { ...breed, reference_image_id: "" };
  }
};
module.exports = addId;