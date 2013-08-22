class mapWindow
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor

      
    ad = require('net.nend')
    Config = require("model/loadConfig")
    config = new Config()
    nend = config.getNendData()
    
    ActivityIndicator = require('ui/activityIndicator')
    @activityIndicator = new ActivityIndicator()
    @activityIndicator.hide()
    
    adView = ad.createView
      spotId:nend.spotId
      apiKey:nend.apiKey
      width:320
      height:50
      bottom: 0
      left:0
      
    mapWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:"#333"
      font:
        fontSize:18
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
        latitudeDelta:0.025
        longitudeDelta:0.025
      animate:true
      regionFit:true
      userLocation:true
      zIndex:0
      top:0
      left:0
    # プラットフォームを判定しながらスクリーンサイズ取得して
    # iPhone4sとiPhone5とそれぞれに最適なmapViewの大きさにする
    if Ti.Platform.osname is 'iphone' and Ti.Platform.displayCaps.platformHeight is 480
      platform = 'iPhone4s'
      @mapView.height = 364
    else
      platform = 'iPhone5'
      @mapView.height = 452
    
    @mapView.addEventListener('click',(e)=>
      Ti.API.info "map view click event"
      if e.clicksource is "rightButton"
        # アカウント登録をスキップして利用する人がいるため、
        # currentUserIdの値をチェックして、存在しない場合にはお気に入り
        # を非表示にする
        currentUserId = Ti.App.Properties.getString "currentUserId"
        if typeof currentUserId is "undefined" or currentUserId is null
          favoriteButtonEnable = false
        else
          favoriteButtonEnable = true

        data =
          shopName:e.title
          shopAddress:e.annotation.shopAddress
          phoneNumber:e.annotation.phoneNumber
          latitude: e.annotation.latitude
          longitude: e.annotation.longitude
          shopInfo: e.annotation.shopInfo
          favoriteButtonEnable:favoriteButtonEnable
          
        ShopDataDetailWindow = require("ui/iphone/shopDataDetailWindow")
        shopDataDetailWindow = new ShopDataDetailWindow(data)
      
    )
        
    @mapView.addEventListener('regionchanged',(e)=>
      Ti.API.info "regionchanged fire"
      Ti.App.Analytics.trackEvent('mapWindow','regionchanged','regionchanged',1)
      @activityIndicator.show()            
      regionData = @mapView.getRegion()
      latitude = regionData.latitude
      longitude =regionData.longitude
      return @_nearBy(latitude,longitude)
      
    )
          
    refreshLabel = Ti.UI.createLabel
      backgroundColor:"transparent"
      color:"#333"
      width:28
      height:28
      font:
        fontSize: 32
        fontFamily:'LigatureSymbols'
      text:String.fromCharCode("0xe14d")
      
    refreshLabel.addEventListener('click',(e) =>
      that = @
      that.activityIndicator.show()      
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
          latitudeDelta:0.025
          longitudeDelta:0.025
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
    mapWindow.add @activityIndicator

    # init時に現在位置を取得する
    @_getGeoCurrentPosition()
    return mapWindow
    
  _nearBy:(latitude,longitude) ->
    that = @
    KloudService =require("model/kloudService")
    kloudService = new KloudService()
    kloudService.placesQuery(latitude,longitude,(data) ->
      that.addAnnotations(data)
    )
    
  _getGeoCurrentPosition:() ->
    that = @
    that.activityIndicator.show()
    Titanium.Geolocation.getCurrentPosition( (e) ->
      if e.error
        Ti.API.info e.error
        that.activityIndicator.hide()
        return
        
      latitude = e.coords.latitude
      longitude = e.coords.longitude
      
       # 現在地まで地図をスクロールする
      that.mapView.setLocation(
        latitude: latitude
        longitude: longitude
        latitudeDelta:0.025
        longitudeDelta:0.025
      )

      that._nearBy(latitude,longitude)
      
    )
    return
    
  _calculateLatLngfromPixels:(xPixels, yPixels) ->
    region = @mapView.actualRegion or @mapView.region
    widthInPixels = @mapView.rect.width
    heightInPixels = @mapView.rect.height
    
    # should invert because of the pixel reference frame
    heightDegPerPixel = -region.latitudeDelta / heightInPixels
    widthDegPerPixel = region.longitudeDelta / widthInPixels
    lat: (yPixels - heightInPixels / 2) * heightDegPerPixel + region.latitude
    lon: (xPixels - widthInPixels / 2) * widthDegPerPixel + region.longitude
    
    return
     
  addAnnotations:(array) ->
    Ti.API.info "addAnnotations start mapView is #{@mapView}"
    @activityIndicator.hide()
    for data in array

      if data.shopFlg is "true"
        annotation = Titanium.Map.createAnnotation
          latitude: data.latitude
          longitude: data.longitude
          title: data.shopName
          phoneNumber: data.phoneNumber
          shopAddress: data.shopAddress
          shopInfo:data.shopInfo
          subtitle: ""
          image:"ui/image/bottle.png"
          animate: false
          leftButton: ""
          rightButton:Titanium.UI.iPhone.SystemButton.DISCLOSURE
        @mapView.addAnnotation annotation
      else
        annotation = Titanium.Map.createAnnotation
          latitude: data.latitude
          longitude: data.longitude
          title: data.shopName
          phoneNumber: data.phoneNumber
          shopAddress: data.shopAddress
          shopInfo:data.shopInfo
          subtitle: ""
          image:"ui/image/tumblrIcon.png"
          animate: false
          leftButton: ""
          rightButton:Titanium.UI.iPhone.SystemButton.DISCLOSURE
        @mapView.addAnnotation annotation
      



module.exports = mapWindow  