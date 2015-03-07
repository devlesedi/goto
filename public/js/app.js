if('undefined' === typeof window.lesh) window.lesh = {};
if('undefined' === typeof window.lesh.signup) window.lesh.signup = {};

$(function () {
	$.fn.SignupModal = function(options) {
		return this.each(function() {
			var o = $.extend({}, $.fn.SignupModal.defaults, options);
			$signupBtn = $(o.signupBtn);

			var activeSubmitBnt = function(evt) {
				console.log(evt);
			};

			!function() {
				$field = $(o.name);
				$field.on('change keyup', {hey: 'hey'}, function(evt) {
					activeSubmitBnt(evt);
				});
			}();
		});
	};

	$.fn.SignupModal.defaults = {
		signupBtn: '#signup',
		name: '#js-fname'
	};

	(function() {
		$('.js-signup').SignupModal();
	})();
});

var app = angular.module('realtime', ['ngMaterial', 'ui.router', 'btford.socket-io', 'bindtable']);

app.factory('socket', function(socketFactory) {
	return socketFactory();
});

app.factory('bindtable', function(bindTableFactory, socket) {
	return bindTableFactory({socket: socket});
});

app.config(function($stateProvider, $locationProvider) {
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

	$stateProvider
		.state('questions', {
			url: '',
			templateUrl: 'templates/questions.html',
			controller: 'QuestionCtrl'
		})
		.state('add', {
			url: 'add',
			templateUrl: 'templates/addedit.html',
			controller: 'QuestionAddCtrl'
		})
		.state('edit', {
			url: 'edit/:id',
			templateUrl: 'templates/addedit.html',
			controller: 'QuestionEditCtrl',
			resolve: {
				question: function($stateParams, bindTable){
					return bindTable('question').findById($stateParams.id);
				}
			}
		});
});

app
	.controller('QuestionCtrl', questionCtrl)
	.controller('QuestionAddCtrl', questionAddCtrl)
	.controller('QuestionEditCtrl', questionEditCtrl);

function questionCtrl($scope, $state, bindTable) {

}

function questionAddCtrl($scope, $state, bindTable) {

}

function questionEditCtrl($scope, $state, bindTable, question) {

}
