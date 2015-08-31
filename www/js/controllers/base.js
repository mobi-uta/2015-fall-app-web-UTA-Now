var app = angular.module('controller.base', ['ngOpenFB']);

app.controller('SettingsController', function($scope, $ionicModal,sessionService, $timeout, $ionicActionSheet, $location, ngFB) {
	
	$scope.organizer = {
		checked: false
	};

	sessionService.set('checked',$scope.organizer.checked);

	$scope.organizerChanged = function() {
		

		sessionService.set('checked',$scope.organizer.checked);
	};
	
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


app.controller('MenuController', function($scope,sessionService) {
	$scope.checked = sessionService.get('checked');
});	

/*-------------Push notification --------------------*/
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
