define(['angular', 'jquery', 'bootstrap-dialog', 'toastr', 'Enumerable', 'select2',
		'preloadscript', 'angular-route', 'angular-sanitize', 'ui-bootstrap',
		'app/menu/menu', 'app/comment/comment', 'app/contact/users', 'app/resource/resources', 'app/appointment/appointment',
		'app/common/factory/usstates', 'app/setting/setting', 'app/login/login'],
	function (angular, $, BD, toastr, Enumerable) {
		var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'menu', 'comment',
			'users', 'resources', 'appointment', 'setting', 'login', 'usstates'])
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
			}]);
		
		app.config(['$routeProvider',
			function ($routeProvider) {
				$routeProvider.when('/resources', {
					template: '<resources></resources>',
					// reloadOnSearch: false
				});
				$routeProvider.when('/settings', {
					template: '<setting></setting>',
					reloadOnSearch: false
				});
				$routeProvider.when('/contacts', {
					template: '<users></users>',
					reloadOnSearch: false
				});
				$routeProvider.when('/appointments', {
					template: '<appointment></appointment>',
					reloadOnSearch: false
				});
				$routeProvider.when('/comments', {
					template: '<comment></comment>'
				});
				$routeProvider.when('/welcome', {
					templateUrl: 'assets/app/welcome/welcome.template.html'
				});
				$routeProvider.when('/login', {
					template: '<login></login>'
				});
				$routeProvider.otherwise({
					redirectTo: '/welcome'
				});
			}]);
		
		toastr.options = {
			closeButton: true,
			timeout: 3000,
			preventDuplicates: true,
			positionClass: "toast-top-full-width"
		};
		window.toastr = toastr;
		window.Enumerable = Enumerable;
		window.development = true;
		window.BD = BD;
		window.BD.singletonCount = 1;
		window.ajaxRequestCount = 0;
		window.nonLoginRoutes = ["#!/login", "#!/login1", "#!/signup"];
		$.fn.select2.defaults.set("theme", "bootstrap");
		
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
					var loc_hash = location.hash;
					if (loc_hash.indexOf('?') > -1) {
						loc_hash = loc_hash.substring(0, loc_hash.indexOf('?'));
					}
					if (([401, 422].indexOf(res.status) != -1 ) && nonLoginRoutes.indexOf(loc_hash) == -1) {
						console.log('redirect to login page.');
						location.href = '#!/login?error=Your session is expired, please login back.';
						location.reload();
					}
				}
			};
			ajaxRequestCount++;
			$.ajax(options);
		};

		//hide preload spin
		$("#full-page-loader_unique2").hide();

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
							if (typeof $rootScope.user_preferrence === 'undefined') {
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
									// obj.loginpage = loginpage
									$rootScope.$apply(function () {
										$rootScope.user_preferrence = obj;
									});
								});
							}
						}
					}, function () {
						$rootScope.showmenu = false;
						var loc_hash = location.hash;
						if (loc_hash.indexOf('?') > -1) {
							loc_hash = loc_hash.substring(0, loc_hash.indexOf('?'));
						}
						if (nonLoginRoutes.indexOf(loc_hash) > -1) {
							event.preventDefault();
						} else {
							location.href = ("#!/login");
						}
					});
				});
				$rootScope.user = {};
				$rootScope.profile_placeholder = "assets/asset/img/blank-profile.png";
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
	
		
		// return app;
	});

