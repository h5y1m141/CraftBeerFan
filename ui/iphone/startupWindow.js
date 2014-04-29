(function() {
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
          fontSize: 18,
          fontFamily: 'Rounded M+ 1p',
          fontWeight: 'bold'
        },
        text: "CraftBeerFan"
      });
      this.scrollView = Titanium.UI.createScrollableView({
        backgroundColor: this.baseColor.backgroundColor,
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
      var LoginForm, backBtn, label, loginForm, menu, menuList, nextBtn, screenCapture, view, _i, _len;
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
        backBtn = Ti.UI.createImageView({
          width: 40,
          height: 200,
          left: 0,
          top: 120,
          backIndex: menu.back,
          zIndex: 10,
          image: "ui/image/backArrow.png"
        });
        backBtn.addEventListener('click', (function(_this) {
          return function(e) {
            Ti.API.info("backIndex is " + e.source.backIndex);
            return _this.scrollView.scrollToView(e.source.backIndex);
          };
        })(this));
        nextBtn = Ti.UI.createImageView({
          width: 40,
          height: 200,
          right: 0,
          top: 120,
          nextIndex: menu.next,
          zIndex: 10,
          image: "ui/image/nextArrow.png"
        });
        nextBtn.addEventListener('click', (function(_this) {
          return function(e) {
            Ti.API.info("nextIndex is " + e.source.nextIndex);
            return _this.scrollView.scrollToView(e.source.nextIndex);
          };
        })(this));
        if (menu.back !== null) {
          view.add(backBtn);
        }
        if (menu.next !== null) {
          view.add(nextBtn);
        }
        if (menu.screenCapture !== null) {
          screenCapture = Ti.UI.createImageView({
            width: 200,
            height: 200,
            top: 120,
            left: 50,
            image: menu.screenCapture
          });
          view.add(screenCapture);
        } else {
          LoginForm = require("ui/iphone/loginForm");
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

}).call(this);
