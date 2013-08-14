var Config, MainController, StartupWindow, analytics, config, configurationWizard, displayHeight, gaKey, gaModule, mainController, startupWindow;

configurationWizard = Ti.App.Properties.getBool("configurationWizard");

Config = require("model/loadConfig");

config = new Config();

gaKey = config.getGoogleAnalyticsKey();

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

if (Ti.Platform.osname === "android") {
  displayHeight = Ti.Platform.displayCaps.platformHeight;
  displayHeight = displayHeight / Ti.Platform.displayCaps.logicalDensityFactor;
  StartupWindow = require("ui/android/startupWindow");
  startupWindow = new StartupWindow();
  startupWindow.open();
} else {
  if (configurationWizard === null || typeof configurationWizard === "undefined" || configurationWizard === false) {
    StartupWindow = require("ui/startupWindow");
    startupWindow = new StartupWindow();
    startupWindow.open();
  } else {
    MainController = require("controller/mainController");
    mainController = new MainController();
    mainController.createTabGroup();
  }
}
