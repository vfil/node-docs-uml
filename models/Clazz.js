//TODO too many methods...
var Clazz = function (rawClass) {
    this._rawClazz = rawClass;
    this.mainBorder = '+';
    this.insideBorder = '-';
};

Clazz.prototype.getName = function() {
    return this._rawClazz.name;
};

Clazz.prototype.getMethods = function() {
    return this._rawClazz.methods || [];
};

Clazz.prototype.printLine = function(length, char) {
    const line =  Array(length + 1).join(char);
    console.log(line);
};

Clazz.prototype.printHeader = function() {
    console.log(this.getName());
};

Clazz.prototype.printMethods = function() {
    this.getMethods().forEach((method) => {
        this.printLine(this.getName().length, this.insideBorder);
        console.log(method.textRaw);
    });
};

Clazz.prototype.print = function() {
    this.printLine(this.getName().length, this.mainBorder);
    this.printHeader();
    this.printMethods();
    this.printLine(this.getName().length, this.mainBorder);
    console.log();
};

module.exports = Clazz;
