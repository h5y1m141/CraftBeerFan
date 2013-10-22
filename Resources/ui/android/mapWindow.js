var mapWindow;

mapWindow = (function() {

  function mapWindow() {
    var ActivityIndicator, Config, MapModule, ad, adView, config, displayHeight, keyColor, mapViewHeight, mapWindowTitle, mapview, nend,
      _this = this;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: keyColor
    };
    MapModule = require('ti.map');
    mapview = MapModule.createView({
      mapType: MapModule.NORMAL_TYPE
    });
    ad = require('net.nend');
    Config = require("model/loadConfig");
    config = new Config();
    nend = config.getNendData();
    ActivityIndicator = require('ui/activityIndicator');
    this.activityIndicator = new ActivityIndicator();
    this.activityIndicator.hide();
    adView = ad.createView({
      spotId: nend.spotId,
      apiKey: nend.apiKey,
      width: Ti.UI.FULL,
      height: '50dip',
      bottom: '1dip',
      left: '0dip',
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
    this.mapView = Titanium.Map.createView({
      mapType: Titanium.Map.STANDARD_TYPE,
      region: {
        latitude: 35.676564,
        longitude: 139.765076,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025
      },
      animate: true,
      regionFit: true,
      userLocation: true,
      zIndex: 0,
      top: 0,
      left: 0,
      width: Ti.UI.FULL,
      height: mapViewHeight + 'dip'
    });
    this.mapView.addEventListener('click', function(e) {
      var ShopDataDetailWindow, currentUserId, data, favoriteButtonEnable, shopDataDetailWindow;
      Ti.API.info("map view click event");
      currentUserId = Ti.App.Properties.getString("currentUserId");
      if (typeof currentUserId === "undefined" || currentUserId === null) {
        favoriteButtonEnable = false;
      } else {
        favoriteButtonEnable = true;
      }
      data = {
        shopName: e.title,
        shopAddress: e.annotation.shopAddress,
        phoneNumber: e.annotation.phoneNumber,
        latitude: e.annotation.latitude,
        longitude: e.annotation.longitude,
        shopInfo: e.annotation.shopInfo,
        favoriteButtonEnable: favoriteButtonEnable
      };
      mapWindow.remove(_this.mapView);
      _this.mapView = null;
      mapWindow.close();
      ShopDataDetailWindow = require("ui/android/shopDataDetailWindow");
      shopDataDetailWindow = new ShopDataDetailWindow(data);
      return shopDataDetailWindow.open();
    });
    this.mapView.addEventListener('regionchanged', function(e) {
      var that, updateMapTimeout;
      that = _this;
      if (updateMapTimeout) {
        clearTimeout(updateMapTimeout);
      }
      return updateMapTimeout = setTimeout(function() {
        var latitude, longitude, regionData;
        Ti.API.info("regionchanged fire");
        Ti.App.Analytics.trackEvent('mapWindow', 'regionchanged', 'regionchanged', 1);
        that.activityIndicator.show();
        regionData = that.mapView.getRegion();
        latitude = regionData.latitude;
        longitude = regionData.longitude;
        return that._nearBy(latitude, longitude);
      }, 50);
    });
    Ti.Geolocation.purpose = 'クラフトビールのお店情報表示のため';
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    Ti.Geolocation.distanceFilter = 5;
    mapWindow.add(this.mapView);
    mapWindow.add(adView);
    mapWindow.add(this.activityIndicator);
    this._getGeoCurrentPosition();
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
    Titanium.Geolocation.getCurrentPosition(function(e) {
      var latitude, longitude;
      if (e.error) {
        Ti.API.info(e.error);
        that.activityIndicator.hide();
        return;
      }
      latitude = e.coords.latitude;
      longitude = e.coords.longitude;
      that.mapView.setLocation({
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
    Ti.API.info("addAnnotations start mapView is " + this.mapView);
    this.activityIndicator.hide();
    _results = [];
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      data = array[_i];
      if (data.shopFlg === "true") {
        annotation = Titanium.Map.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          title: data.shopName,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          shopInfo: data.shopInfo,
          subtitle: "",
          pincolor: Titanium.Map.ANNOTATION_GREEN,
          animate: false,
          leftButton: "",
          rightButton: ""
        });
        _results.push(this.mapView.addAnnotation(annotation));
      } else {
        annotation = Titanium.Map.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          title: data.shopName,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          shopInfo: data.shopInfo,
          subtitle: "",
          pincolor: Titanium.Map.ANNOTATION_RED,
          animate: false,
          leftButton: "",
          rightButton: ""
        });
        _results.push(this.mapView.addAnnotation(annotation));
      }
    }
    return _results;
  };

  return mapWindow;

})();

module.exports = mapWindow;
