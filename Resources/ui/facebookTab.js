var facebookTab;

facebookTab = (function() {

  function facebookTab() {
    var baseColor, button, facebookWindowTitle, fb, that;
    baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#dfdfdf",
      keyColor: "#EDAD0B"
    };
    fb = require('facebook');
    fb.appid = this._getAppID();
    fb.permissions = ['read_stream'];
    fb.forceDialogAuth = false;
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
            var user;
            if (e.success) {
              user = e.users[0];
              Ti.API.info("User  = " + JSON.stringify(user));
              Ti.App.Properties.setString("cbFan.currentUserId", user.id);
              return that._userSection(user);
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
    button = Ti.UI.createButton({
      title: "Facebook auth",
      top: 30,
      left: 30
    });
    button.addEventListener("click", function(e) {
      return fb.reauthorize(["read_stream"], "me", function(e) {
        if (e.success) {
          return Ti.API.info("If successful, proceed with a publish call");
        } else {
          if (e.error) {
            return alert(e.error);
          } else {
            return alert("Unknown result");
          }
        }
      });
    });
    button.hide();
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
    cbFan.facebookWindow = Ti.UI.createWindow({
      title: "アカウント設定",
      barColor: baseColor.barColor,
      backgroundColor: baseColor.backgroundColor,
      tabBarHidden: false
    });
    cbFan.facebookWindow.add(button);
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
    var baseColor, menuHeaderTitle, menuHeaderView, menuSection, nameLabel, nameRow, reviewCount, reviewLabel, reviewRow, rows, shopLists, table, userID;
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
      height: 'auto',
      top: 0,
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
    reviewRow = Ti.UI.createTableViewRow({
      height: 40,
      width: 'auto'
    });
    userID = user.id;
    reviewCount = Ti.UI.createLabel({
      text: "",
      left: 200,
      top: 10,
      width: 50,
      color: "#333",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    reviewLabel = Ti.UI.createLabel({
      text: "お気に入り登録件数:　",
      left: 5,
      top: 10,
      width: 180,
      color: "#333",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    shopLists = [];
    Cloud.Reviews.query({
      page: 1,
      per_page: 50,
      response_json_depth: 5,
      user: userID
    }, function(e) {
      var created_at, i, place_id, review, _id, _results;
      if (e.success) {
        i = 0;
        Ti.API.info(e.reviews.length);
        reviewCount.setText(e.reviews.length);
        reviewCount.textAlign = Ti.UI.TEXT_ALIGNMENT_LEFT;
        _results = [];
        while (i < e.reviews.length) {
          review = e.reviews[i];
          _id = review.id;
          created_at = review.created_at;
          place_id = review.custom_fields.place_id;
          Cloud.Places.query({
            page: 1,
            per_page: 1,
            place_id: place_id
          }, function(e) {
            var data;
            if (e.success) {
              data = {
                name: e.places[0].name,
                shopAddress: e.places[0].address,
                phoneNumber: e.places[0].phone_number,
                latitude: e.places[0].latitude,
                longitude: e.places[0].longitude
              };
              Ti.API.info(data);
              return shopLists.push(data);
            }
          });
          _results.push(i++);
        }
        return _results;
      } else {
        return Ti.API.info("Error:\n");
      }
    });
    reviewRow.add(reviewCount);
    reviewRow.add(reviewLabel);
    nameRow.add(nameLabel);
    nameRow.add(this.fbLoginButton);
    menuSection.add(nameRow);
    menuSection.add(reviewRow);
    rows.push(menuSection);
    table.setData(rows);
    cbFan.facebookWindow.add(table);
  };

  return facebookTab;

})();

module.exports = facebookTab;
