(function() {
  var mapWindow,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  mapWindow = (function() {
    function mapWindow() {
      this.addAnnotations = __bind(this.addAnnotations, this);
      this._nearBy = __bind(this._nearBy, this);
      var ActivityIndicator, KloudService, gpsRule, keyColor;
      keyColor = "#f9f9f9";
      this.baseColor = {
        barColor: keyColor,
        backgroundColor: keyColor
      };
      this.tiGeoHash = require("/lib/TiGeoHash");
      this.precision = 5;
      this.geoHashResult = [];
      KloudService = require("model/kloudService");
      this.kloudService = new KloudService();
      this.MapModule = require('ti.map');
      this.currentLatitude = 35.674819;
      this.currentLongitude = 139.765084;
      this.mapView = this.MapModule.createView({
        mapType: this.MapModule.NORMAL_TYPE,
        region: {
          latitude: 35.676564,
          longitude: 139.765076,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        },
        animate: true,
        userLocation: false,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1
      });
      this.mapView.addEventListener('click', (function(_this) {
        return function(e) {
          var actInd;
          actInd = _this.activityIndicator;
          if (e.clicksource === "rightPane") {
            _this._checkNetworkConnection();
            actInd.show();
            Ti.API.info("placeID is " + e.annotation.placeID);
            return _this.kloudService.statusesQuery(e.annotation.placeID, function(statuses) {
              var ShopDataDetailWindow, data, shopDataDetailWindow;
              actInd.hide();
              Ti.API.info("statuses is " + statuses);
              data = {
                shopName: e.annotation.shopName,
                phoneNumber: e.annotation.phoneNumber,
                latitude: e.annotation.latitude,
                longitude: e.annotation.longitude,
                shopInfo: e.annotation.shopInfo,
                statuses: statuses
              };
              ShopDataDetailWindow = require("ui/android/shopDataDetailWindow");
              shopDataDetailWindow = new ShopDataDetailWindow(data);
              return shopDataDetailWindow.open();
            });
          } else if (e.clicksource === "leftPane") {
            return Ti.Platform.openURL("tel:" + e.annotation.phoneNumber);
          }
        };
      })(this));
      this.mapView.addEventListener('regionchanged', (function(_this) {
        return function(e) {
          var geoHashResult, lastGeoHashValue, latitude, longitude;
          if (Ti.Network.online === false) {
            return alert("利用されてるスマートフォンからインターネットに接続できないためお店の情報が検索できません");
          } else {
            lastGeoHashValue = _this.geoHashResult[_this.geoHashResult.length - 1];
            Ti.API.info("lastGeoHashValue is " + lastGeoHashValue);
            latitude = e.latitude;
            longitude = e.longitude;
            geoHashResult = _this.tiGeoHash.encodeGeoHash(latitude, longitude, _this.precision);
            Ti.API.info("Hash is " + geoHashResult.geohash);
            Ti.API.info("" + geoHashResult.geohash + " " + lastGeoHashValue);
            if (geoHashResult.geohash === lastGeoHashValue) {
              Ti.API.info("regionchanged doesn't fire");
              return _this.geoHashResult.push(geoHashResult.geohash);
            } else {
              Ti.API.info("regionchanged fire");
              Ti.App.Analytics.trackEvent('@mapWindow', 'regionchanged', 'regionchanged', 1);
              _this.geoHashResult.push(geoHashResult.geohash);
              _this.activityIndicator.show();
              return _this._nearBy(latitude, longitude);
            }
          }
        };
      })(this));
      gpsRule = Ti.Geolocation.Android.createLocationRule({
        provider: Ti.Geolocation.PROVIDER_GPS,
        accuracy: 100,
        maxAge: 300000,
        minAge: 10000
      });
      Ti.Geolocation.Android.addLocationRule(gpsRule);
      Ti.Geolocation.addEventListener('location', (function(_this) {
        return function(e) {
          var geoHashResult, latitude, longitude;
          if (e.success) {
            latitude = e.coords.latitude;
            longitude = e.coords.longitude;
            geoHashResult = _this.tiGeoHash.encodeGeoHash(latitude, longitude, _this.precision);
            _this.geoHashResult.push(geoHashResult.geohash);
            _this.mapView.setLocation({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025
            });
            return _this._nearBy(latitude, longitude);
          } else {
            return Ti.API.info(e.error);
          }
        };
      })(this));
      ActivityIndicator = require('ui/android/activitiIndicator');
      this.activityIndicator = new ActivityIndicator();
      this.activityIndicator.hide();
      this.mapWindow = Ti.UI.createWindow({
        title: "近くのお店",
        barColor: this.baseColor.barColor,
        backgroundColor: this.baseColor.backgroundColor,
        navBarHidden: false,
        tabBarHidden: false
      });
      this.mapWindow.add(this.mapView);
      this.mapWindow.add(this.activityIndicator);
      return this.mapWindow;
    }

    mapWindow.prototype._nearBy = function(latitude, longitude) {
      if (Ti.Network.online === false) {
        return alert("利用されてるスマートフォンからインターネットに接続できないためお店の情報が検索できません");
      } else {
        this.activityIndicator.show();
        return this.kloudService.placesQuery(latitude, longitude, (function(_this) {
          return function(data) {
            return _this.addAnnotations(data);
          };
        })(this));
      }
    };

    mapWindow.prototype._selectIcon = function(shopFlg, statusesUpdateFlg) {
      var imagePath, value;
      Ti.API.info("height: " + Ti.Platform.displayCaps.platformHeight);
      if (Ti.Platform.displayCaps.platformHeight > 889) {
        value = "high";
      } else {
        value = "middle";
      }
      if (shopFlg === true) {
        imagePath = "ui/image/android/" + value + "Resolution/bottle.png";
      } else if (shopFlg === false && statusesUpdateFlg === true) {
        imagePath = "ui/image/android/" + value + "Resolution/tmublrWithOnTapInfo.png";
      } else if (shopFlg === false && statusesUpdateFlg === false) {
        imagePath = "ui/image/android/" + value + "Resolution/tmulblr.png";
      } else {
        imagePath = null;
      }
      return imagePath;
    };

    mapWindow.prototype.addAnnotations = function(array) {
      var annotation, currentTime, data, image, informationBtn, moment, phoneBtn, shopFlg, statusesUpdateFlg, _i, _len, _results;
      this.activityIndicator.hide();
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        data = array[_i];
        phoneBtn = Ti.UI.createButton({
          color: "#3261AB",
          backgroundColor: "#f9f9f9",
          width: "30dip",
          height: "30dip",
          font: {
            fontSize: '36dip',
            fontFamily: 'fontawesome-webfont'
          },
          title: String.fromCharCode("0xf095")
        });
        informationBtn = Ti.UI.createButton({
          color: "#FF5E00",
          backgroundColor: "#f9f9f9",
          width: "30dip",
          height: "30dip",
          font: {
            fontSize: '36dip',
            fontFamily: 'ligaturesymbols'
          },
          title: String.fromCharCode("0xE075")
        });
        moment = require("lib/moment.min");
        currentTime = moment();
        if (data.statusesUpdate === false || typeof data.statusesUpdate === "undefined") {
          statusesUpdateFlg = false;
        } else if (currentTime.diff(data.statusesUpdate) < 80000) {
          statusesUpdateFlg = false;
        } else {
          statusesUpdateFlg = true;
        }
        if (data.shopFlg === "false") {
          shopFlg = false;
        } else {
          shopFlg = true;
        }
        image = this._selectIcon(shopFlg, statusesUpdateFlg);
        annotation = this.MapModule.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          shopName: data.shopName,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          shopInfo: data.shopInfo,
          shopFlg: data.shopFlg,
          placeID: data.id,
          title: data.shopName,
          leftView: phoneBtn,
          rightView: informationBtn,
          image: image
        });
        _results.push(this.mapView.addAnnotation(annotation));
      }
      return _results;
    };

    mapWindow.prototype._checkNetworkConnection = function() {
      var timerId;
      return timerId = setInterval(function() {
        Ti.API.info("Network Connection is " + Ti.Network.online);
        if (Ti.Network.online === false) {
          clearInterval(timerId);
        }
      }, 1000);
    };

    return mapWindow;

  })();

  module.exports = mapWindow;

}).call(this);
