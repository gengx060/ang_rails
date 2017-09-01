define(['angular', 'jquery'], function (angular, $) {
	angular.module('paging', [])
		.directive('paging', function () {
			return {
				require    : '^tabs',
				restrict   : 'E',
				scope      : {
					list   : '=',
					url    : '@',
					refresh: '='
				},
				controller : function ($scope, $element, $routeParams) {
					$scope.total = 0;
					$scope.offset = 0;
					$scope.limit = 20;
					$scope.current_page = 1;
					$scope.current_page_bak = 1;
					$scope.goto_page = 1;
					$scope.default_page_sizes = [20, 50, 100];
					$scope.params = {};
					//
					$scope.$watch('refresh', function (newValue, oldValue) {
						if (newValue > 0) {
							$scope.set_current_page($scope.current_page);
							$scope.page();
						}
					});

					$scope.set_current_page = function (p) {
						$scope.current_page = p;
						$scope.current_page_bak = p;
					};

					$scope.route_to_params = function () {
						$scope.params['sortby'] = {};
						Object.entries($routeParams).forEach(function (it) {
							if (it[0].startsWith('sortby')) {
								if (typeof $scope.params['sortby'] === 'undefined' || !$scope.params['sortby'])
									$scope.params['sortby'] = {};
								$scope.params['sortby'][it[0].substring(6)] = it[1];
							}
						});
					};

					$scope.$on('$routeUpdate', function (next, current) {
						var oldparam = $scope.params['sortby'];
						$scope.route_to_params();
						if (!oldparam && !$scope.params['sortby'])
							return; // no sort by params
						if (!oldparam || // in case of sort by just apeared
							!$scope.params['sortby'] || // in case of sort by just disapeared
							!jsonEqual(oldparam, $scope.params['sortby'])) {
							$scope.page();
						}
					});

					$scope.page = function () {
						$scope.params.offset = $scope.offset;
						$scope.params.limit = $scope.limit;
						$scope.route_to_params();
						ajaxRequest($scope.params, $scope.url, function (res) {
							$scope.$apply(function () {
								$scope.list = res.users;
								$scope.total = res.total;
								var total_page = res.total / $scope.limit;
								$scope.total_page = parseInt(total_page) + (total_page > parseInt(total_page) ? 1 : 0);

								$scope.set_current_page($scope.current_page);
							});
						}, function (res) {
							toastr.error(res.info.message ? res.info.message : res.info.server_msg);
						});
						// $scope.params = {}; // reset params
					};
					$scope.route_to_params();
					$scope.page();

					$scope.firstPage_select = function () {
						$scope.offset = 0;
						$scope.set_current_page(1);
						$scope.page()
					};

					$scope.firstPage = function () {
						if ($scope.offset == 0 && $scope.current_page == 1)
							return;
						$scope.offset = 0;
						$scope.set_current_page(1);
						$scope.page();
					};

					$scope.prePage = function () {
						if ($scope.offset < 0 || $scope.current_page == 1)
							return;
						$scope.offset -= $scope.limit;
						// $scope.current_page--;;
						$scope.set_current_page($scope.current_page - 1);
						$scope.page();
					};

					$scope.gotoPage = function (keyEvent) {
						if (keyEvent.which != 13)
							return;

						if (isNaN(parseInt($scope.current_page_bak))) {
							$scope.set_current_page($scope.current_page)
						}
						else if (parseInt($scope.current_page_bak) > $scope.total_page) {
							$scope.set_current_page($scope.total_page)
						}
						else if (parseInt($scope.current_page_bak) < 2) {
							$scope.set_current_page(1)

						}
						if ($scope.current_page > $scope.total_page) {
							$scope.set_current_page($scope.total_page)
							$scope.lastPage();
							return
						}
						if ($scope.current_page < 2) {
							$scope.set_current_page(1)
							$scope.firstPage();
							return
						}
						$scope.offset = ($scope.current_page - 1) * $scope.limit;
						$scope.page();
					};

					$scope.nextPage = function () {
						if ($scope.offset + $scope.limit >= $scope.total)
							return;
						$scope.offset += $scope.limit;
						$scope.set_current_page($scope.current_page + 1)
						$scope.page()
					};

					$scope.lastPage = function () {
						if ($scope.offset + $scope.limit >= $scope.total)
							return;
						var lastPage = $scope.total / $scope.limit;
						if (lastPage == parseInt(lastPage)) {
							$scope.set_current_page(lastPage);
						} else {
							$scope.set_current_page(parseInt(lastPage) + 1)
						}
						$scope.offset = ($scope.current_page - 1) * $scope.limit;
						$scope.page()
					}
				},
				templateUrl: 'assets/app/common/paging/paging.template.html',
				replace    : true
			};
		});
});
