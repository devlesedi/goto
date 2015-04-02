'use strict'
var app = angular.module('realtime', ['angular-loading-bar', 'ngAnimate', 'ngMaterial', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/');
    
	$stateProvider.state('drivers', {
        url: '/drivers?page&q',
        templateUrl: 'App/Modules/Drivers/Views/drivers.html',
        data: {title: 'Drivers Management - MyShuttle'}
    });
});