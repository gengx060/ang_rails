'use strict';
define(['angular'], function(angular){
  angular.module('ui-gravatar', []).directive('setFocus', ['$timeout', '$parse', function ($timeout, $parse) {
      return {
          //scope: true,   // optionally create a child scope
          link: function (scope, element, attrs) {
              var model = $parse(attrs.focusMe);
              scope.$watch(model, function (value) {
                  console.log('value=', value);
                  if (value === true) {
                      $timeout(function () {
                          element[0].focus();
                      });
                  }
              });
              // to address @blesh's comment, set attribute value to 'false'
              // on blur event:
              element.bind('blur', function () {
                  console.log('blur');
                  scope.$apply(model.assign(scope, false));
              });
          }
      };
  }]);

  var sampleApp = angular.module('sampleApp', ['ngRoute', 'menu', 'comment']);

  sampleApp.config(['$routeProvider',
    function($routeProvider) {
      $routeProvider.when('/AddNewOrder', {
        templateUrl: 'add_order.html',
        controller: 'AddOrderController'
      });
      $routeProvider.when('/ShowOrders', {
        templateUrl: 'show_orders.html',
        controller: 'ShowOrdersController'
      });
      $routeProvider.when('/contact', {
        templateUrl: 'app/contact/contacts.template.html',
      });
      $routeProvider.when('/comment', {
        template: '<comment></comment>'
      })
      $routeProvider.when('/welcome', {
        templateUrl: 'app/welcome/welcome.template.html'
      });
      $routeProvider. otherwise({
        redirectTo: '/welcome'
      });
  }]);

  sampleApp.directive('setFocuss', function($timeout) {
    return function(scope, element, attrs) {
      scope.$watch(attrs.showFocus, 
        function (newValue) { 
          $timeout(function() {
              newValue && element[0].focus();
          });
        },true);
    };    
  });
});
