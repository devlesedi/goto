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

var app = angular.module('realtime', ['angular-loading-bar', 'ngAnimate', 'ngMaterial', 'ui.router', 'btford.socket-io', 'bindtable', 'colorpicker.module', 'uuid4']);

app.run(function($window, $location, $rootScope, $state, $http) {
	var user = JSON.parse($window.localStorage.getItem('user'));

    $rootScope.user = user;

    $rootScope.server = {url: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')};

    // Intialize OpenFB Facebook library
    //OpenFB.init(FB_APP_ID, $window.localStorage);

    // Re-route to welcome street if we don't have an authenticated token
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        if (toState.name !== 'app.login' && toState.name !== 'app.chat' && !$window.localStorage.getItem('token')) {
            console.log('Aborting state ' + toState.name + ': No token');
            $state.go('app.login');
            event.preventDefault();
        }
    });

    $state.go('app.chat');
});

app.factory('socket', function(socketFactory) {
	return socketFactory();
});

app.factory('bindTable', function(bindTableFactory, socket) {
	return bindTableFactory({socket: socket});
});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
	// $locationProvider.html5Mode({
	// 	enabled: true,
	// 	requireBase: false
	// });

    $urlRouterProvider.otherwise('/');

	$stateProvider
		.state('app', {
			url: "",
			abstract: true,
			templateUrl: 'templates/questions.html',
			controller: 'QuestionCtrl'
		})
		.state('app.login', {
			url: '/login',
			views: {
	          'tabledata': {
	            templateUrl: 'templates/login.html',
				controller: 'AuthCtrl'
	          }
	        }
		})
		.state('app.chat', {
			url: '/'
		})
		.state('app.add', {
			url: '/add',
			views: {
	          'tabledata': {
	            templateUrl: 'templates/addedit.html',
				controller: 'QuestionAddCtrl'
	          }
	        }
		})
		.state('app.edit', {
			url: '/edit/:id',
			views: {
				'tabledata': {
					templateUrl: 'templates/addedit.html',
					controller: 'QuestionEditCtrl',
					resolve: {
						question: function($stateParams, bindTable){
							return bindTable('question').findById($stateParams.id);
						}
					}
				}
			}
		})
		.state('app.upload', {
			url: '/new',
			views: {
	          'tabledata': {
	            templateUrl: 'templates/upload.html',
				controller: 'S3UpploadCtrl'
	          }
	        }
		});
});

app
	.controller('QuestionCtrl', questionCtrl)
	.controller('QuestionAddCtrl', questionAddCtrl)
	.controller('QuestionEditCtrl', questionEditCtrl)
	.controller('S3UpploadCtrl', s3UpploadCtrl)
	.controller('AuthCtrl', authCtrl);

app.factory('Auth', function($http, $window, $rootScope, uuid4) {
	return {
		login: function (user, cb) {
			$rootScope.user = user;
            $window.localStorage.user = JSON.stringify(user);
            $window.localStorage.token = uuid4.generate();
            cb();
		}
	}
});

function authCtrl($rootScope, $scope, $state, $window, Auth) {
	$scope.user = {};

	$scope.login = function(user) {
		if (user.username === undefined || user.username === '') {
			$window.alert('Username missing !!');
		} else {
			Auth.login($scope.user, function() {
	    		$state.go('app.chat')
			});
		}
	}
};

function s3UpploadCtrl($scope) {
	$scope.s3Upload = function() {
		var status_elem = document.getElementById("status");
		var url_elem = document.getElementById("image_url");
		var preview_elem = document.getElementById("preview");
		var s3upload = new S3Upload({
		  s3_object_name: showTitleUrl(),  // upload object with a custom name
		  file_dom_selector: 'image',
		  s3_sign_put_url: '/sign_s3',
		  onProgress: function(percent, message) {
		      status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
		  },
		  onFinishS3Put: function(public_url) {
		      status_elem.innerHTML = 'Upload completed. Uploaded to: '+ public_url;
		      url_elem.value = public_url;
		      preview_elem.innerHTML = '<img src="'+ public_url +'" style="width:300px;" />';
		  },
		  onError: function(status) {
		      status_elem.innerHTML = 'Upload error: ' + status;
		  }
		});
	}

	function showTitleUrl() {
		//var title = $scope.show.title.split(' ').join('_');
		var dateId = Date.now().toString();
		return dateId;
	}

}
function questionCtrl($scope, bindTable) {
	var questionTable = bindTable('question');
	questionTable.bind(null, 100);

	$scope.questions = questionTable.rows;
	$scope.delete = questionTable.delete;
	$scope.$on('$destroy', function(){

	questionTable.unBind();

	});
}

function questionAddCtrl($rootScope, $scope, $state, bindTable) {
	var questionTable = bindTable('question');
	$scope.question = {};
	$scope.question.name = $rootScope.user.username;
	$scope.question.color = $rootScope.user.color;
	$scope.save = function(record){

	questionTable.save(record)
	  .then(function(result){
	    $state.go('app.chat')
	  }, function(err){
	    $scope.error = err.message;
	  }); 

	} 
}

function questionEditCtrl($scope, $state, bindTable, question) {
	var questionTable = bindTable('question');
	$scope.question = question;
	$scope.save = function(record){
	questionTable.save(record)
	  .then(function(result){
	    $state.go('app.chat')
	  }, function(err){
	    $scope.error = err.message;
	  });
	}  
}

app.config(function($mdThemingProvider){
  $mdThemingProvider.definePalette('myPalette', {
    '50': '39D6FF',
    '100': '33C1E5',
    '200': '2EAECF',
    '300': '2E8FCF',
    '400': '2E8FCF',
    '500': '2980B9',
    '600': '2F94D6',
    '700': 'd32f2f',
    '800': 'c62828',
    '900': 'b71c1c',
    'A100': '2980B9',
    'A200': 'ff5252',
    'A400': 'ff1744',
    'A700': 'd50000',
    'contrastDefaultColor': 'light',    
    'contrastDarkColors': ['50', '100',
     '200', '300', '400', 'A100']
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('myPalette')
});