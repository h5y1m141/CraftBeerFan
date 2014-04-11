function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __alloyId0 = [];
    $.__views.mainWindow = Ti.UI.createWindow({
        backgroundColor: "#f9f9f9",
        statusBarStyle: 0,
        tabBarHidden: true,
        id: "mainWindow",
        title: "main"
    });
    $.__views.__alloyId1 = Ti.UI.createButton({
        title: "Add",
        id: "__alloyId1"
    });
    $.__views.mainWindow.rightNavButton = $.__views.__alloyId1;
    $.__views.__alloyId2 = Ti.UI.createButton({
        title: "=",
        id: "__alloyId2"
    });
    $.__views.mainWindow.leftNavButton = $.__views.__alloyId2;
    $.__views.mapview = Alloy.Globals.Map.createView({
        id: "mapview",
        ns: "Alloy.Globals.Map"
    });
    $.__views.mainWindow.add($.__views.mapview);
    $.__views.tabOne = Ti.UI.createTab({
        window: $.__views.mainWindow,
        id: "tabOne"
    });
    __alloyId0.push($.__views.tabOne);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    $.mapview.region = {
        latitude: 35.676564,
        longitude: 139.765076,
        latitudeDelta: .05,
        longitudeDelta: .05
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;