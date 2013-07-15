var shopDataTableView;

shopDataTableView = (function() {

  function shopDataTableView() {
    var _this = this;
    this.prefectures = this._loadPrefectures();
    this.table = Ti.UI.createTableView({
      backgroundColor: "#f3f3f3",
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
      width: 'auto',
      height: 'auto',
      left: 150,
      top: 0,
      borderColor: "#f3f3f3",
      borderWidth: 2,
      zIndex: 10
    });
    this.table.hide();
    this.shopData = this._loadData();
    this.table.addEventListener('click', function(e) {
      var activeTab, backButton, curretRowIndex, opendFlg, prefectureName, prefectureNameList, shopAreaDataWindowTitle, shopDataList, shopDataRow, shopDataRowTable, shopDataRows, shopWindow, that, _i, _items, _len, _ref;
      that = _this;
      opendFlg = e.row.opendFlg;
      prefectureNameList = e.row.prefectureNameList;
      curretRowIndex = e.index;
      if (opendFlg === false) {
        _this._showSubMenu(prefectureNameList, curretRowIndex);
        return e.row.opendFlg = true;
      } else if (opendFlg === true) {
        _this._hideSubMenu(curretRowIndex, prefectureNameList.length);
        return e.row.opendFlg = false;
      } else {
        prefectureName = e.row.prefectureName;
        shopDataList = _this._groupingShopDataby(prefectureName);
        shopDataRows = [];
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
        if (typeof shopDataList[prefectureName] === "undefined") {
          return alert("選択した地域のお店がみつかりません");
        } else {
          _ref = shopDataList[prefectureName];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            _items = _ref[_i];
            Ti.API.info("お店の名前:" + _items.name);
            shopDataRow = _this._createShopDataRow(_items);
            shopDataRows.push(shopDataRow);
          }
          shopDataRowTable.startLayout();
          shopDataRowTable.setData(shopDataRows);
          shopDataRowTable.finishLayout();
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
          backButton = Titanium.UI.createButton({
            backgroundImage: "ui/image/backButton.png",
            width: 44,
            height: 44
          });
          backButton.addEventListener('click', function(e) {
            return shopWindow.close({
              animated: true
            });
          });
          shopWindow = Ti.UI.createWindow({
            title: "地域別のお店情報",
            barColor: "#f9f9f9",
            backgroundColor: "#343434"
          });
          shopWindow.leftNavButton = backButton;
          if (Ti.Platform.osname === 'iphone') {
            shopWindow.setTitleControl(shopAreaDataWindowTitle);
          }
          shopWindow.add(shopDataRowTable);
          activeTab = Ti.API._activeTab;
          activeTab.open(shopWindow);
        }
      }
    });
    return;
  }

  shopDataTableView.prototype.getTable = function() {
    return this.table;
  };

  shopDataTableView.prototype.refreshTableData = function(categoryName, selectedColor, selectedSubColor) {
    var PrefectureCategory, prefectureNameList, prefectureRow, rows, textLabel, _i, _items, _len;
    rows = [];
    PrefectureCategory = this._makePrefectureCategory(this.prefectures);
    prefectureNameList = PrefectureCategory[categoryName];
    for (_i = 0, _len = prefectureNameList.length; _i < _len; _i++) {
      _items = prefectureNameList[_i];
      prefectureRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 60,
        hasChild: true,
        prefectureName: "" + _items.name
      });
      textLabel = Ti.UI.createLabel({
        width: 240,
        height: 40,
        top: 5,
        left: 30,
        color: '#333',
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        text: "" + _items.name
      });
      prefectureRow.add(textLabel);
      rows.push(prefectureRow);
    }
    this.table.borderColor = selectedColor;
    this.table.backgroundColor = selectedSubColor;
    this.table.setData(rows);
    return this.table.show();
  };

  shopDataTableView.prototype._makePrefectureCategory = function(data) {
    var result, _;
    _ = require("lib/underscore-1.4.3.min");
    result = _.groupBy(data, function(row) {
      return row.area;
    });
    return result;
  };

  shopDataTableView.prototype._createShopDataRow = function(placeData) {
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
      text: "" + placeData.name
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
      text: "" + placeData.address
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

  shopDataTableView.prototype._loadData = function() {
    var file, json, shopData;
    shopData = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/shopData.json");
    file = shopData.read().toString();
    json = JSON.parse(file);
    return json;
  };

  shopDataTableView.prototype._loadPrefectures = function() {
    var file, json, prefectures;
    prefectures = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/prefectures.json");
    file = prefectures.read().toString();
    json = JSON.parse(file);
    return json;
  };

  shopDataTableView.prototype._groupingShopDataby = function(prefectureName) {
    var _, _result;
    _ = require("lib/underscore-1.4.3.min");
    _result = _.groupBy(this.shopData, function(row) {
      return row.state;
    });
    return _result;
  };

  return shopDataTableView;

})();

module.exports = shopDataTableView;
