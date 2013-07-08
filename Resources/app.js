var ActivityIndicator, Cloud, activityIndicator, mainTab, shopDataTableView, tabGroup;

Cloud = require('ti.cloud');

shopDataTableView = require('ui/shopDataTableView');

ActivityIndicator = require('ui/activityIndicator');

activityIndicator = new ActivityIndicator();

tabGroup = Ti.UI.createTabGroup({
  tabsBackgroundColor: "#f9f9f9",
  shadowImage: "ui/image/shadowimage.png"
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

mainTab = require("ui/mainTab");

mainTab = new mainTab();

tabGroup.addTab(mainTab);

tabGroup.open();
