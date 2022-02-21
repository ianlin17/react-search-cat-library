const addWeight = {
  _setFakeWeight: function(breed) {
    return { ...breed, weight: { imperial: "N/A" } };
  }
};
module.exports = addWeight;