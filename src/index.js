const destination = require('@turf/destination'),
    fs = require('fs'),
    path = require('path'),
    polygon = require('@turf/helpers').polygon;

const UNHCR = {
    units: "meters",
    ring: [
        [2.0, 2.0],
        [3.3, 0.7],
        [3.3, -0.7],
        [2.0, -2.0],
        [-2.0, -2.0],
        [-3.3, -0.7],
        [-3.3, 0.7],
        [-2.0, 2.0],
        [2.0, 2.0]
    ]
};

const RADIANSTODEGREES = 180 / Math.PI;

function drawShelter(feature, definition) {
    let ring = [];
    let def = definition || UNHCR;
    let featureBearing = feature.properties.bearing || 0;
    let units = def.units || "meters";
    let shelterCentroid = feature.geometry.coordinates;
    for (let i = 0; i < def.ring.length; i++) {
        let defVertex = rotatePoint(def.ring[i], featureBearing);
        let bearing = cartBearing(defVertex);
        let distance = cartDistance(defVertex);
        let vertex = destination(shelterCentroid, distance, bearing, units);
        ring.push(vertex.geometry.coordinates);
    }
    let poly = polygon([ring]);
    return poly;
};

function cartDistance(inputPoint) {
    let origin = [0, 0];
    let distance = Math.sqrt(Math.pow((inputPoint[0] - origin[0]), 2) + Math.pow((inputPoint[1] - origin[1]), 2));
    return distance;
}

function cartBearing(inputPoint) {
    let origin = [0, 0];
    let bearing = Math.atan2(origin[1] - inputPoint[1], origin[0] - inputPoint[0]) * 180 / Math.PI + 180
    return bearing;
}

function rotatePoint(inputPoint, theta) {
    let x = inputPoint[0];
    let y = inputPoint[1];
    let xPrime = x * Math.cos(theta) - y * Math.sin(theta);
    let yPrime = y * Math.cos(theta) + x * Math.sin(theta);
    return [xPrime, yPrime];
}

module.exports = drawShelter;