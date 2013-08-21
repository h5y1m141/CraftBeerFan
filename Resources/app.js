var Config, ListWindow, MainController, StartupWindow, analytics, config, configurationWizard, gaKey, gaModule, listWindow, mainController, osname, startupWindow;

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

osname = Ti.Platform.osname;

if (Ti.Platform.osname === "android") {
  ListWindow = require("ui/android/listWindow");
  listWindow = new ListWindow();
  listWindow.open();
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
