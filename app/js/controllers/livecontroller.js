'use strict';

angular.module('liineApp.controllers.live', ['liineApp.services.live'])
  .controller('LiveController', ['$scope','$window','liveService',
    function($scope, $window, liveService) {
      liveService.init();

      $scope.messages = liveService.getMessages();

      $scope.refreshMessages = function () {
        $scope.messages = liveService.getMessages();
      };

      $scope.sendMessage = function(message) {
        console.log("Send Message Called!");
        var messageObject = {message: message};
        liveService.send(messageObject);
      };

    }]);