define(['angular', 'jquery'], function (angular, $) {
	angular.module('sorting', [])
	.directive('sorting', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: {
				sortname: '='
			},
			controller: function ($scope, $element, $routeParams, $location) {
				$scope.sort_class = 'fa-sort';
				debugger
				if ($routeParams[$scope.sortname]){

				}
				$scope.sortClick = function() {
					if ($scope.sort_class == 'fa-sort') {
						$scope.sort_class = 'fa-sort-desc';
						$location.search($scope.sortname, 'desc');
					} else if ($scope.sort_class == 'fa-sort-desc') {
						$scope.sort_class = 'fa-sort-asc';
						$location.search($scope.sortname, 'asc');
					} else if ($scope.sort_class == 'fa-sort-asc') {
						$scope.sort_class = 'fa-sort';
						$location.search($scope.sortname, null);
					}
				};
			},
			templateUrl: 'assets/app/common/sorting/sorting.template.html',
			replace: true
		};
	});
});
