var favoriteWindow;

favoriteWindow = (function() {

  function favoriteWindow() {
    var KloudService, ShopDataDetail, activeTab, keyColor, kloudService, shopDataDetail, shopDetailTable, userID,
      _this = this;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: keyColor
    };
    this.favoriteWindow = Ti.UI.createWindow({
      title: "お気に入り",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: false,
      navBarHidden: false
    });
    this._createNavbarElement();
    this.table = Ti.UI.createTableView({
      backgroundColor: this.baseColor.backgroundColor,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      width: 'auto',
      height: 'auto',
      top: 0,
      left: 0
    });
    this.table.addEventListener('click', function(e) {
      var ShopDataDetailWindow, data;
      data = {
        shopName: e.row.placeData.name,
        shopAddress: e.row.placeData.address,
        phoneNumber: e.row.placeData.phone_number,
        latitude: e.row.placeData.latitude,
        longitude: e.row.placeData.longitude
      };
      ShopDataDetailWindow = require("ui/shopDataDetailWindow");
      return new ShopDataDetailWindow(data);
    });
    KloudService = require("model/kloudService");
    kloudService = new KloudService();
    userID = Ti.App.Properties.getString("currentUserId");
    kloudService.reviewsQuery(userID, function(items) {
      var item, row, rows, _i, _len;
      rows = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        row = _this._createShopDataRow(item);
        rows.push(row);
      }
      return _this.table.setData(rows);
    });
    ShopDataDetail = require("ui/shopDataDetail");
    shopDataDetail = new ShopDataDetail();
    shopDetailTable = shopDataDetail.getTable();
    this.table.addEventListener('click', function(e) {
      var ShopDataDetailWindow, data, shopDataDetailWindow;
      if (e.row.className === "shopName") {
        data = e.row.data;
        ShopDataDetailWindow = require("ui/shopDataDetailWindow");
        return shopDataDetailWindow = new ShopDataDetailWindow(data);
      }
    });
    this.favoriteWindow.add(this.table);
    activeTab = Ti.API._activeTab;
    return activeTab.open(this.favoriteWindow);
  }

  favoriteWindow.prototype._createNavbarElement = function() {
    var backButton, favoriteWindowTitle,
      _this = this;
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    backButton.addEventListener('click', function(e) {
      return _this.favoriteWindow.close({
        animated: true
      });
    });
    this.favoriteWindow.leftNavButton = backButton;
    favoriteWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "お気に入り"
    });
    if (Ti.Platform.osname === 'iphone') {
      this.favoriteWindow.setTitleControl(favoriteWindowTitle);
    }
  };

  favoriteWindow.prototype._createShopDataRow = function(placeData) {
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
      className: 'shopData',
      backgroundColor: this.baseColor.barColor
    });
    row.add(titleLabel);
    row.add(addressLabel);
    return row;
  };

  return favoriteWindow;

})();

module.exports = favoriteWindow;
