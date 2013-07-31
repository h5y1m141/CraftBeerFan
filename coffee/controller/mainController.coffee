class mainController
  constructor:() ->
    KloudService = require("model/kloudService")
    @kloudService = new KloudService()
    
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

      
        
  _login:(callback) =>
    # 現在のログインIDを収得した上でユーザ情報取得する
    currentUserId = Ti.App.Properties.getString "currentUserId"
    userName = Ti.App.Properties.getString "userName"
    password = Ti.App.Properties.getString "currentUserPassword"
    loginType = Ti.App.Properties.getString "loginType"
    Ti.API.info "loginType is #{loginType}"
    if loginType is "facebook"
      # @kloudService.fbLogin( (result) ->
      #   return callback result
      # )
      @kloudService.fbLogin()
      
      result = {}
      result.success = true
      Ti.API.info "_login done result is #{result}"
      return callback(result)
    else
      @kloudService.cbFanLogin(userName,password, (result) ->
        if result.success
          user = result.users[0]
          Ti.App.Properties.setString "userName","#{user.username}"
          return callback result          
      )
    
module.exports = mainController  