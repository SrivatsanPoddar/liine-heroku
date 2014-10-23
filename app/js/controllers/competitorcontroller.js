'use strict';

angular.module('liineApp.controllers.competitor', ['liineApp.services.competitor'])
  .controller('CompetitorController', ['$scope','competitorService',
    function($scope,competitorService) {



      $scope.getCompetitors = function(company_id) {
        competitorService.get({company_id:company_id},function(response) {
            console.log("Response from getting competitors:");
            console.log(response);

            var competitor_ids = response.specified_competitors.competitors;
            $scope.companies = response.all_companies;

            $scope.other_companies = {};
            $scope.companies.forEach(function(company) {
                $scope.other_companies[company.company_id + ""] = company.company_name;
            });

            $scope.competitors = {};
            competitor_ids.forEach(function(competitor_id) {
              $scope.competitors[competitor_id + ""] = $scope.other_companies[competitor_id + ""];
              delete $scope.other_companies.competitor_id;
            });

        },function(errorResponse) {
            console.log("Error getting competitors:");
            console.log(errorResponse);
        } );
      };

      $scope.saveCompetitors = function(company_id) {
        console.log("Trying to save...");
        var competitors_ids = [];
        for(var competitor_id in $scope.competitors) {
           competitors_ids.push(competitor_id);
        }

        competitorService.save([],{company_id:company_id, competitors: competitors_ids},function(value, responseHeader) {
            console.log("Response from trying to update competitors:");
            console.log(value);
        },function(errorResponse) {
            console.log("Error updating competitors:");
            console.log(errorResponse);
        } );
      };

      $scope.addCompetitor = function(competitor_id) {
        console.log("Competitor Added");
        $scope.competitors[competitor_id + ""] = $scope.other_companies[competitor_id + ""];
        delete $scope.other_companies[competitor_id + ""];
      };

      $scope.removeCompetitor = function(competitor_id) {
        console.log("Competitor Removed");
        $scope.other_companies[competitor_id + ""] = $scope.competitors[competitor_id + ""];
        delete $scope.competitors[competitor_id + ""];
      };

      $scope.isCurrentCompetitor = function(competitor_id) {
        return $scope.competitors.hasOwnProperty(competitor_id);
      };



    }]);
