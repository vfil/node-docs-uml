'use strict';

const Item = require('./Item.js');

const Method = function (rawMethod) {
    Item.call(this, rawMethod, []);
};

Method.prototype = Object.create(Item.prototype);
Method.prototype.constructor = Method;

Method.prototype.getName = function () {
    return this._rawItem.textRaw;
};

module.exports = Method;
