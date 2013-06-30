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
    cbFan.facebookToken = fb.accessToken
      
    fb.addEventListener('login', (e) ->
      if e.success
        Cloud.SocialIntegrations.externalAccountLogin
          type: "facebook"
          token: fb.accessToken
        , (e) ->
          if e.success
            user = e.users[0]
            Ti.API.info "User  = " + JSON.stringify(user)
            Ti.App.Properties.setString "cbFan.currentUserId", user.id
          else
            alert "Error: " + ((e.error and e.message) or JSON.stringify(e))

      else if e.error
          alert e.error
      else alert "Canceled"  if e.cancelled
    )
    
    fb.addEventListener('logout', (e) ->
      alert "Facebbokアカウントからログアウトしました"
    )  
    fb.authorize()  unless fb.loggedIn
    
    button = Ti.UI.createButton(title: "Open Feed Dialog")
    button.addEventListener "click", (e) ->
      fb.reauthorize ["publish_stream"], "me", (e) ->
        if e.success
          # If successful, proceed with a publish call
          fb.dialog "feed", {}, (e) ->
            if e.success and e.result
              alert "Success! New Post ID: " + e.result
            else
              if e.error
                alert e.error
              else
                alert "User canceled dialog."
        else
          if e.error
            alert e.error
          else
            alert "Unknown result"
          
    facebookWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:'18sp'
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"アカウント設定"

    fbLoginButton = fb.createLoginButton
      top : 50
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
    
module.exports =  facebookTab