(function() {
  var mapWindow,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  mapWindow = (function() {
    function mapWindow() {
      this.addAnnotations = __bind(this.addAnnotations, this);
      var ActivityIndicator, gpsRule, keyColor, mapWindowTitle;
      keyColor = "#f9f9f9";
      this.baseColor = {
        barColor: keyColor,
        backgroundColor: keyColor
      };
      this.LANDSCAPE = 0;
      this.PORTRAIT = 1;
      this.displayHeight = Ti.Platform.displayCaps.platformHeight;
      this.displayWidth = Ti.Platform.displayCaps.platformWidth;
      if (this.displayHeight > 1000) {
        this.barHeight = 144;
      } else {
        this.barHeight = 72;
      }
      this.currentDeviceStatus = Ti.Gesture.orientation;
      this.mapViewHight = 0;
      this.tiGeoHash = require("/lib/TiGeoHash");
      this.precision = 5;
      this.geoHashResult = [];
      this.MapModule = require('ti.map');
      this.currentLatitude = 35.674819;
      this.currentLongitude = 139.765084;
      this.container = Ti.UI.createView({
        width: "100%",
        height: "100%",
        top: 0,
        left: 0
      });
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
          var data;
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
          var geoHashResult, lastGeoHashValue, latitude, longitude;
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
          _this.activityIndicator.show();
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
            Ti.API.info(e.error);
            return _this.activityIndicator.hide();
          }
        };
      })(this));
      Ti.Gesture.addEventListener('orientationchange', (function(_this) {
        return function(e) {
          if (Ti.Platform.displayCaps.platformHeight > 1080) {
            _this.height = 144;
          } else {
            _this.height = 72;
          }
          if (_this.currentDeviceStatus === _this.PORTRAIT && e.orientation === _this.PORTRAIT) {
            return _this.mapViewHight = Ti.Platform.displayCaps.platformHeight / 2 - _this.height;
          } else if (_this.currentDeviceStatus === _this.PORTRAIT && e.orientation === _this.LANDSCAPE) {
            return _this.mapViewHight = (Ti.Platform.displayCaps.platformHeight / 2) - (_this.height / 2);
          } else if (_this.currentDeviceStatus === _this.LANDSCAPE && e.orientation === _this.PORTRAIT) {
            return _this.mapViewHight = Ti.Platform.displayCaps.platformHeight / 2 - _this.height;
          } else if (_this.currentDeviceStatus === _this.LANDSCAPE && e.orientation === _this.LANDSCAPE) {
            return _this.mapViewHight = (Ti.Platform.displayCaps.platformHeight / 2) - (_this.height / 2);
          } else {
            return Ti.API.info("cant' set width");
          }
        };
      })(this));
      ActivityIndicator = require('ui/android/activitiIndicator');
      this.activityIndicator = new ActivityIndicator();
      this.activityIndicator.hide();
      this.shopInfoView = Ti.UI.createView({
        width: Ti.UI.FULL,
        height: this.barHeight * 2,
        top: this.displayHeight + 30,
        annotationData: null,
        left: 0,
        backgroundColor: "#f3f3f3",
        zIndex: 10,
        visible: false
      });
      this.shopInfoView.addEventListener('click', (function(_this) {
        return function(e) {
          return _this._showshopInfoDetail();
        };
      })(this));
      this.shopName = Ti.UI.createLabel({
        color: "#333",
        font: {
          fontSize: "18dp",
          weight: "bold"
        },
        top: 100,
        left: 50,
        width: 800,
        height: 100
      });
      this.icon = Ti.UI.createImageView({
        top: 10,
        left: 10
      });
      this.shopCategory = Ti.UI.createLabel({
        color: "#333",
        font: {
          fontSize: "14dp"
        },
        top: 10,
        left: 100
      });
      this.phoneNumber = Ti.UI.createLabel({
        color: "#333",
        font: {
          fontSize: "14dp"
        },
        top: 220,
        left: 50
      });
      this.shopInfo = Ti.UI.createLabel({
        color: "#333",
        font: {
          fontSize: "12dp"
        },
        top: 200,
        left: 50,
        width: this.displayWidth * 0.9,
        height: 40,
        geo: {
          latitude: 0,
          longitude: 0
        }
      });
      this.shopInfoView.add(this.shopName);
      this.shopInfoView.add(this.shopCategory);
      this.shopInfoView.add(this.phoneNumber);
      this.shopInfoView.add(this.shopInfo);
      this.shopInfoView.add(this.icon);
      mapWindowTitle = Ti.UI.createLabel({
        textAlign: 'center',
        color: "#333",
        font: {
          fontSize: '18dp',
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        text: "近くのお店"
      });
      this.mapWindow = Ti.UI.createWindow({
        title: "近くのお店",
        barColor: this.baseColor.barColor,
        backgroundColor: this.baseColor.backgroundColor,
        navBarHidden: false,
        tabBarHidden: false
      });
      this.container.add(this.mapView);
      this.mapWindow.add(this.container);
      this.mapWindow.add(this.activityIndicator);
      this.mapWindow.add(this.shopInfoView);
      return this.mapWindow;
    }

    mapWindow.prototype._nearBy = function(latitude, longitude) {
      var KloudService, kloudService, that;
      that = this;
      KloudService = require("model/kloudService");
      kloudService = new KloudService();
      return kloudService.placesQuery(latitude, longitude, function(data) {
        return that.addAnnotations(data);
      });
    };

    mapWindow.prototype._showshopInfoDetail = function() {
      var animation, animation1, animationSpeed, annotationData, latitude, longitude, mapView, mapViewHeightafterAnimation, t1, t2, that;
      t1 = Titanium.UI.create2DMatrix();
      animation = Titanium.UI.createAnimation();
      animationSpeed = 300;
      animation.transform = t1;
      animation.duration = animationSpeed;
      animation.top = 0;
      this.shopInfoView.height = this.displayHeight;
      t2 = Titanium.UI.create2DMatrix();
      animation1 = Titanium.UI.createAnimation({
        transform: t2,
        duration: animationSpeed,
        top: this.displayHeight / 2,
        left: 0
      });
      mapView = this.mapView;
      latitude = this.shopInfo.geo.latitude;
      longitude = this.shopInfo.geo.longitude;
      annotationData = this.shopInfo.annotationData;
      that = this;
      mapViewHeightafterAnimation = this.displayHeight / 2;
      return this.shopInfoView.animate(animation1, function() {
        mapView.height = mapViewHeightafterAnimation;
        mapView.removeAllAnnotations();
        that.addAnnotations([annotationData]);
      });
    };

    mapWindow.prototype._showShopInfo = function(data) {
      var animation, t1;
      Ti.API.info("#imagePath is " + data.imagePath + " and Name is " + data.shopName);
      if (data.imagePath === "ui/image/tumblrIcon.png" || data.imagePath === "ui/image/tumblrIconForMap.png") {
        this.shopCategory.text = "飲めるお店";
      } else {
        this.shopCategory.text = "買えるお店";
      }
      t1 = Titanium.UI.create2DMatrix();
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 500;
      animation.bottom = "1dp";
      return this.shopInfoView.animate(animation, (function(_this) {
        return function() {
          Ti.API.info("done");
          _this.phoneNumber.text = data.phoneNumber;
          _this.shopInfo.text = data.shopInfo;
          _this.shopInfo.geo.latitude = data.latitude;
          _this.shopInfo.geo.longitude = data.longitude;
          _this.shopInfo.annotationData = data;
          _this.shopName.text = data.shopName;
          _this.icon.setImage(Ti.Filesystem.resourcesDirectory + data.imagePath);
          return _this.shopInfoView.show();
        };
      })(this));
    };

    mapWindow.prototype.addAnnotations = function(array) {
      var annotation, data, _i, _len, _results;
      this.activityIndicator.hide();
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        data = array[_i];
        if (data.shopFlg === "true") {
          annotation = this.MapModule.createAnnotation({
            latitude: data.latitude,
            longitude: data.longitude,
            shopName: data.shopName,
            phoneNumber: data.phoneNumber,
            shopAddress: data.shopAddress,
            shopInfo: data.shopInfo,
            shopFlg: data.shopFlg,
            image: "ui/image/bottle@2x.png",
            imagePath: "ui/image/bottle@2x.png"
          });
          _results.push(this.mapView.addAnnotation(annotation));
        } else {
          annotation = this.MapModule.createAnnotation({
            latitude: data.latitude,
            longitude: data.longitude,
            shopName: data.shopName,
            phoneNumber: data.phoneNumber,
            shopAddress: data.shopAddress,
            shopInfo: data.shopInfo,
            shopFlg: data.shopFlg,
            image: "ui/image/tumblrIconForMap.png",
            imagePath: "ui/image/tumblrIconForMap.png"
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
