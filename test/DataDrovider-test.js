'use strict';

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');

const utils = require('../utils.js');
const fakeData = require('./fakeData.js')();
const DataProvider = require('../DataProvider.js');

describe('data provider specs:', function () {

    let indexUrl,
        fetchUrlStub,
        dataProvider;

    beforeEach(function() {
        indexUrl = 'https://test.me/index.json';
        const moduleUrl = 'https://test.me/http.json';
        fetchUrlStub = sinon.stub(utils, 'fetchUrl');
        fetchUrlStub.withArgs(indexUrl)
          .returns(Promise.resolve(JSON.stringify(fakeData.indexUrlResponse)));
        fetchUrlStub.withArgs(moduleUrl)
          .returns(Promise.resolve(JSON.stringify(fakeData.moduleUrlResponse)));
        const options = {local: false, store: false};
        dataProvider = DataProvider(options);
    });

    afterEach(function() {
        fetchUrlStub.restore();
    });

    it('.fetch should retrieve docs', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            expect(dataProvider.getContextName()).to.equal('Global');
        });
    });

    it('.matchContext should match input and apply context', function() {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            dataProvider.matchContext('https');
            expect(dataProvider.getContextName()).to.equal('https');
        });
    });

    it('.matchContext should match input partially and apply context', function() {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            dataProvider.matchContext('as');
            expect(dataProvider.getContextName()).to.equal('assert');
        });
    });

    it('.matchContext should match input and apply context when module has exact match ' +
        'despite fact more then one matches', function() {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            dataProvider.matchContext('http');
            expect(dataProvider.getContextName()).to.equal('http');
        });
    });

    it('.getSuggestions should return matched items names', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            expect(dataProvider.getSuggestions('h')).to.eql(['http', 'https']);
        });
    });

    it('.getSuggestions should return all items from context when empty input', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            expect(dataProvider.getSuggestions('')).to.eql(['http', 'https', 'assert']);
            expect(dataProvider.getSuggestions()).to.eql(['http', 'https', 'assert']);
        });
    });
});
