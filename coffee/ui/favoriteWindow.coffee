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

    @_createNavbarElement()  
      
    @table = Ti.UI.createTableView
      backgroundColor: @baseColor.backgroundColor
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

    titleLabel = Ti.UI.createLabel
      width:240
      height:30
      top:5
      left:5
      color:'#333'
      font:
        fontSize:18
        fontWeight:'bold'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.shopName}"
      
    addressLabel = Ti.UI.createLabel
      width:240
      height:30
      top:30
      left:20
      color:'#444'
      font:
        fontSize:14
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.shopAddress}"

    row = Ti.UI.createTableViewRow
      width:'auto'
      height:60
      borderWidth:0
      hasChild:true
      placeData:placeData
      className:'shopData'
      backgroundColor:@baseColor.barColor
      
    row.add titleLabel
    row.add addressLabel

    return row


module.exports = favoriteWindow  