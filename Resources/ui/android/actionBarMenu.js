var actionBarMenu;

actionBarMenu = (function() {

  function actionBarMenu(menu) {
    var listViewItem, mapViewItem;
    mapViewItem = menu.add({
      title: "近くのお店",
      icon: Titanium.Filesystem.resourcesDirectory + "ui/image/pin@2x.png",
      showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS
    });
    mapViewItem.addEventListener("click", function(e) {
      var mapWindow;
      mapWindow = require("ui/android/mapWindow");
      mapWindow = new mapWindow();
      return mapWindow.open();
    });
    listViewItem = menu.add({
      title: "リスト",
      icon: Titanium.Filesystem.resourcesDirectory + "ui/image/listIcon@2x.png",
      showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS
    });
    listViewItem.addEventListener("click", function(e) {
      var win;
      win = Ti.UI.createWindow({
        navBarHidden: false
      });
      return win.open();
    });
    return;
  }

  return actionBarMenu;

})();

module.exports = actionBarMenu;
