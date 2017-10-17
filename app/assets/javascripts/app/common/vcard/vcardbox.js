define(['angular', 'ui-bootstrap'], function (angular) {
	angular.module('vcardbox', ['ui.bootstrap'])
	.directive('vcardbox', function () {
		return {
			require   : '^tabs',
			restrict  : 'E',
			transclude: true,
			scope     : {
				// type: '@',
				// src : '=',
				// triggersize:'@'
			},
			controller: function ($scope, $timeout) {
				$scope.top = "120px";
				$scope.left = "120px";
				$scope.timer  = 500;
				
				$scope.$root.$watch('vcard_box_show', function (newValue, oldValue) {
					if (typeof newValue !== 'undefined') {
						if(newValue) {
							$scope.src = $scope.$root.vcard_box.src;
							$scope.show_card();
						} else {
							$scope.blur();
						}
					}
				});
				
				$scope.clear_timer = function() {
					if ($scope.blur_timer) {
						$timeout.cancel($scope.blur_timer);
						$scope.blur_timer = null;
					}
				};
				$scope.create_timer = function() {
					$scope.blur_timer = $timeout( function(){
						if ($scope.vcard_show) {
							$scope.hide_card();
							console.log('close new');
						}
					}, $scope.timer);
				};
				$scope.hide_card = function() {
					$scope.vcard_show = false;
				};
				$scope.show_card = function() {
					$scope.clear_timer();
					$scope.vcard_box = $scope.$root.vcard_box;
					$scope.vcard_show = true;
					$scope.top = $scope.$root.vcard_box.offset.top - 45 + 'px';
					$scope.left = $scope.$root.vcard_box.offset.left +  $scope.$root.vcard_box.offset.width + 10 + 'px';
				};
				
				$scope.enter_vcard = function() {
					$scope.clear_timer();
				};
				
				$scope.leave_vcard = function() {
					$scope.clear_timer();
					$scope.create_timer();
				};
				
				$scope.blur = function() {
					$scope.clear_timer();
					$scope.create_timer();
				};
			},
			templateUrl: 'assets/app/common/vcard/vcardbox.template.html'
		};
	});
});
