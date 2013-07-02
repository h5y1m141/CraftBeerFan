class facebookTab
  constructor:() ->
    baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#dfdfdf"
      keyColor:"#EDAD0B"

    fb = require('facebook');
    fb.appid = @_getAppID()
    fb.permissions =  ['read_stream']
    fb.forceDialogAuth = false
    that = @
    fb.addEventListener('login', (e) ->
      
      token = fb.accessToken
      _Cloud = require('ti.cloud')
      
      if e.success
        # alert "Logged In token is #{fb.accessToken}"
        
        # alert that
        # alert token
        if e.success

          _Cloud.SocialIntegrations.externalAccountLogin
            type: "facebook"
            token: token
          , (e) ->
            if e.success
              user = e.users[0]
              Ti.API.info "User  = " + JSON.stringify(user)
              Ti.App.Properties.setString "cbFan.currentUserId", user.id
              that._userSection(user)
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
    # fb.addEventListener('login', (e) =>
    #   that = @
    #   token = fb.accessToken
    #   _Cloud = require('ti.cloud')
      
    #   if e.success
    #     alert token
    #     _Cloud.SocialIntegrations.externalAccountLogin
    #       type: "facebook"
    #       token: token
    #     , (e) ->
    #       if e.success
    #         user = e.users[0]
    #         Ti.API.info "User  = " + JSON.stringify(user)
    #         Ti.App.Properties.setString "cbFan.currentUserId", user.id
    #         that._userSection(user)
    #       else
    #         alert "Error: " + ((e.error and e.message) or JSON.stringify(e))

    #   else if e.error
    #       alert e.error
    #   else alert "Canceled"  if e.cancelled
    # )
    
    # fb.addEventListener('logout', (e) ->
    #   alert "Facebbokアカウントからログアウトしました"
    # )  
    
    

    facebookWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"アカウント設定"

    fbLoginButton = fb.createLoginButton
      top:5
      left:5
      style : fb.BUTTON_STYLE_WIDE
      
    cbFan.facebookWindow = Ti.UI.createWindow
      title:"アカウント設定"
      barColor:baseColor.barColor
      backgroundColor: baseColor.backgroundColor
      tabBarHidden:false

    cbFan.facebookWindow.add button
    cbFan.facebookWindow.add fbLoginButton
    
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

    rows = []
    table = Ti.UI.createTableView
      backgroundColor: baseColor.backgroundColor
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED
      width:'auto'
      height:'100'
      top:50
      left:0
      
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
      width:280
      color:"#333"
      left:5
      top:5
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    nameRow.add nameLabel      
    menuSection.add nameRow

    rows.push menuSection
    
    table.setData rows
    cbFan.facebookWindow.add table
    return
module.exports =  facebookTab