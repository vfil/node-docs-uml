const dataProvider = require('./data-provider.js');
const indexUrl = 'https://nodejs.org/dist/latest-v5.x/docs/api/index.json';
dataProvider.fetch(indexUrl).then((data) => {
    //console.log(data);
});
