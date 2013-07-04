var facebookTab;

facebookTab = (function() {

  function facebookTab() {
    var baseColor, button, facebookWindowTitle, fb, that;
    baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#dfdfdf",
      keyColor: "#EDAD0B"
    };
    this.table = Ti.UI.createTableView({
      backgroundColor: baseColor.backgroundColor,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      width: 'auto',
      height: 'auto',
      top: 0,
      left: 0
    });
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
            var rows, user;
            if (e.success) {
              user = e.users[0];
              rows = [];
              Ti.API.info("User  = " + JSON.stringify(user));
              Ti.App.Properties.setString("cbFan.currentUserId", user.id);
              rows.push(that._userSection(user));
              rows.push(that._favoriteSection(user));
              that.table.setData(rows);
              return cbFan.facebookWindow.add(that.table);
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
      text: "マイページ"
    });
    cbFan.facebookWindow = Ti.UI.createWindow({
      title: "マイページ",
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
    var baseColor, menuHeaderTitle, menuHeaderView, menuSection, nameLabel, nameRow;
    baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#dfdfdf",
      keyColor: "#EDAD0B"
    };
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
    nameRow.add(nameLabel);
    nameRow.add(this.fbLoginButton);
    menuSection.add(nameRow);
    return menuSection;
  };

  facebookTab.prototype._favoriteSection = function(user) {
    var favoriteHeaderTitle, favoriteHeaderView, favoriteSection, placeIDList, shopLists, userID;
    favoriteHeaderView = Ti.UI.createView({
      backgroundColor: baseColor.backgroundColor,
      height: 30
    });
    favoriteHeaderTitle = Ti.UI.createLabel({
      top: 0,
      left: 5,
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "お気に入り"
    });
    favoriteHeaderView.add(favoriteHeaderTitle);
    favoriteSection = Ti.UI.createTableViewSection({
      headerView: favoriteHeaderView
    });
    userID = user.id;
    shopLists = [];
    placeIDList = [];
    Cloud.Reviews.query({
      page: 1,
      per_page: 50,
      response_json_depth: 5,
      user: userID
    }, function(e) {
      var i, id, placeID, review, _i, _id, _len, _results;
      if (e.success) {
        i = 0;
        while (i < e.reviews.length) {
          review = e.reviews[i];
          _id = review.id;
          placeID = review.custom_fields.place_id;
          Ti.API.info("place_id is " + placeID);
          placeIDList.push(placeID);
          i++;
        }
        _results = [];
        for (_i = 0, _len = placeIDList.length; _i < _len; _i++) {
          id = placeIDList[_i];
          Ti.API.info(id);
          _results.push(Cloud.Places.show({
            place_id: id
          }, function(e) {
            var data, shopNameLabel, shopNameRow;
            if (e.success) {
              data = {
                name: e.places[0].name,
                shopAddress: e.places[0].address,
                phoneNumber: e.places[0].phone_number,
                latitude: e.places[0].latitude,
                longitude: e.places[0].longitude
              };
              shopNameRow = Ti.UI.createTableViewRow({
                width: 'auto',
                height: 40,
                selectedColor: 'transparent'
              });
              shopNameLabel = Ti.UI.createLabel({
                text: data.name,
                width: 'auto',
                color: "#333",
                left: 20,
                top: 10,
                font: {
                  fontSize: 18,
                  fontFamily: 'Rounded M+ 1p',
                  fontWeight: 'bold'
                }
              });
              shopNameRow.add(shopNameLabel);
              return favoriteSection.add(shopNameRow);
            }
          }));
        }
        return _results;
      } else {
        return Ti.API.info("Error:\n");
      }
    });
    return favoriteSection;
  };

  return facebookTab;

})();

module.exports = facebookTab;
