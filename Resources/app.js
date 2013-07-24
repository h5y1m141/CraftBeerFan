var Client, Config, analytics, client, config, configurationWizard, gaKey, gaModule, mainController, startPoint;

configurationWizard = Ti.App.Properties.getBool("configurationWizard");

Config = require("model/loadConfig");

config = new Config();

gaKey = config.getGoogleAnalyticsKey();

Ti.API.info("gaKey is " + gaKey);

gaModule = require('lib/Ti.Google.Analytics');

analytics = new gaModule(gaKey);

Ti.App.addEventListener("analytics_trackPageview", function(e) {
  var path;
  path = "/ft/" + Titanium.Platform.name;
  return analytics.trackPageview(path + e.pageUrl);
});

Ti.App.addEventListener("analytics_trackEvent", function(e) {
  return analytics.trackEvent(e.category, e.action, e.label, e.value);
});

Ti.App.Analytics = {
  trackPageview: function(pageUrl) {
    return Ti.App.fireEvent("analytics_trackPageview", {
      pageUrl: pageUrl
    });
  },
  trackEvent: function(category, action, label, value) {
    return Ti.App.fireEvent("analytics_trackEvent", {
      category: category,
      action: action,
      label: label,
      value: value
    });
  }
};

analytics.start(10, true);

if (configurationWizard === null || typeof configurationWizard === "undefined") {
  Client = require("configurationWizard/client");
  client = new Client();
  startPoint = 0;
  client.useMenu(startPoint);
} else {
  mainController = require("controller/mainController");
  new mainController();
}
