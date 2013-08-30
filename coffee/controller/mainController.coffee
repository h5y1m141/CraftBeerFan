class mainController
  constructor:() ->
    KloudService = require("model/kloudService")
    @kloudService = new KloudService()
    @tabSetting =
      "iphone":
        "map":
          "icon":"ui/image/grayPin.png"
          "activeIcon":"ui/image/pin.png"
          "windowName":"mapWindow"
        ,  
        "list":
          "icon":"ui/image/listIcon.png"
          "activeIcon":"ui/image/listIconActive.png"
          "windowName":"listWindow"
        ,  
        "myPage":
          "icon":"ui/image/settingIcon.png"
          "activeIcon":"ui/image/activeSettingIcon.png"      
          "windowName":"mypageWindow"
      ,    
      "android":
        "map":
          "icon":"ui/image/grayPin@2x.png"
          "activeIcon":"ui/image/pin@2x.png"
          "windowName":"mapWindow"
        ,  
        "list":
          "icon":"ui/image/listIcon@2x.png"
          "activeIcon":"ui/image/listIconActive@2x.png"
          "windowName":"listWindow"
        ,  
        "myPage":
          "icon":"ui/image/settingIcon@2x.png"
          "activeIcon":"ui/image/activeSettingIcon@2x.png"      
          "windowName":"mypageWindow"      
      
  createTabGroup:() ->
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
    osname = Ti.Platform.osname
    Ti.API.info "osname is #{osname}"

    MapWindow = require("ui/#{osname}/mapWindow")
    mapWindow = new MapWindow()
    mapTab = Titanium.UI.createTab
      window:mapWindow
      icon:@tabSetting[osname].map.icon
      activeIcon:@tabSetting[osname].map.activeIcon
      windowName:@tabSetting[osname].map.windowName


    ListWindow = require("ui/#{osname}/listWindow")
    listWindow = new ListWindow()
    listTab = Titanium.UI.createTab
      window:listWindow
      icon:@tabSetting[osname].list.icon
      activeIcon:@tabSetting[osname].list.activeIcon
      windowName:@tabSetting[osname].list.windowName

    MypageWindow = require("ui/#{osname}/mypageWindow")
    mypageWindow = new MypageWindow()
    mypageTab = Titanium.UI.createTab
      window:mypageWindow
      icon:@tabSetting[osname].myPage.icon
      activeIcon:@tabSetting[osname].myPage.activeIcon
      windowName:@tabSetting[osname].myPage.windowName

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
        Ti.App.Properties.setBool "configurationWizard",true
        user = result.users[0]
        Ti.App.Properties.setString "currentUserId",user.id
        Ti.App.Properties.setString "userName",userID
        Ti.App.Properties.setString "currentUserPassword",password
        Ti.App.Properties.setString "loginType","craftbeer-fan"
        @createTabGroup()
      else
        alert "アカウント登録に失敗しました"
        Ti.API.info "Error:\n" + ((result.error and result.message) or JSON.stringify(result))    
    )
    return
    
  fbLogin:() ->
    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    kloudService.fbLogin( (result) =>
      Ti.API.info "kloudService fbLogin click. result is #{result}"
      if result.success
        Ti.App.Properties.setBool "configurationWizard",true
        user = result.users[0]
        Ti.App.Properties.setString "currentUserId",user.id
        Ti.App.Properties.setString "userName",user.first_name + " "+ user.last_name
        Ti.App.Properties.setString "loginType","facebook"
        @createTabGroup()
      else
        alert "Facebookアカウントでログイン失敗しました"
    )
    return
  createReview:(ratings,contents,shopName,currentUserId,callback) =>
    # review情報を取得する際には念のため最初にログインした上で
    # 該当のクエリ発行する
    that = @
    @_login( (loginResult) ->
      if loginResult.success
        that.kloudService.reviewsCreate(ratings,contents,shopName,currentUserId,(reviewResutl) ->
          callback(reviewResutl)
        )
      else
        alert "登録されているユーザ情報でサーバにログインできませんでした"
    )

  getReviewInfo:(callback) =>
    # review情報を取得する際には念のため最初にログインした上で
    # 該当のクエリ発行する
    that = @
    @_login( (result) ->
      Ti.API.info "getReviewInfo start result is #{result.success}"
      if result.success
        that.kloudService.reviewsQuery((result) ->
          callback(result)
        )
      else
        alert "登録されているユーザ情報でサーバにログインできませんでした"
    )
    return

  sendFeedBack:(contents,shopName,currentUserId,callback) ->
    @kloudService.sendFeedBack(contents,shopName,currentUserId,(result) ->
      callback(result)
    )


        
  _login:(callback) =>
    # 現在のログインIDを収得した上でユーザ情報取得する
    currentUserId = Ti.App.Properties.getString "currentUserId"
    userName = Ti.App.Properties.getString "userName"
    password = Ti.App.Properties.getString "currentUserPassword"
    loginType = Ti.App.Properties.getString "loginType"
    Ti.API.info "loginType is #{loginType}"
    if loginType is "facebook"
      @kloudService.fbLogin((result)->
        return callback(result)
      )
    else
      @kloudService.cbFanLogin(userName,password, (result) ->
        if result.success
          user = result.users[0]
          Ti.App.Properties.setString "userName","#{user.username}"
          return callback result          
      )
    
module.exports = mainController  