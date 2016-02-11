const AbstractItem = require('./AbstractItem.js');

var Method = function(rawMethod) {
    AbstractItem.call(this, rawMethod);
};

Method.prototype = Object.create(AbstractItem.prototype);

Method.prototype.getName = function() {
    return this._rawItem.textRaw;
};

Method.prototype.getSubtypes = function() {
    return this._rawItem.desc;
};

Method.prototype.getDescription = function() {
    return this._rawItem.desc;
};

Method.prototype.constructor = Method;

module.exports = Method;
