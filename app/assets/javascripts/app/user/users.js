define(['angular', 'toastr', 'bootstrap-dialog', 'angular-modal-service', 'app/common/vcard/vcard',
		'app/common/dragdrop/dragdrop', 'app/common/paging/paging'],
	function (angular) {
		angular.module('users', ['angularModalService', 'vcard', 'dragdrop', 'paging'])
			.directive('users', function () {

				return {
					require: '^tabs',
					restrict: 'E',
					transclude: true,
					scope: {},
					controller: function ($scope, $element, $routeParams) {
						$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
						$scope.contacts = [];
					},
					templateUrl: 'assets/app/user/users.template.html',
					replace: true
				};
			})
			.controller('Controller', function ($scope, $routeParams, $location, ModalService) {
				$scope.newUserForm = {
					firstname: '',
					lastname: '',
					email: ''
				}
				$scope.show = function () {
					ModalService.showModal({
						templateUrl: 'assets/app/user/new-user.template.html',
						controller: "ModalController",
						scope: $scope
					}).then(function (modal) {
						modal.element.modal();
						modal.close.then(function (result) {
							$location.search('newuser', null);
						});
					});
				}

				$scope.show_update_hash = function () {
					$location.search('newuser', null);
					$location.search('newuser', 'true');
				}

				$scope.query_params = function() {
					if ($routeParams.newuser == 'true') {
						$scope.show();
					}
				}
				$scope.$on('$routeUpdate', function () {
					$scope.query_params();
				});
				$scope.query_params();

			})
			.controller('ModalController', function ($scope, $location, close) {
				$scope.submit = function () {
					ajaxRequest($scope.newUserForm, '/user/new_user', function (res) {
						$scope.$apply(function () {
							$scope.newUserForm = {
								firstname: '',
								lastname: '',
								email: ''
							}
						});
						toastr.success('New user saved successfully.');
					}, function (res) {
						// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
						toastr.error(res.info.message ? res.info.message : res.info.server_msg);
					});
				}

				$scope.close = function (result) {
					close(result, 500); // close, but give 500ms for bootstrap to animate
				};
			})
	})
;
