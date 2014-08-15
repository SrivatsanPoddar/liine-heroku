'use strict';
//Service to control live web-socket communication
angular.module('liineApp.services.live', [])
    .factory('liveService', ['$rootScope',
        function($rootScope) {
        	var Service = {};
            //var url = "ws://localhost:5000/live";
            var url = "ws://safe-hollows-9286.herokuapp.com/live";
            var ws;
            var messages = [];
            var pendingConnections = {};
            var index = 1;
            var pairsIndex = null;
            var isConnected = false;
            return {
            	init: function(company_id) {
            		ws = new WebSocket(url);
            		ws.onopen = function () {
            			console.log("Connection Opened!");
            			ws.send(JSON.stringify({set_company_id: company_id}));
            			setInterval(function() {
            				ws.send("Ping from client");
            			},20000)
            		};

            		ws.onclose = function () {
            			console.log("Connection Closed!");
            		};

            		ws.onerror = function(error) {
            			console.log("Error: " + error);
            			clearInterval();
            		};

            		ws.onmessage = function(data) {

            			console.log("Received message: " + JSON.stringify(data));
            			console.log(angular.fromJson(data));
            			var receivedData = angular.fromJson(data.data);

            			//If the client connecting to this company...
            			if (receivedData.hasOwnProperty('set_target_company_id')) {
            				console.log("New Pending Connection with senderIndex " + receivedData.senderIndex + " and callPath: " + receivedData.message);
            				$rootScope.$apply(function () {
            					pendingConnections[receivedData.senderIndex + ""] = {callPath: receivedData.message, senderIndex: receivedData.senderIndex};
            				});

            			};

            			//If server responded with a pairsIndex after requesting to pair with caller, then store the pairsIndex
            			if(receivedData.hasOwnProperty('pair')) {
            				console.log("Pair request confirmed with pairsIndex: " + receivedData.pairsIndex);
            				$rootScope.$apply(function () {
            					pairsIndex = receivedData.pairsIndex;
            					isConnected = true;
            				});
            			};

            			if(receivedData.hasOwnProperty('target_role')) {
            				$rootScope.$apply(function () {
            					messages.push({message: receivedData.message});
            				});
            			}

            			// var receivedMessage = angular.fromJson(data.data).message;
            			// console.log("parsed message: " + receivedMessage);
            			// $rootScope.$apply(function () {
	            		// 	messages.push({id: index, message: receivedMessage});
	            		// 	index = index + 1;
            			// })


            		};
            	},
        		getMessages: function() {
        			return messages;
        		},
        		//Get callers to this company waiting to be attended to
        		getPendingConnections: function () {
        			return pendingConnections;
        		},
        		isConnected: function() {
        			return isConnected;
        		},
        		send: function(message) {
        			if (pairsIndex) {
        				message.pairsIndex = pairsIndex;
        				message.target_role = "caller";
        				console.log("Paired message of: " + message.message + ". being sent to pairsIndex:" + pairsIndex);
        			}
        			ws.send(JSON.stringify(message));
        		}
            };

        }]);