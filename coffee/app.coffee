Cloud = require('ti.cloud')

mapWindow = Ti.UI.createWindow
  title: "お店の情報"
  barColor:"#DD9F00"
  backgroundColor: "#343434"
  
mapView = Titanium.Map.createView
  mapType: Titanium.Map.STANDARD_TYPE
  region: 
    latitude:35.676564
    longitude:139.765076
    # 1.0から0.001の間で縮尺尺度を示している。
    # 数値が大きい方が広域な地図になる。donayamaさんの書籍P.179の解説がわかりやすい
    latitudeDelta:0.1
    longitudeDelta:0.1
  animate:true
  regionFit:true
  userLocation:true

mapView.hide()  

Ti.Geolocation.purpose = 'クラフトビールのお店情報表示のため'
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS
Ti.Geolocation.distanceFilter = 5

Ti.Geolocation.addEventListener("location", (e) ->
  Ti.API.info "latitude: #{e.coords.latitude}longitude: #{e.coords.longitude}"
  latitude = e.coords.latitude
  longitude = e.coords.longitude
  mapView.show() # 隠していた地図を表示する
  mapView.setLocation # 現在地まで地図をスクロールする
    latitude: latitude
    longitude: longitude
    latitudeDelta: 0.1
    longitudeDelta: 0.1

  Cloud.Places.query
    page: 1
    per_page: 20
    where:
      lnglat:
        # $nearSphere: [139.672004, 35.658839] # longitude, latitude
        $nearSphere:[longitude,latitude] 
        $maxDistance: 0.00126
  , (e) ->
    if e.success
      i = 0
      while i < e.places.length
        place = e.places[i]
        # Ti.API.info "id: " + place.id + "\n" + "name: " + place.name + "\n" + "longitude: " + place.longitude + "\n" + "latitude: " + place.latitude + "\n" + "updated_at: " + place.updated_at
        annotation = Titanium.Map.createAnnotation(
          latitude: place.latitude
          longitude: place.longitude
          title: place.name
          subtitle: ""
          pincolor: Titanium.Map.ANNOTATION_PURPLE
          animate: false
          leftButton: "images/atlanta.jpg"
          rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
        )
        Ti.API.info "id: #{place.id} name:#{place.name}"
        mapView.addAnnotation annotation
        i++
    else
      Ti.API.info "Error:\n" + ((e.error and e.message) or JSON.stringify(e))
)  

mapWindow.add mapView
tabGroup = Ti.UI.createTabGroup()
tab = Ti.UI.createTab
  window:mapWindow
  title:'探す'
  icon:"ui/image/marker.png"

tabGroup.addTab tab
tabGroup.open()


