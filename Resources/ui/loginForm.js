var loginForm;

loginForm = (function() {

  function loginForm() {
    var MainController, accountSignUpView, fb, fbLoginBtn, passwordField, registBtn, signUpBox, signUpIcon, signUpLabel, t, userIDField,
      _this = this;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      keyColor: "#DA5019",
      textColor: "#333"
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
      backgroundColor: this.baseColor.backgroundColor,
      zIndex: 0
    });
    userIDField = Ti.UI.createTextField({
      color: this.baseColor.textColor,
      top: 10,
      left: 10,
      width: 200,
      height: 30,
      hintText: "メールアドレスを入力してください",
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
      hintText: "パスワードを設定してください",
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
      return _this.password = e.value;
    });
    t = Titanium.UI.create2DMatrix().scale(0.0);
    accountSignUpView = Ti.UI.createView({
      width: 240,
      height: 240,
      top: 0,
      left: 0,
      transform: t,
      backgroundColor: this.baseColor.barColor,
      zIndex: 10
    });
    registBtn = Ti.UI.createButton({
      width: 100,
      height: 30,
      top: 100,
      left: 60,
      font: {
        fontSize: 14,
        fontFamily: 'Rounded M+ 1p'
      },
      title: "登録する"
    });
    registBtn.addEventListener('click', function(e) {
      Ti.API.info("signup start userid: " + _this.userID + " and password:" + _this.password);
      return _this.mainController.signUP(_this.userID, _this.password);
    });
    accountSignUpView.add(userIDField);
    accountSignUpView.add(passwordField);
    accountSignUpView.add(registBtn);
    loginForm.add(accountSignUpView);
    signUpBox = Ti.UI.createView({
      left: 40,
      top: 100,
      backgroundColor: this.baseColor.keyColor,
      borderColor: this.baseColor.keyColor,
      width: 160,
      height: 25
    });
    signUpBox.addEventListener('click', function(e) {
      var animation, t1;
      t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(1.0);
      animation = Titanium.UI.createAnimation();
      animation.transform = t1;
      animation.duration = 250;
      return accountSignUpView.animate(animation);
    });
    signUpIcon = Ti.UI.createLabel({
      top: 5,
      left: 5,
      width: 20,
      height: 20,
      textAlign: 'center',
      backgroundColor: this.baseColor.keyColor,
      color: "#fff",
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
    fb = require('facebook');
    fbLoginBtn = fb.createLoginButton({
      top: 50,
      style: fb.BUTTON_STYLE_WIDE
    });
    fb = require('facebook');
    fb.appid = this._getAppID();
    fb.permissions = ['read_stream'];
    fb.forceDialogAuth = true;
    fb.addEventListener('login', function(e) {
      var Cloud, that, token;
      that = _this;
      token = fb.accessToken;
      Ti.API.info("token is " + token);
      if (e.success) {
        if (e.success) {
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
    loginForm.add(fbLoginBtn);
    loginForm.add(signUpBox);
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

  return loginForm;

})();

module.exports = loginForm;
