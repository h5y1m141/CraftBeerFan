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

    
    loginForm  = Ti.UI.createView
      width:240
      height:240
      top:100      
      left:30
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
    
    facebookBox = Ti.UI.createView
      left:0
      top:10
      backgroundColor:"#3B5998"
      width:220
      height:50   
      
    facebookIcon = Ti.UI.createLabel
      width:30
      height:30
      backgroundColor:"#fff"
      left:0
      top:10
      textAlign:'center'
      color:"#3B5998"
      borderColor:"#3B5998"
      font:
        fontSize:54
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe047")
      
    facebookIcon.addEventListener('click',(e) =>
      @mainController.fbLogin()
    )
    
    facebookLabel  = Ti.UI.createLabel
      top:10
      left:40
      width:160
      height:30
      color:@baseColor.barColor
      font:
        fontSize:14
        fontFamily:'Rounded M+ 1p'
      text:"Facebookアカウント利用"
      
    facebookBox.add facebookLabel  
    facebookBox.add facebookIcon

        
    signUpBox = Ti.UI.createView
      left:0
      top:100
      backgroundColor:@baseColor.keyColor
      borderColor:@baseColor.keyColor
      width:220
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
      text:String.fromCharCode("0xe029")
      
    
    signUpLabel  = Ti.UI.createLabel
      top:10
      left:40
      textAlign:'center'
      width:150
      height:30
      color:@baseColor.barColor
      font:
        fontSize:14
        fontFamily:'Rounded M+ 1p'
      text:"新規登録する"
      

    signUpBox.add signUpIcon
    signUpBox.add signUpLabel
    
    loginForm.add facebookBox
    loginForm.add signUpBox
    
    return loginForm
    

module.exports = loginForm  