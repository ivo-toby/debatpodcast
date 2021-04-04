/* eslint-disable */

const util = require('util');
const req = require('./request');

// Local development context
const context = {
    invocationId: 'ID',
    bindings: {
        req,
    },
    bindingData:{
        ...req.path,
    },
    log() {
        const val = util.format.apply(null, arguments);
        console.log(val);
    },
    done() {
        // When done is called, it will log the response to the console
        console.log('Response:', this.res);
    },
    res: null,
};

module.exports = context;
