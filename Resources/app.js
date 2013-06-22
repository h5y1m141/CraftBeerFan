var Cloud, baseColor, categoryName, cbFan, mapTab, mapWindowTitle, selectedColor, selectedSubColor, shopData, shopDataDetail, shopDataTab, shopDataTableView, shopDataWindowTitle, subMenuTable, tabGroup;

cbFan = {};

Cloud = require('ti.cloud');

shopDataTableView = require('ui/shopDataTableView');

subMenuTable = require("ui/subMenuTable");

shopDataDetail = require("ui/shopDataDetail");

shopDataDetail = new shopDataDetail();

cbFan.shopDataDetailTable = shopDataDetail.getTable();

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

cbFan.shopDataWindow = Ti.UI.createWindow({
  title: "都道府県別リスト",
  barColor: baseColor.barColor,
  backgroundColor: baseColor.backgroundColor,
  tabBarHidden: false
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

cbFan.mapWindow = Ti.UI.createWindow({
  title: "近くのお店",
  barColor: baseColor.barColor,
  backgroundColor: baseColor.backgroundColor,
  tabBarHidden: false
});

if (Ti.Platform.osname === 'iphone') {
  cbFan.shopDataWindow.setTitleControl(shopDataWindowTitle);
  cbFan.mapWindow.setTitleControl(mapWindowTitle);
}

cbFan.mapView = Titanium.Map.createView({
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
  zIndex: 0
});

cbFan.mapView.hide();

cbFan.mapView.addEventListener('click', function(e) {
  var activeTab, backButton, _annotation, _mapView, _win, _winTitle;
  if (e.clicksource === "rightButton") {
    Ti.API.info("map view event fire");
    _win = Ti.UI.createWindow({
      barColor: baseColor.barColor,
      backgroundColor: baseColor.backgroundColor
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
      top: 100,
      left: 0,
      height: 250,
      width: 'auto'
    });
    _mapView.addAnnotation(_annotation);
    _win.add(_mapView);
    _win.add(cbFan.shopDataDetailTable);
    shopDataDetail.setData(e);
    shopDataDetail.show();
    activeTab = Ti.API._activeTab;
    return activeTab.open(_win);
  }
});

cbFan.mapView.hide();

Ti.Geolocation.purpose = 'クラフトビールのお店情報表示のため';

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;

Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

Ti.Geolocation.distanceFilter = 5;

Ti.Geolocation.addEventListener("location", function(e) {
  var latitude, longitude;
  Ti.API.info("latitude: " + e.coords.latitude + "longitude: " + e.coords.longitude);
  latitude = e.coords.latitude;
  longitude = e.coords.longitude;
  cbFan.mapView.show();
  cbFan.mapView.setLocation({
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
        cbFan.mapView.addAnnotation(annotation);
        _results.push(i++);
      }
      return _results;
    } else {
      return Ti.API.info("Error:\n" + ((e.error && e.message) || JSON.stringify(e)));
    }
  });
});

tabGroup = Ti.UI.createTabGroup({
  tabsBackgroundColor: "#f9f9f9",
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

shopData = new shopDataTableView();

cbFan.shopData = shopData.getTable();

categoryName = "関東";

selectedColor = "#007FB1";

selectedSubColor = "#CAE7F2";

shopData.refreshTableData(categoryName, selectedColor, selectedSubColor);

cbFan.subMenu = new subMenuTable();

cbFan.arrowImage = Ti.UI.createImageView({
  width: '50sp',
  height: '50sp',
  left: 150,
  top: 35,
  borderRadius: 5,
  transform: Ti.UI.create2DMatrix().rotate(45),
  borderColor: "#f3f3f3",
  borderWidth: 1,
  zIndex: 8,
  backgroundColor: "#007FB1"
});

cbFan.arrowImage.hide();

cbFan.shopDataWindow.add(cbFan.arrowImage);

cbFan.shopDataWindow.add(cbFan.shopData);

cbFan.shopDataWindow.add(cbFan.subMenu);

cbFan.mapWindow.add(cbFan.mapView);

cbFan.currentView = cbFan.subMenu;

shopDataTab = Ti.UI.createTab({
  window: cbFan.shopDataWindow,
  barColor: "#343434",
  icon: "ui/image/inactivelistButton.png",
  activeIcon: "ui/image/listButton.png"
});

mapTab = Ti.UI.createTab({
  window: cbFan.mapWindow,
  barColor: "#343434",
  icon: "ui/image/inactivePin.png",
  activeIcon: "ui/image/pin.png"
});

tabGroup.addTab(mapTab);

tabGroup.addTab(shopDataTab);

tabGroup.open();
