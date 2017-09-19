define(['angular', 'Enumerable', 'moment', 'moment-timezone', 'fullcalendar', 'typeahead',
		'angular-modal-service'],
	function (angular, Enumerable, moment, moment_timezone, fullcalendar) {
		angular.module('appointment', ['angularModalService'])
		.directive('appointment', function ($compile) {
			return {
				require    : '^tabs',
				restrict   : 'E',
				transclude : true,
				scope      : {},
				controller : function ($scope, $element, $location, $routeParams, ModalService) {
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
					var time_zone = 'America/New_York';

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
						var start_f = moment(date + " " + time, 'YYYY-MM-DD h:mm a');
						var end_f = moment(date + " " + time, 'YYYY-MM-DD h:mm a').add(30, 'm');
						$scope.event = {
							start_f   : start_f.format('YYYY-MM-DD h:mm a'),
							end_f     : end_f.format('YYYY-MM-DD h:mm a'),
							start     : moment(start_f, 'YYYY-MM-DD hh:mm a').tz(time_zone).format(),
							end       : moment(end_f, 'YYYY-MM-DD hh:mm a').tz(time_zone).format(),
							start_date: date,
							end_date  : date,
							start_time: time,
							end_time  : moment(time, 'h:mm a').add(30, 'm').format('h:mm a'),
							title     : ''
						};
						// debugger
						// return

						ModalService.showModal({
							templateUrl: 'assets/app/appointment/new-event-modal.template.html',
							controller : "EventModalController",
							scope      : $scope
						}).then(function (modal) {
							modal.element.modal();
							modal.close.then(function (result) {
								$location.search('newevent', null);
							});
						});
					}

					$scope.fullCalendar_option = {
						header        : {
							left  : 'prev,next today',
							center: 'title',
							right : 'month,agendaWeek,agendaDay'
						},
						minTime       : "00:00:00", // "06:00:00",
						maxTime       : "24:00:00", // "18:00:00",
						timezone      : time_zone,
						defaultDate   : moment(),
						defaultView   : 'month',
						editable      : true,
						fixedWeekCount: false,
						slotDuration  : '00:10:00', // 10 minutes for each row
						lazyFetching  : false,
						// slotLabelFormat: 'h(:mm)a',
						dayClick      : function (date, jsEvent, view) {
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
						eventClick    : function (event, jsEvent, view) {
							//set the values and open the modal
							$scope.event = event;
							$scope.event.start_f = moment($scope.event.start).format("YYYY-MM-DD hh:mm a");// moment($scope.event.start).tz('America/New_York').format("YYYY-MM-DD H:mm a");
							$scope.event.end_f = moment($scope.event.end).format("YYYY-MM-DD hh:mm a");//moment($scope.event.end).tz('America/New_York').format("YYYY-MM-DD H:mm a");
							ModalService.showModal({
								templateUrl: 'assets/app/appointment/new-event-modal.template.html',
								controller : "EventModalController",
								scope      : $scope
							}).then(function (modal) {
								modal.element.modal();
								modal.close.then(function () {
									$location.search('newevent', null);
								});
							});
						},
						events        : function (start, end, timezone, callback) {
							ajaxRequest({start: start, end: end, timezone: timezone},
								'/event/list', function (res) {
									var events = res;
									events.forEach(function (i) {
										i.start = moment(i.start).tz(time_zone).format();
										i.end = moment(i.end).tz(time_zone).format();
									}); //});
									callback(events);
								}, function (res) {
									// BD.alert(res.info.error ? res.info.error : res.info.server_msg);
									toastr.error(res.info.message ? res.info.message : res.info.server_msg);
								});
						},
						eventRender   : function (event, element) {
							if ($routeParams.view == 'month') {
								return; // only show attendees in week and daily view mode
							}
							var mins = event.end.diff(event.start,'minutes');
							if (event.attendees instanceof Array && event.attendees.length > 0) {
								var html = "<div style=\"margin-top:"+(mins-27)+"px; font-weight:600\">Attending:</div>";
								element.find(".fc-content").append(html);
								event.attendees.forEach(function (a) {
									var scope = $scope.$new(true);
									scope.attendees = a;
									scope.size = '20px';
									var el = $compile("<vcard type='profile' triggersize='{{size}}' src='attendees'></vcard>")(scope);
									element.find(".fc-content").append(el);
								});
							}
							// element.find(".fc-content").on('click', 'a', function(event) {
							// 	event.stopPropagation();
							// 	$(event.currentTarget).popover('show');
							// });// add event to vcard
						}
					};

					$scope.show_update_hash = function () {
						$location.search('newuser', null);
						$location.search('view', 'month');
					};

					$scope.query_params = function () {
						if ($scope.view_types.indexOf($routeParams.view) === -1) {
							$location.search('view', 'month');
							$location.search('date', moment().format("YYYY-MM-DD"));
							return;
						}
						else {
							if (!$scope.fullCalendar) {
								$scope.fullCalendar_option.defaultView = $routeParams.view;
								$scope.fullCalendar_option.defaultDate = $routeParams.date;
								// $(document).ready(function () {
								setTimeout(function () {
									$scope.fullCalendar = $('#fullcalendar_div_a').fullCalendar($scope.fullCalendar_option)
									$('.fc-agendaMonth-button').unbind("click");
									$('.fc-agendaWeek-button').unbind("click");
									$('.fc-agendaDay-button').unbind("click");
									$('.fc-today-button').unbind("click");
									$('.fc-prev-button').unbind("click");
									$('.fc-next-button').unbind("click");

									$scope.fullCalendar.bind("contextmenu", function (event, e) {
										// Avoid the real one
										if ($routeParams.view != 'month')
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
											top : event.pageY + "px",
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
									.on('click', '.fc-prev-button', function () {
										var date = $scope.fullCalendar.fullCalendar('getDate');
										if ($routeParams.view === 'agendaWeek')
											date = moment(date).add(-7, 'days');
										else if ($routeParams.view === 'month')
											date = moment(moment(moment(date).format("YYYY-MM")).add(-1, 'months'));
										else
											date = moment(date).add(-1, 'days');
										$scope.$apply(function () {
											// console.log($scope.fullCalendar.fullCalendar('getDate').add(1, 'days').format("YYYY-MM-DD"));
											$location.search('date', date.format("YYYY-MM-DD"));
										});
									})
									.on('click', '.fc-next-button', function () {
										var date = $scope.fullCalendar.fullCalendar('getDate');
										if ($routeParams.view === 'agendaWeek')
											date = moment(date).add(7, 'days');
										else if ($routeParams.view === 'month')
											date = moment(moment(moment(date).format("YYYY-MM")).add(1, 'months'));
										else
											date = moment(date).add(1, 'days');
										$scope.$apply(function () {
											// console.log($scope.fullCalendar.fullCalendar('getDate').add(1, 'days').format("YYYY-MM-DD"));
											$location.search('date', date.format("YYYY-MM-DD"));
										});
									})
									.on('click', '.fc-today-button', function () {
										$scope.$apply(function () {
											$location.search('date', moment().format("YYYY-MM-DD"));
										});
									});
								}, 100);
							}
							else {

								// $scope.fullCalendar.fullCalendar('option', 'timezone', "America/New_York");
								if ($scope.fullCalendar.fullCalendar('getView').type !== $routeParams.view) {
									$scope.fullCalendar.fullCalendar('changeView', $routeParams.view, $routeParams.date);
								}
								if ($scope.fullCalendar.fullCalendar('getDate').format() !== $routeParams.date) {
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
				replace    : true
			}
				;
		})
		.controller('EventModalController', function ($scope, $element, $location, close) {
			$scope.close = function () {
				$element.modal('hide');
				close(null, 500); // close, but give 500ms for bootstrap to animate
			};

			$scope.on_blur = function (v) {
				v = moment(v, ['YYYY-MM-DD hh:mm a']).format('YYYY-MM-DD hh:mm a')
				if (v === "Invalid date") {
					v = ''
				}
			};

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
			};

			$scope.delete_event_show = $scope.event && $scope.event.id > 0;
			var time_zone = 'America/New_York';

			$scope.submit = function () {
				var event = {};
				event.comment = $scope.event.comment;
				event.end = moment($scope.event.end_f, 'YYYY-MM-DD hh:mm a').tz(time_zone).format();
				event.with_user_id = $scope.usersearch;
				event.location = $scope.event.location;
				event.start = moment($scope.event.start_f, 'YYYY-MM-DD hh:mm a').tz(time_zone).format();
				event.title = $scope.event.title;
				event.id = $scope.event.id;
				$scope.event.end = moment($scope.event.end_f, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD HH:mm');
				$scope.event.start = moment($scope.event.start_f, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD HH:mm');
debugger
				return;
				ajaxRequest(event, '/event/edit', function (res) {
					$scope.$apply(function () {
						$scope.close();
						if (res.event.id !== event.id) {
							$scope.event.attendees = res.event.attendees;
							$scope.fullCalendar.fullCalendar('renderEvent', $scope.event);
						} else {
							$scope.fullCalendar.fullCalendar('updateEvent', $scope.event);
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
