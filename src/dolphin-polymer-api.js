/*jslint browserify: true */
"use strict";

var connect = require('../bower_components/dolphin-js/dist/dolphin.js').connect2;
var createBaseBehavior = require('./base-behavior.js').createBaseBehavior;

var dolphin = null;

exports.connect = function(url, config) {
    return connect(url, config).then(
        function(dolphin) {
            dolphin.BaseBehavior = createBaseBehavior(dolphin);
        }
    );
};
