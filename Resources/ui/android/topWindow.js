var topWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

topWindow = (function() {

  function topWindow() {
    this.showShopArea = __bind(this.showShopArea, this);

    var ActivityIndicator, listView, myTemplate, sections;
    ActivityIndicator = require("ui/android/activitiIndicator");
    this.activityIndicator = new ActivityIndicator();
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      keyColor: "#EDAD0B"
    };
    this.topWindow = Ti.UI.createWindow({
      title: "トップ",
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
              fontSize: '16dip'
            },
            width: '400dip',
            height: '60dip',
            left: "30dp",
            top: '5dip'
          },
          events: {
            click: this.showShopArea
          }
        }
      ]
    };
    listView = Ti.UI.createListView({
      templates: {
        template: myTemplate
      },
      defaultItemTemplate: "template"
    });
    sections = this._createPrefectureSections();
    listView.setSections(sections);
    this.topWindow.add(listView);
    this.topWindow.add(this.activityIndicator);
    return this.topWindow;
  }

  topWindow.prototype._loadPrefectures = function() {
    var file, json, prefectures;
    prefectures = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/prefectures.json");
    file = prefectures.read().toString();
    json = JSON.parse(file);
    return json;
  };

  topWindow.prototype._createPrefectureSections = function() {
    var Prefectures, array1, array2, array3, array4, array5, array6, section1, section2, section3, section4, section5, section6, sections, _i, _items, _len;
    Prefectures = this._loadPrefectures();
    section1 = Ti.UI.createListSection({
      headerTitle: "北海道・東北"
    });
    section2 = Ti.UI.createListSection({
      headerTitle: "関東"
    });
    section3 = Ti.UI.createListSection({
      headerTitle: "中部"
    });
    section4 = Ti.UI.createListSection({
      headerTitle: "近畿"
    });
    section5 = Ti.UI.createListSection({
      headerTitle: "中国・四国"
    });
    section6 = Ti.UI.createListSection({
      headerTitle: "九州・沖縄"
    });
    array1 = [];
    array2 = [];
    array3 = [];
    array4 = [];
    array5 = [];
    array6 = [];
    for (_i = 0, _len = Prefectures.length; _i < _len; _i++) {
      _items = Prefectures[_i];
      switch (_items.area) {
        case "北海道・東北":
          array1.push({
            title: {
              text: _items.name
            }
          });
          break;
        case "関東":
          array2.push({
            title: {
              text: _items.name
            }
          });
          break;
        case "中部":
          array3.push({
            title: {
              text: _items.name
            }
          });
          break;
        case "近畿":
          array4.push({
            title: {
              text: _items.name
            }
          });
          break;
        case "中国・四国":
          array5.push({
            title: {
              text: _items.name
            }
          });
          break;
        default:
          array6.push({
            title: {
              text: _items.name
            }
          });
      }
    }
    section1.setItems(array1);
    section2.setItems(array2);
    section3.setItems(array3);
    section4.setItems(array4);
    section5.setItems(array5);
    section6.setItems(array6);
    sections = [section1, section2, section3, section4, section5, section6];
    return sections;
  };

  topWindow.prototype.showShopArea = function(e) {
    var KloudService, index, kloudService, prefectureName, that;
    that = this;
    that.activityIndicator.show();
    index = e.itemIndex;
    prefectureName = e.section.items[index].title.text;
    KloudService = require("model/kloudService");
    kloudService = new KloudService();
    return kloudService.findShopDataBy(prefectureName, function(items) {
      var ShopAreaDataWindow, shopWindow;
      that.activityIndicator.hide();
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
        shopWindow = new ShopAreaDataWindow(items);
        return shopWindow.open();
      }
    });
  };

  return topWindow;

})();

module.exports = topWindow;
