var app = angular.module('starter.controllers', []);

app.controller('DashCtrl', function($scope) {});

app.controller('EventsCtrl', function($scope, Events) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

	$scope.events = Events.all();
	// $scope.event = Events.get($stateParams.eventId);
	
	// scope.pageSelect = function (b) {
 //            switch (b) {
 //                case 1:
 //                    event.set(event.info);
 //                    break;
 //                case 2:
 //                    event.set(event.name);
 //                    break;
 //                default:
 //                    event.set('');
 //            }

 //        };

});
app.controller('EventDetailCtrl', function($scope) {
	// $scope.event = Events.get($stateParams.eventId);
	
	// scope.pageSelect = function (b) {
 //            switch (b) {
 //                case 1:
 //                    event.set(event.info);
 //                    break;
 //                case 2:
 //                    event.set(event.name);
 //                    break;
 //                default:
 //                    event.set('');
 //            }

 //        };
});



app.controller('AccountCtrl', function($scope) {
	$scope.settings = {
		enableFriends: true
	};

})

;
