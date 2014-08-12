'use strict';

// Declare app level module which depends on filters, and services
angular.module('liineApp.config', ['ngRoute'])

app.config(['$routeProvider','$locationProvider',
    function($routeProvider,$locationProvider) {

      $routeProvider
      .when('/',{templateUrl:'build/html/landing/landing.html'})
      .when('/contact',  { templateUrl: 'build/html/contact/contact.html' })
      .when('/live/:company_id', {templateUrl: 'build/html/live/live.html'})
      .otherwise(       { redirectTo: '/' });
      
    }]);