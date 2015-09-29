/* global dolphin */
"use strict";

var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');
var Promise = require('../../bower_components/core.js/library/fn/promise');

var setupCreateBehavior = require('../../src/behavior.js').setupCreateBehavior;



var injectUpdateFromDolphin = null;
var injectArrayUpdateFromDolphin = null;

var clientContext = {
    beanManager: {
        onBeanUpdate: function(func) { injectUpdateFromDolphin = func; },
        onArrayUpdate: function(func) { injectArrayUpdateFromDolphin = func;},
        notifyBeanChange: function() {},
        notifyArrayChange: function() {}
    },
    createController: function() {
        return Promise.resolve({ model: {} })
    }
};

var createBehavior = setupCreateBehavior(clientContext);

var CustomElement = Polymer({
    is: 'custom-element',
    behaviors: [createBehavior('ControllerName')],
    observers: ['beanChangeObserver(model.*)'],
    beanChangeObserver: function(obj) {}
});





describe('Simple Binding of a Dolphin Bean', function() {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });



    it('should set the initial value', function(done) {
        var bean = { theProperty: 'VALUE_1' };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();

        setTimeout(function () {
            expect(element.model).to.equal(bean);
            expect(element.model.theProperty).to.equal('VALUE_1');

            done();
        });
    });



    it('should synchronize changes coming from Dolphin', function(done) {
        var bean = { theProperty: 'VALUE_1' };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function () {
            element.beanChangeObserver.reset();

            injectUpdateFromDolphin(bean, 'theProperty', 'VALUE_2', 'VALUE_1');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {path: 'model.theProperty', value: 'VALUE_2', base: bean});

            done();
        });
    });



    it('should synchronize changes coming from Polymer', function(done) {
        var bean = { theProperty: 'VALUE_1' };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');
        notifyBeanChangeStub.returns('VALUE_1');

        setTimeout(function() {
            element.set('model.theProperty', 'VALUE_2');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, bean, 'theProperty', 'VALUE_2');

            done();
        });
    });
});





describe('Simple Binding of an Array', function() {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });



    it('should set the initial value', function(done) {
        var bean = { theArray: [1, 2, 3] };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();

        setTimeout(function() {
            expect(element.model).to.deep.equal(bean);

            done();
        });
    });



    it('should synchronize new array element coming from Dolphin', function(done) {
        var bean = { theArray: [1, 2, 3] };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function() {
            element.beanChangeObserver.reset();

            var argsMatcher = {
                path: 'model.theArray.splices',
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

            done();
        });
    });



    it('should synchronize element removal coming from Dolphin', function(done) {
        var bean = { theArray: [1, 2, 3] };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function() {
            element.beanChangeObserver.reset();

            var argsMatcher = {
                path: 'model.theArray.splices',
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

            injectArrayUpdateFromDolphin(bean, 'theArray', 1, 1, undefined);

            sinon.assert.calledOnce(spyWithExpectation);

            done();
        });
    });



    it('should synchronize replacing an element coming from Dolphin', function(done) {
        var bean = { theArray: [1, 2, 3] };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function() {
            element.beanChangeObserver.reset();

            var argsMatcher = {
                path: 'model.theArray.splices',
                base: sinon.match(bean),
                value: sinon.match(function (value) {
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

            done();
        });
    });



    it('should synchronize new array element coming from Polymer', function(done) {
        var bean = { theArray: [1, 2, 3] };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(clientContext.beanManager, 'notifyArrayChange');

        setTimeout(function() {
            element.splice('model.theArray', 1, 0, 42);
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyArrayChange, bean, 'theArray', 1, 1, []);

            done();
        });
    });



    it('should synchronize element removal coming from Polymer', function(done) {
        var bean = { theArray: [1, 2, 3] };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(clientContext.beanManager, 'notifyArrayChange');

        setTimeout(function() {
            element.splice('model.theArray', 1, 1);
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyArrayChange, bean, 'theArray', 1, 0, [2]);

            done();
        });
    });



    it('should synchronize replacing an element coming from Polymer', function(done) {
        var bean = { theArray: [1, 2, 3] };
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(clientContext.beanManager, 'notifyArrayChange');

        setTimeout(function() {
            element.splice('model.theArray', 1, 1, 42);
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyArrayChange, bean, 'theArray', 1, 1, [2]);

            done();
        });
    });
});





