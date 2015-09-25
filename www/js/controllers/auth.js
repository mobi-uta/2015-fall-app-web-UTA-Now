var app = angular.module('controller.auth', ['ngOpenFB']);

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
							$location.path('main.events-list');

							/* Generate parse user and check if it's already registered */
							var pfUser = AccService.newUser(user.name,user.email,accessToken,user.id,user.birthday,user.gender);
							AccService.checkUser(pfUser, user.id);
							AccService.setCurrentUser(pfUser);

							ngFB.api({
									path: '/me/accounts',
									params: {fields: 'picture, name, about, id,emails'}
								})
								.then(function(user) {
									sessionService.set('fbOrganizations',user.data);
								});

							
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
