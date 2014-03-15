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
    @shopInfoView = Ti.UI.createView
      width:Ti.UI.FULL
      height:"20%"
      bottom:-30
      left:0
      backgroundColor:"#f3f3f3"
      opacity:0.9
      zIndex:10
      visible:false
      
    @shopInfoView.addEventListener 'click',(e) =>
      t1 = Titanium.UI.create2DMatrix()
      animation = Titanium.UI.createAnimation()
      animation.transform = t1
      animation.duration = 400
      animation.height = "50%"
      @shopInfoView.animate(animation,() =>
        Ti.API.info "done"
      )
      t2 = Titanium.UI.create2DMatrix()
      animation1 = Titanium.UI.createAnimation()
      animation1.transform = t2
      animation1.duration = 500
      animation1.height = "50%"
      
      @mapView.animate(animation1,() ->
        Ti.API.info "done"
      )
      
      # @shopInfoView.height = "50%"
      # @mapView.height      = "50%"
      
      # if e.source.visible is true
      #   @_changeStatusShopInfoView("hide")
      # else
      #   @_changeStatusShopInfoView("show")      

        
    @shopName = Ti.UI.createLabel
      color:"#333"
      font:
        fontSize:18
        weight:"bold"
      top:5
      left:50
      width:"80%"
      height:20
      
    @icon = Ti.UI.createImageView
      top:10
      left:10
    @shopCategory = Ti.UI.createLabel
      color:"#333"
      font:
        fontSize:14
      top:30
      left:50      
    @phoneNumber = Ti.UI.createLabel
      color:"#333"
      font:
        fontSize:14
      top:30
      left:200
    
    @shopInfo = Ti.UI.createLabel
      color:"#333"
      font:
        fontSize:12
      top:55
      left:10
      width:"90%"
      height:30
      
    @shopInfoView.add  @shopName
    @shopInfoView.add  @shopCategory    
    @shopInfoView.add  @phoneNumber
    @shopInfoView.add  @shopInfo
    @shopInfoView.add  @icon
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
      Ti.API.info "mapView event fire e.annotation.imagePath is #{e.annotation.imagePath} and title is #{e.title}"
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
    mapWindow.add @shopInfoView

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
    
  _showShopInfo:(data) ->
    Ti.API.info "#imagePath is #{data.imagePath} and Name is #{data.shopName}"    
    if data.imagePath is "ui/image/tumblrIcon.png"
      @shopCategory.text = "飲めるお店"
    else
      @shopCategory.text = "買えるお店"
    @phoneNumber.text = data.phoneNumber
    @shopInfo.text = data.shopInfo
    @shopName.text = data.shopName
    @icon.setImage data.imagePath
    t1 = Titanium.UI.create2DMatrix()
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 1000
    animation.bottom = 30

    return @shopInfoView.animate(animation ,() =>
      @shopInfoView.show()
    )  
    # return @shopInfoView.show()
  _changeStatusShopInfoView:(status) ->
    if status is "hide"
      t1 = Titanium.UI.create2DMatrix()
      animation = Titanium.UI.createAnimation()
      animation.transform = t1
      animation.duration = 500
      animation.bottom = 30

      return @shopInfoView.animate(animation ,() =>
        @shopInfoView.show()
      )        
    else
      t1 = Titanium.UI.create2DMatrix()
      animation = Titanium.UI.createAnimation()
      animation.transform = t1
      animation.duration = 500
      animation.bottom = -30

      return @shopInfoView.animate(animation ,() =>
        @shopInfoView.hide()
      )            
  addAnnotations:(array) ->
    Ti.API.info "addAnnotations start mapView is #{@mapView}"
    @activityIndicator.hide()
    for data in array
      Ti.API.info data.shopName
      if data.shopFlg is "true"
        annotation = @MapModule.createAnnotation
          latitude: data.latitude
          longitude: data.longitude
          shopName: data.shopName
          title:data.shopName
          phoneNumber: data.phoneNumber
          shopAddress: data.shopAddress
          shopInfo:data.shopInfo
          subtitle: ""
          imagePath:"ui/image/bottle.png"
          animate: false
          leftButton: ""
          rightButton:Titanium.UI.iPhone.SystemButton.DISCLOSURE
        @mapView.addAnnotation annotation
        Ti.API.info annotation
      else
        annotation = @MapModule.createAnnotation
          latitude: data.latitude
          longitude: data.longitude
          shopName: data.shopName
          title:data.shopName          
          phoneNumber: data.phoneNumber
          shopAddress: data.shopAddress
          shopInfo:data.shopInfo
          subtitle: ""
          imagePath:"ui/image/tumblrIcon.png"
          animate: false
          leftButton: ""
          rightButton:Titanium.UI.iPhone.SystemButton.DISCLOSURE
        @mapView.addAnnotation annotation
      



module.exports = mapWindow  
