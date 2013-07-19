var screen;

screen = (function() {

  function screen() {
    var keyColor, winTitle;
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
    this.win = Ti.UI.createWindow({
      title: "CraftBeerFan",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      navBarHidden: false,
      tabBarHidden: false
    });
    if (Ti.Platform.osname === 'iphone') {
      this.win.setTitleControl(winTitle);
    }
    this.label = Ti.UI.createLabel({
      textAlign: 1,
      color: this.baseColor.color,
      width: 300,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      height: 80,
      top: 50,
      left: 5
    });
    this.backBtn = Ti.UI.createLabel({
      color: "#333",
      width: 40,
      height: 120,
      top: 50,
      left: 30,
      font: {
        fontSize: 32,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "<"
    });
    this.nextBtn = Ti.UI.createLabel({
      color: "#333",
      width: 40,
      height: 120,
      top: 50,
      right: 30,
      font: {
        fontSize: 32,
        fontFamily: 'Rounded M+ 1p'
      },
      text: ">"
    });
    this.endPointBtn = Ti.UI.createLabel({
      color: this.baseColor.barColor,
      backgroundColor: "#DA5019",
      width: 150,
      height: 50,
      top: 150,
      textAlign: "center",
      left: 75,
      borderWidth: 0,
      borderRadius: 10,
      font: {
        fontSize: 24,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "START"
    });
    this.endPointBtn.addEventListener('click', function(e) {
      var mainController;
      Ti.App.Properties.setBool("configurationWizard", false);
      mainController = require("controller/mainController");
      return new mainController();
    });
    this.currentView = Ti.UI.createView({
      width: 300,
      height: 300,
      backgroundColor: this.baseColor.backgroundColor,
      top: 120,
      left: 10,
      zIndex: 1,
      borderRadius: 10
    });
    this.nextView = Ti.UI.createView({
      width: 300,
      height: 300,
      backgroundColor: this.baseColor.backgroundColor,
      top: 120,
      left: 120,
      zIndex: 2,
      visible: false,
      borderRadius: 5
    });
    this.nextViewlabel = Ti.UI.createLabel({
      textAlign: 1,
      color: this.baseColor.color,
      width: 300,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      height: 80,
      top: 50,
      left: 5
    });
  }

  return screen;

})();

module.exports = screen;
