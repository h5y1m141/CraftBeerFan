var mainController,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

mainController = (function() {

  function mainController() {
    this._login = __bind(this._login, this);

    this.getReviewInfo = __bind(this.getReviewInfo, this);

    this.createReview = __bind(this.createReview, this);

    var KloudService;
    KloudService = require("model/kloudService");
    this.kloudService = new KloudService();
  }

  mainController.prototype.init = function() {
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

  mainController.prototype.createTabGroup = function() {
    var ListWindow, MapWindow, MypageWindow, listTab, listWindow, mapTab, mapWindow, mypageTab, mypageWindow, tabGroup;
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
        Ti.App.Properties.setString("userName", userID);
        Ti.App.Properties.setString("currentUserPassword", password);
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

  mainController.prototype.createReview = function(ratings, contents, shopName, currentUserId, callback) {
    var that;
    that = this;
    return this._login(function(loginResult) {
      if (loginResult.success) {
        return that.kloudService.reviewsCreate(ratings, contents, shopName, currentUserId, function(reviewResutl) {
          return callback(reviewResutl);
        });
      } else {
        return alert("登録されているユーザ情報でサーバにログインできませんでした");
      }
    });
  };

  mainController.prototype.getReviewInfo = function(callback) {
    var that;
    that = this;
    this._login(function(result) {
      if (result.success) {
        return that.kloudService.reviewsQuery(function(result) {
          return callback(result);
        });
      } else {
        return alert("登録されているユーザ情報でサーバにログインできませんでした");
      }
    });
  };

  mainController.prototype._login = function(callback) {
    var currentUserId, loginType, password, userName;
    currentUserId = Ti.App.Properties.getString("currentUserId");
    userName = Ti.App.Properties.getString("userName");
    password = Ti.App.Properties.getString("currentUserPassword");
    loginType = Ti.App.Properties.getString("loginType");
    Ti.API.info("loginType is " + loginType + " userName is " + userName + " password is " + password);
    if (loginType === "facebook") {
      return this.kloudService.fbLogin(function(result) {
        var user;
        if (result.success) {
          user = result.users[0];
          Ti.App.Properties.setString("currentUserName", "" + user.first_name + " " + user.last_name);
          return callback(result);
        }
      });
    } else {
      return this.kloudService.cbFanLogin(userName, password, function(result) {
        var user;
        if (result.success) {
          user = result.users[0];
          Ti.App.Properties.setString("currentUserName", "" + user.username);
          return callback(result);
        }
      });
    }
  };

  return mainController;

})();

module.exports = mainController;
