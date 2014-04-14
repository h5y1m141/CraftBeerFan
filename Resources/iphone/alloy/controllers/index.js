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
        translucent: false,
        navTintColor: "#0066ff",
        tabBarHidden: true,
        id: "mainWindow",
        title: "近くのお店"
    });
    $.__views.showBtn = Ti.UI.createLabel({
        font: {
            fontSize: 36,
            fontFamily: "LigatureSymbols"
        },
        color: "#007aff",
        width: 44,
        height: 44,
        id: "showBtn"
    });
    $.__views.mainWindow.leftNavButton = $.__views.showBtn;
    var __alloyId2 = [];
    $.__views.__alloyId3 = Ti.UI.createTableViewRow({
        title: "リストを見る",
        id: "__alloyId3"
    });
    __alloyId2.push($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createTableViewRow({
        title: "設定",
        id: "__alloyId4"
    });
    __alloyId2.push($.__views.__alloyId4);
    $.__views.__alloyId5 = Ti.UI.createTableViewRow({
        title: "その他",
        id: "__alloyId5"
    });
    __alloyId2.push($.__views.__alloyId5);
    $.__views.__alloyId1 = Ti.UI.createTableView({
        width: 120,
        height: Ti.UI.FULL,
        top: 0,
        left: 0,
        zIndex: 0,
        backgroundColor: "#f9f9f9",
        separatorColor: "#eeeeee",
        data: __alloyId2,
        id: "__alloyId1"
    });
    $.__views.mainWindow.add($.__views.__alloyId1);
    $.__views.mapview = Alloy.Globals.Map.createView({
        zIndex: 4,
        animate: true,
        regionFit: true,
        userLocation: true,
        slideState: false,
        width: Ti.UI.FULL,
        height: Ti.UI.FULL,
        id: "mapview",
        ns: "Alloy.Globals.Map"
    });
    $.__views.mainWindow.add($.__views.mapview);
    $.__views.tabOne = Ti.UI.createTab({
        backgroundColor: "#f9f9f9",
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
    var KloudService, addAnnotations, checkNetworkConnection, kloudService, slide;
    $.index.open();
    $.showBtn.text = String.fromCharCode("0xe084");
    $.showBtn.addEventListener("click", function() {
        return slide();
    });
    KloudService = require("kloudService");
    kloudService = new KloudService();
    Ti.Geolocation.getCurrentPosition(function(e) {
        var latitude, longitude;
        if (e.success) {
            latitude = e.coords.latitude;
            longitude = e.coords.longitude;
        } else {
            latitude = 35.676564;
            longitude = 139.765076;
        }
        $.mapview.region = {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: .025,
            longitudeDelta: .025
        };
        return kloudService.placesQuery(latitude, longitude, function(data) {
            return addAnnotations(data);
        });
    });
    $.mapview.addEventListener("click", function(e) {
        if ("rightButton" === e.clicksource) return kloudService.statusesQuery(e.annotation.placeID, function(statuses) {
            var shopData, shopDataDetailController;
            Ti.API.info("statuses is " + statuses);
            shopData = {
                shopName: e.annotation.shopName,
                phoneNumber: e.annotation.phoneNumber,
                latitude: e.annotation.latitude,
                longitude: e.annotation.longitude,
                shopInfo: e.annotation.shopInfo,
                statuses: statuses
            };
            shopDataDetailController = Alloy.createController("shopDataDetail");
            return shopDataDetailController.move($.tabOne, shopData);
        });
    });
    addAnnotations = function(array) {
        var annotation, data, imagePath, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = array.length; _len > _i; _i++) {
            data = array[_i];
            imagePath = "true" === data.shopFlg ? "iphone/bottle.png" : "iphone/tumblrIcon.png";
            annotation = Alloy.Globals.Map.createAnnotation({
                latitude: data.latitude,
                longitude: data.longitude,
                title: data.shopName,
                phoneNumber: data.phoneNumber,
                shopAddress: data.shopAddress,
                shopInfo: data.shopInfo,
                placeID: data.id,
                subtitle: "",
                image: imagePath,
                animate: false,
                leftButton: "",
                rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE
            });
            _results.push($.mapview.addAnnotation(annotation));
        }
        return _results;
    };
    checkNetworkConnection = function() {
        var timerId;
        return timerId = setInterval(function() {
            Ti.API.info("Network Connection is " + Ti.Network.online);
            false === Ti.Network.online && clearInterval(timerId);
        }, 1e3);
    };
    slide = function() {
        var animation, leftPosition, transform;
        if (false === $.mapview.slideState) {
            leftPosition = 120;
            $.mapview.slideState = true;
        } else {
            leftPosition = 0;
            $.mapview.slideState = false;
        }
        transform = Titanium.UI.create2DMatrix();
        animation = Titanium.UI.createAnimation();
        animation.left = leftPosition;
        animation.transform = transform;
        animation.duration = 500;
        return $.mapview.animate(animation);
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;