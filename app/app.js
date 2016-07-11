(function() {
	'use strict';
	angular.module('solrApp', [
		'ngSanitize',
		'ui.bootstrap',
		'ui.router',
		'angularUtils.directives.dirPagination'
	]).config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/search');

		$stateProvider.state('main', {
			url: '/search',
			templateUrl: 'app/view/main.html',
			controller : 'mainCtrl',
			controllerAs : 'ctrl',
			resolve: {
				siteLabels: function (resultRestFactory) {
					return resultRestFactory.getSiteLabels().then(function (response) {
						debugger;
						return response;
					});
				}
		   }
		}).state('tracking', {
			url: '/tracking',
			templateUrl: 'app/view/tracking.html',
			controller : 'trackingCtrl',
			controllerAs : 'ctrl'
		});
	});

})();
