'use strict';
 
angular.module('liineApp.directives.toFocus', [])
    .directive('toFocus', function() {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
    	scope.$watch("itemBeingEdited", function(currentValue, previousValue) {

		      if(attrs.toFocus === "true") {
		      	setTimeout(function() {
		      	    elem.select();
		      	}, 10);
	  			
      		}
    	})	

    }
  };
});
