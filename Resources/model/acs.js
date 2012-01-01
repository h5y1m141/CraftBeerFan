var acs;

acs = (function() {

  function acs() {
    this.Cloud = require('ti.cloud');
  }

  acs.prototype.placesQuery = function(latitude, longitude, callback) {
    Ti.API.info("startplacesQuery");
    return this.Cloud.Places.query({
      page: 1,
      per_page: 20,
      where: {
        lnglat: {
          $nearSphere: [longitude, latitude],
          $maxDistance: 0.01
        }
      }
    }, function(e) {
      var data, i, place, result;
      if (e.success) {
        result = [];
        i = 0;
        while (i < e.places.length) {
          place = e.places[i];
          data = {
            latitude: place.latitude,
            longitude: place.longitude,
            title: place.name,
            phoneNumber: place.phone_number,
            shopAddress: place.address
          };
          result.push(data);
          i++;
        }
        return callback(result);
      } else {
        return Ti.API.info("Error:\n" + ((e.error && e.message) || JSON.stringify(e)));
      }
    });
  };

  return acs;

})();

module.exports = acs;
