define(['angular', 'jquery', 'jquery-uploadfile'], function (angular, $) {
	angular.module('dragdrop', [])
	.directive('dragdrop', function () {
		// https://blueimp.github.io/jQuery-File-Upload/angularjs.html
		return {
			require: '^tabs',
			restrict: 'E',
			transclude: true,
			scope: {},
			controller: function ($scope, $element) {
				$scope.tag = $element[0].tagName;
				$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
				$scope.profile_placeholder = "asset/img/blank-profile.png";
// debugger
				$($element[0].children[1]).on('dragover dragenter', function () {
					// debugger
					$($element[0].children[1]).addClass('is-dragover');
					// console.log("dragOver");
				})
				.on('dragleave dragend drop', function () {
					// debugger
					$($element[0].children[1]).removeClass('is-dragover');
				})
				.on('drop', function (e) {
					// debugger
					var droppedFiles = e.originalEvent.dataTransfer.files;
					if (droppedFiles) {
						// Use DataTransferItemList interface to access the file(s)
						for (var i = 0; i < droppedFiles.length; i++) {
							var f = droppedFiles[i];
							var reader = new FileReader();
							console.log("... file[" + i + "].name = " + f.name);
							console.log(reader.readAsText(f));
						}
					}
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
