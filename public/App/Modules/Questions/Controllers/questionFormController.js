app.controller('QuestionFormCtrl', function($scope, $state, $stateParams, $timeout, questionsDataService) {
	var $uploadBtn = $('#upload');
	var master = null,
        isEditMode = false;
	$scope.post = {};

	$scope.save = function(post) {
		if (post) {
			var promise = null;
            if (isEditMode) {
                promise = questionsDataService.update(post);
            }
            else {
                promise = questionsDataService.add(post);
            }

            promise.then(function () {
                var alert = {type: 'success', msg: 'The post was saved successfully.'};
                $scope.alerts.push(alert);

                $timeout(function () {
                    //$scope.closeAlert($scope.alerts.indexOf(alert));
                    $state.go('questions');
                }, 1000);
            });
		} else {

		}
		
	};

	$scope.upload = function() {
		$uploadBtn.click();
	};

	$scope.s3Upload = function() {
		var status_elem = document.getElementById("status");
		var url_elem = document.getElementById("image_url");
		var preview_elem = document.getElementById("preview");
		var s3upload = new S3Upload({
		  s3_object_name: showTitleUrl(),  // upload object with a custom name
		  file_dom_selector: 'upload',
		  s3_sign_put_url: '/sign_s3',
		  onProgress: function(percent, message) {
		      status_elem.innerHTML = 'Upload progress: ' + percent + '% ' + message;
		  },
		  onFinishS3Put: function(public_url) {
		      status_elem.innerHTML = 'Upload completed. Uploaded to: '+ public_url;
		      url_elem.value = public_url;
			$scope.post.img_url = public_url;
		      preview_elem.innerHTML = '<img src="'+ public_url +'" style="width:300px;" />';
		      $(preview_elem).parent('.image-preview').fadeIn();
		      $('#upload-panel').hide();
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

	var getPost = function (driverId) {
        dataService.getDriver(driverId).then(function (post) {
            $scope.post = driver;
            master = angular.copy(driver);
        });
    };

	var init = function () {
        master = { TotalRides: 0};
        $scope.showValidationMessages = false;
        $scope.alerts = [];

        if ($stateParams.id) {
            isEditMode = true;
            getPost($stateParams.id);
        }
        else {
            $scope.post = angular.copy(master);
        }
    };

    init();
});