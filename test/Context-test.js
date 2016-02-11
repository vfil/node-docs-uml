'use strict';
const expect = require('chai').expect
const Context = require('../models/Context.js');

describe('Context specs:', function() {

    let context;

    beforeEach(function() {
        context = Context();
    });

    it('.isLast should return false if context stack has only one item, otherwise false', function() {
        expect(context.isLast(), 'empty stack').to.equal(false);
        context.push(1);
        expect(context.isLast(), 'one element').to.equal(true);
        context.push(2);
        expect(context.isLast(), 'two element').to.equal(false);
        context.pop();
        expect(context.isLast(), 'one element after pop').to.equal(true);
    });

    it('.peak/.push should return last added element and respectively add item on stack top', function() {
        expect(context.peak(), 'empty stack').to.equal(undefined);
        context.push(1);
        expect(context.peak(), 'one element').to.equal(1);
        context.push(2);
        expect(context.peak(), 'two element').to.equal(2);
        context.pop();
        expect(context.peak(), 'one element after pop').to.equal(1);
    });

    it('.pop should remove and return top item of stack', function() {
        let item = context.pop();
        expect(item).to.equal(undefined);
        context.push(1);
        context.push(2);
        item = context.pop();
        expect(item).to.equal(2);
        item = context.pop();
        expect(item).to.equal(1);
    });
});
