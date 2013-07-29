class loginForm
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      keyColor:"#44A5CB"
      textColor:"#333"
    @userID = ""
    @password = ""
    MainController = require("controller/mainController")
    @mainController = new MainController()

    
    loginForm  = Ti.UI.createView
      width:300
      height:400
      left:5
      top:5
      backgroundColor:@baseColor.backgroundColor
      
    userIDField = Ti.UI.createTextField
      color:@baseColor.textColor
      top:20
      left:60
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
      top:60
      left:60
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
      @password = e.value
      
    )
    craftBeerFanIconLogo = Ti.UI.createImageView
      image:"ui/image/simpleicon.png"
      width:45
      height:70
      top:20
      left:10
      
    facebookIcon = Ti.UI.createLabel
      width:48
      height:48
      backgroundColor:@baseColor.textColor
      left:10
      top:200
      textAlign:'center'
      color:@baseColor.barColor
      font:
        fontSize: 72
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe047")
      
    facebookLoginLabel = Ti.UI.createLabel
      top:200
      left:60
      width:250
      height:40
      borderWidth:1
      borderColor:@baseColor.barColor
      color:@baseColor.textColor
      font:
        fontSize:14
        fontFamily : 'Rounded M+ 1p'
      text:"Facebookアカウントを使ってログインする場合には"
      
    facebookIcon.addEventListener('click',(e) =>
      @mainController.fbLogin()
    )

    signUpBox = Ti.UI.createView
      left:60
      top:100
      backgroundColor:@baseColor.keyColor
      borderColor:@baseColor.keyColor
      width:200
      height:50
      
    signUpBox.addEventListener('click',(e) =>
      Ti.API.info "signup start userid: #{@userID} and password:#{@password}"
      @mainController.signUP(@userID,@password)
    )      
    signUpIcon = Ti.UI.createLabel
      top:5
      left:5
      width:40
      height:40
      textAlign:'center'
      backgroundColor:@baseColor.keyColor
      color:"#fff"
      font:
        fontSize:36
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe087")
      
    
    signUpLabel  = Ti.UI.createLabel
      top:10
      left:60
      width:100
      height:30
      color:@baseColor.barColor
      font:
        fontSize:16
        fontFamily : 'Rounded M+ 1p'
      text:"新規登録する"
       
    signUpBox.add signUpIcon
    signUpBox.add signUpLabel
    
    loginForm.add facebookIcon
    loginForm.add craftBeerFanIconLogo
    loginForm.add facebookLoginLabel
    loginForm.add userIDField
    loginForm.add passwordField
    loginForm.add signUpBox
    

    return loginForm
    

module.exports = loginForm  