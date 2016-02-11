//TODO Unit Tests???

const readline = require('readline');

const dataProvider = require('./data-provider.js');
const indexUrl = 'https://nodejs.org/dist/latest-v5.x/docs/api/index.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: function (input) {
        const suggestion = input || '';
        return [dataProvider.getSuggestions(suggestion), input];
    }
});

console.log('Loading docs...');
dataProvider.fetch(indexUrl).then(() => {
    rl.setPrompt(dataProvider.getContextName() + '>');
    rl.prompt();
    rl.on('line', (input) => {
        const item = dataProvider.matchContext(input);
        if (item) {
            if (item.getType() === 'method') {
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
