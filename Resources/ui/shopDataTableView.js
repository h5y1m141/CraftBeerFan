var shopDataTableView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

shopDataTableView = (function() {

  function shopDataTableView() {
    this._hideSubMenu = __bind(this._hideSubMenu, this);

    var PrefectureCategory, categoryName, numberOfPrefecture, prefectureColorSet, prefectureNameList, prefectures, roundLabel, row, rows, textLabel, view,
      _this = this;
    prefectures = [
      {
        "name": "北海道",
        "area": "北海道・東北"
      }, {
        "name": "青森県",
        "area": "北海道・東北"
      }, {
        "name": "岩手県",
        "area": "北海道・東北"
      }, {
        "name": "宮城県",
        "area": "北海道・東北"
      }, {
        "name": "秋田県",
        "area": "北海道・東北"
      }, {
        "name": "山形県",
        "area": "北海道・東北"
      }, {
        "name": "福島県",
        "area": "北海道・東北"
      }, {
        "name": "茨城県",
        "area": "関東"
      }, {
        "name": "栃木県",
        "area": "関東"
      }, {
        "name": "群馬県",
        "area": "関東"
      }, {
        "name": "埼玉県",
        "area": "関東"
      }, {
        "name": "千葉県",
        "area": "関東"
      }, {
        "name": "東京都",
        "area": "関東"
      }, {
        "name": "神奈川県",
        "area": "関東"
      }, {
        "name": "新潟県",
        "area": "中部"
      }, {
        "name": "富山県",
        "area": "中部"
      }, {
        "name": "石川県",
        "area": "中部"
      }, {
        "name": "福井県",
        "area": "中部"
      }, {
        "name": "山梨県",
        "area": "中部"
      }, {
        "name": "長野県",
        "area": "中部"
      }, {
        "name": "岐阜県",
        "area": "中部"
      }, {
        "name": "静岡県",
        "area": "中部"
      }, {
        "name": "愛知県",
        "area": "中部"
      }, {
        "name": "三重県",
        "area": "近畿"
      }, {
        "name": "滋賀県",
        "area": "近畿"
      }, {
        "name": "京都府",
        "area": "近畿"
      }, {
        "name": "大阪府",
        "area": "近畿"
      }, {
        "name": "兵庫県",
        "area": "近畿"
      }, {
        "name": "奈良県",
        "area": "近畿"
      }, {
        "name": "和歌山県",
        "area": "近畿"
      }, {
        "name": "鳥取県",
        "area": "中国・四国"
      }, {
        "name": "島根県",
        "area": "中国・四国"
      }, {
        "name": "岡山県",
        "area": "中国・四国"
      }, {
        "name": "広島県",
        "area": "中国・四国"
      }, {
        "name": "山口県",
        "area": "中国・四国"
      }, {
        "name": "徳島県",
        "area": "中国・四国"
      }, {
        "name": "香川県",
        "area": "中国・四国"
      }, {
        "name": "愛媛県",
        "area": "中国・四国"
      }, {
        "name": "高知県",
        "area": "中国・四国"
      }, {
        "name": "福岡県",
        "area": "九州・沖縄"
      }, {
        "name": "佐賀県",
        "area": "九州・沖縄"
      }, {
        "name": "長崎県",
        "area": "九州・沖縄"
      }, {
        "name": "熊本県",
        "area": "九州・沖縄"
      }, {
        "name": "大分県",
        "area": "九州・沖縄"
      }, {
        "name": "宮崎県",
        "area": "九州・沖縄"
      }, {
        "name": "鹿児島県",
        "area": "九州・沖縄"
      }, {
        "name": "沖縄県",
        "area": "九州・沖縄"
      }
    ];
    this.table = Ti.UI.createTableView({
      backgroundColor: "#f9f9f9",
      separatorColor: '#ecf0f1',
      width: 'auto',
      height: 'auto',
      left: 0,
      top: 0
    });
    this.colorSet = [
      {
        color: "#f9f9f9",
        position: 0.0
      }, {
        color: "#f6f6f6",
        position: 0.5
      }, {
        color: "#eeeeee",
        position: 1.0
      }
    ];
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
          return Ti.API.info("start. data is " + e.row.placeData);
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
              fontSize: '18sp',
              fontFamily: 'Rounded M+ 1p',
              fontWeight: 'bold'
            },
            text: "地域別のお店情報"
          });
          backButton = Titanium.UI.createButton({
            backgroundImage: "ui/image/backButton.png",
            width: "44sp",
            height: "44sp"
          });
          backButton.addEventListener('click', function(e) {
            return shopWindow.close();
          });
          shopWindow = Ti.UI.createWindow({
            title: "地域別のお店情報",
            barColor: "#f9f9f9",
            backgroundColor: "#343434"
          });
          shopWindow.leftNavButton = backButton;
          shopWindow.setTitleControl(shopAreaDataWindowTitle);
          shopWindow.add(shopDataRowTable);
          activeTab = Ti.API._activeTab;
          activeTab.open(shopWindow);
        }
      }
    });
    rows = [];
    PrefectureCategory = this._makePrefectureCategory(prefectures);
    for (categoryName in PrefectureCategory) {
      numberOfPrefecture = PrefectureCategory[categoryName].length;
      prefectureNameList = PrefectureCategory[categoryName];
      prefectureColorSet = {
        "name": {
          "北海道・東北": "#EDAD0B",
          "関東": "#3261AB",
          "中部": "#FFEE55",
          "近畿": "#007AB7",
          "中国・四国": "#FFF7AA",
          "九州・沖縄": "#C6EDDB"
        }
      };
      roundLabel = Ti.UI.createLabel({
        width: 40,
        height: 40,
        top: 5,
        left: 5,
        color: prefectureColorSet.name["" + categoryName],
        font: {
          fontSize: '18sp',
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        text: "●"
      });
      textLabel = Ti.UI.createLabel({
        width: 240,
        height: 40,
        top: 5,
        left: 50,
        color: '#333',
        font: {
          fontSize: '18sp',
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        text: "" + categoryName
      });
      if (Titanium.Platform.osname === "iphone") {
        row = Ti.UI.createTableViewRow({
          width: 'auto',
          height: 40,
          borderWidth: 0,
          selectedBackgroundColor: "#EDAD0B",
          className: 'shopData',
          numberOfPrefecture: numberOfPrefecture,
          prefectureNameList: prefectureNameList,
          opendFlg: false,
          backgroundGradient: {
            type: 'linear',
            startPoint: {
              x: '0%',
              y: '0%'
            },
            endPoint: {
              x: '0%',
              y: '100%'
            },
            colors: this.colorSet
          }
        });
        row.add(textLabel);
        row.add(roundLabel);
      } else if (Titanium.Platform.osname === "android") {
        row = Ti.UI.createTableViewRow({
          width: 'auto',
          height: 80,
          selectedBackgroundColor: "#EDAD0B",
          className: 'shopData',
          numberOfPrefecture: numberOfPrefecture,
          prefectureNameList: prefectureNameList,
          opendFlg: false
        });
        view = Ti.UI.createView({
          width: 'auto',
          height: 80,
          backgroundGradient: {
            type: 'linear',
            startPoint: {
              x: '0%',
              y: '0%'
            },
            endPoint: {
              x: '0%',
              y: '100%'
            },
            colors: this.colorSet
          }
        });
        view.add(roundLabel);
        view.add(textLabel);
        row.add(view);
      } else {
        Ti.API.info('no data');
      }
      rows.push(row);
    }
    this.table.setData(rows);
    return this.table;
  }

  shopDataTableView.prototype._makePrefectureCategory = function(data) {
    var result, _;
    _ = require("lib/underscore-1.4.3.min");
    result = _.groupBy(data, function(row) {
      return row.area;
    });
    return result;
  };

  shopDataTableView.prototype._showSubMenu = function(prefectureNameList, curretRowIndex) {
    var index, item, subMenu, subMenuLabel, _i, _len;
    index = curretRowIndex;
    Ti.API.info("curretRowIndex is " + curretRowIndex + " and " + prefectureNameList.length);
    for (_i = 0, _len = prefectureNameList.length; _i < _len; _i++) {
      item = prefectureNameList[_i];
      subMenu = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 40,
        borderWidth: 0,
        className: 'subMenu',
        selectedBackgroundColor: "#EDAD0B",
        prefectureName: item.name,
        backgroundGradient: {
          type: 'linear',
          startPoint: {
            x: '0%',
            y: '0%'
          },
          endPoint: {
            x: '0%',
            y: '100%'
          },
          colors: this.colorSet
        }
      });
      subMenuLabel = Ti.UI.createLabel({
        width: 240,
        height: 40,
        top: 5,
        left: 30,
        color: '#333',
        font: {
          fontFamily: 'Rounded M+ 1p',
          fontSize: '18sp'
        },
        text: item.name
      });
      subMenu.add(subMenuLabel);
      this.table.insertRowAfter(index, subMenu, {
        animated: false
      });
      this._sleep(100);
      index++;
      Ti.API.info("index is " + index);
    }
  };

  shopDataTableView.prototype._hideSubMenu = function(curretRowIndex, numberOfPrefecture) {
    var counter, endPosition, startPosition, _i;
    if (curretRowIndex === 0) {
      startPosition = numberOfPrefecture;
    } else {
      startPosition = numberOfPrefecture + curretRowIndex;
    }
    endPosition = curretRowIndex + 1;
    Ti.API.info("start is " + startPosition + " and end is  " + endPosition);
    for (counter = _i = startPosition; startPosition <= endPosition ? _i <= endPosition : _i >= endPosition; counter = startPosition <= endPosition ? ++_i : --_i) {
      this.table.deleteRow(counter);
      this._sleep(100);
    }
  };

  shopDataTableView.prototype._sleep = function(time) {
    var d1, d2;
    d1 = new Date().getTime();
    d2 = new Date().getTime();
    while (d2 < d1 + time) {
      d2 = new Date().getTime();
    }
  };

  shopDataTableView.prototype._createShopDataRow = function(placeData) {
    var addressLabel, row, titleLabel, view;
    titleLabel = Ti.UI.createLabel({
      width: 240,
      height: 20,
      top: 5,
      left: 5,
      color: '#333',
      font: {
        fontSize: '16sp',
        fontWeight: 'bold',
        fontFamily: 'Rounded M+ 1p'
      },
      text: "" + placeData.name
    });
    addressLabel = Ti.UI.createLabel({
      width: 240,
      height: 20,
      top: 25,
      left: 20,
      color: '#444',
      font: {
        fontSize: '12sp',
        fontFamily: 'Rounded M+ 1p'
      },
      text: "" + placeData.address
    });
    if (Titanium.Platform.osname === "iphone") {
      row = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 45,
        borderWidth: 0,
        hasChild: true,
        placeData: placeData,
        className: 'shopData',
        backgroundGradient: {
          type: 'linear',
          startPoint: {
            x: '0%',
            y: '0%'
          },
          endPoint: {
            x: '0%',
            y: '100%'
          },
          colors: this.colorSet
        }
      });
      row.add(titleLabel);
      row.add(addressLabel);
    } else if (Titanium.Platform.osname === "android") {
      row = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 80,
        className: 'shopData',
        hasDetail: true
      });
      view = Ti.UI.createView({
        width: 'auto',
        height: 80,
        backgroundGradient: {
          type: 'linear',
          startPoint: {
            x: '0%',
            y: '0%'
          },
          endPoint: {
            x: '0%',
            y: '100%'
          },
          colors: this.colorSet
        }
      });
      view.add(textLabel);
      row.add(view);
    } else {
      Ti.API.info('no platform');
    }
    return row;
  };

  shopDataTableView.prototype._loadData = function() {
    var file, json, shopData;
    shopData = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/shopData.json");
    file = shopData.read().toString();
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
