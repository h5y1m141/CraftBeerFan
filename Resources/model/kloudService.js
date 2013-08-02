var kloudService,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

kloudService = (function() {

  function kloudService() {
    this.reviewsQuery = __bind(this.reviewsQuery, this);

    this.reviewsCreate = __bind(this.reviewsCreate, this);
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

  kloudService.prototype.cbFanLogin = function(userID, password, callback) {
    this.Cloud.Users.login({
      login: userID,
      password: password
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype.fbLogin = function(callback) {
    var fb;
    fb = require('facebook');
    return this.Cloud.SocialIntegrations.externalAccountLogin({
      type: "facebook",
      token: fb.accessToken
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype.reviewsCreate = function(ratings, contents, shopName, currentUserId, callback) {
    var that;
    that = this.Cloud;
    Ti.API.info("reviewsCreate start shopName is " + shopName);
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
        Ti.API.info("placeID is " + id + ". and ratings is " + ratings + " and contents is " + contents + " and currentUserId is " + currentUserId);
        if (ratings === void 0) {
          ratings = 0;
        }
        if (contents === "" || contents === null) {
          contents = "no data";
        }
        return that.Reviews.create({
          rating: ratings,
          content: contents,
          place_id: id,
          user_id: currentUserId,
          custom_fields: {
            place_id: id
          }
        }, function(result) {
          if (e.success) {
            return callback(result);
          } else {
            return callback(result);
          }
        });
      } else {
        return Ti.API.info("Error:\n");
      }
    });
  };

  kloudService.prototype.reviewsQuery = function(callback) {
    var placeIDList, shopLists, that, userID;
    userID = Ti.App.Properties.getString("currentUserId");
    Ti.API.info("reviewsQuery start.userID is " + userID);
    shopLists = [];
    placeIDList = [];
    that = this.Cloud;
    return this.Cloud.Reviews.query({
      page: 1,
      per_page: 50,
      response_json_depth: 5,
      where: {
        user_id: userID
      }
    }, function(e) {
      var i, item, length, placeQueryCounter, review, timerId, _i, _len;
      Ti.API.info("お気に入り情報が見つかったのでお店のデータを取得。お店の件数:" + e.reviews.length);
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
            return shopLists.push(data);
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
    });
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

  kloudService.prototype.signUP = function(userID, password, callback) {
    return this.Cloud.Users.create({
      username: userID,
      email: userID,
      password: password,
      password_confirmation: password
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype.getCurrentUserInfo = function(currentUserId, callback) {
    return this.Cloud.Users.show({
      user_id: currentUserId
    }, function(result) {
      return callback(result);
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

  return kloudService;

})();

module.exports = kloudService;
