'use strict';

app.controller('QuestionsController', [
    '$scope', '$state', 'questionsDataService', '$location', '$timeout',
    function ($scope, $state, questionsDataService , $location, $timeout) {
        var pageSize = 8, // TODO: Settings?
            defaultPage = 1;

        $scope.goTo = function (page) {
            var params = {page: page };
            if ($scope.search) params.q = $scope.search;
            $state.go('drivers', params);
        };

        $scope.find = function() {
        	$scope.count = null;
            questionsDataService.getQuestions($scope.search || '', $scope.page - 1, pageSize).then(function (result) {
                $scope.drivers = result.data;
                $scope.count = result.count;
            });
        };

        var init = function() {
        	$scope.page = parseInt($state.params.page) || defaultPage;
            if ($state.params.q)
                $scope.search = $state.params.q;

            $scope.find();
        };

        init();
    }
]);


app.controller('QuestionViewCtrl', [
    '$scope', '$state', 'questionsDataService', '$location', '$timeout',
    function ($scope, $state, questionsDataService, $location, $timeout) {

        $scope.post = {};

        $scope.getItem = function(itemId) {
            questionsDataService.getPost(itemId)
            .then(function(response){
                var item = response;
                if(item) {
                    $scope.details = item;
                    //var area = item.jobLocation[0];
                    //var category = item.jobType[0];
                    //$scope.category = ItemConfig.Category.getFromId(category).name;
                    //$scope.area = ItemConfig.Area.getFromId(area).name;
                }
              },function(error){
                console.log(error);
                $scope.details = {};
              });
        }

        $scope.getItem($state.params.qid);

        $scope.reply = function(){
            if($scope.post.message){
                var data = {
                    title: $scope.details.name,
                    content: $scope.post.message,
                    img_url: '',
                    question_id: $state.params.qid,
                    user_id: 1
                };
                var promise = null;
                promise = questionsDataService.addReply(data);

                promise.then(function (response) {
                    var alert = {type: 'success', msg: 'The post was saved successfully.'};
                    //$scope.alerts.push(alert);
                    $scope.apply=!$scope.apply;
                    $scope.details.posts.push(response);
                    $timeout(function () {
                        //$scope.closeAlert($scope.alerts.indexOf(alert));
                        //$state.go('questions');
                    }, 1000);
                });
            }
        }
    }
]);