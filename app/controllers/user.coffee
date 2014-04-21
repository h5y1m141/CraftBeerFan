exports.move = (_tab) ->
  facebook = new Facebook($.userWindow)

  if facebook.isUserLogin() is false
    $.fbLogin.add facebook.fbLoginBtn
  else
    # ユーザ情報取得出来てるのでログインフォームは非表示にする
    $.loginForm.hide()
    facebook.createUserInfo()
                
  return _tab.open $.userWindow
  
class Facebook
  constructor: (window) ->
    @userWindow = window
    @Cloud = require('ti.cloud')
    @userID = null
    @password = null
    @fb = Alloy.Globals.Facebook
    FACEBOOK_APP_ID = Ti.App.Properties.getString('ti.facebook.appid')  
    @fb.appid = FACEBOOK_APP_ID
    @fb.permissions =  ['read_stream']
    @fb.forceDialogAuth = true
    @fb.addEventListener 'login'  , @facebookLoginHandler
    @fb.addEventListener 'logout' , @facebookLogoutHandler
    @fbLoginBtn = @createFacebookLoginBtn()
    @fbLoginBtn.left = 10
    @fbLoginBtn.top = 5
    
  isUserLogin:() ->
    currentUserId  = Ti.App.Properties.getString "currentUserId"
    Ti.API.info "currentUserId is #{currentUserId}"
    if typeof currentUserId is "undefined" or currentUserId is null
      return false
    else
      return true
      
  createUserInfo:() ->
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
      fbLoginBtn = @createFacebookLoginBtn()
      fbLoginBtn.top = 25
      fbLoginBtn.left = 160
      loginTypeRow.add fbLoginBtn
      
    menuSection.add nameRow
    menuSection.add loginTypeRow
    rows.push menuSection
      
    userInfoTable = $.UI.create 'TableView',
      id:"userInfoTable"
      data:rows
      
    return @userWindow.add userInfoTable
    

  createFacebookLoginBtn:() ->
    
    
    fbLoginBtn = @fb.createLoginButton
      style:@fb.BUTTON_STYLE_WIDE

    return fbLoginBtn

  facebookLoginHandler:(e) =>
    Ti.API.info "facebook login event fire"
    if e.success

      # Ti.App.Analytics.trackEvent('startupWindow','loginSuccess','loginSuccess',1)
      that = @
      @Cloud.SocialIntegrations.externalAccountLogin
        type: "facebook"
        token: Ti.Facebook.accessToken
      , (result) ->
        if result.success
          Ti.API.info "result.success is #{result.success}"
          user = result.users[0]
          Ti.App.Properties.setString "currentUserId",user.id
          Ti.App.Properties.setString "userName",user.first_name + " "+ user.last_name
          Ti.App.Properties.setString "loginType","facebook"
          return that.createUserInfo()
          
    else if e.cancelled
      Ti.API.info "ログイン処理がキャンセルされました"
      # Ti.App.Analytics.trackEvent('startupWindow','loginCanceled','loginCanceled',1)        
    else if e.error
      # Ti.App.Analytics.trackEvent('startupWindow','loginError','loginError',1)
      alert "ログイン処理中にエラーが発生しました"

    else
      # Ti.App.Analytics.trackEvent('startupWindow','otherLogin','otherLogin',1)

  
  facebookLogoutHandler:(e)->
    # Ti.App.Analytics.trackEvent('startupWindow','logout','logout',1)
    # 
    Ti.App.Properties.removeProperty "userName"
    Ti.App.Properties.removeProperty "loginType"
    Ti.App.Properties.removeProperty "currentUserId"
    alert 'ログアウトしました'

exports.Facebook = Facebook
