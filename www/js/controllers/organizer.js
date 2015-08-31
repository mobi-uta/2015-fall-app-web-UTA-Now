var app = angular.module('controller.organizer', ['ngOpenFB']);

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