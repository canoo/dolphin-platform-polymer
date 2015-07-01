/*jslint browserify: true */
"use strict";

var connect = require('../bower_components/dolphin-js/dist/dolphin.min.js').connect;
var createBaseBehavior = require('./base-behavior.js').createBaseBehavior;

var dolphin = null;

exports.connect = function(url, config) {
    var dolphin = connect(url, config);
    dolphin.BaseBehavior = createBaseBehavior(dolphin);
    return dolphin;
};
