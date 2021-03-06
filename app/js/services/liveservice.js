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
            var pairsIndex = -1;
            var isConnected = false;
            var currentAuthPicture = null;
            var originalAuthPicture = null;
            var toAuthenticate = false;
            var backCameraPicture = null;

            return {
            	init: function(company_id) {
            		ws = new WebSocket(url);
            		ws.onopen = function () {
            			console.log("Connection Opened!");
            			ws.send(JSON.stringify({set_company_id: company_id}));
            			setInterval(function() {
            				ws.send(JSON.stringify({message: "Ping from client"}));
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

            			//If a caller's connection closes, remove from pending connections if contained in list
            			if (receivedData.hasOwnProperty('close_connection_with_sender_index')) {
            				console.log("Removing Pending Connection with senderIndex " + receivedData.close_connection_with_sender_index);
            				$rootScope.$apply(function () {
            					delete pendingConnections[receivedData.close_connection_with_sender_index + ""];
            				});

            				//If the disconnected socket was the paired caller, then reset pairsIndex and unset isConnected
            				if (receivedData.hasOwnProperty('pairsIndex')) {
            					if (receivedData.pairsIndex === pairsIndex) {
            						$rootScope.$apply(function () {
            							pairsIndex = -1;
            							isConnected = false;
            						});
            					}
            				}

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
                            if (receivedData.request_type === 'MESSAGE') {
                                $rootScope.$apply(function () {
                                    messages.push({message: receivedData.message});
                                });
                            }
                            else if (receivedData.request_type === 'CURRENT AUTHENTICATION PICTURE') {
                                currentAuthPicture = receivedData.message;

                                if (currentAuthPicture && originalAuthPicture) {
                                    $rootScope.$apply(function () {
                                        toAuthenticate = true;
                                    });
                                }
                            }
                            else if (receivedData.request_type === 'ORIGINAL AUTHENTICATION PICTURE') {
                                originalAuthPicture = receivedData.message;

                                if (currentAuthPicture && originalAuthPicture) {
                                    $rootScope.$apply(function () {
                                        toAuthenticate = true;
                                    });
                                }
                            }
                            else if (receivedData.request_type === 'BACK CAMERA PICTURE') { 
                                    $rootScope.$apply(function () {
                                        backCameraPicture = receivedData.message;
                                    });

                            };



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
                toAuthenticatePictures: function() {
                    return toAuthenticate;
                },
                setAuthenticatePictures: function(myToAuthenticate) {
                    toAuthenticate = myToAuthenticate;
                    currentAuthPicture = null;
                    originalAuthPicture = null;
                },
        		isConnected: function() {
        			return isConnected;
        		},
        		send: function(message) {
        			if (!(pairsIndex === -1)) {
        				message.pairsIndex = pairsIndex;
        				message.target_role = "caller";
        				console.log("Paired message of: " + message.message + ". being sent to pairsIndex:" + pairsIndex);
        			}
        			ws.send(JSON.stringify(message));
        		},
                getCurrentAuthenticationPicture: function() {
                    return currentAuthPicture;
                },
                getOriginalAuthenticationPicture: function() {
                    return originalAuthPicture;
                },
                getBackCameraPicture: function() {
                    return backCameraPicture;
                }
            };

        }]);