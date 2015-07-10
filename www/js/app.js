Parse.initialize("z5UQQkU9wJeZ2LcGhLQGymLydw9m3Zk05gBHwxLg", "7BGt335q9qsdxWR9YZ2UPAnCyinn1v59NXI1Gq6n");

var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngOpenFB']);


app.run(function($ionicPlatform, ngFB) {
  ngFB.init({appId: 698647553615190, accessToken: 'CAAJ7ao9BpVYBAAVsRWqEd7M97igACMPTOpntRZAZAcamGKywObjQZAbNZBwPMwKRLS7rrvaIuZCBwZCoTRmE8YUZBYto9YFZC67a6LkGbeLVNzWQe50g4ertC2caoEaXovDimUK7xTOKjxqEZADZALwbW2JdRWGtBoAX3eZBaybJT1nwtIcaQZBKZChgbLycxzC9KJQZCZBtMUwGf7z6xoEhqA34Yai'});
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

  .state('intro', {
    url: '/intro',
    templateUrl: 'templates/intro.html'
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
  })

  .state('find-event', {
    url: '/find-event',
    templateUrl: 'templates/find-event.html',
    controller: 'FindEventCtrl'
  })

  .state('add-event', {
    url: '/add-event/:id',
    templateUrl: 'templates/add-event.html',
    controller: 'AddEventCtrl'
  });

  $urlRouterProvider.otherwise('/events');

});
