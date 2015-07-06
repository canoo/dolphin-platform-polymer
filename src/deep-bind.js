/*jslint browserify: true */
"use strict";

var Map  = require('../bower_components/core.js/library/fn/map');

function Binder(dolphin) {
    this.listeners = new Map();

    dolphin.onUpdated(bindScope(this, this.onUpdatedHandler));
    dolphin.onArrayUpdate(bindScope(this, this.onArrayUpdateHandler));
}

function exists(object) {
    return typeof object !== 'undefined' && object !== null;
}

function bindScope(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

Binder.prototype.onUpdatedHandler = function(bean, propertyName, newValue, oldValue) {
    var listenerList = this.listeners.get(bean);
    if (exists(listenerList)) {
        var n = listenerList.length;
        for (var i = 0; i < n; i++) {
            var entry = listenerList[i];
            var element = entry.element;
            var path = entry.rootPath + '.' + propertyName;
            this.unbind(element, path, oldValue);
            element.set(path, newValue);
            this.bind(element, path, newValue);
        }
    }
};


Binder.prototype.onArrayUpdateHandler = function(bean, propertyName, index, count, newElements) {
    var listenerList = this.listeners.get(bean);
    if (exists(listenerList)) {
        var n = listenerList.length;
        for (var i = 0; i < n; i++) {
            var entry = listenerList[i];
            var element = entry.element;
            var path = entry.rootPath + '.' + propertyName;
            //this.unbind(element, path, oldValue);
            element.splice(path, index, count, newElements);
            //this.bind(element, path, newValue);
        }
    }
};


Binder.prototype.bind = function (element, rootPath, value) {
    switch (typeof value) {
        case 'object':
            var listenerList = this.listeners.get(value);
            if (! exists(listenerList)) {
                listenerList = [];
                this.listeners.set(value, listenerList);
            }
            listenerList.push({element: element, rootPath: rootPath});

            for (var propertyName in value) {
                this.bind(element, rootPath + '.' + propertyName, value[propertyName]);
            }
            break;
        case 'array' :
            break;
    }
};

Binder.prototype.unbind = function (element, rootPath, value) {
    switch (typeof value) {
        case 'object':
            var listenerList = this.listeners.get(value);
            if (exists(listenerList)) {
                var n = listenerList.length;
                for (var i = 0; i < n; i++) {
                    var entry = listenerList[i];
                    if (entry.element === element && entry.rootPath === rootPath) {
                        listenerList.splice(i, 1);
                        for (var propertyName in value) {
                            this.unbind(element, rootPath + '.' + propertyName, value[propertyName]);
                        }
                        return;
                    }
                }
            }
            break;
        case 'array' :
            break;
    }
};



/*

bind (element, property, object)


element[propertyName] = object;




bean
    p1
    p2


if (! exist(element.observers)) {
    element.observers = []
}

model = findModel(bean)
for p in [p1, p2]
    var path = propertyName + x + "." + p
    attribute = findAttribute(model, p1)
    attribute.onValueChanged(function(event) {
        (oldValue, newValue) = (event.oldValue, event.newValue)
        element.notifyPath(path, newValue)
    })
    observers.push(observerName(



 */





exports.Binder = Binder;
