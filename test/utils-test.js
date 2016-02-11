'use strict';

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');

const utils = require('../utils.js');

describe('utils specs:', function () {

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

        return expect(utils.fetchUrl(expectedUrl)).to.eventually.equal(expectedResponse).then(() => {
            expect(httpRequestStub.calledWith(expectedUrl), 'called with right args').to.equal(true);
            httpRequestStub.restore();
        });
    });
});
