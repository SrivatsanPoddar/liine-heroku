'use strict';
 
angular.module('liineApp.services.IVR', ['ngResource'])
    .factory('IVRservice', ['$resource',
        function($resource) {
            return $resource("/instructiontree");               
        }]);