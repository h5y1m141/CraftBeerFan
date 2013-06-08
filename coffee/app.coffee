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

mapView.addEventListener('click',(e)->

  title   = e.title
  phoneNumber   = e.annotation.phoneNumber
  shopAddress = e.annotation.shopAddress
  if e.clicksource is 'rightButton'
    annotation = e.annotation;
    shopDataWindow = Ti.UI.createWindow
      title: "詳細情報"
      barColor:"#DD9F00"
      backgroundColor: "#343434"
      
    shopData = []  
    section = Ti.UI.createTableViewSection
      headerTitle: title

    addressRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40

      
    addressLabel = Ti.UI.createLabel
      text: "#{shopAddress}"
      width:280
      left:20
      top:10
    
    phoneRow = Ti.UI.createTableViewRow
      width:'auto'
      height:40
    
    phoneLabel = Ti.UI.createLabel
      text: phoneNumber
      left:20
      top:10
      width:120

    callBtn = Ti.UI.createButton
      title:'電話する'
      width:100
      height:25
      left:150
      top:10
      
    callBtn.addEventListener('click',()->
      Ti.API.info phoneNumber
      Titanium.Platform.openURL("tel:#{phoneNumber}")
    )
    
    addressRow.add addressLabel
    phoneRow.add phoneLabel
    phoneRow.add callBtn
    
    shopData.push section  
    shopData.push addressRow
    shopData.push phoneRow

    tableView = Ti.UI.createTableView
      width:'auto'
      height:'auto'
      data:shopData  
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
    shopDataWindow.add tableView
    activeTab = Ti.API._activeTab    
    activeTab.open(shopDataWindow)
  
)    
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
          phoneNumber: place.phone_number
          shopAddress: place.address
          subtitle: ""
          pincolor: Titanium.Map.ANNOTATION_PURPLE
          animate: false
          leftButton: "images/atlanta.jpg"
          rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
        )
        # annotation.addEventListener('click',(e)->
        #   Ti.API.info "id: #{place.id} and state is #{place.name} and phone_number is #{place.phone_number}"
        # )

        mapView.addAnnotation annotation
        i++
    else
      Ti.API.info "Error:\n" + ((e.error and e.message) or JSON.stringify(e))
)  

mapWindow.add mapView
tabGroup = Ti.UI.createTabGroup()
tabGroup.addEventListener('focus',(e) ->
  tabGroup._activeTab = e.tab
  tabGroup._activeTabIndex = e.index
  if tabGroup._activeTabIndex is -1
    return

  Ti.API._activeTab = tabGroup._activeTab;
  Ti.API.info tabGroup._activeTab
  return
)
tab = Ti.UI.createTab
  window:mapWindow
  title:'探す'
  icon:"ui/image/marker.png"

tabGroup.addTab tab
tabGroup.open()


