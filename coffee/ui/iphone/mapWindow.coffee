class mapWindow
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor

        
    @tiGeoHash = require("/lib/TiGeoHash")
    @precision = 6 # GeoHashの計算結果で得られる桁数を指定
    @geoHashResult = []
    
    
    ActivityIndicator = require('ui/activityIndicator')
    @activityIndicator = new ActivityIndicator()
    @activityIndicator.hide()
    
      
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
    @MapModule = require('ti.map')    
    @mapView = @MapModule.createView
      mapType: @MapModule.NORMAL_TYPE
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
      # @mapView.height = 364
    else
      platform = 'iPhone5'
      # @mapView.height = 452
      
    @mapView.height = "100%"
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
      
      # ちょっとしたスクロールに反応してしまうため、緯度経度から
      # GeoHashの値を得て蓄積していく
      # そして、前回得たGeoHashの値から変更されていた場合に
      # お店情報を取得する

      lastGeoHashValue = @geoHashResult[@geoHashResult.length-1]
      Ti.API.info "lastGeoHashValue is #{lastGeoHashValue}"
      regionData = @mapView.getRegion()
      latitude = regionData.latitude
      longitude = regionData.longitude

      geoHashResult = @tiGeoHash.encodeGeoHash(latitude,longitude,@precision)
      Ti.API.info "Hash is #{geoHashResult.geohash}"
      Ti.API.info "#{geoHashResult.geohash} #{lastGeoHashValue}"
      
      if geoHashResult.geohash is lastGeoHashValue
        Ti.API.info "regionchanged doesn't fire"
        @geoHashResult.push(geoHashResult.geohash)
      else
        Ti.API.info "regionchanged fire"
        Ti.App.Analytics.trackEvent('mapWindow','regionchanged','regionchanged',1)
        @geoHashResult.push(geoHashResult.geohash)
        @activityIndicator.show()            
        
        @_nearBy(latitude,longitude)
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
        geoHashResult = that.tiGeoHash.encodeGeoHash(latitude,longitude,that.precision)        
        that.geoHashResult.push(geoHashResult.geohash)
        Ti.API.info "geoHashResult is :#{that.geoHashResult}"
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
    mapWindow.add @activityIndicator

    # init時に現在位置を取得する
    @_getGeoCurrentPosition()
    return mapWindow
    
  _nearBy:(latitude,longitude) ->
    that = @
    KloudService =require("model/kloudService")
    kloudService = new KloudService()
    kloudService.placesQuery(latitude,longitude,(data) ->
      Ti.API.info "data is #{data}"

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
      geoHashResult = that.tiGeoHash.encodeGeoHash(latitude,longitude,that.precision)        
      that.geoHashResult.push(geoHashResult.geohash)
      Ti.API.info "geoHashResult is :#{that.geoHashResult}"
      
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
      Ti.API.info data.shopName
      if data.shopFlg is "true"
        annotation = @MapModule.createAnnotation
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
        Ti.API.info annotation
      else
        annotation = @MapModule.createAnnotation
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
