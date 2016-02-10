const chai = require('chai');
const expect = chai.expect;

const Module = require('../models/Module.js');
const Clazz = require('../models/Clazz.js');
const fakeData = require('./fakeData.js');

describe('Module model specs:', function() {
    var module;

    beforeEach(function() {
        module = new Module(fakeData.moduleUrlResponse.modules[0]);
    });

    it('.getName should return module name', function() {
        expect(module.getName()).to.equal(fakeData.moduleUrlResponse.modules[0].displayName);
    });

    it('.getClasses should return module classes of Clazz istances', function() {
        expect(module.getClasses().length).to.be.equal(1);
        module.getClasses().forEach((clazz) => {
           expect(clazz instanceof Clazz).to.equal(true);
        });
    })
});
