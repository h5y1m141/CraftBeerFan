configurationWizard = Ti.App.Properties.getBool "configurationWizard"

# GoogleAnalyticsによるトラッキングのための処理

Config = require("model/loadConfig")
config = new Config()
gaKey = config.getGoogleAnalyticsKey()

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

osname = Ti.Platform.osname

if osname is "android"
  # MainController = require("controller/mainController")
  # mainController = new MainController()
  # mainController.createTabGroup()
  ListWindow = require("ui/android/listWindow")
  listWindow = new ListWindow()
  listWindow.open()

else if osname is "iphone"

  if configurationWizard is null or typeof configurationWizard is "undefined" or configurationWizard is false

    StartupWindow = require("ui/#{osname}/startupWindow")
    startupWindow = new StartupWindow()  
    startupWindow.open()
  else
    MainController = require("controller/mainController")
    mainController = new MainController()
    mainController.createTabGroup()
else
    MainController = require("controller/mainController")
    mainController = new MainController()
    mainController.createTabGroup()
