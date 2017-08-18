define(['angular', 'bootstrap', 'app/common/vcard/vcard'], function (angular) {
	angular.module('menu', ['vcard'])
	.directive('menu', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: {},
			controller: function ($scope, $element) {
				$scope.signout = function () {
					ajaxRequest({}, '/auth/logout', function () {
						location.hash ='#!/login';
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