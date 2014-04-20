Cloud = require('ti.cloud')
userID = null
password = null

exports.move = (_tab) ->
  Ti.API.info "isUserLogin is #{isUserLogin()}"
  if isUserLogin() is false
    fbLoginBtn = createFacebookLoginBtn()
    fbLoginBtn.left = 10
    fbLoginBtn.top = 5
    $.fbLogin.add fbLoginBtn
    
  else
    # ユーザ情報取得出来てるのでログインフォームは非表示にする
    $.loginForm.hide()
    userInfo = createUserInfo()
    
    if Ti.Platform.name is "iPhone OS"
      style = Ti.UI.iPhone.TableViewStyle.GROUPED
    else
      style = Ti.UI.iPhone.TableViewStyle.GROUPED
      
    userInfoTable = $.UI.create 'TableView',
      id:"userInfoTable"
      data:userInfo

    $.userWindow.add userInfoTable

  description = $.UI.create 'Label',
    text:"※アカウント設定すると気になるお店を「お気に入り」として登録出来るようになります"
    id:"description"
                
  return _tab.open $.userWindow

$.userIDField.addEventListener 'change',(e) ->
  userID = e.value
  
$.passwordField.addEventListener 'change',(e) ->
  if e.value.length is 20
    alert "パスワードは20文字以内にて設定してください"
  else
    password = e.value
  

    
$.loginForm.addEventListener 'click', (e) ->
  if e.index is 4
    if userID is null or password is null
      alert "メールアドレスかパスワードのいづれかが空白になってます"
    else
      Ti.API.info "#userID is #{userID} and password is #{password}"
      $.activityIndicator.show()
      Cloud.Users.create
        username:userID
        email:userID
        password:password
        password_confirmation:password
      , (result) ->
        if result.error
          Cloud.Users.login
            login:userID
            password:password
          , (loginResult) ->
            if loginResult.success
              user = loginResult.users[0]
              Ti.API.info user.id 
              Ti.App.Properties.setString "currentUserId",user.id
              Ti.App.Properties.setString "userName",userID
              Ti.App.Properties.setString "currentUserPassword",password
              Ti.App.Properties.setString "loginType","craftbeer-fan"

              $.loginForm.hide()
              $.activityIndicator.hide()
              userInfo = createUserInfo()
              
              if Ti.Platform.name is "iPhone OS"
                style = Ti.UI.iPhone.TableViewStyle.GROUPED
              else
                style = Ti.UI.iPhone.TableViewStyle.GROUPED
                
              userInfoTable = $.UI.create 'TableView',
                id:"userInfoTable"
                data:userInfo
          
              return $.userWindow.add userInfoTable
              

        

    
# private method 

isUserLogin = () ->
  currentUserId  = Ti.App.Properties.getString "currentUserId"
  Ti.API.info "currentUserId is #{currentUserId}"
  if typeof currentUserId is "undefined" or currentUserId is null
    return false
  else
    return true      

createUserInfo = () ->
  rows = []
  userName = Ti.App.Properties.getString "userName"
  loginType  = Ti.App.Properties.getString "loginType"
  currentUserId  =Ti.App.Properties.getString "currentUserId"
    
  menuSection = Ti.UI.createTableViewSection
    headerTitle :"ログインユーザ情報"

  nameRow = $.UI.create 'TableViewRow',
    classes:'row'
    
  nameTitle = $.UI.create 'Label' ,
    id:"nameTitle"
    text: "ログイン名:"
          
  nameLabel = $.UI.create 'Label' ,
    id:"nameLabel"
    text: userName
      
  loginTypeRow = $.UI.create 'TableViewRow',
    classes:"row"

  loginTypeTitle = $.UI.create 'Label',
    id:"loginTypeTitle"  
    text: "ログインアカウントの種類"


  loginTypeLabel = $.UI.create 'Label',
    id:"loginTypeLabel"  
    text:loginType

      
  nameRow.add nameLabel
  nameRow.add nameTitle
  
  loginTypeRow.add loginTypeLabel
  loginTypeRow.add loginTypeTitle
  if loginType is 'facebook'
    fbLoginBtn = createFacebookLoginBtn()
    fbLoginBtn.top = 25
    fbLoginBtn.left = 160
    loginTypeRow.add fbLoginBtn
    
  menuSection.add nameRow
  menuSection.add loginTypeRow
  rows.push menuSection
  return rows

createFacebookLoginBtn = () ->
  fb = require('facebook')
  fbLoginBtn =fb.createLoginButton
    style:fb.BUTTON_STYLE_WIDE
    
  fb.appid = "181948098632770"
  fb.permissions =  ['read_stream']
  fb.forceDialogAuth = true

  fb.addEventListener('login', (e) ->
    Ti.API.info "facebook login event fire"
    if e.success
      token = fb.accessToken
      # Ti.App.Analytics.trackEvent('startupWindow','loginSuccess','loginSuccess',1)

      Cloud.SocialIntegrations.externalAccountLogin
        type: "facebook"
        token: token
      , (result) ->
        if result.success
          Ti.API.info "result.success is #{result.success}"
          user = result.users[0]
          Ti.App.Properties.setString "currentUserId",user.id
          Ti.App.Properties.setString "userName",user.first_name + " "+ user.last_name
          Ti.App.Properties.setString "loginType","facebook"
          
    else if e.cancelled
      alert "ログイン処理がキャンセルされました"
      # Ti.App.Analytics.trackEvent('startupWindow','loginCanceled','loginCanceled',1)        
    else if e.error
      # Ti.App.Analytics.trackEvent('startupWindow','loginError','loginError',1)
      alert "ログイン処理中にエラーが発生しました"

    else
      # Ti.App.Analytics.trackEvent('startupWindow','otherLogin','otherLogin',1)
  )
  
  fb.addEventListener 'logout',(e)->
    # Ti.App.Analytics.trackEvent('startupWindow','logout','logout',1)
    # 
    Ti.App.Properties.removeProperty "userName"
    Ti.App.Properties.removeProperty "loginType"
    Ti.App.Properties.removeProperty "currentUserId"
    alert 'ログアウトしました'

  return fbLoginBtn
  
_getAppID =() ->
  # Facebook appidを取得
  config = require('config.json')
  file = config.read().toString()
  json = JSON.parse(file)
  appid = json.facebook.appid
  return appid


  
    
    
