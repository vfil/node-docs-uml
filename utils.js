'use strict'

const https = require('https');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

module.exports = {
    fetchUrl: function (url) {
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

            req.on('error', function () {
                reject(new Error(url + ' fetching failed!!!'));
            });

            req.end();
        });
    },
    htmlDecode(str) {
        return entities.decode(str)
          .replace(/(\[)?<[^>]*>(\])?/g, '');
    }
};
