var shopDataDetailWindow;

shopDataDetailWindow = (function() {

  function shopDataDetailWindow() {
    var backButton, shopDataDetailWindowTitle,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      keyColor: "#EDAD0B"
    };
    this.shopDataDetailWindow = Ti.UI.createWindow({
      title: "近くのお店",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
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
        fontSize: '18sp',
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "お店の詳細情報"
    });
    if (Ti.Platform.osname === 'iphone') {
      this.shopDataDetailWindow.setTitleControl(shopDataDetailWindowTitle);
    }
    this.annotation = Titanium.Map.createAnnotation({
      pincolor: Titanium.Map.ANNOTATION_PURPLE,
      animate: true
    });
    this.mapView = Titanium.Map.createView({
      mapType: Titanium.Map.STANDARD_TYPE,
      region: {
        latitude: 35.676564,
        longitude: 139.765076,
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
    this.mapView.addAnnotation(this.annotation);
    this.shopDataDetailWindow.add(this.mapView);
    this.mapView.hide();
    return;
  }

  shopDataDetailWindow.prototype.update = function(data) {
    var ShopDataDetail, activeTab, shopDataDetail, shopDataTable;
    ShopDataDetail = require("ui/shopDataDetail");
    shopDataDetail = new ShopDataDetail();
    shopDataDetail.setData(data);
    shopDataTable = shopDataDetail.getTable();
    this.shopDataDetailWindow.add(shopDataTable);
    this.annotation.latitude = data.latitude;
    this.annotation.longitude = data.longitude;
    this.mapView.latitude = data.latitude;
    this.mapView.longitude = data.longitude;
    this.mapView.show();
    this.shopDataDetailWindow.add(this.mapView);
    activeTab = Ti.API._activeTab;
    return activeTab.open(this.shopDataDetailWindow);
  };

  return shopDataDetailWindow;

})();

module.exports = shopDataDetailWindow;
