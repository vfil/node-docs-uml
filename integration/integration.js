const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('integration tests', function() {
    it('retrieves index docs page json', function(done) {
        const dataProvider = require('../data-provider.js');
        const indexUrl = 'https://nodejs.org/dist/latest-v5.x/docs/api/index.json';

        //chai as promise is super cool, but sometimes I need to inspect deeper.
        //expect(dataProvider.fetch(indexUrl)).to.eventually.be.a(String);
        dataProvider.fetch(indexUrl).then((result) => {
            console.log(result.length);
            try {
                expect(result.constructor === Array && result.length > 0).to.equal(true);
                done();
            } catch(e) {
                done(e);
            }
        });
    });
});
