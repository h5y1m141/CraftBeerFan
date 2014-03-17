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
      var row, shopData, shopInfo, shopInfoIcon, shopInfoLabel, shopInfoRow, statusesRows, wantToGoRow, _i, _len;
      shopData = [];
      wantToGoRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: '40dip',
        selectedColor: 'transparent',
        rowID: 2,
        shopName: "" + data.shopName
      });
      this.tableView = Ti.UI.createTableView({
        width: Ti.UI.FULL,
        top: 0,
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
        shopInfo = data.shopInfo;
      } else {
        shopInfo = "現在調査中";
      }
      shopInfoRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 'auto'
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
        text: shopInfo,
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
      if (typeof shopInfoRow !== 'undefined') {
        shopData.push(shopInfoRow);
      }
      if (data.statuses.length !== 0) {
        Ti.API.info("create statuses data.statuses is " + data.statuses);
        statusesRows = this._createStatusesRows(data.statuses);
        for (_i = 0, _len = statusesRows.length; _i < _len; _i++) {
          row = statusesRows[_i];
          shopData.push(row);
        }
      }
      this.tableView.setData(shopData);
      return this.shopDataDetailWindow.add(this.tableView);
    };

    shopDataDetailWindow.prototype._createStatusesRows = function(statuses) {
      var obj, rows, statusLabel, statusRow, _i, _len;
      rows = [];
      for (_i = 0, _len = statuses.length; _i < _len; _i++) {
        obj = statuses[_i];
        statusRow = Ti.UI.createTableViewRow({
          width: Ti.UI.FULL,
          height: 'auto',
          backgroundColor: this.baseColor.backgroundColor
        });
        statusLabel = Ti.UI.createLabel({
          text: obj.message,
          textAlign: 'left',
          width: "300dip",
          height: 'auto',
          color: this.baseColor.textColor,
          left: "10dp",
          top: "10dp",
          font: {
            fontSize: "16dip"
          }
        });
        statusRow.add(statusLabel);
        rows.push(statusRow);
      }
      return rows;
    };

    return shopDataDetailWindow;

  })();

  module.exports = shopDataDetailWindow;

}).call(this);
