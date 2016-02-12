'use strict';

const Item = require('./Item.js');
const ItemTypes = require('./ItemTypes.js');

const Module = function (rawModule) {
    const subtypes = [
        ItemTypes.CLASSES,
        ItemTypes.METHODS,
        ItemTypes.PROPERTIES
    ];
    Item.call(this, rawModule, subtypes);
};

Module.prototype = Object.create(Item.prototype);
Module.prototype.constructor = Module;

module.exports = Module;
