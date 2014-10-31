'use strict';
 
angular.module('liineApp.services.customize', ['ngResource'])
    .factory('customizeService', ['$resource',
        function($resource) {
            return $resource("/customImages");               
        }]);