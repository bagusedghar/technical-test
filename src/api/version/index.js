const utils = require('@src/utils');

const VersionService = require('./version.service')({}, utils);
const controller = require('./version.controller')({ VersionService }, utils);

module.exports = require('./version.routes')(controller);
