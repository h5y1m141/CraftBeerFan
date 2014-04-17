exports.move = (_tab) ->
  if isUserLogin() is false
    loginFormTitle = $.UI.create 'Label',
      text:'アカウント未登録'
      id:"logiFormTitle"
      
    description = $.UI.create 'Label',
      text:"※アカウント設定すると気になるお店を「お気に入り」として登録出来るようになります"
      id:"description"

    fbLoginBtn = createFacebookLoginBtn
    $.accountSignUpView.add fbLoginBtn
    $.userWindow.add loginFormTitle
    $.userWindow.add description
    
  else
    userInfo = createUserInfo()
    
    if Ti.Platform.name is "iPhone OS"
      style = Ti.UI.iPhone.TableViewStyle.GROUPED
    else
      style = Ti.UI.iPhone.TableViewStyle.GROUPED
      
    userInfoTable = $.UI.create 'TableView',
      
      id:"userInfoTable"
      data:userInfo

      
    return userInfoTable
    
    $.userWindow.add userInfoTable

  description = $.UI.create 'Label',
    text:"※アカウント設定すると気になるお店を「お気に入り」として登録出来るようになります"
    id:"description"
                
  return _tab.open $.userWindow


isUserLogin = () ->
  currentUserId  = Ti.App.Properties.getString "currentUserId"
  if typeof currentUserId is "undefined" or currentUserId is null
    return false
  else
    return true      

createUserInfo = () ->
  rows = []
  userName = Ti.App.Properties.getString "userName"
  loginType  = Ti.App.Properties.getString "loginType"
  currentUserId  =Ti.App.Properties.getString "currentUserId"
  return
  
    
  menuSection = Ti.UI.createTableViewSection
    headerView:menuHeaderView

  nameRow = Ti.UI.createTableViewRow
    
    backgroundColor:"#f3f3f3"
    height:60
    
    
  nameTitle = Ti.UI.createLabel
    text: "ログインID:"
    left:5
    top:5
    width:100
    height:20      
    font:
      fontSize:12
      fontWeight:'bold'
          
  nameLabel = Ti.UI.createLabel
    text: username
    width:'auto'
    height:20
    color:"#333"
    left:5
    top:25
    font:
      fontSize:16
      
  accountTypeRow = Ti.UI.createTableViewRow
    backgroundColor:"#f3f3f3"
    height:60
    
  accountTypeTitle = Ti.UI.createLabel
    width:Ti.UI.FULL
    height:20      
    left:5
    top:5      
    text: "アカウントの種類"
    font:
      fontSize:12

  accountTypeLabel = Ti.UI.createLabel
    width:Ti.UI.FULL
    height:20
    left:5
    top:25
    color:"#333"
    font:
      fontSize:16
      
  nameRow.add nameLabel
  nameRow.add nameTitle
  
  menuSection.add nameRow
  menuSection.add accountTypeRow
  rows.push menuSection
  return rows

createFacebookLoginBtn = () ->
  fb = require('facebook')
  fb.createLoginButton
    top:50
    style:fb.BUTTON_STYLE_WIDE
  fb.appid = _getAppID()
  fb.permissions =  ['read_stream']
  fb.forceDialogAuth = true

  fb.addEventListener('login', (e) =>
    that = @
    if e.success
      token = fb.accessToken
      Ti.App.Analytics.trackEvent('startupWindow','loginSuccess','loginSuccess',1)
      Cloud = require('ti.cloud')
      Cloud.SocialIntegrations.externalAccountLogin
        type: "facebook"
        token: token
      , (result) ->
        if result.success
          user = result.users[0]
          Ti.App.Properties.setBool "configurationWizard",true
          Ti.App.Properties.setString "currentUserId",user.id
          Ti.App.Properties.setString "userName",user.first_name + " "+ user.last_name
          Ti.App.Properties.setString "loginType","facebook"
          
          that.mainController.createTabGroup()

    else if e.cancelled
      alert "ログイン処理がキャンセルされました"
      # Ti.App.Analytics.trackEvent('startupWindow','loginCanceled','loginCanceled',1)        
    else if e.error
      # Ti.App.Analytics.trackEvent('startupWindow','loginError','loginError',1)
      alert "ログイン処理中にエラーが発生しました"

    else
      # Ti.App.Analytics.trackEvent('startupWindow','otherLogin','otherLogin',1)
  )
  fb.addEventListener('logout',(e)->
    # Ti.App.Analytics.trackEvent('startupWindow','logout','logout',1)
    alert 'logout'
  )        
  
_getAppID =() ->
  # Facebook appidを取得
  config = require('config.json')
  file = config.read().toString()
  json = JSON.parse(file)
  appid = json.facebook.appid
  return appid