describe('Deep Binding of a Bean within a Bean', function() {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });



    it('should set the initial value', function(done) {
        var innerBean = { theProperty: 'VALUE_1' };
        var bean = { innerBean: innerBean};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();

        setTimeout(function() {
            expect(element.model).to.deep.equal(bean);

            done();
        });
    });



    it('should synchronize changes of the nested Bean coming from Dolphin', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_2' };
        var bean = { innerBean: innerBean1};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function() {
            element.beanChangeObserver.reset();

            injectUpdateFromDolphin(bean, 'innerBean', innerBean2, innerBean1);
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.innerBean',
                value: innerBean2,
                base: bean
            });
            
            done();
        });
    });



    it('should synchronize changes of a property of the nested Bean coming from Dolphin', function(done) {
        var innerBean = { theProperty: 'VALUE_1' };
        var bean = { innerBean: innerBean};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function() {
            element.beanChangeObserver.reset();

            injectUpdateFromDolphin(innerBean, 'theProperty', 'VALUE_2', 'VALUE_1');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.innerBean.theProperty',
                value: 'VALUE_2',
                base: bean
            });

            done();
        });
    });



    it('should synchronize changes of a property coming from Dolphin from a nested Bean that was re-bound through Dolphin', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');
        sandbox.stub(clientContext.beanManager, 'notifyBeanChange').returns(innerBean1);

        setTimeout(function() {
            injectUpdateFromDolphin(bean, 'innerBean', innerBean2, innerBean1);
            element.beanChangeObserver.reset();

            injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
            sinon.assert.notCalled(element.beanChangeObserver);

            injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.innerBean.theProperty',
                value: 'VALUE_Y',
                base: bean
            });

            done();
        });
    });



    it('should synchronize changes of a property coming from Dolphin from a nested Bean that was re-bound through Polymer', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');
        sandbox.stub(clientContext.beanManager, 'notifyBeanChange').returns(innerBean1);

        setTimeout(function() {
            element.set('model.innerBean', innerBean2);
            element.beanChangeObserver.reset();

            injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
            sinon.assert.notCalled(element.beanChangeObserver);

            injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.innerBean.theProperty',
                value: 'VALUE_Y',
                base: bean
            });

            done();
        });
    });



    it('should synchronize changes of the nested Bean coming from Polymer', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_2' };
        var bean = { innerBean: innerBean1};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');
        notifyBeanChangeStub.returns(innerBean1);

        setTimeout(function() {
            element.set('model.innerBean', innerBean2);
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, bean, 'innerBean', innerBean2);

            done();
        });
    });



    it('should synchronize changes of a property of the nested Bean coming from Polymer', function(done) {
        var innerBean = { theProperty: 'VALUE_1' };
        var bean = { innerBean: innerBean};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');
        notifyBeanChangeStub.returns('VALUE_1');

        setTimeout(function() {
            element.set('model.innerBean.theProperty', 'VALUE_2');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean, 'theProperty', 'VALUE_2');

            done();
        });
    });



    it('should synchronize changes of a property coming from Polymer from a nested bean that was re-bound through Dolphin', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');

        setTimeout(function() {
            injectUpdateFromDolphin(bean, 'innerBean', innerBean2, innerBean1);
            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_X');

            element.set('model.innerBean.theProperty', 'VALUE_2');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean2, 'theProperty', 'VALUE_2');

            done();
        });
    });



    it('should synchronize changes of a property coming from Polymer from a nested bean that was re-bound through Polymer', function() {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var bean = { innerBean: innerBean1};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');
        notifyBeanChangeStub.returns(innerBean1);

        setTimeout(function() {
            element.set('model.innerBean', innerBean2);
            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_X');

            element.set('model.innerBean.theProperty', 'VALUE_3');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean2, 'theProperty', 'VALUE_3');

            done();
        });
    });
});





