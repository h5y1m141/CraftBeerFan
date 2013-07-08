var mapWindow;

mapWindow = (function() {

  function mapWindow() {
    var Config, ad, adView, backButton, config, mapView, mapWindowTitle, nend, platform;
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
      tabBarHidden: false
    });
    mapView = Titanium.Map.createView({
      mapType: Titanium.Map.STANDARD_TYPE,
      region: {
        latitude: 35.676564,
        longitude: 139.765076,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
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
    } else {
      platform = 'iPhone5';
    }
    if (platform === 'iPhone4s') {
      mapView.height = 320;
    } else {
      mapView.height = 408;
    }
    mapView.hide();
    mapView.addEventListener('click', function(e) {
      var activeTab, backButton, data, _annotation, _mapView, _win, _winTitle;
      if (e.clicksource === "rightButton") {
        Ti.API.info("map view event fire");
        _win = Ti.UI.createWindow({
          barColor: baseColor.barColor,
          backgroundColor: baseColor.barColor
        });
        backButton = Titanium.UI.createButton({
          backgroundImage: "ui/image/backButton.png",
          width: 44,
          height: 44
        });
        backButton.addEventListener('click', function(e) {
          return _win.close({
            animated: true
          });
        });
        _win.leftNavButton = backButton;
        _winTitle = Ti.UI.createLabel({
          textAlign: 'center',
          color: '#333',
          font: {
            fontSize: '18sp',
            fontFamily: 'Rounded M+ 1p',
            fontWeight: 'bold'
          },
          text: "お店の詳細情報"
        });
        if (Ti.Platform.osname === 'iphone') {
          _win.setTitleControl(_winTitle);
        }
        _annotation = Titanium.Map.createAnnotation({
          latitude: e.annotation.latitude,
          longitude: e.annotation.longitude,
          pincolor: Titanium.Map.ANNOTATION_PURPLE,
          animate: true
        });
        _mapView = Titanium.Map.createView({
          mapType: Titanium.Map.STANDARD_TYPE,
          region: {
            latitude: e.annotation.latitude,
            longitude: e.annotation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          },
          animate: true,
          regionFit: true,
          userLocation: true,
          zIndex: 0,
          top: 0,
          left: 0,
          height: 200,
          width: 'auto'
        });
        _mapView.addAnnotation(_annotation);
        _win.add(_mapView);
        _win.add(cbFan.shopDataDetailTable);
        _win.add(cbFan.activityIndicator);
        data = {
          name: e.title,
          shopAddress: e.annotation.shopAddress,
          phoneNumber: e.annotation.phoneNumber
        };
        shopDataDetail.setData(data);
        shopDataDetail.show();
        activeTab = Ti.API._activeTab;
        return activeTab.open(_win);
      }
    });
    mapView.hide();
    Ti.Geolocation.purpose = 'クラフトビールのお店情報表示のため';
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    Ti.Geolocation.distanceFilter = 5;
    Ti.Geolocation.addEventListener("location", function(e) {
      var latitude, longitude;
      Ti.API.info("latitude: " + e.coords.latitude + "longitude: " + e.coords.longitude);
      latitude = e.coords.latitude;
      longitude = e.coords.longitude;
      mapView.show();
      mapView.setLocation({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      });
      return Cloud.Places.query({
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
              width: "26sp",
              height: "40sp",
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
              rightButton: "ui/image/tumblrIcon.png"
            });
            mapView.addAnnotation(annotation);
            _results.push(i++);
          }
          return _results;
        } else {
          return Ti.API.info("Error:\n" + ((e.error && e.message) || JSON.stringify(e)));
        }
      });
    });
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    backButton.addEventListener('click', function(e) {
      return mapWindow.close({
        animated: true
      });
    });
    mapWindow.leftNavButton = backButton;
    mapWindow.add(mapView);
    mapWindow.add(adView);
    return mapWindow;
  }

  return mapWindow;

})();

module.exports = mapWindow;
