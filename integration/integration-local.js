'use strict';

const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;

const DataProvider = require('../DataProvider.js');

describe('integration tests local docs:', function () {

    this.timeout(10000);

    const indexUrl = 'https://nodejs.org/dist/latest-v5.x/docs/api/index.json';
    let dataProvider;

    const globalModules = [
        "assert",
        "buffer",
        "addons",
        "child_process",
        "cluster",
        "console",
        "crypto",
        "dns",
        "domain",
        "Events",
        "fs",
        "http",
        "https",
        "module",
        "net",
        "os",
        "path",
        "punycode",
        "querystring",
        "readline",
        "repl",
        "stream",
        "stringdecoder",
        "timers",
        "tls_(ssl)",
        "tty",
        "dgram",
        "url",
        "util",
        "v8",
        "vm",
        "zlib"
    ];

    beforeEach(function () {
        const options = {local: true, store: false};
        dataProvider = DataProvider(options);
    });


    it('.fetch should retrieve docs', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            expect(dataProvider.getContextName()).to.equal('Global');
        });
    });

    it('.matchContext should match input and apply context', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            dataProvider.matchContext('https');
            expect(dataProvider.getContextName()).to.equal('https');
        });
    });

    it('.matchContext should match input partially and apply context', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            dataProvider.matchContext('as');
            expect(dataProvider.getContextName()).to.equal('assert');
        });
    });

    it('.matchContext should match input and apply context when module has exact match ' +
      'despite fact more then one matches', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            dataProvider.matchContext('http');
            expect(dataProvider.getContextName()).to.equal('http');
        });
    });

    it('.matchContext should go one level up  when input is "back"', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            dataProvider.matchContext('as');
            expect(dataProvider.getContextName()).to.equal('assert');
            dataProvider.matchContext('back');
            expect(dataProvider.getContextName()).to.equal('Global');
        });
    });

    it('.matchContext should  not go one level up  when input is "back" and we are on top level', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            dataProvider.matchContext('as');
            expect(dataProvider.getContextName()).to.equal('assert');
            dataProvider.matchContext('back');
            expect(dataProvider.getContextName()).to.equal('Global');
            dataProvider.matchContext('back');
            expect(dataProvider.getContextName()).to.equal('Global');
        });
    });

    it('.getSuggestions should return matched items names', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            expect(dataProvider.getSuggestions('h')).to.eql(['http', 'https']);
        });
    });

    it('.getSuggestions should return all items from context when empty input', function () {
        return expect(dataProvider.fetch(indexUrl)).to.be.fulfilled.then(() => {
            expect(dataProvider.getSuggestions('')).to.eql(globalModules);
            expect(dataProvider.getSuggestions()).to.eql(globalModules);
        });
    });
});
