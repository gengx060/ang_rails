define(['angular', 'jquery'], function (angular, $) {
	angular.module('sorting', [])
	.directive('sorting', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			scope: {
				sort_name: '='
			},
			controller: function ($scope, $location) {
				$scope.sort_class = 'fa-sort';
				debugger
				$scope.sortClick = function() {
					if ($scope.sort_class == 'fa-sort') {
						debugger
						$scope.sort_class = 'fa-sort-desc';
						$location.search('"'+$scope.sort_name+'"', 'desc');
					} else if ($scope.sort_class == 'fa-sort-desc') {
						$scope.sort_class = 'fa-sort-asc';
						$location.search('"'+$scope.sort_name+'"', 'asc');
					} else if ($scope.sort_class == 'fa-sort-asc') {
						$scope.sort_class = 'fa-sort-desc';
						$location.search('"'+$scope.sort_name+'"', 'asc');
					} else {
						$scope.sort_class = 'fa-sort';
						$location.search('"'+$scope.sort_name+'"', null);
					}
				};
			},
			templateUrl: 'assets/app/common/sorting/sorting.template.html',
			replace: true
		};
	});
});
