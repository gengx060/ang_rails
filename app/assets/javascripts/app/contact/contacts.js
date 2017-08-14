define(['angular', 'angular-modal-service', 'app/common/vcard/vcard'], function (angular) {
	angular.module('contacts', ['angularModalService', 'vcard'])
	.directive('contacts', function () {
		
		return {
			require    : '^tabs',
			restrict   : 'E',
			transclude : true,
			scope      : {},
			controller : function ($scope, $element) {
				$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
				$scope.contacts = [
					{
						id        : 1,
						name      : 'Stefanih',
						img       : "assets/asset/img/g1.jpg",
						time_stamp: '12/12/2016, 11:06:47 AM'
					},
					{
						id        : 2,
						name      : 'Exactor',
						img       : null,
						time_stamp: '12/15/2016, 10:06:47 AM'
					},
					{
						id        : 3,
						name      : 'Belle Chang-Li',
						parent_id : null,
						img       : "assets/asset/img/b1.jpg",
						time_stamp: '12/18/2016, 11:06:47 AM'
					}
				];
				
			},
			templateUrl: 'assets/app/contact/contacts.template.html',
			replace    : true
		};
	})
	.controller('Controller', function ($scope, ModalService) {

		$scope.show = function () {
			ModalService.showModal({
				templateUrl: 'assets/app/contact/modal.template.html',
				controller : "ModalController"
			}).then(function (modal) {
				modal.element.modal();
				modal.close.then(function (result) {
					$scope.message = "You said 1" + result;
				});
			});
		}
	})
	.controller('ModalController', function($scope, close) {
		
		$scope.close = function(result) {
			close(result, 500); // close, but give 500ms for bootstrap to animate
		};
	});
});
