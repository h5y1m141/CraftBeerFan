class shopAreaDataWindow
  constructor:(items) ->

    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor
    
    @shopAreaDataWindow = Ti.UI.createWindow
      title: "地域別のお店情報"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
          
    searchBar = Titanium.UI.createSearchBar
      barColor:"#f9f9f9"
      showCancel:false
      hintText:"ここに住所入力すると絞り込めます"
      
    searchBar.addEventListener("change", (e) ->
      e.value
    )  
    searchBar.addEventListener("return", (e) ->
      searchBar.blur()
    )
    searchBar.addEventListener("cancel", (e) ->
      searchBar.blur()
    )

      
    shopDataRowTable = Ti.UI.createTableView
      width:'auto'
      height:'auto'
      top:0
      left:0
      search:searchBar
      filterAttribute: "shopAddress"
      backgroundColor:@baseColor.barColor
      
    shopDataRowTable.addEventListener('click',(e) ->
      data =
        shopName:e.row.placeData.shopName
        shopAddress:e.row.placeData.shopAddress
        phoneNumber:e.row.placeData.phoneNumber
        latitude:e.row.placeData.latitude
        longitude:e.row.placeData.longitude
        
      ShopDataDetailWindow = require("ui/shopDataDetailWindow")
      shopDataDetailWindow = new ShopDataDetailWindow(data)
    )      
    @_createNavbarElement()
    shopDataRows = []
    for item in items
      shopDataRow = @_createShopDataRow(item)
      shopDataRows.push(shopDataRow)

    shopDataRowTable.startLayout()
    shopDataRowTable.setData(shopDataRows)
    shopDataRowTable.finishLayout()
    @shopAreaDataWindow.add shopDataRowTable

    # 画面に遷移する
    activeTab = Ti.API._activeTab
    return activeTab.open(@shopAreaDataWindow)
    

  _createNavbarElement:() ->
    backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
    backButton.addEventListener('click',(e) =>
      return @shopAreaDataWindow.close({animated:true})
    )

      
    @shopAreaDataWindow.leftNavButton = backButton
    shopAreaDataWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"地域別のお店情報"

    if Ti.Platform.osname is 'iphone'
      @shopAreaDataWindow.setTitleControl shopAreaDataWindowTitle
      
    return    

  _createShopDataRow:(placeData) ->
    
    if placeData.shopFlg is "true"
      iconImage = Ti.UI.createImageView
        image:"ui/image/bottle.png"
        left:5
        width:20
        height:30
        top:5      

    else
      iconImage = Ti.UI.createImageView
        image:"ui/image/tumblrIcon.png"
        left:5
        width:20
        height:30
        top:5      

      

    titleLabel = Ti.UI.createLabel
      width:240
      height:30
      top:5
      left:40
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
      left:40
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
      shopAddress:placeData.shopAddress
      className:'shopData'
      backgroundColor:@baseColor.barColor
      
    row.add titleLabel
    row.add addressLabel
    row.add iconImage

    return row

module.exports = shopAreaDataWindow    