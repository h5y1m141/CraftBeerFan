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
      barColor:@baseColor.barColor
      backgroundColor:"#ccc"
      showCancel:false
      hintText:"ここに住所入力すると絞り込めます"
      
    
      
    searchBar.addEventListener("change", (e) ->
      Ti.API.info "change event start. e.value is #{e.value}"
      e.value
    )  
    searchBar.addEventListener("return", (e) ->
      Ti.App.Analytics.trackEvent('shopAreaDataWindow','search','searchBar',1)
      searchBar.blur()
    )
    searchBar.addEventListener("focus", (e) ->
      searchBar.setShowCancel(false)

    )
    searchBar.addEventListener("cancel", (e) ->
      searchBar.blur()
    )

      
    shopDataRowTable = Ti.UI.createTableView
      width:'auto'
      height:'auto'
      top:'0dip'
      left:'0dip'
      search:searchBar
      filterAttribute: "shopAddress"
      backgroundColor:@baseColor.barColor
      
    shopDataRowTable.addEventListener('click',(e) ->
      # アカウント登録をスキップして利用する人がいるため、
      # currentUserIdの値をチェックして、存在しない場合にはお気に入り
      # を非表示にする

      currentUserId = Ti.App.Properties.getString "currentUserId"
      
      if typeof currentUserId is "undefined" or currentUserId is null
        favoriteButtonEnable = false
      else
        favoriteButtonEnable = true
        
      data =
        shopName:e.row.placeData.shopName
        shopAddress:e.row.placeData.shopAddress
        phoneNumber:e.row.placeData.phoneNumber
        latitude:e.row.placeData.latitude
        longitude:e.row.placeData.longitude
        shopInfo:e.row.placeData.shopInfo
        favoriteButtonEnable:favoriteButtonEnable
        
        
      ShopDataDetailWindow = require("ui/android/shopDataDetailWindow")
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

    
    Ti.App.Analytics.trackPageview "/window/shopAreaDataWindow"
    return @shopAreaDataWindow
    

  _createNavbarElement:() ->
    backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:'44dip'
      height:'44dip'
      
    backButton.addEventListener('click',(e) =>
      Ti.App.Analytics.trackPageview "/window/listWindow"
      return @shopAreaDataWindow.close({animated:true})
    )

      
    @shopAreaDataWindow.leftNavButton = backButton
    shopAreaDataWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18dip'
        fontFamily : 'Rounded M+ 1p'
      text:"地域別のお店情報"

    if Ti.Platform.osname is 'iphone'
      @shopAreaDataWindow.setTitleControl shopAreaDataWindowTitle
      
    return    

  _createShopDataRow:(placeData) ->
    
    if placeData.shopFlg is "true"
      iconImage = Ti.UI.createImageView
        image:Titanium.Filesystem.resourcesDirectory + "ui/image/bottle.png"
        left:'5dip'
        width:'20dip'
        height:'30dip'
        top:5      

    else
      iconImage = Ti.UI.createImageView
        image:Titanium.Filesystem.resourcesDirectory + "ui/image/tumblrIcon.png"
        left:'5dip'
        width:'20dip'
        height:'30dip'
        top:'5dip'      

      

    titleLabel = Ti.UI.createLabel
      width:'240dip'
      height:'30dip'
      top:'5dip'
      left:'40dip'
      color:'#333'
      font:
        fontSize:'18dip'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.shopName}"
      
    addressLabel = Ti.UI.createLabel
      width:'240dip'
      height:'30dip'
      top:'30dip'
      left:'40dip'
      color:'#444'
      font:
        fontSize:'14dip'
        fontFamily : 'Rounded M+ 1p'
      text:"#{placeData.shopAddress}"

    row = Ti.UI.createTableViewRow
      width:'auto'
      height:'60dip'
      borderWidth:'0dip'
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