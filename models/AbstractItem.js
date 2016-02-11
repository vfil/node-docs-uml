const AbstractItem = function(rawItem) {
    this._rawItem = rawItem;
};

AbstractItem.prototype.getType = function() {
    return this._rawItem && this._rawItem.type;
};

AbstractItem.prototype.getName = function () {
    return this._rawItem.name;
};

module.exports = AbstractItem;
