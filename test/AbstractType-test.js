const expect = require('chai').expect;

const AbstractItem = require('../models/AbstractItem.js');
const fakeData = require('./fakeData.js');

describe('AbstractItem specs:', function() {

    var item;

    beforeEach(function() {
        item = new AbstractItem(fakeData.moduleUrlResponse.modules[0]);
    });
    it('.getType should return item type', function() {
        expect(item.getType()).to.equal('module');
    })
});
