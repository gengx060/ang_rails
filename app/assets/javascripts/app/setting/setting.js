define(['angular', 'jquery', 'select2'],
	function (angular, $) {
		angular.module('setting', [])
		.directive('setting', function () {
			return {
				require    : '^tabs',
				restrict   : 'E',
				transclude : true,
				scope      : {},
				controller : function ($scope, $element, $http) {
					$scope.user_preferrence = $scope.$root.user_preferrence;
					$scope.show_preference = true;
					$scope.switch_preference = function() {
						$scope.show_preference = !$scope.show_preference;
					};
					
					angular.element(document).ready( function(){
						$("#pagesize").select2({
							data: [20, 50, 100],
							placeholder: "Select a page size"
						});
						$("#timezone").select2({
							data: ['America/Los_Angeles', 'America/Chicago', 'America/New_York'],
							placeholder: "Select a time zone"
						});
						$("#loginpage").select2({
							data: ['Contact', 'Resource', 'Appointment', 'Setting'],
							placeholder: "Select a login page"
						});
					});
					// {
					// 	pagesize: 20,
					// 	timezone: 'America/New_York',
					// 	loginpage: '#!/contacts'
					// };
				},
				templateUrl: 'assets/app/setting/setting.template.html',
				replace    : true
			};
		});
	});
