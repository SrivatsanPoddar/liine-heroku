'use strict';
 
angular.module('liineApp.services.customize', ['ngResource'])
    .factory('customizeService', ['$resource',
        function($resource) {
            return {
            		images: $resource("/customImages"),
            		payment_items: $resource("/customPaymentItems")
            	};               
        }]);