var app = angular.module('controller.events', ['ngOpenFB', 'ionic']);

//----------------------------Event List load-------------------------------------//
app.controller('EventListController', function($scope,$timeout, $ionicTabsDelegate, $ionicSlideBoxDelegate,EventFeed) {
	$scope.$on('$ionicView.enter', function(e) {

		/* Store the user's last visit to the app */
		window.localStorage['lastVisit'] = new Date();
	});

	$scope.isAndroid = ionic.Platform.isAndroid();

	// Tab switch
	$scope.isSelect = function(index){
		if($scope.checkedTab === index)
			return true
		else
			return false
	};
	$scope.tabSlideChange = function() {
		$ionicTabsDelegate.select($scope.checkedTab);
	};
	$scope.tabSelect = function(index) {
		$ionicSlideBoxDelegate.slide(index);
		$scope.checkedTab = index;
		console.log($scope.checkedTab);
	};

	$scope.test = function() {
		console.log('test');
	};

	/* load data from parse */
	EventFeed.getAll().success(function(data){
    	$scope.items=data.results;
    });

	/* reload page */

	$scope.doRefresh = function(){
		$timeout(function(){
			 //simulate async response
			 EventFeed.getAll().success(function(data){
    			$scope.items=data.results;
  			  });
		      //Stop the ion-refresher from spinning
		      $scope.$broadcast('scroll.refreshComplete');
		      $scope.$apply()

		  },1000);
	};

});


/*-------------------- Event page view ---------------------*/
app.controller('EventDetailCtrl', function($scope, $stateParams,EventFeed) {
	var eventID = $stateParams.id;

	EventFeed.get(eventID).success(function(data){
		$scope.event = data;
		$scope.name = $scope.event.eventName;
	    $scope.info = $scope.event.description;
	});

	$scope.goingPeopleIdList = [4,5,6,7,10,11,13,34,234,456,5676,2334,322,100,4989];

	$scope.map = {
		defaults: {
			tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
			maxZoom: 18,
			zoomControlPosition: 'bottomleft'
		},
		center: {
			lat: 51,
			lng: 0,
			zoom: 15
		},
		markers: {
			eventMarker: {
				lat: 51,
				lng: 0,
				focus: true
			}
		},
		events: {
			map: {
				enable: ['context'],
				logic: 'emit'
			}
		},
		tiles: {
            url: 'http://api.tiles.mapbox.com/v4/{mapid}/{z}/{x}/{y}.png?access_token={apikey}',
            type: 'xyz',
            options: {
                apikey: 'pk.eyJ1IjoidXRhLW1vYmkiLCJhIjoiNTU0N2FiOWM2NjEyMzUyNjc4NTg5M2I1MGM0YjM2N2IifQ.S4guINAIENtuxT6KVlId-g',
                mapid: 'uta-mobi.mibf1hja'
            }
        },
	};

  /*var map = L.map('map').setView([51.505, -0.09], 13);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	  maxZoom: 18,
	  id: 'uta-mobi.mibf1hja',
	  accessToken: 'pk.eyJ1IjoidXRhLW1vYmkiLCJhIjoiNTU0N2FiOWM2NjEyMzUyNjc4NTg5M2I1MGM0YjM2N2IifQ.S4guINAIENtuxT6KVlId-g'
  }).addTo(map);*/
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



/*-------------------------Create event -------------------*/
app.controller('AddEventCtrl', function($scope, $filter,$ionicPopup,EventFeed) {
	$scope.event = {'formattedDate': ''};
  	$scope.create = function(){
		EventFeed.create({
	  		eventName:$scope.event.name,
	  		description:$scope.event.description,
	  		startDate: $scope.event.startDate.toISOString(),
	  		endDate:$scope.event.endDate.toISOString()

	  	}).success(function(data){
	  		console.log("Created event " + event.startDate);
	  	})
	 };


	 /* format date and time picker pop up */
    $scope.$watch('event.formattedDate', function(unformattedDate) {

      $scope.event.formattedDate = $filter('date')(unformattedDate, 'dd/MM/yyyy HH:mm');

  	});

	$scope.openDatePicker = function(dateType) {
      $scope.tmp = {};
      $scope.tmp.newDate = $scope.event.formattedDate;

      var eventWhen = $ionicPopup.show({
        template: '<datetimepicker ng-model="tmp.newDate"></datetimepicker>',
        title: "Select a date and time",
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Select</b>',
          type: 'button-stable',
          onTap: function(e) {
          	if(dateType == "startDate"){
          		$scope.event.startDate = $scope.tmp.newDate;
          	}
            else if (dateType == "endDate"){
            	$scope.event.endDate = $scope.tmp.newDate;
            }
            else{
            	$scope.formattedDate = $scope.tmp.newDate;
            	}

          }
        }]
      });

};

});
