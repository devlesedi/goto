'use strict';
var r = require('../dash'),
    _ = require('lodash');

var express = require('express');
var router = express.Router();

router.get('/news', function(req, res, next) {
	r.table('news')
	.run({cursor: false}, function(err, results) {
  		res.send({error: null, news: results});
	});
});

router.get('/news/:id', function(req, res, next) {
	r.table('news')
	.get(req.params.id)
	.run(function(err, doc) {
  		res.send({error: null, news: doc});
	});
});

//New Post
router.post('/news', function(req, res, next) {
	var record = _.pick(req.body, 'title', 'body', 'featured', 'username');
    record.createdAt = new Date();
	r.table('news')
	.insert(record)
	.run(function(err, result) {
		if(err){
  			res.send(err);
          }
          else{
            record.id = result.generated_keys[0];
  			res.send(record);
          }
	});
});

module.exports = router;