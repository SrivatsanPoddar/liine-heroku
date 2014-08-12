'use strict';

angular.module('liineApp.controllers.live', ['liineApp.services.live'])
  .controller('LiveController', ['$scope','$window','liveService', '$routeParams',
    function($scope, $window, liveService, $routeParams) {
      

      var params = $routeParams;
      $scope.company_id = params.company_id;
      $scope.messages = liveService.getMessages();
      liveService.init($scope.company_id);
      
      $scope.refreshMessages = function () {
        $scope.messages = liveService.getMessages();
      };

      $scope.sendMessage = function(message) {
        console.log("Send Message Called!");
        var messageObject = {message: message};
        liveService.send(messageObject);
      };

    }]);