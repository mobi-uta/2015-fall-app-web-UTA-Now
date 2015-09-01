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


	var currentUser = AccService.getCurrentUser();


	var ParseOrg = Parse.Object.extend('Organizations');
	$scope.pfOrg = new ParseOrg();

	$scope.register = function(){

		$scope.pfOrg.set('name',$scope.org.name);
		$scope.pfOrg.set('email',$scope.org.email[id]);

		var relation = $scope.pfOrg.relation('admin');
		relation.add(currentUser);

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


/*--------organization-manage.html-------------------------*/
app.controller('ManageOrganizationController', function($scope,sessionService,AccService) {

	var currentUser = AccService.getCurrentUser();
	if(currentUser === undefined)
		$scope.isLogin = false;
	else {
		$scope.isLogin = true;
	}

	$scope.orgs = [];

	//query all organizations
	var query = new Parse.Query("Organizations");
	query.equalTo("admin",currentUser);

	query.find({
		success: function(results){
			var orgs = [];

			for (i=0;i<results.length;i++)
			{
				results[i]['attributes']['objectId'] = results[i]['id'];
				orgs.push(results[i]['attributes'])
			}
			sessionService.set('adminOrg',orgs);
		}
	});

	$scope.orgs = sessionService.get('adminOrg');

});


/*--------------member-organization.html----------------- */
app.controller('MemberOrgController',function($scope,AccService){
		var currentUser = AccService.getCurrentUser();

		if (currentUser === undefined)
			$scope.isLogin = false;
		else {
			$scope.isLogin = true;
		}

});
