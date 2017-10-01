/* Copyright 2015 Canoo Engineering AG.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global Polymer, console */
"use strict";

var Binder = require('./binder.js').Binder;

function exists(object) {
  return typeof object !== 'undefined' && object !== null;
}

var arrayKeyBug;
function polymer1_1hack(element, path) {
  // This is a temporary hack to deal with Polymer's API consistency concerning arrays and paths.
  // An observer uses keys in an array, while the get() and set() methods expect the index.
  // This is hopefully fixed in Polymer 1.2.
  do {
    var pathElements = path.match(/^([^\.]+)\.(.*)$/);
    var key = pathElements !== null ? pathElements[1] : path;
    path = pathElements !== null ? pathElements[2] : null;

    if (Array.isArray(element)) {
      var arrayKey = parseInt(key);
      if (isNaN(arrayKey)) {
        element = element[key];
      }
      else {
        var collection = Polymer.Collection.get(element);
        element = collection.getItem(arrayKey);
      }
    }
    else {
      element = element[key];
    }
  }
  while (path !== null && exists(element));

  return element;
}

function navigateToBean(element, path) {
  var navigation = path.match(/^(.*)\.[^\.]*$/);
  if (!exists(navigation)) {
    return element;
  }
  else {
    if (!exists(arrayKeyBug)) {
      arrayKeyBug = typeof Polymer.version !== 'string' || (Polymer.version.match(/^1\.[01]\./) !== null);
    }
    return arrayKeyBug ? polymer1_1hack(element, navigation[1]) : element.get(navigation[1], element);
  }
}

function setupCreateBehavior(clientContext) {
  var binder = new Binder(clientContext.beanManager);

  return function (controllerName) {
    var state = 'INITIALIZING';
    return {
      properties: {
        model: {
          type: Object,
          value: function () { return {}; }
        }
      },

      observers: ['_dolphinObserver(model.*)'],

      created: function () {
        var self = this;
        clientContext.createController(controllerName).then(function (controller) {
          self._controller = controller;
          state = 'READY';
          self.set('model', controller.model);

          self.fire('controller-ready');

          controller.onDestroyed(function () {
            state = 'DESTROYED';
            self.set('model', null);
            self.fire('controller-destroyed');
          });
        });
      },

      invoke: function (actionName, params) {
        // TODO Call this after init has finished
        if (state !== 'READY') {
          console.warn('Controller.invoke() called before init() finished');
          return;
        }
        return this._controller.invoke(actionName, params);
      },

      destroy: function () {
        this._controller.destroy();
      },

      _dolphinObserver: function (event) {
        if (state !== 'READY') {
          return;
        }
        var path = event.path;
        var bean, propertyName, i, j;
        var newValue = event.value;

        if (exists(newValue) && exists(newValue.indexSplices)) {
          path = path.substr(0, path.length - ".splices".length);
          bean = navigateToBean(this, path);
          if (exists(bean)) {
            propertyName = path.match(/[^\.]+$/);
            var n = newValue.indexSplices.length;
            for (i = 0; i < n; i++) {
              var change = newValue.indexSplices[i];
              clientContext.beanManager.notifyArrayChange(bean, propertyName[0], change.index, change.addedCount, change.removed);

              var array = bean[propertyName[0]];
              for (j = 0; j < change.removed.length; j++) {
                binder.unbind(this, path + '.' + (change.index + j), change.removed[j]);
              }
              for (j = change.index + change.addedCount; j < array.length; j++) {
                var oldPos = j - change.addedCount + change.removed.length;
                binder.unbind(this, path + '.' + oldPos, array[j]);
              }
              for (j = change.index; j < array.length; j++) {
                binder.bind(this, path + '.' + j, array[j]);
              }
            }
          }
        }
        else {
          bean = navigateToBean(this, path);
          if (exists(bean) && !Array.isArray(bean) && !Array.isArray(newValue)) {
            propertyName = path.match(/[^\.]+$/);
            var oldValue = clientContext.beanManager.notifyBeanChange(bean, propertyName[0], newValue);
            if (exists(oldValue)) {
              binder.unbind(this, path, oldValue);
            }
            if (exists(newValue)) {
              binder.bind(this, path, newValue);
            }
          }
        }
      }
    };
  };
}

exports.setupCreateBehavior = setupCreateBehavior;