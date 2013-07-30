var startupWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

startupWindow = (function() {

  function startupWindow() {
    this._createView = __bind(this._createView, this);

    var keyColor, win, winTitle;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      color: "#333",
      backgroundColor: keyColor
    };
    winTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: "#333",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "CraftBeerFan"
    });
    this.scrollView = Titanium.UI.createScrollableView({
      height: 460,
      showPagingControl: true,
      pagingControlHeight: 30
    });
    this._createView();
    win = Ti.UI.createWindow({
      title: "CraftBeerFan",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    if (Ti.Platform.osname === 'iphone') {
      win.setTitleControl(winTitle);
    }
    win.add(this.scrollView);
    return win;
  }

  startupWindow.prototype._createView = function() {
    var LoginForm, label, loginForm, menu, menuList, screenCapture, view, _i, _len;
    menuList = [
      {
        description: "このアプリケーションは日本全国のクラフトビールが飲める/買えるお店を探すことが出来ます",
        screenCapture: "ui/image/logo.png"
      }, {
        description: "現在の位置から近い所のお店を探すことができます。",
        screenCapture: "ui/image/map.png"
      }, {
        description: "飲めるお店はタンブラーのアイコン、買えるお店はボトルのアイコンで表現してます",
        screenCapture: "ui/image/iconImage.png"
      }, {
        description: "リストからもお店を探すことができますので、これから出張や旅行先などでクラフトビールが飲める・買えるお店の下調べにも活用することができます",
        screenCapture: "ui/image/list.png"
      }, {
        description: "気になったお店があったら、お気に入りに登録することもできます",
        screenCapture: "ui/image/favorite.png"
      }, {
        description: "アカウントを登録してアプリケーションを起動してください。\nEnjoy!",
        screenCapture: null
      }
    ];
    for (_i = 0, _len = menuList.length; _i < _len; _i++) {
      menu = menuList[_i];
      view = Ti.UI.createView({
        width: 300,
        height: 400,
        backgroundColor: this.baseColor.backgroundColor,
        top: 20,
        left: 10,
        zIndex: 1,
        borderRadius: 10
      });
      label = Ti.UI.createLabel({
        textAlign: 'left',
        color: this.baseColor.color,
        width: 260,
        font: {
          fontSize: 16,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        height: 70,
        top: 10,
        left: 20,
        text: menu.description
      });
      view.add(label);
      if (menu.screenCapture !== null) {
        screenCapture = Ti.UI.createImageView({
          width: 240,
          height: 240,
          top: 100,
          left: 30,
          image: menu.screenCapture
        });
        view.add(screenCapture);
      } else {
        LoginForm = require("ui/loginForm");
        loginForm = new LoginForm();
        view.add(loginForm);
      }
      this.scrollView.addView(view);
    }
  };

  return startupWindow;

})();

module.exports = startupWindow;
