define(['angular', 'jquery', 'jquery-uploadfile'], function (angular, $) {
	angular.module('dragdrop', [])
	.directive('dragdrop', function () {
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: {
				height: '@'
			},
			controller: function ($scope, $element) {
				$scope.tag = $element[0].tagName;
				$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
				$scope.profile_placeholder = "asset/img/blank-profile.png";
				
				$scope.remove = function (item) {
					if (typeof item.id === "undefined") {
						$scope.pure_remove(item);
					} else if (item.complete && item.id) {
						BD.confirm('Remove file from database, continue?',
							function (result) {
								if (result) {
									ajaxRequest({id: item.id}, '/resource/delete',
										function () {
											toastr.success("File is deleted.");
											$scope.$apply(function () {
												$scope.pure_remove(item);
											});
										});
								} else {
								}
							});
					}
				};
				$scope.pure_remove = function (item) {
					var i = $scope.droppedFiles.indexOf(item);
					$scope.droppedFiles.splice(i, 1);
				};
				
				$scope.upload = function (item) {
					var data = {file: item.src, name: item.name};
					$.ajax({
						xhr: function () {
							var xhr = new window.XMLHttpRequest();
							xhr.upload.addEventListener("progress", function (evt) {
								if (evt.lengthComputable) {
									var percentComplete = evt.loaded / evt.total;
									percentComplete = parseInt(percentComplete * 100);
									
									$scope.$apply(function () {
										item.percentage = percentComplete;
									})
									
								}
							}, false);
							
							return xhr;
						},
						url: "/resource/upload",
						type: "POST",
						data: JSON.stringify(item),
						contentType: "application/json",
						headers: {'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')},
						dataType: "json",
						success: function (res) {
							var id = res.id;
							$scope.$apply(function () {
								item.complete = true;
								item.id = id;
							})
						},
						error: function (res) {
							if (res.status != 200) {
								toastr.error(res.statusText);
							}
						},
						complete: function (res) {
						}
					});
				}
				$scope.process_files = function (files) {
					$scope.droppedFiles = [];
					$scope.droppedFiles = $.map(files, function (f) {
						var item = {};
						if (f.size < 10000000) {
							var reader = new FileReader();
							reader.readAsDataURL(f);
							reader.onload = function (evt) {
								$scope.$apply(function () {
									item.src = evt.target.result;
								})
							}
						}
						item.percentage = 0;
						item.name = f.name;
						item.file = f;
						item.size = f.size;
						return item;
					});
				};
				
				$("document").ready(function () {
					$("#myfileinput").change(function () {
						$scope.process_files($('#myfileinput').prop('files'));
						$('#myfileinput').val('');
					});
				});
				$($element[0].children[1]).on('dragover dragenter', function () {
					$($element[0].children[1]).addClass('is-dragover');
				})
				.on('dragleave dragend drop', function () {
					$($element[0].children[1]).removeClass('is-dragover');
				})
				.on('drop', function (e) {
					$scope.$apply(function () {
						$scope.process_files(e.originalEvent.dataTransfer.files);
					})
				})
				.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
					e.preventDefault();
					e.stopPropagation();
				});
			},
			templateUrl: 'assets/app/common/dragdrop/dragdrop.template.html',
			replace: true
		};
	});
});
