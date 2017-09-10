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
					$scope.$root.showmenu = false;
					if ($routeParams.forgetpassword == 'true') {
						$scope.templatePath = 'assets/app/login/forget-password.template.html';
						$scope.forget_password = {
							email: ''
						};
						$scope.submit = function () {
							ajaxRequest($scope.forget_password, '/auth/forget_password', function () {
								toastr.success("Please check your email and follow the instructions to reset your password.");
							});
						}
					}
					else if ($routeParams.signup == 'true') {
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
					}
					else if ($routeParams.changepassword == 'true') {
						$scope.templatePath = 'assets/app/login/change-password.template.html';
						$scope.change_password = {
							password:'',
							password2:''
						};
						if (typeof $routeParams.hash === 'undefined') {
							location.href = ("#!/login");
							return
						} else {
							$scope.change_password.hash = $routeParams.hash;
						}
						$scope.submit = function () {
							if (typeof $routeParams.hash === 'undefined') {
								location.href = ("#!/login");
								return
							} else {
								$scope.change_password.hash = $routeParams.hash;
							}
							if($scope.change_password.password.length < 8) {
								toastr.error('Password is too short.');
								return
							}
							if($scope.change_password.password != $scope.change_password.password2) {
								toastr.error('Passwords do not match.');
								return
							}
							ajaxRequest($scope.change_password, '/auth/change_password', function (res) {
								toastr.success(res.message);
								location.href = ("#!/login");
							});
							$scope.change_password = {};
						}
					}
					else {
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