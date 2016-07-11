(function() {
	'use strict';
	angular.module("solrApp").controller("resultDocumentCtrl", resultDocumentCtrl);

	resultDocumentCtrl.$inject = ['$scope', '$q', 'resultRestFactory'];

	function resultDocumentCtrl($scope, $q, resultRestFactory) {
		var _self = this;

		_self.viewMoreFlag = false;
		_self.viewContentFlag = false;
		_self.showLabel = 'More';
		_self.changeView = function() {
			_self.viewContentFlag = !_self.viewContentFlag;
			if(_self.showLabel === 'More'){
				_self.showLabel = 'Less';
			} else {
				_self.showLabel = 'More';
			}
		};

		_self.showView = function(content){
			if(content.length> 700){
				_self.viewMoreFlag = true;
				return content.substring(0, 700);
			} else {
				_self.viewMoreFlag = false;
				return content;
			}
		};

		$scope.highlight = function(text, search) {
		    if (!search) {
		        return $sce.trustAsHtml(text);
		    }
		    return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
		};

		_self.renderImage = function(key) {
			resultRestFactory.getImageBinary(key).then(function(response) {	
				console.log(response)
				if(response.data["fty"].toLowerCase()== 'tf'){
					_self.avatarText = null;
				 	_self.avatarImage = "data:image/jpeg;base64," + response.data["img"];
				}	else {
				    _self.avatarImage = null;
					_self.avatarText = response.data["txt"];
				}
				_self.avatarPID = response.data["pid"];
				newHTML(key) ;
			})
			.catch(function(error) {
				console.log(error);
			});
		};
	/*	_self.renderImage = function(key) {
			console.log(key);
			resultRestFactory.getImageBinary(key).then(function(response) {			
				 _self.avatarImage = "data:image/jpeg;base64," + response.data["img"];
				console.log(response);
				 newHTML() ;
			})
			.catch(function(error) {
				console.log(error);
			});
		};*/	

		function newHTML(key) {
			var HTMLstring = '<HTML>\n';    
			var hpfImage = _self.avatarImage;
			HTMLstring += '<HEAD>';
			HTMLstring += '<TITLE>' + key + '</TITLE>\n';
			HTMLstring += '</HEAD>';
			HTMLstring += '<BODY style="overflow:auto;">\n';
			 HTMLstring += '<p> <b>' + key + '</b></p>\n';    
	            HTMLstring += '<p> <b>Patient ID :</b>' + _self.avatarPID + '</b></p>\n';
			/*HTMLstring += '<img src="" id="hpfimage" />';*/
		if( _self.avatarImage){
				//HTMLstring += '<IMG src="' + _self.avatarImage + '"/>\n';	
				 HTMLstring += '<img src="" id="hpfimage" width="900" height="900" alt=""/>';
			} else if(_self.avatarText){
				HTMLstring += '<p>' + _self.avatarText + '</p>\n';	
			}		    
			HTMLstring += '</BODY>\n';
			HTMLstring += '</HTML>';
			console.log(HTMLstring);
             var myWindow = window.open("", key, "width=1000, height=600");
             myWindow.document.write(HTMLstring);
			 myWindow.document.getElementById("hpfimage").src = hpfImage;
             myWindow.oncontextmenu = function () { return false; }
		}


	}

})();

