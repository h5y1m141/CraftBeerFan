var actionBarMenu;

actionBarMenu = (function() {

  function actionBarMenu(menu) {
    var item, listViewItem, mapViewItem;
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
    listViewItem.addEventListener("click", function(e) {});
    item = menu.add({
      title: 'item1',
      showAsAction: SHOW_AS_ACTION_NEVER
    });
    item = menu.add({
      title: 'item2',
      showAsAction: SHOW_AS_ACTION_NEVER
    });
    item = menu.add({
      title: 'item3',
      showAsAction: SHOW_AS_ACTION_NEVER
    });
    return;
  }

  return actionBarMenu;

})();

module.exports = actionBarMenu;
