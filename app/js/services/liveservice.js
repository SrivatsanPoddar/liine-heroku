'use strict';
//Service to control live web-socket communication
angular.module('liineApp.services.live', [])
    .factory('liveService', ['$rootScope',
        function($rootScope) {
        	var Service = {};
            //var url = "ws://localhost:5000/live";
            var url = "ws://safe-hollows-9286.herokuapp.com/live"
            var ws;
            var messages = [];
            return {
            	init: function() {
            		ws = new WebSocket(url);
            		ws.onopen = function () {
            			console.log("Connection Opened!");

            		};

            		ws.onclose = function () {
            			console.log("Connection Closed!");
            		};

            		ws.onerror = function(error) {
            			console.log("Error: " + error);
            		};

            		ws.onmessage = function(data) {

            			console.log("Received message: " + JSON.stringify(data));
            			console.log(angular.fromJson(data));
            			var receivedMessage = angular.fromJson(data.data).message;
            			console.log("parsed message: " + receivedMessage);
            			$rootScope.$apply(function () {
	            			messages.push(receivedMessage);
            			})


            		};
            	},
        		getMessages: function() {
        			return messages;
        		},
        		send: function(message) {
        			ws.send(JSON.stringify(message));
        		}
            };

        }]);