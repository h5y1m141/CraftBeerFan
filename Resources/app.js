var Cloud, mapView, mapWindow, shopData, shopDataTab, shopDataTableView, shopDataWindow, tab, tabGroup;

Cloud = require('ti.cloud');

shopDataTableView = require('ui/shopDataTableView');

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
    latitudeDelta: 1.0,
    longitudeDelta: 1.0
  },
  animate: true,
  regionFit: true,
  userLocation: true
});

mapView.addEventListener('click', function(e) {
  var activeTab, addressLabel, addressRow, annotation, callBtn, phoneLabel, phoneNumber, phoneRow, section, shopAddress, shopData, shopDataWindow, tableView, title;
  title = e.title;
  phoneNumber = e.annotation.phoneNumber;
  shopAddress = e.annotation.shopAddress;
  if (e.clicksource === 'rightButton') {
    annotation = e.annotation;
    shopDataWindow = Ti.UI.createWindow({
      title: "詳細情報",
      barColor: "#DD9F00",
      backgroundColor: "#343434"
    });
    shopData = [];
    section = Ti.UI.createTableViewSection({
      headerTitle: title
    });
    addressRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40
    });
    addressLabel = Ti.UI.createLabel({
      text: "" + shopAddress,
      width: 280,
      left: 20,
      top: 10
    });
    phoneRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40
    });
    phoneLabel = Ti.UI.createLabel({
      text: phoneNumber,
      left: 20,
      top: 10,
      width: 120
    });
    callBtn = Ti.UI.createButton({
      title: '電話する',
      width: 100,
      height: 25,
      left: 150,
      top: 10
    });
    callBtn.addEventListener('click', function() {
      Ti.API.info(phoneNumber);
      return Titanium.Platform.openURL("tel:" + phoneNumber);
    });
    addressRow.add(addressLabel);
    phoneRow.add(phoneLabel);
    phoneRow.add(callBtn);
    shopData.push(section);
    shopData.push(addressRow);
    shopData.push(phoneRow);
    tableView = Ti.UI.createTableView({
      width: 'auto',
      height: 'auto',
      data: shopData,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    });
    shopDataWindow.add(tableView);
    activeTab = Ti.API._activeTab;
    return activeTab.open(shopDataWindow);
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
          phoneNumber: place.phone_number,
          shopAddress: place.address,
          subtitle: "",
          pincolor: Titanium.Map.ANNOTATION_PURPLE,
          animate: false,
          leftButton: "images/atlanta.jpg",
          rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
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

tabGroup = Ti.UI.createTabGroup();

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
  icon: "ui/image/dark_pin@2x.png"
});

shopData = new shopDataTableView();

shopDataWindow = Ti.UI.createWindow({
  title: "お店のリスト",
  barColor: "#DD9F00",
  backgroundColor: "#343434"
});

shopDataWindow.add(shopData);

shopDataTab = Ti.UI.createTab({
  window: shopDataWindow,
  icon: "ui/image/dark_list@2x.png"
});

tabGroup.addTab(tab);

tabGroup.addTab(shopDataTab);

tabGroup.open();
