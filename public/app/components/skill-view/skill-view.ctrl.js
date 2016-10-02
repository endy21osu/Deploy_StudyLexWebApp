
(function() {
  angular.module('myApp').controller('SkillViewCtrl', SkillViewCtrl)


  SkillViewCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function SkillViewCtrl ($scope, $http, $stateParams, $state, $rootScope) {

	console.log("SkillViewCtrl");

	$scope.cardSet = [];

  $scope.typeOfInstruction = $stateParams.type === 'instruction';
  $scope.typeOfLearning = $stateParams.type === 'learning';

  if ($scope.typeOfInstruction) {
    getInstruction($stateParams.id);
  } else if ($scope.typeOfLearning) {
    getLearning($stateParams.id);
  }

	function getInstruction(id) {
    $http.get("/instructions/" + id).
      success(function(data){
        console.log(data);
        $scope.instructionApp = data[0];
      })
      .error(function(){
        console.log("Cannot pull instruction skills.");
      });
	};

  function getLearning(id) {
    $http.get("/flashcards/" + id)
      .success(function(data){
        console.log(data);
        $scope.learningApp = data[0];
      })
    .error(function(){
      $scope.learningApp = [];
      $rootScope.state = false;
      $state.go('login');
    });
  }

	$scope.deletePost = function(id) {

		$http.delete(
			"/flashcards/delete/"+id
			).then(
			function success(){
				$scope.getCards()
			},
			function error(){
				console.log("Error. Cannot delete flashcard")

        $state.go('home');

			});
	};

	$scope.editCard = function(card_id){
    console.log(card_id);
    $state.go('edit', { type: 'learning', id: card_id});
	}

  $scope.editStep = function(instruction_id){
    console.log(instruction_id);
    $state.go('edit', { type: 'instruction', id: instruction_id});
  }

  $scope.deleteStep = function(id) {

    $http.delete(
      "/instructions/delete/"+id
      ).then(
      function success(){
        $scope.getInstruction()
      },
      function error(){
        console.log("Error. Cannot delete flashcard")

        $state.go('home');

      });
  };
}

})();
