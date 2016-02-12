'use strict';

const https = require('https');
const fs = require('fs');

const utils = require('./utils.js');
const Global = require('./models/Global.js');

module.exports = function (options) {

    options = Object.assign({
        local: false,
        store: true
    }, options);

    const _context = require('./models/Context.js')();
    const _filePath = './data/data.json';
    var _fileUpdated = false;

    return {
        fetch: fetch,
        matchContext: matchContext,
        getSuggestions: getSuggestions,
        getContextName: getContextName
    };

    //TODO you say TDD???
    function fetch(url) {
        if (options.local) {
            return localFetch();
        } else {
            return remoteFetch(url).catch(err => {
                return localFetch();
            });
        }
    }

    function matchContext(input) {
        if (input == 'back' && !_context.isLast()) {
            _context.pop();
            return _context.peak();
        }
        const matches = itemMatcher(input);
        let item;
        if (matches.length === 1) {
            item = matches[0];
        } else {
            item = findExactMatch(matches, input);
        }

        if (item && item.isNavigable()) {
            _context.push(item);
        }

        return item;
    }

    function getSuggestions(input) {
        return itemMatcher(input).map(item => {
            return item.getName();
        });
    }

    function localFetch() {
        _fileUpdated = true;
        return new Promise((resolve, reject) => {
            fs.readFile(_filePath, (err, data) => {
                if (err) {
                    reject(err);
                }
                _context.push(new Global(JSON.parse(data)));
                resolve();
            });
        });
    }

    function remoteFetch(url) {
        return utils.fetchUrl(url).then(response => {
            const urls = extractUrls(JSON.parse(response));

            //grab all docs resources as promises
            const promises = urls.map(slug => {
                return utils.fetchUrl(buildUrlFromSlug(slug, url)).then(section => {
                    section = JSON.parse(section);
                    return section.modules || [];
                });
            });

            //wait until all promises are resolved and flatten
            return batchPromises(promises).then(result => {
                const globalModules = flatten(result);
                if (options.store) {
                    fs.writeFile(_filePath, JSON.stringify(globalModules), err => {
                        if (err) throw err;
                        _fileUpdated = true;
                    });
                }
                _context.push(new Global(globalModules));
            });

        });
    }

    function itemMatcher(input) {
        input = toLowerCaseOrEmpty(input);
        const container = _context.peak();
        return matchItem(container, input, (item, input) => {
            return item.getName().toLowerCase().startsWith(input);
        });
    }

    function matchItem(container, input, matcher) {
        return container.getSubtypes().filter(item => {
            return matcher(item, input);
        });
    }

    function findExactMatch(arr, name) {
        name = toLowerCaseOrEmpty(name);
        return arr.find(item => {
            const itemName = item.getName().toLowerCase();
            return itemName === name;
        });
    }

    function toLowerCaseOrEmpty(str) {
        return (str && str.toLowerCase()) || '';
    }

    function getContextName() {
        return _context.peak().getName();
    }

    function extractUrls(responseObj) {
        const regex = /\((\w+)/;
        return responseObj.desc.reduce(reduceLinksFactory(regex), []);
    }

    function reduceLinksFactory(regex) {
        return function (prev, next) {
            if (next.text) {
                const slug = regex.exec(next.text)[1];
                if (slug) {
                    prev.push(slug);
                }
            }

            return prev;
        }
    }

    function buildUrlFromSlug(slug, url) {
        return url.replace('index.json', '') + slug + '.json';
    }

    function batchPromises(promises) {
        const accumulator = [];
        var ready = Promise.resolve(null);

        //serialize promises result, after all completed return accumulator
        promises.forEach(promise => {
            ready = ready
              .then(() => {
                  return promise;
              })
              .then(value => {
                  accumulator.push(value);
              });
        });

        return ready.then(() => {
            return accumulator;
        });
    }

    function flatten(arr) {
        return arr.reduce((prev, next) => {
            return prev.concat(next);
        }, []);
    }

};
