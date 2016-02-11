'use strict';

const expect = require('chai').expect;

const Item = require('../models/Item.js');
const ItemTypes = require('../models/ItemTypes.js');
const FakeData = require('./fakeData.js');
const utils = require('../utils.js');

describe('Item specs:', function() {

    var item;
    var fakeModule;

    const subtypes = [
        ItemTypes.CLASSES,
        ItemTypes.METHODS,
        ItemTypes.PROPERTIES
    ];

    beforeEach(function() {

        fakeModule = FakeData().moduleUrlResponse.modules[0];
        item = new Item(fakeModule, subtypes);
    });

    it('.isNavigable should determine if we can go inside this item', function() {
        //when all fields are not empty
        expect(item.isNavigable(), 'All fields populated').to.equal(true);

        //when at least one field is populated
        fakeModule.classes = [];
        fakeModule.methods = [];
        item = new Item(fakeModule, subtypes);
        expect(item.isNavigable(), 'only one of the fields populated').to.equal(true);

        //when all fields are empty
        fakeModule.classes = [];
        fakeModule.methods = [];
        fakeModule.properties = [];
        item = new Item(fakeModule, subtypes);
        expect(item.isNavigable(), 'all fields empty').to.equal(false);

        //when doesn't have subtypes defined
        item = new Item(fakeModule, []);
        expect(item.isNavigable(), 'without any subtypes defined').to.equal(false);
    });

    it('.getType should return item type', function() {
        expect(item.getType()).to.equal('module');
    });

    it('.getName should return module name', function() {
        expect(item.getName()).to.equal(fakeModule.name);
    });

    it('.getDescription should return item description', function() {
        expect(item.getDescription()).to.equal(utils.htmlDecode(fakeModule.desc));
    });

    it('.getSubtypes should return item relevant subtypes', function() {
        const subitems = item.getSubtypes();

        expect(subitems.length).to.equal(8);
        var counts = {
            class: 0,
            method: 0,
            property: 0
        };
        counts = subitems.reduce((prev, next) => {
            if((next.getType())) {
                counts[next.getType()]++;
            }
            return counts;
        }, counts);

        expect(counts).to.eql({ class: 1, method: 4, property: 0 });

    });
});
