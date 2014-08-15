'use strict';

angular.module('liineApp.controllers.live', ['liineApp.services.live'])
  .controller('LiveController', ['$scope','$window','liveService', '$routeParams','$http',
    function($scope, $window, liveService, $routeParams, $http) {
      var params = $routeParams;
      $scope.company_id = params.company_id;

      var Twilio = $window.Twilio;
      console.log();
      //var url = "http://localhost:5000/requestCallTokenIncoming";
      var url = 'http://safe-hollows-9286.herokuapp.com/requestCallTokenIncoming';
      $http({method: 'GET', url: url, params: {company_id:$scope.company_id}})
        .success(function(data, status, headers, config) {

          var callToken = data.token;

          Twilio.Device.setup(callToken,{debug: true, closeProtection: true});

          Twilio.Device.ready(function (device) {
            console.log("Device is ready!");
          });

          Twilio.Device.incoming(function(connection) {
            connection.accept();
            console.log("Call in progress!");
          })

          Twilio.Device.disconnect(function(connection) {
            console.log("Awaiting Incoming Call...");
          });

          Twilio.Device.offline(function(device) {
            console.log("Device went offline...");
            $window.alert("Device went offline! Please refresh!");
          });

          Twilio.Device.cancel(function(connection) {
            console.log("Caller has cancelled the call");
          });

          Twilio.Device.presence(function (presenceEvent) {
            console.log("presenceEvent: " + presenceEvent.from + " " + presenceEvent.available);
          });

          Twilio.Device.error(function(error) {
            console.log(error.message + " for "  + error.connection);
          });


      }).error(function(data,status, headers, config) {
        console.log("Error getting Twilio Call Token: " + data);
      });
      
      $scope.disconnect = function () {
        Twilio.Device.disconnectAll();
      };



      $scope.messages = liveService.getMessages();
      $scope.pendingConnections = liveService.getPendingConnections();
      $scope.isConnected = liveService.isConnected();

      liveService.init($scope.company_id);

      $scope.refreshMessages = function () {
        $scope.messages = liveService.getMessages();
      };

      $scope.refreshPendingConnections = function () { 
        $scope.pendingConnections = liveService.getPendingConnections();
      };

      $scope.pair = function(senderIndex) {
        console.log("Clicked to pair with caller with senderIndex: " + senderIndex);
        var messageObject = {pair: senderIndex};
        liveService.send(messageObject);
      };

      $scope.$watch(function() {return liveService.isConnected() }, 
        function (newIsConnectedState) {
          console.log("The agent-caller connection has changed!");
          $scope.isConnected = newIsConnectedState;
      });


      $scope.sendMessage = function(message) {
        console.log("Clicked to send Message Called!");
        var messageObject = {message: message};
        liveService.send(messageObject);
      };

    }]);