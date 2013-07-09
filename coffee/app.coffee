Cloud = require('ti.cloud')
shopDataTableView = require('ui/shopDataTableView')
ActivityIndicator = require('ui/activityIndicator')
activityIndicator = new ActivityIndicator()


tabGroup = Ti.UI.createTabGroup
  tabsBackgroundColor:"#f9f9f9"
  shadowImage:"ui/image/shadowimage.png"
  tabsBackgroundImage:"ui/image/tabbarLightYellow.png"
  # activeTabBackgroundImage:"ui/image/activeBluetab.png"
  activeTabBackgroundImage:"ui/image/activetab.png"  
  activeTabIconTint:"#fffBD5"

tabGroup.addEventListener('focus',(e) ->
  tabGroup._activeTab = e.tab
  tabGroup._activeTabIndex = e.index
  if tabGroup._activeTabIndex is -1
    return

  Ti.API._activeTab = tabGroup._activeTab;
  Ti.API.info tabGroup._activeTab
  return
)

MapWindow = require("ui/mapWindow")
mapWindow = new MapWindow()

MypageWindow = require("ui/mypageWindow")
mypageWindow = new MypageWindow()

ListWindow = require("ui/listWindow")
listWindow = new ListWindow()

FavoriteWindow = require("ui/favoriteWindow")
favoriteWindow = new FavoriteWindow()


mapTab = Titanium.UI.createTab
  window:mapWindow
  icon:"ui/image/light_pin.png"
  title:"近くのお店"
  # activeIcon:"ui/image/pin.png"

mypageTab = Titanium.UI.createTab
  window:mypageWindow
  icon:"ui/image/light_gears.png"
  title:"設定画面"
  # activeIcon:"ui/image/listButton.png"
  
favoriteTab = Titanium.UI.createTab
  window:favoriteWindow
  icon:"ui/image/light_star.png"
  title:"お気に入り"

  
listTab = Titanium.UI.createTab
  window:listWindow
  icon:"ui/image/light_list.png"
  title:"お店一覧"


# mainTab = require("ui/mainTab")
# mainTab = new mainTab()
# tabGroup.addTab mainTab
#
tabGroup.addTab mapTab
tabGroup.addTab listTab
tabGroup.addTab favoriteTab
tabGroup.addTab mypageTab
tabGroup.open()