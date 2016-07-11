(function() {
	'use strict';
	angular.module("solrApp").controller("mainCtrl", mainCtrl);

	mainCtrl.$inject = ['$scope', '$q', '$http', '$location','constantService', 'siteLabels'];

	function mainCtrl($scope, $q, $http, $location,constantService, siteLabels) {
		var _self = this;
		console.log(siteLabels);
		_self.numFound = 0;
		_self.queryTime = null;
		_self.solrUrl = constantService.APP_URL;

		_self.params = $location.search();


		_self.data = {
			availableOptions : siteLabels.labels.pagination,
			selectedOption :  siteLabels.labels.pagination[0]
			// availableOptions: [
			// 	{id: '1', name: '10 Per Page', value:10},
			// 	{id: '2', name: '25 Per Page', value:25},
			// 	{id: '3', name: '50 Per Page', value:50},
			// 	{id: '4', name: '75 Per Page', value:75},
			// 	{id: '5', name: '100 Per Page', value:100}
			// ],
			// selectedOption: {id: '1', name: '10 Per Page', value:10}
		};


		_self.totalItems = 0;
		_self.currentPage = 1;
		_self.itemsPerPage = _self.data.selectedOption.value;
		_self.maxSize = 5;
		_self.numPages = 1;
		//Number of pager buttons to show

		_self.searchText = '';


		_self.docs = [];
		_self.facet_fields = {};

		_self.selected_facets =	{
			facid : [],
			doctype : [],
			filetype : []
		};
		_self.showSelected = false;

		_self.facetItems = siteLabels.labels.facetItems;
		// [{
		// 	id : 1,
		// 	label : 'Patient Id',
		// 	value : 'patid'
		// }, {
		// 	id : 2,
		// 	label : 'Facility',
		// 	value : 'facid'
		// },{
		// 	id : 3,
		// 	label : 'Document Type',
		// 	value : 'doctype'
		// }];
		_self.selected = {
			value : _self.facetItems[0].value,
			item :{
				value : null
			}
		};

		_self.advanceSearchCheckboxModel = {
			value : false
		};

        $scope.$watch(function(){
		 		return _self.advanceSearchCheckboxModel.value;
		 	},
            function handleFooChange( newValue, oldValue ) {
              // console.log( "_self.advanceSearchCheckboxModel.value:", newValue );
                if(!newValue){
                	_self.selected.item.value = null;
                	_self.advanceSearchText = '';
                }
            }
        );


		_self.setPage = function(pageNo) {
			_self.currentPage = pageNo;
		};

		_self.pageChanged = function(pageNumber) {
			//console.log('Page changed to: ' + _self.currentPage);
			_self.currentPage = pageNumber;
			alterNativeSearch(false, false);
		};

		_self.setItemsPerPage = function(num) {
			_self.itemsPerPage = _self.data.selectedOption.value;
			_self.pageChanged(1);
		};

		$scope.$on('addFacet', function(event, item) {
			debugger;
			addItemToFacet(item);
			alterNativeSearch(false, true);
		});

		$scope.$on('removeFacet', function(event, item) {
			removeItemFromFacet(item);
			alterNativeSearch(false, true);
		});

		function addItemToFacet(item) {
			switch (item.key) {
				case 'facid' :
					_self.selected_facets.facid.push(item.value);
					break;
				case 'doctype' :
					_self.selected_facets.doctype.push(item.value);
					break;
				case 'filetype' :
					_self.selected_facets.filetype.push(item.value);
					break;
			}
		}

		function removeItemFromFacet(item) {
			switch (item.key) {
			case 'facid' :
				removeItemFromArray(_self.selected_facets.facid, item.value);
				break;
			case 'doctype' :
				removeItemFromArray(_self.selected_facets.doctype, item.value);
				break;
			case 'filetype' :
				removeItemFromArray(_self.selected_facets.filetype, item.value);
				break;
			}
		}

		function removeItemFromArray(arr, item) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === item) {
					arr.splice(i, 1);
				}
			}
		}

		function filterResult(args){
			console.log(_self);
			_self.search[args.field] = args.key;
		}

		_self.selectedItemsArray = [];
		_self.buildSearchParams = function(advanceSearchFlag, newSearch) {
			//var url = _self.solrUrl;
			var url = constantService.APP_URL;

			url += '?q='+(_self.searchText || '*:*');
			url += '&facet=on';
			url += '&facet.mincount=1';
			url += '&wt=json';
			url += '&json.nl=map';
			url += '&json.wrf=JSON_CALLBACK';
			url += '&rows=' + _self.itemsPerPage;
			if(newSearch || _self.currentPage === 1){
				url += '&start=0';
			} else {
				url += '&start=' + (((_self.currentPage-1) * _self.itemsPerPage) );
			}

			if(_self.selected.item.value){
 				var wordsArr = _self.advanceSearchText.split(" ");

				if (wordsArr.length>1)
				{


					url += '&fq=' + '(' + _self.selected.item.value + ':' + '"' + _self.advanceSearchText + '"' + ')';
				}
				else {

					url += '&fq='  + _self.selected.item.value + ':' + _self.advanceSearchText ;
				}
			}



			_self.selectedItemsArray.length = 0;
			angular.forEach(_self.selected_facets, function(value, key) {
				var len = _self.selected_facets[key].length;
				if (len) {

					var str = '';
					var tempObj = {
						key : key,
						value : []
					};
					for (var i = 0; i < len; i++) {

						tempObj.value[i] = value[i];
						_self.showSelected = true;
						str += key + ':' + '"' + _self.selected_facets[key][i] + '"';
						if (i < len - 1) {
							str += ' OR ';
						}
					}
					_self.selectedItemsArray.push(tempObj);

					url += '&fq=' + '(' +  str + ')' ;
				}
			});


			return url;
		};

		function alterNativeSearch(paginationFlag, resetFlag){

			var url = _self.buildSearchParams(paginationFlag, resetFlag);
			$http.jsonp(url, {
				cache : true
			}).success(function(data) {
				_self.docs = data.response.docs;
				if(!paginationFlag){
					_self.numFound = data.response.numFound;
					_self.totalItems = data.response.numFound;
					_self.queryTime = data.responseHeader.QTime;
					_self.numPages = Math.ceil(_self.totalItems/_self.itemsPerPage);
				}

			});
		}

		_self.search = function() {

			var url = _self.buildSearchParams(null, true);
			$http.jsonp(url, {
				cache : true
			}).success(function(data) {
				_self.facet_fields = createFacetFields(data.facet_counts.facet_fields);
				console.log(response.data);
				_self.docs = data.response.docs

				_self.numFound = data.response.numFound;
				_self.totalItems = data.response.numFound;
				_self.queryTime = data.responseHeader.QTime;
				_self.numPages = Math.ceil(_self.totalItems/_self.itemsPerPage);
			});
		};

		function createFacetFields(fields) {
			delete fields.contenttype;
			return fields;
		}

		_self.setFacetGroup = function(newGroup) {
			_self.facet_group = newGroup;
		};

	}

})();
