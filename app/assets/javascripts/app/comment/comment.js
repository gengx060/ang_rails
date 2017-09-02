define(['angular', 'toastr', 'Enumerable', 'bootstrap-dialog', 'app/welcome/full-page-loader'],
	function (angular, toastr, Enumerable, BootstrapDialog) {
		angular.module('comment', ['fullPageLoader'])
		.directive('setFocus1', function ($timeout) {
			return function (scope, element, attrs) {
				scope.$watch(attrs.showFocus1,
					function (newValue) {
						$timeout(function () {
							newValue && element[0].focus();
						});
					}, true);
			};
		})
		.directive('setFocus', ['$timeout', '$parse', function ($timeout, $parse) {
			return {
				//scope: true,   // optionally create a child scope
				link: function (scope, element, attrs) {
					var model = $parse(attrs.setFocus);
					scope.$watch(model, function (value) {
						// console.log('value=', value);
						if (value === true) {
							$timeout(function () {
								element[0].focus();
							});
						}
					});
				}
			};
		}])
		.directive('comment', function () {
			return {
				require    : '^tabs',
				restrict   : 'E',
				transclude : true,
				scope      : {},
				controller : function ($scope, $element, $http) {
					$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};

					// $scope.code_text = '';
					// $scope.code_text_show = false;
					// $scope.profile_placeholder = "asset/img/blank-profile.png";
					$scope.newcomment = function () {
						return {
							content    : '',
							margin_left: '100px',
							show       : false,
							send       : function (c, cs) {
								var self = this;
								if (self.content.trim() == '') {
									toastr.error('Message is empty.', 'error',
										{
											timeOut          : 500,
											preventDuplicates: true,
											positionClass    : 'toast-bottom-full-width'
										});
									return;
								}

								// Simple GET request example:
								$scope.$root['ajax_loader'].show = true;
								var user = {name: 'adfadf'};
								$http({
									// method: 'POST',
									method: 'GET',
									// data: encodeURIComponent(contact),
									data  : user,
									url   : '/welcome/ajax'
								}).then(function successCallback(response) {
									debugger
									// this callback will be called asynchronously
									// when the response is available
								}, function errorCallback(response) {
									// called asynchronously if an error occurs
									// or server returns response with an error status.
								}).then(function () {

									if (self.content != '') {
										self.show = false;
										var newc = {
											id        : cs.length + 1,
											user      : 'Test User',
											msg       : self.content,
											parent_id : c ? c.id : null,
											img       : null,
											topic_id  : c ? c.topic_id : 0,
											time_stamp: new Date().toLocaleString(),
											lvl       : (c ? c.lvl : 0) + 1
										};
										// BootstrapDialog.success(JSON.stringify(newc));
										toastr.success(JSON.stringify(newc), 'Sent',
											{
												timeOut          : 500,
												preventDuplicates: true,
												positionClass    : 'toast-bottom-full-width'
											});
										newc.newcomment = $scope.newcomment();
										cs.push(newc);
										self.content = '';
										cs = sort(cs);
										console.log('sent:\n' + newc);
									}
									$scope.$root['ajax_loader'].show = false;
									// "complete" code here
								});
							},
							switch     : function (c) {
								if (c.lvl > 1) {
									this.margin_left = 55 + c.lvl * 45 + 'px'
								}
								this.show = !this.show;
							}
						}
					};
					$scope.newcomment_top = $scope.newcomment();

					$scope.comments = [
						{
							id        : 1,
							topic_id  : 1,
							user      : 'Stefanih',
							msg       : 'We have clients all over the US. We do everything from my home office. Do we charge tax to everyone or only to those who live in Texas? Or? \n\nTHANK YOU!!!',
							parent_id : null,
							img       : "assets/asset/img/g1.jpg",
							lvl       : 1,
							time_stamp: '12/12/2016, 11:06:47 AM',
							newcomment: $scope.newcomment()
						},
						{
							id        : 2,
							topic_id  : 1,
							user      : 'Exactor',
							msg       : 'I recommend double checking to make sure your services are taxable first. Here\'s a list of services Texas considers taxable',
							parent_id : 1,
							img       : null,
							lvl       : 2,
							time_stamp: '12/15/2016, 10:06:47 AM',
							newcomment: $scope.newcomment()
						}//,
						// {
						// 	id:3,
						// 	topic_id: 1,
						// 	contact:'Stefanih',
						// 	msg:'Thank you! I\'ve looked at many sources, and it appears that both web design and graphic design are taxable in Texas. Thank you for the info about only collecting from clients in Texas. That\'s what we\'ve been doing! YAY! :)',
						// 	parent_id: 2,
						// 	img:null,
						// 	lvl:3,
						// 	time_stamp:'12/17/2016, 10:16:47 AM',
						// 	newcomment: $scope.newcomment()
						// },
						// {
						// 	id:4,
						// 	topic_id: 1,
						// 	contact:'Belle Chang-Li',
						// 	msg:'I would ONLY have to charge them the cost of my product + shipping? Thanks guys!!',
						// 	parent_id: null,
						// 	img:null,
						// 	lvl:1,
						// 	time_stamp:'12/18/2016, 11:06:47 AM',
						// 	newcomment: $scope.newcomment()
						// }
					];

					var sort = function (cc) {
						cc = Enumerable.From(cc).OrderBy('$.lvl').ThenBy('$.id').ToArray();

						// var rs=[Enumerable.From(cc).Where('$.parent==null').MinBy('$.id')], rs_index=0;
						var rs = [cc[0]], rs_index = 0, stack = [0];

						// cc.splice(cc.indexOf(Enumerable.From(cc).Where('$.parent==null').MinBy('$.id')), 1);
						cc.splice(0, 1);

						while (cc.length > 0) {
							for (var i = 0; i < cc.length; i++) {
								if (typeof rs[rs_index] == 'undefined')
									debugger
								if (cc[i].parent_id == rs[stack[stack.length - 1]].id) {
									// if (cc[i].lvl == 4)
									// 	debugger
									rs.push(cc[i]);
									cc.splice(i, 1);
									i--;
									stack.push(rs.length - 1)
									// rs_index++; // top of the stack should be a tree leaf
								}
							}
							if (stack.length > 0)
								stack.splice(stack.length - 1, 1);
							// if (rs_index > 0)
							// 	rs_index--; // go down one lvl
							if (stack.length == 0) { // currently on the root
								if (cc.length > 0 && cc[0].parent_id == null) { // top lvl of the tree
									rs.push(cc[0]);
									cc.splice(0, 1);
									stack.push(rs.length - 1)
								} else {
									debugger
									break; // sanity check
								}
							}
						}
						$scope.comments = rs;
					}

				},
				templateUrl: 'assets/app/comment/comment.template.html',
				replace    : true
			};
		});
	});
