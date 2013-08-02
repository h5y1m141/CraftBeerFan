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
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"CraftBeerFan"
      
    @scrollView = Titanium.UI.createScrollableView
      backgroundColor:@baseColor.backgroundColor
      height:460
      showPagingControl:true
      pagingControlHeight:30

    @_createView()
    
    win = Ti.UI.createWindow
      title:"CraftBeerFan"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
      
    if Ti.Platform.osname is 'iphone'
      win.setTitleControl winTitle

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
      description:"以上でアプリケーションの説明は終了です。アカウントを登録してからご利用ください。\nEnjoy!"
      next:null
      back:4
      screenCapture:null

    ]
    for menu in menuList
      view = Ti.UI.createView
        width:300
        height:400
        backgroundColor:@baseColor.backgroundColor
        top:20
        left:10
        zIndex:1
        borderRadius:10
      
      label = Ti.UI.createLabel
        textAlign:'left'
        color:@baseColor.color
        width:260
        font:
          fontSize:16
          fontFamily:'Rounded M+ 1p'
          fontWeight:'bold'
        height:70
        top:10
        left:20
        text:menu.description
      view.add label
      
      # menu.backや、menu.nextの値を、backBtn/nextBtnのイベントリスナ
      # で直接参照しようとすると、ループ完了した時の値が設定されてしまうため
      # backBtn/nextBtnのそれぞれbackIndex/nextIndexプロパティというものを
      # 作成しておき、それに値を紐付けておくことでスクロール時に前・次へのページ遷移が
      # 実現できる

      backBtn = Ti.UI.createImageView
        image:'ui/image/backButton.png'
        left:5
        top:200
        zIndex:10
        backIndex:menu.back
        
      backBtn.addEventListener('click',(e)  =>
        Ti.API.info "backIndex is #{e.source.backIndex}"
        @scrollView.scrollToView(e.source.backIndex)
           
      )  
      nextBtn =Ti.UI.createImageView
        image:'ui/image/backButton.png'
        right:5
        top:200
        zIndex:10
        nextIndex:menu.next  
        transform:Ti.UI.create2DMatrix().rotate(180)
        
      nextBtn.addEventListener('click',(e)  =>
        Ti.API.info "nextIndex is #{e.source.nextIndex}"
        @scrollView.scrollToView(e.source.nextIndex)
      )
    
      if menu.back isnt null  
        view.add backBtn
      if menu.next isnt null  
        view.add nextBtn
            
      if menu.screenCapture isnt null
        screenCapture = Ti.UI.createImageView
          width:200
          height:200
          top:120
          left:50
          image:menu.screenCapture
        view.add screenCapture
      else
        LoginForm = require("ui/loginForm")
        loginForm = new LoginForm()
        view.add loginForm

        
      @scrollView.addView view
      
    return

         
module.exports = startupWindow