describe('Deep Binding of a Bean within an Array', function() {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });



    it('should set the initial value', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_2' };
        var array = [innerBean1, innerBean2];
        var bean = { theArray: array};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();

        setTimeout(function() {
            expect(element.model).to.deep.equal(bean);

            done();
        });
    });



    it('should synchronize changes of a property of the nested Bean coming from Dolphin', function(done) {
        var innerBean = { theProperty: 'VALUE_1' };
        var array = [ innerBean ];
        var bean = { theArray: array};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function() {
            element.beanChangeObserver.reset();

            injectUpdateFromDolphin(innerBean, 'theProperty', 'VALUE_2', 'VALUE_1');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.theArray.0.theProperty',
                value: 'VALUE_2',
                base: bean
            });

            done();
        });
    });



    it('should synchronize changes of a property of the nested Bean coming from Polymer', function(done) {
        var innerBean = { theProperty: 'VALUE_1' };
        var array = [ innerBean ];
        var bean = { theArray: array};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');

        setTimeout(function() {
            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_1');

            element.set('model.theArray.0.theProperty', 'VALUE_2');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean, 'theProperty', 'VALUE_2');

            done();
        });
    });



    it('should synchronize changes of a property of the nested Bean from Dolphin that was replaced through Dolphin', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var innerBean3 = { theProperty: 'VALUE_A' };
        var array = [ innerBean1, innerBean3 ];
        var bean = { theArray: array};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function() {
            injectArrayUpdateFromDolphin(bean, 'theArray', 0, 1, innerBean2);
            element.beanChangeObserver.reset();

            injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
            sinon.assert.notCalled(element.beanChangeObserver);

            injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.theArray.0.theProperty',
                value: 'VALUE_Y',
                base: bean
            });

            injectUpdateFromDolphin(innerBean3, 'theProperty', 'VALUE_B', 'VALUE_A');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.theArray.1.theProperty',
                value: 'VALUE_B',
                base: bean
            });

            done();
        });
    });



    it('should synchronize changes of a property of the nested Bean from Dolphin that was replaced through Polymer', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var innerBean3 = { theProperty: 'VALUE_A' };
        var array = [ innerBean1, innerBean3 ];
        var bean = { theArray: array};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        sandbox.spy(element, 'beanChangeObserver');

        setTimeout(function() {
            element.splice('model.theArray', 0, 1, innerBean2);
            element.beanChangeObserver.reset();

            injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
            sinon.assert.notCalled(element.beanChangeObserver);

            injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.theArray.0.theProperty',
                value: 'VALUE_Y',
                base: bean
            });

            injectUpdateFromDolphin(innerBean3, 'theProperty', 'VALUE_B', 'VALUE_A');
            sinon.assert.calledWithExactly(element.beanChangeObserver, {
                path: 'model.theArray.1.theProperty',
                value: 'VALUE_B',
                base: bean
            });

            done();
        });
    });



    it('should synchronize changes of a property of the nested Bean from Polymer that was replaced trough Dolphin', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var innerBean3 = { theProperty: 'VALUE_A' };
        var array = [ innerBean1, innerBean3 ];
        var bean = { theArray: array};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');
        notifyBeanChangeStub.returns(innerBean1);

        setTimeout(function() {
            injectArrayUpdateFromDolphin(bean, 'theArray', 0, 1, innerBean2);
            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_X');

            element.set('model.theArray.0.theProperty', 'VALUE_3');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean2, 'theProperty', 'VALUE_3');

            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_A');

            element.set('model.theArray.1.theProperty', 'VALUE_B');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean3, 'theProperty', 'VALUE_B');

            done();
        })
    });



    it('should synchronize changes of a property of the nested Bean from Polymer that was replaced trough Polymer', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var innerBean2 = { theProperty: 'VALUE_X' };
        var innerBean3 = { theProperty: 'VALUE_A' };
        var array = [ innerBean1, innerBean3 ];
        var bean = { theArray: array};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');
        notifyBeanChangeStub.returns(innerBean1);

        setTimeout(function() {
            element.splice('model.theArray', 0, 1, innerBean2);
            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_X');

            element.set('model.theArray.0.theProperty', 'VALUE_3');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean2, 'theProperty', 'VALUE_3');

            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_A');

            element.set('model.theArray.1.theProperty', 'VALUE_B');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean3, 'theProperty', 'VALUE_B');

            done();
        });
    });



    // TODO: Enable these tests once setting arrays is supported
    //it('should synchronize changes of a property of the nested Bean from Dolphin where the array was replaced trough Dolphin', function(done) {
    //    var innerBean1 = { theProperty: 'VALUE_1' };
    //    var array1 = [ innerBean1 ];
    //    var innerBean2 = { theProperty: 'VALUE_X' };
    //    var array2 = [ innerBean2 ];
    //    var bean = { theArray: array1};
    //    clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
    //    var element = new CustomElement();
    //    sandbox.spy(element, 'beanChangeObserver');
    //
    //    setTimeout(function() {
    //        injectUpdateFromDolphin(bean, 'theArray', array2, array1);
    //        element.beanChangeObserver.reset();
    //
    //        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
    //        sinon.assert.notCalled(element.beanChangeObserver);
    //
    //        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
    //        sinon.assert.calledWithExactly(element.beanChangeObserver, {
    //            path: 'model.theArray.0.theProperty',
    //            value: 'VALUE_Y',
    //            base: bean
    //        });
    //
    //        done();
    //    });
    //});



    //it('should synchronize changes of a property of the nested Bean from Dolphin where the array was replaced trough Polymer', function(done) {
    //    var innerBean1 = { theProperty: 'VALUE_1' };
    //    var array1 = [ innerBean1 ];
    //    var innerBean2 = { theProperty: 'VALUE_X' };
    //    var array2 = [ innerBean2 ];
    //    var bean = { theArray: array1};
    //    clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
    //    var element = new CustomElement();
    //    sandbox.spy(element, 'beanChangeObserver');
    //    var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');
    //    notifyBeanChangeStub.returns(array1);
    //
    //    setTimeout(function() {
    //        element.set('model.theArray', array2);
    //        element.beanChangeObserver.reset();
    //
    //        injectUpdateFromDolphin(innerBean1, 'theProperty', 'VALUE_2', 'VALUE_1');
    //        sinon.assert.notCalled(element.beanChangeObserver);
    //
    //        injectUpdateFromDolphin(innerBean2, 'theProperty', 'VALUE_Y', 'VALUE_X');
    //        sinon.assert.calledWithExactly(element.beanChangeObserver, {
    //            path: 'model.theArray.0.theProperty',
    //            value: 'VALUE_Y',
    //            base: bean
    //        });
    //
    //        done();
    //    });
    //});



    it('should synchronize changes of a property of the nested Bean from Polymer where the array was replaced trough Dolphin', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var array1 = [ innerBean1 ];
        var innerBean2 = { theProperty: 'VALUE_X' };
        var array2 = [ innerBean2 ];
        var bean = { theArray: array1};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');

        setTimeout(function() {
            injectUpdateFromDolphin(bean, 'theArray', array2, array1);
            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_X');

            element.set('model.theArray.0.theProperty', 'VALUE_3');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean2, 'theProperty', 'VALUE_3');

            done();
        });
    });



    it('should synchronize changes of a property of the nested Bean from Polymer where the array was replaced trough Polymer', function(done) {
        var innerBean1 = { theProperty: 'VALUE_1' };
        var array1 = [ innerBean1 ];
        var innerBean2 = { theProperty: 'VALUE_X' };
        var array2 = [ innerBean2 ];
        var bean = { theArray: array1};
        clientContext.createController = sandbox.stub().returns(Promise.resolve({ model: bean }));
        var element = new CustomElement();
        var notifyBeanChangeStub = sandbox.stub(clientContext.beanManager, 'notifyBeanChange');
        notifyBeanChangeStub.returns(array1);

        setTimeout(function() {
            element.set('model.theArray', array2);
            notifyBeanChangeStub.reset();
            notifyBeanChangeStub.returns('VALUE_X');

            element.set('model.theArray.0.theProperty', 'VALUE_3');
            sinon.assert.calledWithExactly(clientContext.beanManager.notifyBeanChange, innerBean2, 'theProperty', 'VALUE_3');

            done();
        });
    });
});

