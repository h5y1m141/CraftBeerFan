var facebook;

facebook = (function() {

  function facebook() {
    var config, file, json, _Cloud;
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json");
    file = config.read().toString();
    json = JSON.parse(file);
    this.appid = json.facebook.appid;
    _Cloud = require("ti.cloud");
    this.fbSignupBtn = Ti.UI.createButton({
      title: "Login with Facebook",
      width: 160,
      top: 50
    });
    this.fbSignupBtn.addEventListener("click", function() {});
  }

  facebook.prototype.getFacebookSignupBtn = function() {
    return this.fbSignupBtn;
  };

  facebook.prototype.getAppID = function() {
    return this.appid;
  };

  return facebook;

})();

module.exports = facebook;
