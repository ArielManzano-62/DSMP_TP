var geometry = require('./node-geometry-library');

module.exports = function (callback, from, to) {
    var distance = geometry.SphericalUtil.computeDistanceBetween(from, to);
    callback(null, distance);
}