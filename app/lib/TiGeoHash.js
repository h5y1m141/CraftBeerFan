/*jslint devel: true */
/*global Titanium, module, require */

(function (Ti) {
    "use strict";

    // Variables
    var fn;

    // Class definition
    function TiGeoHash() {
        this.name = "TiGeoHash";
        this.gh = require("geohash");
    }

    // Method definition
    fn = TiGeoHash.prototype;
    fn.getModuleName = function () {
        var self = this;
        return self.name;
    };
    fn.getCurrentGeoHash = function (callback, precision) {
        var self = this,
            ret = {};
        Ti.Geolocation.purpose = "Calc GeoHash";
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
        Ti.Geolocation.getCurrentPosition(function (evt) {
            if (!evt.success || evt.error) {
                ret.success = false;
                ret.error = true;
            } else {
                var coords = evt.coords;
                ret.success = true;
                ret.error = false;
                ret.latitude = coords.latitude;
                ret.longitude = coords.longitude;
                ret.geohash = self.gh.encode(ret.latitude, ret.longitude, precision);
                ret.neighbors = self.gh.neighbors(ret.geohash);
            }
            callback(ret);
        });
    };
    fn.encodeGeoHash = function (latitude, longitude, precision) {
        var self = this,
            ret = {};
        ret.geohash = self.gh.encode(latitude, longitude, precision);
        return ret;
    };
    fn.decodeGeoHash = function (geohash) {
        var self = this,
            ret = {},
            dec = self.gh.decode(geohash);
        ret.latitude = dec[0];
        ret.longitude = dec[1];
        return ret;
    };
    fn.getNeighbors = function (geohash) {
        var self = this,
            ret = {};
        ret.neighbors = self.gh.neighbors(geohash);
        return ret;
    };
    fn.getNEWS = function (geohash) {
        var self = this,
            ret = {},
            box = self.gh.bbox(geohash);
        ret.north = box.north;
        ret.east = box.east;
        ret.west = box.west;
        ret.south = box.south;
        return ret;
    };
    module.exports = new TiGeoHash();
}(Titanium));
