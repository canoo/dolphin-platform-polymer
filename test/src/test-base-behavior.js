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
    observers: ['changeObserver(*)'],
    changeObserver: function() {}
});


describe('Simple Binding of a Dolphin Bean', function() {

    it('should set the initial value', function() {
        var element = new CustomElement();
        var bean1 = { theProperty: 'VALUE_1' };
        var bean2 = { theProperty: 'VALUE_X' };

        element.bind('theBean', bean1);
        expect(element.theBean).to.equal(bean1);

        element.bind('theBean', bean2);
        expect(element.theBean).to.equal(bean2);
    });

    it('should synchronize changes coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var bean1 = { theProperty: 'VALUE_1' };
        var bean2 = { theProperty: 'VALUE_X' };
        var callback = null;
        dolphin.onUpdated = function(cb) { callback = cb; };
        this.stub(element, 'changeObserver');

        element.bind('theBean', bean1);
        callback(bean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.calledWith(element.changeObserver, {path: 'theBean.theProperty', value: 'VALUE_2', base: null});

        element.bind('theBean', bean2);
        callback(bean1, 'theProperty', 'VALUE_3', 'VALUE_2');
        sinon.assert.notCalled(element.changeObserver);
    }));

    it('should synchronize changes coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var bean1 = { theProperty: 'VALUE_1' };
        var bean2 = { theProperty: 'VALUE_X' };
        this.spy(dolphin, 'setAttribute');

        element.bind('theBean', bean1);
        element.set('theBean.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.setAttribute, bean1, 'theProperty', 'VALUE_2');
        dolphin.setAttribute.reset();

        element.bind('theBean', bean2);
        element.set('theBean.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.setAttribute, bean2, 'theProperty', 'VALUE_3');
    }));
});

describe('Simple Binding of an Array', function() {

    it('should bind a String property', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));
});

describe('Deep Binding of a Dolphin Bean', function() {

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
