define(['angular', 'bootstrap', 'app/common/vcard/vcard'], function (angular) {
	angular.module('menu', ['vcard'])
		.directive('menu', function () {
			return {
				require: '^tabs',
				restrict: 'E',
				transclude: true,
				scope: {},
				controller: function ($scope, $element) {
					ajaxRequest({}, '/account/get_menu', function () {
						$scope.$apply(function () {
							$scope.menus = [
								{name: 'welcome', route: '/welcome', nav: false, title: 'Welcome'},
								{name: 'comments', route: '/comment', nav: true, title: 'Github Users'},
								{name: 'users', route: '/users', nav: true, title: 'Github Users'}
							];
							$scope.user = {
								id        : 3,
								name      : 'Belle Chang-Li',
								parent_id : null,
								img       : "/assets/asset/img/b1.jpg",
								msgCount  : 2,
								time_stamp: '12/18/2016, 11:06:47 AM'
							}
						});
					});
					$scope.signout = function () {
						ajaxRequest({}, '/auth/logout', function () {
							location.reload();
						}, function () {
						});
					}
				},
				templateUrl: 'assets/app/menu/menu.template.html',
				replace: true
			};
		});
});