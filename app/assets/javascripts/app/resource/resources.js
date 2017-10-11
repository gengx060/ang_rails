define(['angular', 'moment', 'toastr', 'bootstrap-dialog', 'angular-modal-service', 'app/common/vcard/vcard',
		'app/common/dragdrop/dragdrop', 'app/common/paging/paging', 'app/common/sorting/sorting', 'app/common/preview/previewtrigger'],
	function (angular, moment) {
		angular.module('resources', ['angularModalService', 'vcard', 'dragdrop', 'paging', 'sorting', 'previewtrigger'])
		.directive('resources', function () {

			return {
				require: '^tabs',
				restrict: 'E',
				transclude: true,
				scope: {},
				controller: function ($scope, $element, $routeParams, $location) {
					$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
					$scope.resources = [];
					$scope.from_now = function (it) {
						var time = moment(it).fromNow();
						if (time == 'Invalid date') {
							time = '';
						}
						return time;
					};
					$scope.sort_email = 'email';
					$scope.sort_name = 'name';
					
					$scope.newresource = function (next, current) {
						$location.search('newresource', null);
						$location.search('newresource', 'true');
					};
					
					$scope.query_params = function () {
						if ($routeParams.newresource == 'true') {
							$scope.templatePath = 'assets/app/resource/new-resource.template.html';
							$scope.forget_password = {
								email: ''
							};
							$scope.submit = function () {
								ajaxRequest($scope.forget_password, '/auth/forget_password', function () {
									toastr.success("Please check your email and follow the instructions to reset your password.");
								});
							}
						} else {
							$scope.templatePath = '';
						}
					};
					$scope.$on('$routeUpdate', function (next, current) {
						$scope.query_params()
					});
					$scope.query_params()
				},
				templateUrl: 'assets/app/resource/resources.template.html',
				replace: true
			};
		});
	});
