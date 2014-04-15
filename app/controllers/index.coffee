# 起動時に行う処理
$.index.open()

# ligature_symbolsのフォントを使ってshowBtnのアイコン
# 設定。対応する文字コードは以下を参照
# http://kudakurage.com/ligature_symbols/
$.showBtn.text = String.fromCharCode("0xe084")
$.showBtn.addEventListener 'click', (e) ->
  slide()


KloudService = require("kloudService")
kloudService = new KloudService()

# 各種イベントリスナーの設定
## 起動時に現在位置を取得して周辺のお店検索実施
Ti.Geolocation.getCurrentPosition (e) ->
  if e.success
    latitude = e.coords.latitude
    longitude = e.coords.longitude
  else  
    latitude  = 35.676564
    longitude = 139.765076

  $.mapview.region =
    latitude:latitude
    longitude:longitude
    latitudeDelta:0.025
    longitudeDelta:0.025
    
  kloudService.placesQuery latitude,longitude,(data) ->
    # Ti.API.info data
    addAnnotations data
  
## 地図上のピンをタッチした時の動作 
$.mapview.addEventListener 'click', (e) ->
  
  if e.clicksource is "rightButton"
    # checkNetworkConnection()
    kloudService.statusesQuery(e.annotation.placeID,(statuses) ->
      Ti.API.info "statuses is #{statuses}"
      shopData =
        shopName:e.annotation.shopName
        phoneNumber:e.annotation.phoneNumber
        latitude: e.annotation.latitude
        longitude: e.annotation.longitude
        shopInfo: e.annotation.shopInfo
        statuses:statuses

      shopDataDetailController = Alloy.createController('shopDataDetail')
      shopDataDetailController.move($.tabOne,shopData)
      
    )

        
  
# このコントローラー内で利用するメソッドの定義


addAnnotations = (array) ->
  for data in array
    if data.shopFlg is "true"
      imagePath = "bottle.png"
    else
      imagePath = "tmulblr.png"
      
    annotation = Alloy.Globals.Map.createAnnotation
      latitude: data.latitude
      longitude: data.longitude
      title: data.shopName
      phoneNumber: data.phoneNumber
      shopAddress: data.shopAddress
      shopInfo:data.shopInfo
      placeID:data.id      
      subtitle: ""
      image:imagePath
      animate: false
      leftButton: ""
      rightButton:Titanium.UI.iPhone.SystemButton.DISCLOSURE
      
    $.mapview.addAnnotation annotation

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
    leftPosition = 120
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
  

