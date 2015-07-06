/* global dolphin */
"use strict";

var expect = require('chai').expect;
var sinon = require('sinon');

var createBaseBehavior = require('../../src/base-behavior.js').createBaseBehavior;

var injectUpdateFromDolphin = null;
var injectArrayUpdateFromDolphin = null;

var dolphin = {
    setAttribute: function() {},
    onUpdated: function(func) { injectUpdateFromDolphin = func; },
    onArrayUpdate: function(func) { injectArrayUpdateFromDolphin = func; }
};

var CustomElement = Polymer({
    is: 'custom-element',
    behaviors: [createBaseBehavior(dolphin)],
    observers: ['beanChangeObserver(theBean.*)'],
    beanChangeObserver: function(obj) {
        console.log(obj);
    }
});


describe('Simple Binding of a Dolphin Bean', function() {

    it('should set the initial value', function() {
        var element = new CustomElement();
        var bean1 = { theProperty: 'VALUE_1' };
        var bean2 = { theProperty: 'VALUE_X' };

        element.bind('theBean', bean1);
        expect(element.theBean).to.equal(bean1);
        expect(element.theBean.theProperty).to.equal('VALUE_1');

        element.bind('theBean', bean2);
        expect(element.theBean).to.equal(bean2);
        expect(element.theBean.theProperty).to.equal('VALUE_X');
    });



    it('should synchronize changes coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theProperty: 'VALUE_1' };
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(bean, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.theProperty', value: 'VALUE_2', base: bean});
    }));



    it('should not synchronize changes coming from Dolphin from an unbound bean', sinon.test(function() {
        var element = new CustomElement();
        var bean1 = { theProperty: 'VALUE_1' };
        var bean2 = { theProperty: 'VALUE_X' };
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(bean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);
    }));



    it('should synchronize changes coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theProperty: 'VALUE_1' };
        var setAttributeStub = this.stub(dolphin, 'setAttribute');
        setAttributeStub.returns('VALUE_1');

        element.bind('theBean', bean);

        element.set('theBean.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.setAttribute, bean, 'theProperty', 'VALUE_2');
    }));



    it('should not synchronize changes coming from Polymer from an unbound bean', sinon.test(function() {
        var element = new CustomElement();
        var bean1 = { theProperty: 'VALUE_1' };
        var bean2 = { theProperty: 'VALUE_X' };
        var setAttributeStub = this.stub(dolphin, 'setAttribute');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        setAttributeStub.returns('VALUE_X');

        element.set('theBean.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.setAttribute, bean2, 'theProperty', 'VALUE_3');
    }));
});





describe('Simple Binding of an Array', function() {

    it('should set the initial value', function() {
        var element = new CustomElement();
        var bean1 = { theArray: [1, 2, 3] };
        var bean2 = { theArray: [42] };

        element.bind('theBean', bean1);
        expect(element.theBean).to.equal(bean1);
        expect(element.theBean.theArray).to.deep.equal([1, 2, 3]);

        element.bind('theBean', bean2);
        expect(element.theBean).to.equal(bean2);
        expect(element.theBean.theArray).to.deep.equal([42]);
    });



    it('should synchronize changes coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theArray: [1, 2, 3] };
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.beanChangeObserver.reset();

        // sinon checks arguments at the time of assertion and not at the time of the call, thus we need to set the expectation upfront
        var argsMatcher = {
            path: 'theBean.theArray.splices',
            base: sinon.match(bean),
            value: sinon.match(function(value) {
                if (!Array.isArray(value.indexSplices) || value.indexSplices.length === 0) {
                    return false;
                }
                var indexSplices = value.indexSplices[0];
                return indexSplices.index === 1
                        && (typeof indexSplices.removed === 'undefined' || indexSplices.removed === null || (Array.isArray(indexSplices.removed) && indexSplices.removed.length === 0))
                        && indexSplices.addedCount === 1;
            })
        };
        var spyWithExpectation = element.beanChangeObserver.withArgs(sinon.match(argsMatcher));

        injectArrayUpdateFromDolphin(bean, 'theArray', 1, 0, 42);

        sinon.assert.calledOnce(spyWithExpectation);
    }));



    it('should not synchronize changes coming from Dolphin from an unbound bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");

        var element = new CustomElement();
        var bean1 = { theArray: [1, 2, 3] };
        var bean2 = { theArray: [42] };
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(bean1, 'theArray', [4, 5, 6], [1, 2, 3]);
        sinon.assert.notCalled(element.beanChangeObserver);
    }));



    it('should synchronize changes coming from Polymer', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");

        var element = new CustomElement();
        var bean = { theArray: [1, 2, 3] };
        var setAttributeStub = this.spy(dolphin, 'setAttribute');
        setAttributeStub.returns([1, 2, 3]);

        element.bind('theBean', bean);

        element.set('theBean.theArray', [4, 5, 6]);
        sinon.assert.calledWithExactly(dolphin.setAttribute, bean, 'theArray', [4, 5, 6]);
    }));



    it('should not synchronize changes coming from Polymer from an unbound bean', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");

        var element = new CustomElement();
        var bean1 = { theArray: [1, 2, 3] };
        var bean2 = { theArray: [42] };
        var setAttributeStub = this.spy(dolphin, 'setAttribute');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        setAttributeStub.returns([42]);

        element.set('theBean.theArray', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.setAttribute, bean2, 'theArray', 'VALUE_3');
    }));
});





