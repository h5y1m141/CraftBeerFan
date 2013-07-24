class loadConfig
  constructor:() ->
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    @json = JSON.parse(file)
    
  getNendData:() ->
    return @json.nend

  getGoogleAnalyticsKey:() ->
    return @json.GoogleAnalytics
        

module.exports = loadConfig 