'use strict';

angular.module('liineApp.controllers.IVR', ['liineApp.services.IVR'])
  .controller('IVRController', ['$scope','IVRservice',
    function($scope, IVRservice) {

      $scope.treeOptions = {
        beforeDrop: function(event) {
          console.log("Before dropped!");
          saveOldTree();
          return true;
        }
      };

    $scope.list = [{
      "display_text": "Comcast",
      "children": [

        {"display_text": "Trouble with Service",
        "children":[
         
          {
          "display_text": "TV",
          "children":[
          {
            "display_text": "Video-on-Demand",
            "phone_number":"1(800)934-6489",
            "children":[]},
            {
            "display_text": "Picture Quality",
            "phone_number":"1(800)934-6489",
            "children":[]},
            {
            "display_text": "Other",
            "phone_number":"1(800)934-6489",
            "children":[]}]},
          {
          "display_text": "Internet",
          "phone_number":"1(800)934-6489",
          "children":[]},
          {
          "display_text": "Phone",
          "phone_number":"1(800)934-6489",
          "children":[]}]},

        {   "display_text": "Billing",
            "phone_number":"1(800)934-6489",
          "children":[]},

        {             "display_text": "Add Services",
            "phone_number":"1(800)934-6489",
        "children":[]}]
    }];

    var company_id = 1;

    $scope.getInstructionTree = function(input_company_id) {
        
        if (input_company_id) {
          company_id = input_company_id;
        }

        IVRservice.get({company_id:$scope.company_id},function(response) {
            console.log("Response from getting instruction tree:");
            console.log(response);

            if (response.instruction_tree.instruction_tree === null) {
              $scope.list = [{"display_text": "(New Node)",
                                children:[]}];
            }
            else {
              $scope.list = response.instruction_tree.instruction_tree;
            }

        },function(errorResponse) {
            console.log("Error getting instruction tree:");
            console.log(errorResponse);
        } );
    };

    $scope.saveInstructionTree = function() {
      $scope.itemBeingEdited.editing = false;
      console.log("Trying to save...");
      IVRservice.save([],{instruction_tree: $scope.list, company_id:company_id},function(value, responseHeader) {
          console.log("Response from trying to update instruction tree:");
          console.log(value);
      },function(errorResponse) {
          console.log("Error updating instruction tree:");
          console.log(errorResponse);
      } );
    };

    $scope.itemBeingEdited = {};
    $scope.oldLists = [];


    $scope.undo = function() {
      $scope.list = $scope.oldLists.pop();
    };

    var saveOldTree = function () {
      console.log("Save tree called");
       
       var oldListToAdd = angular.copy($scope.list);
        console.log(oldListToAdd)
       $scope.oldLists.push(oldListToAdd);
    };

    $scope.removeItem = function(scope) {
      console.log("Remove called");
      saveOldTree();
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.newSubItem = function(scope) {
      saveOldTree();
      var nodeData = scope.$modelValue;

      var newItem = {
        display_text: '(New Node)',
        children: [],
        editing: false,
      };

      nodeData.children.push(newItem);
      $scope.editItem(newItem);
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
      saveOldTree();
      $scope.itemBeingEdited.editing = !$scope.itemBeingEdited.editing;
      item.editing = true;
      $scope.itemBeingEdited = item;
      

    };

    $scope.endEdit = function(item) {
      $scope.itemBeingEdited = {};
      item.editing = false;

    };

    //$scope.collapseAll();

    }]);