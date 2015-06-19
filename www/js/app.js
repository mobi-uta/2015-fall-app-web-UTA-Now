Parse.initialize("z5UQQkU9wJeZ2LcGhLQGymLydw9m3Zk05gBHwxLg", "7BGt335q9qsdxWR9YZ2UPAnCyinn1v59NXI1Gq6n");

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services']);

app.run(function($ionicPlatform) {
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

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'templates/tab-dash.html',
                controller: 'DashCtrl'
            }
        }
    })

    .state('tab.chats', {
        url: '/chats',
        views: {
            'tab-chats': {
                templateUrl: 'templates/tab-chats.html',
                controller: 'ChatsCtrl'
            }
        }
    })

    .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
            'tab-chats': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'ChatDetailCtrl'
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
    })

    .state('tab.event-detail', {
        url: '/event',
        views: {
            'tab-event': {
                templateUrl: 'templates/event-detail.html',
                controller: 'EventDetailCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/tab/dash');

});
