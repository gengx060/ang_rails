define(['angular', 'jquery', 'bootstrap-dialog', 'toastr', 'angular-route', 'angular-sanitize', 'ui-bootstrap',
	'app/menu/menu', 'app/comment/comment', 'app/user/users',
	'app/welcome/full-page-loader'], function (angular, $, BD, toastr) {
	var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'menu', 'comment', 'users', 'fullPageLoader'])
	.factory("srvAuth", ['$rootScope',
		function ($rootScope) {
			toastr.options = {
				timeOut: 3000,
				closeButton: true,
				positionClass: "toast-bottom-full-width"
			};
			window.toastr = toastr;
			window.BD = BD;
			window.BD.singletonCount = 1;
			window.ajaxRequest = function (myPostData, url, success, error, complete) {
				var process_res = function (res, fun, error_function_flag) {
					if (typeof res.responseText === "string") {
						try {
							res.info = {};
							res.info.server_msg = res.responseText;
							res.info = JSON.parse(res.responseText);
						} catch (e) {
						}
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

						$("#full-page-loader_unique").hide();
						// here need to take care login case
						// generic cases except login
						// if (['/auth/login', '/auth/login_check', '/account/get_menu'].indexOf(url) == -1
						// debugger
						if (res.status == 401 && location.hash != '#!/login') {
							if (BD.singletonCount == 1) {
								BD.singletonCount--;
								// var bd = BD.alert({
								// 	message: 'Redirect to login in 3 secs.',
								// 	title: res.info.message
								// });
								console.log('redirect to login page.');
								location.href = '#!/login';
								// debugger
								// var timeout = 0;
								// var intr = setInterval(function () {
								// 	console.log();
								// 	if (timeout > 0) {
								// 		timeout--;
								// 		// bd.setMessage('Redirect to login in ' + timeout-- + ' secs.')
								// 	} else {
								// 		BD.singletonCount = 0; // reset to allow BD showup again
								// 		clearInterval(intr);
								// 		location.href = '#!/login';
								// 	}
								// }, 1000);
							}
						}
					}
				};
				$.ajax(options);
			}

			//remember location hash, if loged in, redirect.
			var loc_hash = location.hash;
			ajaxRequest({}, '/auth/login_check', function () {
				location.hash = (loc_hash == '#!/login' ? '#!/welcome' : loc_hash)
				// location.hash = loc_hash;
				ajaxRequest({}, '/account/get_menu', function () {
					$rootScope.$apply(function () {
						$rootScope.showmenu = true;
						$rootScope.menus = [
							{name: 'welcome', route: '/welcome', nav: false, title: 'Welcome'},
							{name: 'comments', route: '/comment', nav: true, title: 'Github Users'},
							{name: 'users', route: '/users', nav: true, title: 'Github Users'}
						];
						$rootScope.user = {
							id: 3,
							name: 'Belle Chang-Li',
							parent_id: null,
							img: "assets/asset/img/b1.jpg",
							msgCount: 2,
							time_stamp: '12/18/2016, 11:06:47 AM'
						}
					});
				}, function () {
				});

			}, function () {
			});

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
					toastr.success('New user saved successfully.');

					ajaxRequest({}, '/account/get_menu', function () {
						$scope.$apply(function () {
							$scope.$root.showmenu = true;
							$scope.$root.menus = [
								{name: 'welcome', route: '/welcome', nav: false, title: 'Welcome'},
								{name: 'comments', route: '/comment', nav: true, title: 'Github Users'},
								{name: 'users', route: '/users', nav: true, title: 'Github Users'}
							];
						});
						location.hash = '#!/welcome';
					}, function () {
					});
				}, function () {
					$scope.$apply(function () {
						$scope.showAlert = true;
					});
				})
			}
		}]);

	app.config(['$routeProvider',
		function ($routeProvider) {
			// $routeProvider.when('/ShowOrders', {
			//   templateUrl: 'show_orders.html',
			//   controller: 'ShowOrdersController'
			// });
			$routeProvider.when('/users', {
				// templateUrl: 'app/contact/contact.template.html',
				template: '<users></users>'
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
				templateUrl: '/assets/app/welcome/welcome.template.html'
			});
			$routeProvider.when('/login', {
				controller: 'login',
				templateUrl: '/assets/app/welcome/login.template.html'
			});
			$routeProvider.otherwise({
				redirectTo: '/login'
			});
		}]);


	app.run(['$rootScope', '$window', 'srvAuth',
		function ($rootScope, $window, sAuth) {
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

