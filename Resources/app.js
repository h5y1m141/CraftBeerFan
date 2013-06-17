var Cloud, baseColor, mapView, mapWindow, mapWindowTitle, shopData, shopDataDetail, shopDataDetailTable, shopDataTab, shopDataTableView, shopDataWindow, shopDataWindowTitle, tab, tabGroup;

Cloud = require('ti.cloud');

shopDataTableView = require('ui/shopDataTableView');

shopDataDetail = require("ui/shopDataDetail");

shopDataDetail = new shopDataDetail();

shopDataDetailTable = shopDataDetail.getTable();

baseColor = {
  barColor: "#f9f9f9",
  backgroundColor: "#343434",
  keyColor: "#EDAD0B"
};

shopDataWindowTitle = Ti.UI.createLabel({
  textAlign: 'center',
  color: '#333',
  font: {
    fontSize: '18sp',
    fontFamily: 'Rounded M+ 1p',
    fontWeight: 'bold'
  },
  text: "都道府県別リスト"
});

shopDataWindow = Ti.UI.createWindow({
  title: "都道府県別リスト",
  barColor: baseColor.barColor,
  backgroundColor: baseColor.backgroundColor
});

shopDataWindow.setTitleControl(shopDataWindowTitle);

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
  barColor: baseColor.barColor,
  backgroundColor: baseColor.backgroundColor
});

mapWindow.setTitleControl(mapWindowTitle);

mapView = Titanium.Map.createView({
  mapType: Titanium.Map.STANDARD_TYPE,
  region: {
    latitude: 35.676564,
    longitude: 139.765076,
    latitudeDelta: 1.0,
    longitudeDelta: 1.0
  },
  animate: true,
  regionFit: true,
  userLocation: true
});

mapView.addEventListener('click', function(e) {
  var activeTab, backButton, _win, _winTitle;
  if (e.clicksource === "rightButton") {
    Ti.API.info("map view event fire");
    _win = Ti.UI.createWindow({
      barColor: baseColor.barColor,
      backgroundColor: baseColor.backgroundColor
    });
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: "44sp",
      height: "44sp"
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
    _win.setTitleControl(_winTitle);
    _win.add(shopDataDetailTable);
    shopDataDetail.setData(e);
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
          width: "26dip",
          height: "40dip",
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

mapWindow.add(mapView);

tabGroup = Ti.UI.createTabGroup({
  tabsBackgroundColor: "#f9f9f9",
  tabsBackgroundFocusedColor: baseColor.keyColor,
  tabsBackgroundImage: "ui/image/tabbar.png",
  activeTabBackgroundImage: "ui/image/activetab.png",
  shadowImage: "ui/image/shadowimage.png"
});

tabGroup.addEventListener('focus', function(e) {
  tabGroup._activeTab = e.tab;
  tabGroup._activeTabIndex = e.index;
  if (tabGroup._activeTabIndex === -1) {
    return;
  }
  Ti.API._activeTab = tabGroup._activeTab;
  Ti.API.info(tabGroup._activeTab);
});

tab = Ti.UI.createTab({
  window: mapWindow,
  barColor: "#343434",
  icon: "ui/image/inactivePin.png",
  activeIcon: "ui/image/pin.png"
});

shopData = new shopDataTableView();

shopDataWindow.add(shopData);

shopDataTab = Ti.UI.createTab({
  window: shopDataWindow,
  barColor: "#343434",
  icon: "ui/image/inactivePin.png",
  activeIcon: "ui/image/pin.png"
});

tabGroup.addTab(tab);

tabGroup.addTab(shopDataTab);

tabGroup.open();
