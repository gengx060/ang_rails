define(['angular', 'jquery', 'Enumerable', 'fullcalendar', 'app/welcome/full-page-loader'],
	function (angular, $, Enumerable, fullcalendar) {
		angular.module('appointment', ['fullPageLoader'])
		.directive('appointment', function () {
			return {
				require    : '^tabs',
				restrict   : 'E',
				transclude : true,
				scope      : {},
				controller : function ($scope, $element, $http) {
					$scope.margin = {'1': '40px', '2': '100px', '3': '145px'};

					$element.fullCalendar({
						// $('#calendar').fullCalendar({
						// calendar properties
						header: {
							left: 'prev,next today',
							center: 'title',
							right: 'month,agendaWeek,agendaDay'
						},
						minTime: "06:00:00",
						maxTime: "18:00:00",
						defaultDate: '2014-06-12',
						defaultView: 'month',
						editable: true,
						slotDuration: '00:10:00', // 15 minutes for each row
						dayClick: function (date, jsEvent, view) {
							// console.log(this.events);
							prevTime = typeof currentTime === 'undefined' || currentTime === null
							    ? new Date().getTime() - 1000000
							    : currentTime;
							currentTime = new Date().getTime();

							if (currentTime - prevTime < 500)
							{
							    //double click call back
							    console.log("this is double click");
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
				replace    : true
			};
		});
	});
