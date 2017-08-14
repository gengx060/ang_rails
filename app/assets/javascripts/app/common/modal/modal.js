define(['angular'], function (angular) {
	angular.module('modal', [])
	.directive('modal', function () {
		
		return {
			require    : '^tabs',
			restrict   : 'E',
			transclude : true,
			scope      : {},
			controller : function ($scope, $element) {
				$scope.tag = $element[0].tagName;
				$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
				$scope.profile_placeholder = "asset/img/blank-profile.png";
				
			},
			templateUrl: 'app/common/modal/modal-trigger.template.html',
			replace    : true
		};
	});
});
