module.exports = function() {

    var _stack = [];

    return {
        isLast: isLast,
        peak: peak,
        push: push,
        pop: pop
    };

    function isLast() {
        return _stack.length === 1;
    }

    function peak() {
        return _stack[_stack.length - 1];
    }

    function push(item) {
        _stack.push(item);
    }

    function pop() {
        return _stack.pop();
    }
}();
