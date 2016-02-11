'use strict';

const readline = require('readline');

const DataProvider = require('./DataProvider.js');
const indexUrl = 'https://nodejs.org/dist/latest-v5.x/docs/api/index.json';

const options = {local: true, store: true};
const dataProvider = DataProvider(options);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: function (input) {
        return [dataProvider.getSuggestions(input), input];
    }
});

console.log('Loading docs...');
dataProvider.fetch(indexUrl).then(() => {
    rl.setPrompt(dataProvider.getContextName() + '>');
    rl.prompt();
    rl.on('line', (input) => {
        const item = dataProvider.matchContext(input);
        if (item) {
            if (!item.isNavigable()) {
                console.log(item.getDescription());
            } else {
                rl.setPrompt(item.getName() + '>');
            }
        } else {
            console.log('Try TAB for suggestions!');
        }
        rl.prompt();
    });
});
