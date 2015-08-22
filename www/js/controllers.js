var app = angular.module('starter.controllers', ['ngOpenFB']);

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


/* -------------------------Login page --------------------------------*/
app.controller('IntroController', function($scope, $ionicModal, $timeout, $location, sessionService, ngFB, fbAccessToken,AccService,EventFeed) {
	$scope.fbLogin = function(e) {
		/* Hide fb and show spinner */
		$scope.fbLoadingSwap(true, e);

		ngFB.login({ scope: 'email,public_profile,user_birthday,rsvp_event,user_education_history,manage_pages' })
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
							sessionService.set('fbInfo',user);
							$location.path('events');

							/* Generate parse user and check if it's already registered */
							var pfUser = AccService.newUser(user.name,user.email,accessToken,user.id,user.birthday,user.gender);
							AccService.checkUser(pfUser, user.id);
							AccService.setCurrentUser(pfUser);
							console.log(typeof(AccService.getCurrentUser().get('adminOfOrg')));

						});
					} 
					else {
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

//----------------------------Event List load-------------------------------------//
app.controller('EventListController', function($scope,$timeout, $ionicTabsDelegate, $ionicSlideBoxDelegate,EventFeed) {
	$scope.$on('$ionicView.enter', function(e) {

		/* Store the user's last visit to the app */
		window.localStorage['lastVisit'] = new Date();
	});

	$scope.itemClicked = function(){
		console.log($scope.items);
	};

	$scope.tabSlideChange = function() {
		$ionicTabsDelegate.select($ionicSlideBoxDelegate.currentIndex());
	};

	$scope.tabSelect = function(index) {
		$ionicSlideBoxDelegate.slide(index);
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



app.controller('ManageOrganizationController', function($scope,AccService) {
	
	$scope.pfUser = AccService.getCurrentUser();
	$scope.orgs = [];
	
	//query all organizations 
	var query = new Parse.Query("Organizations");
	query.equalTo("admin",$scope.pfUser);

	query.find({
		success: function(results){
			angular.forEach(results,function(value){
				$scope.orgs.push(value);
				console.log('succeed: '+ value.get('name'));
			});
		},
		error: function(error){
			console.log("failed!");
		}
	});
	
	
});

app.controller('RegisterOrganizationController', function($scope, $http,sessionService, fbAccessToken, ngFB) {
	$scope.orgs = [];

	ngFB.api({
		path: '/me/accounts',
		params: {fields: 'picture, name, about, id,emails'}
	})
	.then(function(user) {
		sessionService.set('fbOrgs',user.data);

		
	});

	angular.forEach(sessionService.get('fbOrgs'), function(value) {
			$scope.orgs.push(value);
		});

	//add index to each result 
	for(var i = 0; i< $scope.orgs.length;i++){
		$scope.orgs[i].index = i;
	};

	$scope.addOrg = function(){

	};
	
	$scope.createCustomOrg = function(){};
});

/*-----------------------Create an organization----------------------*/
app.controller('SignUpOrgController',function($scope,$stateParams,$http,sessionService,AccService,OrgService){
	var id = $stateParams.id;
	$scope.org = {};
	
	//check if its a custom page or a page from facebook
	if(id != '')	
	{
		var target = sessionService.get('fbOrgs')[id]; // retrieve from local storage
		$scope.org.name = target.name;
		$scope.org.email = target.emails;
	
	}
	else
		console.log('no page info');
	

	$scope.pfUser = AccService.getCurrentUser();


	var ParseOrg = Parse.Object.extend('Organizations');
	$scope.pfOrg = new ParseOrg();

	$scope.register = function(){

		$scope.pfOrg.set('name',$scope.org.name);
		$scope.pfOrg.set('email',$scope.org.email[id]);

		var relation = $scope.pfOrg.relation('admin');
		relation.add($scope.pfUser);

		$scope.pfOrg.save(null, {

                    success: function(pfOrg) {
                      console.log("New organization saved");
                 
                    },
                    error: function(pfOrg, error) {
                    }
                  });

	 };

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
