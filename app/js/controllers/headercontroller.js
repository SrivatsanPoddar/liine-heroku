'use strict';

angular.module('liineApp.controllers.header', [])
  .controller('HeaderController', ['$scope','$window',
    function($scope, $window) {

      $scope.navbarEntries = [
        {
          "title": $scope.userName + " Gifts",
          "link": "/gifts"},
        {
          "title": "Get App",
          "link": "/get"
        }
      ];

    }]);