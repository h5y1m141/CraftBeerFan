(function() {
  var mapWindow;

  mapWindow = (function() {
    function mapWindow() {
      var ActivityIndicator, KloudService, keyColor, refreshLabel;
      keyColor = "#f9f9f9";
      this.baseColor = {
        barColor: keyColor,
        backgroundColor: keyColor
      };
      this.tiGeoHash = require("/lib/TiGeoHash");
      this.precision = 6;
      this.geoHashResult = [];
      ActivityIndicator = require('ui/activityIndicator');
      this.activityIndicator = new ActivityIndicator();
      this.activityIndicator.hide();
      KloudService = require("model/kloudService");
      this.kloudService = new KloudService();
      mapWindow = Ti.UI.createWindow({
        title: "近くのお店",
        barColor: this.baseColor.barColor,
        backgroundColor: this.baseColor.backgroundColor,
        navBarHidden: false,
        tabBarHidden: false
      });
      this.MapModule = require('ti.map');
      this.mapView = this.MapModule.createView({
        mapType: this.MapModule.NORMAL_TYPE,
        region: {
          latitude: 35.676564,
          longitude: 139.765076,
          latitudeDelta: 1,
          longitudeDelta: 1
        },
        animate: true,
        regionFit: true,
        userLocation: true,
        zIndex: 0,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%"
      });
      this.mapView.addEventListener('click', (function(_this) {
        return function(e) {
          if (e.clicksource === 'rightButton') {
            return _this.kloudService.statusesQuery(e.annotation.placeID, function(statuses) {
              var ShopDataDetailWindow, data;
              data = {
                shopName: e.annotation.shopName,
                phoneNumber: e.annotation.phoneNumber,
                latitude: e.annotation.latitude,
                longitude: e.annotation.longitude,
                shopInfo: e.annotation.shopInfo,
                statuses: statuses
              };
              ShopDataDetailWindow = require("ui/iphone/shopDataDetailWindow");
              return new ShopDataDetailWindow(data);
            });
          }
        };
      })(this));
      this.mapView.addEventListener('regionchanged', (function(_this) {
        return function(e) {
          var geoHashResult, lastGeoHashValue, latitude, longitude, regionData;
          lastGeoHashValue = _this.geoHashResult[_this.geoHashResult.length - 1];
          Ti.API.info("lastGeoHashValue is " + lastGeoHashValue);
          regionData = _this.mapView.getRegion();
          latitude = regionData.latitude;
          longitude = regionData.longitude;
          geoHashResult = _this.tiGeoHash.encodeGeoHash(latitude, longitude, _this.precision);
          Ti.API.info("Hash is " + geoHashResult.geohash);
          Ti.API.info("" + geoHashResult.geohash + " " + lastGeoHashValue);
          if (geoHashResult.geohash === lastGeoHashValue) {
            Ti.API.info("regionchanged doesn't fire");
            return _this.geoHashResult.push(geoHashResult.geohash);
          } else {
            Ti.API.info("regionchanged fire");
            Ti.App.Analytics.trackEvent('mapWindow', 'regionchanged', 'regionchanged', 1);
            _this.geoHashResult.push(geoHashResult.geohash);
            _this.activityIndicator.show();
            return _this._nearBy(latitude, longitude);
          }
        };
      })(this));
      refreshLabel = Ti.UI.createLabel({
        backgroundColor: "transparent",
        color: "#333",
        width: 28,
        height: 28,
        font: {
          fontSize: 32,
          fontFamily: 'LigatureSymbols'
        },
        text: String.fromCharCode("0xe14d")
      });
      refreshLabel.addEventListener('click', (function(_this) {
        return function(e) {
          var that;
          that = _this;
          that.activityIndicator.show();
          return Titanium.Geolocation.getCurrentPosition(function(e) {
            var geoHashResult, latitude, longitude;
            if (e.error) {
              Ti.API.info(e.error);
              return;
            }
            latitude = e.coords.latitude;
            longitude = e.coords.longitude;
            geoHashResult = that.tiGeoHash.encodeGeoHash(latitude, longitude, that.precision);
            that.geoHashResult.push(geoHashResult.geohash);
            Ti.API.info("geoHashResult is :" + that.geoHashResult);
            that.mapView.setLocation({
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.5,
              longitudeDelta: 0.5
            });
            return that._nearBy(latitude, longitude);
          });
        };
      })(this));
      Ti.Geolocation.purpose = 'クラフトビールのお店情報表示のため';
      Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
      Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
      Ti.Geolocation.distanceFilter = 5;
      mapWindow.add(this.mapView);
      mapWindow.add(this.activityIndicator);
      this._getGeoCurrentPosition();
      return mapWindow;
    }

    mapWindow.prototype._nearBy = function(latitude, longitude) {
      if (Ti.Network.online === false) {
        return alert("利用されてるスマートフォンからインターネットに接続できないためお店の情報が検索できません");
      } else {
        return this.kloudService.placesQuery(latitude, longitude, (function(_this) {
          return function(data) {
            Ti.API.info("data is " + data);
            return _this.addAnnotations(data);
          };
        })(this));
      }
    };

    mapWindow.prototype._getGeoCurrentPosition = function() {
      var that;
      that = this;
      that.activityIndicator.show();
      Titanium.Geolocation.getCurrentPosition(function(e) {
        var geoHashResult, latitude, longitude;
        if (e.error) {
          Ti.API.info(e.error);
          that.activityIndicator.hide();
          return;
        }
        latitude = e.coords.latitude;
        longitude = e.coords.longitude;
        geoHashResult = that.tiGeoHash.encodeGeoHash(latitude, longitude, that.precision);
        that.geoHashResult.push(geoHashResult.geohash);
        Ti.API.info("geoHashResult is :" + that.geoHashResult);
        that.mapView.setLocation({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
        return that._nearBy(latitude, longitude);
      });
    };

    mapWindow.prototype._calculateLatLngfromPixels = function(xPixels, yPixels) {
      var heightDegPerPixel, heightInPixels, region, widthDegPerPixel, widthInPixels;
      region = this.mapView.actualRegion || this.mapView.region;
      widthInPixels = this.mapView.rect.width;
      heightInPixels = this.mapView.rect.height;
      heightDegPerPixel = -region.latitudeDelta / heightInPixels;
      widthDegPerPixel = region.longitudeDelta / widthInPixels;
      ({
        lat: (yPixels - heightInPixels / 2) * heightDegPerPixel + region.latitude,
        lon: (xPixels - widthInPixels / 2) * widthDegPerPixel + region.longitude
      });
    };

    mapWindow.prototype._selectIcon = function(shopFlg, statusesUpdateFlg) {
      var imagePath;
      if (shopFlg === true) {
        imagePath = "ui/image/bottle.png";
      } else if (shopFlg === false && statusesUpdateFlg === true) {
        imagePath = "ui/image/tmublrWithOnTapInfo.png";
      } else if (shopFlg === false && statusesUpdateFlg === false) {
        imagePath = "ui/image/tmulblr.png";
      } else {
        imagePath = null;
      }
      return imagePath;
    };

    mapWindow.prototype.addAnnotations = function(array) {
      var annotation, currentTime, data, image, moment, shopFlg, statusesUpdateFlg, _i, _len, _results;
      Ti.API.info("addAnnotations start mapView is " + this.mapView);
      this.activityIndicator.hide();
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        data = array[_i];
        Ti.API.info(data.shopName);
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
          title: data.shopName,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          shopInfo: data.shopInfo,
          shopFlg: data.shopFlg,
          placeID: data.id,
          subtitle: "",
          image: image,
          leftButton: "",
          rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
        });
        this.mapView.addAnnotation(annotation);
        Ti.API.info(annotation);
        _results.push(this.mapView.addAnnotation(annotation));
      }
      return _results;
    };

    return mapWindow;

  })();

  module.exports = mapWindow;

}).call(this);
