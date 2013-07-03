# アプリの名前空間を設定
cbFan = {}

Cloud = require('ti.cloud')
shopDataTableView = require('ui/shopDataTableView')
ad = require('net.nend')
Config = require("model/loadConfig")

config = new Config()
nend = config.getNendData()

adView = ad.createView
  spotId:nend.spotId
  apiKey:nend.apiKey
  width:320
  height:50
  bottom: 0
  left:0

if Ti.Platform.osname is 'iphone' and Ti.Platform.displayCaps.platformHeight is 480
  cbFan.platform = 'iPhone4s'
else
  cbFan.platform = 'iPhone5'
  
adView.addEventListener('receive',(e)->
    Ti.API.info('receive')
)

adView.addEventListener('error',(e)->
    Ti.API.info('error')
)

adView.addEventListener('click',(e)->
    Ti.API.info('click')
)

subMenuTable = require("ui/subMenuTable")
shopDataDetail = require("ui/shopDataDetail")


shopDataDetail = new shopDataDetail()


cbFan.shopDataDetailTable = shopDataDetail.getTable()


baseColor =
  barColor:"#f9f9f9"
  backgroundColor:"#dfdfdf"
  keyColor:"#EDAD0B"

shopDataWindowTitle = Ti.UI.createLabel
  textAlign: 'center'
  color:'#333'
  font:
    fontSize:'18sp'
    fontFamily : 'Rounded M+ 1p'
    fontWeight:'bold'
  text:"都道府県別リスト"


cbFan.shopDataWindow = Ti.UI.createWindow
  title:"都道府県別リスト"
  barColor:baseColor.barColor
  backgroundColor: baseColor.backgroundColor
  tabBarHidden:false


mapWindowTitle = Ti.UI.createLabel
  textAlign: 'center'
  color:'#333'
  font:
    fontSize:'18sp'
    fontFamily : 'Rounded M+ 1p'
    fontWeight:'bold'
  text:"近くのお店"

cbFan.mapWindow = Ti.UI.createWindow
  title:"近くのお店"
  barColor:baseColor.barColor
  backgroundColor: baseColor.backgroundColor
  tabBarHidden:false





# 1.0から0.001の間で縮尺尺度を示している。
# 数値が大きい方が広域な地図になる。donayamaさんの書籍P.179の解説がわかりやすい

cbFan.mapView = Titanium.Map.createView
  mapType: Titanium.Map.STANDARD_TYPE
  region: 
    latitude:35.676564
    longitude:139.765076
    latitudeDelta:0.05
    longitudeDelta:0.05
  animate:true
  regionFit:true
  userLocation:true
  zIndex:0
  top:0
  left:0
  
if cbFan.platform is 'iPhone4s'
  cbFan.mapView.height = 320
else
  cbFan.mapView.height = 408


cbFan.mapView.hide()

cbFan.mapView.addEventListener('click',(e)->
  if e.clicksource is "rightButton"
    Ti.API.info "map view event fire"
    _win = Ti.UI.createWindow
      barColor:baseColor.barColor
      backgroundColor: baseColor.barColor
      
    backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
    backButton.addEventListener('click',(e) ->
      return _win.close({animated:true})
    )
    _win.leftNavButton = backButton
      
    _winTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"お店の詳細情報"
      
    if Ti.Platform.osname is 'iphone'  
      _win.setTitleControl _winTitle


    _annotation = Titanium.Map.createAnnotation
      latitude: e.annotation.latitude
      longitude: e.annotation.longitude
      pincolor:Titanium.Map.ANNOTATION_PURPLE
      animate: true
    
    _mapView = Titanium.Map.createView
      mapType: Titanium.Map.STANDARD_TYPE
      region: 
        latitude:e.annotation.latitude
        longitude:e.annotation.longitude
        latitudeDelta:0.005
        longitudeDelta:0.005
      animate:true
      regionFit:true
      userLocation:true
      zIndex:0
      top:0
      left:0
      height:200
      width:'auto'

    _mapView.addAnnotation _annotation
    _win.add _mapView

    _win.add cbFan.shopDataDetailTable

    data =
      name:e.title
      shopAddress:e.annotation.shopAddress
      phoneNumber:e.annotation.phoneNumber
      
    shopDataDetail.setData(data)
    shopDataDetail.show()
    activeTab = Ti.API._activeTab
    
    activeTab.open(_win)
  
)    
cbFan.mapView.hide()  

