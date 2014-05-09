(function() {
  var shopDataDetailWindow;

  shopDataDetailWindow = (function() {
    function shopDataDetailWindow(data) {
      var ActivityIndicator, activeTab, filterView, keyColor;
      filterView = require("net.uchidak.tigfview");
      keyColor = "#f9f9f9";
      this.baseColor = {
        barColor: keyColor,
        backgroundColor: "#f3f3f3",
        keyColor: "#DA5019",
        textColor: "#333",
        phoneColor: "#3261AB",
        favoriteColor: "#DA5019",
        feedbackColor: "#DA5019",
        separatorColor: '#cccccc'
      };
      this.mapView = Titanium.Map.createView({
        mapType: Titanium.Map.STANDARD_TYPE,
        region: {
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        },
        animate: true,
        regionFit: true,
        userLocation: true,
        zIndex: 0,
        top: 0,
        left: 0,
        height: 200,
        width: 'auto'
      });
      this.shopDataDetailWindow = Ti.UI.createWindow({
        title: "近くのお店",
        barColor: this.baseColor.barColor,
        backgroundColor: this.baseColor.backgroundColor,
        navBarHidden: false,
        tabBarHidden: false
      });
      this._createNavbarElement();
      this._createMapView(data);
      this._createTableView(data);
      ActivityIndicator = require("ui/activityIndicator");
      this.activityIndicator = new ActivityIndicator();
      this.shopDataDetailWindow.add(this.activityIndicator);
      activeTab = Ti.API._activeTab;
      return activeTab.open(this.shopDataDetailWindow);
    }

    shopDataDetailWindow.prototype._createNavbarElement = function() {
      var backButton, shopDataDetailWindowTitle;
      backButton = Titanium.UI.createButton({
        backgroundImage: "ui/image/backButton.png",
        width: 44,
        height: 44
      });
      backButton.addEventListener('click', (function(_this) {
        return function(e) {
          return _this.shopDataDetailWindow.close({
            animated: true
          });
        };
      })(this));
      this.shopDataDetailWindow.leftNavButton = backButton;
      shopDataDetailWindowTitle = Ti.UI.createLabel({
        textAlign: 'center',
        color: '#333',
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        text: "お店の詳細情報"
      });
      if (Ti.Platform.osname === 'iphone') {
        this.shopDataDetailWindow.setTitleControl(shopDataDetailWindowTitle);
      }
    };

    shopDataDetailWindow.prototype._createMapView = function(data) {
      var annotation;
      annotation = Titanium.Map.createAnnotation({
        pincolor: Titanium.Map.ANNOTATION_PURPLE,
        animate: false,
        latitude: data.latitude,
        longitude: data.longitude
      });
      this.mapView.addAnnotation(annotation);
      return this.shopDataDetailWindow.add(this.mapView);
    };

    shopDataDetailWindow.prototype._createTableView = function(data) {
      var addressRow, favoriteDialog, feedBackDialog, feedbackIcon, feedbackLabel, feedbackRow, love, loveEmpty, phoneDialog, phoneRow, shopData, shopInfoIcon, shopInfoLabel, shopInfoRow, wantToGoIcon, wantToGoIconLabel, wantToGoRow;
      shopData = [];
      addressRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 40,
        selectedColor: 'transparent'
      });
      this.addressLabel = Ti.UI.createLabel({
        text: "" + data.shopAddress,
        textAlign: 'left',
        width: 280,
        color: this.baseColor.textColor,
        left: 20,
        top: 10,
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        }
      });
      phoneRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 40,
        selectedColor: 'transparent',
        rowID: 1,
        phoneNumber: data.phoneNumber
      });
      this.phoneIcon = Ti.UI.createButton({
        top: 5,
        left: 10,
        width: 30,
        height: 30,
        backgroundColor: this.baseColor.phoneColor,
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 0,
        color: this.baseColor.barColor,
        font: {
          fontSize: 24,
          fontFamily: 'FontAwesome'
        },
        title: String.fromCharCode("0xf095")
      });
      this.phoneLabel = Ti.UI.createLabel({
        text: "電話する",
        textAlign: 'left',
        left: 50,
        top: 10,
        width: 150,
        color: this.baseColor.textColor,
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        }
      });
      wantToGoRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 40,
        selectedColor: 'transparent',
        rowID: 2,
        shopName: "" + data.shopName
      });
      loveEmpty = String.fromCharCode("0xe06f");
      love = String.fromCharCode("0xe06e");
      wantToGoIcon = Ti.UI.createLabel({
        top: 5,
        left: 10,
        width: 30,
        height: 30,
        backgroundColor: "#FFEE55",
        backgroundImage: "NONE",
        color: this.baseColor.barColor,
        font: {
          fontSize: 28,
          fontFamily: 'LigatureSymbols'
        },
        text: love,
        textAlign: 'center'
      });
      wantToGoIconLabel = Ti.UI.createLabel({
        color: this.baseColor.textColor,
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p'
        },
        text: "行きたい",
        textAlign: 'left',
        top: 5,
        left: 50,
        width: 200,
        height: 30
      });
      feedbackLabel = Ti.UI.createLabel({
        text: "お店情報の間違いを報告する",
        textAlign: 'left',
        left: 50,
        top: 10,
        width: 240,
        color: this.baseColor.textColor,
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        }
      });
      feedbackRow = Ti.UI.createTableViewRow({
        width: 'auto',
        height: 40,
        selectedColor: 'transparent',
        rowID: 3,
        shopName: "" + data.shopName
      });
      feedbackIcon = Ti.UI.createButton({
        top: 5,
        left: 10,
        width: 30,
        height: 30,
        backgroundColor: this.baseColor.feedbackColor,
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 0,
        color: this.baseColor.barColor,
        font: {
          fontSize: 24,
          fontFamily: 'LigatureSymbols'
        },
        title: String.fromCharCode("0xe08a")
      });
      phoneDialog = this._createPhoneDialog(data.phoneNumber, data.shopName);
      favoriteDialog = this._createFavoriteDialog(data.shopName);
      feedBackDialog = this._createFeedBackDialog(data.shopName);
      this.shopDataDetailWindow.add(phoneDialog);
      this.shopDataDetailWindow.add(favoriteDialog);
      this.shopDataDetailWindow.add(feedBackDialog);
      this.tableView = Ti.UI.createTableView({
        width: 'auto',
        height: 'auto',
        top: 200,
        left: 0,
        data: shopData,
        backgroundColor: this.baseColor.backgroundColor,
        separatorColor: this.baseColor.separatorColor,
        borderRadius: 5
      });
      this.tableView.addEventListener('click', (function(_this) {
        return function(e) {
          if (e.row.rowID === 1) {
            _this._setTiGFviewToMapView();
            return _this._showDialog(phoneDialog);
          } else if (e.row.rowID === 2) {
            _this._setTiGFviewToMapView();
            return _this._showDialog(favoriteDialog);
          } else if (e.row.rowID === 3) {
            _this._setTiGFviewToMapView();
            return _this._showDialog(feedBackDialog);
          } else {
            return Ti.API.info("no action");
          }
        };
      })(this));
      if (typeof data.shopInfo !== "undefined") {
        shopInfoRow = Ti.UI.createTableViewRow({
          width: 'auto',
          height: 'auto',
          selectedColor: 'transparent'
        });
        shopInfoIcon = Ti.UI.createLabel({
          top: 10,
          left: 10,
          width: 30,
          height: 30,
          color: "#ccc",
          font: {
            fontSize: 24,
            fontFamily: 'LigatureSymbols'
          },
          text: String.fromCharCode("0xe075"),
          textAlign: 'center'
        });
        shopInfoLabel = Ti.UI.createLabel({
          text: "" + data.shopInfo,
          textAlign: 'left',
          width: 250,
          height: 'auto',
          color: this.baseColor.textColor,
          left: 50,
          top: 10,
          font: {
            fontSize: 14,
            fontFamily: 'Rounded M+ 1p'
          }
        });
        shopInfoRow.add(shopInfoLabel);
        shopInfoRow.add(shopInfoIcon);
      }
      if (data.favoriteButtonEnable === true) {
        addressRow.add(this.addressLabel);
        phoneRow.add(this.phoneIcon);
        phoneRow.add(this.phoneLabel);
        wantToGoRow.add(wantToGoIconLabel);
        wantToGoRow.add(wantToGoIcon);
        feedbackRow.add(feedbackLabel);
        feedbackRow.add(feedbackIcon);
        shopData.push(this.section);
        shopData.push(addressRow);
        shopData.push(phoneRow);
        shopData.push(wantToGoRow);
        shopData.push(feedbackRow);
        if (typeof shopInfoRow !== 'undefined') {
          shopData.push(shopInfoRow);
        }
      } else {
        addressRow.add(this.addressLabel);
        phoneRow.add(this.phoneIcon);
        phoneRow.add(this.phoneLabel);
        feedbackRow.add(feedbackLabel);
        feedbackRow.add(feedbackIcon);
        shopData.push(this.section);
        shopData.push(addressRow);
        shopData.push(phoneRow);
        shopData.push(feedbackRow);
        if (typeof shopInfoRow !== 'undefined') {
          shopData.push(shopInfoRow);
        }
      }
      this.tableView.setData(shopData);
      return this.shopDataDetailWindow.add(this.tableView);
    };

    shopDataDetailWindow.prototype._createFavoriteDialog = function(shopName) {
      var cancelleBtn, contents, favoriteDialog, registMemoBtn, selectedColor, selectedValue, t, textArea, titleForMemo, unselectedColor;
      t = Titanium.UI.create2DMatrix().scale(0.0);
      unselectedColor = "#666";
      selectedColor = "#222";
      selectedValue = false;
      favoriteDialog = Ti.UI.createView({
        width: 300,
        height: 280,
        top: 0,
        left: 10,
        borderRadius: 10,
        opacity: 0.8,
        backgroundColor: "#333",
        zIndex: 20,
        transform: t
      });
      titleForMemo = Ti.UI.createLabel({
        text: "メモ欄",
        width: 300,
        height: 40,
        color: this.baseColor.barColor,
        left: 10,
        top: 5,
        font: {
          fontSize: 14,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        }
      });
      contents = "";
      textArea = Titanium.UI.createTextArea({
        value: '',
        height: 150,
        width: 280,
        top: 50,
        left: 10,
        font: {
          fontSize: 12,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        color: this.baseColor.textColor,
        textAlign: 'left',
        borderWidth: 2,
        borderColor: "#dfdfdf",
        borderRadius: 5,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT
      });
      textArea.addEventListener('return', function(e) {
        contents = e.value;
        Ti.API.info("登録しようとしてるメモの内容は is " + contents + "です");
        return textArea.blur();
      });
      textArea.addEventListener('blur', function(e) {
        contents = e.value;
        return Ti.API.info("blur event fire.content is " + contents + "です");
      });
      registMemoBtn = Ti.UI.createLabel({
        bottom: 30,
        right: 20,
        width: 120,
        height: 40,
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 5,
        color: this.baseColor.barColor,
        backgroundColor: "#4cda64",
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p'
        },
        text: "登録する",
        textAlign: 'center'
      });
      registMemoBtn.addEventListener('click', (function(_this) {
        return function(e) {
          var MainController, currentUserId, mainController, ratings, that;
          that = _this;
          that._setDefaultMapViewStyle();
          that.activityIndicator.show();
          Ti.API.info("contents is " + contents);
          ratings = ratings;
          contents = contents;
          currentUserId = Ti.App.Properties.getString("currentUserId");
          MainController = require("controller/mainController");
          mainController = new MainController();
          return mainController.createReview(ratings, contents, shopName, currentUserId, function(result) {
            that.activityIndicator.hide();
            if (result.success) {
              alert("登録しました");
            } else {
              alert("すでに登録されているか\nサーバーがダウンしているために登録することができませんでした");
            }
            return that._hideDialog(favoriteDialog, Ti.API.info("done"));
          });
        };
      })(this));
      cancelleBtn = Ti.UI.createLabel({
        width: 120,
        height: 40,
        left: 20,
        bottom: 30,
        borderRadius: 5,
        backgroundColor: "#d8514b",
        color: this.baseColor.barColor,
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p'
        },
        text: '中止する',
        textAlign: "center"
      });
      cancelleBtn.addEventListener('click', (function(_this) {
        return function(e) {
          _this._setDefaultMapViewStyle();
          return _this._hideDialog(favoriteDialog, Ti.API.info("done"));
        };
      })(this));
      favoriteDialog.add(textArea);
      favoriteDialog.add(titleForMemo);
      favoriteDialog.add(registMemoBtn);
      favoriteDialog.add(cancelleBtn);
      return favoriteDialog;
    };

    shopDataDetailWindow.prototype._createPhoneDialog = function(phoneNumber, shopName) {
      var callBtn, cancelleBtn, confirmLabel, t, that, _view;
      that = this;
      t = Titanium.UI.create2DMatrix().scale(0.0);
      _view = Ti.UI.createView({
        width: 300,
        height: 240,
        top: 0,
        left: 10,
        borderRadius: 10,
        opacity: 0.8,
        backgroundColor: this.baseColor.textColor,
        zIndex: 20,
        transform: t
      });
      callBtn = Ti.UI.createLabel({
        width: 120,
        height: 40,
        right: 20,
        bottom: 40,
        borderRadius: 5,
        color: this.baseColor.barColor,
        backgroundColor: "#4cda64",
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p'
        },
        text: 'はい',
        textAlign: "center"
      });
      callBtn.addEventListener('click', function(e) {
        that._setDefaultMapViewStyle();
        return that._hideDialog(_view, Titanium.Platform.openURL("tel:" + phoneNumber));
      });
      cancelleBtn = Ti.UI.createLabel({
        width: 120,
        height: 40,
        left: 20,
        bottom: 40,
        borderRadius: 5,
        backgroundColor: "#d8514b",
        color: this.baseColor.barColor,
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p'
        },
        text: 'いいえ',
        textAlign: "center"
      });
      cancelleBtn.addEventListener('click', function(e) {
        that._setDefaultMapViewStyle();
        return that._hideDialog(_view, Ti.API.info("cancelleBtn hide"));
      });
      confirmLabel = Ti.UI.createLabel({
        top: 20,
        left: 10,
        textAlign: 'center',
        width: 300,
        height: 150,
        color: this.baseColor.barColor,
        font: {
          fontSize: 16,
          fontFamily: 'Rounded M+ 1p'
        },
        text: "" + shopName + "の電話番号は\n" + phoneNumber + "です。\n電話しますか？"
      });
      _view.add(confirmLabel);
      _view.add(cancelleBtn);
      _view.add(callBtn);
      return _view;
    };

    shopDataDetailWindow.prototype._createFeedBackDialog = function(shopName) {
      var cancelleBtn, contents, registMemoBtn, selectedColor, selectedValue, t, textArea, titleForMemo, unselectedColor, _view;
      Ti.API.info("createFeedBackDialog start shopName is " + shopName);
      t = Titanium.UI.create2DMatrix().scale(0.0);
      unselectedColor = "#666";
      selectedColor = "#222";
      selectedValue = false;
      _view = Ti.UI.createView({
        width: 300,
        height: 280,
        top: 0,
        left: 10,
        borderRadius: 10,
        opacity: 0.8,
        backgroundColor: "#333",
        zIndex: 20,
        transform: t
      });
      titleForMemo = Ti.UI.createLabel({
        text: "どの部分に誤りがあったのかご入力ください",
        width: 300,
        height: 40,
        color: this.baseColor.barColor,
        left: 10,
        top: 5,
        font: {
          fontSize: 14,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        }
      });
      contents = "";
      textArea = Titanium.UI.createTextArea({
        value: '',
        height: 150,
        width: 280,
        top: 50,
        left: 10,
        font: {
          fontSize: 12,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        color: this.baseColor.textColor,
        textAlign: 'left',
        borderWidth: 2,
        borderColor: "#dfdfdf",
        borderRadius: 5,
        keyboardType: Titanium.UI.KEYBOARD_DEFAULT
      });
      textArea.addEventListener('return', function(e) {
        contents = e.value;
        Ti.API.info("登録しようとしてる情報は is " + contents + "です");
        return textArea.blur();
      });
      textArea.addEventListener('blur', function(e) {
        contents = e.value;
        return Ti.API.info("blur event fire.content is " + contents + "です");
      });
      registMemoBtn = Ti.UI.createLabel({
        bottom: 30,
        right: 20,
        width: 120,
        height: 40,
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 5,
        color: this.baseColor.barColor,
        backgroundColor: "#4cda64",
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p'
        },
        text: "報告する",
        textAlign: 'center'
      });
      registMemoBtn.addEventListener('click', (function(_this) {
        return function(e) {
          var MainController, currentUserId, mainController, that;
          that = _this;
          that._setDefaultMapViewStyle();
          that.activityIndicator.show();
          contents = contents;
          currentUserId = Ti.App.Properties.getString("currentUserId");
          Ti.API.info("contents is " + contents + " and shopName is " + shopName);
          MainController = require("controller/mainController");
          mainController = new MainController();
          return mainController.sendFeedBack(contents, shopName, currentUserId, function(result) {
            that.activityIndicator.hide();
            if (result.success) {
              alert("報告完了しました");
            } else {
              alert("サーバーがダウンしているために登録することができませんでした");
            }
            return that._hideDialog(_view, Ti.API.info("done"));
          });
        };
      })(this));
      cancelleBtn = Ti.UI.createLabel({
        width: 120,
        height: 40,
        left: 20,
        bottom: 30,
        borderRadius: 5,
        backgroundColor: "#d8514b",
        color: this.baseColor.barColor,
        font: {
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p'
        },
        text: '中止する',
        textAlign: "center"
      });
      cancelleBtn.addEventListener('click', (function(_this) {
        return function(e) {
          _this._setDefaultMapViewStyle();
          return _this._hideDialog(_view, Ti.API.info("done"));
        };
      })(this));
      _view.add(textArea);
      _view.add(titleForMemo);
      _view.add(registMemoBtn);
      _view.add(cancelleBtn);
      return _view;
    };

    shopDataDetailWindow.prototype._setTiGFviewToMapView = function() {
      this.mapView.rasterizationScale = 0.1;
      this.mapView.shouldRasterize = true;
      this.mapView.kCAFilterTrilinear = true;
    };

    shopDataDetailWindow.prototype._setDefaultMapViewStyle = function() {
      this.mapView.rasterizationScale = 1.0;
      this.mapView.shouldRasterize = false;
      this.mapView.kCAFilterTrilinear = false;
    };

    shopDataDetailWindow.prototype._showDialog = function(_view) {
      var animation, t1;
      t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(1.0);
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 250;
      return _view.animate(animation);
    };

    shopDataDetailWindow.prototype._hideDialog = function(_view, callback) {
      var animation, t1;
      t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(0.0);
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 250;
      _view.animate(animation);
      return animation.addEventListener('complete', function(e) {
        return callback;
      });
    };

    return shopDataDetailWindow;

  })();

  module.exports = shopDataDetailWindow;

}).call(this);