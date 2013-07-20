var Client, client, configurationWizard, mainController, startPoint;

configurationWizard = Ti.App.Properties.getBool("configurationWizard");

Ti.API.info(configurationWizard);

if (configurationWizard === null || typeof configurationWizard === "undefined") {
  Client = require("configurationWizard/client");
  client = new Client();
  startPoint = 0;
  client.useMenu(startPoint);
} else {
  mainController = require("controller/mainController");
  new mainController();
}
