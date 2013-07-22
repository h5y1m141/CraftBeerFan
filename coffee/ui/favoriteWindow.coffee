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
      selectedColor:@baseColor.backgroundColor
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      width:'auto'
      height:'auto'
      top:0
      left:0
    @table.addEventListener('click',(e) ->
      data =
        shopName:e.row.placeData.name
        shopAddress:e.row.placeData.address
        phoneNumber:e.row.placeData.phone_number
        latitude:e.row.placeData.latitude
        longitude:e.row.placeData.longitude
        
      ShopDataDetailWindow = require("ui/shopDataDetailWindow")
      new ShopDataDetailWindow(data)
    )  
    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    userID = Ti.App.Properties.getString "currentUserId"

    kloudService.reviewsQuery(userID,(items) =>
      activityIndicator.hide()
      rows = []
      for item in items
        row = @_createShopDataRow(item)
        rows.push(row)
        
      @table.setData rows  

    )
      
    ShopDataDetail = require("ui/shopDataDetail")
    shopDataDetail = new ShopDataDetail()
    shopDetailTable = shopDataDetail.getTable()    
    @table.addEventListener('click',(e)=>
      if e.row.className is "shopName"
        data = e.row.data
        ShopDataDetailWindow = require("ui/shopDataDetailWindow")
        shopDataDetailWindow = new ShopDataDetailWindow(data)        
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
      height:75
      borderWidth:0
      hasChild:true
      placeData:placeData
      className:'shopData'
      backgroundColor:@baseColor.barColor

    titleLabel = Ti.UI.createLabel
      width:200
      height:20
      top:5
      left:5
      color:'#333'
      font:
        fontSize:16
        fontWeight:'bold'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.shopName}"

    row.add titleLabel
    if placeData.content is "undefined"
      content = ""
    else
      content = placeData.content
    commentLabel = Ti.UI.createLabel
      width:200
      height:20
      top:30
      left:15
      color:'#333'
      font:
        fontSize:12
        fontFamily : 'Rounded M+ 1p'
      text:content
      
    row.add commentLabel
    
    commentBtn = Ti.UI.createButton
      top:5
      left:230
      width:40
      height:40
      content:placeData
      selected:false
      backgroundColor:@baseColor.barColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:'#ddd'
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe034")
      
    t = Titanium.UI.create2DMatrix().scale(0.5)
    
    commentView = Ti.UI.createView
      width:200
      height:400
      top:20
      left:60
      zIndex:10
      transform:t
      borderRadius:10
      borderColor:"#ccc"
      
    closeBtn = Ti.UI.createButton
      top:5
      left:230
      width:40
      height:40
      content:placeData
      selected:false
      backgroundColor:@baseColor.barColor
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:'#ddd'
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      title:String.fromCharCode("0xe10f")
    closeBtn.addEventListener('click',() ->
      commentView.hide()
          
    )   


      
    commentBtn.addEventListener('click',(e)->
      Ti.API.info "commentBtn click"
      t1 = Titanium.UI.create2DMatrix().scale(0.0)
      a = Titanium.UI.createAnimation()
      a.transform = t1
      a.duration = 400
      a.addEventListener('complete',() ->
        alert commentView
        t2 = Titanium.UI.create2DMatrix()
        commentView.animate
          transform:t2
          duration:400
              
        alert e.source.content.content
      )
    )
    row.add commentBtn
    

    leftPostion = [15, 45, 75, 105, 135]
    for i in [0..placeData.rating]
      starIcon = Ti.UI.createButton
        top:50
        left:leftPostion[i]
        width:20
        height:20
        selected:false
        backgroundColor:"#FFE600"
        backgroundImage:"NONE"
        borderWidth:0
        borderRadius:5
        color:'#fff'
        font:
          fontSize: 20
          fontFamily:'LigatureSymbols'
        title:String.fromCharCode("0xe121")
      row.add starIcon

    return row


module.exports = favoriteWindow  