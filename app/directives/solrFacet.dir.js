(function() {
	'use strict';
	angular.module("solrApp").directive("solrFacet", solrFacet);

	function solrFacet() {
		return {
			restrict : "E",
			scope : {

				field : '=',
				values : '='
			},
			controller : 'solrFacetCtrl',
			controllerAs : 'ctrl',
			bindToController : true,
			templateUrl : "app/view/solr_facet.html",
			link : function(scope, element, attrs, ctrl) {
				var es5getprops = Object.getOwnPropertyNames;				
			}
		};
	}
})();
