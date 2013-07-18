var Cloud, ListWindow, MapWindow, MypageWindow, NappSlideMenu, listTab, listWindow, mapTab, mapWindow, mypageTab, mypageWindow, tabGroup;

Cloud = require('ti.cloud');

NappSlideMenu = require('dk.napp.slidemenu');

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
  Ti.API.info(tabGroup._activeTab);
});

MapWindow = require("ui/mapWindow");

mapWindow = new MapWindow();

mapTab = Titanium.UI.createTab({
  window: mapWindow,
  icon: "ui/image/light_pin.png"
});

MypageWindow = require("ui/mypageWindow");

mypageWindow = new MypageWindow();

mypageTab = Titanium.UI.createTab({
  window: mypageWindow,
  icon: "ui/image/light_gears.png"
});

ListWindow = require("ui/listWindow");

listWindow = new ListWindow();

listTab = Titanium.UI.createTab({
  window: listWindow,
  icon: "ui/image/light_list.png"
});

tabGroup.addTab(mapTab);

tabGroup.addTab(listTab);

tabGroup.addTab(mypageTab);

tabGroup.open();
