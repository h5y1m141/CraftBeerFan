(function() {
  var favoriteWindow;

  favoriteWindow = (function() {
    function favoriteWindow() {
      var ActivityIndicator, MainController, activeTab, activityIndicator, keyColor, mainController;
      keyColor = "#f9f9f9";
      this.baseColor = {
        barColor: keyColor,
        backgroundColor: keyColor
      };
      this.favoriteWindow = Ti.UI.createWindow({
        title: "行きたいお店",
        barColor: this.baseColor.barColor,
        backgroundColor: this.baseColor.backgroundColor,
        tabBarHidden: false,
        navBarHidden: false
      });
      ActivityIndicator = require("ui/activityIndicator");
      activityIndicator = new ActivityIndicator();
      this.favoriteWindow.add(activityIndicator);
      activityIndicator.show();
      this._createNavbarElement();
      this.table = Ti.UI.createTableView({
        backgroundColor: this.baseColor.backgroundColor,
        selectedBackgroundColor: this.baseColor.backgroundColor,
        style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
        width: 'auto',
        height: 'auto',
        top: 0,
        left: 0
      });
      this.table.addEventListener('click', function(e) {
        var ShopDataDetailWindow, data;
        if (typeof e.row.placeData !== "undefined") {
          data = {
            shopName: e.row.placeData.shopName,
            shopAddress: e.row.placeData.shopAddress,
            phoneNumber: e.row.placeData.phoneNumber,
            latitude: e.row.placeData.latitude,
            longitude: e.row.placeData.longitude,
            favoriteButtonEnable: false
          };
          ShopDataDetailWindow = require("ui/iphone/shopDataDetailWindow");
          return new ShopDataDetailWindow(data);
        }
      });
      MainController = require("controller/mainController");
      mainController = new MainController();
      mainController.getReviewInfo((function(_this) {
        return function(items) {
          var item, row, rows, titleLabel, _i, _len;
          activityIndicator.hide();
          rows = [];
          if (items.length === 0) {
            row = Ti.UI.createTableViewRow({
              width: 'auto',
              height: 60,
              borderWidth: 0,
              backgroundColor: _this.baseColor.barColor,
              selectedBackgroundColor: _this.baseColor.backgroundColor,
              color: "#333"
            });
            titleLabel = Ti.UI.createLabel({
              width: 'auto',
              height: 'auto',
              top: 10,
              left: 10,
              color: '#333',
              font: {
                fontSize: 16,
                fontWeight: 'bold',
                fontFamily: 'Rounded M+ 1p'
              },
              text: '登録されたお店がありません'
            });
            row.add(titleLabel);
            rows.push(row);
          } else {
            for (_i = 0, _len = items.length; _i < _len; _i++) {
              item = items[_i];
              row = _this._createShopDataRow(item);
              rows.push(row);
            }
          }
          return _this.table.setData(rows);
        };
      })(this));
      this.favoriteWindow.add(this.table);
      activeTab = Ti.API._activeTab;
      return activeTab.open(this.favoriteWindow);
    }

    favoriteWindow.prototype._createNavbarElement = function() {
      var backButton, favoriteWindowTitle;
      backButton = Titanium.UI.createButton({
        backgroundImage: "ui/image/backButton.png",
        width: 44,
        height: 44
      });
      backButton.addEventListener('click', (function(_this) {
        return function(e) {
          return _this.favoriteWindow.close({
            animated: true
          });
        };
      })(this));
      this.favoriteWindow.leftNavButton = backButton;
      favoriteWindowTitle = Ti.UI.createLabel({
        textAlign: 'center',
        color: '#333',
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        text: "行きたいお店"
      });
      if (Ti.Platform.osname === 'iphone') {
        this.favoriteWindow.setTitleControl(favoriteWindowTitle);
      }
    };

    favoriteWindow.prototype._createShopDataRow = function(placeData) {
      var content, contentLabel, row, titleLabel;
      row = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 'auto',
        borderWidth: 0,
        placeData: placeData,
        className: 'shopData',
        backgroundColor: this.baseColor.barColor,
        selectedBackgroundColor: this.baseColor.backgroundColor,
        hasChild: true
      });
      titleLabel = Ti.UI.createLabel({
        width: 200,
        height: 20,
        top: 10,
        left: 10,
        color: '#000',
        font: {
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: 'Rounded M+ 1p'
        },
        text: "" + placeData.shopName
      });
      row.add(titleLabel);
      if (typeof placeData.content === "undefined" || placeData.content === null) {
        content = "";
      } else {
        content = placeData.content;
      }
      contentLabel = Ti.UI.createLabel({
        width: 200,
        height: 'auto',
        top: 40,
        left: 30,
        color: '#333',
        font: {
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: 'Rounded M+ 1p'
        },
        text: "" + content
      });
      row.add(contentLabel);
      return row;
    };

    return favoriteWindow;

  })();

  module.exports = favoriteWindow;

}).call(this);
