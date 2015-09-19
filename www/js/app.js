Parse.initialize("F9BqVIRG5hs1PPUktFM5FGrQ4gnJgGyHZKwTSjiY", "kFs2almVuiCgRnbrPNyCnpfNCrYshHzn2GvZSnhc");
var app = angular.module('starter', [
	'ionic', 'ionic.service.core','ionic.service.push',
	'controller.base', 'controller.events', 'controller.auth', 'controller.organizer',
	'starter.services','starter.directives',
	'ngOpenFB', 'leaflet-directive','ui.bootstrap.datetimepicker'
]);
app.value('fbAccessToken', '');

app.run(function($ionicPlatform, ngFB, fbAccessToken, $location) {
ngFB.init({appId: 408131292703702
			, accessToken: fbAccessToken });
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
	app_id: '71460d9e',
	// The public API key all services will use for this app
	api_key: '36c48cd254345d89f5b66f2be2616e3aae5e06fbe44d4598',
	// Set the app to use development pushes
	dev_push: true
});
}]);

app.config(function($stateProvider, $urlRouterProvider) {

$stateProvider

.state('main', {
	url: '/main',
	cache: false,
	templateUrl: 'templates/sidemenu.html',
	controller: 'MenuController',
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
			templateUrl: 'templates/event/events-list.html',
			controller: 'EventListController'
		}
	}
})

.state('main.settings', {
	url: '/settings',
	views: {
		'menuContent': {
			templateUrl: 'templates/settings.html',
			controller: 'SettingsController'
		}
	}
})

.state('main.admin-organization', {
	cache: false,
	url: '/manage',
	views: {
		'menuContent': {
			templateUrl: 'templates/organizer/admin-organization.html',
			controller: 'adminOrgViewController'
		}
	}
})
.state('main.member-organization',{
	url: '/member',
	views:
	{
		'menuContent': {
			templateUrl: 'templates/organizer/member-organization.html',
			controller: 'MemberOrgController'
		}
	}

})
// .state('main.register-organization', {
// 	url: '/manage/register/:id',
// 	templateUrl: 'templates/organization-register.html',
// 	controller: 'RegisterOrganizationController'
// 	views: {
// 		'menuContent': {
// 			templateUrl: 'templates/organizer/organization-register.html',
// 			controller: 'RegisterOrgController'
// 		}
// 	}
// })
.state('main.org-register',{
	url: '/manage/:id',
	views:{
		'menuContent':{
			templateUrl: 'templates/organizer/register-organization.html',
			controller:'RegisterOrgController'
		}
	}
})

.state('main.event', {
	url: '/event/:id',
	views: {
		'menuContent': {
			templateUrl: 'templates/event/event-detail.html',
			controller: 'EventDetailCtrl'
		}
	}

})

.state('find-event', {
	url: '/find-event',
	templateUrl: 'templates/event/find-event.html',
	controller: 'FindEventCtrl'
})

.state('main.org-detail', {
	url: '/org/:id',
	views:{
		'menuContent':{
				templateUrl: 'templates/organizer/organization-page.html',
				controller: 'orgDetailCtrl'
		}
	}
})

.state('add-event', {
	url: '/add-event',
	templateUrl: 'templates/event/add-event.html',
	controller: 'AddEventCtrl'
});

$urlRouterProvider.otherwise('/main/events');

});
