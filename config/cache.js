const Cache = require('node-cache');

const cache = new Cache({ stdTTL: 7200, useClones: false });

module.exports = cache;
