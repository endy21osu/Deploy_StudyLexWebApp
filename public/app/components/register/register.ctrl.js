
(function() {
  angular.module('myApp').controller('RegisterCtrl', RegisterCtrl)

  RegisterCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function RegisterCtrl ($scope, $http, $stateParams, $state, $rootScope) {
  	$scope.newAccount= {
  		username: "",
  		password:"",
      email:""
  	}
    $scope.registerAccount = function(){
      if($scope.newAccount.password === $scope.newAccount.confirmPassword) {
        var account = {
          username:   $scope.newAccount.username,
          email:      $scope.newAccount.email,
          password:   $scope.newAccount.password
        }
    		$http.post("/account/register", account)
    		  .success(function(data){
            $rootScope.state = true;
            $state.go('home');
    			})
    			.error(function(){
            console.log('error');
            $scope.error = true;
    			});
      } else {
        $scope.error = true;
      }
  	}
}

})();
