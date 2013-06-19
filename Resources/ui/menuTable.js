var menuTable;

menuTable = (function() {

  function menuTable() {
    var listRow, mapRow, menuSection, rows;
    this.Menu = Ti.UI.createTableView({
      backgroundColor: "#3f3f3f",
      separatorColor: '#cccccc',
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
      width: "150sp",
      height: 'auto',
      left: 0,
      top: 0,
      zIndex: 20
    });
    this.Menu.addEventListener('click', function(e) {});
    rows = [];
    menuSection = Ti.UI.createTableViewSection({
      title: "Menu"
    });
    listRow = Ti.UI.createTableViewRow({
      title: "List",
      color: "#f3f3f3"
    });
    mapRow = Ti.UI.createTableViewRow({
      title: "表示",
      color: "#f3f3f3"
    });
    menuSection.add(listRow);
    menuSection.add(mapRow);
    rows.push(menuSection);
    this.Menu.setData(rows);
    this.Menu.hide();
    return;
  }

  menuTable.prototype.getTable = function() {
    return this.Menu;
  };

  menuTable.prototype.show = function() {
    return this.Menu.show();
  };

  return menuTable;

})();

module.exports = menuTable;
