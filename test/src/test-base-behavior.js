/* global dolphin */
"use strict";

var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

var createBaseBehavior = require('../../src/base-behavior.js').createBaseBehavior;

var injectUpdateFromDolphin = null;
var injectArrayUpdateFromDolphin = null;

var dolphin = {
    notifyAttributeChange: function() {},
    onUpdated: function(func) { injectUpdateFromDolphin = func; },
    onArrayUpdate: function(func) { injectArrayUpdateFromDolphin = func;},
    notifyArrayChange: function() {}
};

var CustomElement = Polymer({
    is: 'custom-element',
    behaviors: [createBaseBehavior(dolphin)],
    observers: ['beanChangeObserver(theBean.*)'],
    beanChangeObserver: function(obj) {}
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
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');
        notifyAttributeChangeStub.returns('VALUE_1');

        element.bind('theBean', bean);

        element.set('theBean.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, bean, 'theProperty', 'VALUE_2');
    }));



    it('should not synchronize changes coming from Polymer from an unbound bean', sinon.test(function() {
        var element = new CustomElement();
        var bean1 = { theProperty: 'VALUE_1' };
        var bean2 = { theProperty: 'VALUE_X' };
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        notifyAttributeChangeStub.returns('VALUE_X');

        element.set('theBean.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, bean2, 'theProperty', 'VALUE_3');
    }));
});





