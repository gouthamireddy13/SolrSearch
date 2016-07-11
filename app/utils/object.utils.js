(function() {
	'use strict';
	angular.module('solrApp').factory('objectUtils', objectUtils);
    objectUtils.$inject=[];
    function objectUtils(){
        return {
            getLength : getLength
        };

        function getLength(obj){
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        }
    }
})();
