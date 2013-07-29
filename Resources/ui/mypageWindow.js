var mypageWindow;

mypageWindow = (function() {

  function mypageWindow() {
    var currentUserName, loginType, mypageWindowTitle, rows, table;
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      backgroundDarkColor: "#dfdfdf",
      keyColor: "#44A5CB"
    };
    mypageWindow = Ti.UI.createWindow({
      title: "マイページ",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: false,
      navBarHidden: false
    });
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
    if (Ti.Platform.osname === 'iphone') {
      mypageWindow.setTitleControl(mypageWindowTitle);
    }
    table = Ti.UI.createTableView({
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      backgroundColor: "#f3f3f3",
      separatorColor: '#cccccc',
      width: 'auto',
      height: 'auto',
      left: 0,
      top: 0
    });
    currentUserName = Ti.App.Properties.getString("currentUserName");
    loginType = Ti.App.Properties.getString("loginType");
    rows = [];
    rows.push(this._userSection(currentUserName, loginType));
    table.setData(rows);
    mypageWindow.add(table);
    return mypageWindow;
  }

  mypageWindow.prototype._userSection = function(username, loginType) {
    var accountTypeLabel, accountTypeRow, accountTypeTitle, menuHeaderTitle, menuHeaderView, menuSection, nameLabel, nameRow, nameTitle;
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
      height: 60
    });
    nameTitle = Ti.UI.createLabel({
      text: "ログインID:",
      width: 100,
      height: 20,
      color: this.baseColor.keyColor,
      left: 5,
      top: 5,
      font: {
        fontSize: 12,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    nameLabel = Ti.UI.createLabel({
      text: username,
      width: 'auto',
      height: 20,
      color: "#333",
      left: 5,
      top: 25,
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p'
      }
    });
    nameRow.add(nameLabel);
    nameRow.add(nameTitle);
    accountTypeRow = Ti.UI.createTableViewRow({
      backgroundColor: this.baseColor.backgroundColor,
      height: 60
    });
    accountTypeTitle = Ti.UI.createLabel({
      width: 'auto',
      height: 20,
      left: 5,
      top: 5,
      text: "アカウントの種類",
      color: this.baseColor.keyColor,
      Font: {
        fontSize: 12,
        fontFamily: 'Rounded M+ 1p'
      }
    });
    accountTypeLabel = Ti.UI.createLabel({
      width: 'auto',
      height: 20,
      left: 5,
      top: 25,
      color: "#333",
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p'
      }
    });
    if (loginType === "facebook") {
      accountTypeLabel.setText("Facebookアカウント利用");
    } else {
      accountTypeLabel.setText("CraftBeerFanアカウント利用");
    }
    accountTypeRow.add(accountTypeLabel);
    accountTypeRow.add(accountTypeTitle);
    menuSection.add(nameRow);
    menuSection.add(accountTypeRow);
    return menuSection;
  };

  return mypageWindow;

})();

module.exports = mypageWindow;
