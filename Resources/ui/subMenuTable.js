var subMenuTable;

subMenuTable = (function() {

  function subMenuTable() {
    var PrefectureCategory, categoryName, headerLabel, headerPoint, index, subMenuRow, subMenuRows,
      _this = this;
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
    this.subMenu.addEventListener('click', function(e) {
      var arrowImagePosition, categoryName, curretRowIndex　, selectedColor, selectedSubColor;
      categoryName = e.row.categoryName;
      selectedColor = _this.prefectureColorSet.name[categoryName];
      selectedSubColor = _this.prefectureSubColorSet.name[categoryName];
      curretRowIndex　 = e.index;
      shopData.refreshTableData(categoryName, selectedColor, selectedSubColor);
      arrowImagePosition = (curretRowIndex + 1) * _this.rowHeight - 55;
      cbFan.arrowImage.backgroundColor = selectedColor;
      cbFan.arrowImage.top = arrowImagePosition;
      return cbFan.arrowImage.show();
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
        touchEnabled: false,
        bubbleParent: false,
        backgroundColor: "f3f3f3",
        categoryName: "" + categoryName
      });
      subMenuRow.add(headerPoint);
      subMenuRow.add(headerLabel);
      subMenuRows.push(subMenuRow);
      index++;
    }
    this.subMenu.setData(subMenuRows);
    return this.subMenu;
  }

  subMenuTable.prototype._loadPrefectures = function() {
    var file, json, prefectures;
    prefectures = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/prefectures.json");
    file = prefectures.read().toString();
    json = JSON.parse(file);
    return json;
  };

  subMenuTable.prototype._makePrefectureCategory = function(data) {
    var result, _;
    _ = require("lib/underscore-1.4.3.min");
    result = _.groupBy(data, function(row) {
      return row.area;
    });
    return result;
  };

  return subMenuTable;

})();

module.exports = subMenuTable;
