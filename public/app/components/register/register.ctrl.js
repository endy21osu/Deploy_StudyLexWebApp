
(function() {
  angular.module('myApp').controller('RegisterCtrl', RegisterCtrl)

  RegisterCtrl.$inject = ['$scope', '$http', '$stateParams', '$state'];
  function RegisterCtrl ($scope, $http, $stateParams, $state) {
    console.log("RegisterCtrl");

  	$scope.newAccount= {
  		username: "",
  		password:""
  	}
    $scope.registerAccount = function(){
  		console.log('this is a test');
  		console.log($scope.newAccount);
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
    			  console.log("post success");
    			})
    			.error(function(){
    				console.log("Registration Failed.");

    			});
      }
  	}
}

})();
