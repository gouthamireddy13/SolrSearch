(function() {
	'use strict';
	angular.module("solrApp").controller("solrSearchCtrl", solrSearchCtrl);

	solrSearchCtrl.$inject = ['siteLabels'];

	function solrSearchCtrl(siteLabels) {
		var _self = this;
		_self.items = siteLabels.labels.solrAdvSearchItems;
		// [{
		// 	id : 1,
		// 	label : 'Patient Id'
		// }, {
		// 	id : 2,
		// 	label : 'Facility'
		// },{
		// 	id : 3,
		// 	label : 'Document Type'
		// }];
		_self.selected = _self.items[0];
		_self.showItem = function(){
			console.log(_self.selected);
		};
	}

})();
