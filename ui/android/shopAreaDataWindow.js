(function() {
  var shopAreaDataWindow;

  shopAreaDataWindow = (function() {
    function shopAreaDataWindow(items) {
      var item, keyColor, searchBar, shopDataRow, shopDataRowTable, shopDataRows, _i, _len;
      keyColor = "#f9f9f9";
      this.baseColor = {
        barColor: keyColor,
        backgroundColor: keyColor
      };
      this.shopAreaDataWindow = Ti.UI.createWindow({
        title: "地域別のお店情報",
        barColor: this.baseColor.barColor,
        backgroundColor: this.baseColor.backgroundColor,
        navBarHidden: false,
        tabBarHidden: false
      });
      searchBar = Ti.UI.Android.createSearchView({
        barColor: this.baseColor.barColor,
        backgroundColor: "#ccc",
        showCancel: false,
        hintText: "ここに住所入力すると絞り込めます"
      });
      shopDataRowTable = Ti.UI.createTableView({
        width: 'auto',
        height: 'auto',
        top: '0dip',
        left: '0dip',
        search: searchBar,
        filterAttribute: "shopAddress",
        backgroundColor: this.baseColor.barColor
      });
      shopDataRowTable.addEventListener('click', function(e) {
        var ShopDataDetailWindow, currentUserId, data, favoriteButtonEnable, shopDataDetailWindow;
        currentUserId = Ti.App.Properties.getString("currentUserId");
        if (typeof currentUserId === "undefined" || currentUserId === null) {
          favoriteButtonEnable = false;
        } else {
          favoriteButtonEnable = true;
        }
        data = {
          shopName: e.row.placeData.shopName,
          shopAddress: e.row.placeData.shopAddress,
          phoneNumber: e.row.placeData.phoneNumber,
          latitude: e.row.placeData.latitude,
          longitude: e.row.placeData.longitude,
          shopInfo: e.row.placeData.shopInfo,
          favoriteButtonEnable: favoriteButtonEnable,
          shopFlg: e.row.placeData.shopFlg
        };
        ShopDataDetailWindow = require("ui/android/shopDataDetailWindow");
        shopDataDetailWindow = new ShopDataDetailWindow(data);
        return shopDataDetailWindow.open();
      });
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
      Ti.App.Analytics.trackPageview("/window/shopAreaDataWindow");
      return this.shopAreaDataWindow;
    }

    shopAreaDataWindow.prototype._createShopDataRow = function(placeData) {
      var addressLabel, iconImage, row, titleLabel;
      if (placeData.shopFlg === "true") {
        iconImage = Ti.UI.createImageView({
          image: Titanium.Filesystem.resourcesDirectory + "ui/image/bottle.png",
          left: '5dip',
          width: '20dip',
          height: '30dip',
          top: 5
        });
      } else {
        iconImage = Ti.UI.createImageView({
          image: Titanium.Filesystem.resourcesDirectory + "ui/image/tumblrIcon.png",
          left: '5dip',
          width: '20dip',
          height: '30dip',
          top: '5dip'
        });
      }
      titleLabel = Ti.UI.createLabel({
        width: '260dip',
        height: '30dip',
        top: '5dip',
        left: '40dip',
        color: '#333',
        font: {
          fontSize: '18dip'
        },
        text: "" + placeData.shopName
      });
      addressLabel = Ti.UI.createLabel({
        width: '240dip',
        height: '30dip',
        top: '30dip',
        left: '60dip',
        color: '#444',
        font: {
          fontSize: '12dip'
        },
        text: "" + placeData.shopAddress
      });
      row = Ti.UI.createTableViewRow({
        width: Ti.UI.FULL,
        height: '80dip',
        hasChild: true,
        placeData: placeData,
        shopAddress: placeData.shopAddress,
        className: 'shopData',
        backgroundColor: this.baseColor.barColor
      });
      row.add(titleLabel);
      row.add(addressLabel);
      row.add(iconImage);
      return row;
    };

    return shopAreaDataWindow;

  })();

  module.exports = shopAreaDataWindow;

}).call(this);
