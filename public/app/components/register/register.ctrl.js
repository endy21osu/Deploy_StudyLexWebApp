
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

  		$http.post("/account/register", $scope.newAccount)
  		  .success(function(data){

          $state.go(data.redirect);

  			  console.log("post success");

  			})
  			.error(function(){
  				console.log("Registration Failed.");

  			});
  	}
}

})();
