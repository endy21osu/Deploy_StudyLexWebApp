
(function() {
	angular.module('myApp').controller('LoginCtrl', LoginCtrl)

	LoginCtrl.$inject = ['$scope', '$http', '$state', '$rootScope'];
	function LoginCtrl ($scope, $http, $state, $rootScope) {


		$scope.account= {
			username: "",
			password:""
		}
		$scope.test = function(){
			console.log('test the login');
		}

		$scope.loginApp = function(){
			console.log($scope.account);

			$http.post("/flashcards/login", $scope.account)
				.success(function(data){

					console.log(data);
					$state.go('home');
					$rootScope.state = true;

					console.log("post success")

				})
				.error(function(){

					console.log("Login Failed");
				});
		}
	}

})();
