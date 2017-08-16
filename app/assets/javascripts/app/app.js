define(['angular', 'jquery', 'bootstrap-dialog', 'angular-route', 'angular-sanitize', 'ui-bootstrap', 'app/menu/menu', 'app/comment/comment', 'app/contact/contacts',
	'app/welcome/full-page-loader'], function (angular, $, BD) {
	var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ui.bootstrap', 'menu', 'comment', 'contacts', 'fullPageLoader'])
		.factory("srvAuth", ['$rootScope',
			function ($rootScope) {

				window.ajaxRequest = function (myPostData, url, success, error, complete) {

					var headers = {};
					headers.antiForgeryToken = sessionStorage.getItem("antiForgeryToken");
					$( "#full-page-loader_unique" ).show();
					var options = {
						url: url,
						type: "post",
						data: JSON.stringify(myPostData),
						contentType: "application/json; charset=UTF-8",
						dataType: "text",
						// headers: headers,
						headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') },
						context: this,
						success: success,
						error: error,
						complete: function (res) {
							if (complete) {
								complete(res);
							}

							$( "#full-page-loader_unique" ).hide();
							if (res.status == 401) {
								BD.alert('Please login.');
							}
						}
					};
					$.ajax(options);
				}
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
		.controller('AuthCtrl1', ['$scope', '$location',
			function ($scope, $location) {
				debugger
				$scope.name = 'aaa';
			}])
		.controller('login', ['$scope', '$location', '$http',
			function ($scope, $location, $http) {
				$scope.name = 'aaa';
				$scope.login = function () {
					var user = {user: 'adfadf'};
					ajaxRequest(user, '/auth/login',function(){
						// debugger
					},function(){
						debugger
					})
					// $http({
					// 	method: 'POST',
					// 	data: user,
					// 	url: '/auth/login'
					// }).then(function successCallback(response) {
					// 	debugger
					// }, function errorCallback(response) {
					// 	debugger
					// }).then(function () {
					// 	debugger
					// 	// $scope.$root['ajax_loader'].show = false;
					// 	// "complete" code here
					// });
				}
			}]);
		// .controller('vcard1', function ($scope, $sce) {
		// 	$scope.dynamicPopover = {
		// 		content: 'Hello, World!',
		// 		templateUrl: '/assets/app/common/vcard/vcard.template.html',
		// 		title: 'Title'
		// 	};
		//
		// 	$scope.placement = {
		// 		options: [
		// 			'top',
		// 			'top-left',
		// 			'top-right',
		// 			'bottom',
		// 			'bottom-left',
		// 			'bottom-right',
		// 			'left',
		// 			'left-top',
		// 			'left-bottom',
		// 			'right',
		// 			'right-top',
		// 			'right-bottom'
		// 		],
		// 		selected: 'right-top'
		// 	};
		//
		// 	// $scope.htmlPopover = $sce.trustAsHtml('<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content');
		//
		// });

	app.config(['$routeProvider',
		function ($routeProvider) {
			// $routeProvider.when('/ShowOrders', {
			//   templateUrl: 'show_orders.html',
			//   controller: 'ShowOrdersController'
			// });
			$routeProvider.when('/contacts', {
				// templateUrl: 'app/contact/contact.template.html',
				template: '<contacts></contacts>'
			});
			$routeProvider.when('/comment', {
				template: '<comment></comment>'
			});
			$routeProvider.when('/callback', {
				controller: 'AuthCtrl1',
				templateUrl: 'app/welcome/callback.template.html'
			});
			$routeProvider.when('/welcome', {
				controller: 'login',
				templateUrl: '/assets/app/welcome/welcome.template.html'
			});
			$routeProvider.otherwise({
				redirectTo: '/welcome'
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