describe('Simple Binding of an Array', function() {

    it('should set the initial value', function() {
        var element = new CustomElement();
        var bean1 = { theArray: [1, 2, 3] };
        var bean2 = { theArray: [42] };

        element.bind('theBean', bean1);
        expect(element.theBean).to.deep.equal(bean1);

        element.bind('theBean', bean2);
        expect(element.theBean).to.deep.equal(bean2);
    });



    it('should synchronize new array element coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theArray: [1, 2, 3] };
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.beanChangeObserver.reset();

        var argsMatcher = {
            path: 'theBean.theArray.splices',
            base: sinon.match(bean),
            value: sinon.match(function(value) {
                if (!Array.isArray(value.indexSplices) || value.indexSplices.length === 0) {
                    return false;
                }
                var indexSplices = value.indexSplices[0];
                return indexSplices.index === 1
                    && _.isEmpty(indexSplices.removed)
                    && indexSplices.addedCount === 1;
            })
        };
        var spyWithExpectation = element.beanChangeObserver.withArgs(sinon.match(argsMatcher));

        injectArrayUpdateFromDolphin(bean, 'theArray', 1, 0, 42);

        sinon.assert.calledOnce(spyWithExpectation);
    }));



    it('should synchronize element removal coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theArray: [1, 2, 3] };
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.beanChangeObserver.reset();

        var argsMatcher = {
            path: 'theBean.theArray.splices',
            base: sinon.match(bean),
            value: sinon.match(function(value) {
                if (!Array.isArray(value.indexSplices) || value.indexSplices.length === 0) {
                    return false;
                }
                var indexSplices = value.indexSplices[0];
                return indexSplices.index === 1
                    && _.isEqual(indexSplices.removed, [2])
                    && indexSplices.addedCount === 0;
            })
        };
        var spyWithExpectation = element.beanChangeObserver.withArgs(sinon.match(argsMatcher));

        injectArrayUpdateFromDolphin(bean, 'theArray', 1, 1);

        sinon.assert.calledOnce(spyWithExpectation);
    }));



    it('should synchronize replacing an element coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theArray: [1, 2, 3] };
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.beanChangeObserver.reset();

        var argsMatcher = {
            path: 'theBean.theArray.splices',
            base: sinon.match(bean),
            value: sinon.match(function(value) {
                if (!Array.isArray(value.indexSplices) || value.indexSplices.length === 0) {
                    return false;
                }
                var indexSplices = value.indexSplices[0];
                return indexSplices.index === 1
                    && _.isEqual(indexSplices.removed, [2])
                    && indexSplices.addedCount === 1;
            })
        };
        var spyWithExpectation = element.beanChangeObserver.withArgs(sinon.match(argsMatcher));

        injectArrayUpdateFromDolphin(bean, 'theArray', 1, 1, 42);

        sinon.assert.calledOnce(spyWithExpectation);
    }));



    it('should not synchronize changes coming from Dolphin from an unbound bean', sinon.test(function() {
        var element = new CustomElement();
        var bean1 = { theArray: [1, 2, 3] };
        var bean2 = { theArray: [42] };
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        element.beanChangeObserver.reset();

        injectArrayUpdateFromDolphin(bean1, 'theArray', 1, 0, 42);
        sinon.assert.notCalled(element.beanChangeObserver);
    }));



    it('should synchronize new array element coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theArray: [1, 2, 3] };
        this.spy(dolphin, 'notifyArrayChange');

        element.bind('theBean', bean);

        element.splice('theBean.theArray', 1, 0, 42);
        sinon.assert.calledWithExactly(dolphin.notifyArrayChange, bean, 'theArray', 1, 1, []);
    }));



    it('should synchronize new array element coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theArray: [1, 2, 3] };
        this.spy(dolphin, 'notifyArrayChange');

        element.bind('theBean', bean);

        element.splice('theBean.theArray', 1, 1);
        sinon.assert.calledWithExactly(dolphin.notifyArrayChange, bean, 'theArray', 1, 0, [2]);
    }));



    it('should synchronize element removal coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var bean = { theArray: [1, 2, 3] };
        this.spy(dolphin, 'notifyArrayChange');

        element.bind('theBean', bean);

        element.splice('theBean.theArray', 1, 1, 42);
        sinon.assert.calledWithExactly(dolphin.notifyArrayChange, bean, 'theArray', 1, 1, [2]);
    }));



    it('should not synchronize changes coming from Polymer from an unbound bean', sinon.test(function() {
        var element = new CustomElement();
        var bean1 = { theArray: [1, 2, 3] };
        var bean2 = { theArray: [42] };
        this.spy(dolphin, 'notifyArrayChange');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);

        element.splice('theBean.theArray', 1, 0, 42);
        sinon.assert.calledWithExactly(dolphin.notifyArrayChange, bean2, 'theArray', 1, 1, []);
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
        expect(element.theBean).to.deep.equal(bean1);

        element.bind('theBean', bean2);
        expect(element.theBean).to.deep.equal(bean2);
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



    it('should synchronize changes of a property coming from Dolphin from a re-bound root Bean', sinon.test(function() {
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

        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.innerBean.theProperty', value: 'VALUE_Y', base: bean2});
    }));



    it('should synchronize changes of a property coming from Dolphin from a nested Bean that was re-bound through Dolphin', sinon.test(function() {
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

        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.innerBean.theProperty', value: 'VALUE_Y', base: bean});
    }));



    it('should synchronize changes of a property coming from Dolphin from a nested Bean that was re-bound through Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        this.spy(element, 'beanChangeObserver');
        this.stub(dolphin, 'notifyAttributeChange').returns(innerBean1);

        element.bind('theBean', bean);
        element.set('theBean.innerBean', innerBean2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);

        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.innerBean.theProperty', value: 'VALUE_Y', base: bean});
    }));



    it('should synchronize changes of the nested Bean coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_2' };
        var bean = { innerBean: innerBean1};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');
        notifyAttributeChangeStub.returns(innerBean1);

        element.bind('theBean', bean);

        element.set('theBean.innerBean', innerBean2);
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, bean, 'innerBean', innerBean2);
    }));



    it('should synchronize changes of a property of the nested Bean coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean = { theProperty: 'VALUE_1' };
        var bean = { innerBean: innerBean};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');
        notifyAttributeChangeStub.returns('VALUE_1');

        element.bind('theBean', bean);

        element.set('theBean.innerBean.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean, 'theProperty', 'VALUE_2');
    }));



    it('should synchronize changes of a property coming from Polymer from a re-bound root Bean', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var bean1 = { innerBean: innerBean1};
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean2 = { innerBean: innerBean2};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');

        element.bind('theBean', bean1);
        element.bind('theBean', bean2);
        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_X');

        element.set('theBean.innerBean.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean2, 'theProperty', 'VALUE_2');
    }));



    it('should synchronize changes of a property coming from Polymer from a nested bean that was re-bound through Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');

        element.bind('theBean', bean);
        injectUpdateFromDolphin(bean, 'innerBean', innerBean2, innerBean1);
        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_X');

        element.set('theBean.innerBean.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean2, 'theProperty', 'VALUE_2');
    }));



    it('should synchronize changes of a property coming from Polymer from a nested bean that was re-bound through Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');
        notifyAttributeChangeStub.returns(innerBean1);

        element.bind('theBean', bean);
        element.set('theBean.innerBean', innerBean2);
        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_X');

        element.set('theBean.innerBean.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean2, 'theProperty', 'VALUE_3');
    }));
});





