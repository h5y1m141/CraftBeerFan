var listWindow;

listWindow = (function() {

  function listWindow() {
    var PrefectureCategory, ShopDataTableView, categoryName, headerLabel, headerPoint, index, listWindowTitle, shopData, shopDataTableView, subMenuRow, subMenuRows,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      keyColor: "#EDAD0B"
    };
    listWindow = Ti.UI.createWindow({
      title: "リストから探す",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: false,
      navBarHidden: true
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
      zIndex: 5
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
    this.arrowImage = Ti.UI.createImageView({
      width: 50,
      height: 50,
      left: 150,
      top: 35,
      borderRadius: 5,
      transform: Ti.UI.create2DMatrix().rotate(45),
      borderColor: "#f3f3f3",
      borderWidth: 1,
      backgroundColor: "#007FB1"
    });
    ShopDataTableView = require('ui/shopDataTableView');
    shopDataTableView = new ShopDataTableView();
    shopData = shopDataTableView.getTable();
    this.subMenu.addEventListener('click', function(e) {
      var categoryName, curretRowIndex　, rowHeight, selectedColor, selectedSubColor;
      categoryName = e.row.categoryName;
      selectedColor = _this.prefectureColorSet.name[categoryName];
      selectedSubColor = _this.prefectureSubColorSet.name[categoryName];
      curretRowIndex　 = e.index;
      rowHeight = _this.rowHeight;
      _this.arrowImage.hide();
      return shopData.animate({
        duration: 400,
        left: 300
      }, function() {
        var arrowImagePosition;
        shopData.refreshTableData(categoryName, selectedColor, selectedSubColor);
        arrowImagePosition = (curretRowIndex + 1) * rowHeight - 55;
        this.arrowImage.backgroundColor = selectedColor;
        this.arrowImage.top = arrowImagePosition;
        return shopData.animate({
          duration: 400,
          left: 150
        }, function() {
          return arrowImage.show();
        });
      });
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
        selectedColor: 'transparent',
        backgroundColor: "f3f3f3",
        categoryName: "" + categoryName
      });
      subMenuRow.add(headerPoint);
      subMenuRow.add(headerLabel);
      subMenuRows.push(subMenuRow);
      index++;
    }
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
