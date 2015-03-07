var express = require('express');
var router = express.Router();
var PDF = require('pdfkit');            //including the pdfkit module
var fs = require('fs');
var text = 'ANY_TEXT_YOU_WANT_TO_WRITE_IN_PDF_DOC';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pdf', function(req, res, next) {
	res.render('pdf', { title: 'Express' });
});

module.exports = router;
