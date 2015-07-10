/*jslint browserify: true */
"use strict";

var Map  = require('../bower_components/core.js/library/fn/map');

function Binder(dolphin) {
    this.listeners = new Map();

    dolphin.onBeanUpdate(bindScope(this, this.onBeanUpdateHandler));
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

Binder.prototype.onBeanUpdateHandler = function(bean, propertyName, newValue, oldValue) {
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
    } else {
        bean[propertyName] = newValue;
    }
};


Binder.prototype.onArrayUpdateHandler = function(bean, propertyName, index, count, newElements) {
    var array = bean[propertyName];
    var listenerList = this.listeners.get(bean);
    if (exists(listenerList)) {
        var n = listenerList.length;
        for (var i = 0; i < n; i++) {
            var entry = listenerList[i];
            var element = entry.element;
            var path = entry.rootPath + '.' + propertyName;

            for (var pos = index; pos < array.length; pos++) {
                this.unbind(element, path + '.' + pos, array[pos]);
            }

            if (typeof newElements === 'undefined') {
                element.splice(path, index, count);
            } else {
                element.splice(path, index, count, newElements);
            }

            for (pos = index; pos < array.length; pos++) {
                this.bind(element, path + '.' + pos, array[pos]);
            }
        }
    } else {
        if (typeof newElements === 'undefined') {
            array.splice(index, count);
        } else {
            array.splice(index, count, newElements);
        }
    }
};


Binder.prototype.bind = function (element, rootPath, value) {
    if (typeof value !== 'object') {
        return;
    }
    var listenerList = this.listeners.get(value);
    if (!exists(listenerList)) {
        listenerList = [];
        this.listeners.set(value, listenerList);
    }
    listenerList.push({element: element, rootPath: rootPath});

    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            this.bind(element, rootPath + '.' + i, value[i]);
        }
    } else if (typeof value === 'object') {
        for (var propertyName in value) {
            this.bind(element, rootPath + '.' + propertyName, value[propertyName]);
        }
    }
};

Binder.prototype.unbind = function (element, rootPath, value) {
    if (typeof value !== 'object') {
        return;
    }
    var listenerList = this.listeners.get(value);
    if (exists(listenerList)) {
        var n = listenerList.length;
        for (var i = 0; i < n; i++) {
            var entry = listenerList[i];
            if (entry.element === element && entry.rootPath === rootPath) {
                listenerList.splice(i, 1);

                if (Array.isArray(value)) {
                    for (var j = 0; j < value.length; j++) {
                        this.unbind(element, rootPath + '.' + j, value[j]);
                    }
                } else if (typeof value === 'object') {
                    for (var propertyName in value) {
                        this.unbind(element, rootPath + '.' + propertyName, value[propertyName]);
                    }
                }
                return;
            }
        }
    }
};



exports.Binder = Binder;
