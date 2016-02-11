const Global = function (modules) {
    this._modules = modules;
};

Global.prototype.getSubtypes = function () {
    return this._modules;
};

Global.prototype.getType = function () {
    return 'global';
};

Global.prototype.getName = function () {
    return 'Global';
};

module.exports = Global;
