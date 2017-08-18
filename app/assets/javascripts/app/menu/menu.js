define(['angular', 'bootstrap', 'app/common/vcard/vcard'], function (angular) {
	angular.module('menu', ['vcard'])
	.directive('menu', function () {
		return {
			require    : '^tabs',
			restrict   : 'E',
			transclude : true,
			scope      : {},
			controller : function ($scope, $element) {
				$scope.menus = [];
				debugger
				// ajaxRequest($scope.newUserForm, '/account/get_menu', function (res) {
				// 	$scope.$apply(function(){
				// 		debugger
				// 		$scope.menus = [
				// 			{name: 'welcome', route: '/welcome', nav: false, title: 'Welcome'},
				// 			{name: 'comments', route: '/comment', nav: true, title: 'Github Users'},
				// 			{name: 'users', route: '/contacts', nav: true, title: 'Github Users'}
				// 		]
				// 	});
				// 	// toastr.success('New user saved successfully.');
				// }, function (res) {
				// 	// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
				// 	// toastr.error(res.info.message ? res.info.message : res.info.server_msg);
				// });
				$scope.user = {
					id        : 3,
					name      : 'Belle Chang-Li',
					parent_id : null,
					img       : "/assets/asset/img/b1.jpg",
					msgCount  : 1,
					time_stamp: '12/18/2016, 11:06:47 AM'
				}
			},
			templateUrl: 'assets/app/menu/menu.template.html',
			replace    : true
		};
	});
});