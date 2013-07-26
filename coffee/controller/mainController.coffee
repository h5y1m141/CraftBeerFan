class mainController
  constructor:() ->
  createTabGroup:() ->  
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
    return
    
  signUP:(userID,password) ->
    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    kloudService.signUP(userID,password, (result) =>
      if result.success
        user = result.users[0]
        Ti.API.info "Success!!. userid:#{user.id}"
        @createTabGroup()
      else
        Ti.API.info "Error:\n" + ((result.error and result.message) or JSON.stringify(result))    
    )
    return
    
  fbLogin:() ->
    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    kloudService.fbLogin( (userid) =>
      alert "Facebookアカウントを使ってログインが出来ました"
      @createTabGroup()
    )
    return
  isLogin:() ->
    
    currentUserId = Ti.App.Properties.getString "currentUserId"

    if currentUserId is null or typeof currentUserId is "undefined"
      win = Ti.UI.createWindow
        title:"ユーザ登録画面"
        barColor:"#f9f9f9"
        backgroundColor: "#f3f3f3"
        tabBarHidden:false
        navBarHidden:false
      
      LoginForm = require("ui/loginForm")
      loginForm = new LoginForm()
      win.add loginForm
      win.open()      
      
    else
      @createTabGroup()

    return
module.exports = mainController  