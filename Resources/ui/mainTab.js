var mainTab;

mainTab = (function() {

  function mainTab() {
    var item, itemList, items, mainWindow, mainWindowTitle, menu, section, _i, _len;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      keyColor: "#EDAD0B"
    };
    this.table = Ti.UI.createTableView({
      backgroundColor: this.baseColor.backgroundColor,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      width: 'auto',
      height: 'auto',
      left: 0,
      top: 10
    });
    this.table.addEventListener('click', function(e) {
      if (e.row.className === "menu") {
        return Ti.API.info("Window name:" + cbFan[e.row.windowName]);
      }
    });
    itemList = [
      {
        "name": "近くから探す",
        "imageCharCode": "0xe103",
        "backgroundColor": "#3261AB",
        "windowName": "mapWindow"
      }, {
        "name": "リストから探す",
        "imageCharCode": "0xe084",
        "backgroundColor": "#007FB1",
        "windowName": "listWindow"
      }, {
        "name": "お気に入りから探す",
        "imageCharCode": "0xe041",
        "backgroundColor": "#DA5019",
        "windowName": "favoriteWindow"
      }, {
        "name": "マイページ",
        "imageCharCode": "0xe137",
        "backgroundColor": "#23AC0E",
        "windowName": "mypageWindow"
      }
    ];
    section = this._createSection();
    items = [];
    for (_i = 0, _len = itemList.length; _i < _len; _i++) {
      item = itemList[_i];
      menu = this._createMenu(item);
      section.add(menu);
    }
    items.push(section);
    this.table.setData(items);
    mainWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: '18sp',
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "main"
    });
    mainWindow = Ti.UI.createWindow({
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.barColor,
      tabBarHidden: true,
      navBarHidden: true
    });
    if (Ti.Platform.osname === 'iphone') {
      mainWindow.setTitleControl(mainWindowTitle);
    }
    mainWindow.add(this.table);
    mainTab = Ti.UI.createTab({
      window: mainWindow
    });
    return mainTab;
  }

  mainTab.prototype._createSection = function() {
    var menuHeaderTitle, menuHeaderView, menuSection;
    menuHeaderView = Ti.UI.createView({
      backgroundColor: this.baseColor.backgroundColor,
      height: 30
    });
    menuHeaderTitle = Ti.UI.createLabel({
      top: 0,
      left: 5,
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: 'メニュー'
    });
    menuHeaderView.add(menuHeaderTitle);
    menuSection = Ti.UI.createTableViewSection({
      headerView: menuHeaderView
    });
    return menuSection;
  };

  mainTab.prototype._createMenu = function(item) {
    var icon, menuLabel, menuRow;
    menuRow = Ti.UI.createTableViewRow({
      backgroundColor: this.baseColor.backgroundColor,
      height: 60,
      hasChild: true,
      className: "menu",
      windowName: item.windowName
    });
    menuLabel = Ti.UI.createLabel({
      text: "" + item.name,
      width: 200,
      color: "#333",
      left: 60,
      top: 10,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    icon = Ti.UI.createButton({
      top: 10,
      left: 10,
      width: 40,
      height: 40,
      backgroundColor: item.backgroundColor,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 0,
      color: '#fff',
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      title: String.fromCharCode(item.imageCharCode)
    });
    menuRow.add(menuLabel);
    menuRow.add(icon);
    return menuRow;
  };

  return mainTab;

})();

module.exports = mainTab;
