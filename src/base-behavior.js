/*jslint browserify: true */
/* global Polymer */
"use strict";

var Binder = require('./deep-bind.js').Binder;

function createBaseBehavior(dolphin) {

    var binder = new Binder(dolphin);

    return {

        bind: function(propertyName, newValue) {
            var oldValue = this[propertyName];
            this[propertyName] = newValue;
            var eventName = Polymer.CaseMap.camelToDashCase(propertyName) + '-changed';
            this.unlisten(this, eventName, '_dolphinObserver');
            this.listen(this, eventName, '_dolphinObserver');
            if (exists(oldValue)) {
                binder.unbind(this, propertyName, oldValue);
            }
            binder.bind(this, propertyName, newValue);
        },

        _dolphinObserver: function(event) {
            var path = event.detail.path;
            var newValue = event.detail.value;

            //if (exists(changeRecord.indexSplices)) {
                //var listName = path.find(/\.([^\.]*)\.splices$/);
                //dolphin.updateList(bean, listName, changeRecord.indexSplices);
                // TODO: Unbind all removed elements
                // for all removed elements
                //     deepUnbind(this, path
                // TODO: Bind to all added elements
            //} else {
                var bean = navigateToBean(this, path);
                if (bean !== null) {
                    var propertyName = path.match(/[^\.]+$/);
                    var oldValue = dolphin.setAttribute(bean, propertyName[0], newValue);
                    if (oldValue !== null) {
                        binder.unbind(this, path, oldValue);
                    }
                    binder.bind(this, path, newValue);
                }
            //}
        }
    };
}


function exists(object) {
    return typeof object !== 'undefined' && object !== null;
}


function navigateToBean(element, path) {
    var navigation = path.match(/^(.*)\.[^\.]*$/);
    if (navigation === null) {
        return element;
    } else {
        return element.get(navigation[1], element);
    }
}



exports.createBaseBehavior = createBaseBehavior;