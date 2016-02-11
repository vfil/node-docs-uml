'use strict';

const Item = require('./Item.js');
const ItemTypes = require('./ItemTypes.js');

const Global = function (rawModules) {
    const rawItem = {
        type: 'global',
        name: 'Global',
        modules: rawModules
    };

    const subtypes = [ ItemTypes.MODULES ];
    Item.call(this, rawItem, subtypes);
};

Global.prototype = Object.create(Item.prototype);
Global.prototype.constructor = Global;

module.exports = Global;
