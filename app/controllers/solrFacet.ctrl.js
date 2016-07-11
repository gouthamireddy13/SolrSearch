(function() {
	'use strict';
	angular.module("solrApp").controller("solrFacetCtrl", solrFacetCtrl);

	solrFacetCtrl.$inject = ['objectUtils'];

	function solrFacetCtrl(objectUtils) {
		var _self = this;

		_self.displayName = function(){

			if(objectUtils.getLength(_self.values)<4){
				_self.showAllFlag = false;
			} else {
				_self.showAllFlag = true;
			}

			if(_self.field === 'filetype'){
				return 'File Type';
			} else if(_self.field === 'doctype'){
				return 'Document Type';
			} else if(_self.field === 'facid'){
				return 'Facility';
			}
		}

		_self.class = 'show-short-view';
		_self.showAllFlag = false;


		_self.isEmpty = function() {
			return !scope.results || (es5getprops(scope.results).length === 0);
		};

		_self.changeClass = function() {
			if(_self.class === 'show-short-view'){
				_self.class = 'show-large-view';
			} else {
				_self.class = 'show-short-view';
			}
		};

	}

})();
