(function() {
	'use strict';
	angular.module('solrApp').controller('trackingCtrl', trackingCtrl);

	trackingCtrl.$inject=['$q', 'resultRestFactory'];

	function trackingCtrl($q, resultRestFactory){
		var _self = this;

		_self.totalItem = [];
		_self.tableItems = [];
		_self.currentPage = 1;
  		_self.pageSize = 50;
		_self.total_count = 0;


		resultRestFactory.getTrackingData().then(function(response) {		
			//debugger;
			_self.total_count = response.values.length;
			_self.totalItem = response.values;
			_self.tableItems = _self.totalItem.slice(0, _self.pageSize);
			
		})
		.catch(function(error) {
			console.log(error);
		});

		_self.pageChangeHandler = function(pageno){
			console.log(pageno);
			_self.tableItems.length=0;
			_self.tableItems = _self.totalItem.slice((_self.pageSize * (pageno-1)), (_self.pageSize*pageno));
		}
	}
})();


