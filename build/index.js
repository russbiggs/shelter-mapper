'use strict';

var destination = require('@turf/destination'),
    fs = require('fs'),
    path = require('path'),
    polygon = require('@turf/helpers').polygon;

var UNHCR = {
    units: "meters",
    ring: [[2.0, 2.0], [3.3, 0.7], [3.3, -0.7], [2.0, -2.0], [-2.0, -2.0], [-3.3, -0.7], [-3.3, 0.7], [-2.0, 2.0], [2.0, 2.0]]
};

var RADIANSTODEGREES = 180 / Math.PI;

function drawShelter(feature, definition) {
    var ring = [];
    var def = definition || UNHCR;
    var featureBearing = feature.properties.bearing || 0;
    var units = def.units || "meters";
    var shelterCentroid = feature.geometry.coordinates;
    for (var i = 0; i < def.ring.length; i++) {
        var defVertex = rotatePoint(def.ring[i], featureBearing);
        var bearing = cartBearing(defVertex);
        var distance = cartDistance(defVertex);
        var vertex = destination(shelterCentroid, distance, bearing, units);
        ring.push(vertex.geometry.coordinates);
    }
    var poly = polygon([ring]);
    return poly;
};

function cartDistance(inputPoint) {
    var origin = [0, 0];
    var distance = Math.sqrt(Math.pow(inputPoint[0] - origin[0], 2) + Math.pow(inputPoint[1] - origin[1], 2));
    return distance;
}

function cartBearing(inputPoint) {
    var origin = [0, 0];
    var bearing = Math.atan2(origin[1] - inputPoint[1], origin[0] - inputPoint[0]) * 180 / Math.PI + 180;
    return bearing;
}

function rotatePoint(inputPoint, theta) {
    var x = inputPoint[0];
    var y = inputPoint[1];
    var xPrime = x * Math.cos(theta) - y * Math.sin(theta);
    var yPrime = y * Math.cos(theta) + x * Math.sin(theta);
    return [xPrime, yPrime];
}

module.exports = drawShelter;