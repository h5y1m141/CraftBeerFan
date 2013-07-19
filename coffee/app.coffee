Ti.App.Properties.setBool "configurationWizard", false

configurationWizard = Ti.App.Properties.getBool "configurationWizard"

if configurationWizard is true
  Client = require("configurationWizard/client")
  client = new Client()
  startPoint = 0
  client.useMenu(startPoint)
else
  mainController = require("controller/mainController")
  new mainController()
