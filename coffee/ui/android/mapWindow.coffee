class mapWindow
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor
    @LANDSCAPE = 0  
    @PORTRAIT = 1
    @displayHeight = Ti.Platform.displayCaps.platformHeight 
    @displayWidth = Ti.Platform.displayCaps.platformWidth
    if (@displayHeight > 1000)
    	@barHeight = 144
    else
    	@barHeight = 72
      
    @currentDeviceStatus = Ti.Gesture.orientation
    @mapViewHight = 0    
    @tiGeoHash = require("/lib/TiGeoHash")
    @precision = 5 # GeoHashの計算結果で得られる桁数を指定
    @geoHashResult = []
    
    @MapModule = require('ti.map')


    @currentLatitude = 35.674819
    @currentLongitude = 139.765084
    @container = Ti.UI.createView
      width:"100%"
      height:"100%"
      top:0
      left:0
      
    @mapView = @MapModule.createView
      mapType: @MapModule.NORMAL_TYPE
      region:
        latitude: 35.676564
        longitude:139.765076 
        latitudeDelta: 0.05
        longitudeDelta: 0.05
      animate: true
      userLocation:false
      top:0
      left:0
      width:"100%"
      height:"100%"
      zIndex:1

    
    
    @mapView.addEventListener('click',(e)=>

   
      # if e.clicksource is "leftPane"
      #   Titanium.Platform.openURL("tel:#{e.annotation.phoneNumber}")
      data =
        shopName:e.annotation.shopName
        imagePath:e.annotation.imagePath
        phoneNumber:e.annotation.phoneNumber
        latitude: e.annotation.latitude
        longitude: e.annotation.longitude
        shopInfo: e.annotation.shopInfo
        
      @_showShopInfo data
      

    )
    

    @mapView.addEventListener('regionchanged',(e)=>
      
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
        Ti.App.Analytics.trackEvent('@mapWindow','regionchanged','regionchanged',1)
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
        
        @mapView.setLocation(
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

    Ti.Gesture.addEventListener 'orientationchange',(e) =>
      
      if (Ti.Platform.displayCaps.platformHeight > 1080)
        @height = 144
      else
        @height = 72

      
      if @currentDeviceStatus is @PORTRAIT and e.orientation is @PORTRAIT

        @mapViewHight = Ti.Platform.displayCaps.platformHeight/2 - @height
      else if @currentDeviceStatus is @PORTRAIT and e.orientation is @LANDSCAPE        
        @mapViewHight = (Ti.Platform.displayCaps.platformHeight / 2) - (@height/2)
      else if @currentDeviceStatus is @LANDSCAPE and e.orientation is @PORTRAIT
        @mapViewHight = Ti.Platform.displayCaps.platformHeight/2 - @height
      else if @currentDeviceStatus is @LANDSCAPE and e.orientation is @LANDSCAPE
        @mapViewHight = (Ti.Platform.displayCaps.platformHeight / 2) - (@height/2)
      else
        Ti.API.info "cant' set width"
        

    
    ActivityIndicator = require('ui/android/activitiIndicator')
    @activityIndicator = new ActivityIndicator()
    @activityIndicator.hide()
    @shopInfoView = Ti.UI.createView
      width:Ti.UI.FULL
      height:@barHeight * 2
      top:@displayHeight + 30
      annotationData:null
      left:0
      backgroundColor:"#f3f3f3"
      # opacity:0.9
      zIndex:10
      visible:false
      
    @shopInfoView.addEventListener 'click',(e) =>
      @_showshopInfoDetail()

    @shopName = Ti.UI.createLabel
      color:"#333"
      font:
        fontSize:"18dp"
        weight:"bold"
      top:100
      left:50
      width:800
      height:100
      
    @icon = Ti.UI.createImageView
      top:10
      left:10
    @shopCategory = Ti.UI.createLabel
      color:"#333"
      font:
        fontSize:"14dp"
      top:10
      left:100
    @phoneNumber = Ti.UI.createLabel
      color:"#333"
      font:
        fontSize:"14dp"
      top:220
      left:50
    
    @shopInfo = Ti.UI.createLabel
      color:"#333"
      font:
        fontSize:"12dp"
      top:200
      left:50
      width:@displayWidth * 0.9
      height:40
      geo:
        latitude:0
        longitude:0
      
    @shopInfoView.add  @shopName
    @shopInfoView.add  @shopCategory    
    @shopInfoView.add  @phoneNumber
    @shopInfoView.add  @shopInfo
    @shopInfoView.add  @icon
      
    mapWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:"#333"
      font:
        fontSize:'18dp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"近くのお店"
    
    @mapWindow = Ti.UI.createWindow
      title:"近くのお店"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
      
  

    @container.add @mapView
    @mapWindow.add @container
    @mapWindow.add @activityIndicator
    @mapWindow.add @shopInfoView

    
    return @mapWindow
    
  _nearBy:(latitude,longitude) ->
    that = @
    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    kloudService.placesQuery(latitude,longitude,(data) ->
      that.addAnnotations(data)
    )
    
  _showshopInfoDetail:() ->
    # 最初にshopInfoViewの高さを画面高さいっぱいに引き伸ばした上で
    # 少しづつアニメーションさせることで下からすりあがるような状態を表現する
    
    t1 = Titanium.UI.create2DMatrix()
    animation = Titanium.UI.createAnimation()
    animationSpeed = 300
    animation.transform = t1
    animation.duration = animationSpeed
    animation.top = 0

    @shopInfoView.height = @displayHeight
    t2 = Titanium.UI.create2DMatrix()

    animation1 = Titanium.UI.createAnimation
      transform: t2
      duration: animationSpeed
      top: @displayHeight/2
      left:0


    mapView = @mapView
    latitude = @shopInfo.geo.latitude
    longitude =@shopInfo.geo.longitude
    annotationData = @shopInfo.annotationData
    that = @
    mapViewHeightafterAnimation = @displayHeight/2
    @shopInfoView.animate(animation1, () ->
      # mapView.region =
      #   latitude:latitude
      #   longitude:longitude          
      #   latitudeDelta:0.01
      #   longitudeDelta:0.01
      
      mapView.height = mapViewHeightafterAnimation
      mapView.removeAllAnnotations()
      that.addAnnotations([annotationData])
      return
    )
    
  _showShopInfo:(data) ->
    Ti.API.info "#imagePath is #{data.imagePath} and Name is #{data.shopName}"    
    if data.imagePath is "ui/image/tumblrIcon.png" or data.imagePath is "ui/image/tumblrIconForMap.png"
      @shopCategory.text = "飲めるお店"
    else
      @shopCategory.text = "買えるお店"
    t1 = Titanium.UI.create2DMatrix()
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 500
    animation.bottom = "1dp"

    return @shopInfoView.animate(animation ,() =>
      Ti.API.info "done"
      @phoneNumber.text = data.phoneNumber
      @shopInfo.text = data.shopInfo
      @shopInfo.geo.latitude = data.latitude
      @shopInfo.geo.longitude = data.longitude
      @shopInfo.annotationData = data

      @shopName.text = data.shopName
      
      @icon.setImage Ti.Filesystem.resourcesDirectory + data.imagePath
      @shopInfoView.show()      
    )      


  
  addAnnotations:(array) =>
    @activityIndicator.hide()
    for data in array
      if data.shopFlg is "true"
        annotation = @MapModule.createAnnotation
          latitude: data.latitude
          longitude: data.longitude
          shopName:data.shopName
          phoneNumber: data.phoneNumber
          shopAddress: data.shopAddress
          shopInfo:data.shopInfo
          shopFlg:data.shopFlg
          image:"ui/image/bottle@2x.png"
          imagePath:"ui/image/bottle@2x.png"


        @mapView.addAnnotation annotation
      else
        annotation = @MapModule.createAnnotation
          latitude: data.latitude
          longitude: data.longitude
          shopName:data.shopName          
          phoneNumber: data.phoneNumber
          shopAddress: data.shopAddress
          shopInfo:data.shopInfo
          shopFlg:data.shopFlg
          image:"ui/image/tumblrIconForMap.png"
          imagePath:"ui/image/tumblrIconForMap.png"

        @mapView.addAnnotation annotation


module.exports = mapWindow  
