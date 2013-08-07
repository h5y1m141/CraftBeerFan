class favoriteWindow
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor
    
        
    @favoriteWindow = Ti.UI.createWindow
      title:"お気に入り"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:false
      navBarHidden:false
      
    ActivityIndicator = require("ui/activityIndicator")
    activityIndicator = new ActivityIndicator()
    @favoriteWindow.add activityIndicator
    activityIndicator.show()
    @_createNavbarElement()  
      
    @table = Ti.UI.createTableView
      backgroundColor: @baseColor.backgroundColor
      selectedBackgroundColor:@baseColor.backgroundColor
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      width:'auto'
      height:'auto'
      top:0
      left:0
      
    @table.addEventListener('click',(e) ->

      data =
        shopName:e.row.placeData.shopName
        shopAddress:e.row.placeData.shopAddress
        phoneNumber:e.row.placeData.phoneNumber
        latitude:e.row.placeData.latitude
        longitude:e.row.placeData.longitude
        favoriteButtonEnable:false

      ShopDataDetailWindow = require("ui/shopDataDetailWindow")
      new ShopDataDetailWindow(data)

    )  
    MainController = require("controller/mainController")
    mainController = new MainController()
    mainController.getReviewInfo( (items) =>
      activityIndicator.hide()
      rows = []
      if items.length is 0
        row = Ti.UI.createTableViewRow
          width:'auto'
          height:60
          borderWidth:0
          backgroundColor:@baseColor.barColor
          selectedBackgroundColor:@baseColor.backgroundColor
          color:"#333"
        titleLabel = Ti.UI.createLabel
          width:'auto'
          height:'auto'
          top:10
          left:10
          color:'#333'
          font:
            fontSize:16
            fontWeight:'bold'
            fontFamily : 'Rounded M+ 1p'
          text:'登録されたお店がありません'            

        row.add titleLabel
        rows.push row

      else  
        
        for item in items
          row = @_createShopDataRow(item)
          rows.push(row)
        
      @table.setData rows  

    )
      


    @favoriteWindow.add @table
    
    # 詳細情報の画面に遷移する
    activeTab = Ti.API._activeTab
    return activeTab.open(@favoriteWindow)
    
  _createNavbarElement:() ->
    backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
    backButton.addEventListener('click',(e) =>
      return @favoriteWindow.close({animated:true})
    )
    
    @favoriteWindow.leftNavButton = backButton
      
    favoriteWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"お気に入り"
      
    if Ti.Platform.osname is 'iphone'  
      @favoriteWindow.setTitleControl favoriteWindowTitle
      
    return
    
  _createShopDataRow:(placeData) ->
    
    row = Ti.UI.createTableViewRow
      width:'auto'
      height:60
      borderWidth:0
      placeData:placeData
      className:'shopData'
      backgroundColor:@baseColor.barColor
      selectedBackgroundColor:@baseColor.backgroundColor

    titleLabel = Ti.UI.createLabel
      width:200
      height:20
      top:10
      left:50
      color:'#333'
      font:
        fontSize:16
        fontWeight:'bold'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.shopName}"

    row.add titleLabel
    moveNextWindowBtn = Ti.UI.createButton
      top:10
      right:5
      width:40
      height:40
      content:placeData
      selected:false
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:20
      color:'#bbb'
      font:
        fontSize: 24
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe112")
      
    row.add moveNextWindowBtn
    leftPostion = [50, 75, 100, 125, 150]
    for i in [0..placeData.rating]
      starIcon = Ti.UI.createButton
        top:30
        left:leftPostion[i]
        width:20
        height:20
        selected:false
        backgroundColor:@baseColor.barColor
        backgroundImage:"NONE"
        borderWidth:0
        borderRadius:5
        color:"#FFEE55"
        font:
          fontSize: 20
          fontFamily:'LigatureSymbols'
        title:String.fromCharCode("0xe121")
      row.add starIcon

    if typeof placeData.content is "undefined" or placeData.content is null
      content = ""
    else
      commentView = @_createCommentView(placeData)
      @favoriteWindow.add commentView
      memoBtn = Ti.UI.createButton
        top:5
        left:5
        width:40
        height:40
        content:placeData
        selected:false
        backgroundImage:"NONE"
        borderWidth:0
        borderRadius:0
        color:'#ccc'
        backgroundColor:@baseColor.barColor
        font:
          fontSize:28
          fontFamily:'LigatureSymbols'
        title:String.fromCharCode("0xe097")
        
      memoBtn.addEventListener('click',(e)=>
        # tableViewは奥の方に下がったように見せたいので少しだけアニメーション
        # させる
        @table.opacity = 0.5
        @table.touchEnabled = false
        t  = Titanium.UI.create2DMatrix().scale(0.6)
        animationForTableView = Titanium.UI.createAnimation()
        animationForTableView.transform = t
        animationForTableView.duration = 250
        @table.animate(animationForTableView)
        
        t1 = Titanium.UI.create2DMatrix()
        t1 = t1.scale(1.0)
        animation = Titanium.UI.createAnimation()
        animation.transform = t1
        animation.duration = 250
        commentView.animate(animation)

      )        
      
      row.add memoBtn


    return row

  _createCommentView:(placeData)->
    content = placeData.content
    t = Titanium.UI.create2DMatrix().scale(0.0)
    
    commentView = Titanium.UI.createScrollView
      width:240
      height:240
      top:20
      left:40
      zIndex:10
      contentWidth:'auto'
      contentHeight:'auto'
      showVerticalScrollIndicator:true
      showHorizontalScrollIndicator:true        
      transform:t
      backgroundColor:@baseColor.barColor
      borderRadius:10
      borderColor:"#ccc"
  
      
    closeBtn = Ti.UI.createButton
      top:5
      right:5
      width:40
      height:40
      content:placeData
      selected:false
      backgroundColor:@baseColor.barColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:'#ccc'
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe10f")
      
    closeBtn.addEventListener('click',(e) =>
      # tableViewのレイアウトをもとに戻す
      @table.opacity = 1.0
      @table.touchEnabled = true
      t  = Titanium.UI.create2DMatrix().scale(1.0)
      animationForTableView = Titanium.UI.createAnimation()
      animationForTableView.transform = t
      animationForTableView.duration = 250
      @table.animate(animationForTableView)
      
      t2 = Titanium.UI.create2DMatrix()
      t2 = t2.scale(0.0)
      animation = Titanium.UI.createAnimation()
      animation.transform = t2
      animation.duration = 250
      commentView.animate(animation)
          
    )
    commentLabel = Ti.UI.createLabel
      font:
        fontSize:16
        fontFamily:'Rounded M+ 1p'
        fontWeight:'bold'
      text:content
      width:'auto'
      top:50
      left:5
      
    commentView.add commentLabel
    commentView.add closeBtn
    return commentView
module.exports = favoriteWindow  