Ti.Geolocation.purpose = 'クラフトビールのお店情報表示のため'
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS
Ti.Geolocation.distanceFilter = 5

Ti.Geolocation.addEventListener("location", (e) ->
  Ti.API.info "latitude: #{e.coords.latitude}longitude: #{e.coords.longitude}"
  latitude = e.coords.latitude
  longitude = e.coords.longitude
  cbFan.mapView.show() # 隠していた地図を表示する
  cbFan.mapView.setLocation # 現在地まで地図をスクロールする
    latitude: latitude
    longitude: longitude
    latitudeDelta: 0.05
    longitudeDelta: 0.05

  Cloud.Places.query
    page: 1
    per_page: 20
    where:
      lnglat:
        # $nearSphere: [139.672004, 35.658839] # longitude, latitude
        $nearSphere:[longitude,latitude] 
        $maxDistance: 0.01
  , (e) ->
    if e.success
      i = 0
      while i < e.places.length
        place = e.places[i]
        tumblrImage = Titanium.UI.createImageView
          width : "26sp"
          height : "40sp"
          image : "ui/image/tumblr.png"

        annotation = Titanium.Map.createAnnotation(
          latitude: place.latitude
          longitude: place.longitude
          title: place.name
          phoneNumber: place.phone_number
          shopAddress: place.address
          subtitle: ""
          image:"ui/image/tumblrIcon.png"
          animate: false
          leftButton: ""
          rightButton: "ui/image/tumblrIcon.png"
        )

        cbFan.mapView.addAnnotation annotation
        i++
    else
      Ti.API.info "Error:\n" + ((e.error and e.message) or JSON.stringify(e))
)  

tabGroup = Ti.UI.createTabGroup
  tabsBackgroundColor:"#f9f9f9"
  # tabsBackgroundFocusedColor:baseColor.keyColor
  # tabsBackgroundImage:"ui/image/tabbar.png"
  # activeTabBackgroundImage:"ui/image/activetab.png"
  shadowImage:"ui/image/shadowimage.png"

tabGroup.addEventListener('focus',(e) ->
  tabGroup._activeTab = e.tab
  tabGroup._activeTabIndex = e.index
  if tabGroup._activeTabIndex is -1
    return

  Ti.API._activeTab = tabGroup._activeTab;
  Ti.API.info tabGroup._activeTab
  return
)

shopData = new shopDataTableView()

cbFan.shopData = shopData.getTable()

# 起動時に関東エリアを表示するための設定
categoryName = "関東"
selectedColor = "#007FB1"
selectedSubColor = "#CAE7F2"
shopData.refreshTableData(categoryName,selectedColor,selectedSubColor)

cbFan.subMenu = new subMenuTable()

cbFan.arrowImage = Ti.UI.createImageView
  width:'50sp'
  height:'50sp'
  left:150
  top:35
  borderRadius:5
  transform : Ti.UI.create2DMatrix().rotate(45)
  borderColor:"#f3f3f3"
  borderWidth:1
  zIndex:8      
  backgroundColor:"#007FB1"
cbFan.arrowImage.hide()  
cbFan.shopDataWindow.add cbFan.arrowImage
cbFan.shopDataWindow.add cbFan.shopData
cbFan.shopDataWindow.add cbFan.subMenu

cbFan.mapWindow.add cbFan.mapView
cbFan.mapWindow.add adView


# cbFan.currentViewにて現在表示してるViewの情報を取得できるようにしてる
cbFan.currentView = cbFan.subMenu

if Ti.Platform.osname is 'iphone'
  cbFan.shopDataWindow.setTitleControl shopDataWindowTitle
  cbFan.mapWindow.setTitleControl mapWindowTitle


shopDataTab = Ti.UI.createTab
  window:cbFan.shopDataWindow
  barColor:"#343434"
  icon:"ui/image/inactivelistButton.png"
  activeIcon:"ui/image/listButton.png"

mapTab = Ti.UI.createTab
  window:cbFan.mapWindow
  barColor:"#343434"
  icon:"ui/image/inactivePin.png"
  activeIcon:"ui/image/pin.png"

FacebookTab = require("ui/facebookTab")
facebookTab = new FacebookTab()
  
tabGroup.addTab mapTab      
tabGroup.addTab shopDataTab
tabGroup.addTab facebookTab

tabGroup.open()