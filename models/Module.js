const Clazz = require('./Clazz');
const Method = require('./Method');
const AbstractItem = require('./AbstractItem.js');

var Module = function(rawModule) {
    AbstractItem.call(this, rawModule);
};

Module.prototype = Object.create(AbstractItem.prototype);

Module.prototype.getName = function() {
    return this._rawItem.displayName || this._rawItem.name;
};

Module.prototype.getClasses = function() {

    if(!this._rawItem.classes) return [];

    return this._rawItem.classes.map((rawClazz) => {
        return new Clazz(rawClazz);
    });
};

Module.prototype.getMethods = function() {

    if(!this._rawItem.methods) return [];

    return this._rawItem.methods.map((rawMethod) => {
        return new Method(rawMethod);
    });
};

Module.prototype.getSubtypes = function() {
    return this.getMethods().concat(this.getClasses());
};

Module.prototype.constructor = Module;

module.exports = Module;
