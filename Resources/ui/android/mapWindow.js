var mapWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mapWindow = (function() {

  function mapWindow() {
    this.addAnnotations = __bind(this.addAnnotations, this);

    var ActivityIndicator, Config, ad, adView, config, displayHeight, keyColor, mapViewHeight, mapWindowTitle, nend, pGps, pNetwork, pPassive,
      _this = this;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: keyColor
    };
    this.MapModule = require('ti.map');
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
      height: "542dip",
      zIndex: 1
    });
    this.mapview.addEventListener('regionchanged', function(e) {
      var that, updateMapTimeout;
      that = _this;
      that.activityIndicator.show();
      if (updateMapTimeout) {
        clearTimeout(updateMapTimeout);
      }
      return updateMapTimeout = setTimeout(function() {
        var latitude, longitude;
        Ti.API.info("regionchanged fire that is " + that);
        Ti.App.Analytics.trackEvent('mapWindow', 'regionchanged', 'regionchanged', 1);
        latitude = e.latitude;
        longitude = e.longitude;
        Ti.API.info("latitude is " + latitude + " and longitude is " + longitude);
        return that._nearBy(latitude, longitude);
      }, 1000);
    });
    pPassive = Ti.Geolocation.Android.createLocationProvider({
      name: Ti.Geolocation.PROVIDER_PASSIVE,
      minUpdateDistance: 0.0,
      minUpdateTime: 0
    });
    pNetwork = Ti.Geolocation.Android.createLocationProvider({
      name: Ti.Geolocation.PROVIDER_NETWORK,
      minUpdateDistance: 0.0,
      minUpdateTime: 0
    });
    pGps = Ti.Geolocation.Android.createLocationProvider({
      name: Ti.Geolocation.PROVIDER_GPS,
      minUpdateDistance: 0.0,
      minUpdateTime: 0
    });
    Ti.Geolocation.Android.removeLocationProvider(pPassive);
    Ti.Geolocation.Android.addLocationProvider(pNetwork);
    Ti.Geolocation.Android.addLocationProvider(pGps);
    Ti.Geolocation.Android.manualMode = true;
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

  mapWindow.prototype._getGeoCurrentPosition = function() {
    var that;
    that = this;
    that.activityIndicator.show();
    Titanium.Geolocation.addEventListener('location', function(e) {
      var latitude, longitude;
      if (e.error) {
        Ti.API.info(e.error);
        that.activityIndicator.hide();
        return;
      }
      latitude = e.coords.latitude;
      longitude = e.coords.longitude;
      that.mapview.setLocation({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025
      });
      return that._nearBy(latitude, longitude);
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
