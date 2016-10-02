
(function() {
  angular.module('myApp').controller('LogoutCtrl', LogoutCtrl)

  LogoutCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function LogoutCtrl ($scope, $http, $stateParams, $state, $rootScope) {

	$scope.logoutApp = function(){
			console.log($scope.account);

			$http.post("/flashcards/logout", $scope.account)
				.success(function(data){
          $rootScope.state = false;
          $state.go('login');
					console.log("post success")

				})
				.error(function(){
          $state.go('home');
					console.log("Logout Failed");
				});
	}
  $scope.logoutApp();
}

})();
