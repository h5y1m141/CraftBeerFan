var startupWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

startupWindow = (function() {

  function startupWindow() {
    this._createView = __bind(this._createView, this);

    var keyColor, win, winTitle;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      color: "#222",
      backgroundColor: keyColor
    };
    winTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: "#333",
      font: {
        fontSize: '18dip',
        fontFamily: 'Rounded M+ 1p'
      },
      text: "CraftBeerFan"
    });
    this.scrollView = Titanium.UI.createScrollableView({
      backgroundColor: this.baseColor.backgroundColor,
      height: '460dip',
      showPagingControl: true,
      pagingControlHeight: '30dip'
    });
    this._createView();
    win = Ti.UI.createWindow({
      title: "CraftBeerFan",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    win.add(this.scrollView);
    return win;
  }

  startupWindow.prototype._createView = function() {
    var LoginForm, label, loginForm, menu, menuList, screenCapture, view, _i, _len;
    menuList = [
      {
        description: "CraftBeerFanはクラフトビールが買える/飲めるお店を探すことが出来るアプリケーションです",
        screenCapture: "ui/image/logo.png",
        back: null,
        next: 1
      }, {
        description: "現在の位置から近い所のお店を探すことができます。",
        screenCapture: "ui/image/map.png",
        back: 0,
        next: 2
      }, {
        description: "飲めるお店はタンブラーのアイコン、買えるお店はボトルのアイコンで表現してます",
        screenCapture: "ui/image/iconImage.png",
        back: 1,
        next: 3
      }, {
        description: "出張や旅行先でクラフトビールが飲める・買えるお店の下調べする時にはリスト機能を使うと便利です",
        screenCapture: "ui/image/list.png",
        back: 2,
        next: 4
      }, {
        description: "もしも気になるお店があったら、お気に入りに登録しておくことをオススメします",
        screenCapture: "ui/image/favorite.png",
        back: 3,
        next: 5
      }, {
        description: "以上でアプリケーションの説明は終了です。アカウントを登録してからご利用ください。",
        next: null,
        back: 4,
        screenCapture: null
      }
    ];
    for (_i = 0, _len = menuList.length; _i < _len; _i++) {
      menu = menuList[_i];
      view = Ti.UI.createView({
        width: '600dip',
        height: '800dip',
        backgroundColor: this.baseColor.backgroundColor,
        top: '0dip',
        left: '0dip',
        zIndex: 1,
        borderRadius: '20dip'
      });
      label = Ti.UI.createLabel({
        top: '5dip',
        left: '5dip',
        textAlign: 'left',
        color: this.baseColor.color,
        font: {
          fontSize: '18dip',
          fontFamily: 'Rounded M+ 1p'
        },
        text: menu.description
      });
      view.add(label);
      if (menu.screenCapture !== null) {
        screenCapture = Ti.UI.createImageView({
          width: '200dip',
          height: '200dip',
          top: '120dip',
          left: '100dip',
          image: Titanium.Filesystem.resourcesDirectory + menu.screenCapture
        });
        view.add(screenCapture);
      } else {
        LoginForm = require("ui/android/loginForm");
        loginForm = new LoginForm();
        view.add(loginForm);
      }
      this.scrollView.addView(view);
      Ti.API.info("scrollView.addView done");
    }
  };

  return startupWindow;

})();

module.exports = startupWindow;
