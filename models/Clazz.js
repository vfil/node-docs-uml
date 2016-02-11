const AbstractItem = require('./AbstractItem.js');
const Method = require('./Method');

const Clazz = function (rawClass) {
    AbstractItem.call(this, rawClass);
};

Clazz.prototype = Object.create(AbstractItem.prototype);

Clazz.prototype.getMethods = function () {
    if(!this._rawItem.methods) return [];

    return this._rawItem.methods.map((rawMethod) => {
        return new Method(rawMethod);
    });
};

Clazz.prototype.getProperties = function () {
    if(!this._rawItem.properties) return [];

    return this._rawItem.methods.map((rawMethod) => {
        return new Method(rawMethod);
    });
};

Clazz.prototype.getSubtypes = function() {
    return this.getMethods();
};

Clazz.prototype.constructor = Clazz;

module.exports = Clazz;
