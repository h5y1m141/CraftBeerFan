var listWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

listWindow = (function() {

  function listWindow() {
    this.refreshTableData = __bind(this.refreshTableData, this);

    var ActivityIndicator, PrefectureCategory, categoryName, favoriteRow, row, subMenuRows, t,
      _this = this;
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
      tabBarHidden: false,
      navBarHidden: false
    });
    this._createNavbarElement();
    t = Titanium.UI.create2DMatrix().scale(0);
    this.table = Ti.UI.createTableView({
      backgroundColor: "#f3f3f3",
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
      width: 160,
      height: 'auto',
      left: 150,
      top: 20,
      borderColor: "#f3f3f3",
      borderWidth: 2,
      borderRadius: 10,
      zIndex: 10,
      transform: t
    });
    this.table.addEventListener('click', function(e) {
      var KloudService, kloudService, prefectureName, that;
      that = _this;
      that.activityIndicator.show();
      prefectureName = e.row.prefectureName;
      KloudService = require("model/kloudService");
      kloudService = new KloudService();
      return kloudService.findShopDataBy(prefectureName, function(items) {
        var ShopAreaDataWindow;
        that.activityIndicator.hide();
        if (items.length === 0) {
          return alert("選択した地域のお店がみつかりません");
        } else {
          Ti.API.info("kloudService success");
          ShopAreaDataWindow = require("ui/shopAreaDataWindow");
          return new ShopAreaDataWindow(items);
        }
      });
    });
    this.prefectures = this._loadPrefectures();
    this.rowHeight = 50;
    this.subMenu = Ti.UI.createTableView({
      backgroundColor: "#f3f3f3",
      separatorColor: '#cccccc',
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      width: "auto",
      height: "auto",
      left: 0,
      top: 0,
      zIndex: 1
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
    this.subMenu.addEventListener('click', function(e) {
      var FavoriteWindow, a, categoryName, curretRowIndex　, favoriteWindow, selectedColor, selectedSubColor, t1, table, that;
      categoryName = e.row.categoryName;
      that = _this;
      if (categoryName === "お気に入り") {
        FavoriteWindow = require("ui/favoriteWindow");
        return favoriteWindow = new FavoriteWindow();
      } else {
        selectedColor = _this.prefectureColorSet.name[categoryName];
        selectedSubColor = "#FFF";
        curretRowIndex　 = e.index;
        table = _this.table;
        t1 = Titanium.UI.create2DMatrix().scale(0.0);
        a = Titanium.UI.createAnimation();
        a.transform = t1;
        a.duration = 400;
        a.addEventListener('complete', function() {
          var t2;
          t2 = Titanium.UI.create2DMatrix();
          return table.animate({
            transform: t2,
            duration: 400
          });
        });
        return table.animate(a, function() {
          return that.refreshTableData(categoryName, selectedColor, selectedSubColor);
        });
      }
    });
    PrefectureCategory = this._makePrefectureCategory(this.prefectures);
    subMenuRows = [];
    for (categoryName in PrefectureCategory) {
      row = this._createSubMenuRow("" + categoryName);
      subMenuRows.push(row);
    }
    favoriteRow = this._createFavoriteRow();
    subMenuRows.push(favoriteRow);
    this.subMenu.setData(subMenuRows);
    this.listWindow.add(this.subMenu);
    this.listWindow.add(this.table);
    this.listWindow.add(this.activityIndicator);
    return this.listWindow;
  }

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

  listWindow.prototype._createNavbarElement = function() {
    var listWindowTitle;
    listWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "リストから探す"
    });
    if (Ti.Platform.osname === 'iphone') {
      this.listWindow.setTitleControl(listWindowTitle);
    }
  };

  listWindow.prototype._createFavoriteRow = function() {
    var favoriteIcon, favoriteLabel, favoriteRow;
    favoriteRow = Ti.UI.createTableViewRow({
      width: 150,
      height: this.rowHeight,
      backgroundColor: "f3f3f3",
      categoryName: "お気に入り"
    });
    favoriteIcon = Ti.UI.createLabel({
      width: 20,
      left: 10,
      top: 5,
      color: "#FFE600",
      font: {
        fontSize: 24,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe121")
    });
    favoriteLabel = Ti.UI.createLabel({
      width: 240,
      height: 24,
      top: 5,
      left: 30,
      textAlign: 'left',
      color: '#333',
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "お気に入り"
    });
    favoriteRow.add(favoriteIcon);
    favoriteRow.add(favoriteLabel);
    return favoriteRow;
  };

  listWindow.prototype._createSubMenuRow = function(categoryName) {
    var headerLabel, headerPoint, subMenuRow;
    headerPoint = Ti.UI.createView({
      width: 10,
      height: 30,
      top: 5,
      left: 10,
      backgroundColor: this.prefectureColorSet.name[categoryName]
    });
    headerLabel = Ti.UI.createLabel({
      text: categoryName,
      top: 5,
      left: 30,
      color: "#222",
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
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

  listWindow.prototype.refreshTableData = function(categoryName, selectedColor, selectedSubColor) {
    var PrefectureCategory, prefectureNameList, prefectureRow, rows, textLabel, _i, _items, _len;
    rows = [];
    PrefectureCategory = this._makePrefectureCategory(this.prefectures);
    prefectureNameList = PrefectureCategory[categoryName];
    for (_i = 0, _len = prefectureNameList.length; _i < _len; _i++) {
      _items = prefectureNameList[_i];
      prefectureRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 40,
        hasChild: true,
        prefectureName: "" + _items.name
      });
      textLabel = Ti.UI.createLabel({
        width: 240,
        height: 40,
        top: 5,
        left: 30,
        textAlign: 'left',
        color: '#333',
        font: {
          fontSize: 16,
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
    return this.table.setData(rows);
  };

  return listWindow;

})();

module.exports = listWindow;
