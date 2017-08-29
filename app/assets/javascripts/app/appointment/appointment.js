define(['angular', 'Enumerable', 'moment', 'fullcalendar',
		'angular-modal-service'],
	function (angular, Enumerable, moment, fullcalendar) {
		angular.module('appointment', ['angularModalService'])
			.directive('appointment', function () {
				return {
					require: '^tabs',
					restrict: 'E',
					transclude: true,
					scope: {},
					controller: function ($scope, $element, $location, $routeParams, ModalService) {
						$scope.view_types = ['month', 'agendaWeek', 'agendaDay'];
						$scope.datetimes = [
							'12:00 am', '12:30 am', '1:00 am', '1:30 am', '2:00 am', '2:30 am',
							'3:00 am', '3:30 am', '4:00 am', '4:30 am', '5:00 am', '5:30 am',
							'6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am',
							'9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am',
							'12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
							'3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm',
							'6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm',
							'9:00 pm', '9:30 pm', '10:00 pm', '10:30 pm', '11:00 pm', '11:30 pm']
						$scope.view_type = 'month';
						$scope.menu_show = false;

						$scope.right_click_date = '';
						$scope.monthly_view = function (e) {
							$(".custom-menu").hide(100);
							if (moment($scope.right_click_date, 'YYYY-MM-DD', true).isValid()) {
								$location.search('view', 'month');
								$location.search('date', $scope.right_click_date);
							}
						};
						$scope.weekly_view = function (e) {
							$(".custom-menu").hide(100);
							if (moment($scope.right_click_date, 'YYYY-MM-DD', true).isValid()) {
								$location.search('view', 'agendaWeek');
								$location.search('date', $scope.right_click_date);
							}
						};
						$scope.daily_view = function (e) {
							$(".custom-menu").hide(100);
							if (moment($scope.right_click_date, 'YYYY-MM-DD', true).isValid()) {
								$location.search('view', 'agendaDay');
								$location.search('date', $scope.right_click_date);
							}
						};

						$scope.create_event = function () {

							var date = moment($routeParams.newevent).format('YYYY-MM-DD');
							var time = moment($routeParams.newevent).format('h:mm a');
							time = (time == "12:00 am" ? "8:00 am" : time);
							$scope.event = {
								start: moment(date + " " + time, 'YYYY-MM-DD h:mm a').format('YYYY-MM-DD h:mm a'),
								end: moment(date + " " + time, 'YYYY-MM-DD h:mm a').add(30, 'm').format('YYYY-MM-DD h:mm a'),
								start_date: date,
								end_date: date,
								start_time: time,
								end_time: moment(time, 'h:mm a').add(30, 'm').format('h:mm a'),
								title: ''
							};

							ModalService.showModal({
								templateUrl: 'assets/app/appointment/new-event-modal.template.html',
								controller: "ModalController",
								scope: $scope
							}).then(function (modal) {
								modal.element.modal();
								modal.close.then(function (result) {
									$location.search('newevent', null);
								});
							});
						}

						$scope.fullCalendar_option = {
							header: {
								left: 'prev,next today',
								center: 'title',
								right: 'month,agendaWeek,agendaDay'
							},
							minTime: "00:00:00", // "06:00:00",
							maxTime: "24:00:00", // "18:00:00",
							defaultDate: moment(),
							defaultView: 'month',
							editable: true,
							fixedWeekCount: false,
							slotDuration: '00:10:00', // 10 minutes for each row
							slotLabelFormat: 'h(:mm)a',
							dayClick: function (date, jsEvent, view) {
								// console.log(this.events);
								prevTime = typeof currentTime === 'undefined' || currentTime === null
									? new Date().getTime() - 1000000
									: currentTime;
								currentTime = new Date().getTime();

								if (currentTime - prevTime < 500) {
									if ($scope.fullCalendar.fullCalendar('getView').type == 'month') {
										$scope.$apply(function () {
											$location.search('newevent', date.format("YYYY-MM-DD HH:mm"));
											// $location.search('view', 'agendaWeek');
											// $location.search('date', date.format());
										});
									} else if (['agendaWeek', 'agendaDay'].indexOf($routeParams.view) > -1) {
										$scope.$apply(function () {
											$location.search('newevent', date.format("YYYY-MM-DD HH:mm"));
										});
									}
									//double click call back
								}
							},
							eventClick: function (event, jsEvent, view) {
								//set the values and open the modal
								$scope.event = event;
								$scope.event.start = moment($scope.event.start).format("YYYY-MM-DD H:mm a");
								$scope.event.end = moment($scope.event.end).format("YYYY-MM-DD H:mm a");
								ModalService.showModal({
									templateUrl: 'assets/app/appointment/new-event-modal.template.html',
									controller: "ModalController",
									scope: $scope
								}).then(function (modal) {
									modal.element.modal();
									modal.close.then(function () {
										$location.search('newevent', null);
									});
								});
							},
							events: function (start, end, timezone, callback) {
								ajaxRequest({start: start, end: end}, '/event/list', function (res) {
									var events = res;
									callback(events);
								}, function (res) {
									// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
									toastr.error(res.info.message ? res.info.message : res.info.server_msg);
								});
							}
						};

						$scope.show_update_hash = function () {
							$location.search('newuser', null);
							$location.search('view', 'month');
						};

						$scope.query_params = function () {
							if ($scope.view_types.indexOf($routeParams.view) == -1) {
								$location.search('view', 'month');
								$location.search('date', moment().format("YYYY-MM-DD"));
								return;
							}
							else {
								if (!$scope.fullCalendar) {
									$scope.fullCalendar_option.defaultView = $routeParams.view;
									$scope.fullCalendar_option.defaultDate = $routeParams.date;
									// $(document).ready(function () {
									$scope.fullCalendar = $('#fullcalendar_div_a').fullCalendar($scope.fullCalendar_option)
									$('.fc-agendaMonth-button').unbind("click");
									$('.fc-agendaWeek-button').unbind("click");
									$('.fc-agendaDay-button').unbind("click");
									$('.fc-today-button').unbind("click");
									$('.fc-icon-left-single-arrow').unbind("click");
									$('.fc-icon-right-single-arrow').unbind("click");

									$scope.fullCalendar.bind("contextmenu", function (event, e) {
										// Avoid the real one
										if($routeParams.view != 'month')
											return
										$scope.$apply(function () {
											$scope.right_click_date = '';
										})

										if (moment($(event.target).attr("data-date"), 'YYYY-MM-DD', true).isValid()) {
											$scope.$apply(function () {
												$scope.right_click_date = $(event.target).attr("data-date");
											})
										}
										event.preventDefault();
										// Show contextmenu
										$(".custom-menu").finish().toggle(100).css({
											top: event.pageY + "px",
											left: event.pageX + "px"
										});
									});

									// If the document is clicked somewhere
									$scope.fullCalendar.bind("mousedown", function (e) {
										// If the clicked element is not the menu
										if (!$(e.target).parents(".custom-menu").length > 0) {
											// Hide it
											$(".custom-menu").hide(100);
										}
									});
									$scope.fullCalendar
										.on('click', '.fc-month-button', function () {
											$scope.$apply(function () {
												$location.search('view', 'month');
											});
										})
										.on('click', '.fc-agendaWeek-button', function () {
											$scope.$apply(function () {
												$location.search('view', 'agendaWeek');
											});
										})
										.on('click', '.fc-agendaDay-button', function () {
											$scope.$apply(function () {
												$location.search('view', 'agendaDay');
											});
										})
										.on('click', '.fc-icon-left-single-arrow', function () {
											$scope.$apply(function () {
												console.log($scope.fullCalendar.fullCalendar('getDate').add(-1, 'days').format("YYYY-MM-DD"));
												$location.search('date',
													($scope.fullCalendar.fullCalendar('getDate').add(-1, 'days')).format("YYYY-MM-DD"));
											});
										})
										.on('click', '.fc-icon-right-single-arrow', function () {
											$scope.$apply(function () {
												console.log($scope.fullCalendar.fullCalendar('getDate').add(1, 'days').format("YYYY-MM-DD"));
												$location.search('date',
													$scope.fullCalendar.fullCalendar('getDate').add(1, 'days').format("YYYY-MM-DD"));
											});
										})
										.on('click', '.fc-today-button', function () {
											$scope.$apply(function () {
												$location.search('date', moment().format("YYYY-MM-DD"));
											});
										});
									// });
								}
								else {
									if ($scope.fullCalendar.fullCalendar('getView').type != $routeParams.view) {
										$scope.fullCalendar.fullCalendar('changeView', $routeParams.view, $routeParams.date);
									}
									if ($scope.fullCalendar.fullCalendar('getDate').format() != $routeParams.date) {
										var date = $routeParams.date;
										if (!moment($routeParams.date, 'YYYY-MM-DD', true).isValid()) {
											date = moment().format('YYYY-MM-DD')
										}
										$scope.fullCalendar.fullCalendar('gotoDate', date);
									}
								}
							}
							if (moment($routeParams.newevent, 'YYYY-MM-DD HH:mm', true).isValid()) {
								if (moment().diff(moment($routeParams.newevent), 'minutes') > 0) {
									BD.confirm('You are trying to create an event in the past, continue?',
										function (result) {
											if (result) {
												$scope.create_event();
											} else {
												$scope.$apply(function () {
													$location.search('newevent', null);
												})
												return;
											}
										});
								} else {
									$scope.create_event();
								}
							} else {
							}
						};
						$scope.$on('$routeUpdate', function () {
							$scope.query_params();
						});

						$scope.query_params();
					},
					templateUrl: 'assets/app/appointment/appointment.template.html',
					replace: true
				}
					;
			})
			.controller('ModalController', function ($scope, $element, $location, close) {
				$scope.close = function () {
					$element.modal('hide');
					close(null, 500); // close, but give 500ms for bootstrap to animate
				}
				$scope.delete_event = function () {
					BD.confirm('You are going to delete this event, continue?',
						function (result) {
							if (result) {
								alert(123);
							} else {
								alert(111);
								return;
							}
						});
				}

				$scope.delete_event_show = $scope.event.id > 0;

				$scope.submit = function () {
					var event = {};
					event.comment = $scope.event.comment;
					event.end = $scope.event.end;
					event.with_user_id = $scope.event.with_user_id;
					event.location = $scope.event.location;
					event.start = $scope.event.start;
					event.title = $scope.event.title;
					event.id = $scope.event.id;

					ajaxRequest(event, '/event/edit', function (res) {
						$scope.$apply(function () {
							$scope.close();
							if (res.event.id != event.id) {
								$scope.fullCalendar.fullCalendar('renderEvent', res.event);
							}
						});
						toastr.success(res.message);
					}, function (res) {
						// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
						toastr.error(res.info.message ? res.info.message : res.info.server_msg);
					});
				}
			});
	})
;
