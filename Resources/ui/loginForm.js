var loginForm,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

loginForm = (function() {

  function loginForm() {
    this._createSignUPBox = __bind(this._createSignUPBox, this);

    this._createSkipBox = __bind(this._createSkipBox, this);

    var MainController, cancelleBtn, fb, fbLoginBtn, passwordField, registBtn, signUpBox, skipBox, t, userIDField,
      _this = this;
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
      width: 240,
      height: 240,
      top: 100,
      left: 30,
      backgroundColor: this.baseColor.barColor,
      zIndex: 0
    });
    userIDField = Ti.UI.createTextField({
      color: this.baseColor.textColor,
      top: 10,
      left: 10,
      width: 200,
      height: 30,
      hintText: "メールアドレスを入力",
      font: {
        fontSize: 14
      },
      keyboardType: Ti.UI.KEYBOARD_EMAIL_ADDRESS,
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      autocorrect: false,
      autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    });
    userIDField.addEventListener('change', function(e) {
      return _this.userID = e.value;
    });
    passwordField = Ti.UI.createTextField({
      color: this.baseColor.textColor,
      top: 50,
      left: 10,
      width: 200,
      height: 30,
      hintText: "パスワードを設定",
      font: {
        fontSize: 14
      },
      keyboardType: Ti.UI.KEYBOARD_ASCII,
      returnKeyType: Ti.UI.RETURNKEY_DEFAULT,
      borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
      enableReturnKey: true,
      passwordMask: true,
      autocorrect: false
    });
    passwordField.addEventListener('change', function(e) {
      if (e.value.length === 20) {
        return alert("パスワードは20文字以内にて設定してください");
      } else {
        return _this.password = e.value;
      }
    });
    t = Titanium.UI.create2DMatrix().scale(0.0);
    this.accountSignUpView = Ti.UI.createView({
      width: 240,
      height: 240,
      top: 0,
      left: 0,
      transform: t,
      backgroundColor: this.baseColor.barColor,
      zIndex: 10
    });
    registBtn = Ti.UI.createLabel({
      width: 80,
      height: 30,
      top: 100,
      left: 120,
      borderRadius: 5,
      color: this.baseColor.barColor,
      backgroundColor: "#4cda64",
      font: {
        fontSize: 14,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "登録する",
      textAlign: 'center'
    });
    registBtn.addEventListener('click', function(e) {
      if (_this.userID === "" || _this.password === "") {
        return alert("メールアドレスかパスワードが空白になってます");
      } else {
        Ti.API.info("signup start userid: " + _this.userID + " and password:" + _this.password);
        return _this.mainController.signUP(_this.userID, _this.password);
      }
    });
    cancelleBtn = Ti.UI.createLabel({
      width: 80,
      height: 30,
      left: 20,
      top: 100,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: this.baseColor.barColor,
      font: {
        fontSize: 14,
        fontFamily: 'Rounded M+ 1p'
      },
      text: '登録中止',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      var animation, t1;
      t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(0.0);
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 250;
      return _this.accountSignUpView.animate(animation);
    });
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
    fb.addEventListener('login', function(e) {
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
    });
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
    var skipBox, skipIcon, skipLabel,
      _this = this;
    skipBox = Ti.UI.createView({
      left: 40,
      top: 150,
      backgroundColor: this.baseColor.skipBackgroundColor,
      borderColor: this.baseColor.skipBackgroundColor,
      width: 160,
      height: 25,
      borderRadius: 5
    });
    skipBox.addEventListener('click', function(e) {
      Ti.App.Analytics.trackEvent('startupWindow', 'accountRegistSkip', 'accountRegistSkip', 1);
      Ti.App.Properties.setBool("configurationWizard", true);
      return _this.mainController.createTabGroup();
    });
    skipIcon = Ti.UI.createLabel({
      top: 5,
      left: 5,
      width: 20,
      height: 20,
      textAlign: 'center',
      backgroundColor: this.baseColor.skipBackgroundColor,
      color: this.baseColor.barColor,
      font: {
        fontSize: 20,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe087")
    });
    skipLabel = Ti.UI.createLabel({
      top: 5,
      left: 25,
      textAlign: 'center',
      width: 130,
      height: 20,
      color: this.baseColor.barColor,
      font: {
        fontSize: 12,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "登録せずに利用"
    });
    skipBox.add(skipIcon);
    skipBox.add(skipLabel);
    return skipBox;
  };

  loginForm.prototype._createSignUPBox = function() {
    var signUpBox, signUpIcon, signUpLabel,
      _this = this;
    signUpBox = Ti.UI.createView({
      left: 40,
      top: 100,
      backgroundColor: this.baseColor.signUpBackgroundColor,
      borderColor: this.baseColor.signUpBackgroundColor,
      width: 160,
      height: 25,
      borderRadius: 5
    });
    signUpBox.addEventListener('click', function(e) {
      var animation, t1;
      Ti.App.Analytics.trackEvent('startupWindow', 'accountRegist', 'accountRegist', 1);
      t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(1.0);
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 250;
      return _this.accountSignUpView.animate(animation);
    });
    signUpIcon = Ti.UI.createLabel({
      top: 5,
      left: 5,
      width: 20,
      height: 20,
      textAlign: 'center',
      backgroundColor: this.baseColor.signUpBackgroundColor,
      color: this.baseColor.barColor,
      font: {
        fontSize: 20,
        fontFamily: 'LigatureSymbols'
      },
      text: String.fromCharCode("0xe029")
    });
    signUpLabel = Ti.UI.createLabel({
      top: 5,
      left: 25,
      textAlign: 'center',
      width: 130,
      height: 20,
      color: this.baseColor.barColor,
      font: {
        fontSize: 14,
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
