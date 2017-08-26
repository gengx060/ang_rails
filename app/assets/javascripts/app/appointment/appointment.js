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
									modal.close.then(function (result) {
										$location.search('newevent', null);
									});
								});
							},
							events: [
								{
									id: 998,
									name: 'Repeating Event',
									start: '2014-06-16 16:00'
								},
								{
									id:1,
									title: 'Meeting',
									location: 'office',
									start: '2017-08-24 10:30 am',
									end: '2017-08-24 12:30 pm',
									for_user_id: '123123',
									comment: 'This is a coment.'
								}
							]
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
									$(document).ready(function () {
										$scope.fullCalendar = $('#fullcalendar_div_a').fullCalendar($scope.fullCalendar_option)
										$('.fc-agendaMonth-button').unbind("click");
										$('.fc-agendaWeek-button').unbind("click");
										$('.fc-agendaDay-button').unbind("click");
										$('.fc-today-button').unbind("click");
										$('.fc-icon-left-single-arrow').unbind("click");
										$('.fc-icon-right-single-arrow').unbind("click");

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
													$location.search('date',
														($scope.fullCalendar.fullCalendar('getDate') - 1).format("YYYY-MM-DD"));
												});
											})
											.on('click', '.fc-icon-right-single-arrow', function () {
												$scope.$apply(function () {
													$location.search('date',
														$scope.fullCalendar.fullCalendar('getDate').add(1, 'days').format());
												});
											})
											.on('click', '.fc-today-button', function () {
												$scope.$apply(function () {
													$location.search('date', moment().format("YYYY-MM-DD"));
												});
											});
									});
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
			.controller('ModalController', function ($scope, $location, close) {
				$scope.close = function (result) {
					close(result, 500); // close, but give 500ms for bootstrap to animate
				}
				$scope.submit = function() {
					var event = {};
					event.comment = $scope.event.comment;
					event.end = $scope.event.end;
					event.for_user_id = $scope.event.for_user_id;
					event.location = $scope.event.location;
					event.start = $scope.event.start;
					event.title = $scope.event.title;
					event.id = $scope.event.id;

					ajaxRequest(event, '/event/edit', function (res) {
						debugger
						$scope.$apply(function () {
							$scope.userForm = {
								firstname: res.firstname,
								lastname: res.lastname,
								email: res.email
							}
						});
					}, function (res) {
						// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
						toastr.error(res.info.message ? res.info.message : res.info.server_msg);
					});
				}
			});
	})
;
