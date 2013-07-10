var mapWindow;

mapWindow = (function() {

  function mapWindow() {
    var Config, ad, adView, config, mapWindowTitle, nend, platform, refreshButton,
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
    mapWindow.rightNavButton = refreshButton;
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
    var that;
    Ti.API.info("nearBy start.latitude is" + latitude);
    that = this;
    Cloud.Places.query({
      page: 1,
      per_page: 20,
      where: {
        lnglat: {
          $nearSphere: [longitude, latitude],
          $maxDistance: 0.01
        }
      }
    }, function(e) {
      var annotation, i, place, tumblrImage, _results;
      if (e.success) {
        i = 0;
        _results = [];
        while (i < e.places.length) {
          place = e.places[i];
          tumblrImage = Titanium.UI.createImageView({
            width: 20,
            height: 40,
            image: "ui/image/tumblr.png"
          });
          annotation = Titanium.Map.createAnnotation({
            latitude: place.latitude,
            longitude: place.longitude,
            title: place.name,
            phoneNumber: place.phone_number,
            shopAddress: place.address,
            subtitle: "",
            image: "ui/image/tumblrIcon.png",
            animate: false,
            leftButton: "",
            rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
          });
          that.mapView.addAnnotation(annotation);
          _results.push(i++);
        }
        return _results;
      } else {
        return Ti.API.info("Error:\n" + ((e.error && e.message) || JSON.stringify(e)));
      }
    });
  };

  return mapWindow;

})();

module.exports = mapWindow;
