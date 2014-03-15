(function() {
  var shopDataDetailWindow;

  shopDataDetailWindow = (function() {
    function shopDataDetailWindow(data) {
      var keyColor;
      keyColor = "#f9f9f9";
      this.baseColor = {
        barColor: keyColor,
        backgroundColor: "#f3f3f3",
        keyColor: "#DA5019",
        textColor: "#333",
        phoneColor: "#3261AB",
        favoriteColor: "#DA5019",
        starColor: "#DA5019",
        separatorColor: '#cccccc'
      };
      this.shopDataDetailWindow = Ti.UI.createWindow({
        title: "" + data.shopName,
        barColor: this.baseColor.barColor,
        backgroundColor: this.baseColor.backgroundColor,
        navBarHidden: false
      });
      this._createTableView(data);
      return this.shopDataDetailWindow;
    }

    shopDataDetailWindow.prototype._createTableView = function(data) {
      var phoneRow, shopData, shopInfoIcon, shopInfoLabel, shopInfoRow, wantToGoRow;
      shopData = [];
      phoneRow = Ti.UI.createTableViewRow({
        width: Ti.UI.FULL,
        height: '40dip',
        selectedColor: 'transparent',
        rowID: 1,
        phoneNumber: data.phoneNumber
      });
      this.phoneIcon = Ti.UI.createButton({
        top: 5,
        left: 10,
        width: '40dip',
        height: '40dip',
        backgroundColor: this.baseColor.phoneColor,
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 0,
        color: this.baseColor.barColor,
        font: {
          fontSize: '36dip',
          fontFamily: 'fontawesome-webfont'
        },
        title: String.fromCharCode("0xf095")
      });
      this.phoneLabel = Ti.UI.createLabel({
        text: "電話する",
        textAlign: 'left',
        left: 100,
        top: 10,
        width: '150dip',
        color: this.baseColor.textColor,
        font: {
          fontSize: '18dip',
          fontWeight: 'bold'
        }
      });
      wantToGoRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: '40dip',
        selectedColor: 'transparent',
        rowID: 2,
        shopName: "" + data.shopName
      });
      this.tableView = Ti.UI.createTableView({
        width: Ti.UI.FULL,
        top: "300dp",
        left: 0,
        data: shopData,
        backgroundColor: this.baseColor.backgroundColor,
        separatorColor: this.baseColor.separatorColor,
        borderRadius: 5
      });
      this.tableView.addEventListener('click', (function(_this) {
        return function(e) {};
      })(this));
      if (typeof data.shopInfo !== "undefined") {
        shopInfoRow = Ti.UI.createTableViewRow({
          width: 'auto',
          height: 'auto',
          selectedColor: 'transparent'
        });
        shopInfoIcon = Ti.UI.createLabel({
          top: 10,
          left: 10,
          width: "40dip",
          height: "40dip",
          color: "#ccc",
          font: {
            fontSize: "36dip",
            fontFamily: 'LigatureSymbols'
          },
          text: String.fromCharCode("0xe075"),
          textAlign: 'center'
        });
        shopInfoLabel = Ti.UI.createLabel({
          text: "" + data.shopInfo,
          textAlign: 'left',
          width: "250dip",
          height: 'auto',
          color: this.baseColor.textColor,
          left: 100,
          top: 10,
          font: {
            fontSize: "18dip",
            fontWeight: 'bold'
          }
        });
        shopInfoRow.add(shopInfoLabel);
        shopInfoRow.add(shopInfoIcon);
        shopData.push(this.section);
        if (typeof shopInfoRow !== 'undefined') {
          shopData.push(shopInfoRow);
        }
      }
      this.tableView.setData(shopData);
      return this.shopDataDetailWindow.add(this.tableView);
    };

    return shopDataDetailWindow;

  })();

  module.exports = shopDataDetailWindow;

}).call(this);
