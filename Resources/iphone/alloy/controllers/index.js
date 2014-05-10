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
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        top: 240,
        left: 120,
        textAlign: "center",
        backgroundColor: "#222",
        font: {
            fontSize: 18
        },
        color: "#fff",
        zIndex: 10,
        id: "activityIndicator",
        message: "Loading..."
    });
    $.__views.mainWindow.add($.__views.activityIndicator);
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
    $.__views.__alloyId6 = Ti.UI.createLabel({
        top: 10,
        left: 50,
        width: 100,
        textAlign: "left",
        font: {
            fontSize: 12
        },
        text: "ユーザ情報",
        id: "__alloyId6"
    });
    $.__views.__alloyId5.add($.__views.__alloyId6);
    $.__views.__alloyId7 = Ti.UI.createTableViewRow({
        id: "__alloyId7"
    });
    __alloyId4.push($.__views.__alloyId7);
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
    $.__views.__alloyId7.add($.__views.searchBtn);
    $.__views.__alloyId8 = Ti.UI.createLabel({
        top: 10,
        left: 50,
        width: 100,
        textAlign: "left",
        font: {
            fontSize: 12
        },
        text: "都道府県から検索",
        id: "__alloyId8"
    });
    $.__views.__alloyId7.add($.__views.__alloyId8);
    $.__views.__alloyId9 = Ti.UI.createTableViewRow({
        id: "__alloyId9"
    });
    __alloyId4.push($.__views.__alloyId9);
    $.__views.tapBtn = Ti.UI.createLabel({
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
        id: "tapBtn"
    });
    $.__views.__alloyId9.add($.__views.tapBtn);
    $.__views.__alloyId10 = Ti.UI.createLabel({
        top: 10,
        left: 50,
        width: 100,
        textAlign: "left",
        font: {
            fontSize: 12
        },
        text: "開栓情報から検索",
        id: "__alloyId10"
    });
    $.__views.__alloyId9.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createTableViewRow({
        id: "__alloyId11"
    });
    __alloyId4.push($.__views.__alloyId11);
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
    $.__views.__alloyId11.add($.__views.applicationBtn);
    $.__views.__alloyId12 = Ti.UI.createLabel({
        top: 10,
        left: 50,
        width: 100,
        textAlign: "left",
        font: {
            fontSize: 12
        },
        text: "このアプリケーションについて",
        id: "__alloyId12"
    });
    $.__views.__alloyId11.add($.__views.__alloyId12);
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
    var Cloud, KloudService, addAnnotations, checkNetworkConnection, deviceToken, deviceTokenError, deviceTokenSuccess, geoHashResult, kloudService, lastGeoHashValue, precision, receivePush, selectIcon, slide, style, tiGeoHash;
    $.index.open();
    Cloud = require("ti.cloud");
    deviceToken = null;
    Ti.Network.registerForPushNotifications({
        types: [ Ti.Network.NOTIFICATION_TYPE_BADGE, Ti.Network.NOTIFICATION_TYPE_ALERT, Ti.Network.NOTIFICATION_TYPE_SOUND ],
        success: function(e) {
            Ti.API.info("success:" + JSON.stringify(e));
            deviceToken = e.deviceToken;
            Ti.API.info("deviceToken is " + deviceToken);
            return Cloud.PushNotifications.subscribeToken({
                device_token: deviceToken,
                channel: "test",
                type: "ios"
            }, function(e) {
                e.success ? Ti.API.info("Subscribed") : Ti.API.info("Error:\n" + (e.error && e.message || JSON.stringify(e)));
            });
        },
        error: function(e) {
            return Ti.API.info("error: " + JSON.stringify(e));
        },
        callback: function(e) {
            return Ti.API.info("callback: " + JSON.stringify(e));
        }
    });
    receivePush = function(e) {
        alert("Received push: " + JSON.stringify(e));
    };
    deviceTokenSuccess = function(e) {
        alert(e.deviceToken);
        deviceToken = e.deviceToken;
        Ti.API.info("deviceToken is " + deviceToken + " ");
    };
    deviceTokenError = function(e) {
        alert("Failed to register for push notifications! " + e.error);
    };
    style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
    $.activityIndicator.style = style;
    $.userLogin.text = String.fromCharCode("0xe137");
    $.searchBtn.text = String.fromCharCode("0xe129");
    $.applicationBtn.text = String.fromCharCode("0xe075");
    $.tapBtn.text = String.fromCharCode("0xe116");
    $.showBtn.text = String.fromCharCode("0xe084");
    $.showBtn.addEventListener("click", function() {
        return slide();
    });
    $.tableview.addEventListener("click", function(e) {
        var applicationInfoController, onTapInfoController, searchController, userController;
        if (0 === e.index) {
            userController = Alloy.createController("user");
            return userController.move($.tabOne);
        }
        if (1 === e.index) {
            searchController = Alloy.createController("search");
            return searchController.move($.tabOne);
        }
        if (2 === e.index) {
            onTapInfoController = Alloy.createController("onTapInfo");
            return onTapInfoController.move($.tabOne);
        }
        if (3 === e.index) {
            applicationInfoController = Alloy.createController("applicationInfo");
            return applicationInfoController.move($.tabOne);
        }
        return Ti.API.info("no action");
    });
    KloudService = require("kloudService");
    kloudService = new KloudService();
    tiGeoHash = require("TiGeoHash");
    Ti.Geolocation.getCurrentPosition(function(e) {
        var latitude, longitude;
        $.activityIndicator.show();
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
            latitudeDelta: .05,
            longitudeDelta: .05
        };
        return kloudService.placesQuery(latitude, longitude, function(data) {
            $.activityIndicator.hide();
            return addAnnotations(data);
        });
    });
    $.mapview.addEventListener("click", function(e) {
        if ("rightButton" === e.clicksource) {
            $.activityIndicator.show();
            return kloudService.statusesQuery(e.annotation.placeID, function(statuses) {
                var shopData, shopDataDetailController;
                Ti.API.info("statuses is " + statuses);
                shopData = {
                    shopName: e.annotation.title,
                    phoneNumber: e.annotation.phoneNumber,
                    latitude: e.annotation.latitude,
                    longitude: e.annotation.longitude,
                    shopInfo: e.annotation.shopInfo,
                    webSite: e.annotation.webSite,
                    statuses: statuses,
                    placeID: e.annotation.placeID
                };
                $.activityIndicator.hide();
                shopDataDetailController = Alloy.createController("shopDataDetail");
                return shopDataDetailController.move($.tabOne, shopData);
            });
        }
    });
    geoHashResult = null;
    lastGeoHashValue = null;
    precision = 6;
    $.mapview.addEventListener("regionchanged", function() {
        var latitude, longitude, regionData;
        regionData = $.mapview.getRegion();
        latitude = regionData.latitude;
        longitude = regionData.longitude;
        geoHashResult = tiGeoHash.encodeGeoHash(latitude, longitude, precision);
        Ti.API.info("lastGeoHashValue:" + lastGeoHashValue + " and geoHashResult:" + geoHashResult.geohash);
        if (null === lastGeoHashValue || lastGeoHashValue === geoHashResult.geohash) {
            Ti.API.info("regionchanged doesn't fire");
            return lastGeoHashValue = geoHashResult.geohash;
        }
        Ti.API.info("regionchanged fire");
        Ti.API.info(geoHashResult.geohash + " and " + lastGeoHashValue);
        lastGeoHashValue = geoHashResult.geohash;
        if (false === Ti.Network.online) return alert("利用されてるスマートフォンからインターネットに接続できないためお店の情報が検索できません");
        Ti.API.info("start placesQuery latitude is " + latitude);
        $.activityIndicator.show();
        return kloudService.placesQuery(latitude, longitude, function(data) {
            addAnnotations(data);
            return $.activityIndicator.hide();
        });
    });
    addAnnotations = function(array) {
        var annotation, currentTime, data, imagePath, moment, shopFlg, statusesUpdateFlg, webSite, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = array.length; _len > _i; _i++) {
            data = array[_i];
            moment = require("alloy/moment");
            currentTime = moment();
            statusesUpdateFlg = false === data.statusesUpdate || "undefined" == typeof data.statusesUpdate ? false : 8e4 > currentTime.diff(data.statusesUpdate) ? false : true;
            shopFlg = "false" === data.shopFlg ? false : true;
            webSite = false === data.website || "undefined" == typeof data.website ? "" : data.website;
            Ti.API.info("" + data.website);
            imagePath = selectIcon(shopFlg, statusesUpdateFlg);
            annotation = Alloy.Globals.Map.createAnnotation({
                latitude: data.latitude,
                longitude: data.longitude,
                title: data.shopName,
                phoneNumber: data.phoneNumber,
                shopAddress: data.shopAddress,
                shopInfo: data.shopInfo,
                webSite: webSite,
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
    selectIcon = function(shopFlg, statusesUpdateFlg) {
        var imagePath;
        imagePath = true === shopFlg ? "bottle.png" : false === shopFlg && true === statusesUpdateFlg ? "tmublrWithOnTapInfo.png" : false === shopFlg && false === statusesUpdateFlg ? "tmulblr.png" : null;
        return imagePath;
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