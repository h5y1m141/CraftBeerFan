class mapWindow
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      keyColor:"#EDAD0B"
      
    ad = require('net.nend')
    Config = require("model/loadConfig")
    config = new Config()
    nend = config.getNendData()
    
    adView = ad.createView
      spotId:nend.spotId
      apiKey:nend.apiKey
      width:320
      height:50
      bottom: 0
      left:0
      
    mapWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"近くのお店"
    
    mapWindow = Ti.UI.createWindow
      title:"近くのお店"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false


    # 1.0から0.001の間で縮尺尺度を示している。
    # 数値が大きい方が広域な地図になる。donayamaさんの書籍P.179の解説がわかりやすい
    
    @mapView = Titanium.Map.createView
      mapType: Titanium.Map.STANDARD_TYPE
      region: 
        latitude:35.676564
        longitude:139.765076
        latitudeDelta:0.01
        longitudeDelta:0.01
      animate:true
      regionFit:true
      userLocation:true
      zIndex:0
      top:0
      left:0
      
    if Ti.Platform.osname is 'iphone' and Ti.Platform.displayCaps.platformHeight is 480
      platform = 'iPhone4s'
      @mapView.height = 364
    else
      platform = 'iPhone5'
      @mapView.height = 452
    
    @mapView.addEventListener('click',(e)=>
      Ti.API.info "map view click event"
      if e.clicksource is "rightButton"
        data =
          name:e.title
          shopAddress:e.annotation.shopAddress
          phoneNumber:e.annotation.phoneNumber
          latitude: e.annotation.latitude
          longitude: e.annotation.longitude
        # shopDataDetailWindow.update(data)
        # mainController.updateShopDataDetailWindow(data)
        ShopDataDetailWindow = require("ui/shopDataDetailWindow")
        shopDataDetailWindow = new ShopDataDetailWindow()
        shopDataDetailWindow.update(data)
        
      
    )    

      
    refreshLabel = Ti.UI.createLabel
      backgroundColor:"#f9f9f9"
      borderWidth:1
      borderColor:"#f3f3f3"
      # color:"#3261AB"
      color:"#333"
      width:28
      height:28
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe14d")
      
    refreshLabel.addEventListener('click',(e) =>
      that = @
      Titanium.Geolocation.getCurrentPosition( (e) ->
        if e.error
          Ti.API.info e.error
          return
          
        latitude = e.coords.latitude
        longitude = e.coords.longitude
        
         # 現在地まで地図をスクロールする
        that.mapView.setLocation(
          latitude: latitude
          longitude: longitude
          latitudeDelta:0.01
          longitudeDelta:0.01
        )
        that._nearBy(latitude,longitude)

      )
    )


    mapWindow.rightNavButton = refreshLabel
    
    if Ti.Platform.osname is 'iphone'  
      mapWindow.setTitleControl mapWindowTitle
    
    Ti.Geolocation.purpose = 'クラフトビールのお店情報表示のため'
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS
    Ti.Geolocation.distanceFilter = 5
    
    mapWindow.add @mapView
    mapWindow.add adView
    return mapWindow
    
  _nearBy:(latitude,longitude) ->
    that = @
    KloudService =require("model/kloudService")
    kloudService = new KloudService()
    kloudService.placesQuery(latitude,longitude,(data) ->
      that.addAnnotations(data)
    )
    
  addAnnotations:(array) ->
    Ti.API.info "addAnnotations start mapView is #{@mapView}"
    for data in array
      annotation = Titanium.Map.createAnnotation(
        latitude: data.latitude
        longitude: data.longitude
        title: data.shopName
        phoneNumber: data.phoneNumber
        shopAddress: data.shopAddress
        subtitle: ""
        image:"ui/image/tumblrIcon.png"
        animate: false
        leftButton: ""
        rightButton:Titanium.UI.iPhone.SystemButton.DISCLOSURE
      )

      @mapView.addAnnotation annotation

    return

module.exports = mapWindow  