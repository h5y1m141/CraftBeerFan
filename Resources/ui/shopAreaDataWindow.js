var shopAreaDataWindow;

shopAreaDataWindow = (function() {

  function shopAreaDataWindow(items) {
    var activeTab, item, shopDataRow, shopDataRowTable, shopDataRows, _i, _len;
    this.shopAreaDataWindow = Ti.UI.createWindow({
      title: "地域別のお店情報",
      barColor: "#f9f9f9",
      backgroundColor: "#343434",
      navBarHidden: false,
      tabBarHidden: false
    });
    shopDataRowTable = Ti.UI.createTableView({
      width: 'auto',
      height: 'auto'
    });
    shopDataRowTable.addEventListener('click', function(e) {
      var ShopDataDetailWindow, data, shopDataDetailWindow;
      data = {
        name: e.row.placeData.name,
        shopAddress: e.row.placeData.address,
        phoneNumber: e.row.placeData.phone_number,
        latitude: e.row.placeData.latitude,
        longitude: e.row.placeData.longitude
      };
      ShopDataDetailWindow = require("ui/shopDataDetailWindow");
      return shopDataDetailWindow = new ShopDataDetailWindow(data);
    });
    this._createNavbarElement();
    shopDataRows = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      item = items[_i];
      shopDataRow = this._createShopDataRow(item);
      shopDataRows.push(shopDataRow);
    }
    shopDataRowTable.startLayout();
    shopDataRowTable.setData(shopDataRows);
    shopDataRowTable.finishLayout();
    this.shopAreaDataWindow.add(shopDataRowTable);
    activeTab = Ti.API._activeTab;
    return activeTab.open(this.shopAreaDataWindow);
  }

  shopAreaDataWindow.prototype._createNavbarElement = function() {
    var backButton, shopAreaDataWindowTitle,
      _this = this;
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    backButton.addEventListener('click', function(e) {
      return _this.shopAreaDataWindow.close({
        animated: true
      });
    });
    this.shopAreaDataWindow.leftNavButton = backButton;
    shopAreaDataWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "地域別のお店情報"
    });
    if (Ti.Platform.osname === 'iphone') {
      this.shopAreaDataWindow.setTitleControl(shopAreaDataWindowTitle);
    }
  };

  shopAreaDataWindow.prototype._createShopDataRow = function(placeData) {
    var addressLabel, row, titleLabel;
    titleLabel = Ti.UI.createLabel({
      width: 240,
      height: 30,
      top: 5,
      left: 5,
      color: '#333',
      font: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Rounded M+ 1p'
      },
      text: "" + placeData.shopName
    });
    addressLabel = Ti.UI.createLabel({
      width: 240,
      height: 30,
      top: 30,
      left: 20,
      color: '#444',
      font: {
        fontSize: 14,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "" + placeData.shopAddress
    });
    row = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 60,
      borderWidth: 0,
      hasChild: true,
      placeData: placeData,
      className: 'shopData'
    });
    row.add(titleLabel);
    row.add(addressLabel);
    return row;
  };

  return shopAreaDataWindow;

})();

module.exports = shopAreaDataWindow;
