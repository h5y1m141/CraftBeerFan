var shopDataDetailWindow;

shopDataDetailWindow = (function() {

  function shopDataDetailWindow(data) {
    var activeTab, filterView, keyColor;
    filterView = require("net.uchidak.tigfview");
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: "#f3f3f3",
      keyColor: "#DA5019",
      textColor: "#333",
      phoneColor: "#3261AB",
      starColor: "#DA5019",
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
    activeTab = Ti.API._activeTab;
    return activeTab.open(this.shopDataDetailWindow);
  }

  shopDataDetailWindow.prototype._createNavbarElement = function() {
    var backButton, shopDataDetailWindowTitle,
      _this = this;
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    backButton.addEventListener('click', function(e) {
      return _this.shopDataDetailWindow.close({
        animated: true
      });
    });
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
    var addressRow, phoneDialog, phoneRow, shopData, starIcon,
      _this = this;
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
    this.reviewRow = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 40,
      selectedColor: 'transparent',
      rowID: 2,
      shopName: "" + data.shopName
    });
    starIcon = Ti.UI.createButton({
      top: 5,
      textAlign: 'center',
      left: 10,
      width: 30,
      height: 30,
      backgroundColor: this.baseColor.starColor,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 0,
      color: this.baseColor.barColor,
      font: {
        fontSize: 28,
        fontFamily: 'LigatureSymbols'
      },
      title: String.fromCharCode("0xe041")
    });
    this.editLabel = Ti.UI.createLabel({
      top: 5,
      left: 50,
      width: 200,
      height: 30,
      color: this.baseColor.textColor,
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "お気に入り登録する",
      textAlign: 'left'
    });
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
    phoneDialog = this._createPhoneDialog(data.phoneNumber, data.shopName);
    this.shopDataDetailWindow.add(phoneDialog);
    if (data.favoriteButtonEnable === true) {
      this.tableView.addEventListener('click', function(e) {
        var animation, shopName, t1;
        if (e.row.rowID === 2) {
          shopName = e.row.shopName;
          return _this._createModalWindow(shopName);
        } else if (e.row.rowID === 1) {
          _this.mapView.rasterizationScale = 0.1;
          _this.mapView.shouldRasterize = true;
          _this.mapView.kCAFilterTrilinear = true;
          t1 = Titanium.UI.create2DMatrix();
          t1 = t1.scale(1.0);
          animation = Titanium.UI.createAnimation();
          animation.transform = t1;
          animation.duration = 250;
          return phoneDialog.animate(animation);
        }
      });
      addressRow.add(this.addressLabel);
      phoneRow.add(this.phoneIcon);
      phoneRow.add(this.phoneLabel);
      this.reviewRow.add(starIcon);
      this.reviewRow.add(this.editLabel);
      shopData.push(this.section);
      shopData.push(addressRow);
      shopData.push(phoneRow);
      shopData.push(this.reviewRow);
    } else {
      this.tableView.addEventListener('click', function(e) {
        var animation, t1;
        if (e.row.rowID === 1) {
          t1 = Titanium.UI.create2DMatrix();
          t1 = t1.scale(1.0);
          animation = Titanium.UI.createAnimation();
          animation.transform = t1;
          animation.duration = 500;
          return phoneDialog.animate(animation);
        }
      });
      addressRow.add(this.addressLabel);
      phoneRow.add(this.phoneIcon);
      phoneRow.add(this.phoneLabel);
      shopData.push(this.section);
      shopData.push(addressRow);
      shopData.push(phoneRow);
    }
    this.tableView.setData(shopData);
    return this.shopDataDetailWindow.add(this.tableView);
  };

  shopDataDetailWindow.prototype._createModalWindow = function(shopName) {
    var ActivityIndicator, activityIndicator, addNewIcon, closeButton, contents, label, modalWindow, textArea, _winTitle;
    modalWindow = Ti.UI.createWindow({
      backgroundColor: this.baseColor.backgroundColor,
      barColor: this.baseColor.barColor
    });
    closeButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    closeButton.addEventListener('click', function(e) {
      return modalWindow.close({
        animated: true
      });
    });
    ActivityIndicator = require("ui/activityIndicator");
    activityIndicator = new ActivityIndicator();
    modalWindow.leftNavButton = closeButton;
    modalWindow.add(activityIndicator);
    _winTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: this.baseColor.textColor,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "お気に入り登録:" + shopName
    });
    if (Ti.Platform.osname === 'iphone') {
      modalWindow.setTitleControl(_winTitle);
    }
    this._createStarIcon(modalWindow);
    label = Ti.UI.createLabel({
      text: "登録したくなった理由をメモに残しておきましょう!",
      width: 300,
      height: 40,
      color: this.baseColor.textColor,
      left: 10,
      top: 55,
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
      width: 300,
      top: 100,
      left: 5,
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
      Ti.API.info("e.value is " + e.value);
      return textArea.blur();
    });
    addNewIcon = Ti.UI.createButton({
      top: 270,
      left: 110,
      width: 100,
      height: 40,
      backgroundColor: this.baseColor.starColor,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 5,
      color: this.baseColor.barColor,
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      title: String.fromCharCode("0xe041")
    });
    modalWindow.add(addNewIcon);
    modalWindow.add(textArea);
    modalWindow.add(label);
    addNewIcon.addEventListener('click', function(e) {
      var MainController, currentUserId, mainController, ratings;
      activityIndicator.show();
      Ti.API.info("contents is " + contents);
      ratings = ratings;
      contents = contents;
      currentUserId = Ti.App.Properties.getString("currentUserId");
      MainController = require("controller/mainController");
      mainController = new MainController();
      return mainController.createReview(ratings, contents, shopName, currentUserId, function(result) {
        activityIndicator.hide();
        if (result.success) {
          alert("お気に入りに登録しました");
        } else {
          alert("すでにお気に入りに登録されているか\nサーバーがダウンしているために登録することができませんでした");
        }
        return modalWindow.close();
      });
    });
    return modalWindow.open({
      modal: true,
      modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
      modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    });
  };

  shopDataDetailWindow.prototype._createStarIcon = function(modalWindow) {
    var disableColor, enableColor, i, leftPostion, ratings, starIcon, _i;
    enableColor = "#FFE600";
    disableColor = "#FFFBD5";
    ratings = 0;
    leftPostion = [5, 45, 85, 125, 165];
    for (i = _i = 0; _i <= 4; i = ++_i) {
      starIcon = Ti.UI.createButton({
        top: 5,
        left: leftPostion[i],
        width: 30,
        height: 30,
        selected: false,
        backgroundColor: disableColor,
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 5,
        color: this.baseColor.barColor,
        font: {
          fontSize: 24,
          fontFamily: 'LigatureSymbols'
        },
        title: String.fromCharCode("0xe121")
      });
      starIcon.addEventListener('click', function(e) {
        if (e.source.selected === false) {
          e.source.backgroundColor = enableColor;
          e.source.selected = true;
          return ratings++;
        } else {
          e.source.backgroundColor = disableColor;
          e.source.selected = false;
          return ratings--;
        }
      });
      modalWindow.add(starIcon);
    }
  };

  shopDataDetailWindow.prototype._createPhoneDialog = function(phoneNumber, shopName) {
    var callBtn, cancelleBtn, confirmLabel, phoneDialog, t,
      _this = this;
    t = Titanium.UI.create2DMatrix().scale(0.0);
    phoneDialog = Ti.UI.createView({
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
      left: 20,
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
      var animation, t1;
      _this.mapView.rasterizationScale = 1.0;
      _this.mapView.shouldRasterize = false;
      _this.mapView.kCAFilterTrilinear = false;
      t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(0.0);
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 10;
      phoneDialog.animate(animation);
      return Titanium.Platform.openURL("tel:" + phoneNumber);
    });
    cancelleBtn = Ti.UI.createLabel({
      width: 120,
      height: 40,
      right: 20,
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
      var animation, t1;
      _this.mapView.rasterizationScale = 1.0;
      _this.mapView.shouldRasterize = false;
      _this.mapView.kCAFilterTrilinear = false;
      t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(0.0);
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 250;
      return phoneDialog.animate(animation);
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
    phoneDialog.add(confirmLabel);
    phoneDialog.add(cancelleBtn);
    phoneDialog.add(callBtn);
    return phoneDialog;
  };

  return shopDataDetailWindow;

})();

module.exports = shopDataDetailWindow;
