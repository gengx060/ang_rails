define(['angular', 'jquery', 'bootstrap-dialog', 'toastr', 'Enumerable', 'select2', 'angular-route', 'angular-sanitize', 'ui-bootstrap',
	'app/menu/menu', 'app/comment/comment', 'app/contact/users', 'app/appointment/appointment',
	'app/common/factory/usstates'], function (angular, $, BD, toastr, Enumerable) {
	var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'menu', 'comment',
			'users', 'appointment', 'usstates'])
		.factory("srvAuth", ['$rootScope',
			function ($rootScope) {
				var srvAuth = {};
				srvAuth.fblogin = function () {
					FB.login(function (response) {
						if (response.status === 'connected') {
							// You can now do what you want with the data fb gave you.
							console.info(response);
						}
					});
				}

				srvAuth.watchLoginChange = function () {
					var _self = this;
					FB.Event.subscribe('auth.authResponseChange', function (res) {
						if (res.status === 'connected') {
							FB.api('/me', function (res) {
								$rootScope.$apply(function () {
									$rootScope.user = _self.user = res;
									console.info($rootScope.user);
								});
							});
						} else {
							alert('Not Connected');
						}
					});
				}

				srvAuth.logout = function () {
					var _self = this;
					FB.logout(function (response) {
						$rootScope.$apply(function () {
							$rootScope.user = _self.user = {};
						});
					});
				}

				return srvAuth;
			}
		])
		.controller('AuthCtrl', ['srvAuth', '$scope',
			function (srvAuth, $scope) {
				$scope.logout = function () {
					srvAuth.logout();
				}
				$scope.fblogin = function () {
					FB.api(
						"/me/friends",
						function (response) {
							debugger
							if (response && !response.error) {
								/* handle the result */
							}
						}
					);
				}
			}])
		.controller('login', ['$scope', '$location', '$http', '$location',
			function ($scope, $location, $http, $location) {
				$scope.user = {
					email   : 'gaix01@163.com',
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
						location.hash = '#!/welcome';
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
			}])
		.controller('signup', ['$scope', 'usstates',
			function ($scope, usstates) {
				$scope.states = usstates;
				$("#e10").select2({
					data       : usstates,
					placeholder: "Select a state"
				});
				$scope.contact = {
					firstname: 'Dan',
					lastname : 'Curt',
					email    : 'gaix061@163.com',
					password : 'gege1818',
					password1: 'gege1818',
					phone    : {
						area  : '218',
						number: '4616620',
						ext   : ''
					},
					address  : {
						street : '2nd st',
						apt    : 'apt 29',
						city   : 'Miami',
						state  : '',
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
			}]);

	app.config(['$routeProvider',
		function ($routeProvider) {
			// $routeProvider.when('/ShowOrders', {
			//   templateUrl: 'show_orders.html',
			//   controller: 'ShowOrdersController'
			// });
			$routeProvider.when('/contacts', {
				template      : '<users></users>',
				reloadOnSearch: false
			});
			$routeProvider.when('/appointments', {
				template      : '<appointment></appointment>',
				reloadOnSearch: false
			});
			$routeProvider.when('/comment', {
				template: '<comment></comment>'
			});
			$routeProvider.when('/callback', {
				controller : 'AuthCtrl1',
				templateUrl: 'app/welcome/callback.template.html'
			});
			$routeProvider.when('/welcome', {
				// controller: 'login',
				templateUrl: 'assets/app/welcome/welcome.template.html'
			});
			$routeProvider.when('/login', {
				controller : 'login',
				templateUrl: 'assets/app/welcome/login.template.html'
			});
			$routeProvider.when('/signup', {
				controller : 'signup',
				templateUrl: 'assets/app/welcome/signup.template.html'
			});
			$routeProvider.otherwise({
				redirectTo: '/welcome'
			});
		}]);

	toastr.options = {
		closeButton      : true,
		timeout          : 3000,
		preventDuplicates: true,
		positionClass    : "toast-top-full-width"
	};
	window.toastr = toastr;
	window.Enumerable = Enumerable;
	window.development = true;
	window.BD = BD;
	window.BD.singletonCount = 1;
	window.ajaxRequestCount = 0;
	window.nonLoginRoutes = ["#!/login", "#!/signup"];
	$.fn.select2.defaults.set("theme", "bootstrap");
	window.jsonEqual = function (obj, obj1) {
		return Enumerable.From(Object.entries(obj).map(function (i) {
				return i.join(',')
			})).OrderBy().ToArray().join(',')
			== Enumerable.From(Object.entries(obj1).map(function (i) {
				return i.join(',')
			})).OrderBy().ToArray().join(',')
	}
	window.ajaxRequest = function (myPostData, url, success, error, complete) {
		var process_res = function (res, fun, error_function_flag) {
			try {
				if (typeof res.responseText === "string") {
					res.info = {};
					res.info.server_msg = res.responseText;
					res.info = JSON.parse(res.responseText);
				} else if (typeof res === "string") {
					var res1;
					res1 = JSON.parse(res);
					res1.server_msg = res;
					res = res1;
				}
			} catch (e) {
			}
			try {
				if (fun) {
					fun(res);
				} else {
					if (error_function_flag && res.status != 200) {
						var message = development ? res.responseText : res.statusText
						if (res.info && res.info.message)
							message += ': ' + res.info.message
						toastr.error(message);
					}
				}
			} catch (e) {
			}
		};
		var headers = {};
		headers.antiForgeryToken = sessionStorage.getItem("antiForgeryToken");
		$("#full-page-loader_unique").show();
		var options = {
			url        : url,
			type       : "post",
			data       : JSON.stringify(myPostData),
			contentType: "application/json; charset=UTF-8",
			dataType   : "text",
			headers    : {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
			context    : this,
			success    : function (res) {
				process_res(res, success);
			},
			error      : function (res) {
				process_res(res, error, 1);
			},
			complete   : function (res) {
				process_res(res, complete);
				ajaxRequestCount--;
				if (ajaxRequestCount == 0)
					$("#full-page-loader_unique").hide();
				if (res.status == 401 && nonLoginRoutes.indexOf(location.hash) == -1) {
					if (BD.singletonCount == 1) {
						BD.singletonCount--;
						console.log('redirect to login page.');
						location.href = '#!/login';
					}
				}
			}
		};
		ajaxRequestCount++;
		$.ajax(options);
	}
	app.run(['$rootScope', '$window', '$location',
		function ($rootScope, $window, $location) {
			//old_path_reserved is the purpose of preventing search upate trigger login check
			$location.old_path_reserved = '';
			$rootScope.$on('$locationChangeStart', function (evt, next, current) {
				if ($location.$$path == '' && (current != next)) {
					evt.preventDefault();
					return;
				}
				if ($location.old_path_reserved == $location.$$path) {
					return;
				}
				$location.old_path_reserved = $location.$$path;
				ajaxRequest({}, '/auth/login_check', function () {
					if (nonLoginRoutes.indexOf(location.hash) == -1) {
						$rootScope.showmenu = true;
					}
				}, function () {
					$rootScope.showmenu = false;
					if (nonLoginRoutes.indexOf(location.hash) > -1) {
						event.preventDefault();
					} else {
						location.href = ("#!/login");
					}
				});
			});
			$rootScope.user = {};
			$rootScope.profile_placeholder = "/assets/asset/img/blank-profile.png";
			$window.fbAsyncInit = function () {
				// Executed when the SDK is loaded
				FB.init({
					appId  : '123129551645487',
					cookie : true,
					xfbml  : true,
					version: 'v2.8'
				});

				FB.AppEvents.logPageView();
				// sAuth.watchAuthenticationStatusChange();
			}

		}
	]);


	angular.element(function () {
		angular.bootstrap(document.body, ['app']);
	});

	(function (d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s);
		js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	// return app;
});

