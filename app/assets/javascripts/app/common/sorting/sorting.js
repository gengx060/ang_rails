define(['angular', 'jquery'], function (angular, $) {
	angular.module('sorting', [])
	.directive('sorting', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: {
				sortbyname: '='
			},
			controller: function ($scope, $element, $routeParams, $location) {
				$scope.sort_class = 'fa-sort';

				var sort_name = eval("$routeParams."+$scope.sortbyname);
				if (sort_name == 'asc'){
					$scope.sort_class = 'fa-sort-asc';
				}else if (sort_name == 'desc') {
					$scope.sort_class = 'fa-sort-desc';
				}

				$scope.sortClick = function() {
					if ($scope.sort_class == 'fa-sort') {
						$scope.sort_class = 'fa-sort-desc';
						$location.search($scope.sortbyname, 'desc');
					} else if ($scope.sort_class == 'fa-sort-desc') {
						$scope.sort_class = 'fa-sort-asc';
						$location.search($scope.sortbyname, 'asc');
					} else if ($scope.sort_class == 'fa-sort-asc') {
						$scope.sort_class = 'fa-sort';
						$location.search($scope.sortbyname, null);
					}
				};
			},
			templateUrl: 'assets/app/common/sorting/sorting.template.html',
			replace: true
		};
	});
});
