class mapWindow
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:keyColor
      

    @tiGeoHash = require("/lib/TiGeoHash")
    @precision = 5 # GeoHashの計算結果で得られる桁数を指定
    @geoHashResult = []
    KloudService = require("model/kloudService")
    @kloudService = new KloudService()
    @MapModule = require('ti.map')


    @currentLatitude = 35.674819
    @currentLongitude = 139.765084
      
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

    
    
    @mapView.addEventListener('click',(e) =>
      actInd = @activityIndicator
      
      if e.clicksource is "rightPane"
        actInd.show()
        Ti.API.info "placeID is #{e.annotation.placeID}"
        @kloudService.statusesQuery(e.annotation.placeID,(statuses) ->
          actInd.hide()
          Ti.API.info "statuses is #{statuses}"
          data =
            shopName:e.annotation.shopName
            phoneNumber:e.annotation.phoneNumber
            latitude: e.annotation.latitude
            longitude: e.annotation.longitude
            shopInfo: e.annotation.shopInfo
            statuses:statuses
          ShopDataDetailWindow = require("ui/android/shopDataDetailWindow")
          shopDataDetailWindow = new ShopDataDetailWindow(data)
          shopDataDetailWindow.open()
          
        )
      
      else if e.clicksource is "leftPane"
        Ti.Platform.openURL("tel:#{e.annotation.phoneNumber}")
        
      # @_showShopInfo data
      

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

    
    ActivityIndicator = require('ui/android/activitiIndicator')
    @activityIndicator = new ActivityIndicator()
    @activityIndicator.hide()
      
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
      
  
    @mapWindow.add @mapView
    @mapWindow.add @activityIndicator

    
    return @mapWindow
    
  _nearBy:(latitude,longitude) ->
    that = @
    @kloudService.placesQuery(latitude,longitude,(data) ->
      
      that.addAnnotations(data)
    )
    
  # デバイス解像度に合わせて適切なサイズのアイコンを準備する必要あるので
  # そのためのメソッド
  _selectIcon:(shopFlg,statusesUpdateFlg) ->
    
    Ti.API.info "height: #{Ti.Platform.displayCaps.platformHeight}"
    if Ti.Platform.displayCaps.platformHeight > 889
      value = "high"
    else
      value = "middle"
    
    if shopFlg is true
      imagePath = "ui/image/android/#{value}Resolution/bottle.png"
    else if shopFlg is false and statusesUpdateFlg is true
      imagePath = "ui/image/android/#{value}Resolution/tmublrWithOnTapInfo.png"
    else if shopFlg is false and statusesUpdateFlg is false
      imagePath = "ui/image/android/#{value}Resolution/tmulblr.png"
    else
      imagePath = null
      
    return imagePath
    
  addAnnotations:(array) =>

    @activityIndicator.hide()

    for data in array

      phoneBtn = Ti.UI.createButton
        color:"#3261AB"
        backgroundColor:"#f9f9f9"
        width:"30dip"
        height:"30dip"
        font:
          fontSize:'36dip'
          fontFamily:'fontawesome-webfont'
        title:String.fromCharCode("0xf095")
      informationBtn = Ti.UI.createButton
        color:"#FF5E00"
        backgroundColor:"#f9f9f9"
        width:"30dip"
        height:"30dip"
        font:
          fontSize:'36dip'
          fontFamily:'ligaturesymbols'
        title:String.fromCharCode("0xE075")
        
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
        shopName:data.shopName
        phoneNumber: data.phoneNumber
        shopAddress: data.shopAddress
        shopInfo:data.shopInfo
        shopFlg:data.shopFlg
        placeID:data.id
        title:data.shopName
        leftView:phoneBtn
        rightView:informationBtn
        image:image        
        

      @mapView.addAnnotation annotation


module.exports = mapWindow  
