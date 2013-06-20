var Cloud, baseColor, cbFan, listButton, mapTab, mapWindowTitle, menu, menuTable, shopData, shopDataDetail, shopDataTab, shopDataTableView, shopDataWindowTitle, subMenuTable, tabGroup;

cbFan = {};

Cloud = require('ti.cloud');

shopDataTableView = require('ui/shopDataTableView');

subMenuTable = require("ui/subMenuTable");

shopDataDetail = require("ui/shopDataDetail");

menuTable = require("ui/menuTable");

menu = new menuTable();

shopDataDetail = new shopDataDetail();

cbFan.isSlide = false;

cbFan.shopDataDetailTable = shopDataDetail.getTable();

cbFan.menu = menu.getTable();

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
  tabBarHidden: true
});

if (Ti.Platform.osname === 'iphone') {
  cbFan.shopDataWindow.setTitleControl(shopDataWindowTitle);
}

listButton = Titanium.UI.createButton({
  backgroundImage: "ui/image/listButton.png",
  width: "40sp",
  height: "40sp"
});

listButton.addEventListener('click', function(e) {
  if (cbFan.isSlide === false) {
    return cbFan.subMenu.animate({
      duration: 400,
      left: 200
    }, function() {
      return cbFan.isSlide = true;
    });
  } else {
    return cbFan.subMenu.animate({
      duration: 400,
      left: 0
    }, function() {
      return cbFan.isSlide = false;
    });
  }
});

cbFan.shopDataWindow.leftNavButton = listButton;

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
  tabBarHidden: true
});

if (Ti.Platform.osname === 'iphone') {
  cbFan.mapWindow.setTitleControl(mapWindowTitle);
}

cbFan.mapView = Titanium.Map.createView({
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

cbFan.mapView.addEventListener('click', function(e) {
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
    if (Ti.Platform.osname === 'iphone') {
      _win.setTitleControl(_winTitle);
    }
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

cbFan.mapWindow.add(cbFan.mapView);

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

mapTab = Ti.UI.createTab({
  window: cbFan.mapWindow,
  barColor: "#343434",
  icon: "ui/image/inactivePin.png",
  activeIcon: "ui/image/pin.png"
});

shopData = new shopDataTableView();

cbFan.shopData = shopData.getTable();

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

cbFan.shopDataWindow.add(cbFan.menu);

shopDataTab = Ti.UI.createTab({
  window: cbFan.shopDataWindow,
  barColor: "#343434",
  icon: "ui/image/inactivePin.png",
  activeIcon: "ui/image/pin.png"
});

tabGroup.addTab(shopDataTab);

tabGroup.addTab(mapTab);

tabGroup.open();
