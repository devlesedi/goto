'use strict';
var rethinkdbdash = require('rethinkdbdash');

var r = rethinkdbdash({db: 'test'});

module.exports = r;