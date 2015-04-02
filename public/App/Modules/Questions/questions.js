'use strict'
var app = angular.module('realtime', ['angular-loading-bar', 'angularMoment', 'ngAnimate', 'ngMaterial', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

	$stateProvider.state('questions', {
        url: '/?page&q',
        templateUrl: 'App/Modules/Questions/Views/questions.html',
        data: {title: 'Drivers Management - MyShuttle'}
    })
    .state('newQuestion', {
    	url: '/new',
        templateUrl: 'App/Modules/Questions/Views/form.html',
        controller: 'QuestionFormCtrl'
        // resolve: {
        //     tags: function(questionsDataService){
        //         return questionsDataService.allTags();
        //     }
        // }
    })
    .state('viewQuestion', {
        url: '/qid/:qid',
        templateUrl: 'App/Modules/Questions/Views/view.html',
        controller: 'QuestionViewCtrl'
    })
});