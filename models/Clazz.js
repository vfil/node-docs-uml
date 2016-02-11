'use strict';

const Item = require('./Item.js');
const ItemTypes = require('./ItemTypes.js');

const Clazz = function (rawClass) {
    const subtypes = [
        ItemTypes.METHODS,
        ItemTypes.PROPERTIES
    ];
    Item.call(this, rawClass, subtypes);
};

Clazz.prototype = Object.create(Item.prototype);
Clazz.prototype.constructor = Clazz;

module.exports = Clazz;
