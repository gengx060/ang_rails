define(['angular'], function (angular) {
	angular.module('previewtrigger', [])
	.directive('previewtrigger', function () {
		return {
			require   : '^tabs',
			restrict  : 'E',
			transclude: true,
			scope     : {
				sid: '@',
				// src : '=',
				triggersize:'@'
			},
			controller: function ($scope, $sce) {
				$scope.preview = function() {
					var params = {id: $scope.sid};
					ajaxRequest(params, '/resource/preview', function (res) {
						debugger
						$scope.$apply(function () {
							$scope.contact = res.contact;
							$scope.$root.preview_div_switch(true);
						});
					}, function (res) {
						toastr.error(res.info.message ? res.info.message : res.info.server_msg);
					});
				}
			},
			// template  : '<a href="#" ng-click="$root.preview_div_switch(true)"><i class="fa fa-eye"></i></a>'
			template  : '<a href="#" ng-click="preview(true)"><i class="fa fa-eye"></i></a>'
		};
	});
});
