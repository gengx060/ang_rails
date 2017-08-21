define(['angular', 'jquery', 'jquery-uploadfile'], function (angular, $) {
	angular.module('dragdrop', [])
	.directive('dragdrop', function () {
		// https://blueimp.github.io/jQuery-File-Upload/angularjs.html
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
					var i = $scope.droppedFiles.indexOf(item);
					$scope.droppedFiles.splice(i, 1);
				}

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
						data: JSON.stringify(data),
						contentType: "application/json",
						dataType: "json",
						success: function (result) {
						}
					});
				}
				$scope.getPercentage = function () {
					return $scope.percentage;
				}

				$($element[0].children[1]).on('dragover dragenter', function () {
					$($element[0].children[1]).addClass('is-dragover');
				})
				.on('dragleave dragend drop', function () {
					$($element[0].children[1]).removeClass('is-dragover');
				})
				.on('drop', function (e) {
					$scope.$apply(function () {
						$scope.droppedFiles = $.map(e.originalEvent.dataTransfer.files, function (f) {
							var item = {};
							// window.URL = window.URL || window.webkitURL;
							// item.src = window.URL.createObjectURL(f);
							if (f.type.indexOf("image") == 0 && f.size < 10000000) { //10M
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
							return item;
						});
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
