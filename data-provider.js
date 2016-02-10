const https = require('https');

const Module = require('./models/Module.js');

module.exports = function() {

    var _store = [];
    var _context = require('./models/Context.js');

    return {
        fetch: fetch,
        matchModule: matchModule,
        getSuggestions: getSuggestions,
        fetchUrl: fetchUrl
    };

    function fetch(url) {
        return this.fetchUrl(url).then((response) => {
            const urls = extractUrls(JSON.parse(response));
            const docs = {};

            //grab all docs resources as promises
            const promises = urls.map((slug) => {
                return this.fetchUrl(buildUrlFromSlug(slug, url)).then((section) => {
                    section = JSON.parse(section);
                    return parsePage(section);
                });
            });

            //wait until all promises are resolved and flatten
            return batchPromises(promises).then((result) => {
                _store = flatten(result);
                return _store;
            });

        });
    }


    function itemMatcher(input) {
        input = input.toLowerCase();
        const container = _context.getCurrentContext() || _store;
        return matchItem(container, input, function(item, input) {
            return item.getName().toLowerCase().startsWith(input);
        });
    }



    function matchItem(container, input, matcher) {

        if(container.constructor !== Array) return [];

        return container.filter((item) => {
            return matcher(item, input);
        });
    }

    function matchModule(input) {
        var matches = itemMatcher(input);
        if(matches.length === 1) {
            _context.setModule(matches[0]);
            return matches[0];
        }
    }

    //TODO refactor
    function matchModule2(input) {
        //module level
        const matchedModule = _store.filter((module) => {
            return moduleMatcher(module, input);
        });

        if(!_context.getModule()) {
            _context.setModule(matchedModule.length === 1 ? matchedModule[0] : undefined);
            return _context.getModule();
        }

        //classes level
        const matchedClasses = _context.getModule().getClasses().filter((clazz) => {
            return classMatcher(clazz, input);
        });

        if(!_context.getClass()) {
            _context.setClass(matchedClasses.length === 1 ? matchedClasses[0] : undefined);
            return _context.getModule();
        }

    }

    function moduleMatcher(module, input) {
        if(_context.getModule()) {
            return _context.getModule() === module;
        } else {
            input = input.toLowerCase();
            return module.getName().toLowerCase().startsWith(input);
        }
    }

    function classMatcher(clazz, input) {
        if(_context.getClass()) {
            return _context.getClass() === clazz;
        } else {
            return clazz.getName().toLowerCase().startsWith(input);
        }
    }

    function getSuggestions(input) {
        return itemMatcher(input).map((item) => {
            return item.getName();
        });
    }

    function fetchUrl(url) {
        return new Promise(function(resolve, reject) {
            var body = '';

            const req = https.request(url, function(res) {
                res.on('data', function(data) {
                    body += data;
                });

                res.on('end', function() {
                    resolve(body);
                });
            });

            req.on('error', function(e) {
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
        return function(prev, next) {
            if(next.text) {
                const slug = regex.exec(next.text)[1];
                if(slug) {
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
        if(section.modules) {
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
              .then(() => { return promise; })
              .then((value) => { accumulator.push(value); });
        });

        return ready.then(() => { return accumulator; });
    }

    function flatten(arr) {
        return arr.reduce((prev, next) => {
            return prev.concat(next);
        }, []);
    }

}();
