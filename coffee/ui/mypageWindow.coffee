class mypageWindow
  constructor:() ->
    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      backgroundDarkColor:"#dfdfdf"
      keyColor:"#EDAD0B"
      
    mypageWindow = Ti.UI.createWindow
      title:"マイページ"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:false
      navBarHidden:true
    
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
        activeTab.open(_win)

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
              
              rows.push(that._userSection(user))
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
    # button = Ti.UI.createButton
    #   title: "Facebook auth"
    #   top:30
    #   left:30
    # button.addEventListener "click", (e) ->
    #   fb.reauthorize ["read_stream"], "me", (e) ->
    #     if e.success
    #       Ti.API.info "If successful, proceed with a publish call"
    #     else
    #       if e.error
    #         alert e.error
    #       else
    #         alert "Unknown result"
    # button.hide()      

    mypageWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"マイページ"

    # mypageWindow.add button
    mypageWindow.add @table
    
    if Ti.Platform.osname is 'iphone'
      mypageWindow.setTitleControl mypageWindowTitle

    return mypageWindow
    
  _getAppID:() ->
    # Facebook appidを取得
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    appid = json.facebook.appid
    return appid
    
  _userSection:(user) ->
    menuHeaderView = Ti.UI.createView
      backgroundColor:@baseColor.backgroundColor
      height:30
      
    menuHeaderTitle = Ti.UI.createLabel
      top:0
      left:5
      color:'#333'
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'アカウント情報'
      
    menuHeaderView.add menuHeaderTitle
    
    menuSection = Ti.UI.createTableViewSection
      headerView:menuHeaderView

    nameRow = Ti.UI.createTableViewRow
      backgroundColor:@baseColor.backgroundColor
      height:40
      className:"facebook"
      
    nameLabel = Ti.UI.createLabel
      text: "#{user.first_name}　#{user.last_name}"
      width:200
      color:"#333"
      left:120
      top:5
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    nameRow.add nameLabel
    nameRow.add @fbLoginButton
    menuSection.add nameRow
    return menuSection


  # お気に入り情報管理


module.exports =  mypageWindow