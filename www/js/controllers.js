var app = angular.module('starter.controllers', ['ngOpenFB']);

app.controller('AccountCtrl', function($scope, $ionicModal, $timeout, ngFB) {
	ngFB.getLoginStatus()
		.then(function(loginStatus) {
			if(loginStatus.status === 'connected') {
				console.log('connected yo');
			} else {
				console.log(loginStatus);
			}
		});

	$scope.fbLogin = function () {
		ngFB.login({ scope: 'email,read_stream,publish_actions' }).then(
			function (response) {
				if (response.status === 'connected') {
					console.log('Facebook login succeeded');
					//$scope.closeLogin();
				} else {
					alert('Facebook login failed');
				}
			});
	};
});

app.controller('IntroController', function($scope, $ionicModal, $timeout, $location, ngFB) {
	$scope.fbLogin = function(e) {
		/* Hide fb and show spinner */
		$scope.fbLoadingSwap(true, e);

		ngFB.login({ scope: 'email,public_profile,user_birthday,rsvp_event,user_education_history' })
			.then(function(response) {
				if (response.status === 'connected') {

					/* Get basic user details */
					ngFB.api({
						path: '/me',
						params: {fields: 'id,name,birthday,email,gender,education'}
					})
					.then(function(user) {

						/* Store basic FB info */
						window.localStorage['basicFbInfo'] = JSON.stringify(user);
						$location.path('events');
					});
				} else {
					/* Stop loading bar */
					$scope.fbLoadingSwap(false, e);
				}
			});
	};

	$scope.fbLoadingSwap = function(show, e) {
		var children = angular.element(e)[0].target.children;

		if(show) {
			angular.element(children[0]).removeClass('hide');
			angular.element(children[1]).addClass('hide');
		} else {
			angular.element(children[1]).removeClass('hide');
			angular.element(children[0]).addClass('hide');
		}
	};
});

app.controller('EventListController', function($scope, $ionicTabsDelegate, $ionicSlideBoxDelegate) {
	$scope.$on('$ionicView.enter', function(e) {

		/* Store the user's last visit to the app */
		window.localStorage['lastVisit'] = new Date();
	});

	$scope.tabSlideChange = function() {
		$ionicTabsDelegate.select($ionicSlideBoxDelegate.currentIndex());
	};

	$scope.tabSelect = function(index) {
		$ionicSlideBoxDelegate.slide(index);
	};
});

app.controller('EventsCtrl', function($scope, Events) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

	$scope.events = Events.all();

});

app.controller('EventDetailCtrl', function($scope, $stateParams) {
	$scope.eventName = "Event Name";
	$scope.eventInfo = "This is an event information. It will contain all the cool stuffs about the event.";
	$scope.goingPeopleIdList = [4,5,6,7,10,11,13,34,234,456,5676,2334,322,100,4989];

  var map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	  maxZoom: 18,
	  id: 'uta-mobi.mibf1hja',
	  accessToken: 'pk.eyJ1IjoidXRhLW1vYmkiLCJhIjoiNTU0N2FiOWM2NjEyMzUyNjc4NTg5M2I1MGM0YjM2N2IifQ.S4guINAIENtuxT6KVlId-g'
  }).addTo(map);
});
