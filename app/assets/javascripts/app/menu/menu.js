define(['angular', 'bootstrap', 'app/common/vcard/vcard', 'app/common/factory/util'], function (angular) {
	angular.module('menu', ['vcard', 'util'])
		.directive('menu', function () {
			return {
				require    : '^tabs',
				restrict   : 'E',
				transclude : true,
				scope      : {},
				controller : function ($scope, $element, util) {
					$scope.from_now = util.from_now;
					ajaxRequest({}, '/account/get_menu', function (res) {
						$scope.$apply(function () {
							$scope.menus = res;
							$scope.menus.forEach(function (i) {
								i.enactive = function () {
									$scope.menus.forEach(function (j) {
										j.active = false;
									});
									i.active = true;
								}
							})
						});
					});
					ajaxRequest({}, '/account/login_profile', function (res) {
						$scope.$apply(function () {
							$scope.user = res
						});
					});
					$scope.signout = function () {
						ajaxRequest({}, '/auth/logout', function () {
							location.reload();
						}, function () {
							location.reload();
						});
					}
				},
				templateUrl: 'assets/app/menu/menu.template.html',
				replace    : true
			};
		});
});