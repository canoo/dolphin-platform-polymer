/*jslint browserify: true */
"use strict";


function Binder(dolphin) {
    dolphin.onUpdated(onUpdatedHandler);
}


function onUpdatedHandler() {

}


Binder.prototype.bind = function (element, rootPath, value) {
    switch (typeof value) {
        case 'object':
            // TODO Implement deepBind object
            // var model = dolphin.getModel(value);
            // for all properties of value
            //     var attribute = model.findAttributeByName(propertyName);
            //     attribute.onValueChange(function(event) {
            //
            //     });
            break;
        case 'array' :
            break;
    }
};

Binder.prototype.unbind = function () {

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
