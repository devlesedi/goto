'use strict';

app.service('questionsDataService', ['$http', '$q',
    function ($http, $q) {
        var service = this;

        service.getQuestions = function (filter, page, pageSize) {
            var params = {
                filter: filter,
                pageSize: pageSize,
                pageCount: page
            };

            var promises = [];
            promises.push($http.get('questions/search', {params: params}));
            //promises.push($http.get('questions/count', {params: {filter: filter}}));

            return $q.all(promises).then(function (results) {
                //var count = results[1].data;
                return {
                    data: results[0].data
                    //count: count
                };
            });
        };

        service.remove = function (questionId) {
            return $http.delete('posts' + questionId);
        };

        service.getPost = function (postId) {
            return $http.get('questions/' + postId).then(function (response) {
                return response.data;
            });
        };

        service.add = function (question) {
            return $http.post('questions', question).then(function (response) {
                return response.data;
            });
        };

        service.addReply = function (question) {
            return $http.post('posts', question).then(function (response) {
                return response.data;
            });
        };

        service.update = function (driver) {

            return $http.put('posts', question).then(function (response) {
                return response.data;
            });
        };

        service.allTags = function() {
        	return $http.get('tags').then(function(response) {
        		return response.data;
        	});
        }
    }
]);