angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
.controller('LoginCtrl', function($scope, $state, $cordovaOauth, 
                                   UserService, Config, $ionicPlatform,
                                   $ionicLoading, $cordovaPush) {
	if (UserService.current()) {
	    $state.go('tab.news');
	}
	$scope.twitter = function () {
		$ionicPlatform.ready(function () {
	      $cordovaOauth.twitter(Config.twitterKey, Config.twitterSecret)
	        .then(function (result) {
	          $ionicLoading.show({
	            template: 'Loading...'
	          });
	          UserService.login(result).then(function (user) {
	            if (user.deviceToken) {
	              $ionicLoading.hide();
	              $state.go('tab.news');
	              return;
	            }

	            $ionicPlatform.ready(function () {
	              $cordovaPush.register({
	                badge: true,
	                sound: true,
	                alert: true
	              }).then(function (result) {
	                UserService.registerDevice({
	                  user: user, 
	                  token: result
	                }).then(function () {
	                  $ionicLoading.hide();
	                  $state.go('tab.news');
	                }, function (err) {
	                  console.log(err);
	                });
	              }, function (err) {
	                console.log('reg device error', err);
	              });
	            });
	          });
	        }, function (error) {
	          console.log('error', error);
	        });
		});
	};

	$scope.login = function() {

	};

	$scope.facebookLogin = function() {

	};

})
.controller('NewsCtrl', function($scope, NewsService, $ionicLoading) {
	$ionicLoading.show({
	    template: 'Loading...'
	});
	NewsService.all().then(function (news) {
		console.log(news);
	    $scope.news = news;
	    $ionicLoading.hide();
	});

	$scope.refresh = function () {
	    NewsService.all().then(function (news) {
	      $scope.news = news;
	      $scope.$broadcast('scroll.refreshComplete');
	    });
	};
})
.controller('NewsFormCtrl', function($scope, NewsService, $state, $stateParams, $timeout) {
	var master = {},
		isEditMode = false;

	$scope.reset = function() {
		init();
	};

	$scope.save = function(form) {
		console.log(form);
		if (form.$valid) {
            var promise = null;
            if (isEditMode) {
                promise = NewsService.update($scope.entry);
            }
            else {
                promise = NewsService.add($scope.entry);
            }

            promise.then(function () {
                var alert = {type: 'success', msg: 'The entry was saved successfully.'};
                $scope.alerts.push(alert);

                $timeout(function () {
                    $scope.closeAlert($scope.alerts.indexOf(alert));
                    $state.go('tab.news');
                }, 1000);
            });
        }
        else {
            $scope.showValidationMessages = true;
        }
	};

	$scope.isUnchanged = function (entry) {
        return angular.equals(entry, master);
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    var getEntry = function (entryId) {
        NewsService.one(entryId).then(function (entry) {
            $scope.entry = entry;
            master = angular.copy(entry);
        });
    };

    var init = function () {
        master = { username: 'Anonymous'};
        $scope.showValidationMessages = false;
        $scope.alerts = [];

        if ($stateParams.id) {
            isEditMode = true;
            getEntry($stateParams.id);
        }
        else {
            $scope.entry = angular.copy(master);
        }
    };

    init();


})
.controller('DetailsCtrl', function ($scope, $state, NewsService, 
                                     $ionicLoading) {
	$ionicLoading.show({
		template: 'Loading...'
	});
	var id = $state.params.id;
	NewsService.one(id).then(function (news) {
		$scope.news = news;
		$ionicLoading.hide();
	});
});