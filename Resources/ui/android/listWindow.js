var listWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

listWindow = (function() {

  function listWindow() {
    this.refreshListViewData = __bind(this.refreshListViewData, this);

    var ActivityIndicator, myTemplate;
    ActivityIndicator = require("ui/activityIndicator");
    this.activityIndicator = new ActivityIndicator();
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      keyColor: "#EDAD0B"
    };
    this.listWindow = Ti.UI.createWindow({
      title: "リスト",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false
    });
    this.prefectureColorSet = {
      "name": {
        "北海道・東北": "#3261AB",
        "関東": "#007FB1",
        "中部": "#23AC0E",
        "近畿": "#FFE600",
        "中国・四国": "#F6CA06",
        "九州・沖縄": "#DA5019"
      }
    };
    this.prefectureSubColorSet = {
      "name": {
        "北海道・東北": "#D5E0F1",
        "関東": "#CAE7F2",
        "中部": "#D1F1CC",
        "近畿": "#FFFBD5",
        "中国・四国": "#FEF7D5",
        "九州・沖縄": "#F9DFD5"
      }
    };
    myTemplate = {
      childTemplates: [
        {
          type: "Ti.UI.Label",
          bindId: "title",
          properties: {
            color: "#333",
            font: {
              fontSize: '16dip',
              fontFamily: 'Rounded M+ 1p'
            },
            width: '400dip',
            height: '80dip',
            left: "30dp",
            top: '5dip'
          },
          events: {
            click: this.showShopArea
          }
        }
      ]
    };
    this.listView = Ti.UI.createListView({
      templates: {
        template: myTemplate
      },
      defaultItemTemplate: "template"
    });
    this.prefectures = this._loadPrefectures();
    this.refreshListViewData("関東", "#CAE7F2", "#CAE7F2");
    this.listWindow.activity.onCreateOptionsMenu = function(e) {
      var actionBarMenu, menu;
      menu = e.menu;
      actionBarMenu = require("ui/android/actionBarMenu");
      return actionBarMenu = new actionBarMenu(menu);
    };
    this.listWindow.add(this.listView);
    return this.listWindow;
  }

  listWindow.prototype.showShopArea = function(e) {
    var KloudService, index, kloudService, prefectureName;
    index = e.itemIndex;
    prefectureName = e.section.items[index].title.text;
    KloudService = require("model/kloudService");
    kloudService = new KloudService();
    return kloudService.findShopDataBy(prefectureName, function(items) {
      var ShopAreaDataWindow, shopWindow;
      if (items.length === 0) {
        return alert("選択した地域のお店がみつかりません");
      } else {
        items.sort(function(a, b) {
          if (a.shopAddress > b.shopAddress) {
            return -1;
          } else {
            return 1;
          }
        });
        ShopAreaDataWindow = require("ui/android/shopAreaDataWindow");
        alert("ShopAreaDataWindow start");
        shopWindow = new ShopAreaDataWindow(items);
        return shopWindow.open();
      }
    });
  };

  listWindow.prototype._loadPrefectures = function() {
    var file, json, prefectures;
    prefectures = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/prefectures.json");
    file = prefectures.read().toString();
    json = JSON.parse(file);
    return json;
  };

  listWindow.prototype._makePrefectureCategory = function(data) {
    var result, _;
    _ = require("lib/underscore-1.4.3.min");
    result = _.groupBy(data, function(row) {
      return row.area;
    });
    return result;
  };

  listWindow.prototype._createNavbarElement = function() {};

  listWindow.prototype._createFavoriteRow = function() {
    var favoriteIcon, favoriteLabel, favoriteRow, love;
    Ti.API.info("_createFavoriteRow start");
    favoriteRow = Ti.UI.createTableViewRow({
      width: '600dip',
      height: this.rowHeight,
      backgroundColor: "f3f3f3",
      categoryName: "行きたいお店"
    });
    love = String.fromCharCode("0xe06e");
    favoriteIcon = Ti.UI.createLabel({
      width: 20,
      left: 10,
      top: 5,
      color: "#FFEE55",
      font: {
        fontSize: 24,
        fontFamily: 'LigatureSymbols'
      },
      text: love,
      textAlign: 'left'
    });
    favoriteLabel = Ti.UI.createLabel({
      width: 240,
      height: 24,
      top: 5,
      left: 30,
      textAlign: 'left',
      color: '#333',
      font: {
        fontSize: '16dip',
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "行きたいお店"
    });
    favoriteRow.add(favoriteIcon);
    favoriteRow.add(favoriteLabel);
    return favoriteRow;
  };

  listWindow.prototype._createSubMenuRow = function(categoryName) {
    var headerLabel, headerPoint, subMenuRow;
    headerPoint = Ti.UI.createView({
      width: '20dip',
      height: '60dip',
      top: 5,
      left: 10,
      backgroundColor: this.prefectureColorSet.name[categoryName]
    });
    headerLabel = Ti.UI.createLabel({
      text: categoryName,
      top: '5dip',
      left: '30dip',
      color: "#222",
      font: {
        fontSize: '16dip',
        fontFamily: 'Rounded M+ 1p'
      }
    });
    subMenuRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: this.rowHeight,
      backgroundColor: "f3f3f3",
      categoryName: categoryName
    });
    subMenuRow.add(headerPoint);
    subMenuRow.add(headerLabel);
    return subMenuRow;
  };

  listWindow.prototype.refreshListViewData = function(categoryName, selectedColor, selectedSubColor) {
    var PrefectureCategory, prefectureDataSet, prefectureNameList, prefectureSection, sections, _i, _items, _len;
    sections = [];
    PrefectureCategory = this._makePrefectureCategory(this.prefectures);
    prefectureNameList = PrefectureCategory[categoryName];
    prefectureSection = Ti.UI.createListSection();
    prefectureDataSet = [];
    for (_i = 0, _len = prefectureNameList.length; _i < _len; _i++) {
      _items = prefectureNameList[_i];
      prefectureDataSet.push({
        title: {
          text: _items.name
        }
      });
    }
    prefectureSection.setItems(prefectureDataSet);
    sections.push(prefectureSection);
    return this.listView.setSections(sections);
  };

  return listWindow;

})();

module.exports = listWindow;
