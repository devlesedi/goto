'use strict'
var app = angular.module('realtime', ['angular-loading-bar', 'famous.angular', 'angularMoment', 'ngAnimate', 'ngMaterial', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');

	$stateProvider.state('kitchensink', {
        url: '/',
        templateUrl: 'App/Modules/Kitchensink/Views/index.html',
        data: {title: 'Main - Kitchensink'},
        controller: 'KitchensinkController'
    });
});