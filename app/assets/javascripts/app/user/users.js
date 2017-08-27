define(['angular', 'moment', 'toastr', 'bootstrap-dialog', 'angular-modal-service', 'app/common/vcard/vcard',
		'app/common/dragdrop/dragdrop', 'app/common/paging/paging'],
	function (angular, moment) {
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
						$scope.from_now = function(it) {
							var time =  moment(it).fromNow()
							if (time == 'Invalid date') {
								time = ''
							}
							return time;
						};
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
				$scope.$parent.show = function () {
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
			.controller('UserController', function ($scope, $routeParams, $location, ModalService) {
				$scope.userForm = {
					firstname: '',
					lastname: '',
					email: ''
				}
				$scope.show_user = function (id) {
						ajaxRequest({user_id:id}, '/user/get_user', function (res) {
							debugger
							$scope.$apply(function () {
								$scope.userForm = {
									firstname: res.firstname,
									lastname: res.lastname,
									email: res.email
								}
							});
						}, function (res) {
							// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
							toastr.error(res.info.message ? res.info.message : res.info.server_msg);
						});
					ModalService.showModal({
						templateUrl: 'assets/app/user/user.template.html',
						controller: "UserModalController",
						scope: $scope
					}).then(function (modal) {
						modal.element.modal();
						modal.close.then(function (result) {
							$location.search('user', null);
						});
					});
				}

				$scope.show_update_hash = function (id) {
					$location.search('user', null);
					$location.search('user', id);
				}
				$scope.query_params = function() {
					if ($routeParams.user > 0) {
						$scope.show_user($routeParams.user);
					}
				}
				$scope.$on('$routeUpdate', function () {
					$scope.query_params();
				});
				$scope.query_params();

			})
			.controller('UserModalController', function ($scope, $location, close) {
				$scope.submit = function () {
					ajaxRequest($scope.newUserForm, '/user/get_user', function (res) {
						debugger
						$scope.$apply(function () {
							$scope.userForm = {
								firstname: '',
								lastname: '',
								email: ''
							}
						});
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
