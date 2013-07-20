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
      textAlign: 'left',
      color: this.baseColor.color,
      width: 280,
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      height: 100,
      top: 10,
      left: 20
    });
    this.screenCapture = Ti.UI.createImageView({
      width: 250,
      height: 250,
      top: 110,
      left: 20,
      image: ""
    });
    this.backBtn = Ti.UI.createLabel({
      color: this.baseColor.barColor,
      textAlign: 'center',
      width: 35,
      height: 35,
      top: 20,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: this.baseColor.barColor,
      backgroundColor: "#44A5CB",
      left: 20,
      font: {
        fontSize: 32,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "<"
    });
    this.nextBtn = Ti.UI.createLabel({
      color: this.baseColor.barColor,
      textAlign: 'center',
      width: 35,
      height: 35,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: this.baseColor.barColor,
      backgroundColor: "#44A5CB",
      top: 20,
      right: 20,
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
      height: 400,
      backgroundColor: this.baseColor.backgroundColor,
      top: 60,
      left: 10,
      zIndex: 1,
      borderRadius: 10
    });
    this.nextView = Ti.UI.createView({
      width: 300,
      height: 300,
      backgroundColor: this.baseColor.backgroundColor,
      top: 60,
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
