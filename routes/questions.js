'use strict';
var r = require('../dash'),
    _ = require('lodash');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	r.table('yquestions')
	.run({cursor: false}, function(err, results) {
  		res.render('questions/index', { title: 'Yahoo Questions App | Lesedi Ramahobo | Apps', questions: results });
	});
});


router.get('/search', function(req, res, next) {
	r.table('yquestions')
	.orderBy({index: r.desc('createdAt')})
	.filter(function(doc) {
		return doc('name').match("(?i)" + req.query.filter)
	})
	.merge(function(question) {
		return {
	    	post_count: r.table('posts').getAll(question('id'),{index:"question_id"}).count()
		}
	})
	.run({cursor: false}, function(err, results) {
  		res.send(results);
	});
});

router.get('/:qid', function(req, res, next) {
	r.table('yquestions')
    .get(req.params.qid)
    .merge(function(question) {
	  return {
	    posts: r.table('posts').getAll(question('id'),{index:"question_id"}).coerceTo('array'),
	    post_count: r.table('posts').getAll(question('id'),{index:"question_id"}).count()
	  }
	})
    .run(function(err, results) {
    	res.send(results);
    });
});

//New Question
router.post('/', function(req, res, next) {
	var record = _.pick(req.body, 'name', 'question', 'img_url');
    record.createdAt = new Date();
    record.user_id = 1;
	r.table('yquestions')
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