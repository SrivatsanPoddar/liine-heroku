'use strict';

angular.module('liineApp.controllers.IVR', ['liineApp.services.IVR'])
  .controller('IVRController', ['$scope','IVRservice',
    function($scope, IVRservice) {

    $scope.list = [{
      "id": 1,
      "title": "Comcast",
      "items": [

        {"id": 2,
        "title": "Trouble with Service",
        "items":[
         
          {"id": 21,
          "title": "TV",
          "items":[
          {"id": 211,
            "title": "Video-on-Demand",
            "phone_number":"1(800)934-6489",
            "items":[]},
            {"id": 212,
            "title": "Picture Quality",
            "phone_number":"1(800)934-6489",
            "items":[]},
            {"id": 213,
            "title": "Other",
            "phone_number":"1(800)934-6489",
            "items":[]}]},
          {"id": 22,
          "title": "Internet",
            "phone_number":"1(800)934-6489",
          "items":[]},
          {"id": 23,
          "title": "Phone",
            "phone_number":"1(800)934-6489",
          "items":[]}]},

        {"id": 3,
        "title": "Billing",
            "phone_number":"1(800)934-6489",
        "items":[]},

        {"id": 4,
        "title": "Add Services",
            "phone_number":"1(800)934-6489",
        "items":[]}]
    }];

    var company_id = 1;

    $scope.getInstructionTree = function() {
        IVRservice.get({company_id:company_id},function(instructionTree) {
            console.log("Response from getting instruction tree:");
            console.log(instructionTree);
            $scope.list = instructionTree;
        },function(errorResponse) {
            console.log("Error getting instruction tree:");
            console.log(errorResponse);
        } );
    };

    $scope.saveInstructionTree = function() {

      IVRservice.save([],{instruction_tree: $scope.list, company_id:company_id},function(value, responseHeader) {
          console.log("Response from trying to update instruction tree:");
          console.log(value);
      },function(errorResponse) {
          console.log("Error updating instruction tree:");
          console.log(errorResponse);
      } );
    };

    $scope.selectedItem = {};

    $scope.options = {
    };

    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      nodeData.items.push({
        id: nodeData.id * 10 + nodeData.items.length,
        title: '(New Node)',
        items: []
      });

      if (scope.collapsed) {
        scope.toggle();
      }
    };

    var getRootNodesScope = function() {
      return angular.element(document.getElementById("tree-root")).scope();
    };

    $scope.collapseAll = function() {
      var scope = getRootNodesScope();
      scope.collapseAll();
    };

    $scope.editItem = function(item) {
      console.log("Editing");
      item.editing = !item.editing;
    };

    $scope.endEdit = function(item) {
      item.editing = false;
    };

    //$scope.collapseAll();

    }]);