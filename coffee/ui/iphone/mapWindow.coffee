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
    KloudService =require("model/kloudService")
    @kloudService = new KloudService()
    
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
        latitudeDelta:1
        longitudeDelta:1  
      animate:true
      regionFit:true
      userLocation:true
      zIndex:0
      top:0
      left:0
      width:"100%"
      height:"100%"
    @mapView.addEventListener('click',(e)=>
      if e.clicksource is 'rightButton'
        @kloudService.statusesQuery(e.annotation.placeID,(statuses) ->
          data =
            shopName:e.annotation.shopName
            phoneNumber:e.annotation.phoneNumber
            latitude: e.annotation.latitude
            longitude: e.annotation.longitude
            shopInfo: e.annotation.shopInfo
            statuses:statuses
            
          ShopDataDetailWindow = require("ui/iphone/shopDataDetailWindow")
          new ShopDataDetailWindow(data)
          # shopDataDetailWindow = new ShopDataDetailWindow(data)
          
          # shopDataDetailWindow.open()
        )
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
          latitudeDelta:0.5
          longitudeDelta:0.5
        )
        that._nearBy(latitude,longitude)

      )
    )


    
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
    if Ti.Network.online is false
      alert "利用されてるスマートフォンからインターネットに接続できないためお店の情報が検索できません"
    else    

      @kloudService.placesQuery(latitude,longitude,(data) =>
        Ti.API.info "data is #{data}"

        @addAnnotations(data)
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
        latitudeDelta:0.05
        longitudeDelta:0.05
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
    
  _selectIcon:(shopFlg,statusesUpdateFlg) ->
    
    if shopFlg is true
      imagePath = "ui/image/bottle.png"
    else if shopFlg is false and statusesUpdateFlg is true
      imagePath = "ui/image/tmublrWithOnTapInfo.png"
    else if shopFlg is false and statusesUpdateFlg is false
      imagePath = "ui/image/tmulblr.png"
    else
      imagePath = null
      
    return imagePath

  addAnnotations:(array) ->
    Ti.API.info "addAnnotations start mapView is #{@mapView}"
    @activityIndicator.hide()
    for data in array
      Ti.API.info data.shopName
      moment = require("lib/moment.min")
      currentTime = moment()
      if data.statusesUpdate is false or typeof data.statusesUpdate is "undefined"
        statusesUpdateFlg = false
      else if currentTime.diff(data.statusesUpdate) < 80000
        statusesUpdateFlg = false
      else  
        statusesUpdateFlg = true
        
      if data.shopFlg is "false"
        shopFlg = false
      else
        shopFlg = true
        
      image = @_selectIcon(shopFlg,statusesUpdateFlg)
      annotation = @MapModule.createAnnotation
        latitude: data.latitude
        longitude: data.longitude
        shopName: data.shopName
        title:data.shopName
        phoneNumber: data.phoneNumber
        shopAddress: data.shopAddress
        shopInfo:data.shopInfo
        shopFlg:data.shopFlg
        placeID:data.id        
        subtitle: ""
        image:image
        leftButton: ""
        rightButton:Titanium.UI.iPhone.SystemButton.DISCLOSURE
      @mapView.addAnnotation annotation
      Ti.API.info annotation

      @mapView.addAnnotation annotation
      



module.exports = mapWindow  
