define(['angular', 'jquery'], function (angular, $) {
	angular.module('sorting', [])
	.directive('sorting', function () {
		return {
			require    : '^tabs',
			restrict   : 'E',
			transclude : true,
			scope      : {
				sortbyname: '=',
				colname   : '='
			},
			controller : function ($scope, $element, $routeParams, $location) {
				$scope.sort_class = 'fa-sort';

				var sort_name = eval("$routeParams." + $scope.sortbyname);
				if (sort_name == 'asc') {
					$scope.sort_class = 'fa-sort-asc';
				} else if (sort_name == 'desc') {
					$scope.sort_class = 'fa-sort-desc';
				}
				/*/ this will only allow one sortby in $routeParams */
				$scope.$on('$routeUpdate', function (next, current) {
					var sortclass = Object.entries($routeParams).find(function (it) {
						if (it[0] == $scope.sortbyname) {
							return it[1];
						}
					});
					sortclass = sortclass ? sortclass[1] : null;
					if (sortclass == 'desc') {
						$scope.sort_class = 'fa-sort-desc';
					} else if (sortclass == 'asc') {
						$scope.sort_class = 'fa-sort-asc';
					} else {
						$scope.sort_class = 'fa-sort';
					}
				});/*/ this will only allow one sortby in $routeParams */

				$scope.sortClick = function () {
					/*/ this will only allow one sortby in $routeParams */
					Object.entries($routeParams).forEach(function (it) {
						if (it[0].startsWith('sortby') && it[0] != $scope.sortbyname) {
							$location.search(it[0], null);
						}
					});
					/*/ this will only allow one sortby in $routeParams */

					if ($scope.sort_class == 'fa-sort') {
						// $scope.sort_class = 'fa-sort-desc';/*/ this will only allow one sortby in $routeParams */
						$location.search($scope.sortbyname, 'desc');
					} else if ($scope.sort_class == 'fa-sort-desc') {
						// $scope.sort_class = 'fa-sort-asc';/*/ this will only allow one sortby in $routeParams */
						$location.search($scope.sortbyname, 'asc');
					} else if ($scope.sort_class == 'fa-sort-asc') {
						// $scope.sort_class = 'fa-sort';/*/ this will only allow one sortby in $routeParams */
						$location.search($scope.sortbyname, null);
					}
				};
			},
			templateUrl: 'assets/app/common/sorting/sorting.template.html',
			replace    : true
		};
	});
});
