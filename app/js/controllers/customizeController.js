'use strict';

angular.module('liineApp.controllers.customize', ['liineApp.services.customize'])
  .controller('CustomizeController', ['$scope','customizeService',
    function($scope,customizeService) {



      $scope.getImages = function(company_id) {
        customizeService.get({company_id:company_id},function(response) {
            console.log("Response from getting images:");
            console.log(response);

            var image_urls = response.image_urls;
            
        },function(errorResponse) {
            console.log("Error getting competitors:");
            console.log(errorResponse);
        } );
      };

      // $scope.saveImages = function(company_id) {
      //   console.log("Trying to save...");
      //   var competitors_ids = [];
      //   for(var competitor_id in $scope.competitors) {
      //      competitors_ids.push(competitor_id);
      //   }

      //   competitorService.save([],{company_id:company_id, competitors: competitors_ids},function(value, responseHeader) {
      //       console.log("Response from trying to update competitors:");
      //       console.log(value);
      //   },function(errorResponse) {
      //       console.log("Error updating competitors:");
      //       console.log(errorResponse);
      //   } );
      // };

      // $scope.addCompetitor = function(competitor_id) {
      //   console.log("Competitor Added");
      //   $scope.competitors[competitor_id + ""] = $scope.other_companies[competitor_id + ""];
      //   delete $scope.other_companies[competitor_id + ""];
      // };

      // $scope.removeCompetitor = function(competitor_id) {
      //   console.log("Competitor Removed");
      //   $scope.other_companies[competitor_id + ""] = $scope.competitors[competitor_id + ""];
      //   delete $scope.competitors[competitor_id + ""];
      // };

      // $scope.isCurrentCompetitor = function(competitor_id) {
      //   return $scope.competitors.hasOwnProperty(competitor_id);
      // };



    }]);
