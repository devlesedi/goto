'use strict';
var r = require('../dash'),
    _ = require('lodash');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	r.table('tags')
	.run({cursor: false}, function(err, results) {
  		res.send(results);
	});
});

module.exports = router;