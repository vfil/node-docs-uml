var Clazz = function (rawClass) {
    this._rawClazz = rawClass;
    this.border = '+';
};

Clazz.prototype.getName = function() {
    return this._rawClazz.name;
};

Clazz.prototype.getMethods = function() {
    return this._rawClazz.methods || [];
};

Clazz.prototype.printLine = function(length) {
    const line =  Array(length + 1).join(this.border);
    console.log(line);
};

Clazz.prototype.printHeader = function() {
    this.printLine(this.getName().length);
    console.log(this.getName());
};

Clazz.prototype.printMethods = function() {
    this.getMethods().forEach((method) => {
        this.printLine(this.getName().length);
        console.log(method.textRaw);
    });
    this.printLine(this.getName().length);
};

Clazz.prototype.print = function() {
    this.printHeader();
    this.printMethods();
    console.log();
};

module.exports = Clazz;
