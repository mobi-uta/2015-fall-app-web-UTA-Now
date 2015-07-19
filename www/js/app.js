	Parse.initialize("F9BqVIRG5hs1PPUktFM5FGrQ4gnJgGyHZKwTSjiY", "kFs2almVuiCgRnbrPNyCnpfNCrYshHzn2GvZSnhc");

var app = angular.module('starter', ['ionic', 'ngCordova','ionic.service.core','ionic.service.push','starter.controllers', 'starter.services','ngOpenFB']);

app.value('fbAccessToken', '');

app.run(function($ionicPlatform, ngFB, fbAccessToken, $location) {
	ngFB.init({appId: 1625138201105249, accessToken: fbAccessToken });
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleLightContent();
		}
	/* Check if user has ever opened the app before
	 * If not, open intro screen
	 **/
	 if(!window.localStorage['lastVisit']) {
	 	$location.path('intro');
	 }      
	});
});

app.config(['$ionicAppProvider', function($ionicAppProvider) {
  // Identify app
  $ionicAppProvider.identify({
    // The App ID (from apps.ionic.io) for the server
    app_id: '104f9ff7',
    // The public API key all services will use for this app
    api_key: '60eff813ba66e4d17297751176defe45bb755bcbb1b0716e',
    // Set the app to use development pushes
    dev_push: true
  });
}]);

app.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('main', {
		url: '/main',
		templateUrl: 'templates/sidemenu.html',
		abstract: true
	})

	.state('intro', {
		url: '/intro',
		templateUrl: 'templates/intro.html',
		controller: 'IntroController'
	})

	.state('main.events-list', {
		url: '/events',
		views: {
			'menuContent': {
				templateUrl: 'templates/events-list.html',
				controller: 'EventListController'
			}
		}
	})

	.state('event', {
		url: '/event/:eventId',
		templateUrl: 'templates/event-detail.html',
		controller: 'EventDetailCtrl'
	})

	.state('settings', {
		url: '/settings',
		templateUrl: 'templates/settings.html',
		controller: 'AccountCtrl'
	})

	.state('find-event', {
		url: '/find-event',
		templateUrl: 'templates/find-event.html',
		controller: 'FindEventCtrl'
	})

	.state('add-event', {
		url: '/add-event',
		templateUrl: 'templates/add-event.html',
		controller: 'AddEventCtrl'
	})
	.state('organization-page',{
		url: '/org-page',
		templateUrl: 'templates/organization-page.html',
		contoller: 'OrgPageCtrl'
	});
	$urlRouterProvider.otherwise('/main/events');

});
