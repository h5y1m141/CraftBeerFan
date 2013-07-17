var listWindow;

listWindow = (function() {

  function listWindow() {
    var PrefectureCategory, ShopDataTableView, categoryName, defaultArea, favoriteLabel, favoriteRow, headerLabel, headerPoint, index, listWindowTitle, shopDataTableView, subMenuRow, subMenuRows,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      keyColor: "#EDAD0B"
    };
    listWindow = Ti.UI.createWindow({
      title: "リスト",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: false,
      navBarHidden: false
    });
    this.prefectures = this._loadPrefectures();
    this.rowHeight = 60;
    this.subMenu = Ti.UI.createTableView({
      backgroundColor: "#f3f3f3",
      separatorColor: '#cccccc',
      width: "auto",
      height: 'auto',
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
    this.arrowImage = Ti.UI.createView({
      width: 50,
      height: 50,
      left: 150,
      top: 5,
      borderRadius: 5,
      transform: Ti.UI.create2DMatrix().rotate(45),
      borderColor: "#f3f3f3",
      borderWidth: 1,
      backgroundColor: "#007FB1",
      zIndex: 5
    });
    ShopDataTableView = require('ui/shopDataTableView');
    shopDataTableView = new ShopDataTableView();
    this.shopData = shopDataTableView.getTable();
    defaultArea = {
      n: "北海道・東北",
      c: "#3261AB",
      s: "#FFF"
    };
    shopDataTableView.refreshTableData(defaultArea.n, defaultArea.c, defaultArea.s);
    this.subMenu.addEventListener('click', function(e) {
      var FavoriteWindow, arrowImage, categoryName, curretRowIndex　, favoriteWindow, rowHeight, selectedColor, selectedSubColor, shopData;
      categoryName = e.row.categoryName;
      if (categoryName === "お気に入り") {
        FavoriteWindow = require("ui/favoriteWindow");
        return favoriteWindow = new FavoriteWindow();
      } else {
        selectedColor = _this.prefectureColorSet.name[categoryName];
        selectedSubColor = "#FFF";
        curretRowIndex　 = e.index;
        rowHeight = _this.rowHeight;
        shopData = _this.shopData;
        arrowImage = _this.arrowImage;
        _this.arrowImage.hide();
        return shopData.animate({
          duration: 400,
          left: 300
        }, function() {
          var arrowImagePosition;
          shopDataTableView.refreshTableData(categoryName, selectedColor, selectedSubColor);
          arrowImagePosition = (curretRowIndex + 1) * rowHeight - 55;
          arrowImage.backgroundColor = selectedColor;
          arrowImage.top = arrowImagePosition;
          return shopData.animate({
            duration: 400,
            left: 150
          }, function() {
            return arrowImage.show();
          });
        });
      }
    });
    PrefectureCategory = this._makePrefectureCategory(this.prefectures);
    subMenuRows = [];
    index = 0;
    for (categoryName in PrefectureCategory) {
      headerPoint = Ti.UI.createView({
        width: '10sp',
        height: "50sp",
        top: 5,
        left: 10,
        backgroundColor: this.prefectureColorSet.name[categoryName]
      });
      headerLabel = Ti.UI.createLabel({
        text: "" + categoryName,
        top: 15,
        left: 30,
        color: "#222",
        font: {
          fontSize: '18sp',
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        }
      });
      subMenuRow = Ti.UI.createTableViewRow({
        width: 150,
        height: this.rowHeight,
        rowID: index,
        backgroundColor: "f3f3f3",
        categoryName: "" + categoryName
      });
      subMenuRow.add(headerPoint);
      subMenuRow.add(headerLabel);
      subMenuRows.push(subMenuRow);
      index++;
    }
    favoriteRow = Ti.UI.createTableViewRow({
      width: 150,
      height: this.rowHeight,
      backgroundColor: "f3f3f3",
      categoryName: "お気に入り"
    });
    favoriteLabel = Ti.UI.createLabel({
      width: 240,
      height: 40,
      top: 5,
      left: 30,
      textAlign: 'left',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "お気に入り"
    });
    favoriteRow.add(favoriteLabel);
    subMenuRows.push(favoriteRow);
    this.subMenu.setData(subMenuRows);
    listWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: '18sp',
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "リストから探す"
    });
    if (Ti.Platform.osname === 'iphone') {
      listWindow.setTitleControl(listWindowTitle);
    }
    listWindow.add(this.subMenu);
    listWindow.add(this.shopData);
    listWindow.add(this.arrowImage);
    return listWindow;
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

  return listWindow;

})();

module.exports = listWindow;
