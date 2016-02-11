'use strict';

const Item = require('./Item.js');

var Property = function(rawProperty) {
    Item.call(this, rawProperty, [], false);
};

Property.prototype = Object.create(Item.prototype);
Property.prototype.constructor = Property;

Property.prototype.getName = function() {
    return this._rawItem.textRaw;
};

module.exports = Property;
