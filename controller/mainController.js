(function() {
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
      this.tabSetting = {
        "iphone": {
          "map": {
            "icon": "ui/image/grayPin.png",
            "activeIcon": "ui/image/pin.png",
            "windowName": "mapWindow"
          },
          "list": {
            "icon": "ui/image/listIcon.png",
            "activeIcon": "ui/image/listIconActive.png",
            "windowName": "listWindow"
          },
          "myPage": {
            "icon": "ui/image/settingIcon.png",
            "activeIcon": "ui/image/activeSettingIcon.png",
            "windowName": "mypageWindow"
          }
        },
        "android": {
          "map": {
            "icon": "ui/image/grayPin@2x.png",
            "activeIcon": "ui/image/pin@2x.png",
            "windowName": "mapWindow"
          },
          "list": {
            "icon": "ui/image/listIcon@2x.png",
            "activeIcon": "ui/image/listIconActive@2x.png",
            "windowName": "listWindow"
          },
          "myPage": {
            "icon": "ui/image/settingIcon@2x.png",
            "activeIcon": "ui/image/activeSettingIcon@2x.png",
            "windowName": "mypageWindow"
          }
        }
      };
    }

    mainController.prototype.createTabGroup = function() {
      var ListWindow, MapWindow, MypageWindow, listTab, listWindow, mapTab, mapWindow, mypageTab, mypageWindow, osname, tabGroup;
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
      osname = Ti.Platform.osname;
      Ti.API.info("osname is " + osname);
      MapWindow = require("ui/" + osname + "/mapWindow");
      mapWindow = new MapWindow();
      mapTab = Titanium.UI.createTab({
        window: mapWindow,
        icon: this.tabSetting[osname].map.icon,
        activeIcon: this.tabSetting[osname].map.activeIcon,
        windowName: this.tabSetting[osname].map.windowName
      });
      ListWindow = require("ui/" + osname + "/listWindow");
      listWindow = new ListWindow();
      listTab = Titanium.UI.createTab({
        window: listWindow,
        icon: this.tabSetting[osname].list.icon,
        activeIcon: this.tabSetting[osname].list.activeIcon,
        windowName: this.tabSetting[osname].list.windowName
      });
      MypageWindow = require("ui/" + osname + "/mypageWindow");
      mypageWindow = new MypageWindow();
      mypageTab = Titanium.UI.createTab({
        window: mypageWindow,
        icon: this.tabSetting[osname].myPage.icon,
        activeIcon: this.tabSetting[osname].myPage.activeIcon,
        windowName: this.tabSetting[osname].myPage.windowName
      });
      tabGroup.addTab(mapTab);
      tabGroup.addTab(listTab);
      tabGroup.addTab(mypageTab);
      tabGroup.open();
    };

    mainController.prototype.signUP = function(userID, password) {
      var KloudService, kloudService;
      KloudService = require("model/kloudService");
      kloudService = new KloudService();
      kloudService.signUP(userID, password, (function(_this) {
        return function(result) {
          var user;
          if (result.success) {
            Ti.App.Properties.setBool("configurationWizard", true);
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
        };
      })(this));
    };

    mainController.prototype.fbLogin = function() {
      var KloudService, kloudService;
      KloudService = require("model/kloudService");
      kloudService = new KloudService();
      kloudService.fbLogin((function(_this) {
        return function(result) {
          var user;
          Ti.API.info("kloudService fbLogin click. result is " + result);
          if (result.success) {
            Ti.App.Properties.setBool("configurationWizard", true);
            user = result.users[0];
            Ti.App.Properties.setString("currentUserId", user.id);
            Ti.App.Properties.setString("userName", user.first_name + " " + user.last_name);
            Ti.App.Properties.setString("loginType", "facebook");
            return _this.createTabGroup();
          } else {
            return alert("Facebookアカウントでログイン失敗しました");
          }
        };
      })(this));
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
        Ti.API.info("getReviewInfo start result is " + result.success);
        if (result.success) {
          return that.kloudService.reviewsQuery(function(result) {
            return callback(result);
          });
        } else {
          return alert("登録されているユーザ情報でサーバにログインできませんでした");
        }
      });
    };

    mainController.prototype.sendFeedBack = function(contents, shopName, currentUserId, callback) {
      return this.kloudService.sendFeedBack(contents, shopName, currentUserId, function(result) {
        return callback(result);
      });
    };

    mainController.prototype._login = function(callback) {
      var currentUserId, loginType, password, userName;
      currentUserId = Ti.App.Properties.getString("currentUserId");
      userName = Ti.App.Properties.getString("userName");
      password = Ti.App.Properties.getString("currentUserPassword");
      loginType = Ti.App.Properties.getString("loginType");
      Ti.API.info("loginType is " + loginType);
      if (loginType === "facebook") {
        return this.kloudService.fbLogin(function(result) {
          return callback(result);
        });
      } else {
        return this.kloudService.cbFanLogin(userName, password, function(result) {
          var user;
          if (result.success) {
            user = result.users[0];
            Ti.App.Properties.setString("userName", "" + user.username);
            return callback(result);
          }
        });
      }
    };

    return mainController;

  })();

  module.exports = mainController;

}).call(this);
