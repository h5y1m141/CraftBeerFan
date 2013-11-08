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
    this.tiGeoHash = require("/lib/TiGeoHash");
    this.precision = 5;
    this.geoHashResult = [];
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
      bottom: 0,
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
    mapViewHeight = displayHeight - 130;
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
      top: 0,
      left: 0,
      width: Ti.UI.FULL,
      height: mapViewHeight + "dip",
      zIndex: 1
    });
    this.mapview.addEventListener('click', function(e) {
      if (e.clicksource === "leftPane") {
        return Titanium.Platform.openURL("tel:" + e.annotation.phoneNumber);
      }
    });
    this.mapview.addEventListener('regionchanged', function(e) {
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
        Ti.App.Analytics.trackEvent('mapWindow', 'regionchanged', 'regionchanged', 1);
        _this.geoHashResult.push(geoHashResult.geohash);
        _this.activityIndicator.show();
        return _this._nearBy(latitude, longitude);
      }
    });
    gpsRule = Ti.Geolocation.Android.createLocationRule({
      provider: Ti.Geolocation.PROVIDER_GPS,
      accuracy: 100,
      maxAge: 300000,
      minAge: 10000
    });
    Ti.Geolocation.Android.addLocationRule(gpsRule);
    Ti.Geolocation.addEventListener('location', function(e) {
      var geoHashResult, latitude, longitude;
      _this.activityIndicator.show();
      if (e.success) {
        latitude = e.coords.latitude;
        longitude = e.coords.longitude;
        geoHashResult = _this.tiGeoHash.encodeGeoHash(latitude, longitude, _this.precision);
        _this.geoHashResult.push(geoHashResult.geohash);
        _this.mapview.setLocation({
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
      if (data.shopFlg === "true") {
        annotation = this.MapModule.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          title: data.shopName,
          subtitle: data.phoneNumber,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          shopInfo: data.shopInfo,
          shopFlg: data.shopFlg,
          leftView: Ti.UI.createButton({
            color: "#3261AB",
            backgroundColor: "#f9f9f9",
            width: "30dip",
            height: "30dip",
            font: {
              fontSize: '36dip',
              fontFamily: 'fontawesome-webfont'
            },
            title: String.fromCharCode("0xf095")
          }),
          rightView: Ti.UI.createButton({
            color: "#333",
            backgroundColor: "#f9f9f9",
            width: "30dip",
            height: "30dip",
            font: {
              fontSize: '36dip',
              fontFamily: 'ligaturesymbols'
            },
            title: String.fromCharCode("0xE075")
          }),
          image: Titanium.Filesystem.resourcesDirectory + "ui/image/bottle@2x.png"
        });
        _results.push(this.mapview.addAnnotation(annotation));
      } else {
        annotation = this.MapModule.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          title: data.shopName,
          subtitle: data.phoneNumber,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          shopInfo: data.shopInfo,
          shopFlg: data.shopFlg,
          leftView: Ti.UI.createButton({
            color: "#3261AB",
            backgroundColor: "#f9f9f9",
            width: "30dip",
            height: "30dip",
            font: {
              fontSize: '36dip',
              fontFamily: 'fontawesome-webfont'
            },
            title: String.fromCharCode("0xf095")
          }),
          rightView: Ti.UI.createButton({
            color: "#333",
            backgroundColor: "#f9f9f9",
            width: "30dip",
            height: "30dip",
            font: {
              fontSize: '36dip',
              fontFamily: 'ligaturesymbols'
            },
            title: String.fromCharCode("0xE075")
          }),
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