describe('Deep Binding of a Bean within an Array', function() {

    it('should set the initial value', function() {
        var element = new CustomElement();
        var innerBean1a = { theProperty: 'VALUE_1a' };
        var innerBean1b = { theProperty: 'VALUE_1b' };
        var array1 = [innerBean1a, innerBean1b];
        var bean1 = { theArray: array1};
        var innerBean2a = { theProperty: 'VALUE_2a' };
        var innerBean2b = { theProperty: 'VALUE_2b' };
        var array2 = [innerBean2a, innerBean2b];
        var bean2 = { theArray: array2};

        element.bind('theBean', bean1);
        expect(element.theBean).to.deep.equal(bean1);

        element.bind('theBean', bean2);
        expect(element.theBean).to.deep.equal(bean2);
    });



    it('should synchronize changes of a property of the nested Bean coming from Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean = { theProperty: 'VALUE_1' };
        var array = [ innerBean ];
        var bean = { theArray: array};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.theArray.0.theProperty', value: 'VALUE_2', base: bean});
    }));



    it('should synchronize changes of a property of the nested Bean coming from Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean = { theProperty: 'VALUE_1' };
        var array = [ innerBean ];
        var bean = { theArray: array};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');

        element.bind('theBean', bean);
        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_1');

        element.set('theBean.theArray.0.theProperty', 'VALUE_2');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean, 'theProperty', 'VALUE_2');
    }));



    it('should synchronize changes of a property of the nested Bean from Dolphin that was replaced trough Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var innerBean3 = { theProperty: 'VALUE_A' };
        var array = [ innerBean1, innerBean3 ];
        var bean = { theArray: array};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        injectArrayUpdateFromDolphin(bean, 'theArray', 0, 1, innerBean2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);

        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.theArray.0.theProperty', value: 'VALUE_Y', base: bean});

        injectUpdateFromDolphin(innerBean3, 'theProperty', 'VALUE_B', 'VALUE_A');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.theArray.1.theProperty', value: 'VALUE_B', base: bean});
    }));



    it('should synchronize changes of a property of the nested Bean from Dolphin that was replaced trough Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var innerBean3 = { theProperty: 'VALUE_A' };
        var array = [ innerBean1, innerBean3 ];
        var bean = { theArray: array};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        element.splice('theBean.theArray', 0, 1, innerBean2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);

        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.theArray.0.theProperty', value: 'VALUE_Y', base: bean});

        injectUpdateFromDolphin(innerBean3, 'theProperty', 'VALUE_B', 'VALUE_A');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.theArray.1.theProperty', value: 'VALUE_B', base: bean});
    }));



    it('should synchronize changes of a property of the nested Bean from Polymer that was replaced trough Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var innerBean3 = { theProperty: 'VALUE_A' };
        var array = [ innerBean1, innerBean3 ];
        var bean = { theArray: array};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');
        notifyAttributeChangeStub.returns(innerBean1);

        element.bind('theBean', bean);
        injectArrayUpdateFromDolphin(bean, 'theArray', 0, 1, innerBean2);
        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_X');

        element.set('theBean.theArray.0.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean2, 'theProperty', 'VALUE_3');

        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_A');

        element.set('theBean.theArray.1.theProperty', 'VALUE_B');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean3, 'theProperty', 'VALUE_B');
    }));



    it('should synchronize changes of a property of the nested Bean from Polymer that was replaced trough Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var innerBean3 = { theProperty: 'VALUE_A' };
        var array = [ innerBean1, innerBean3 ];
        var bean = { theArray: array};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');
        notifyAttributeChangeStub.returns(innerBean1);

        element.bind('theBean', bean);
        element.splice('theBean.theArray', 0, 1, innerBean2);
        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_X');

        element.set('theBean.theArray.0.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean2, 'theProperty', 'VALUE_3');

        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_A');

        element.set('theBean.theArray.1.theProperty', 'VALUE_B');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean3, 'theProperty', 'VALUE_B');
    }));



    it('should synchronize changes of a property of the nested Bean from Dolphin where the array was replaced trough Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var array1 = [ innerBean1 ];
        var innerBean2 = { theProperty: 'VALUE_X' };
        var array2 = [ innerBean2 ];
        var bean = { theArray: array1};
        this.spy(element, 'beanChangeObserver');

        element.bind('theBean', bean);
        injectUpdateFromDolphin(bean, 'theArray', array2, array1);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);

        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.theArray.0.theProperty', value: 'VALUE_Y', base: bean});
    }));



    it('should synchronize changes of a property of the nested Bean from Dolphin where the array was replaced trough Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var array1 = [ innerBean1 ];
        var innerBean2 = { theProperty: 'VALUE_X' };
        var array2 = [ innerBean2 ];
        var bean = { theArray: array1};
        this.spy(element, 'beanChangeObserver');
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');
        notifyAttributeChangeStub.returns(array1);

        element.bind('theBean', bean);
        element.set('theBean.theArray', array2);
        element.beanChangeObserver.reset();

        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
        sinon.assert.notCalled(element.beanChangeObserver);

        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
        sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'theBean.theArray.0.theProperty', value: 'VALUE_Y', base: bean});
    }));



    it('should synchronize changes of a property of the nested Bean from Polymer where the array was replaced trough Dolphin', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var array1 = [ innerBean1 ];
        var innerBean2 = { theProperty: 'VALUE_X' };
        var array2 = [ innerBean2 ];
        var bean = { theArray: array1};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');

        element.bind('theBean', bean);
        injectUpdateFromDolphin(bean, 'theArray', array2, array1);
        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_X');

        element.set('theBean.theArray.0.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean2, 'theProperty', 'VALUE_3');
    }));



    it('should synchronize changes of a property of the nested Bean from Polymer where the array was replaced trough Polymer', sinon.test(function() {
        var element = new CustomElement();
        var innerBean1 = { theProperty: 'VALUE_1' };
        var array1 = [ innerBean1 ];
        var innerBean2 = { theProperty: 'VALUE_X' };
        var array2 = [ innerBean2 ];
        var bean = { theArray: array1};
        var notifyAttributeChangeStub = this.stub(dolphin, 'notifyAttributeChange');
        notifyAttributeChangeStub.returns(array1);

        element.bind('theBean', bean);
        element.set('theBean.theArray', array2);
        notifyAttributeChangeStub.reset();
        notifyAttributeChangeStub.returns('VALUE_X');

        element.set('theBean.theArray.0.theProperty', 'VALUE_3');
        sinon.assert.calledWithExactly(dolphin.notifyAttributeChange, innerBean2, 'theProperty', 'VALUE_3');
    }));
});

