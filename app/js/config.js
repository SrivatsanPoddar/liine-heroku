'use strict';

// Declare app level module which depends on filters, and services
angular.module('liineApp.config', ['ngRoute'])

app.config(['$routeProvider','$locationProvider','ngClipProvider', 
    function($routeProvider,$locationProvider, ngClipProvider) {

      $routeProvider
      .when('/',{templateUrl:'build/html/landing/landing.html'})
      .when('/contact',  { templateUrl: 'build/html/contact/contact.html' })
      .when('/live/:company_id', {templateUrl: 'build/html/live/live.html'})
      .when('/competitors', {templateUrl: 'build/html/competitors/competitors.html'})
      .when('/ivr', {templateUrl: 'build/html/IVR/IVR.html'})
      .otherwise(       { redirectTo: '/' });

      ngClipProvider.setPath('bower_components/zeroclipboard/dist/ZeroClipboard.swf');
      
      //ngClipProvider.setPath("//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf");
    }]);
