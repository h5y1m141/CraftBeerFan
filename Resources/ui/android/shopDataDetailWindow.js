var shopDataDetailWindow;

shopDataDetailWindow = (function() {

  function shopDataDetailWindow(data) {
    var ActivityIndicator, annotation, detailMap, iconImage, keyColor;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: "#f3f3f3",
      keyColor: "#DA5019",
      textColor: "#333",
      phoneColor: "#3261AB",
      favoriteColor: "#DA5019",
      starColor: "#DA5019",
      separatorColor: '#cccccc'
    };
    this.shopDataDetailWindow = Ti.UI.createWindow({
      title: "" + data.shopName,
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false
    });
    detailMap = Titanium.Map.createView({
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
      height: '400dip',
      width: Ti.UI.FULL
    });
    if (data.shopFlg === "true") {
      iconImage = Titanium.Filesystem.resourcesDirectory + "ui/image/bottle@2x.png";
    } else {
      iconImage = Titanium.Filesystem.resourcesDirectory + "ui/image/tumblrIconForMap.png";
    }
    annotation = Titanium.Map.createAnnotation({
      image: iconImage,
      animate: false,
      latitude: data.latitude,
      longitude: data.longitude
    });
    detailMap.addAnnotation(annotation);
    this.shopDataDetailWindow.add(detailMap);
    this._createTableView(data);
    ActivityIndicator = require("ui/activityIndicator");
    this.activityIndicator = new ActivityIndicator();
    this.shopDataDetailWindow.add(this.activityIndicator);
    return this.shopDataDetailWindow;
  }

  shopDataDetailWindow.prototype._createTableView = function(data) {
    var addressRow, favoriteDialog, love, loveEmpty, phoneDialog, phoneRow, shopData, shopInfoIcon, shopInfoLabel, shopInfoRow, wantToGoIcon, wantToGoIconLabel, wantToGoRow,
      _this = this;
    shopData = [];
    addressRow = Ti.UI.createTableViewRow({
      width: Ti.UI.FULL,
      height: '60dip',
      selectedColor: 'transparent'
    });
    this.addressLabel = Ti.UI.createLabel({
      text: "" + data.shopAddress,
      textAlign: 'left',
      width: '280dip',
      color: this.baseColor.textColor,
      left: 20,
      top: 10,
      font: {
        fontSize: '18dip',
        fontWeight: 'bold'
      }
    });
    phoneRow = Ti.UI.createTableViewRow({
      width: Ti.UI.FULL,
      height: '40dip',
      selectedColor: 'transparent',
      rowID: 1,
      phoneNumber: data.phoneNumber
    });
    this.phoneIcon = Ti.UI.createButton({
      top: 5,
      left: 10,
      width: '40dip',
      height: '40dip',
      backgroundColor: this.baseColor.phoneColor,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 0,
      color: this.baseColor.barColor,
      font: {
        fontSize: '36dip',
        fontFamily: 'fontawesome-webfont'
      },
      title: String.fromCharCode("0xf095")
    });
    this.phoneLabel = Ti.UI.createLabel({
      text: "電話する",
      textAlign: 'left',
      left: 100,
      top: 10,
      width: '150dip',
      color: this.baseColor.textColor,
      font: {
        fontSize: '18dip',
        fontWeight: 'bold'
      }
    });
    wantToGoRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: '40dip',
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
        fontSize: 18
      },
      text: "行きたい",
      textAlign: 'left',
      top: 5,
      left: 50,
      width: 200,
      height: 30
    });
    phoneDialog = this._createPhoneDialog(data.phoneNumber, data.shopName);
    favoriteDialog = this._createFavoriteDialog(data.shopName);
    this.shopDataDetailWindow.add(phoneDialog);
    this.shopDataDetailWindow.add(favoriteDialog);
    this.tableView = Ti.UI.createTableView({
      width: Ti.UI.FULL,
      top: 400,
      left: 0,
      data: shopData,
      backgroundColor: this.baseColor.backgroundColor,
      separatorColor: this.baseColor.separatorColor,
      borderRadius: 5
    });
    this.tableView.addEventListener('click', function(e) {
      if (e.row.rowID === 1) {
        return _this._showDialog(phoneDialog);
      } else if (e.row.rowID === 2) {
        return _this._showDialog(favoriteDialog);
      } else {
        return Ti.API.info("no action");
      }
    });
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
          fontSize: 14
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
      shopData.push(this.section);
      shopData.push(addressRow);
      shopData.push(phoneRow);
      shopData.push(wantToGoRow);
      if (typeof shopInfoRow !== 'undefined') {
        shopData.push(shopInfoRow);
      }
    } else {
      addressRow.add(this.addressLabel);
      phoneRow.add(this.phoneIcon);
      phoneRow.add(this.phoneLabel);
      shopData.push(this.section);
      shopData.push(addressRow);
      shopData.push(phoneRow);
      if (typeof shopInfoRow !== 'undefined') {
        shopData.push(shopInfoRow);
      }
    }
    this.tableView.setData(shopData);
    return this.shopDataDetailWindow.add(this.tableView);
  };

  shopDataDetailWindow.prototype._createFavoriteDialog = function(shopName) {
    var cancelleBtn, contents, favoriteDialog, registMemoBtn, selectedColor, selectedValue, t, textArea, titleForMemo, unselectedColor,
      _this = this;
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
        fontSize: '14dip',
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
        fontSize: '12dip'
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
        fontSize: '18dip'
      },
      text: "登録する",
      textAlign: 'center'
    });
    registMemoBtn.addEventListener('click', function(e) {
      var MainController, currentUserId, mainController, ratings, that;
      that = _this;
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
    });
    cancelleBtn = Ti.UI.createLabel({
      width: 120,
      height: 40,
      left: 20,
      bottom: 30,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: this.baseColor.barColor,
      font: {
        fontSize: '18dip'
      },
      text: '中止する',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      return _this._hideDialog(favoriteDialog, Ti.API.info("done"));
    });
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
      width: Ti.UI.FULL,
      height: '240dip',
      top: 0,
      left: 10,
      borderRadius: 10,
      opacity: 0.8,
      backgroundColor: this.baseColor.textColor,
      zIndex: 20,
      transform: t
    });
    callBtn = Ti.UI.createLabel({
      width: '120dip',
      height: '40dip',
      right: 20,
      bottom: 40,
      borderRadius: 5,
      color: this.baseColor.barColor,
      backgroundColor: "#4cda64",
      font: {
        fontSize: '18dip'
      },
      text: 'はい',
      textAlign: "center"
    });
    callBtn.addEventListener('click', function(e) {
      return that._hideDialog(_view, Titanium.Platform.openURL("tel:" + phoneNumber));
    });
    cancelleBtn = Ti.UI.createLabel({
      width: '120dip',
      height: '40dip',
      left: 20,
      bottom: 40,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: this.baseColor.barColor,
      font: {
        fontSize: '18dip'
      },
      text: 'いいえ',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      return that._hideDialog(_view, Ti.API.info("cancelleBtn hide"));
    });
    confirmLabel = Ti.UI.createLabel({
      top: 20,
      left: 10,
      textAlign: 'center',
      width: '300dip',
      height: '150dip',
      color: this.baseColor.barColor,
      font: {
        fontSize: '16dip'
      },
      text: "" + shopName + "の電話番号は\n" + phoneNumber + "です。\n電話しますか？"
    });
    _view.add(confirmLabel);
    _view.add(cancelleBtn);
    _view.add(callBtn);
    return _view;
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
