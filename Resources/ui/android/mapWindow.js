var mapWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mapWindow = (function() {

  function mapWindow() {
    this.addAnnotations = __bind(this.addAnnotations, this);

    var ActivityIndicator, Config, ad, adView, config, displayHeight, gpsRule, keyColor, mapViewHeight, mapWindowTitle, nend,
      _this = this;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: keyColor
    };
    this.MapModule = require('ti.map');
    this.currentLatitude = 35.676564;
    this.currentLongitude = 139.765076;
    ad = require('net.nend');
    Config = require("model/loadConfig");
    config = new Config();
    nend = config.getNendData();
    ActivityIndicator = require('ui/android/activitiIndicator');
    this.activityIndicator = new ActivityIndicator();
    this.activityIndicator.hide();
    adView = ad.createView({
      spotId: nend.spotId,
      apiKey: nend.apiKey,
      width: Titanium.Platform.displayCaps.platformWidth,
      height: '50dip',
      bottom: '1dip',
      left: 0,
      zIndex: 10
    });
    mapWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: "#333",
      font: {
        fontSize: '18dip',
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "近くのお店"
    });
    mapWindow = Ti.UI.createWindow({
      title: "近くのお店",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    displayHeight = Ti.Platform.displayCaps.platformHeight;
    displayHeight = displayHeight / Ti.Platform.displayCaps.logicalDensityFactor;
    mapViewHeight = displayHeight - 50;
    Ti.API.info("displayHeight is " + displayHeight + "and mapViewHeight is " + mapViewHeight);
    this.mapview = this.MapModule.createView({
      mapType: this.MapModule.NORMAL_TYPE,
      region: {
        latitude: 35.676564,
        longitude: 139.765076,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      },
      animate: true,
      userLocation: false,
      width: Ti.UI.FULL,
      height: "514dip",
      zIndex: 1
    });
    this.mapview.addEventListener('click', function(e) {
      var ShopDataDetailWindow, data, favoriteButtonEnable, shopDataDetailWindow;
      Ti.API.info("mapview event fire!!");
      if (e.clicksource === "title") {
        favoriteButtonEnable = false;
        data = {
          shopName: e.title,
          shopAddress: e.annotation.shopAddress,
          phoneNumber: e.annotation.phoneNumber,
          latitude: e.annotation.latitude,
          longitude: e.annotation.longitude,
          shopInfo: e.annotation.shopInfo,
          favoriteButtonEnable: favoriteButtonEnable
        };
        ShopDataDetailWindow = require("ui/android/shopDataDetailWindow");
        shopDataDetailWindow = new ShopDataDetailWindow(data);
        return shopDataDetailWindow.open();
      }
    });
    this.mapview.addEventListener('regionchanged', function(e) {
      var distance, latitude, longitude;
      latitude = e.latitude;
      longitude = e.longitude;
      distance = _this.currentLatitude - latitude;
      Ti.API.info("distance is " + distance);
      Ti.API.info("latitude: " + latitude + " and currentLatitude: " + _this.currentLatitude);
      _this.currentLatitude = latitude;
      _this.currentLongitude = longitude;
      return Ti.API.info("refresh done. @currentLatitude is " + _this.currentLatitude);
    });
    gpsRule = Ti.Geolocation.Android.createLocationRule({
      provider: Ti.Geolocation.PROVIDER_GPS,
      accuracy: 100,
      maxAge: 300000,
      minAge: 10000
    });
    Ti.Geolocation.Android.addLocationRule(gpsRule);
    Ti.Geolocation.addEventListener('location', function(e) {
      var latitude, longitude;
      _this.activityIndicator.show();
      if (e.success) {
        latitude = e.coords.latitude;
        longitude = e.coords.longitude;
        _this.mapview.setLocation({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025
        });
        _this.currentLatitude = latitude;
        _this.currentLongitude = longitude;
        Ti.API.info("location event fire .latitude is " + latitude + "and " + longitude);
        return _this._nearBy(latitude, longitude);
      } else {
        Ti.API.info(e.error);
        return _this.activityIndicator.hide();
      }
    });
    mapWindow.add(adView);
    mapWindow.add(this.mapview);
    mapWindow.add(this.activityIndicator);
    return mapWindow;
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

  mapWindow.prototype.addAnnotations = function(array) {
    var annotation, data, _i, _len, _results;
    this.activityIndicator.hide();
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      data = array[_i];
      Ti.API.info("addAnnotations start latitude is " + data.latitude);
      Ti.API.info("shopName is " + data.shopName);
      if (data.shopFlg === "true") {
        annotation = this.MapModule.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          title: data.shopName,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          shopInfo: data.shopInfo,
          image: Titanium.Filesystem.resourcesDirectory + "ui/image/bottle@2x.png"
        });
        _results.push(this.mapview.addAnnotation(annotation));
      } else {
        annotation = this.MapModule.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          title: data.shopName,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          shopInfo: data.shopInfo,
          image: Titanium.Filesystem.resourcesDirectory + "ui/image/tumblrIconForMap.png"
        });
        _results.push(this.mapview.addAnnotation(annotation));
      }
    }
    return _results;
  };

  return mapWindow;

})();

module.exports = mapWindow;
