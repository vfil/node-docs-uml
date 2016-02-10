const Clazz = require('./Clazz');

var Module = function(rawModule) {
    this._rawModule = rawModule;
};

Module.prototype.getName = function() {
    return this._rawModule.displayName || this._rawModule.name;
};

Module.prototype.getClasses = function() {
    return this._rawModule.classes.map((rawClazz) => {
        return new Clazz(rawClazz);
    });
}

module.exports = Module;
