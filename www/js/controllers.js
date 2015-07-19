var app = angular.module('starter.controllers', ['ngOpenFB']);

app.service('eventDetail', function () {
    var event = {};

    return {
        getEvent: function () {
            return event;
        },
        setEvent: function(value) {
            event = value;
        }
    };
});


app.controller('AccountCtrl', function($scope, $ionicModal, $timeout, $ionicActionSheet, $location, ngFB) {
	$scope.fbData = window.localStorage['basicFbInfo'];

	$scope.showClearAllData = function(show) {
		var hideSheet = $ionicActionSheet.show({
			destructiveText: 'Clear all',
			titleText: 'Clear all stored data',
			cancelText: 'Cancel',
			destructiveButtonClicked: function() {
				/* This should also log the user out */
				window.localStorage.clear();
				$location.path('intro');
				return true;
			}
		});

		$timeout(function() {
			hideSheet();
		}, 4000);
	};
});

app.controller('IntroController', function($scope, $ionicModal, $timeout, $location, ngFB, fbAccessToken) {
	$scope.fbLogin = function(e) {
		/* Hide fb and show spinner */
		$scope.fbLoadingSwap(true, e);

		ngFB.login({ scope: 'email,public_profile,user_birthday,rsvp_event,user_education_history' })
			.then(function(response) {
				if (response.status === 'connected') {
					var accessToken = response.authResponse.accessToken;
					fbAccessToken = accessToken;

					/* Get basic user details */
					ngFB.api({
						path: '/me',
						params: {fields: 'id,name,birthday,email,gender,education'}
					})
					.then(function(user) {
						$scope.fbLoadingSwap(false, e);

						/* Store basic FB info */
						window.localStorage['basicFbInfo'] = JSON.stringify(user);
						$location.path('events');
						console.log(user);

						var ParseUser = Parse.Object.extend('Users');
						var pfUser = new ParseUser();

						pfUser.set("name", user.name);
						pfUser.set("email", user.email);
						pfUser.set("fbToken", accessToken);
						pfUser.set("fbId", user.id);
						pfUser.set("birthdate", user.birthday);
						pfUser.set("gender", user.gender);

						pfUser.save(null, {
							success: function(pfUser) {
								console.log("Saved!!");
								console.log(pfUser);
							},
							error: function(pfUser, error) {
								console.log(error);
								console.log(pfUser);
							}
						});


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

	$scope.test = function() {
		console.log('test');
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

app.controller('FindEventCtrl', function($scope, ngFB, eventDetail, $location, fbAccessToken) {
  $scope.eventURL = "";
  $scope.findEvent = function(eventURL) {
        var eventId = {};
        $scope.errorMsg = "";
        if (eventURL.indexOf('events/') >= 0) {
        	eventId = eventURL.split('events/')[1].split('/')[0].split('?')[0]
        	var event = ngFB.api({path: '/' + eventId})
			    .then(function( res ) {
			        angular.extend(event, res);
			      },
			      function(error){
			        console.log(error);
			      });
			eventDetail.setEvent(event);
			$location.path('add-event');
        }
        else {
        	$scope.errorMsg = "Invalid Event URL. Please enter a valid event URL.";
        }
        
  }
});

app.controller('AddEventCtrl', function($scope, eventDetail) {
  $scope.event = eventDetail.getEvent();
  console.log(eventDetail.getEvent());
});

app.controller('PushCtrl', function($scope, $rootScope, $ionicUser, $ionicPush) {
  // Identifies a user with the Ionic User service
  $scope.identifyUser = function() {
    console.log('Ionic User: Identifying with Ionic User service');

    var user = $ionicUser.get();
    if(!user.user_id) {
      // generate a random ID.
      user.user_id = $ionicUser.generateGUID();
    };

    // Add some metadata // not really needed 
    angular.extend(user, {
      name: 'Nhat',
      bio: 'Asian'
    });

    // Identify your user with the Ionic User Service
    $ionicUser.identify(user).then(function(){
      $scope.identified = true;
      alert('Identified user ' + user.name + '\n ID ' + user.user_id);
    });
  };

  // Registers a device for push notifications and stores its token
  $scope.pushRegister = function() {
    console.log('Ionic Push: Registering user');

    // Register with the Ionic Push service.  All parameters are optional.
    $ionicPush.register({
      canShowAlert: true, //Can pushes show an alert on your screen?
      canSetBadge: true, //Can pushes update app icon badges?
      canPlaySound: true, //Can notifications play a sound?
      canRunActionsOnWake: true, //Can run actions outside the app,
      onNotification: function(notification) {
        // Handle new push notifications here
        // console.log(notification);
        return true;
      }
    });
  };

  // get device token for testing 
  $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
  alert("Successfully registered token " + data.token);
  console.log('Ionic Push: Got token ', data.token, data.platform);
  $scope.token = data.token;
});

});
