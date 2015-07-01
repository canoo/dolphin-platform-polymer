/* global dolphin */
"use strict";

var expect = require('chai').expect;
var sinon = require('sinon');

var createBaseBehavior = require('../../src/base-behavior.js').createBaseBehavior;


var dolphin = {
    setAttribute: function() {},
    onUpdated: function() {}
};

var CustomElement = Polymer({
    is: 'custom-element',
    behaviors: [createBaseBehavior(dolphin)],
    observers: ['propertyChanged(*)'],
    propertyChanged: function() {}
});


describe('Simple Binding of a Dolphin Bean', function() {

    var element, bean;

    beforeEach(function() {
        //callback = null;
        //
        //dolphin.updateList = sinon.spy();
        //dolphin.setAttribute = sinon.spy(),
        //    onUpdated: function(cb) { callback = cb; }
        //};
        //
        //CustomElement = Polymer({
        //    is: 'custom-element',
        //    behaviors: [createBaseBehavior(dolphin)],
        //    observers: ['propertyChanged(*)'],
        //    propertyChanged: sinon.spy()
        //});

        element = new CustomElement();
        bean = { theProperty: 'VALUE_1' };
    });

    it('should set the initial value', function() {
        element.bind('theBean', bean);

        expect(element.theBean.theProperty).to.equal('VALUE_1');
    });

    it('should synchronize changes coming from Dolphin', sinon.test(function() {
        var callback = null;
        dolphin.onUpdated = function(cb) { callback = cb; };
        element.propertyChanged = sinon.stub();

        element.bind('theBean', bean);
        callback(bean, 'theProperty', 'VALUE_2', 'VALUE_1');

        sinon.assert.calledWith(element.propertyChanged, {path: 'theBean.theProperty', value: 'VALUE_2', base: null});
    }));

    it('should synchronize changes coming from Polymer', sinon.test(function() {
        this.spy(dolphin, 'setAttribute');

        element.bind('theBean', bean);
        element.set('theBean.theProperty', 'VALUE_3');

        sinon.assert.calledWith(dolphin.setAttribute, bean, 'theProperty', 'VALUE_3');
    }));
});

describe('Simple Binding of an Array', function() {

    it('should bind a String property', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));
});

describe('Deep Binding of a Dolphin Bean', function() {

    it('should bind a simple Dolphin Bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind a Bean within a Bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind a Bean within a Bean within a Bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind an Array within a Bean within a Bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind an Array within a Bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind a Bean within an Array within a Bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind an Array within an Array within a Bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));
});




describe('Deep Binding of an Array', function() {

    it('should bind a simple Dolphin Bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind a Bean within an Array', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind a Bean within a Bean within an Array', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind an Array within a Bean within an Array', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind an Array within an Array', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind a Bean within an Array within an Array', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));

    it('should bind an Array within an Array within an Array', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));
});
