// define(['angular', 'ui-bootstrap'], function (angular) {
// 	angular.module('vcard', ['ui.bootstrap'])
// 	.directive('vcard', function () {
// 		return {
// 			require   : '^tabs',
// 			restrict  : 'E',
// 			transclude: true,
// 			scope     : {
// 				type: '@',
// 				src : '=',
// 				triggersize:'@'
// 			},
// 			controller: function ($scope) {
// 				$scope.triggersize = $scope.triggersize ? $scope.triggersize : '30px';
// 				$scope.conf = {
// 					templateUrl: $scope.type == 'profile' ? 'assets/app/common/vcard/vcard.template.html' : '',
// 					title      : 'Title'
// 				};
// 				$scope.triggerStyle = {'padding-top':'0px', 'padding-right':'8px', 'padding-bottom': '0px'};
//
// 				$scope.colors = ["#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"];
// 				// $scope.colorStyle = {'background-color':  $scope.colors[Math.floor(Math.random()*26)] };
// 				$scope.color_index = $scope.src.lastname ? $scope.src.lastname[0] : 'a'
// 				$scope.colorStyle = {'background-color': $scope.colors[$scope.color_index.toLocaleLowerCase().charCodeAt(0)-'a'.charCodeAt(0)] };
// 				$scope.click_a = function($event) {
// 					$event.stopPropagation();
// 				}
// 			},
// 			templateUrl  : 'assets/app/common/vcard/vcard-trigger.template.html',
// 			replace   : true
// 		};
// 	});
// });

define(['angular'], function (angular) {
	angular.module('vcardtrigger', [])
	.directive('vcardtrigger', function () {
		return {
			require   : '^tabs',
			restrict  : 'E',
			transclude: true,
			scope     : {
				type: '@',
				src : '=',
				triggersize:'@'
			},
			controller: function ($scope, $timeout) {
				$scope.triggersize = $scope.triggersize ? $scope.triggersize : '30px';
				$scope.triggerStyle = {'padding-top': '0px', 'padding-right': '8px', 'padding-bottom': '0px'};
				
				$scope.colors = ["#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"];
				// $scope.colorStyle = {'background-color':  $scope.colors[Math.floor(Math.random()*26)] };
				$scope.color_index = $scope.src.lastname ? $scope.src.lastname[0] : 'a'
				$scope.colorStyle = {'background-color': $scope.colors[$scope.color_index.toLocaleLowerCase().charCodeAt(0) - 'a'.charCodeAt(0)]};
				$scope.click_a = function ($event) {
					$event.stopPropagation();
				};
				$scope.vcardbox_show_switch = function(val, event) {
					if (!$scope.$root.vcard_box) {
						$scope.$root.vcard_box = {};
					}
					if(val) {
						$scope.$root.vcard_box.offset = $(event.target).offset();
						$scope.$root.vcard_box.offset.width = event.target.offsetWidth;
						$scope.$root.vcard_box.src = $scope.src;
						$scope.$root.vcard_box.type = $scope.type;
					}
					$scope.$root.vcard_box_show = val;
				}
			},
			templateUrl: 'assets/app/common/vcard/vcardtrigger.template.html'
		};
	});
});
