var actionBarMenu;

actionBarMenu = (function() {

  function actionBarMenu(menu) {
    var item;
    item = menu.add({
      title: 'item1',
      showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
    });
    item = menu.add({
      title: 'item2',
      showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
    });
    item = menu.add({
      title: 'item3',
      showAsAction: Ti.Android.SHOW_AS_ACTION_NEVER
    });
    return;
  }

  return actionBarMenu;

})();

module.exports = actionBarMenu;
