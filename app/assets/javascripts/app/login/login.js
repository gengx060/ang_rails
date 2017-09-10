define(['angular', 'jquery', 'select2', 'app/common/factory/usstates'], function (angular, $) {
	angular.module('login', ['usstates'])
	.directive('login', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: {},
			controller: function ($scope, $routeParams, usstates) {
				// $scope.templatePath = 'assets/app/login/change-password.template.html';
				$scope.query_params = function () {
					if ($routeParams.forgetpassword == 'true') {
						$scope.templatePath = 'assets/app/login/forget-password.template.html';
					} else if ($routeParams.signup == 'true') {
						$scope.templatePath = 'assets/app/login/signup.template.html';
						$scope.states = usstates;
						$scope.contact = {
							firstname: 'Dan',
							lastname: 'Curt',
							email: 'gaix061@163.com',
							password: 'gege1818',
							password1: 'gege1818',
							phone: {
								area: '218',
								number: '4616620',
								ext: ''
							},
							address: {
								street: '2nd st',
								apt: 'apt 29',
								city: 'Miami',
								state: '',
								zipcode: '33064'
							}
						};
						$scope.alert_msg = "";
						$scope.alert_msg_show = false;
						$scope.state_select = function () {
							if ($scope.contact.address.state && $scope.contact.address.state != "")
								$("#state_select").css('color', '#000');
						};
						$scope.$root.showmenu = false;
						$scope.submit = function () {
							if ($scope.contact.password != $scope.contact.password1) {
								$scope.alert_msg = "Password doesn't match.";
								$scope.alert_msg_show = true;
							} else {
								$scope.alert_msg_show = false;
								ajaxRequest($scope.contact, '/auth/signup', function () {
									toastr.success('Sign up successful.');
									setTimeout(function () {
										location.hash = '#!/welcome';
									}, 1000);
								})
							}
						}
						
						$(document).ready(function () {
							setTimeout(function () {
								$("#signup_state").select2({
									data: usstates,
									placeholder: "Select a state"
								});
							}, 200);
						});
					} else if ($routeParams.changepassword == 'true') {
						$scope.templatePath = 'assets/app/login/change-password.template.html';
					} else {
						$scope.templatePath = 'assets/app/login/login.template.html';
						$scope.user = {
							email: 'gaix01@163.com',
							password: 'gege1818'
						};
						$scope.$root.showmenu = false;
						$scope.name = 'name1';
						$scope.showAlert = false;
						$scope.hideAlert = function () {
							$scope.showAlert = false;
						}
						
						$scope.submit = function () {
							ajaxRequest($scope.user, '/auth/login', function () {
								$scope.$apply(function () {
									$scope.$root.showmenu = true;
								});
								ajaxRequest({}, '/setting/get_preference', function (res) {
									var obj = {
										pagesize: 20,
										loginpage: 'Welcome',
										timezone: 'America/New_York'
									};
									if (res.length > 0) {
										res.forEach(function (i) {
											obj[i.name] = i.value;
										});
									}
									$scope.$root.$apply(function () {
										$scope.$root.user_preferrence = obj;
									});
									location.hash = "#!/" + $scope.$root.user_preferrence.loginpage.toLowerCase();
								});
							}, function (res) {
								if (res.status == 422) {
									location.reload();
								}
								$scope.$apply(function () {
									if (res.info.message == 'Incorrect username or password.') {
										$scope.showAlert = true;
									} else {
										toastr.error(res.responseText);
									}
								});
							})
						}
					}
				};
				$scope.$on('$routeUpdate', function (next, current) {
					$scope.query_params()
				});
				$scope.query_params()
			},
			templateUrl: '/assets/app/login/container.template.html',
			replace: true
		};
	});
});