describe('Deep Binding of a Bean within a Bean', function() {

    it('should set the initial value', function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var bean1 = { innerBean: innerBean1};
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean2 = { innerBean: innerBean2};

        element.bind('theBean', bean1);
        expect(element.theBean).to.equal(bean1);
        expect(element.theBean.innerBean).to.equal(innerBean1);

        element.bind('theBean', bean2);
        expect(element.theBean).to.equal(bean2);
        expect(element.theBean.innerBean).to.equal(innerBean2);
    });



    it('should synchronize changes of the nested Bean coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_2' };
        var bean = { innerBean: innerBean1};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(bean, 'innerBean', innerBean2, innerBean1);
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.innerBean', value: innerBean2, base: bean});
    }));



    it('should synchronize changes of a property of the nested Bean coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean = { theProperty: 'VALUE_1' };
        var bean = { innerBean: innerBean};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.innerBean.theProperty', value: 'VALUE_2', base: bean});
    }));



    it('should not synchronize changes coming from Dolphin from an unbound root Bean', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var bean1 = { innerBean: innerBean1};
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean2 = { innerBean: innerBean2};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);
    }));



    it('should not synchronize changes coming from Dolphin from a nested Bean that was unbound through Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        injectUpdateFromDolphin(bean, 'innerBean', innerBean2, innerBean1);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);
    }));



    it('should not synchronize changes coming from Dolphin from a nested Bean that was unbound through Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        this.spy(element, 'beanChangeObserver');
        this.stub(dolphin, 'setAttribute').returns(innerBean1);

        element.bind('theBean', bean);
        element.set('theBean.innerBean', innerBean2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);
    }));



    it('should synchronize changes of the nested Bean coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_2' };
        var bean = { innerBean: innerBean1};
        var setAttributeStub = this.stub(dolphin, 'setAttribute');
        setAttributeStub.returns(innerBean1);

        element.bind('theBean', bean);

        element.set('theBean.innerBean', innerBean2);
        sinon.assert.calledWithExactly(dolphin.setAttribute, bean, 'innerBean', innerBean2);
    }));



    it('should synchronize changes of a property of the nested Bean coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean = { theProperty: 'VALUE_1' };
        var bean = { innerBean: innerBean};
        var setAttributeStub = this.stub(dolphin, 'setAttribute');
        setAttributeStub.returns('VALUE_1');

        element.bind('theBean', bean);

        element.set('theBean.innerBean.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.setAttribute, innerBean, 'theProperty', 'VALUE_2');
    }));



    it('should not synchronize changes coming from Dolphin from an unbound root Bean', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var bean1 = { innerBean: innerBean1};
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean2 = { innerBean: innerBean2};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);
    }));



    it('should not synchronize changes coming from Polymer from a nested bean that was unbound through Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        var setAttributeStub = this.stub(dolphin, 'setAttribute');

        element.bind('theBean', bean);
        injectUpdateFromDolphin(bean, 'innerBean', innerBean2, innerBean1);
        setAttributeStub.reset();
        setAttributeStub.returns('VALUE_X');

        element.set('theBean.innerBean.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.setAttribute, innerBean2, 'theProperty', 'VALUE_2');
    }));



    it('should not synchronize changes coming from Polymer from a nested bean that was unbound through Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        var setAttributeStub = this.stub(dolphin, 'setAttribute');
        setAttributeStub.returns(innerBean1);

        element.bind('theBean', bean);
        element.set('theBean.innerBean', innerBean2);
        setAttributeStub.reset();
        setAttributeStub.returns('VALUE_X');

        element.set('theBean.innerBean.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.setAttribute, innerBean2, 'theProperty', 'VALUE_3');
    }));
});





describe('Deep Binding of an Array within an Array', function() {

    it('tests not defined yet', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));
});





describe('Deep Binding of an Array within a Bean', function() {

    it('tests not defined yet', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));
});





describe('Deep Binding of a Bean within an Array', function() {

    it('tests not defined yet', sinon.test(function() {
        expect.fail(null, null, "Test not implemented yet");
    }));
});
