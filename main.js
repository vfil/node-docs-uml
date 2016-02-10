//TODO Unit Tests???

const readline = require('readline');

const dataProvider = require('./data-provider.js');
const indexUrl = 'https://nodejs.org/dist/latest-v5.x/docs/api/index.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: function(input) {
        const suggestion = input || '';
        return [dataProvider.getSuggestions(suggestion) , input];
    }
});

rl.setPrompt('Global>');
console.log('Loading docs...');
//TODO make it async )))
dataProvider.fetch(indexUrl).then((data) =>{
    rl.prompt();
    rl.on('line', (input) => {
        const module = dataProvider.matchModule(input);
        if(module) {
            rl.setPrompt(module.getName() + '>');
        }
        rl.prompt();
    });
});
