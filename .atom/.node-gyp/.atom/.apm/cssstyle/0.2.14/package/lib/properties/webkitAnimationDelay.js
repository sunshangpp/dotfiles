'use strict';

module.exports.definition = {
    set: function (v) {
        this.setProperty('-webkit-animation-delay', v);
    },
    get: function () {
        return this.getPropertyValue('-webkit-animation-delay');
    },
    enumerable: true,
    configurable: true
};
