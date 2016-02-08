const https = require('https');

const Clazz = require('./models/Clazz.js');

module.exports = function() {

    return {
        fetch: fetch,
        fetchUrl: fetchUrl
    };

    function fetch(url) {
        return this.fetchUrl(url).then((response) => {
            const urls = extractUrls(JSON.parse(response));
            const docs = {};

            //grab all docs resources as promises
            const promises = urls.map((slug) => {
                return fetchUrl(buildUrlFromSlug(slug, url)).then((section) => {
                    section = JSON.parse(section);
                    return pagesToClasses(section);
                });
            });

            //wait until all promises are resolved and flatten
            return batchPromises(promises).then((result) => {
                return flattenClasses(result).forEach((clazz) => {
                    clazz.print();
                });
            });

        });
    }

    function fetchUrl(url) {
        console.log(url);
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

    function pagesToClasses(section) {
        if(section.modules) {
            return section.modules.reduce((prev, next) => {
                if(next.classes) {
                    return prev.concat(buildUIClasses(next.classes));
                }

                return prev;
            }, []);
        }

        return [];
    }

    function buildUIClasses(rawClasses) {
        return rawClasses.map((rawClass) => {
            const clazz = new Clazz(rawClass);
            return clazz;
        });
    }

    function parseClassMethods(rawMethods) {
        if(rawMethods) {
            return rawMethods.map((rawMethod) => {
                return {
                    name: rawMethod.textRaw
                }
            });
        }
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

    function flattenClasses(arr) {
        return arr.reduce((prev, next) => {
            return prev.concat(next);
        }, []);
    }

}();
