'use strict';

angular.module('liineApp.controllers.IVR', [])
  .controller('IVRController', ['$scope',
    function($scope) {

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
      item.editing = true;
    };

    $scope.endEdit = function(item) {
      item.editing = false;
    };

    //$scope.collapseAll();

    }]);