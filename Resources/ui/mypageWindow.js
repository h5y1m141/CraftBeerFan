var mypageWindow;

mypageWindow = (function() {

  function mypageWindow() {
    var ShopDataDetail, fb, mypageWindowTitle, shopDataDetail, shopDetailTable, that,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      backgroundDarkColor: "#dfdfdf",
      keyColor: "#EDAD0B"
    };
    mypageWindow = Ti.UI.createWindow({
      title: "マイページ",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: false,
      navBarHidden: true
    });
    this.table = Ti.UI.createTableView({
      backgroundColor: this.baseColor.backgroundColor,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      width: 'auto',
      height: 'auto',
      top: 0,
      left: 0
    });
    ShopDataDetail = require("ui/shopDataDetail");
    shopDataDetail = new ShopDataDetail();
    shopDetailTable = shopDataDetail.getTable();
    this.table.addEventListener('click', function(e) {
      var activeTab, backButton, data, _annotation, _mapView, _win, _winTitle;
      if (e.row.className === "shopName") {
        data = e.row.data;
        _win = Ti.UI.createWindow({
          barColor: _this.baseColor.barColor,
          backgroundColor: _this.baseColor.barColor
        });
        backButton = Titanium.UI.createButton({
          backgroundImage: "ui/image/backButton.png",
          width: 44,
          height: 44
        });
        backButton.addEventListener('click', function(e) {
          return _win.close({
            animated: true
          });
        });
        _win.leftNavButton = backButton;
        _winTitle = Ti.UI.createLabel({
          textAlign: 'center',
          color: '#333',
          font: {
            fontSize: '18sp',
            fontFamily: 'Rounded M+ 1p',
            fontWeight: 'bold'
          },
          text: "お店の詳細情報"
        });
        if (Ti.Platform.osname === 'iphone') {
          _win.setTitleControl(_winTitle);
        }
        _annotation = Titanium.Map.createAnnotation({
          latitude: data.latitude,
          longitude: data.longitude,
          pincolor: Titanium.Map.ANNOTATION_PURPLE,
          animate: true
        });
        _mapView = Titanium.Map.createView({
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
        _mapView.addAnnotation(_annotation);
        _win.add(_mapView);
        _win.add(shopDetailTable);
        shopDataDetail.setData(data);
        shopDataDetail.show();
        activeTab = Ti.API._activeTab;
        return activeTab.open(_win);
      }
    });
    fb = require('facebook');
    fb.appid = this._getAppID();
    fb.permissions = ['read_stream'];
    fb.forceDialogAuth = true;
    that = this;
    this.fbLoginButton = fb.createLoginButton({
      top: 5,
      left: 5,
      width: 100,
      style: fb.BUTTON_STYLE_NORMAL
    });
    fb.addEventListener('login', function(e) {
      var token, _Cloud;
      token = fb.accessToken;
      _Cloud = require('ti.cloud');
      if (e.success) {
        if (e.success) {
          return _Cloud.SocialIntegrations.externalAccountLogin({
            type: "facebook",
            token: token
          }, function(e) {
            var rows, user;
            if (e.success) {
              user = e.users[0];
              rows = [];
              Ti.API.info("User  = " + JSON.stringify(user));
              Ti.App.Properties.setString("currentUserId", user.id);
              rows.push(that._userSection(user));
              return that.table.setData(rows);
            } else {
              return alert("Error: " + ((e.error && e.message) || JSON.stringify(e)));
            }
          });
        }
      } else if (e.error) {
        return alert(e.error);
      } else {
        if (e.cancelled) {
          return alert("Canceled");
        }
      }
    });
    fb.addEventListener('logout', function(e) {
      return alert('logout');
    });
    if (!fb.loggedIn) {
      fb.authorize();
    }
    mypageWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: '18sp',
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "マイページ"
    });
    mypageWindow.add(this.table);
    if (Ti.Platform.osname === 'iphone') {
      mypageWindow.setTitleControl(mypageWindowTitle);
    }
    return mypageWindow;
  }

  mypageWindow.prototype._getAppID = function() {
    var appid, config, file, json;
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json");
    file = config.read().toString();
    json = JSON.parse(file);
    appid = json.facebook.appid;
    return appid;
  };

  mypageWindow.prototype._userSection = function(user) {
    var menuHeaderTitle, menuHeaderView, menuSection, nameLabel, nameRow;
    menuHeaderView = Ti.UI.createView({
      backgroundColor: this.baseColor.backgroundColor,
      height: 30
    });
    menuHeaderTitle = Ti.UI.createLabel({
      top: 0,
      left: 5,
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: 'アカウント情報'
    });
    menuHeaderView.add(menuHeaderTitle);
    menuSection = Ti.UI.createTableViewSection({
      headerView: menuHeaderView
    });
    nameRow = Ti.UI.createTableViewRow({
      backgroundColor: this.baseColor.backgroundColor,
      height: 40,
      className: "facebook"
    });
    nameLabel = Ti.UI.createLabel({
      text: "" + user.first_name + "　" + user.last_name,
      width: 200,
      color: "#333",
      left: 120,
      top: 5,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    nameRow.add(nameLabel);
    nameRow.add(this.fbLoginButton);
    menuSection.add(nameRow);
    return menuSection;
  };

  return mypageWindow;

})();

module.exports = mypageWindow;
