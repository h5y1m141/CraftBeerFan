class mapWindow
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor

    @tiGeoHash = require("/lib/TiGeoHash")
    @precision = 6 # GeoHashの計算結果で得られる桁数を指定
    @geoHashResult = []

    @MapModule = require('ti.map')

    @currentLatitude = 35.676564
    @currentLongitude = 139.765076 
    
    ad = require('net.nend')
    Config = require("model/loadConfig")
    config = new Config()
    nend = config.getNendData()
    
    ActivityIndicator = require('ui/android/activitiIndicator')
    @activityIndicator = new ActivityIndicator()
    @activityIndicator.hide()
    
    adView = ad.createView
      spotId:nend.spotId
      apiKey:nend.apiKey
      width:Titanium.Platform.displayCaps.platformWidth
      height:'50dip'
      bottom:'1dip'
      left:0
      zIndex:10
      
    mapWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:"#333"
      font:
        fontSize:'18dip'
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
    displayHeight = Ti.Platform.displayCaps.platformHeight
    displayHeight = displayHeight / Ti.Platform.displayCaps.logicalDensityFactor
    mapViewHeight = displayHeight-50
    Ti.API.info "displayHeight is #{displayHeight}and mapViewHeight is #{mapViewHeight}"
    @mapview = @MapModule.createView
      mapType: @MapModule.NORMAL_TYPE
      region:
        latitude: 35.676564
        longitude:139.765076 
        latitudeDelta: 0.05
        longitudeDelta: 0.05
      animate: true
      userLocation:false
      width:Ti.UI.FULL
      height:"514dip"
      zIndex:1

    @mapview.addEventListener('click',(e)=>
      Ti.API.info "mapview event fire!!"
      if e.clicksource is "title"
        favoriteButtonEnable = false
        data =
          shopName:e.title
          shopAddress:e.annotation.shopAddress
          phoneNumber:e.annotation.phoneNumber
          latitude: e.annotation.latitude
          longitude: e.annotation.longitude
          shopInfo: e.annotation.shopInfo
          favoriteButtonEnable:favoriteButtonEnable
          
        ShopDataDetailWindow = require("ui/android/shopDataDetailWindow")
        shopDataDetailWindow = new ShopDataDetailWindow(data)
        shopDataDetailWindow.open()
      
    )
    

    @mapview.addEventListener('regionchanged',(e)=>
      
      # ちょっとしたスクロールに反応してしまうため、緯度経度から
      # GeoHashの値を得て蓄積していく
      # そして、前回得たGeoHashの値から変更されていた場合に
      # お店情報を取得する

      lastGeoHashValue = @geoHashResult[@geoHashResult.length-1]
      Ti.API.info "lastGeoHashValue is #{lastGeoHashValue}"
      latitude = e.latitude
      longitude = e.longitude

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
      

  
    gpsRule = Ti.Geolocation.Android.createLocationRule(
      provider: Ti.Geolocation.PROVIDER_GPS
      accuracy: 100
      maxAge: 300000
      minAge: 10000
    )
    Ti.Geolocation.Android.addLocationRule gpsRule    
    Ti.Geolocation.addEventListener('location',(e)=>
      @activityIndicator.show()
      if e.success

        latitude = e.coords.latitude
        longitude = e.coords.longitude
        geoHashResult = @tiGeoHash.encodeGeoHash(latitude,longitude,@precision)
        @geoHashResult.push(geoHashResult.geohash)
        
        @mapview.setLocation(
          latitude: latitude
          longitude: longitude
          latitudeDelta:0.025
          longitudeDelta:0.025
        )

        @_nearBy(latitude,longitude)
        
      else
        Ti.API.info e.error
        @activityIndicator.hide()
        
    )

    mapWindow.add adView
    mapWindow.add @mapview
    mapWindow.add @activityIndicator

    return mapWindow
    
  _nearBy:(latitude,longitude) ->
    that = @
    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    kloudService.placesQuery(latitude,longitude,(data) ->
      that.addAnnotations(data)
    )
    

  addAnnotations:(array) =>
    @activityIndicator.hide()
    for data in array
      Ti.API.info "addAnnotations start latitude is #{data.latitude}"
      Ti.API.info "shopName is #{data.shopName}"      
      if data.shopFlg is "true"
        annotation = @MapModule.createAnnotation
          latitude: data.latitude
          longitude: data.longitude
          title: data.shopName
          phoneNumber: data.phoneNumber
          shopAddress: data.shopAddress
          shopInfo:data.shopInfo
          image:Titanium.Filesystem.resourcesDirectory + "ui/image/bottle@2x.png"

        @mapview.addAnnotation annotation
      else
        annotation = @MapModule.createAnnotation
          latitude: data.latitude
          longitude: data.longitude
          title: data.shopName
          phoneNumber: data.phoneNumber
          shopAddress: data.shopAddress
          shopInfo:data.shopInfo
          image:Titanium.Filesystem.resourcesDirectory + "ui/image/tumblrIconForMap.png"

        @mapview.addAnnotation annotation


module.exports = mapWindow  