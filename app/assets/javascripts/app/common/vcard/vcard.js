define(['angular', 'ui-bootstrap'], function (angular) {
	angular.module('vcard', ['ui.bootstrap'])
	.directive('vcard', function () {
		return {
			require   : '^tabs',
			restrict  : 'E',
			transclude: true,
			scope     : {
				type: '@',
				src : '='
			},
			controller: function ($scope) {
				$scope.conf = {
					templateUrl: $scope.type == 'profile' ? 'assets/app/common/vcard/vcard.template.html' : '',
					title      : 'Title'
				};
				$scope.triggerStyle = {'padding-top':'8px', 'padding-right':'8px', 'padding-bottom': '0px'};
			},
			templateUrl  : 'assets/app/common/vcard/vcard-trigger.template.html',
			replace   : true
		};
	});
});
