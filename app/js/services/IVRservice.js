'use strict';
 
angular.module('liineApp.services.gift', ['ngResource'])
    .factory('IVRservice', ['$resource',
        function($resource) {
            return {
                resource: $resource("/instructiontree")
             };                 
        }])