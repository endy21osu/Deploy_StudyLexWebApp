
(function() {
  angular.module('myApp').controller('CardsCtrl', CardsCtrl)


  CardsCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function CardsCtrl ($scope, $http, $stateParams, $state, $rootScope) {

	console.log("CardsCtrl");

	$scope.cardSet = [];

	$scope.newpost= {
		time: "",
		subject:"",
		question:"",
		hint:"",
		answer:"",
		more:""
	}

	$scope.card="";

	$scope.getBlogPosts = function() {

		$http.get("/flashcards/cards").then(function(result){
			$scope.cardSet = result.data;
		}, function () {
      $scope.cardSet = [];
      $rootScope.state = false;
      $state.go('login');

    });
	};

	$scope.deletePost = function(id) {

		$http.delete(
			"/flashcards/delete/"+id
			).then(
			function success(){
				$scope.getBlogPosts()
			},
			function error(){
				console.log("Error. Cannot delete flashcard")

        $state.go('home');

			});
	};

	$scope.updatePost = function(){
			console.log('go to update posts');
	}
	$scope.getBlogPosts();

}

})();
