var menuTable;

menuTable = (function() {

  function menuTable() {
    var listLabel, listRow, mapLabel, mapRow, menuHeaderTitle, menuHeaderView, menuSection, rows;
    this.Menu = Ti.UI.createTableView({
      backgroundColor: "#3f3f3f",
      separatorColor: '#cccccc',
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
      width: 200,
      height: 'auto',
      left: 0,
      top: 0,
      zIndex: 1
    });
    this.Menu.addEventListener('click', function(e) {});
    rows = [];
    menuHeaderView = Ti.UI.createView({
      backgroundColor: "#3f3f3f",
      height: 30
    });
    menuHeaderTitle = Ti.UI.createLabel({
      top: 0,
      left: 5,
      color: '#ccc',
      font: {
        fontSize: '24',
        fontFamily: "Lato-Light.ttf"
      },
      text: 'Menu'
    });
    menuHeaderView.add(menuHeaderTitle);
    menuSection = Ti.UI.createTableViewSection({
      headerView: menuHeaderView
    });
    listRow = Ti.UI.createTableViewRow({
      selectedColor: "#3f3f3f",
      color: "#f3f3f3",
      height: 40,
      className: "List"
    });
    listLabel = Ti.UI.createLabel({
      top: 5,
      left: 5,
      color: '#ccc',
      font: {
        fontSize: '18sp',
        fontFamily: "Lato-Light.ttf"
      },
      text: "List"
    });
    mapLabel = Ti.UI.createLabel({
      top: 5,
      left: 5,
      color: '#ccc',
      font: {
        fontSize: '18sp',
        fontFamily: "Lato-Light.ttf"
      },
      text: 'Map'
    });
    mapRow = Ti.UI.createTableViewRow({
      color: "#f3f3f3",
      selectedColor: 'transparent',
      height: 40,
      className: "Map"
    });
    mapRow.add(mapLabel);
    listRow.add(listLabel);
    menuSection.add(listRow);
    menuSection.add(mapRow);
    rows.push(menuSection);
    this.Menu.setData(rows);
    return;
  }

  menuTable.prototype.getTable = function() {
    return this.Menu;
  };

  menuTable.prototype.show = function() {
    return this.Menu.show();
  };

  menuTable.prototype.hide = function() {
    return this.Menu.hide();
  };

  return menuTable;

})();

module.exports = menuTable;
