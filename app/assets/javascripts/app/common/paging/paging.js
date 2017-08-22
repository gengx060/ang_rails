define(['angular', 'jquery', 'jquery-uploadfile'], function (angular, $) {
	angular.module('paging', [])
		.directive('paging', function () {
			// https://blueimp.github.io/jQuery-File-Upload/angularjs.html
			return {
				require: '^tabs',
				restrict: 'E',
				transclude: true,
				scope: {
					list: '=',
					url: '@',
				},
				controller: function ($scope, $element) {
					$scope.total = 0;
					$scope.offset = 0;
					$scope.limit = 5;
					$scope.current_page = 1;
					$scope.goto_page = 1;
					$scope.default_page_sizes = [5, 10, 50];

					$scope.$watch('current_page', function (newValue, oldValue) {
						if (isNaN(parseInt(newValue))) {
							$scope.firstPage();
						}
						else {
							$scope.gotoPage()
						}
					});

					$scope.page = function () {
						ajaxRequest({
							offset: $scope.offset,
							limit: $scope.limit
						}, $scope.url, function (res) {
							$scope.$apply(function () {
								$scope.list = res.users;
								$scope.total = res.total;
								var total_page = res.total / $scope.limit;
								$scope.total_page = parseInt(total_page) + (total_page > parseInt(total_page) ? 1 : 0);
							});
						}, function (res) {
							toastr.error(res.info.message ? res.info.message : res.info.server_msg);
						});
					}
					$scope.page();

					$scope.firstPage_select = function () {
						$scope.offset = 0;
						$scope.current_page = 1;
						$scope.page()
					}

					$scope.firstPage = function () {
						if ($scope.offset == 0 && $scope.current_page == 1)
							return;
						$scope.offset = 0;
						$scope.current_page = 1;
						$scope.page()
					}
					$scope.prePage = function () {
						if ($scope.offset < 0 || $scope.current_page == 1)
							return;
						$scope.offset -= $scope.limit;
						$scope.current_page--;
						$scope.page()
					}

					$scope.gotoPage = function (keyEvent) {
						// if (keyEvent.which != 13)
						// 	return;
						if ($scope.current_page > $scope.total_page) {
							$scope.current_page = $scope.total_page;
							$scope.lastPage();
							return
						}
						if ($scope.current_page < 2) {
							$scope.current_page = 1;
							$scope.firstPage();
							return
						}
						$scope.offset = ($scope.current_page - 1) * $scope.limit;
						$scope.page()
						// $scope.current_page = $scope.goto_page;
						// if ($scope.goto_page < 2) {
						// 	$scope.firstPage();
						// 	return
						// }
						// var lastPage = $scope.total / $scope.limit;
						// if ($scope.goto_page >= lastPage) {
						// 	$scope.lastPage();
						// 	return
						// }
						//
						// $scope.offset = ($scope.goto_page - 1) * $scope.limit;
						// $scope.page()
						// $scope.current_page = $scope.goto_page;
					}
					$scope.nextPage = function () {
						if ($scope.offset + $scope.limit >= $scope.total)
							return;
						$scope.offset += $scope.limit;
						$scope.current_page++;
						$scope.page()
					}
					$scope.lastPage = function () {
						if ($scope.offset + $scope.limit >= $scope.total)
							return;
						var lastPage = $scope.total / $scope.limit;
						if (lastPage == parseInt(lastPage)) {
							$scope.current_page = lastPage;
						} else {
							$scope.current_page = parseInt(lastPage) + 1;
						}
						$scope.offset = ($scope.current_page - 1) * $scope.limit;
						$scope.page()
					}
				},
				templateUrl: 'assets/app/common/paging/paging.template.html',
				replace: true
			};
		});
});
