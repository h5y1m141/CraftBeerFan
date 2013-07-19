var screen;

screen = (function() {

  function screen() {
    this.label = Ti.UI.createLabel({
      textAlign: 1,
      color: "#222",
      width: 300,
      font: {
        fontFamily: 'Helvetica Neue',
        fontSize: 14,
        fontWeight: 'bold'
      },
      height: 80,
      top: 50,
      left: 5
    });
    this.startPointBtn = Ti.UI.createButton({
      width: 50,
      height: 30,
      top: 50,
      left: 10,
      color: "#222"
    });
    this.backBtn = Ti.UI.createButton({
      width: 50,
      height: 30,
      top: 50,
      left: 60,
      color: "#222"
    });
    this.nextBtn = Ti.UI.createButton({
      width: 50,
      height: 30,
      top: 50,
      left: 110,
      color: "#222"
    });
    this.endPointBtn = Ti.UI.createButton({
      width: 50,
      height: 30,
      top: 50,
      left: 160,
      color: "#222"
    });
    this.currentView = Ti.UI.createView({
      width: 300,
      height: 300,
      backgroundColor: '#ededed',
      top: 120,
      left: 10,
      zIndex: 1,
      borderRadius: 10
    });
    this.nextView = Ti.UI.createView({
      width: 300,
      height: 300,
      backgroundColor: "#ccc",
      top: 120,
      left: 120,
      zIndex: 2,
      visible: false,
      borderRadius: 5
    });
    this.nextViewlabel = Ti.UI.createLabel({
      textAlign: 1,
      color: "#222",
      width: 300,
      font: {
        fontFamily: 'Helvetica Neue',
        fontSize: 14,
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
