var app = angular.module('controller.organizer', ['ngOpenFB']);

/**
* Register an organization 
* Set the user to be the admin of that organization
*/
app.controller('RegisterOrgController',
	function($scope,$stateParams,$location,$http,sessionService,AccService,OrgService){
	
	var objectId = $stateParams.id;
	console.log(objectId);
	var fbOrganizations = sessionService.get('fbOrganizations');
	// console.log(fbOrganizations);

	// look for organization with that selected objectId
	for(var i = 0; i < fbOrganizations.length; i++){
		if (fbOrganizations[i].id == objectId){
			$scope.org = fbOrganizations[i];
			console.log($scope.org);
		}
		else{
			console.log("no org received!");
		}
	}
	

	//Register an organization and set current user to be its admin
	var currentUser = AccService.getCurrentUser();
	$scope.register = function(){
		var Organizations = Parse.Object.extend('Organizations');
		var Organization = new Organizations();

		Organization.set('name',$scope.org.name);
		Organization.set('email',$scope.org.emails[0]);

		var relation = Organization.relation('Admins');
		relation.add(currentUser);

		Organization.save(null, {

                    success: function(object) {
                      console.log("New organization saved");
                      sessionService.destroy("notCreatedOrgs");
                      sessionService.destroy("createdOrgs");


                    },
                    error: function(error) {
                    	alert(error);
                    }
                  });
		$location.path('/main/manage');

	 };

});

// app.controller('RegisterOrganizationController', function($scope, $http,sessionService, fbAccessToken, ngFB) {
// 	$scope.orgs = [];

// 	ngFB.api({
// 		path: '/me/accounts',
// 		params: {fields: 'picture, name, about, id,emails'}
// 	})
// 	.then(function(user) {
// 		sessionService.set('fbOrganizations',user.data);
// 	});

// 	angular.forEach(sessionService.get('fbOrganizations'), function(value) {
// 			$scope.orgs.push(value);
// 		});

// 	//add index to each result
// 	for(var i = 0; i< $scope.orgs.length;i++){
// 		$scope.orgs[i].index = i;
// 	};
// });


//This controls the content view of an admin user
app.controller('adminOrgViewController', 
	function($scope,sessionService,AccService) {

	var currentUser = AccService.getCurrentUser();
	if(currentUser === undefined)
		$scope.isLogin = false;
	else {
		$scope.isLogin = true;
	}


	//this querry all organizations whose admin is current user
	// var query = new Parse.Query("Organizations");
	// query.equalTo("Admins",currentUser);

	// query.find({
	// 	success: function(results){
	// 		var orgs = [];

	// 		for (i=0;i<results.length;i++)
	// 		{	
	// 			console.log(results);
	// 			results[i]['attributes']['objectId'] = results[i]['id'];
	// 			orgs.push(results[i]['attributes'])
	// 		}
	// 		sessionService.set('adminOrg',orgs);
	// 	},
	// 	error: function(error){
	// 		console.log(error);
	// 	}
	// });


	// this checks whether organizations from fb already existed
	$scope.createdOrgs = [];
	$scope.notCreatedOrgs = [];
	 var fbOrgs = sessionService.get('fbOrganizations');
	 var organizations = Parse.Object.extend("Organizations")

	angular.forEach(fbOrgs,function(org){
		var fbQuery = new Parse.Query(organizations);
		fbQuery.equalTo("name",org.name)

		fbQuery.first().then(function(result){
			if(result){
				console.log("This organization was already created!");
				sessionService.set("isCreated",true);

			}
			else{
				sessionService.set("isCreated",false);
			}
			});
		if(sessionService.get("isCreated")){
			$scope.createdOrgs.push(org);

		}
		else
			$scope.notCreatedOrgs.push(org);
	});
	sessionService.destroy("isCreated");
	console.log($scope.notCreatedOrgs);
	//filter viewing list of created and not yet created organizations
	if ($scope.createdOrgs.length > 0){
		$scope.isCreatedEmpty = true;
	}
	else
		$scope.isCreatedEmpty = false;

	if ($scope.notCreatedOrgs.length > 0){
		$scope.isNotCreatedEmpty = true;
	}
	else
		$scope.isNotCreatedEmpty = false;
	if (!$scope.isNotCreatedEmpty && !$scope.isCreatedEmpty)
		$scope.isEmpty = true;
	else
		$scope.isEmpty = false;

});


//Organizations view for regular member
app.controller('MemberOrgController',function($scope,AccService){
		var currentUser = AccService.getCurrentUser();

		if (currentUser === undefined)
			$scope.isLogin = false;
		else {
			$scope.isLogin = true;
		}

});

//Detail view about an organization
app.controller('orgDetailCtrl', function($scope,sessionService,$stateParams){
	var id = $stateParams.id;

	
	
	angular.forEach(sessionService.get('adminOrg'),function(org){
		if(org['objectId'] == id)
			$scope.org = org;
	});


});
