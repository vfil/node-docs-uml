module.exports = function() {

    var _module, _clazz;

    return {
        getModule: getModule,
        setModule: setModule,
        getClass: getClass,
        setClass: setClass,
        getCurrentContext: getCurrentContext
    };

    function getModule() {
        return _module;
    }

    function setModule(module) {
        _module = module;
    }

    function getClass() {
        return _clazz;
    }

    function setClass(module) {
        _clazz = module;
    }

    function getCurrentContext() {
        if(getClass()) {
            return getClass().getMethods();
        } else if(getModule()) {
            return getModule().getClasses();
        }
    }

}();
