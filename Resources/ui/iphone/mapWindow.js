(function() {
  var mapWindow;

  mapWindow = (function() {
    function mapWindow() {
      var ActivityIndicator, keyColor, refreshLabel;
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
      this.shopInfoView = Ti.UI.createView({
        width: Ti.UI.FULL,
        height: "20%",
        bottom: -30,
        left: 0,
        backgroundColor: "#f3f3f3",
        opacity: 0.9,
        zIndex: 10,
        visible: false
      });
      this.shopInfoView.addEventListener('click', (function(_this) {
        return function(e) {
          var animation, animation1, t1, t2;
          t1 = Titanium.UI.create2DMatrix();
          animation = Titanium.UI.createAnimation();
          animation.transform = t1;
          animation.duration = 400;
          animation.height = "50%";
          _this.shopInfoView.animate(animation, function() {
            return Ti.API.info("done");
          });
          t2 = Titanium.UI.create2DMatrix();
          animation1 = Titanium.UI.createAnimation();
          animation1.transform = t2;
          animation1.duration = 500;
          animation1.height = "50%";
          return _this.mapView.animate(animation1, function() {
            return Ti.API.info("done");
          });
        };
      })(this));
      this.shopName = Ti.UI.createLabel({
        color: "#333",
        font: {
          fontSize: 18,
          weight: "bold"
        },
        top: 5,
        left: 50,
        width: "80%",
        height: 20
      });
      this.icon = Ti.UI.createImageView({
        top: 10,
        left: 10
      });
      this.shopCategory = Ti.UI.createLabel({
        color: "#333",
        font: {
          fontSize: 14
        },
        top: 30,
        left: 50
      });
      this.phoneNumber = Ti.UI.createLabel({
        color: "#333",
        font: {
          fontSize: 14
        },
        top: 30,
        left: 200
      });
      this.shopInfo = Ti.UI.createLabel({
        color: "#333",
        font: {
          fontSize: 12
        },
        top: 55,
        left: 10,
        width: "90%",
        height: 30
      });
      this.shopInfoView.add(this.shopName);
      this.shopInfoView.add(this.shopCategory);
      this.shopInfoView.add(this.phoneNumber);
      this.shopInfoView.add(this.shopInfo);
      this.shopInfoView.add(this.icon);
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
          var data;
          Ti.API.info("mapView event fire e.annotation.imagePath is " + e.annotation.imagePath + " and title is " + e.title);
          data = {
            shopName: e.annotation.shopName,
            imagePath: e.annotation.imagePath,
            phoneNumber: e.annotation.phoneNumber,
            latitude: e.annotation.latitude,
            longitude: e.annotation.longitude,
            shopInfo: e.annotation.shopInfo
          };
          return _this._showShopInfo(data);
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
      mapWindow.add(this.shopInfoView);
      this._getGeoCurrentPosition();
      return mapWindow;
    }

    mapWindow.prototype._nearBy = function(latitude, longitude) {
      var KloudService, kloudService, that;
      that = this;
      KloudService = require("model/kloudService");
      kloudService = new KloudService();
      return kloudService.placesQuery(latitude, longitude, function(data) {
        Ti.API.info("data is " + data);
        return that.addAnnotations(data);
      });
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

    mapWindow.prototype._showShopInfo = function(data) {
      var animation, t1;
      Ti.API.info("#imagePath is " + data.imagePath + " and Name is " + data.shopName);
      if (data.imagePath === "ui/image/tumblrIcon.png") {
        this.shopCategory.text = "飲めるお店";
      } else {
        this.shopCategory.text = "買えるお店";
      }
      this.phoneNumber.text = data.phoneNumber;
      this.shopInfo.text = data.shopInfo;
      this.shopName.text = data.shopName;
      this.icon.setImage(data.imagePath);
      t1 = Titanium.UI.create2DMatrix();
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 1000;
      animation.bottom = 30;
      return this.shopInfoView.animate(animation, (function(_this) {
        return function() {
          return _this.shopInfoView.show();
        };
      })(this));
    };

    mapWindow.prototype._changeStatusShopInfoView = function(status) {
      var animation, t1;
      if (status === "hide") {
        t1 = Titanium.UI.create2DMatrix();
        animation = Titanium.UI.createAnimation();
        animation.transform = t1;
        animation.duration = 500;
        animation.bottom = 30;
        return this.shopInfoView.animate(animation, (function(_this) {
          return function() {
            return _this.shopInfoView.show();
          };
        })(this));
      } else {
        t1 = Titanium.UI.create2DMatrix();
        animation = Titanium.UI.createAnimation();
        animation.transform = t1;
        animation.duration = 500;
        animation.bottom = -30;
        return this.shopInfoView.animate(animation, (function(_this) {
          return function() {
            return _this.shopInfoView.hide();
          };
        })(this));
      }
    };

    mapWindow.prototype.addAnnotations = function(array) {
      var annotation, data, _i, _len, _results;
      Ti.API.info("addAnnotations start mapView is " + this.mapView);
      this.activityIndicator.hide();
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        data = array[_i];
        Ti.API.info(data.shopName);
        if (data.shopFlg === "true") {
          annotation = this.MapModule.createAnnotation({
            latitude: data.latitude,
            longitude: data.longitude,
            shopName: data.shopName,
            title: data.shopName,
            phoneNumber: data.phoneNumber,
            shopAddress: data.shopAddress,
            shopInfo: data.shopInfo,
            subtitle: "",
            imagePath: "ui/image/bottle.png",
            animate: false,
            leftButton: "",
            rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
          });
          this.mapView.addAnnotation(annotation);
          _results.push(Ti.API.info(annotation));
        } else {
          annotation = this.MapModule.createAnnotation({
            latitude: data.latitude,
            longitude: data.longitude,
            shopName: data.shopName,
            title: data.shopName,
            phoneNumber: data.phoneNumber,
            shopAddress: data.shopAddress,
            shopInfo: data.shopInfo,
            subtitle: "",
            imagePath: "ui/image/tumblrIcon.png",
            animate: false,
            leftButton: "",
            rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
          });
          _results.push(this.mapView.addAnnotation(annotation));
        }
      }
      return _results;
    };

    return mapWindow;

  })();

  module.exports = mapWindow;

}).call(this);
