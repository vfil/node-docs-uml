# node-docs-uml

A fun way to interact with node js docs in your favorite shell.

Docs are cached locally so after first remote fetch, you can browse docs offline.
By default node-docs-uml will try to fetch docs remotely, 
in case of failure will try to load docs from file on local storage previously saved.
  
###Note
By now only OSX tested, nevertheless should work for all platforms.


## Instalation
clone repository
```
npm install
```

##Run
demo with
```
node ./main.js
```
##Configuration
DataProvider takes options as parameter use it accordingly.

Default config is:

    const options = {
        local: false, //fetch data remotely - false, use local cached version - true  
        store: true  //Asynchronously store a cached copy after remotely fetching docs for later use.     
    };

## Unit tests
```
npm test
```

## Integration tests
Executes a functional test suite which is fetching data remotely.
```
npm run integration-remote
```

Executes a functional test suite using cached data.
```
npm run integration-local
```


