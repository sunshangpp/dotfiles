'use strict';

module.exports.definition = {
    set: function (v) {
        this.setProperty('stroke', v);
    },
    get: function () {
        return this.getPropertyValue('stroke');
    },
    enumerable: true,
    configurable: true
};
