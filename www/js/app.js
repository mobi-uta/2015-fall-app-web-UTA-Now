Parse.initialize("z5UQQkU9wJeZ2LcGhLQGymLydw9m3Zk05gBHwxLg", "7BGt335q9qsdxWR9YZ2UPAnCyinn1v59NXI1Gq6n");

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngOpenFB']);


app.run(function($ionicPlatform,ngFB) {
    ngFB.init({appId: 408131292703702});
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

app.config(function($stateProvider, $urlRouterProvider) {    


    
    $stateProvider

    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    .state('tab.events', {
        url: '/events',
        views: {
            'tab-events': {
                templateUrl: 'templates/tab-events.html',
                controller: 'EventsCtrl'
            }
        }
    })

    .state('tab.event-detail', {
        url: '/events/:eventId',
        views: {
            'tab-events': {
                templateUrl: 'templates/event-detail.html',
                controller: 'EventDetailCtrl'
            }
        }
    })
    
    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/tab/events');

});
