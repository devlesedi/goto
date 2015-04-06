'use strict';
var r = require('../dash'),
    _ = require('lodash');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	r.table('posts')
	.run({cursor: false}, function(err, results) {
  		res.send(results);
	});
});

//New Post
router.post('/', function(req, res, next) {
	var record = _.pick(req.body, 'title', 'content', 'img_url', 'question_id', 'user_id');
    record.createdAt = new Date();
	r.table('posts')
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