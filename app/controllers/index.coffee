# 起動時に行う処理
$.index.open()
# new relic tracking
newrelic.recordMetric("TimeBetweenTaps", "UI", 500.0)
# Push Notification
Cloud = require("ti.cloud")
  
  
if Ti.Platform.name is 'iPhone OS'
  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK
else
  style = Ti.UI.ActivityIndicatorStyle.DARK  

$.activityIndicator.style = style

# ligature_symbolsのフォントを使ってshowBtnのアイコン
# 設定。対応する文字コードは以下を参照
# http://kudakurage.com/ligature_symbols/
$.userLogin.text = String.fromCharCode("0xe137")
$.searchBtn.text = String.fromCharCode("0xe129")
$.tapBtn.text = String.fromCharCode("0xe116")
$.favoriteBtn.text = String.fromCharCode("0xe030")
$.applicationBtn.text = String.fromCharCode("0xe075")
$.showBtn.text = String.fromCharCode("0xe084")
$.showBtn.addEventListener 'click', (e) ->
  slide()
  
$.tableview.addEventListener 'click', (e) ->
  slide()
  # alert "tableview e.index is #{e.index}"
  
  if e.index is 0
    userController = Alloy.createController('user')
    userController.move($.tabOne)
  else if e.index is 1
    searchController = Alloy.createController('search')
    searchController.move($.tabOne)
  else if e.index is 2
    onTapInfoController = Alloy.createController('onTapInfo')
    onTapInfoController.move($.tabOne)
  else if e.index is 3
    favoriteInfoController = Alloy.createController('favoriteInfo')
    favoriteInfoController.move($.tabOne)
  else if e.index is 4
    applicationInfoController = Alloy.createController('applicationInfo')
    applicationInfoController.move($.tabOne)
    
  else
    Ti.API.info 'no action'

KloudService = require("kloudService")
kloudService = new KloudService()

## 以下は regionchanged イベントで利用する項目
tiGeoHash = require("TiGeoHash")

# 各種イベントリスナーの設定
## 起動時に現在位置を取得して周辺のお店検索実施
Ti.Geolocation.getCurrentPosition (e) ->

  $.activityIndicator.show()
  if e.success
    latitude = e.coords.latitude
    longitude = e.coords.longitude
  else  
    latitude  = 35.676564
    longitude = 139.765076

  $.mapview.region =
    latitude:latitude
    longitude:longitude
    latitudeDelta:0.05
    longitudeDelta:0.05
    
  kloudService.placesQuery latitude,longitude,(data) ->
    $.activityIndicator.hide()
    # Ti.API.info data
    addAnnotations data
  
## 地図上のピンをタッチした時の動作 
$.mapview.addEventListener 'click', (e) ->
  if e.clicksource is "rightButton"
    shopData =  
      shopName    : e.annotation.title
      phoneNumber : e.annotation.phoneNumber
      latitude    : e.annotation.latitude
      longitude   : e.annotation.longitude
      shopInfo    : e.annotation.shopInfo
      webSite     : e.annotation.webSite
      placeID     : e.annotation.placeID
      
    shopDataDetailController = Alloy.createController('shopDataDetail')
    shopDataDetailController.move($.tabOne,shopData)



  
geoHashResult = null
lastGeoHashValue = null
precision = 6 # GeoHashの計算結果で得られる桁数を指定
## 地図スクロールでお店検索できる処理を以下にて実装
$.mapview.addEventListener 'regionchanged', (e) ->
  regionData = $.mapview.getRegion()
  latitude = regionData.latitude
  longitude = regionData.longitude
  geoHashResult = tiGeoHash.encodeGeoHash(latitude,longitude,precision)
  Ti.API.info "lastGeoHashValue:#{lastGeoHashValue} and geoHashResult:#{geoHashResult.geohash}" 
  if lastGeoHashValue is null or lastGeoHashValue is geoHashResult.geohash
    Ti.API.info "regionchanged doesn't fire"
    lastGeoHashValue = geoHashResult.geohash
  else
    Ti.API.info "regionchanged fire"
    Ti.API.info geoHashResult.geohash + " and " + lastGeoHashValue
    # Ti.App.Analytics.trackEvent('mapWindow','regionchanged','regionchanged',1)
    lastGeoHashValue = geoHashResult.geohash
    
    if Ti.Network.online is false
      alert "利用されてるスマートフォンからインターネットに接続できないためお店の情報が検索できません"
    else
      Ti.API.info "start placesQuery latitude is #{latitude}" 
      $.activityIndicator.show()
      kloudService.placesQuery latitude,longitude,(data) ->
        addAnnotations data 
        $.activityIndicator.hide()

  
# このコントローラー内で利用するメソッドの定義

addAnnotations = (array) ->
  for data in array
    moment = require("alloy/moment")
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

    if data.website is false or typeof data.website is "undefined"
      webSite = ''
    else
      webSite = data.website
    Ti.API.info "#{data.website}"  
    imagePath = selectIcon(shopFlg,statusesUpdateFlg)
      
    annotation = Alloy.Globals.Map.createAnnotation
      latitude: data.latitude
      longitude: data.longitude
      title: data.shopName
      phoneNumber: data.phoneNumber
      shopAddress: data.shopAddress
      shopInfo:data.shopInfo
      webSite:webSite
      placeID:data.id      
      subtitle: ""
      image:imagePath
      animate: false
      leftButton: ""
      rightButton:Titanium.UI.iPhone.SystemButton.DISCLOSURE
      
    $.mapview.addAnnotation annotation
    

selectIcon = (shopFlg,statusesUpdateFlg) ->
  
  if shopFlg is true
    imagePath = "bottle.png"
  else if shopFlg is false and statusesUpdateFlg is true
    imagePath = "tmublrWithOnTapInfo.png"
  else if shopFlg is false and statusesUpdateFlg is false
    imagePath = "tmulblr.png"
  else
    imagePath = null
    
  return imagePath

checkNetworkConnection =() ->
  timerId = setInterval(->
    Ti.API.info "Network Connection is #{Ti.Network.online}"
    clearInterval timerId  if Ti.Network.online is false
    return
  , 1000) 

slide = (e) ->
  # tableview = $.UI.create "TableView",
  #   classes:"sub"
  #   id:"submenu"
    
  if $.mapview.slideState is false
    leftPosition = 150
    $.mapview.slideState = true
  else
    leftPosition = 0
    $.mapview.slideState = false
    
  
  transform = Titanium.UI.create2DMatrix()
  animation = Titanium.UI.createAnimation()
  animation.left = leftPosition
  animation.transform = transform
  animation.duration = 250
  $.mapview.animate(animation)
  
  
