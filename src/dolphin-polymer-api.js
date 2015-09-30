/*jslint browserify: true */
"use strict";

var connect = require('../bower_components/dolphin-js/dist/dolphin.js').connect;
var setupCreateBehavior = require('./behavior.js').setupCreateBehavior;


exports.connect = function(url, config) {
    var clientContext = connect(url, config);
    clientContext.createBehavior = setupCreateBehavior(clientContext);
    return clientContext;
};
