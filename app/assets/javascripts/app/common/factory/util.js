define(['angular', 'moment'], function (angular, moment) {
	var _module = angular.module('util', []);
	_module.factory('util', function () {
		var util = {};
		util.from_now = function (it) {
			debugger
			var time = moment(it).fromNow();
			if (time == 'Invalid date') {
				time = '';
			}
			return time;
		};

		return util;
	});
});