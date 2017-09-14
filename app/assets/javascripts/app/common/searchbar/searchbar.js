define(['angular', 'jquery'], function (angular, $) {
	angular.module('searchbar', [])
	.directive('searchbar', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: {
				sortbyname: '=',
				url: '@',
				minlength: '@'
			},
			controller: function ($scope, $element, $routeParams, $location) {
				$location.search('filterbyids', null);
				if (typeof $scope.minlength === 'undefined') {
					$scope.minlength = 2;
				}
				if (typeof $scope.searchtext === 'undefined') {
					$scope.searchtext = 'Search...';
				}
				
				$scope.update_hash = function (id) {
					$location.search('filterbyid', id);
				};
				
				$(document).ready(function () {
					function formatRepo(repo) {
						if (repo.loading) return repo.text;
						if (typeof repo.text === 'undefined') {
							var markup = "<div class='select2-result-repository clearfix'>" +
								"<span><i class='fa fa-user'></i>" + repo.firstname + ' ' + repo.lastname +
								"</span><span><i class='fa fa-envelope'></i>" + repo.email +
								"</span></div>";
							return markup;
						}
					}
					
					function formatRepoSelection(repo) {
						return repo.firstname + repo.lastname;
					}
					
					// var placeholder = "&#xf002 Search..."; // for single select
					var placeholder = " " + $scope.searchtext;
					$element.select2({
						ajax: {
							url: $scope.url,//"/user/user_search",
							dataType: 'json',
							type: "post",
							delay: 500,
							headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
							data: function (params) {
								return {
									term: params.term, // search term
									page: params.page
								};
							},
							processResults: function (data, params) {
								params.page = params.page || 1;
								
								return {
									results: data.items,
									pagination: {
										more: (params.page * 30) < data.total
									}
								};
							},
							cache: true
						},
						placeholder: placeholder,
						width: null,
						allowClear: true,
						escapeMarkup: function (m) {
							return m;
						}, // let our custom formatter work
						minimumInputLength: $scope.minlength,
						tags: true,
						templateResult: formatRepo, // omitted for brevity, see the source of this page
						templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
					});
					$element.on("select2:selecting", function (e) {
						var id = e.params.args.data.id;
						$scope.$apply(function () {
							var filterbyids = '';
							if ($routeParams.filterbyids) {
								filterbyids = $routeParams.filterbyids + ",";
							}
							$location.search('filterbyids', filterbyids + id);
						});
					});
					$element.on("select2:unselect", function (e) {
						var id = e.params.data.id;
						$scope.$apply(function () {
							var filterbyids = $routeParams.filterbyids;
							if (filterbyids) {
								filterbyids = filterbyids.split(',');
								var i = filterbyids.indexOf(id);
								if (i > -1) {
									filterbyids.splice(i, 1);
								}
								if (filterbyids.length > 0) {
									$location.search('filterbyids', filterbyids.join(','));
								} else {
									$location.search('filterbyids', null);
								}
							}
						});
					})
				});
				/*/ this will only allow one sortby in $routeParams */
				// $scope.query_params = function () {
				// 	if ($routeParams.user) {
				// 		$scope.show_user($routeParams.user);
				// 	}
				// };
				// $scope.$on('$routeUpdate', function (next, current) {
				// 	$scope.query_params();
				// });
				// $scope.query_params();
				
			},
			templateUrl: 'assets/app/common/searchbar/searchbar.template.html',
			replace: true
		};
	});
});
