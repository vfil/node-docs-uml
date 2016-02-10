const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');

const Module = require('../models/Module.js');
const fakeData = require('./fakeData.js');

const dataProvider = require('../data-provider.js');

describe('data provider specs:', function () {

    it('fetch should retrieve docs', function () {
        const indexUrl = 'https://test.me/index.json';
        const moduleUrl = 'https://test.me/http.json';
        const expectedResult = [new Module(fakeData.moduleUrlResponse.modules[0])];

        const fetchUrlStub = sinon.stub(dataProvider, 'fetchUrl');
        fetchUrlStub.withArgs(indexUrl)
          .returns(Promise.resolve(JSON.stringify(fakeData.indexUrlResponse)));
        fetchUrlStub.withArgs(moduleUrl)
          .returns(Promise.resolve(JSON.stringify(fakeData.moduleUrlResponse)));

        return expect(dataProvider.fetch(indexUrl)).to.eventually.eql(expectedResult).then(() => {
            console.log('restoring stub...');
            fetchUrlStub.restore();
        })


    });

    it('fetchUrl should fetch response from url', function () {
        const https = require('https');
        var PassThrough = require('stream').PassThrough;

        const httpRequestStub = sinon.stub(https, 'request');

        //use nodejs PassThrough Stream type to fake data flow
        const request = new PassThrough();
        const response = new PassThrough();
        const expectedResponse = JSON.stringify({key: 'value'});
        response.write(expectedResponse);
        response.end();

        //configure httpRequestStub to invoke callback function, so 'data' and 'end' events are emitted
        httpRequestStub.callsArgWithAsync(1, response).returns(request);

        const expectedUrl = 'https://test.me';

        return expect(dataProvider.fetchUrl(expectedUrl)).to.eventually.equal(expectedResponse).then(() => {
            expect(httpRequestStub.calledWith(expectedUrl), 'called with right args').to.equal(true);
            httpRequestStub.restore();
        });
    });
});
