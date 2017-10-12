define(['angular', 'moment', 'jquery', 'select2', 'angular-modal-service', 'app/common/vcard/vcardtrigger',
		'app/common/dragdrop/dragdrop', 'app/common/paging/paging', 'app/common/sorting/sorting'
		, 'app/common/searchbar/searchbar', 'app/common/factory/usstates', 'app/common/factory/util'],
	function (angular, moment, $) {
		angular.module('contacts', ['angularModalService', 'vcardtrigger', 'dragdrop', 'paging', 'sorting', 'searchbar', 'usstates'])
		.directive('contacts', function () {
			
			return {
				require: '^tabs',
				restrict: 'E',
				transclude: true,
				scope: {},
				controller: function ($scope, $element, $routeParams, $location, usstates, util) {
					// $scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
					$scope.label_colors = ['#ff4444', '#ffbb33', '#00C851', '#33b5e5'];
					$scope.select_color = function(lc) {
						console.log(lc)
					};
					// $location.search('filterbyids', null);
					$scope.contacts = [];
					$scope.selected_all = false;
					$scope.from_now = util.from_now;
					$scope.sort_email = 'email';
					$scope.sort_name = 'name';
					
					// $scope.templatePath ='assets/app/common/template/address.template.html';
					$scope.contact_detail = function (id) {
						// $location.search('newuser', null);
						// $location.search('newuser', 'true');
						$location.search('newcontact', null);
						if (typeof id === 'undefined') {
							$location.search('newcontact', 'true');
						} else {
							$location.search('newcontact', id);
						}
					};
					
					$scope.$on('$includeContentLoaded', function () {
						$("#state_select").select2({
							data: usstates,
							placeholder: "Select a state"
						});
						if($scope.contact && $scope.contact.address) {
							var state = $scope.contact.address.state;
							$("#state_select").val(state).trigger("change");
						}
					});
					$scope.select_all = function(cs) {
						$scope.selected_all = !$scope.selected_all;
						var flag = $scope.selected_all;
						cs.forEach(function(c) {
							c.selected = flag;
						})
					}
					
					$scope.query_params = function () {
						// if ($routeParams.newuser == 'true') {
						// 	$scope.show();
						// }
						if (typeof $routeParams.newcontact !== 'undefined') {
							if ($routeParams.newcontact !== 'true') {
								var params = {user_id: $routeParams.newcontact};
								ajaxRequest(params, '/user/get_user', function (res) {
									$scope.$apply(function () {
										$scope.contact = res.contact;
									});
									$("#state_select").val(res.contact.address.state).trigger("change");
								}, function (res) {
									toastr.error(res.info.message ? res.info.message : res.info.server_msg);
								});
							}
							$scope.templatePath = 'assets/app/common/templates/address.template.html';
							$scope.contact = {
								type: 'c',
								firstname: '',
								lastname: '',
								email: '',
								phone: {
									area: '',
									number: '',
									ext: ''
								},
								address: {
									address1: '',
									address2: '',
									city: '',
									state: '',
									zipcode: '',
									country: 'US'
								}
							};
							$scope.submit = function () {
								var url = '/user/create';
								if ($routeParams.newcontact !== 'true') {
									url = '/user/edit';
								}
								
								if($scope.contact.address) {
									$scope.contact.address.country = 'US';
								}
								ajaxRequest($scope.contact, url, function (res) {
									toastr.success(res.message);
									$scope.$apply(function () {
										$location.search('newcontact', null);
									});
								}, function (res) {
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
				templateUrl: 'assets/app/contact/contacts.template.html',
				replace: true
			};
		})
	})
;