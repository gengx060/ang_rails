define(['angular', 'moment', 'jquery', 'select2', 'angular-modal-service', 'app/common/vcard/vcard',
		'app/common/dragdrop/dragdrop', 'app/common/paging/paging', 'app/common/sorting/sorting'
		, 'app/common/searchbar/searchbar', 'app/common/factory/usstates'],
	function (angular, moment, $) {
		angular.module('users', ['angularModalService', 'vcard', 'dragdrop', 'paging', 'sorting', 'searchbar', 'usstates'])
		.directive('users', function () {
			
			return {
				require: '^tabs',
				restrict: 'E',
				transclude: true,
				scope: {},
				controller: function ($scope, $element, $routeParams, $location, usstates) {
					$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
					// $location.search('filterbyids', null);
					$scope.contacts = [];
					$scope.from_now = function (it) {
						var time = moment(it).fromNow();
						if (time == 'Invalid date') {
							time = '';
						}
						return time;
					};
					$scope.sort_email = 'email';
					$scope.sort_name = 'name';
					
					// $scope.templatePath ='assets/app/common/template/address.template.html';
					$scope.contact_detail = function () {
						// $location.search('newuser', null);
						// $location.search('newuser', 'true');
						$location.search('newcontact', null);
						$location.search('newcontact', 'true');
					};
					
					$scope.$on('$includeContentLoaded', function () {
						$("#state_select").select2({
							data: usstates,
							placeholder: "Select a state"
						});
					});
					
					$scope.query_params = function () {
						// if ($routeParams.newuser == 'true') {
						// 	$scope.show();
						// }
						if ($routeParams.newcontact == 'true') {
							$scope.templatePath = 'assets/app/common/templates/address.template.html';
							$scope.contact = {
								type:'c',
								firstname: '',
								lastname: '',
								email: '',
								phone: {
									area: '',
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
							$scope.submit = function () {
								ajaxRequest($scope.contact, '/user/create', function (res) {
									toastr.success(res.message);
									$scope.$apply(function () {
										$location.search('newcontact', null);
									});
								}, function (res) {
									// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
									toastr.error(res.info.message ? res.info.message : res.info.server_msg);
								});
							};
						} else {
							$scope.templatePath = '';
						}
					};
					$scope.$on('$routeUpdate', function () {
						$scope.query_params();
					});
					$scope.query_params();
					
					$scope.refresh_list = 0;
					$scope.refreshList = function () {
						$scope.refresh_list++;
					};
					
				},
				templateUrl: 'assets/app/contact/users.template.html',
				replace: true
			};
		})
	})
;
