define(['angular', 'jquery'], function (angular, $) {
	angular.module('searchbar', [])
	.directive('searchbar', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: {
				usersearch: '=',
				url: '@',
				minlength: '@',
				searchtext: '@',
				hashupdate: '@'
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
						debugger
						return repo.firstname + repo.lastname;
					}
					function initSelection(element, callback) {
						var arrs = [{element:element, firstname:"Valerie", id:"12084", lastname: "Montgomery"}];
						callback(arrs);
					}
					// var placeholder = "&#xf002 Search..."; // for single select
					var placeholder = " " + $scope.searchtext;
					var search_select = $element.select2({
						ajax: {
							url: $scope.url,
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
						templateSelection: formatRepoSelection, // omitted for brevity, see the source of this page
						initSelection:initSelection
					});
					$element.on("select2:selecting", function (e) {
						if ($scope.hashupdate === 'false')
							return;
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
						if ($scope.hashupdate === 'false')
							return;
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
					});
					// var vals = [{firstname:"Valerie", id:"12084", lastname: "Montgomery"}];
					// var vals = ["Montgomery"];

					// vals.forEach(function(e){
					// 	$element.append('<option value="'+e.firstname+' '+e.lastname+'">'+e.id+'</option>');
					// });
					// var ids = vals.map(function (e) {
					// 	return e.id;
					// });
					// vals = vals.map(function (e) {
					// 	return e.firstname+' '+e.lastname;
					// });
					//
					// // $element.val(vals).trigger('change');
					// $element.val(vals).trigger('change');
					// $scope.$apply(function(){
					// 	$scope.usersearch = ids;
					// });
				});

			},
			templateUrl: 'assets/app/common/searchbar/searchbar.template.html',
			replace: true
		};
	});
});
