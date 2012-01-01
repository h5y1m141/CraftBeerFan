class shopDataDetailWindow
  constructor:()->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      keyColor:"#EDAD0B"
      
    @shopDataDetailWindow = Ti.UI.createWindow
      title:"近くのお店"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
      
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
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"お店の詳細情報"
      
    if Ti.Platform.osname is 'iphone'  
      @shopDataDetailWindow.setTitleControl shopDataDetailWindowTitle


    @annotation = Titanium.Map.createAnnotation
      pincolor:Titanium.Map.ANNOTATION_PURPLE
      animate: true
    
    @mapView = Titanium.Map.createView
      mapType: Titanium.Map.STANDARD_TYPE
      region: 
        latitude:35.676564
        longitude:139.765076
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

    @mapView.addAnnotation @annotation
    @shopDataDetailWindow.add @mapView
    @mapView.hide()
    
    return
    
  update:(data)->
    # 引数に渡されるdataの構造は以下のとおり
    # data =
    #   name:"お店の名前"
    #   shopAddress:"お店の住所"
    #   phoneNumber:"お店の電話番号"
    #   latitude:
    #   longitude:

    # お店の詳細情報のTableViewを準備   
    ShopDataDetail = require("ui/shopDataDetail")
    shopDataDetail = new ShopDataDetail()
    shopDataDetail.setData(data)
    shopDataTable = shopDataDetail.getTable()
    @shopDataDetailWindow.add shopDataTable
    
    # お店の位置情報を示すためにMapViewの情報更新する
    @annotation.latitude =data.latitude
    @annotation.longitude = data.longitude
    @mapView.latitude =data.latitude
    @mapView.longitude = data.longitude
    @mapView.show()
    @shopDataDetailWindow.add @mapView
    
    # 詳細情報の画面に遷移する
    activeTab = Ti.API._activeTab
    return activeTab.open(@shopDataDetailWindow)
    

module.exports = shopDataDetailWindow  