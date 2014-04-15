/*jslint bitwise: true */
/*global module, exports */
(function (root) {
    "use strict";

    var geohash = root.geohash || {},
        geo_base32 = "0123456789bcdefghjkmnpqrstuvwxyz",
        geo_base32_map = {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            b: 10,
            c: 11,
            d: 12,
            e: 13,
            f: 14,
            g: 15,
            h: 16,
            j: 17,
            k: 18,
            m: 19,
            n: 20,
            p: 21,
            q: 22,
            r: 23,
            s: 24,
            t: 25,
            u: 26,
            v: 27,
            w: 28,
            x: 29,
            y: 30,
            z: 31
        };


    /**
     * encode_i2c Private function
     * @param  {Number} lat        Latitude
     * @param  {Number} lng        Longitude
     * @param  {Number} lat_length Latitude length
     * @param  {Number} lng_length Longitude length
     * @return {String} Calced string
     */
    function encode_i2c(lat, lng, lat_length, lng_length) {
        var a, b, t, i, base32 = geo_base32.split(''),
            precision = (lat_length + lng_length) / 5,
            boost = [0, 1, 4, 5, 16, 17, 20, 21],
            ret = "";
        if (lat_length < lng_length) {
            a = lng;
            b = lat;
        } else {
            a = lat;
            b = lng;
        }
        boost = [0, 1, 4, 5, 16, 17, 20, 21];
        ret = "";

        for (i = 0; i < precision; i += 1) {
            ret += base32[(boost[a & 7] + (boost[b & 3] << 1)) & 0x1F];
            t = parseInt((a * Math.pow(2, -3)), 10);
            a = parseInt((b * Math.pow(2, -2)), 10);
            b = t;
        }
        return ret.split('').reverse().join('');
    }


    /**
     * decode_c2i Private function
     * @param  {String} hashcode Calced GeoHash
     * @return {Array} Latitude, Longitude, Latitude length, Longitude length
     */
    function decode_c2i(hashcode) {
        var i, t, lng = 0,
            lat = 0,
            bit_length = 0,
            lat_length = 0,
            lng_length = 0,
            hash = hashcode.split('');

        for (i = 0; i < hash.length; i += 1) {
            t = geo_base32_map[hash[i]];
            if (bit_length % 2 === 0) {
                lng = lng * 8;
                lat = lat * 4;
                lng += (t / 4) & 4;
                lat += (t / 4) & 2;
                lng += (t / 2) & 2;
                lat += (t / 2) & 1;
                lng += t & 1;
                lng_length += 3;
                lat_length += 2;
            } else {
                lng = lng * 4;
                lat = lat * 8;
                lat += (t / 4) & 4;
                lng += (t / 4) & 2;
                lat += (t / 2) & 2;
                lng += (t / 2) & 1;
                lat += t & 1;
                lng_length += 2;
                lat_length += 3;
            }
            bit_length += 5;
        }
        return [lat, lng, lat_length, lng_length];
    }


    /**
     * encode method
     * @param  {Number} lat       Latitude
     * @param  {Number} lng       Longitude
     * @param  {Number} precision Needs precision
     * @return {String} Calced GeoHash
     */
    geohash.encode = function (lat, lng, precision) {
        precision = precision || 12;
        if (lat >= 90 || lat <= -90) {
            return "";
        }
        while (lng < -180.0) {
            lng += 360.0;
        }
        while (lng >= 180.0) {
            lng -= 360.0;
        }
        lat = lat / 180.0;
        lng = lng / 360.0;

        var xprecision = precision + 1,
            lat_length = parseInt((xprecision * 5 / 2), 10),
            lng_length = parseInt((xprecision * 5 / 2), 10);

        if (xprecision % 2 === 1) {
            lng_length += 1;
        }

        if (lat > 0) {
            lat = parseInt((Math.pow(2, lat_length) * lat + Math.pow(2, lat_length - 1)), 10);
        } else {
            lat = Math.pow(2, lat_length - 1) - parseInt((Math.pow(2, lat_length) * (-1.0 * lat)), 10);
        }

        if (lng > 0) {
            lng = parseInt((Math.pow(2, lng_length) * lng + Math.pow(2, lng_length - 1)), 10);
        } else {
            lng = Math.pow(2, lng_length - 1) - parseInt((Math.pow(2, lng_length) * (-1.0 * lng)), 10);
        }

        return encode_i2c(lat, lng, lat_length, lng_length).substring(0, precision);
    };


    /**
     * decode method
     * @param  {String}  hashcode Calced GeoHash
     * @param  {Boolean} delta    Delta flag
     * @return {Array} Latitude, Longitude
     */
    geohash.decode = function (hashcode, delta) {
        delta = delta || false;
        var data, lat, lng, lat_length, lng_length, latitude, longitude, latitude_delta, longitude_delta;
        data = decode_c2i(hashcode);
        lat = data[0];
        lng = data[1];
        lat_length = data[2];
        lng_length = data[3];

        lat = (lat * 2) + 1;
        lng = (lng * 2) + 1;
        lat_length += 1;
        lng_length += 1;

        latitude = 180.0 * (lat - Math.pow(2, (lat_length - 1))) / Math.pow(2, lat_length);
        longitude = 360.0 * (lng - Math.pow(2, (lng_length - 1))) / Math.pow(2, lng_length);
        if (delta) {
            latitude_delta = 180.0 / Math.pow(2, lat_length);
            longitude_delta = 360.0 / Math.pow(2, lng_length);
            return [latitude, longitude, latitude_delta, longitude_delta];
        }
        return [latitude, longitude];
    };


    /**
     * decode_exactly method (Enable Delta flag)
     * @param  {String} hashcode Calced GeoHash
     * @return {Array} Latitude, Longitude
     */
    geohash.decode_exactly = function (hashcode) {
        return geohash.decode(hashcode, true);
    };


    /**
     * bbox method
     * @param  {String} hashcode Calced GeoHash
     * @return {Object} Norce, South, East, West
     */
    geohash.bbox = function (hashcode) {
        var data = decode_c2i(hashcode),
            lat = data[0],
            lng = data[1],
            lat_length = data[2],
            lng_length = data[3],
            ret = {};

        if (lat_length) {
            ret.n = 180.0 * (lat + 1 - Math.pow(2, (lat_length - 1))) / Math.pow(2, lat_length);
            ret.s = 180.0 * (lat - Math.pow(2, (lat_length - 1))) / Math.pow(2, lat_length);
        } else {
            ret.n = 90.0;
            ret.s = -90.0;
        }
        if (lng_length) {
            ret.e = 360.0 * (lng + 1 - Math.pow(2, (lng_length - 1))) / Math.pow(2, lng_length);
            ret.w = 360.0 * (lng - Math.pow(2, (lng_length - 1))) / Math.pow(2, lng_length);
        } else {
            ret.e = 180.0;
            ret.w = -180.0;
        }

        return ret;
    };


    /**
     * neignbors method
     * @param  {String} hashcode Calced GeoHash
     * @return {Array} Calced near 8 points GeoHash
     */
    geohash.neighbors = function (hashcode) {
        var data = decode_c2i(hashcode),
            lat = data[0],
            lng = data[1],
            lat_length = data[2],
            lng_length = data[3],
            ret = [],
            tlat = lat,
            tlng = lng;

        ret.push(encode_i2c(tlat, tlng - 1, lat_length, lng_length));
        ret.push(encode_i2c(tlat, tlng + 1, lat_length, lng_length));

        tlat = lat + 1;
        if (tlat >= 0) {
            ret.push(encode_i2c(tlat, tlng - 1, lat_length, lng_length));
            ret.push(encode_i2c(tlat, tlng, lat_length, lng_length));
            ret.push(encode_i2c(tlat, tlng + 1, lat_length, lng_length));
        }
        tlat = lat - 1;
        if ((tlat / Math.pow(2, lat_length)) !== 0) {
            ret.push(encode_i2c(tlat, tlng - 1, lat_length, lng_length));
            ret.push(encode_i2c(tlat, tlng, lat_length, lng_length));
            ret.push(encode_i2c(tlat, tlng + 1, lat_length, lng_length));
        }
        return ret;
    };


    /**
     * expand method (Neighbor GeoHashes with self)
     * @param  {String} hashcode Calced GeoHash
     * @return {Array} Calced near 8 points GeoHash with argument geohash
     */
    geohash.expand = function (hashcode) {
        var ret = geohash.neighbors(hashcode);
        ret.push(hashcode);
        return ret;
    };


    /**
     * contain method
     * @param  {Number}  lat      Latitude
     * @param  {Number}  lng      Longitude
     * @param  {String}  hashcode Calced GeoHash
     * @return {Boolean}
     */
    geohash.contain = function (lat, lng, hashcode) {
        var data = geohash.bbox(hashcode);
        if (lat < data.n && lat > data.s && lng > data.w && lng < data.e) {
            return true;
        }
        return false;
    };


    /**
     * contain_expand method
     * @param  {Number}  lat      Latitude
     * @param  {Number}  lng      Longitude
     * @param  {String}  hashcode Calced GeoHash
     * @return {Boolean}
     */
    geohash.contain_expand = function (lat, lng, hashcode) {
        var i, data = geohash.expand(hashcode);
        for (i = 0; i < data.length; i += 1) {
            if (geohash.contain(lat, lng, data[i])) {
                return true;
            }
        }
        return false;
    };


    // Exports geohash module methods
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            module.exports = geohash;
        }
        exports.geohash = geohash;
    } else {
        root.geohash = geohash;
    }
}(this));
