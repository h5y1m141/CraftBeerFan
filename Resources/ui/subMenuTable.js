var subMenuTable;

subMenuTable = (function() {

  function subMenuTable() {
    var PrefectureCategory, categoryName, headerLabel, headerPoint, prefectureColorSet, subMenuRow, subMenuRows;
    this.prefectures = this._loadPrefectures();
    this.subMenu = Ti.UI.createTableView({
      backgroundColor: "#f3f3f3",
      separatorColor: '#cccccc',
      width: "150sp",
      height: 'auto',
      left: 0,
      top: 0,
      zIndex: 5
    });
    this.subMenu.addEventListener('click', function(e) {
      var categoryName;
      categoryName = e.row.categoryName;
      Ti.API.info(categoryName);
      return shopData.refreshTableData(categoryName);
    });
    PrefectureCategory = this._makePrefectureCategory(this.prefectures);
    subMenuRows = [];
    for (categoryName in PrefectureCategory) {
      prefectureColorSet = {
        "name": {
          "北海道・東北": "#3261AB",
          "関東": "#007FB1",
          "中部": "#23AC0E",
          "近畿": "#FFE600",
          "中国・四国": "#F6CA06",
          "九州・沖縄": "#DA5019"
        }
      };
      headerPoint = Ti.UI.createView({
        width: '10sp',
        height: "30sp",
        top: 5,
        left: 10,
        backgroundColor: prefectureColorSet.name[categoryName]
      });
      headerLabel = Ti.UI.createLabel({
        text: "" + categoryName,
        top: 0,
        left: 30,
        color: "#222",
        font: {
          fontSize: '18sp',
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        }
      });
      subMenuRow = Ti.UI.createTableViewRow({
        width: '150sp',
        height: '40sp',
        backgroundColor: "f3f3f3",
        categoryName: "" + categoryName
      });
      subMenuRow.add(headerPoint);
      subMenuRow.add(headerLabel);
      subMenuRows.push(subMenuRow);
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
