'use strict';

angular.module('liineApp.controllers.live', ['liineApp.services.live','liineApp.services.customize'])
  .controller('LiveController', ['$scope','$window','liveService', '$routeParams','$http', '$document','customizeService',
    function($scope, $window, liveService, $routeParams, $http, $document, customizeService) {
      
      




        // main.js
        //var ZeroClipboard = $window.ZeroClipboard;
        // console.log("ZeroClipboard:");
        // console.log(ZeroClipboard);
        // ZeroClipboard.config( { swfPath: "//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf" } );
        // var copy_client = new ZeroClipboard();
        // copy_client.clip($document[0].querySelectorAll("p.info_to_copy"));

        // copy_client.on( 'ready', function(event) {
        //        console.log( 'copy_client is loaded' );

        //        console.log("Bound elements:");
        //        console.log(copy_client.elements());

        //        copy_client.on( 'copy', function(event) {
        //          event.clipboardData.setData('text/plain', event.target.innerHTML);
        //          console.log("COPY HAPPENING");
        //        } );

        //        copy_client.on( 'aftercopy', function(event) {
        //          console.log('Copied text to clipboard: ' + event.data['text/plain']);
        //        } );
        //      } );

        //      copy_client.on( 'error', function(event) {
        //        console.log( 'ZeroClipboard error of type "' + event.name + '": ' + event.message );
        //        ZeroClipboard.destroy();
        //      } );

        // copy_client.on( "ready", function( readyEvent ) {

        //   copy_client.on( "aftercopy", function( event ) {
        //     // `this` === `client`
        //     // `event.target` === the element that was clicked
        //     //event.target.style.display = "none";
        //     alert("Copied text to clipboard: " + event.data["text/plain"] );
        //   } );
        // } );

      //var pendingVoiceConnection = null;  //Holds the twilio connection of the current caller

      var params = $routeParams;
      $scope.company_id = params.company_id;
      $scope.info = {};

      var Twilio = $window.Twilio;
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
            //pendingVoiceConnection = connection;

            console.log("Call in progress with connection:!");
            console.log(connection);
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



      $scope.pendingConnectionsSize = function () {
        console.log("Size of pendingConnections:", Object.keys($scope.pendingConnections).length);
        return Object.keys($scope.pendingConnections).length;
      }

      $scope.messages = liveService.getMessages();
      $scope.pendingConnections = liveService.getPendingConnections();
      $scope.isConnected = liveService.isConnected();
      $scope.toAuthenticatePictures = liveService.toAuthenticatePictures();
      liveService.init($scope.company_id);
      $scope.currentAuthPicture = null;
      // $scope.refreshMessages = function () {
      //   $scope.messages = liveService.getMessages();
      // };

      $scope.refreshPendingConnections = function () { 
        $scope.pendingConnections = liveService.getPendingConnections();
      };

      $scope.pair = function(senderIndex) {
        console.log("Clicked to pair with caller with senderIndex: " + senderIndex);
        var messageObject = {pair: senderIndex};
        liveService.send(messageObject);
        toastr.success("Connecting to Caller");
      };

      $scope.$watch(function() {return liveService.isConnected() }, 
        function (newIsConnectedState) {
          console.log("The agent-caller connection has changed!");
          $scope.isConnected = newIsConnectedState;
      });

      $scope.$watch(function() {return liveService.toAuthenticatePictures() }, 
        function (newToAuthenticatePictures) {
          console.log("The authenticate picture state has changed!", newToAuthenticatePictures);
          $scope.toAuthenticatePictures = liveService.toAuthenticatePictures();
          if ($scope.toAuthenticatePictures) {
            $scope.currentAuthPicture = liveService.getCurrentAuthenticationPicture();
            $scope.originalAuthPicture = liveService.getOriginalAuthenticationPicture();
            $('#authenticationModal').modal('show');
          }
      });

      $scope.closeAuthentication = function() {
        $scope.currentAuthPicture = null;
        $scope.originalAuthPicture = null;
        liveService.setAuthenticatePictures(false);
      }
      // $scope.$watch(function() {return liveService.getMessages() }, 
      //   function (newMessages) {
      //     console.log("A New Message has been Received");
      //     $scope.messages = newMessages;
      //     copy_client.clip(document.querySelectorAll(".info_to_copy"));
          // console.log("Bound elements:");
          // console.log(copy_client.elements());
      // });

      $scope.sendMessage = function(message) {
        console.log("Clicked to send Message Called!");
        var messageObject = {message: message};
        liveService.send(messageObject);
      };


      toastr.options.closeButton = true;
      toastr.options.positionClass = 'toast-bottom-right';
      toastr.options.timeOut = 1500;
      toastr.options.fadeOut = 500;
      toastr.options.fadeIn = 500;


      $scope.sendRequest = function(request) {
        console.log("Clicked to send Request of Type: " + request.request_type);
        var requestObject = request;
        liveService.send(requestObject);
        if (request.request_format === 'link') {
          console.log("Link formatss: " + $scope.info.link_url + " " + $scope.info.link_description);
          $scope.info.link_url = '';
          $scope.info.link_description = '';
          angular.element('#sendLink').focus();
        }
        //toastr.success("Requested Info From Caller");
      };

      $scope.requestPayment = function() {
          var requestObject = {request_type: 'payment', message: '2 Year Warranty', amount:5.00};
          $scope.sendRequest(requestObject);
      };

      $scope.requestAuthentication = function() {
          var requestObject = {request_type: 'authentication'};
          $scope.sendRequest(requestObject);
      };

      $scope.copyText = function(textToCopy) {
        copy_client.setData("text/plain",textToCopy);
        console.log("Copied2:" + textToCopy);
      };

      
      $scope.showToast = function(textToToast) {
        toastr.success("Copied '" + textToToast + "' to Clipboard!");
        console.log("Show Toast Clicked with:" + textToToast);
      };


      //Get images for image choosing modal
      $scope.image_urls = [];

      $scope.getImages = function() {
        customizeService.get({company_id:$scope.company_id},function(response) {
            console.log("Response from getting images:");
            console.log(response);
            $scope.image_urls = [];
            if (response.image_urls !== null) {
              $scope.image_urls = response.image_urls;
            }

        },function(errorResponse) {
            console.log("Error getting competitors:");
            console.log(errorResponse);
        } );
      };
      $scope.getImages();

      $scope.sendImageURL = function(url) {
        console.log("Sending image url:", url);
        $scope.info.link_url = url;
        $scope.sendRequest({request_format: 'link', request_type: '', message: $scope.info.link_url});
      };

    }]);

