'use strict';

const Clazz = require('./Clazz.js');
const Property = require('./Property.js');
const Method = require('./Method.js');
const Module = require('./Module.js');

module.exports = {
    modules: Module,
    classes: Clazz,
    methods: Method,
    properties: Property
};
