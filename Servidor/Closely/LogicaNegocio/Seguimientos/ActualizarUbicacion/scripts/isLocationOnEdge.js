var geometry = require("./node-geometry-library");

module.exports = function (callback, position, encodedPolyline, tolerance = 100) {
    var decodedPolyline = geometry.PolyUtil.decode(encodedPolyline);
    var isOnEdge = geometry.PolyUtil.isLocationOnEdge(position, decodedPolyline, tolerance);
    callback(/* error */ null, isOnEdge);
};