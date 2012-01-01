var mapWindow;

mapWindow = (function() {

  function mapWindow() {
    var Config, ad, adView, config, mapWindowTitle, nend, platform, refreshButton, refreshLabel,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      keyColor: "#EDAD0B"
    };
    ad = require('net.nend');
    Config = require("model/loadConfig");
    config = new Config();
    nend = config.getNendData();
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
      color: '#333',
      font: {
        fontSize: '18sp',
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
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
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
      var data;
      if (e.clicksource === "rightButton") {
        data = {
          name: e.title,
          shopAddress: e.annotation.shopAddress,
          phoneNumber: e.annotation.phoneNumber,
          latitude: e.annotation.latitude,
          longitude: e.annotation.longitude
        };
        return mainController.updateShopDataDetailWindow(data);
      }
    });
    refreshButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    refreshButton.addEventListener('click', function(e) {
      var that;
      that = _this;
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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
        return that._nearBy(latitude, longitude);
      });
    });
    refreshLabel = Ti.UI.createLabel({
      backgroundColor: "#3261AB",
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe103")
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
    return mapWindow;
  }

  mapWindow.prototype._nearBy = function(latitude, longitude) {
    var ACS, acs, that;
    that = this;
    ACS = require("model/acs");
    acs = new ACS();
    return acs.placesQuery(latitude, longitude, function(data) {
      return that.addAnnotations(data);
    });
  };

  mapWindow.prototype.addAnnotations = function(array) {
    var annotation, data, tumblrImage, _i, _len;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      data = array[_i];
      tumblrImage = Titanium.UI.createImageView({
        width: 20,
        height: 40,
        image: "ui/image/tumblr.png"
      });
      annotation = Titanium.Map.createAnnotation({
        latitude: data.latitude,
        longitude: data.longitude,
        title: data.name,
        phoneNumber: data.phone_number,
        shopAddress: data.address,
        subtitle: "",
        image: "ui/image/tumblrIcon.png",
        animate: false,
        leftButton: "",
        rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
      });
      this.mapView.addAnnotation(annotation);
    }
  };

  return mapWindow;

})();

module.exports = mapWindow;
