define(['angular', 'jquery', 'Enumerable', 'fullcalendar', 'moment',
		'angular-modal-service'],
	function (angular, $, Enumerable, fullcalendar, moment) {
		angular.module('appointment', ['angularModalService'])
			.directive('appointment', function () {
				return {
					require: '^tabs',
					restrict: 'E',
					transclude: true,
					scope: {},
					controller: function ($scope, $element, $location, ModalService) {
						$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};
						$element.last().fullCalendar({
							header: {
								left: 'prev,next today',
								center: 'title',
								right: 'month,agendaWeek,agendaDay'
							},
							minTime: "06:00:00",
							maxTime: "18:00:00",
							// defaultDate: '2014-06-12',
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
									//double click call back
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
							},
							eventClick: function (event, jsEvent, view) {
								//set the values and open the modal
								$("#eventInfo").html(event.description);
								$("#eventLink").attr('href', event.url);
//	        $("#eventContent").dialog({ modal: true, title: event.title });
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
						})

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
