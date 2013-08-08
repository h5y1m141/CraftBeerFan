class loginForm
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      # keyColor:"#44A5CB"
      keyColor:"#DA5019"
      textColor:"#333"
      signUpBackgroundColor:"#4cda64"
      skipBackgroundColor:"#d8514b"
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
      hintText:"メールアドレスを入力"
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
      hintText:"パスワードを設定"
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
    @accountSignUpView = Ti.UI.createView
      width:240
      height:240
      top:0
      left:0
      transform:t
      backgroundColor:@baseColor.barColor
      zIndex:10
      
    registBtn = Ti.UI.createLabel
      width:80
      height:30
      top:100
      left:120
      borderRadius:5      
      color:@baseColor.barColor      
      backgroundColor:"#4cda64"
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
      text:"登録する"
      textAlign:'center'
      
    registBtn.addEventListener('click',(e)=>
      if @userID is "" or @password is ""
        alert "メールアドレスかパスワードが空白になってます"
      else
        Ti.API.info "signup start userid: #{@userID} and password:#{@password}"
        @mainController.signUP(@userID,@password)
    )
    cancelleBtn =  Ti.UI.createLabel
      width:80
      height:30
      left:20
      top:100
      borderRadius:5
      backgroundColor:"#d8514b"
      color:@baseColor.barColor
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
      text:'登録中止'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) =>
      # アカウント登録用のフォームを非表示にする
      t1 = Titanium.UI.create2DMatrix()
      t1 = t1.scale(0.0)
      animation = Titanium.UI.createAnimation()
      animation.transform = t1
      animation.duration = 250
      @accountSignUpView.animate(animation)
      
    )
    
    @accountSignUpView.add userIDField
    @accountSignUpView.add passwordField
    @accountSignUpView.add registBtn
    @accountSignUpView.add cancelleBtn
    loginForm.add @accountSignUpView
    
        
    
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
    signUpBox = @_createSignUPBox()
    skipBox = @_createSkipBox()
    loginForm.add fbLoginBtn
    loginForm.add signUpBox
    loginForm.add skipBox
    return loginForm
    
  _getAppID:() ->
    # Facebook appidを取得
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    appid = json.facebook.appid
    return appid
  _createSkipBox:() =>
    skipBox = Ti.UI.createView
      left:40
      top:150
      backgroundColor:@baseColor.skipBackgroundColor
      borderColor:@baseColor.skipBackgroundColor
      width:160
      height:25
      borderRadius:5
      
    skipBox.addEventListener('click',(e) =>
      Ti.App.Analytics.trackEvent('startupWindow','accountRegistSkip','accountRegistSkip',1)
      Ti.App.Properties.setBool "configurationWizard",true
      return @mainController.createTabGroup()
    )      
    skipIcon = Ti.UI.createLabel
      top:5
      left:5
      width:20
      height:20
      textAlign:'center'
      backgroundColor:@baseColor.skipBackgroundColor
      color:@baseColor.barColor
      font:
        fontSize:20
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe087")
      
    
    skipLabel  = Ti.UI.createLabel
      top:5
      left:25
      textAlign:'center'
      width:130
      height:20
      color:@baseColor.barColor
      font:
        fontSize:12
        fontFamily:'Rounded M+ 1p'
      text:"登録せずに利用"
      

    skipBox.add skipIcon
    skipBox.add skipLabel
    return skipBox
        
  _createSignUPBox:() =>
    signUpBox = Ti.UI.createView
      left:40
      top:100
      backgroundColor:@baseColor.signUpBackgroundColor
      borderColor:@baseColor.signUpBackgroundColor
      width:160
      height:25
      borderRadius:5
            
    signUpBox.addEventListener('click',(e) =>
      Ti.App.Analytics.trackEvent('startupWindow','accountRegist','accountRegist',1)
      t1 = Titanium.UI.create2DMatrix()
      t1 = t1.scale(1.0)
      animation = Titanium.UI.createAnimation()
      animation.transform = t1
      animation.duration = 250
      @accountSignUpView.animate(animation)
      

    )      
    signUpIcon = Ti.UI.createLabel
      top:5
      left:5
      width:20
      height:20
      textAlign:'center'
      backgroundColor:@baseColor.signUpBackgroundColor
      color:@baseColor.barColor
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
    return signUpBox
    
module.exports = loginForm  