class mainController
  constructor:() ->
    Cloud = require('ti.cloud')

    tabGroup = Ti.UI.createTabGroup
      tabsBackgroundColor:"#f9f9f9"
      shadowImage:"ui/image/shadowimage.png"
      tabsBackgroundImage:"ui/image/tabbar.png"
      activeTabBackgroundImage:"ui/image/activetab.png"  
      activeTabIconTint:"#fffBD5"

    tabGroup.addEventListener('focus',(e) ->
      tabGroup._activeTab = e.tab
      tabGroup._activeTabIndex = e.index
      if tabGroup._activeTabIndex is -1
        return

      Ti.API._activeTab = tabGroup._activeTab;

      # ページビューを取得したいので以下を参考にしてイベントリスナー設定  
      # http://hirofukami.com/2013/05/31/titanium-google-analytics/

      Ti.App.Analytics.trackPageview "/tab/#{tabGroup._activeTab.windowName}"
      return
    )

    MapWindow = require("ui/mapWindow")
    mapWindow = new MapWindow()
    mapTab = Titanium.UI.createTab
      window:mapWindow
      icon:"ui/image/light_pin.png"
      windowName:"mapWindow"

    MypageWindow = require("ui/mypageWindow")
    mypageWindow = new MypageWindow()
    mypageTab = Titanium.UI.createTab
      window:mypageWindow
      icon:"ui/image/light_gears.png"
      windowName:"mypageWindow"      



    ListWindow = require("ui/listWindow")
    listWindow = new ListWindow()
    listTab = Titanium.UI.createTab
      window:listWindow
      icon:"ui/image/light_list.png"
      windowName:"listWindow"      

    tabGroup.addTab mapTab
    tabGroup.addTab listTab
    tabGroup.addTab mypageTab
    tabGroup.open()    

    
module.exports = mainController  