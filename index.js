/* eslint-disable */
const { argv } = require('yargs');
const util = require('util');
const azFunction = argv.function;
const mock = argv.mock;

const context = require(`./mocks/${mock}/context`);
const req = require(`./mocks/${mock}/request`);
const API = require(`./dist/${azFunction}/index`).default;

// // Map local settings to process.env
const settings = require('./local.settings.json');

Object.keys(settings.Values).forEach((setting) => {
    const value = settings.Values[setting];
    process.env[setting] = value;
})

API(context, req).then((response) => {
    console.log(
        util.inspect(response, false, null, true)
    );
});