'use strict';

const utils = require('../utils.js');

const Item = function (rawItem, subtypes) {
    this._rawItem = rawItem;
    this._subtypes = subtypes || [];
};

Item.prototype.isNavigable = function () {
    return !!this._subtypes.reduce((prev, next) => {
        if (this._rawItem[next]) {
            return prev + this._rawItem[next].length;
        }

        return prev;
    }, 0);
};

Item.prototype.getType = function () {
    return this._rawItem && this._rawItem.type;
};

Item.prototype.getName = function () {
    return this._rawItem.name;
};

Item.prototype.getDescription = function () {
    return utils.htmlDecode(this._rawItem.desc);
};

Item.prototype.getSubtypes = function () {
    const itemClass = require('./ItemClass.js');
    return this._subtypes.reduce((prev, next) => {
        if (this._rawItem[next]) {
            return prev.concat(this.mapToObjs(next, itemClass));
        }

        return prev;
    }, []);
};

Item.prototype.mapToObjs = function (type, itemClass) {
    return this._rawItem[type].map(item => {
        return new itemClass[type](item);
    });
};

module.exports = Item;
