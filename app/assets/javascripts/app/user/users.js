define(['angular', 'toastr', 'bootstrap-dialog', 'angular-modal-service', 'app/common/vcard/vcard',
		'app/common/dragdrop/dragdrop'],
	function (angular) {
		angular.module('users', ['angularModalService', 'vcard', 'dragdrop'])
			.directive('users', function () {

				return {
					require: '^tabs',
					restrict: 'E',
					transclude: true,
					scope: {},
					controller: function ($scope, $element) {
						$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
						$scope.contacts = [];
						$scope.total = 0;
						$scope.offset = 0;
						$scope.limit = 2;
						$scope.current_page = 1;
						$scope.goto_page = 1;
						// ajaxRequest({}, '/user/user_list', function (res) {
						// 	$scope.$apply(function () {
						// 		$scope.contacts = res.users;
						// 		$scope.total = res.total;
						// 		$scope.offset = $scope.offset + $scope.limit;
						// 	});
						// }, function (res) {
						// 	toastr.error(res.info.message ? res.info.message : res.info.server_msg);
						// });

						$scope.page = function () {
							ajaxRequest({
								offset: $scope.offset,
								limit: $scope.limit
							}, '/user/user_list', function (res) {
								$scope.$apply(function () {
									$scope.contacts = res.users;
									$scope.total = res.total;
									// $scope.offset = $scope.offset + $scope.limit;
								});
							}, function (res) {
								toastr.error(res.info.message ? res.info.message : res.info.server_msg);
							});
						}
						$scope.page();

						$scope.firstPage = function () {
							if ($scope.offset == 0 && $scope.current_page == 1)
								return;
							$scope.offset = 0;
							$scope.current_page = 1;
							$scope.page()
						}
						$scope.prePage = function () {
							// debugger
							if ($scope.offset < 0 || $scope.current_page == 1)
								return;
							$scope.offset -= $scope.limit;
							$scope.current_page--;
							$scope.page()
						}

						$scope.gotoPage = function (keyEvent) {
							if (keyEvent.which != 13)
								return;
							if($scope.goto_page < 2){
								$scope.firstPage();
								return
							}
							var lastPage = $scope.total / $scope.limit;
							if($scope.goto_page >= lastPage){
								$scope.lastPage();
								return
							}

							$scope.offset = ($scope.goto_page-1) * $scope.limit;
							$scope.page()
							$scope.current_page = $scope.goto_page;
						}
						$scope.nextPage = function () {
							if ($scope.offset + $scope.limit >= $scope.total)
								return;
							$scope.offset += $scope.limit;
							// if ($scope.current_page + 1 < $scope.total / $scope.limit)
							$scope.current_page++;
							$scope.page()
						}
						$scope.lastPage = function () {
							var lastPage = $scope.total / $scope.limit;
							if (lastPage == parseInt(lastPage)) {
								$scope.current_page = lastPage;
							} else {
								$scope.current_page = parseInt(lastPage) + 1;
							}
							$scope.offset = ($scope.current_page - 1) * $scope.limit;
							$scope.page()
						}
					},
					templateUrl: 'assets/app/user/users.template.html',
					replace: true
				};
			})
			.controller('Controller', function ($scope, ModalService) {
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
							console.log(123);
							$scope.message = "You said 1" + result;
						});
					});
				}
			})
			.controller('ModalController', function ($scope, close) {
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
					// console.log('closing');
					close(result, 500); // close, but give 500ms for bootstrap to animate
				};
			})
	})
;
