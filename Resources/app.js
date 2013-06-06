var Cloud, mapView, mapWindow, tab, tabGroup;

Cloud = require('ti.cloud');

mapWindow = Ti.UI.createWindow({
  title: "お店の情報",
  barColor: "#DD9F00",
  backgroundColor: "#343434"
});

mapView = Titanium.Map.createView({
  mapType: Titanium.Map.STANDARD_TYPE,
  region: {
    latitude: 35.676564,
    longitude: 139.765076,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  },
  animate: true,
  regionFit: true,
  userLocation: true
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
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  });
  return Cloud.Places.query({
    page: 1,
    per_page: 20,
    where: {
      lnglat: {
        $nearSphere: [longitude, latitude],
        $maxDistance: 0.00126
      }
    }
  }, function(e) {
    var annotation, i, place, _results;
    if (e.success) {
      i = 0;
      _results = [];
      while (i < e.places.length) {
        place = e.places[i];
        annotation = Titanium.Map.createAnnotation({
          latitude: place.latitude,
          longitude: place.longitude,
          title: place.name,
          subtitle: "",
          pincolor: Titanium.Map.ANNOTATION_PURPLE,
          animate: false,
          leftButton: "images/atlanta.jpg",
          rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
        });
        Ti.API.info("id: " + place.id + " name:" + place.name);
        mapView.addAnnotation(annotation);
        _results.push(i++);
      }
      return _results;
    } else {
      return Ti.API.info("Error:\n" + ((e.error && e.message) || JSON.stringify(e)));
    }
  });
});

mapWindow.add(mapView);

tabGroup = Ti.UI.createTabGroup();

tab = Ti.UI.createTab({
  window: mapWindow,
  title: '探す',
  icon: "ui/image/marker.png"
});

tabGroup.addTab(tab);

tabGroup.open();
