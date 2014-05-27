$.developerSite.addEventListener 'click', (e) ->
  return Ti.Platform.openURL "http://craftbeer-fan.info/"
exports.move = (_tab) ->
  $.tmublrWithOnTapInfo.image = Ti.Filesystem.resourcesDirectory + "tmublrWithOnTapInfo.png"
  $.tmulblr.image = Ti.Filesystem.resourcesDirectory + "tmulblr.png"
  $.bottle.image = Ti.Filesystem.resourcesDirectory + "bottle.png"    
  _tab.open $.applicationInfoWindow
