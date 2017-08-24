define(['jquery', 'angular', 'Enumerable', 'moment', 'fullcalendar',
		'angular-modal-service'],
	function ($, angular, Enumerable, moment, fullcalendar) {
	debugger
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
								if ($routeParams.view == 'month') {
									$scope.$apply(function () {
										$location.search('view', 'agendaWeek');
									});
									debugger
								} else {
									debugger
									$location.search('newevent', date.format());
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
								start: '2014-06-12T10:30:00',
								end: '2014-06-12T12:30:00'
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
							return;
						}
						// if (!$scope.fullCalendar) {
						// 	$scope.fullCalendar_option.defaultView = $routeParams.view;
						// 	// $scope.fullCalendar = $element.last().fullCalendar($scope.fullCalendar_option);
						// 	$scope.fullCalendar = $($element.children()[2]).fullCalendar($scope.fullCalendar_option)
						// 	// debugger
						// 	// $scope.fullCalendar.fullCalendar('changeView', 'agendaWeek', '2014-08-08');
						// }
						//
						else {
							// debugger
							if (!$scope.fullCalendar) {
								// debugger
								$scope.fullCalendar_option.defaultView = $routeParams.view;
								// $scope.fullCalendar = $element.last().fullCalendar($scope.fullCalendar_option);
								$(document).ready(function() {
								// 	debugger
									$scope.fullCalendar = $('#fullcalendar_div_a').fullCalendar($scope.fullCalendar_option);
									// $scope.fullCalendar = $element.fullCalendar($scope.fullCalendar_option);
									// $scope.fullCalendar = $($element.children()[2]).fullCalendar($scope.fullCalendar_option)
								});
								// debugger
								// $scope.fullCalendar.fullCalendar('changeView', 'agendaWeek', '2014-08-08');
							} else if ($scope.fullCalendar.fullCalendar('getView') == $routeParams.view) {
								debugger
								$scope.fullCalendar.fullCalendar('changeView', $routeParams.view, moment().format());
							}
						}
						if (moment($routeParams.newevent, 'YYYY-MM-DD', true).isValid()) {
							debugger
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

					};
					$scope.$on('$routeUpdate', function () {
						debugger
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
			};
			$scope.submit = function (result) {
				console.log(500); // close, but give 500ms for bootstrap to animate
			};
		});
	});
