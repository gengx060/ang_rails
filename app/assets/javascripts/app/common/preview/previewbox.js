
define(['angular'], function (angular) {
	angular.module('previewbox', [])
	.directive('previewbox', function () {
		return {
			require   : '^tabs',
			restrict  : 'E',
			transclude: true,
			scope     : {
				type: '@',
				// src : '=',
				triggersize:'@'
			},
			controller: function ($scope, $sce) {
				$scope.$root.preview_box_show = false;
				$scope.$root.src = {
					type: 'pdf',
					path: ("ID_POA_EFO00104.pdf")
				}
				$scope.$root.src = {
					type: 'pdf',
					path: "text.txt"
				}
				$scope.$root.src = {
					type: 'img',
					path: ("assets/app/demo/img.jpg")
				}

				$scope.$root.preview_div_switch = function(val) {
					if(val) {
						$scope.$root.preview_box_show = val;
						$("body").addClass("modal-open");
					} else {
						$scope.$root.preview_box_show = !$scope.$root.preview_box_show;
						$("body").removeClass("modal-open")
					}
				};
			},
			templateUrl: 'assets/app/common/preview/previewbox.template.html',
		};
	});
});
