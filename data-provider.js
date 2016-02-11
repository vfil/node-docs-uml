const https = require('https');

const Module = require('./models/Module.js');
const Global = require('./models/Global.js');

module.exports = function () {

    var _context = require('./models/Context.js');

    return {
        fetch: fetch,
        matchContext: matchContext,
        getSuggestions: getSuggestions,
        getContextName: getContextName,
        fetchUrl: fetchUrl
    };

    function fetch(url) {
        return this.fetchUrl(url).then((response) => {
            const urls = extractUrls(JSON.parse(response));

            //grab all docs resources as promises
            const promises = urls.map((slug) => {
                return this.fetchUrl(buildUrlFromSlug(slug, url)).then((section) => {
                    section = JSON.parse(section);
                    return parsePage(section);
                });
            });

            //wait until all promises are resolved and flatten
            return batchPromises(promises).then((result) => {
                _context.push(new Global(flatten(result)));
            });

        });
    }

    function itemMatcher(input) {
        input = input.toLowerCase();
        const container = _context.peak();
        return matchItem(container, input, function (item, input) {
            return item.getName().toLowerCase().startsWith(input);
        });
    }

    function matchItem(container, input, matcher) {
        return container.getSubtypes().filter((item) => {
            return matcher(item, input);
        });
    }

    function matchContext(input) {
        if (input == 'back' && !_context.isLast()) {
            _context.pop();
            return _context.peak();
        }
        var matches = itemMatcher(input);
        if (matches.length === 1) {
            const item = matches[0];
            if (item.getType() !== 'method') {
                _context.push(item);
            }
            return item;
        }
    }

    function getSuggestions(input) {
        return itemMatcher(input).map((item) => {
            return item.getName();
        });
    }

    function getContextName() {
        return _context.peak().getName();
    }

    function fetchUrl(url) {
        return new Promise(function (resolve, reject) {
            var body = '';

            const req = https.request(url, function (res) {
                res.on('data', function (data) {
                    body += data;
                });

                res.on('end', function () {
                    resolve(body);
                });
            });

            req.on('error', function (e) {
                throw new Error('problem with request, error:' + e);
            });

            req.end();
        });
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

    function parsePage(section) {
        if (section.modules) {
            return section.modules.reduce((prev, next) => {
                return prev.concat(buildModules(next));
            }, []);
        }

        return [];
    }

    function buildModules(rawModule) {
        return new Module(rawModule);
    }


    function batchPromises(promises) {
        const accumulator = [];
        var ready = Promise.resolve(null);

        //serialize promises result, after all completed return accumulator
        promises.forEach((promise) => {
            ready = ready
              .then(() => {
                  return promise;
              })
              .then((value) => {
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

}();
