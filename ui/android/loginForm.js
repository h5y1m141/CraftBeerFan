(function() {
  var loginForm,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  loginForm = (function() {
    function loginForm() {
      this._createSignUPBox = __bind(this._createSignUPBox, this);
      this._createSkipBox = __bind(this._createSkipBox, this);
      var MainController, cancelleBtn, fb, fbLoginBtn, passwordField, registBtn, signUpBox, skipBox, t, userIDField;
      this.baseColor = {
        barColor: "#f9f9f9",
        backgroundColor: "#f3f3f3",
        keyColor: "#DA5019",
        textColor: "#333",
        signUpBackgroundColor: "#4cda64",
        skipBackgroundColor: "#d8514b"
      };
      this.userID = "";
      this.password = "";
      MainController = require("controller/mainController");
      this.mainController = new MainController();
      loginForm = Ti.UI.createView({
        width: '240dip',
        height: '240dip',
        top: '120dip',
        left: '120dip',
        backgroundColor: this.baseColor.barColor,
        borderWidth: '5dip',
        borderColor: "#222",
        zIndex: 0
      });
      userIDField = Ti.UI.createTextField({
        color: this.baseColor.textColor,
        top: '10dip',
        left: '10dip',
        width: '200dip',
        height: '30dip',
        hintText: "メールアドレスを入力",
        font: {
          fontSize: '14dip'
        },
        keyboardType: Ti.UI.KEYBOARD_EMAIL_ADDRESS,
        returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocorrect: false,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
      });
      userIDField.addEventListener('change', (function(_this) {
        return function(e) {
          return _this.userID = e.value;
        };
      })(this));
      passwordField = Ti.UI.createTextField({
        color: this.baseColor.textColor,
        top: '50dip',
        left: '10dip',
        width: '200dip',
        height: '30dip',
        hintText: "パスワードを設定",
        font: {
          fontSize: '14dip'
        },
        keyboardType: Ti.UI.KEYBOARD_ASCII,
        returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        enableReturnKey: true,
        passwordMask: true,
        autocorrect: false
      });
      passwordField.addEventListener('change', (function(_this) {
        return function(e) {
          if (e.value.length === 20) {
            return alert("パスワードは20文字以内にて設定してください");
          } else {
            return _this.password = e.value;
          }
        };
      })(this));
      t = Titanium.UI.create2DMatrix().scale(0.0);
      this.accountSignUpView = Ti.UI.createView({
        width: '240dip',
        height: '240dip',
        top: '0dip',
        left: '0dip',
        transform: t,
        backgroundColor: this.baseColor.barColor,
        zIndex: 10
      });
      registBtn = Ti.UI.createLabel({
        width: '80dip',
        height: '30dip',
        top: '100dip',
        left: '120dip',
        borderRadius: 5,
        color: this.baseColor.barColor,
        backgroundColor: "#4cda64",
        font: {
          fontSize: '14dip',
          fontFamily: 'Rounded M+ 1p'
        },
        text: "登録する",
        textAlign: 'center'
      });
      registBtn.addEventListener('click', (function(_this) {
        return function(e) {
          if (_this.userID === "" || _this.password === "") {
            return alert("メールアドレスかパスワードが空白になってます");
          } else {
            Ti.API.info("signup start userid: " + _this.userID + " and password:" + _this.password);
            return _this.mainController.signUP(_this.userID, _this.password);
          }
        };
      })(this));
      cancelleBtn = Ti.UI.createLabel({
        width: '80dip',
        height: '30dip',
        left: '20dip',
        top: '100dip',
        borderRadius: 5,
        backgroundColor: "#d8514b",
        color: this.baseColor.barColor,
        font: {
          fontSize: '14dip',
          fontFamily: 'Rounded M+ 1p'
        },
        text: '登録中止',
        textAlign: "center"
      });
      cancelleBtn.addEventListener('click', (function(_this) {
        return function(e) {
          var animation, t1;
          t1 = Titanium.UI.create2DMatrix();
          t1 = t1.scale(0.0);
          animation = Titanium.UI.createAnimation();
          animation.transform = t1;
          animation.duration = 250;
          return _this.accountSignUpView.animate(animation);
        };
      })(this));
      this.accountSignUpView.add(userIDField);
      this.accountSignUpView.add(passwordField);
      this.accountSignUpView.add(registBtn);
      this.accountSignUpView.add(cancelleBtn);
      loginForm.add(this.accountSignUpView);
      fb = require('facebook');
      fbLoginBtn = fb.createLoginButton({
        top: 50,
        style: fb.BUTTON_STYLE_WIDE
      });
      fb.appid = this._getAppID();
      fb.permissions = ['read_stream'];
      fb.forceDialogAuth = true;
      fb.addEventListener('login', (function(_this) {
        return function(e) {
          var Cloud, that, token;
          that = _this;
          if (e.success) {
            token = fb.accessToken;
            Ti.App.Analytics.trackEvent('startupWindow', 'loginSuccess', 'loginSuccess', 1);
            Cloud = require('ti.cloud');
            return Cloud.SocialIntegrations.externalAccountLogin({
              type: "facebook",
              token: token
            }, function(result) {
              var user;
              if (result.success) {
                user = result.users[0];
                Ti.App.Properties.setBool("configurationWizard", true);
                Ti.App.Properties.setString("currentUserId", user.id);
                Ti.App.Properties.setString("userName", user.first_name + " " + user.last_name);
                Ti.App.Properties.setString("loginType", "facebook");
                return that.mainController.createTabGroup();
              }
            });
          } else if (e.cancelled) {
            alert("ログイン処理がキャンセルされました");
            return Ti.App.Analytics.trackEvent('startupWindow', 'loginCanceled', 'loginCanceled', 1);
          } else if (e.error) {
            Ti.App.Analytics.trackEvent('startupWindow', 'loginError', 'loginError', 1);
            return alert("ログイン処理中にエラーが発生しました");
          } else {
            return Ti.App.Analytics.trackEvent('startupWindow', 'otherLogin', 'otherLogin', 1);
          }
        };
      })(this));
      fb.addEventListener('logout', function(e) {
        Ti.App.Analytics.trackEvent('startupWindow', 'logout', 'logout', 1);
        return alert('logout');
      });
      signUpBox = this._createSignUPBox();
      skipBox = this._createSkipBox();
      loginForm.add(fbLoginBtn);
      loginForm.add(signUpBox);
      loginForm.add(skipBox);
      return loginForm;
    }

    loginForm.prototype._getAppID = function() {
      var appid, config, file, json;
      config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json");
      file = config.read().toString();
      json = JSON.parse(file);
      appid = json.facebook.appid;
      return appid;
    };

    loginForm.prototype._createSkipBox = function() {
      var skipBox, skipIcon, skipLabel;
      skipBox = Ti.UI.createView({
        left: '40dip',
        top: '150dip',
        backgroundColor: this.baseColor.skipBackgroundColor,
        borderColor: this.baseColor.skipBackgroundColor,
        width: '160dip',
        height: '25dip',
        borderRadius: 5
      });
      skipBox.addEventListener('click', (function(_this) {
        return function(e) {
          Ti.App.Analytics.trackEvent('startupWindow', 'accountRegistSkip', 'accountRegistSkip', 1);
          Ti.App.Properties.setBool("configurationWizard", true);
          return _this.mainController.createTabGroup();
        };
      })(this));
      skipIcon = Ti.UI.createLabel({
        top: '5dip',
        left: '5dip',
        width: '20dip',
        height: '20dip',
        textAlign: 'center',
        backgroundColor: this.baseColor.skipBackgroundColor,
        color: this.baseColor.barColor,
        font: {
          fontSize: '20dip',
          fontFamily: 'LigatureSymbols'
        },
        text: String.fromCharCode("0xe087")
      });
      skipLabel = Ti.UI.createLabel({
        top: '5dip',
        left: '25dip',
        textAlign: 'center',
        width: '130dip',
        height: '20dip',
        color: this.baseColor.barColor,
        font: {
          fontSize: '12dip',
          fontFamily: 'Rounded M+ 1p'
        },
        text: "登録せずに利用"
      });
      skipBox.add(skipIcon);
      skipBox.add(skipLabel);
      return skipBox;
    };

    loginForm.prototype._createSignUPBox = function() {
      var signUpBox, signUpIcon, signUpLabel;
      signUpBox = Ti.UI.createView({
        left: '20dip',
        top: '100dip',
        backgroundColor: this.baseColor.signUpBackgroundColor,
        borderColor: this.baseColor.signUpBackgroundColor,
        width: '160dip',
        height: '25dip',
        borderRadius: 5
      });
      signUpBox.addEventListener('click', (function(_this) {
        return function(e) {
          var animation, t1;
          Ti.App.Analytics.trackEvent('startupWindow', 'accountRegist', 'accountRegist', 1);
          t1 = Titanium.UI.create2DMatrix();
          t1 = t1.scale(1.0);
          animation = Titanium.UI.createAnimation();
          animation.transform = t1;
          animation.duration = 250;
          return _this.accountSignUpView.animate(animation);
        };
      })(this));
      signUpIcon = Ti.UI.createLabel({
        top: '5dip',
        left: '5dip',
        width: '20dip',
        height: '20dip',
        textAlign: 'center',
        backgroundColor: this.baseColor.signUpBackgroundColor,
        color: this.baseColor.barColor,
        font: {
          fontSize: '20dip',
          fontFamily: 'LigatureSymbols'
        },
        text: String.fromCharCode("0xe029")
      });
      signUpLabel = Ti.UI.createLabel({
        top: '5dip',
        left: '25dip',
        textAlign: 'center',
        width: '260dip',
        height: '40dip',
        color: this.baseColor.barColor,
        font: {
          fontSize: '18dip',
          fontFamily: 'Rounded M+ 1p'
        },
        text: "新規登録する"
      });
      signUpBox.add(signUpIcon);
      signUpBox.add(signUpLabel);
      return signUpBox;
    };

    return loginForm;

  })();

  module.exports = loginForm;

}).call(this);
