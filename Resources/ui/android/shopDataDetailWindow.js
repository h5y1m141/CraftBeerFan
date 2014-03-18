(function() {
  var shopDataDetailWindow;

  shopDataDetailWindow = (function() {
    function shopDataDetailWindow(data) {
      var ActivityIndicator, keyColor;
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
      ActivityIndicator = require('ui/android/activitiIndicator');
      this.activityIndicator = new ActivityIndicator();
      this.activityIndicator.hide();
      this._createTableView(data);
      this.shopDataDetailWindow.add(this.activityIndicator);
      return this.shopDataDetailWindow;
    }

    shopDataDetailWindow.prototype._createTableView = function(data) {
      var shopData, shopInfo, shopInfoLabel, shopInfoRow, shopSection, statusesRows, wantToGoRow;
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
      shopInfoLabel = Ti.UI.createLabel({
        text: shopInfo,
        textAlign: 'left',
        width: "90%",
        height: 'auto',
        color: this.baseColor.textColor,
        left: "10dp",
        top: "10dp",
        font: {
          fontSize: "18dip",
          fontWeight: 'bold'
        }
      });
      shopSection = Ti.UI.createTableViewSection({
        headerTitle: "お店について"
      });
      shopInfoRow.add(shopInfoLabel);
      if (typeof shopInfoRow !== 'undefined') {
        shopSection.add(shopInfoRow);
      }
      shopData.push(shopSection);
      if (data.statuses.length !== 0) {
        Ti.API.info("create statuses data.statuses is " + data.statuses);
        statusesRows = this._createStatusesRows(data.statuses);
        shopData.push(statusesRows);
      }
      this.tableView.setData(shopData);
      return this.shopDataDetailWindow.add(this.tableView);
    };

    shopDataDetailWindow.prototype._createStatusesRows = function(statuses) {
      var infoIcon, moment, momentja, obj, postedDateLabel, statusLabel, statusRow, statusSection, _i, _len;
      moment = require('lib/moment.min');
      momentja = require('lib/momentja');
      statusSection = Ti.UI.createTableViewSection({
        headerTitle: "開栓情報一覧"
      });
      for (_i = 0, _len = statuses.length; _i < _len; _i++) {
        obj = statuses[_i];
        statusRow = Ti.UI.createTableViewRow({
          width: Ti.UI.FULL,
          height: 'auto',
          backgroundColor: this.baseColor.backgroundColor
        });
        infoIcon = Ti.UI.createLabel({
          top: 10,
          left: 10,
          width: "30dip",
          height: "30dip",
          color: "#ccc",
          font: {
            fontSize: "28dip",
            fontFamily: 'LigatureSymbols'
          },
          text: String.fromCharCode("0xe075"),
          textAlign: 'center'
        });
        statusLabel = Ti.UI.createLabel({
          text: obj.message,
          textAlign: 'left',
          width: "75%",
          height: 'auto',
          color: this.baseColor.textColor,
          left: "50dp",
          top: "10dp",
          font: {
            fontSize: "16dip",
            fontWeight: "bold"
          }
        });
        postedDateLabel = Ti.UI.createLabel({
          text: moment(obj.created_at).fromNow(),
          textAlign: 'right',
          width: "10%",
          height: 'auto',
          color: this.baseColor.textColor,
          right: "5dp",
          bottom: "5dp",
          font: {
            fontSize: "14dip"
          }
        });
        statusRow.add(infoIcon);
        statusRow.add(statusLabel);
        statusRow.add(postedDateLabel);
        statusSection.add(statusRow);
      }
      return statusSection;
    };

    return shopDataDetailWindow;

  })();

  module.exports = shopDataDetailWindow;

}).call(this);
