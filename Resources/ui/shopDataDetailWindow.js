var shopDataDetailWindow;

shopDataDetailWindow = (function() {

  function shopDataDetailWindow(data) {
    var activeTab, addressRow, keyColor, phoneRow, shopData, starIcon,
      _this = this;
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
    this.shopDataDetailWindow = Ti.UI.createWindow({
      title: "近くのお店",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    this._createNavbarElement();
    this._createMapView(data);
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
    if (data.favoriteButtonEnable === true) {
      this.tableView.addEventListener('click', function(e) {
        var phoneDialog, shopName;
        if (e.row.rowID === 2) {
          shopName = e.row.shopName;
          return _this._createModalWindow(shopName);
        } else if (e.row.rowID === 1) {
          return phoneDialog = _this._createPhoneDialog(e.row.phoneNumber);
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
        if (e.row.rowID === 1) {
          return Titanium.Platform.openURL("tel:" + data.phoneNumber);
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
    this.shopDataDetailWindow.add(this.tableView);
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
    var annotation, mapView;
    mapView = Titanium.Map.createView({
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
    annotation = Titanium.Map.createAnnotation({
      pincolor: Titanium.Map.ANNOTATION_PURPLE,
      animate: false,
      latitude: data.latitude,
      longitude: data.longitude
    });
    mapView.addAnnotation(annotation);
    return this.shopDataDetailWindow.add(mapView);
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

  shopDataDetailWindow.prototype._createPhoneDialog = function(phoneNumber) {
    var confirmLabel, phoneDialog, t;
    phoneDialog = Ti.UI.createView({
      width: 240,
      height: 240,
      top: 100,
      left: 30,
      backgroundColor: this.baseColor.barColor,
      zIndex: 0
    }, t = Titanium.UI.create2DMatrix().scale(0.0));
    confirmLabel = Ti.UI.createLabel({
      top: 5,
      left: 5,
      textAlign: 'left',
      width: 220,
      height: 20,
      color: this.baseColor.textColor,
      font: {
        fontSize: 14,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "" + phoneNumber + "に電話しますか？"
    });
    phoneDialog.add(confirmLabel);
    return phoneDialog;
  };

  return shopDataDetailWindow;

})();

module.exports = shopDataDetailWindow;
