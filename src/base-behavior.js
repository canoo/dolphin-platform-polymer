/*jslint browserify: true */
"use strict";

var Binder = require('./deep-bind.js').Binder;

function createBaseBehavior(dolphin) {

    var binder = new Binder(dolphin);

    return {
        observers: [ '_dolphinObserver(*)' ],

        bind: function(propertyName, value) {
            this[propertyName] = value;
            binder.bind(dolphin, this, propertyName, value);
        },

        _dolphinObserver: function(changeRecord) {

            var bean = navigateToBean(this, changeRecord.path);
            if (bean !== null) {
                if (exists(changeRecord.indexSplices)) {
                    var listName = path.find(/\.([^\.]*)\.splices$/);
                    dolphin.updateList(bean, listName, changeRecord.indexSplices);
                    // TODO: Unbind all removed elements
                    // for all removed elements
                    //     deepUnbind(this, path
                    // TODO: Bind to all added elements
                } else {
                    var propertyName = path.find(/\.([^\.]*)$/);
                    dolphin.setAttribute(bean, propertyName, changeRecord.value);
                    // TODO: Unbind removed element
                    // TODO: Bind to new element
                }
            }
        }
    };
}



function navigateToBean(element, path) {
    // TODO navigate to presentation model before end
    // Split path in array of path elements
    // result := first path element
    // for each remaining path element except the last and eventually minus ".splices"
    //     if (element is Number && result is array && array is large enough)
    //         result = result[i]
    //     else if (result is object and result hasProperty(propertyName))
    //         result = result[propertyName]
    //     else
    //         return null
    // return result
}



exports.createBaseBehavior = createBaseBehavior;