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
      width:Ti.UI.FULL
      height:'50dip'
      bottom:'1dip'
      left:'0dip'
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
      width:Ti.UI.FULL
      height:mapViewHeight+'dip'
    
    @mapView.addEventListener('click',(e)=>
      Ti.API.info "map view click event"

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

      #　Androidの場合には1つのアプリでMapViewを複数貼り付けることが出来ないため
      # そのための対応
      mapWindow.remove @mapView
      @mapView = null
      mapWindow.close()
      ShopDataDetailWindow = require("ui/android/shopDataDetailWindow")
      shopDataDetailWindow = new ShopDataDetailWindow(data)
      shopDataDetailWindow.addEventListener('android:back',(e) ->
        return

      )
      
      return shopDataDetailWindow.open()
      
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
      width:"56dip"
      height:"56dip"
      font:
        fontSize:"32dip"
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
          image:Titanium.Filesystem.resourcesDirectory + "ui/image/bottleIcon.png"
          animate: false
          leftButton: ""
          rightButton:""
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
          image:Titanium.Filesystem.resourcesDirectory + "ui/image/tumblr.png"
          animate: false
          leftButton: ""
          rightButton:""
        @mapView.addAnnotation annotation
      



module.exports = mapWindow  