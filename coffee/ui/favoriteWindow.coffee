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

      
    @table.addEventListener('click',(e)  ->
      if typeof e.row.placeData isnt "undefined"
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
      height:'auto'
      borderWidth:0
      placeData:placeData
      className:'shopData'
      backgroundColor:@baseColor.barColor
      selectedBackgroundColor:@baseColor.backgroundColor
      hasChild:true

    titleLabel = Ti.UI.createLabel
      width:200
      height:20
      top:10
      left:10
      color:'#000'
      font:
        fontSize:16
        fontWeight:'bold'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.shopName}"

    row.add titleLabel
    
    if typeof placeData.content is "undefined" or placeData.content is null
      content = ""
    else
      content = placeData.content
      
    contentLabel = Ti.UI.createLabel
      width:200
      height:'auto'
      top:40
      left:30
      color:'#333'
      font:
        fontSize:12
        fontWeight:'bold'
        fontFamily : 'Rounded M+ 1p'
      text:"#{content}"
      
    row.add contentLabel

    return row


module.exports = favoriteWindow  