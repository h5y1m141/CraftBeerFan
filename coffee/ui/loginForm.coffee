class loginForm
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      # keyColor:"#44A5CB"
      keyColor:"#DA5019"
      textColor:"#333"
    @userID = ""
    @password = ""
    MainController = require("controller/mainController")
    @mainController = new MainController()
    
    # ベースとなるViewを生成。
    loginForm  = Ti.UI.createView
      width:240
      height:240
      top:100      
      left:30
      backgroundColor:@baseColor.barColor
      zIndex:0
      
    # アカウント登録用のフィールドを準備して
    # 新規登録ボタンがタッチされた時にアニメーション表示される
    # viewにこれらフィールドを付ける
    userIDField = Ti.UI.createTextField
      color:@baseColor.textColor
      top:10
      left:10
      width:200
      height:30
      hintText:"メールアドレスを入力してください"
      font:
        fontSize:14

      keyboardType:Ti.UI.KEYBOARD_EMAIL_ADDRESS
      returnKeyType:Ti.UI.RETURNKEY_DEFAULT
      borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
      autocorrect:false
      autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE
    
    userIDField.addEventListener('change',(e) =>
      @userID = e.value
    )

    passwordField = Ti.UI.createTextField
      color:@baseColor.textColor
      top:50
      left:10
      width:200
      height:30
      hintText:"パスワードを設定してください"
      font:
        fontSize:14

      keyboardType:Ti.UI.KEYBOARD_ASCII
      returnKeyType:Ti.UI.RETURNKEY_DEFAULT
      borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
      enableReturnKey:true
      passwordMask:true
      autocorrect:false
      
    passwordField.addEventListener('change',(e) =>
      if e.value.length is 20
        alert "パスワードは20文字以内にて設定してください"
      else
        @password = e.value
      
    )
    t = Titanium.UI.create2DMatrix().scale(0.0)
    accountSignUpView = Ti.UI.createView
      width:240
      height:240
      top:0
      left:0
      transform:t
      backgroundColor:@baseColor.barColor
      zIndex:10
      
    registBtn = Ti.UI.createButton
      width:100
      height:30
      top:100
      left:60
      font:
        fontSize:14
        fontFamily:'Rounded M+ 1p'
      title:"登録する"
    registBtn.addEventListener('click',(e)=>
      Ti.API.info "signup start userid: #{@userID} and password:#{@password}"
      @mainController.signUP(@userID,@password)
    )
    accountSignUpView.add userIDField
    accountSignUpView.add passwordField
    accountSignUpView.add registBtn
    loginForm.add accountSignUpView
    
        
    signUpBox = Ti.UI.createView
      left:40
      top:100
      backgroundColor:@baseColor.keyColor
      borderColor:@baseColor.keyColor
      width:160
      height:25
      
    signUpBox.addEventListener('click',(e) ->
      t1 = Titanium.UI.create2DMatrix()
      t1 = t1.scale(1.0)
      animation = Titanium.UI.createAnimation()
      animation.transform = t1
      animation.duration = 250
      accountSignUpView.animate(animation)
      

    )      
    signUpIcon = Ti.UI.createLabel
      top:5
      left:5
      width:20
      height:20
      textAlign:'center'
      backgroundColor:@baseColor.keyColor
      color:"#fff"
      font:
        fontSize:20
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe029")
      
    
    signUpLabel  = Ti.UI.createLabel
      top:5
      left:25
      textAlign:'center'
      width:130
      height:20
      color:@baseColor.barColor
      font:
        fontSize:14
        fontFamily:'Rounded M+ 1p'
      text:"新規登録する"
      

    signUpBox.add signUpIcon
    signUpBox.add signUpLabel
    
    fb = require('facebook')
    fbLoginBtn = fb.createLoginButton
      top:50
      style:fb.BUTTON_STYLE_WIDE

    fb.appid = @_getAppID()
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
        Ti.App.Analytics.trackEvent('startupWindow','loginCanceled','loginCanceled',1)        
      else if e.error
        Ti.App.Analytics.trackEvent('startupWindow','loginError','loginError',1)
        alert "ログイン処理中にエラーが発生しました"

      else
        Ti.App.Analytics.trackEvent('startupWindow','otherLogin','otherLogin',1)
    )
    fb.addEventListener('logout',(e)->
      Ti.App.Analytics.trackEvent('startupWindow','logout','logout',1)
      alert 'logout'
    )

    loginForm.add fbLoginBtn
    loginForm.add signUpBox
    
    return loginForm
    
  _getAppID:() ->
    # Facebook appidを取得
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    appid = json.facebook.appid
    return appid

module.exports = loginForm  