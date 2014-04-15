function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __alloyId3 = [];
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
    var __alloyId4 = [];
    $.__views.__alloyId5 = Ti.UI.createTableViewRow({
        id: "__alloyId5"
    });
    __alloyId4.push($.__views.__alloyId5);
    $.__views.userLogin = Ti.UI.createLabel({
        font: {
            fontSize: 36,
            fontFamily: "LigatureSymbols"
        },
        color: "#007aff",
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        textAlign: "center",
        id: "userLogin"
    });
    $.__views.__alloyId5.add($.__views.userLogin);
    $.__views.userInfo = Ti.UI.createLabel({
        top: 10,
        left: 50,
        width: 80,
        font: {
            fontSize: 14
        },
        text: "ユーザ情報",
        id: "userInfo"
    });
    $.__views.__alloyId5.add($.__views.userInfo);
    $.__views.__alloyId6 = Ti.UI.createTableViewRow({
        id: "__alloyId6"
    });
    __alloyId4.push($.__views.__alloyId6);
    $.__views.searchBtn = Ti.UI.createLabel({
        font: {
            fontSize: 36,
            fontFamily: "LigatureSymbols"
        },
        color: "#007aff",
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        textAlign: "center",
        id: "searchBtn"
    });
    $.__views.__alloyId6.add($.__views.searchBtn);
    $.__views.searchInfo = Ti.UI.createLabel({
        top: 5,
        left: 50,
        width: 100,
        font: {
            fontSize: 14
        },
        text: "リストから検索",
        id: "searchInfo"
    });
    $.__views.__alloyId6.add($.__views.searchInfo);
    $.__views.__alloyId7 = Ti.UI.createTableViewRow({
        id: "__alloyId7"
    });
    __alloyId4.push($.__views.__alloyId7);
    $.__views.applicationBtn = Ti.UI.createLabel({
        font: {
            fontSize: 36,
            fontFamily: "LigatureSymbols"
        },
        color: "#007aff",
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        textAlign: "center",
        id: "applicationBtn"
    });
    $.__views.__alloyId7.add($.__views.applicationBtn);
    $.__views.applicationInfo = Ti.UI.createLabel({
        top: 5,
        left: 50,
        width: 100,
        font: {
            fontSize: 14
        },
        text: "このアプリケーションについて",
        id: "applicationInfo"
    });
    $.__views.__alloyId7.add($.__views.applicationInfo);
    $.__views.tableview = Ti.UI.createTableView({
        width: 150,
        height: Ti.UI.FULL,
        top: 0,
        left: 0,
        zIndex: 0,
        backgroundColor: "#f9f9f9",
        separatorColor: "#eeeeee",
        data: __alloyId4,
        id: "tableview"
    });
    $.__views.mainWindow.add($.__views.tableview);
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
    __alloyId3.push($.__views.tabOne);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId3,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var KloudService, addAnnotations, checkNetworkConnection, kloudService, slide;
    $.index.open();
    $.userLogin.text = String.fromCharCode("0xe137");
    $.searchBtn.text = String.fromCharCode("0xe116");
    $.applicationBtn.text = String.fromCharCode("0xe075");
    $.showBtn.text = String.fromCharCode("0xe084");
    $.showBtn.addEventListener("click", function() {
        return slide();
    });
    $.tableview.addEventListener("click", function(e) {
        var applicationInfoController, searchController, userController;
        if (0 === e.index) {
            userController = Alloy.createController("user");
            return userController.move($.tabOne);
        }
        if (1 === e.index) {
            searchController = Alloy.createController("search");
            return searchController.move($.tabOne);
        }
        if (2 === e.index) {
            applicationInfoController = Alloy.createController("applicationInfo");
            return applicationInfoController.move($.tabOne);
        }
        return Ti.API.info("no action");
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
            imagePath = "true" === data.shopFlg ? "bottle.png" : "tmulblr.png";
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
            leftPosition = 150;
            $.mapview.slideState = true;
        } else {
            leftPosition = 0;
            $.mapview.slideState = false;
        }
        transform = Titanium.UI.create2DMatrix();
        animation = Titanium.UI.createAnimation();
        animation.left = leftPosition;
        animation.transform = transform;
        animation.duration = 250;
        return $.mapview.animate(animation);
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;