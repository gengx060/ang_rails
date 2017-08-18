define(['angular', 'toastr', 'bootstrap-dialog', 'angular-modal-service', 'app/common/vcard/vcard',
		'app/common/dragdrop/dragdrop'],
	function (angular) {
	angular.module('contacts', ['angularModalService', 'vcard', 'dragdrop'])
		.directive('contacts', function () {

			return {
				require: '^tabs',
				restrict: 'E',
				transclude: true,
				scope: {},
				controller: function ($scope, $element) {
					$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
					$scope.contacts = [
						// {
						// 	id        : 1,
						// 	name      : 'Stefanih',
						// 	img       : "assets/asset/img/g1.jpg",
						// 	time_stamp: '12/12/2016, 11:06:47 AM'
						// },
						// {
						// 	id        : 2,
						// 	name      : 'Exactor',
						// 	img       : null,
						// 	time_stamp: '12/15/2016, 10:06:47 AM'
						// },
						// {
						// 	id: 3,
						// 	name: 'Belle Chang-Li',
						// 	parent_id: null,
						// 	img: "assets/asset/img/b1.jpg",
						// 	time_stamp: '12/18/2016, 11:06:47 AM'
						// }
					];

				},
				templateUrl: 'assets/app/contact/contacts.template.html',
				replace: true
			};
		})
		.controller('Controller', function ($scope, ModalService) {
			$scope.newUserForm = {
				firstname : '',
				lastname : '',
				email : ''
			}
			$scope.show = function () {
				ModalService.showModal({
					templateUrl: 'assets/app/contact/new-user.template.html',
					controller: "ModalController",
					scope: $scope
				}).then(function (modal) {
					modal.element.modal();
					modal.close.then(function (result) {
						console.log(123);
						$scope.message = "You said 1" + result;
					});
				});
			}
		})
		.controller('ModalController', function ($scope, close) {
			$scope.submit = function () {
				ajaxRequest($scope.newUserForm, '/account/new_user', function (res) {
					$scope.$apply(function(){
						$scope.newUserForm = {
							firstname : '',
							lastname : '',
							email : ''
						}
					});
					toastr.success('New user saved successfully.');
				}, function (res) {
					// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
					toastr.error(res.info.message ? res.info.message : res.info.server_msg);
				});
			}

			$scope.close = function (result) {
				// console.log('closing');
				close(result, 500); // close, but give 500ms for bootstrap to animate
			};
		})
		// .controller('newUserForm', function ($scope, close) {
		// 	$scope.submit = function (e) {
		// 		debugger
		// 		if (e.isDefaultPrevented()) {
		// 			// handle the invalid form...
		// 		} else {
		// 			// everything looks good!
		// 		}
		// 	}
		// });
});
