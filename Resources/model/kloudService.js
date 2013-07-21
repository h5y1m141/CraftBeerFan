var kloudService;

kloudService = (function() {

  function kloudService() {
    this.Cloud = require('ti.cloud');
  }

  kloudService.prototype.placesQuery = function(latitude, longitude, callback) {
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
            shopName: place.name,
            shopAddress: place.address,
            phoneNumber: place.phone_number,
            shopFlg: place.custom_fields.shopFlg
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

  kloudService.prototype.fbLogin = function(callback) {
    var fb;
    fb = require('facebook');
    fb.appid = this._getAppID();
    fb.permissions = ['read_stream'];
    fb.forceDialogAuth = true;
    fb.addEventListener('login', function(e) {
      var that, token;
      token = fb.accessToken;
      that = this;
      if (e.success) {
        if (e.success) {
          return that.Cloud.SocialIntegrations.externalAccountLogin({
            type: "facebook",
            token: token
          }, function(e) {
            var user;
            if (e.success) {
              user = e.users[0];
              Ti.API.info("User  = " + JSON.stringify(user));
              Ti.App.Properties.setString("currentUserId", user.id);
              return callback(user.id);
            } else {
              return alert("Error: " + ((e.error && e.message) || JSON.stringify(e)));
            }
          });
        }
      } else if (e.error) {
        return alert(e.error);
      } else {
        if (e.cancelled) {
          return alert("Canceled");
        }
      }
    });
    fb.addEventListener('logout', function(e) {
      return alert('logout');
    });
    if (!fb.loggedIn) {
      fb.authorize();
    }
  };

  kloudService.prototype.reviewsCreate = function(ratings, contents, shopName, callback) {
    var that;
    that = this.Cloud;
    this.Cloud.Places.query({
      page: 1,
      per_page: 1,
      where: {
        name: shopName
      }
    }, function(e) {
      var id;
      if (e.success) {
        id = e.places[0].id;
        Ti.API.info("id is " + id + ". and ratings is " + ratings + " and contents is " + contents);
        return that.Reviews.create({
          rating: ratings,
          content: contents,
          place_id: id,
          custom_fields: {
            place_id: id
          }
        }, function(e) {
          if (e.success) {
            return callback("success");
          } else {
            return callback("error");
          }
        });
      } else {
        return Ti.API.info("Error:\n");
      }
    });
  };

  kloudService.prototype.reviewsQuery = function(userID, callback) {
    var placeIDList, shopLists, that;
    shopLists = [];
    placeIDList = [];
    that = this.Cloud;
    return this.Cloud.Reviews.query({
      page: 1,
      per_page: 100,
      response_json_depth: 5,
      user: userID
    }, function(e) {
      var i, item, length, placeQueryCounter, review, timerId, _i, _len;
      if (e.success) {
        i = 0;
        while (i < e.reviews.length) {
          review = e.reviews[i];
          item = {
            placeID: review.custom_fields.place_id,
            content: review.content,
            rating: review.rating
          };
          if (typeof item.placeID !== "undefined") {
            placeIDList.push(item);
          }
          i++;
        }
        length = placeIDList.length;
        placeQueryCounter = 0;
        Ti.API.info("length is " + length);
        for (_i = 0, _len = placeIDList.length; _i < _len; _i++) {
          item = placeIDList[_i];
          that.Places.show({
            place_id: item.placeID
          }, function(e) {
            var data, _;
            placeQueryCounter++;
            data = {};
            if (e.success) {
              _ = require("lib/underscore-1.4.3.min").each(placeIDList, function(v, key) {
                if (v.placeID === e.places[0].id) {
                  return data = {
                    rating: v.rating,
                    content: v.content,
                    shopName: e.places[0].name,
                    shopAddress: e.places[0].address,
                    phoneNumber: e.places[0].phone_number,
                    latitude: e.places[0].latitude,
                    longitude: e.places[0].longitude,
                    shopFlg: e.places[0].custom_fields.shopFlg
                  };
                }
              });
              shopLists.push(data);
              return Ti.API.info(shopLists);
            } else {
              return Ti.API.info("no review data");
            }
          });
        }
        return timerId = setInterval((function() {
          if (placeQueryCounter === length) {
            callback(shopLists);
            return clearInterval(timerId);
          }
        }), 10);
      } else {
        return alert("データ取得できませんでした");
      }
    });
  };

  kloudService.prototype._getAppID = function() {
    var appid, config, file, json;
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json");
    file = config.read().toString();
    json = JSON.parse(file);
    appid = json.facebook.appid;
    return appid;
  };

  kloudService.prototype.findShopDataBy = function(prefectureName, callback) {
    return this.Cloud.Places.query({
      page: 1,
      per_page: 200,
      where: {
        state: prefectureName
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
            shopName: place.name,
            shopAddress: place.address,
            phoneNumber: place.phone_number,
            shopFlg: place.custom_fields.shopFlg
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

  return kloudService;

})();

module.exports = kloudService;
