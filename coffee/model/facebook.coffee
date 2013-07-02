class facebook
  constructor:() ->
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    @appid = json.facebook.appid

    _Cloud = require("ti.cloud")

    @fbSignupBtn = Ti.UI.createButton
      title: "Login with Facebook"
      width: 160
      top: 50
    @fbSignupBtn.addEventListener "click", ->
      
  getFacebookSignupBtn:() ->
    return @fbSignupBtn
  getAppID:() ->
    return @appid
module.exports = facebook  
