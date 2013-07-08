class favoriteWindow
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      backgroundDarkColor:"#dfdfdf"
      keyColor:"#EDAD0B"
        
    favoriteWindow = Ti.UI.createWindow
      title:"マイページ"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:false
      
    @table = Ti.UI.createTableView
      backgroundColor: @baseColor.backgroundColor
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      width:'auto'
      height:'auto'
      top:0
      left:0
      
    ShopDataDetail = require("ui/shopDataDetail")
    shopDataDetail = new ShopDataDetail()
    shopDetailTable = shopDataDetail.getTable()    
    @table.addEventListener('click',(e)=>
      if e.row.className is "shopName"
        data = e.row.data
        @__moveToSubWindow(data)
    )
    fb = require('facebook');
    fb.appid = @_getAppID()
    fb.permissions =  ['read_stream']
    fb.forceDialogAuth = true
    that = @
    @fbLoginButton = fb.createLoginButton
      top:5
      left:5
      width:100
      style : fb.BUTTON_STYLE_NORMAL
    
    fb.addEventListener('login', (e) ->
      
      token = fb.accessToken
      _Cloud = require('ti.cloud')
      
      if e.success
        if e.success

          _Cloud.SocialIntegrations.externalAccountLogin
            type: "facebook"
            token: token
          , (e) ->
            if e.success
              user = e.users[0]
              rows = []
              Ti.API.info "User  = " + JSON.stringify(user)
              Ti.App.Properties.setString "currentUserId", user.id
              
              rows.push(that._favoriteSection(user))
              that.table.setData rows
              
            else
              alert "Error: " + ((e.error and e.message) or JSON.stringify(e))
        
      else if e.error
        alert e.error
      else alert "Canceled"  if e.cancelled
    )
    fb.addEventListener('logout',(e)->
      alert 'logout'
    )
    fb.authorize()  unless fb.loggedIn
    button = Ti.UI.createButton
      title: "Facebook auth"
      top:30
      left:30
    button.addEventListener "click", (e) ->
      fb.reauthorize ["read_stream"], "me", (e) ->
        if e.success
          Ti.API.info "If successful, proceed with a publish call"
        else
          if e.error
            alert e.error
          else
            alert "Unknown result"
    button.hide()      
    
    @backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
    @backButton.addEventListener('click',(e) ->
      return favoriteWindow.close({animated:true})
    )

    favoriteWindow.leftNavButton = @backButton

    favoriteWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"マイページ"

      

    favoriteWindow.add button
    favoriteWindow.add @table
    
    if Ti.Platform.osname is 'iphone'
      favoriteWindow.setTitleControl favoriteWindowTitle

    return favoriteWindow
    
  _getAppID:() ->
    # Facebook appidを取得
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    appid = json.facebook.appid
    return appid
    

  # お気に入り情報管理

  _favoriteSection:(user) ->
    favoriteHeaderView = Ti.UI.createView
      backgroundColor:@baseColor.backgroundColor
      height:30
      
    favoriteHeaderTitle = Ti.UI.createLabel
      top:0
      left:5
      color:'#333'
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:"お気に入り"
      
    favoriteHeaderView.add favoriteHeaderTitle
    
    favoriteSection = Ti.UI.createTableViewSection
      headerView:favoriteHeaderView
      
    userID = user.id
    shopLists = []
    placeIDList = []
    # 該当するユーザのお気に入り情報を検索する
    Cloud.Reviews.query
        page: 1
        per_page: 50
        response_json_depth:5
        user:userID
      , (e) ->
        if e.success
          i = 0
          while i < e.reviews.length
            review = e.reviews[i]
            _id = review.id
            
            # custom_fieldsに、該当するお気に入りのお店に関するplace_idを
            # 格納してあるのでそのIDを利用することでお店の住所、名前を取得することができる
            placeID = review.custom_fields.place_id
            Ti.API.info "place_id is #{placeID}"
            placeIDList.push placeID    
            # whileのループカウンターを1つプラス  
            i++
            
          # end of loop

          
          # Cloud.Reviews.queryのwhileループ内で
          # Cloud.Places.queryを投げるとなぜか
          # place_idが固定されてしまうため一旦
          # place_idを配列に格納してその後に
          # お店の情報を取得するクエリー発行
          for id in placeIDList
            Ti.API.info id            
            Cloud.Places.show
              place_id:id
            ,(e) ->
              if e.success

                data =
                  name:e.places[0].name
                  shopAddress:e.places[0].address
                  phoneNumber:e.places[0].phone_number
                  latitude:e.places[0].latitude
                  longitude:e.places[0].longitude
                shopNameRow = Ti.UI.createTableViewRow
                  width:'auto'
                  height:40
                  selectedColor:'transparent'
                  className:"shopName"
                  hasChild:true
                  data:data
                  
                shopNameLabel = Ti.UI.createLabel
                  text: data.name
                  width:230
                  color:"#333"
                  left:20
                  top:10
                  font:
                    fontSize:12
                    fontFamily :'Rounded M+ 1p'
                    fontWeight:'bold'
                    
                shopNameRow.add shopNameLabel
                favoriteSection.add shopNameRow
            

          
        else
          Ti.API.info "Error:\n"
          


    return favoriteSection      

  _moveToSubWindow:(data)->
    _win = Ti.UI.createWindow
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.barColor
    
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
      latitude: data.latitude
      longitude: data.longitude
      pincolor:Titanium.Map.ANNOTATION_PURPLE
      animate: true
    
    _mapView = Titanium.Map.createView
      mapType: Titanium.Map.STANDARD_TYPE
      region: 
        latitude:data.latitude
        longitude:data.longitude
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
    _win.add shopDetailTable
    
    shopDataDetail.setData(data)
    shopDataDetail.show()

    activeTab = Ti.API._activeTab
    return activeTab.open(_win)

module.exports = favoriteWindow  