'use strict';
var r = require('../dash'),
	_ = require('lodash'),
    request = require("request"),
	cheerio = require("cheerio");

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var url = 'https://www.google.co.bw/search?q=botswana+news';

	request(url, function (error, response, body) {
		if (error) {
			console.log("Couldn’t get page because of error: " + error);
			return;
		}
		
		// load the body of the page into Cheerio so we can traverse the DOM
		var $ = cheerio.load(body),
			links = $(".r a"),
			corpus = [],
			words = [],
			totalResults = 0;
			
		links.each(function (i, link) {
			// get the href attribute of each link
			url = $(link).attr("href");
			
			// strip out unnecessary junk
			url = url.replace("/url?q=", "").split("&")[0];
			
			if (url.charAt(0) === "/") {
				return;
			}

			// this link counts as a result, so increment results
			totalResults++;

			request(url, function (error, response, body) {
			// load the page into Cheerio
				var $page = cheerio.load(body),
					text = $page("body").text();

				// Throw away extra white space and non-alphanumeric characters.
				text = text.replace(/\s+/g, " ")
				.replace(/[^a-zA-Z ]/g, "")
				.toLowerCase();

				// Split on spaces for a list of all the words on that page and 
				// loop through that list.
				text.split(" ").forEach(function (word) {
					// We don't want to include very short or long words because they're 
					// probably bad data.
					if (word.length < 3) {
						return;
					}
								
					if (corpus[word]) {
						// If this word is already in our corpus, our collection
						// of terms, increase the count for appearances of that 
						// word by one.
						corpus[word]++;
					} else {
						// Otherwise, say that we've found one of that word so far.
						corpus[word] = 1;
					}
				});

				// stick all words in an array
				for (var prop in corpus) {
					words.push({
						word: prop,
						count: corpus[prop]
					});
				}
					
				// sort array based on how often they occur
				// words.sort(function (a, b) {
				// 	return b.count - a.count;
				// });

				r.table('analytics')
				.insert(words)
				.run(function(err, result) {
					console.log(words);
				});
			});
		});
	});
});

router.get('/infobw', function(req, res, next) {
	var url = 'http://www.info.bw/status/index.shtml';

	request(url, function (error, response, body) {
		if (error) {
			console.log("Couldn’t get page because of error: " + error);
			return;
		}
		
		// load the body of the page into Cheerio so we can traverse the DOM
		var $ = cheerio.load(body),
			tds = $("body table tbody td").text();
		res.send(tds);
	});
});

module.exports = router;