var facebookTab;

facebookTab = (function() {

  function facebookTab() {
    var baseColor, button, facebookWindowTitle, fb, fbLoginButton,
      _this = this;
    baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#dfdfdf",
      keyColor: "#EDAD0B"
    };
    fb = require('facebook');
    fb.appid = this._getAppID();
    fb.permissions = ['read_stream'];
    fb.forceDialogAuth = false;
    cbFan.facebookToken = fb.accessToken;
    fb.addEventListener('login', function(e) {
      var that;
      that = _this;
      if (e.success) {
        alert(that);
        return Cloud.SocialIntegrations.externalAccountLogin({
          type: "facebook",
          token: fb.accessToken
        }, function(e) {
          var user;
          if (e.success) {
            user = e.users[0];
            Ti.API.info("User  = " + JSON.stringify(user));
            return Ti.App.Properties.setString("cbFan.currentUserId", user.id);
          } else {
            return alert("Error: " + ((e.error && e.message) || JSON.stringify(e)));
          }
        });
      } else if (e.error) {
        return alert(e.error);
      } else {
        if (e.cancelled) {
          return alert("Canceled");
        }
      }
    });
    fb.addEventListener('logout', function(e) {
      return alert("Facebbokアカウントからログアウトしました");
    });
    if (!fb.loggedIn) {
      fb.authorize();
    }
    button = Ti.UI.createButton({
      title: "Open Feed Dialog"
    });
    button.addEventListener("click", function(e) {
      return fb.reauthorize(["publish_stream"], "me", function(e) {
        if (e.success) {
          return fb.dialog("feed", {}, function(e) {
            if (e.success && e.result) {
              return alert("Success! New Post ID: " + e.result);
            } else {
              if (e.error) {
                return alert(e.error);
              } else {
                return alert("User canceled dialog.");
              }
            }
          });
        } else {
          if (e.error) {
            return alert(e.error);
          } else {
            return alert("Unknown result");
          }
        }
      });
    });
    facebookWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: '18sp',
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "アカウント設定"
    });
    fbLoginButton = fb.createLoginButton({
      top: 50,
      style: fb.BUTTON_STYLE_WIDE
    });
    cbFan.facebookWindow = Ti.UI.createWindow({
      title: "アカウント設定",
      barColor: baseColor.barColor,
      backgroundColor: baseColor.backgroundColor,
      tabBarHidden: false
    });
    cbFan.facebookWindow.add(button);
    cbFan.facebookWindow.add(fbLoginButton);
    if (Ti.Platform.osname === 'iphone') {
      cbFan.facebookWindow.setTitleControl(facebookWindowTitle);
    }
    facebookTab = Ti.UI.createTab({
      window: cbFan.facebookWindow,
      barColor: "#343434",
      icon: "ui/image/tab2ic.png"
    });
    return facebookTab;
  }

  facebookTab.prototype._getAppID = function() {
    var appid, config, file, json;
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json");
    file = config.read().toString();
    json = JSON.parse(file);
    appid = json.facebook.appid;
    return appid;
  };

  facebookTab.prototype._userSection = function(user) {
    var baseColor, menuHeaderTitle, menuHeaderView, menuSection, nameLabel, nameRow, rows, table;
    baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#dfdfdf",
      keyColor: "#EDAD0B"
    };
    rows = [];
    table = Ti.UI.createTableView({
      backgroundColor: baseColor.backgroundColor,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      width: 'auto',
      height: '100',
      top: 50,
      left: 0
    });
    menuHeaderView = Ti.UI.createView({
      backgroundColor: baseColor.backgroundColor,
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
      backgroundColor: baseColor.backgroundColor,
      height: 40,
      className: "facebook"
    });
    nameLabel = Ti.UI.createLabel({
      text: user.first_name + user.last_name,
      width: 280,
      color: "#333",
      left: 5,
      top: 5,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    nameRow.add(nameLabel);
    menuSection.add(nameRow);
    rows.push(menuSection);
    table.setData(rows);
    return table;
  };

  return facebookTab;

})();

module.exports = facebookTab;
