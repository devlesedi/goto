var r = require('../dash');
var express = require('express');
var router = express.Router();
	//Q = require('q');

function login(req, res, next) {
	return res.send(req.body);
}

router.get('/', login);

module.exports = router;