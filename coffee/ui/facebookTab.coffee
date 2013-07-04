class facebookTab
  constructor:() ->
    baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#dfdfdf"
      keyColor:"#EDAD0B"
    
    @table = Ti.UI.createTableView
      backgroundColor: baseColor.backgroundColor
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      width:'auto'
      height:'auto'
      top:0
      left:0
    

    fb = require('facebook');
    fb.appid = @_getAppID()
    fb.permissions =  ['read_stream']
    fb.forceDialogAuth = false
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
              Ti.App.Properties.setString "cbFan.currentUserId", user.id
              
              rows.push(that._userSection(user))
              rows.push(that._favoriteSection(user))
              
              that.table.setData rows
              cbFan.facebookWindow.add that.table
              
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
    

    facebookWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"マイページ"

      
    cbFan.facebookWindow = Ti.UI.createWindow
      title:"マイページ"
      barColor:baseColor.barColor
      backgroundColor: baseColor.backgroundColor
      tabBarHidden:false

    cbFan.facebookWindow.add button
    
    if Ti.Platform.osname is 'iphone'
      cbFan.facebookWindow.setTitleControl facebookWindowTitle

    facebookTab = Ti.UI.createTab
      window:cbFan.facebookWindow
      barColor:"#343434"
      icon:"ui/image/tab2ic.png"

    return facebookTab
    
  _getAppID:() ->
    # Facebook appidを取得
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    appid = json.facebook.appid
    return appid
    
  _userSection:(user) ->
    baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#dfdfdf"
      keyColor:"#EDAD0B"
    menuHeaderView = Ti.UI.createView
      backgroundColor:baseColor.backgroundColor
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
      backgroundColor:baseColor.backgroundColor
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

  _favoriteSection:(user) ->
    favoriteHeaderView = Ti.UI.createView
      backgroundColor:baseColor.backgroundColor
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
                    
                # memoIcon = String.fromCharCode("0xe08d")
                # penIcon =  String.fromCharCode("0xe09f")
                rightIcon = String.fromCharCode("0xe112")
                iconButton = Ti.UI.createButton
                  top:5
                  right:10
                  width:25
                  height:25
                  backgroundColor:"EDAD0B"
                  backgroundImage:"NONE"
                  borderWidth:0
                  borderRadius:0
                  color:'#eee'      
                  font:
                    fontSize: 25
                    fontFamily:'LigatureSymbols'
                  title:rightIcon
                  
                iconButton.addEventListener('click',(e)->
                  
                )

                shopNameRow.add iconButton
                shopNameRow.add shopNameLabel
                favoriteSection.add shopNameRow
            

          
        else
          Ti.API.info "Error:\n"
          


    return favoriteSection
module.exports =  facebookTab