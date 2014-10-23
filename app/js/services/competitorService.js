'use strict';
 
angular.module('liineApp.services.competitor', ['ngResource'])
    .factory('competitorService', ['$resource',
        function($resource) {
            return $resource("/specifiedCompetitors");               
        }]);