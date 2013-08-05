class shopDataDetailWindow
  constructor:(data)->
    # 引数に渡されるdataの構造は以下のとおり
    # favoriteButtonEnableは、お気に入り登録するボタンを表示するか
    # どうか決める
    # data =
    #   name:"お店の名前"
    #   shopAddress:"お店の住所"
    #   phoneNumber:"お店の電話番号"
    #   latitude:
    #   longitude:
    #   favoriteButtonEnable:true/false
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor

      
    @shopDataDetailWindow = Ti.UI.createWindow
      title:"近くのお店"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
      
    @_createNavbarElement()
    @_createMapView(data)

    ShopDataDetail = require("ui/shopDataDetail")

    shopDataDetail = new ShopDataDetail(data)
    shopDataTable = shopDataDetail.getTable()
    @shopDataDetailWindow.add shopDataTable
    

    # 詳細情報の画面に遷移する
    activeTab = Ti.API._activeTab
    return activeTab.open(@shopDataDetailWindow)
    
  _createNavbarElement:() ->
    backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
    backButton.addEventListener('click',(e) =>
      return @shopDataDetailWindow.close({animated:true})
    )
    
    @shopDataDetailWindow.leftNavButton = backButton
      
    shopDataDetailWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"お店の詳細情報"
      
    if Ti.Platform.osname is 'iphone'  
      @shopDataDetailWindow.setTitleControl shopDataDetailWindowTitle
      
    return
  _createMapView:(data) ->
    mapView = Titanium.Map.createView
      mapType: Titanium.Map.STANDARD_TYPE
      region: 
        latitude:data.latitude
        longitude:data.longitude
        latitudeDelta:0.005
        longitudeDelta:0.005
      animate:true
      regionFit:true
      userLocation:true
      zIndex:0
      top:0
      left:0
      height:200
      width:'auto'

    annotation = Titanium.Map.createAnnotation
      pincolor:Titanium.Map.ANNOTATION_PURPLE
      animate: false
      latitude:data.latitude
      longitude:data.longitude

    mapView.addAnnotation annotation
    return @shopDataDetailWindow.add mapView

module.exports = shopDataDetailWindow  