class mapWindow
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor

    @MapModule = require('ti.map')
    
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
      height:"542dip"
      zIndex:1

    

    @mapview.addEventListener('regionchanged',(e)=>
      # ちょっとしたスクロールに反応してしまうため、以下URLを参考に
      # 一定時間経過してないとイベント発火しないような処理にする
      # http://developer.appcelerator.com/question/129061/mapview-markers-display-on-regionchanged
      that = @
      # alert @activityIndicator
      that.activityIndicator.show()           
      clearTimeout updateMapTimeout  if updateMapTimeout
      updateMapTimeout = setTimeout(->
        Ti.API.info "regionchanged fire that is #{that}"
        Ti.App.Analytics.trackEvent('mapWindow','regionchanged','regionchanged',1)
        latitude = e.latitude
        longitude = e.longitude
        Ti.API.info "latitude is #{latitude} and longitude is #{longitude}"
        return that._nearBy(latitude,longitude)

      , 1000)
    )
    
    pPassive = Ti.Geolocation.Android.createLocationProvider(
      name: Ti.Geolocation.PROVIDER_PASSIVE
      minUpdateDistance: 0.0
      minUpdateTime: 0
    )
    pNetwork = Ti.Geolocation.Android.createLocationProvider(
      name: Ti.Geolocation.PROVIDER_NETWORK
      minUpdateDistance: 0.0
      minUpdateTime: 0
    )
    pGps = Ti.Geolocation.Android.createLocationProvider(
      name: Ti.Geolocation.PROVIDER_GPS
      minUpdateDistance: 0.0
      minUpdateTime: 0
    )
    Ti.Geolocation.Android.removeLocationProvider pPassive
    Ti.Geolocation.Android.addLocationProvider pNetwork
    Ti.Geolocation.Android.addLocationProvider pGps
    Ti.Geolocation.Android.manualMode = true    
    # Ti.Geolocation.addEventListener('location',(e)=>
    #   @activityIndicator.show()
    #   if e.success

    #     latitude = e.coords.latitude
    #     longitude = e.coords.longitude
    #     @mapview.setLocation(
    #       latitude: latitude
    #       longitude: longitude
    #       latitudeDelta:0.025
    #       longitudeDelta:0.025
    #     )
    #     Ti.API.info "location event fire .latitude is #{latitude}and #{longitude}"
    #     @_nearBy(latitude,longitude)
        
    #   else
    #     Ti.API.info e.error
    #     @activityIndicator.hide()
        
    # )

    mapWindow.add adView
    mapWindow.add @mapview
    mapWindow.add @activityIndicator

    # init時に現在位置を取得する
    # @_getGeoCurrentPosition()
    return mapWindow
    
  _nearBy:(latitude,longitude) ->
    that = @
    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    kloudService.placesQuery(latitude,longitude,(data) ->
      that.addAnnotations(data)
    )
    
  _getGeoCurrentPosition:() ->
    that = @
    that.activityIndicator.show()
    Titanium.Geolocation.addEventListener('location',(e)->
      if e.error
        Ti.API.info e.error
        that.activityIndicator.hide()
        return
        
      latitude = e.coords.latitude
      longitude = e.coords.longitude
      that.mapview.setLocation(
        latitude: latitude
        longitude: longitude
        latitudeDelta:0.025
        longitudeDelta:0.025
      )

      that._nearBy(latitude,longitude)
        
    )

    return
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