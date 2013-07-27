

configurationWizard = Ti.App.Properties.getBool "configurationWizard"

# GoogleAnalyticsによるトラッキングのための処理

Config = require("model/loadConfig")
config = new Config()
gaKey = config.getGoogleAnalyticsKey()
Ti.API.info "gaKey is #{gaKey}"

gaModule = require('lib/Ti.Google.Analytics')
analytics = new gaModule(gaKey)

Ti.App.addEventListener "analytics_trackPageview", (e) ->
  path = "/ft/" + Titanium.Platform.name
  analytics.trackPageview path + e.pageUrl

Ti.App.addEventListener "analytics_trackEvent", (e) ->
  analytics.trackEvent e.category, e.action, e.label, e.value

Ti.App.Analytics =
  trackPageview: (pageUrl) ->
    Ti.App.fireEvent "analytics_trackPageview",
      pageUrl: pageUrl


  trackEvent: (category, action, label, value) ->
    Ti.App.fireEvent "analytics_trackEvent",
      category: category
      action: action
      label: label
      value: value


analytics.start 10, true
if configurationWizard is null or typeof configurationWizard is "undefined"
  Client = require("configurationWizard/client")
  client = new Client()
  startPoint = 0
  client.useMenu(startPoint)
else
  MainController = require("controller/mainController")
  mainController = new MainController()
  mainController.isLogin()
