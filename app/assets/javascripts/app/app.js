define(['angular', 'jquery', 'bootstrap-dialog', 'toastr', 'angular-route', 'angular-sanitize', 'ui-bootstrap',
	'app/menu/menu', 'app/comment/comment', 'app/user/users',
	'app/welcome/full-page-loader'], function (angular, $, BD, toastr) {
	var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'menu', 'comment', 'users', 'fullPageLoader'])
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

					location.hash = '#!/welcome';
				}, function () {
					$scope.$apply(function () {
						$scope.showAlert = true;
					});
				})
			}
		}])
	.controller('signup', ['$scope', '$location', '$http', '$location',
		function ($scope, $location, $http, $location) {
			$scope.contact = {
				email: '',
				password: '',
				password1: '',
				phone: {
					are: '',
					number: '',
					ext: ''
				},
				address: {
					street: '',
					apt: '',
					city: '',
					state: '',
					zipcode: ''
				}
			};
			$scope.$root.showmenu = false;
			$scope.submit = function () {
				ajaxRequest($scope.contact, '/auth/signup', function () {

					location.hash = '#!/welcome';
				})
			}
		}]);

	app.config(['$routeProvider',
		function ($routeProvider) {
			// $routeProvider.when('/ShowOrders', {
			//   templateUrl: 'show_orders.html',
			//   controller: 'ShowOrdersController'
			// });
			$routeProvider.when('/contacts', {
				template: '<users></users>',
				reloadOnSearch: false
			});
			$routeProvider.when('/comment', {
				template: '<comment></comment>'
			});
			$routeProvider.when('/callback', {
				controller: 'AuthCtrl1',
				templateUrl: 'app/welcome/callback.template.html'
			});
			$routeProvider.when('/welcome', {
				// controller: 'login',
				templateUrl: 'assets/app/welcome/welcome.template.html'
			});
			$routeProvider.when('/login', {
				controller: 'login',
				templateUrl: 'assets/app/welcome/login.template.html'
			});
			$routeProvider.when('/signup', {
				controller: 'signup',
				templateUrl: 'assets/app/welcome/signup.template.html'
			});
			$routeProvider.otherwise({
				redirectTo: '/login'
			});
		}]);


	toastr.options = {
		closeButton: true,
		preventDuplicates: true,
		positionClass: "toast-bottom-full-width"
	};
	window.toastr = toastr;
	window.BD = BD;
	window.BD.singletonCount = 1;
	window.ajaxRequestCount = 0;
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
						toastr.error(res.statusText);
					}
				}
			} catch (e) {
			}
		}
		var headers = {};
		headers.antiForgeryToken = sessionStorage.getItem("antiForgeryToken");
		$("#full-page-loader_unique").show();
		var options = {
			url: url,
			type: "post",
			data: JSON.stringify(myPostData),
			contentType: "application/json; charset=UTF-8",
			dataType: "text",
			headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
			context: this,
			success: function (res) {
				process_res(res, success);
			},
			error: function (res) {
				process_res(res, error, 1);
			},
			complete: function (res) {
				process_res(res, complete);
				ajaxRequestCount--;
				if (ajaxRequestCount == 0)
					$("#full-page-loader_unique").hide();
				if (res.status == 401 && location.hash != '#!/login') {
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
	var nonLoginRoutes = ["#!/login", "#!/signup"];
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
				$.ajax({
					type: "post",
					url: '/auth/login_check',
					headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
					async: false,
					success: function () {
						if (nonLoginRoutes.indexOf(location.hash) == -1) {
							$rootScope.showmenu = true;
						}
					},
					error: function () {
						$rootScope.showmenu = false;
						if (nonLoginRoutes.indexOf(nonLoginRoutes.hash) > -1) {
							event.preventDefault();
						} else {
							location.href = ("#!/login");
						}
					}
				});
			});
			$rootScope.user = {};
			$rootScope.profile_placeholder = "/assets/asset/img/blank-profile.png";
			$window.fbAsyncInit = function () {
				// Executed when the SDK is loaded
				FB.init({
					appId: '123129551645487',
					cookie: true,
					xfbml: true,
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

