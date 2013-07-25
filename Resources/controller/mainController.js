var mainController;

mainController = (function() {

  function mainController() {
    var Cloud, ListWindow, MapWindow, MypageWindow, listTab, listWindow, mapTab, mapWindow, mypageTab, mypageWindow, tabGroup;
    Cloud = require('ti.cloud');
    tabGroup = Ti.UI.createTabGroup({
      tabsBackgroundColor: "#f9f9f9",
      shadowImage: "ui/image/shadowimage.png",
      tabsBackgroundImage: "ui/image/tabbar.png",
      activeTabBackgroundImage: "ui/image/activetab.png",
      activeTabIconTint: "#fffBD5"
    });
    tabGroup.addEventListener('focus', function(e) {
      tabGroup._activeTab = e.tab;
      tabGroup._activeTabIndex = e.index;
      if (tabGroup._activeTabIndex === -1) {
        return;
      }
      Ti.API._activeTab = tabGroup._activeTab;
      Ti.App.Analytics.trackPageview("/tab/" + tabGroup._activeTab.windowName);
    });
    MapWindow = require("ui/mapWindow");
    mapWindow = new MapWindow();
    mapTab = Titanium.UI.createTab({
      window: mapWindow,
      icon: "ui/image/light_pin.png",
      windowName: "mapWindow"
    });
    MypageWindow = require("ui/mypageWindow");
    mypageWindow = new MypageWindow();
    mypageTab = Titanium.UI.createTab({
      window: mypageWindow,
      icon: "ui/image/light_gears.png",
      windowName: "mypageWindow"
    });
    ListWindow = require("ui/listWindow");
    listWindow = new ListWindow();
    listTab = Titanium.UI.createTab({
      window: listWindow,
      icon: "ui/image/light_list.png",
      windowName: "listWindow"
    });
    tabGroup.addTab(mapTab);
    tabGroup.addTab(listTab);
    tabGroup.addTab(mypageTab);
    tabGroup.open();
  }

  return mainController;

})();

module.exports = mainController;
