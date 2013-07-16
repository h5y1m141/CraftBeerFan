var mapWindow;

mapWindow = (function() {

  function mapWindow() {
    var ActivityIndicator, Config, ad, adView, config, keyColor, mapWindowTitle, nend, platform, refreshLabel,
      _this = this;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: keyColor
    };
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
      width: 320,
      height: 50,
      bottom: 0,
      left: 0
    });
    mapWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: "#333",
      font: {
        fontSize: 18,
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
      left: 0
    });
    if (Ti.Platform.osname === 'iphone' && Ti.Platform.displayCaps.platformHeight === 480) {
      platform = 'iPhone4s';
      this.mapView.height = 364;
    } else {
      platform = 'iPhone5';
      this.mapView.height = 452;
    }
    this.mapView.addEventListener('click', function(e) {
      var ShopDataDetailWindow, data, shopDataDetailWindow;
      Ti.API.info("map view click event");
      if (e.clicksource === "rightButton") {
        data = {
          name: e.title,
          shopAddress: e.annotation.shopAddress,
          phoneNumber: e.annotation.phoneNumber,
          latitude: e.annotation.latitude,
          longitude: e.annotation.longitude
        };
        ShopDataDetailWindow = require("ui/shopDataDetailWindow");
        return shopDataDetailWindow = new ShopDataDetailWindow(data);
      }
    });
    refreshLabel = Ti.UI.createLabel({
      backgroundColor: "transparent",
      color: this.baseColor.backgroundColor,
      width: 28,
      height: 28,
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe14d")
    });
    refreshLabel.addEventListener('click', function(e) {
      var that;
      that = _this;
      that.activityIndicator.show();
      return Titanium.Geolocation.getCurrentPosition(function(e) {
        var latitude, longitude;
        if (e.error) {
          Ti.API.info(e.error);
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
    });
    mapWindow.rightNavButton = refreshLabel;
    if (Ti.Platform.osname === 'iphone') {
      mapWindow.setTitleControl(mapWindowTitle);
    }
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
          subtitle: "",
          image: "ui/image/bottle.png",
          animate: false,
          leftButton: "",
          rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
        });
        _results.push(this.mapView.addAnnotation(annotation));
      } else {
        annotation = Titanium.Map.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          title: data.shopName,
          phoneNumber: data.phoneNumber,
          shopAddress: data.shopAddress,
          subtitle: "",
          image: "ui/image/tumblrIcon.png",
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
