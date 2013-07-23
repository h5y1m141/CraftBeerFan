var favoriteWindow;

favoriteWindow = (function() {

  function favoriteWindow() {
    var ActivityIndicator, KloudService, ShopDataDetail, activeTab, activityIndicator, keyColor, kloudService, shopDataDetail, shopDetailTable, userID,
      _this = this;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: keyColor
    };
    this.favoriteWindow = Ti.UI.createWindow({
      title: "お気に入り",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: false,
      navBarHidden: false
    });
    ActivityIndicator = require("ui/activityIndicator");
    activityIndicator = new ActivityIndicator();
    this.favoriteWindow.add(activityIndicator);
    activityIndicator.show();
    this._createNavbarElement();
    this.table = Ti.UI.createTableView({
      backgroundColor: this.baseColor.backgroundColor,
      selectedBackgroundColor: this.baseColor.backgroundColor,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      width: 'auto',
      height: 'auto',
      top: 0,
      left: 0
    });
    KloudService = require("model/kloudService");
    kloudService = new KloudService();
    userID = Ti.App.Properties.getString("currentUserId");
    kloudService.reviewsQuery(userID, function(items) {
      var item, row, rows, _i, _len;
      activityIndicator.hide();
      rows = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        row = _this._createShopDataRow(item);
        rows.push(row);
      }
      return _this.table.setData(rows);
    });
    ShopDataDetail = require("ui/shopDataDetail");
    shopDataDetail = new ShopDataDetail();
    shopDetailTable = shopDataDetail.getTable();
    this.table.addEventListener('click', function(e) {
      var ShopDataDetailWindow, data, shopDataDetailWindow;
      if (e.row.className === "shopName") {
        data = e.row.data;
        ShopDataDetailWindow = require("ui/shopDataDetailWindow");
        return shopDataDetailWindow = new ShopDataDetailWindow(data);
      }
    });
    this.favoriteWindow.add(this.table);
    activeTab = Ti.API._activeTab;
    return activeTab.open(this.favoriteWindow);
  }

  favoriteWindow.prototype._createNavbarElement = function() {
    var backButton, favoriteWindowTitle,
      _this = this;
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    backButton.addEventListener('click', function(e) {
      return _this.favoriteWindow.close({
        animated: true
      });
    });
    this.favoriteWindow.leftNavButton = backButton;
    favoriteWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "お気に入り"
    });
    if (Ti.Platform.osname === 'iphone') {
      this.favoriteWindow.setTitleControl(favoriteWindowTitle);
    }
  };

  favoriteWindow.prototype._createShopDataRow = function(placeData) {
    var commentView, content, i, leftPostion, memoBtn, moveNextWindowBtn, row, starIcon, titleLabel, _i, _ref,
      _this = this;
    row = Ti.UI.createTableViewRow({
      width: 'auto',
      height: 60,
      borderWidth: 0,
      placeData: placeData,
      className: 'shopData',
      backgroundColor: this.baseColor.barColor,
      selectedBackgroundColor: this.baseColor.backgroundColor
    });
    titleLabel = Ti.UI.createLabel({
      width: 200,
      height: 20,
      top: 10,
      left: 50,
      color: '#333',
      font: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Rounded M+ 1p'
      },
      text: "" + placeData.shopName
    });
    row.add(titleLabel);
    moveNextWindowBtn = Ti.UI.createButton({
      top: 10,
      right: 5,
      width: 40,
      height: 40,
      content: placeData,
      selected: false,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 20,
      color: '#bbb',
      font: {
        fontSize: 24,
        fontFamily: 'LigatureSymbols'
      },
      title: String.fromCharCode("0xe112")
    });
    moveNextWindowBtn.addEventListener('click', function(e) {
      var ShopDataDetailWindow, data;
      data = {
        shopName: row.placeData.name,
        shopAddress: row.placeData.address,
        phoneNumber: row.placeData.phone_number,
        latitude: row.placeData.latitude,
        longitude: row.placeData.longitude
      };
      ShopDataDetailWindow = require("ui/shopDataDetailWindow");
      return new ShopDataDetailWindow(data);
    });
    row.add(moveNextWindowBtn);
    leftPostion = [50, 75, 100, 125, 150];
    for (i = _i = 0, _ref = placeData.rating; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      starIcon = Ti.UI.createButton({
        top: 30,
        left: leftPostion[i],
        width: 20,
        height: 20,
        selected: false,
        backgroundColor: this.baseColor.barColor,
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 5,
        color: "#FFEE55",
        font: {
          fontSize: 20,
          fontFamily: 'LigatureSymbols'
        },
        title: String.fromCharCode("0xe121")
      });
      row.add(starIcon);
    }
    if (typeof placeData.content === "undefined" || placeData.content === null) {
      content = "";
    } else {
      commentView = this._createCommentView(placeData);
      this.favoriteWindow.add(commentView);
      memoBtn = Ti.UI.createButton({
        top: 5,
        left: 5,
        width: 40,
        height: 40,
        content: placeData,
        selected: false,
        backgroundImage: "NONE",
        borderWidth: 0,
        borderRadius: 0,
        color: '#ccc',
        backgroundColor: this.baseColor.barColor,
        font: {
          fontSize: 28,
          fontFamily: 'LigatureSymbols'
        },
        title: String.fromCharCode("0xe097")
      });
      memoBtn.addEventListener('click', function(e) {
        var animation, animationForTableView, t, t1;
        _this.table.opacity = 0.5;
        _this.table.touchEnabled = false;
        t = Titanium.UI.create2DMatrix().scale(0.6);
        animationForTableView = Titanium.UI.createAnimation();
        animationForTableView.transform = t;
        animationForTableView.duration = 250;
        _this.table.animate(animationForTableView);
        t1 = Titanium.UI.create2DMatrix();
        t1 = t1.scale(1.0);
        animation = Titanium.UI.createAnimation();
        animation.transform = t1;
        animation.duration = 250;
        return commentView.animate(animation);
      });
      row.add(memoBtn);
    }
    return row;
  };

  favoriteWindow.prototype._createCommentView = function(placeData) {
    var closeBtn, commentLabel, commentView, content, t,
      _this = this;
    content = placeData.content;
    t = Titanium.UI.create2DMatrix().scale(0.0);
    commentView = Titanium.UI.createScrollView({
      width: 240,
      height: 240,
      top: 20,
      left: 40,
      zIndex: 10,
      contentWidth: 'auto',
      contentHeight: 'auto',
      showVerticalScrollIndicator: true,
      showHorizontalScrollIndicator: true,
      transform: t,
      backgroundColor: this.baseColor.barColor,
      borderRadius: 10,
      borderColor: "#ccc"
    });
    closeBtn = Ti.UI.createButton({
      top: 5,
      right: 5,
      width: 40,
      height: 40,
      content: placeData,
      selected: false,
      backgroundColor: this.baseColor.barColor,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 5,
      color: '#ccc',
      font: {
        fontSize: 32,
        fontFamily: 'LigatureSymbols'
      },
      title: String.fromCharCode("0xe10f")
    });
    closeBtn.addEventListener('click', function(e) {
      var animation, animationForTableView, t2;
      _this.table.opacity = 1.0;
      _this.table.touchEnabled = true;
      t = Titanium.UI.create2DMatrix().scale(1.0);
      animationForTableView = Titanium.UI.createAnimation();
      animationForTableView.transform = t;
      animationForTableView.duration = 250;
      _this.table.animate(animationForTableView);
      t2 = Titanium.UI.create2DMatrix();
      t2 = t2.scale(0.0);
      animation = Titanium.UI.createAnimation();
      animation.transform = t2;
      animation.duration = 250;
      return commentView.animate(animation);
    });
    commentLabel = Ti.UI.createLabel({
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: content,
      width: 'auto',
      top: 50,
      left: 5
    });
    commentView.add(commentLabel);
    commentView.add(closeBtn);
    return commentView;
  };

  return favoriteWindow;

})();

module.exports = favoriteWindow;
