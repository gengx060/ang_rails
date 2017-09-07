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
					
					$scope.$root.$watch('user_preferrence', function (newValue, oldValue) {
						$scope.user_preferrence = newValue;
					});
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
							data: ['Welcome', 'Contacts', 'Resources', 'Appointments', 'Settings'],
							placeholder: "Select a login page"
						});
					});
					
					$scope.submit = function() {
						var parms = {preferences:[]};
						Object.keys($scope.user_preferrence).forEach(function(k){
							parms['preferences'].push( {name: k,value:$scope.user_preferrence[k]});
						});
						ajaxRequest(parms, '/setting/save_preference', function () {
							toastr.success('Save preference successful.')
						});
					}
				},
				templateUrl: 'assets/app/setting/setting.template.html',
				replace    : true
			};
		});
	});
