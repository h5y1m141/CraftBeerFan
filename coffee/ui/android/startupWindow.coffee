class startupWindow
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      color:"#222"
      backgroundColor:keyColor
      
    winTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:"#333"
      font:
        fontSize:'18dip'
        fontFamily : 'Rounded M+ 1p'
      text:"CraftBeerFan"
      
    @scrollView = Titanium.UI.createScrollableView
      backgroundColor:@baseColor.backgroundColor
      height:'460dip'
      showPagingControl:true
      pagingControlHeight:'30dip'
      
    @_createView()
    
    win = Ti.UI.createWindow
      title:"CraftBeerFan"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false


    win.add @scrollView  
    return win
    
  _createView:() =>
    menuList = [
      description:"CraftBeerFanはクラフトビールが買える/飲めるお店を探すことが出来るアプリケーションです"
      screenCapture:"ui/image/logo.png"
      back:null
      next:1
    ,
      description:"現在の位置から近い所のお店を探すことができます。"
      screenCapture:"ui/image/map.png"
      back:0
      next:2
    ,
      description:"飲めるお店はタンブラーのアイコン、買えるお店はボトルのアイコンで表現してます"
      screenCapture:"ui/image/iconImage.png"
      back:1
      next:3
    ,
    
      description:"出張や旅行先でクラフトビールが飲める・買えるお店の下調べする時にはリスト機能を使うと便利です"
      screenCapture:"ui/image/list.png"
      back:2
      next:4
    ,
      description:"もしも気になるお店があったら、お気に入りに登録しておくことをオススメします"
      screenCapture:"ui/image/favorite.png"
      back:3
      next:5      
    ,
      description:"以上でアプリケーションの説明は終了です。アカウントを登録してからご利用ください。"
      next:null
      back:4
      screenCapture:null

    ]
    for menu in menuList
      view = Ti.UI.createView
        width:'600dip'
        height:'800dip'
        backgroundColor:@baseColor.backgroundColor
        top:'0dip'
        left:'0dip'
        zIndex:1
        borderRadius:'20dip'
      
      label = Ti.UI.createLabel
        top:'5dip'
        left:'5dip'
        textAlign:'left'
        color:@baseColor.color
        font:
          fontSize:'18dip'
          fontFamily:'Rounded M+ 1p'
        text:menu.description
        
      view.add label
      if menu.screenCapture isnt null      
        screenCapture = Ti.UI.createImageView
          width:'200dip'
          height:'200dip'
          top:'120dip'
          left:'100dip'
          image:Titanium.Filesystem.resourcesDirectory + menu.screenCapture
          
        view.add screenCapture
        
      else
        LoginForm = require("ui/android/loginForm")
        loginForm = new LoginForm()
        
        view.add loginForm


      @scrollView.addView view
      Ti.API.info "scrollView.addView done"
              
    return

         
module.exports = startupWindow