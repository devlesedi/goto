'use strict'
app.controller('KitchensinkController', ['$scope', '$famous', '$window', 
	function($scope, $famous, $window) {
		var Engine = $famous['famous/core/Engine'];
    	var EventHandler = $famous['famous/core/EventHandler'];

    	var _brickNum  = 100;
	    var _dimensions = _calcDims($window.innerWidth);
	    var _brickSize = [250, 250];

	    $scope.scrollHandler = new EventHandler();
    
	    Engine.on('resize', function () {
	      _dimensions = _calcDims($window.innerWidth)
	      $scope.$digest();
	    });

	    function _calcColNum(width) {
			if (width < 768)
				return 1;
			else if (width > 769 && width < 1023)
				return 3;
			else
				return 4;
	    }

	    function _calcDims(width) {
			var _colNum = _calcColNum(width);
			var _rowNum = _brickNum / _colNum;
			return [_colNum, _rowNum];
		}

		$scope.bricks = [];
		for (var i = 0; i < _brickNum; i++) {
			$scope.bricks[i] = {
				color: 'hsl(' + (i * 40) + ', 60%, 50%)'
			};
	    }

	    $scope.getBrickSize = function () {
	      return _brickSize;
	    };
	    
	    $scope.getGridOptions = function () {
	      return {
	        dimensions: _dimensions
	      };
	    };

	    $scope.getScrollerSize = function () {
			var _height = (_brickSize[1] + 50) * _dimensions[1];
			return [undefined, _height];
	    };
}
]);