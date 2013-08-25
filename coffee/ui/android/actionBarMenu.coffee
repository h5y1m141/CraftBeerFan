class actionBarMenu
  constructor:(menu) ->
    mapViewItem = menu.add(
      title: "近くのお店"
      icon:Titanium.Filesystem.resourcesDirectory + "ui/image/pin@2x.png"
      showAsAction:Ti.Android.SHOW_AS_ACTION_ALWAYS
    )
    mapViewItem.addEventListener "click", (e) ->
      mapWindow = require("ui/android/mapWindow")
      mapWindow = new mapWindow()
      mapWindow.open()
      
      
    listViewItem = menu.add(
      title: "リスト"
      icon:Titanium.Filesystem.resourcesDirectory + "ui/image/listIcon@2x.png"
      showAsAction:Ti.Android.SHOW_AS_ACTION_ALWAYS
    )
    listViewItem.addEventListener "click", (e) ->
      win = Ti.UI.createWindow
        navBarHidden:false
      win.open()
      
    return
    
module.exports = actionBarMenu  