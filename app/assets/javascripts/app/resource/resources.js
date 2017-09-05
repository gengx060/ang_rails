define(['angular', 'moment', 'toastr', 'bootstrap-dialog', 'angular-modal-service', 'app/common/vcard/vcard',
		'app/common/dragdrop/dragdrop', 'app/common/paging/paging', 'app/common/sorting/sorting'],
	function (angular, moment) {
		angular.module('resources', ['angularModalService', 'vcard', 'dragdrop', 'paging', 'sorting'])
		.directive('resources', function () {

			return {
				require: '^tabs',
				restrict: 'E',
				transclude: true,
				scope: {},
				controller: function ($scope, $element, $routeParams) {
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

					$scope.refresh_list = 0;
					$scope.refreshList = function () {
						$scope.refresh_list++;
					};
				},
				templateUrl: 'assets/app/resource/resources.template.html',
				replace: true
			};
		});
	});
