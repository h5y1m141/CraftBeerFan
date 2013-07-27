var mainController;

mainController = (function() {

  function mainController() {}

  mainController.prototype.createTabGroup = function() {
    var KloudService, ListWindow, MapWindow, MypageWindow, currentUserId, kloudService, listTab, listWindow, mapTab, mapWindow, mypageTab, mypageWindow, tabGroup,
      _this = this;
    currentUserId = Ti.App.Properties.getString("currentUserId");
    KloudService = require("model/kloudService");
    kloudService = new KloudService();
    kloudService.getCurrentUserInfo(currentUserId, function(result) {
      var user;
      if (result.success) {
        user = result.users[0];
        return Ti.App.Properties.setString("currentUserName", "" + user.username);
      }
    });
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
  };

  mainController.prototype.signUP = function(userID, password) {
    var KloudService, kloudService,
      _this = this;
    KloudService = require("model/kloudService");
    kloudService = new KloudService();
    kloudService.signUP(userID, password, function(result) {
      var user;
      if (result.success) {
        user = result.users[0];
        Ti.App.Properties.setString("currentUserId", user.id);
        Ti.App.Properties.setString("loginType", "craftbeer-fan");
        return _this.createTabGroup();
      } else {
        alert("アカウント登録に失敗しました");
        return Ti.API.info("Error:\n" + ((result.error && result.message) || JSON.stringify(result)));
      }
    });
  };

  mainController.prototype.fbLogin = function() {
    var KloudService, kloudService,
      _this = this;
    KloudService = require("model/kloudService");
    kloudService = new KloudService();
    kloudService.fbLogin(function(result) {
      var user;
      if (result.success) {
        user = result.users[0];
        Ti.App.Properties.setString("currentUserId", user.id);
        Ti.App.Properties.setString("loginType", "facebook");
        return _this.createTabGroup();
      } else {
        return alert("Facebookアカウントでログイン失敗しました");
      }
    });
  };

  mainController.prototype.isLogin = function() {
    var LoginForm, currentUserId, loginForm, win;
    currentUserId = Ti.App.Properties.getString("currentUserId");
    if (currentUserId === null || typeof currentUserId === "undefined") {
      win = Ti.UI.createWindow({
        title: "ユーザ登録画面",
        barColor: "#f9f9f9",
        backgroundColor: "#f3f3f3",
        tabBarHidden: false,
        navBarHidden: false
      });
      LoginForm = require("ui/loginForm");
      loginForm = new LoginForm();
      win.add(loginForm);
      win.open();
    } else {
      this.createTabGroup();
    }
  };

  return mainController;

})();

module.exports = mainController;
