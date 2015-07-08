Parse.initialize("z5UQQkU9wJeZ2LcGhLQGymLydw9m3Zk05gBHwxLg", "7BGt335q9qsdxWR9YZ2UPAnCyinn1v59NXI1Gq6n");

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngOpenFB']);


app.run(function($ionicPlatform, $location, ngFB) {
	ngFB.init({ appId: 408131292703702 });

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
})

app.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('intro', {
		url: '/intro',
		templateUrl: 'templates/intro.html',
		controller: 'IntroController'
	})

	.state('events-list', {
		url: '/events',
		templateUrl: 'templates/events-list.html',
		controller: 'EventListController'
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
	});

	$urlRouterProvider.otherwise('/events-list');

});
