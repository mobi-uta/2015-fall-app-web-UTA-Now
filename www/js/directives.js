var app = angular.module('starter.directives',[])

app.directive("isLogin",function(){
	return{
			restrict: 'E',
			templateUrl: 'templates/directives/login-error-message.html'
	};
});
app.directive("event",function(){
	return{
		restrict: 'E',
		templateUrl: 'templates/directives/event-item.html'
	};

});
