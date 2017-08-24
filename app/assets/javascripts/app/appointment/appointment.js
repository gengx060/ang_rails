define(['jquery', 'angular', 'Enumerable', 'moment', 'fullcalendar',
		'angular-modal-service'],
	function ($, angular, Enumerable, moment, fullcalendar) {
		angular.module('appointment', ['angularModalService'])
			.directive('appointment', function () {
				return {
					require: '^tabs',
					restrict: 'E',
					transclude: true,
					scope: {},
					controller: function ($scope, $element, $location, $routeParams, ModalService) {
						$scope.view_types = ['month', 'agendaWeek', 'agendaDay'];
						$scope.view_type = 'month';
						fullcalendar;
						$scope.fullCalendar;

						$scope.fullCalendar_option = {
							header: {
								left: 'prev,next today',
								center: 'title',
								right: 'month,agendaWeek,agendaDay'
							},
							minTime: "06:00:00",
							maxTime: "18:00:00",
							defaultDate: moment(),
							defaultView: 'month',
							editable: true,
							fixedWeekCount: false,
							slotDuration: '00:10:00', // 10 minutes for each row
							dayClick: function (date, jsEvent, view) {
								// console.log(this.events);
								prevTime = typeof currentTime === 'undefined' || currentTime === null
									? new Date().getTime() - 1000000
									: currentTime;
								currentTime = new Date().getTime();

								if (currentTime - prevTime < 500) {
									if ($scope.fullCalendar.fullCalendar('getView').type == 'month') {
										$scope.$apply(function () {
											$location.search('view', 'agendaWeek');
											$location.search('date', date.format());
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
								$("#eventInfo").html(event.description);
								$("#eventLink").attr('href', event.url);
							},
							events: [
								{
									id: 999,
									title: 'Repeating Event',
									start: '2014-06-16T16:00:00'
								},
								{
									title: 'Meeting',
									start: '2014-08-24T10:30:00',
									end: '2014-08-24T12:30:00'
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
											.on('click', '.fc-agendaMonth-button', function() {
												alert('Week button clicked');
											})
											.on('click', '.fc-agendaWeek-button', function() {
												alert('Week button clicked');
											})
											.on('click', '.fc-agendaDay-button', function() {
												alert('Week button clicked');
											}).on('click', '.fc-today-button', function() {
												alert('Week button clicked');
											});
										});
									} else if ($scope.fullCalendar.fullCalendar('getView').type != $routeParams.view) {
									$scope.fullCalendar.fullCalendar('changeView', $routeParams.view, $routeParams.date);
								}
							}
							if (moment($routeParams.newevent, 'YYYY-MM-DD HH:mm', true).isValid()) {
								$scope.event = {
									start: $routeParams.newevent,
									end: $routeParams.newevent,
									flag: ''
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
							} else if ($routeParams.newevent) {
								$location.search('newevent', null);
							}
						};
						$scope.$on('$routeUpdate', function () {
							$scope.query_params();
						});

						$scope.query_params();
					},
					templateUrl: 'assets/app/appointment/appointment.template.html',
					replace: true
				};
			})
			.controller('ModalController', function ($scope, $location, close) {
				$scope.close = function (result) {
					close(result, 500); // close, but give 500ms for bootstrap to animate
				}
				$scope.submit = function (result) {
					console.log(500); // close, but give 500ms for bootstrap to animate
				};
			});
	})
;
