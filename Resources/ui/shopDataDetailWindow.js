var shopDataDetailWindow;

shopDataDetailWindow = (function() {

  function shopDataDetailWindow(data) {
    var ShopDataDetail, activeTab, keyColor, shopDataDetail, shopDataTable;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: keyColor
    };
    this.shopDataDetailWindow = Ti.UI.createWindow({
      title: "近くのお店",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    this._createNavbarElement();
    this._createMapView(data);
    ShopDataDetail = require("ui/shopDataDetail");
    shopDataDetail = new ShopDataDetail(data);
    shopDataTable = shopDataDetail.getTable();
    this.shopDataDetailWindow.add(shopDataTable);
    activeTab = Ti.API._activeTab;
    return activeTab.open(this.shopDataDetailWindow);
  }

  shopDataDetailWindow.prototype._createNavbarElement = function() {
    var backButton, shopDataDetailWindowTitle,
      _this = this;
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    backButton.addEventListener('click', function(e) {
      return _this.shopDataDetailWindow.close({
        animated: true
      });
    });
    this.shopDataDetailWindow.leftNavButton = backButton;
    shopDataDetailWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "お店の詳細情報"
    });
    if (Ti.Platform.osname === 'iphone') {
      this.shopDataDetailWindow.setTitleControl(shopDataDetailWindowTitle);
    }
  };

  shopDataDetailWindow.prototype._createMapView = function(data) {
    var annotation, mapView;
    mapView = Titanium.Map.createView({
      mapType: Titanium.Map.STANDARD_TYPE,
      region: {
        latitude: data.latitude,
        longitude: data.longitude,
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
    annotation = Titanium.Map.createAnnotation({
      pincolor: Titanium.Map.ANNOTATION_PURPLE,
      animate: false,
      latitude: data.latitude,
      longitude: data.longitude
    });
    mapView.addAnnotation(annotation);
    return this.shopDataDetailWindow.add(mapView);
  };

  return shopDataDetailWindow;

})();

module.exports = shopDataDetailWindow;
