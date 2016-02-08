const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');

const dataProvider = require('../data-provider.js');

describe('data provider specs', function () {

    it('fetch should retrieve docs', function () {
        const expectedUrl = 'https://test.me';

        const response = {
            "source": "doc/api/index.markdown",
            "desc": [
                {
                    "type": "space"
                },
                {
                    "type": "list_start",
                    "ordered": false
                },
                {
                    "type": "text",
                    "text": "[File System](fs.html)"
                },
                {
                    "type": "list_item_end"
                },
                {
                    "type": "list_item_start"
                },
                {
                    "type": "text",
                    "text": "[Globals](globals.html)"
                },
                {
                    "type": "list_item_end"
                },
                {
                    "type": "list_item_start"
                },
                {
                    "type": "text",
                    "text": "[HTTP](http.html)"
                },
                {
                    "type": "list_item_end"
                }
            ]
        };

        const result = ['fs', 'globals', 'http'];


        const fetchUrlStub = sinon.stub(dataProvider, 'fetchUrl')
          .returns(Promise.resolve(JSON.stringify(response)));

        return expect(dataProvider.fetch(expectedUrl)).to.eventually.eql(result).then(() => {
            expect(fetchUrlStub.calledWith(expectedUrl), 'promise should be called with args').to.equal(true);
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
