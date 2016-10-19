
(function() {
  angular.module('myApp').controller('SkillViewCtrl', SkillViewCtrl)


  SkillViewCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function SkillViewCtrl ($scope, $http, $stateParams, $state, $rootScope) {

	console.log("SkillViewCtrl");

	$scope.cardSet = [];
  $scope.deleteLearning = deleteLearning;
  $scope.deleteInstruction = deleteInstruction;
  $scope.editInstruction = editInstruction;
  $scope.editLearning = editLearning;
  $scope.exportLearning = exportLearning;
  $scope.exportInstruction = exportInstruction;

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

	function deleteLearning(id) {

		$http.delete(
			"/flashcards/"+id
			).then(
			function success(){
        $state.go('skills');
			},
			function error(){
				console.log("Error. Cannot delete flashcard")

        $state.go('home');

			});
	};

	function editLearning(card_id){
    console.log(card_id);
    $state.go('edit', { type: 'learning', id: card_id});
	}

  function editInstruction(instruction_id){
    console.log(instruction_id);
    $state.go('edit', { type: 'instruction', id: instruction_id});
  }

  function deleteInstruction(id) {
    $http.delete(
      "/instructions/"+id
      ).then(
      function success(){
        $state.go('skills');
      },
      function error(){
        console.log("Error. Cannot delete flashcard")

        $state.go('home');

      });
  };

function exportLearning(id){
  $http.get("/flashcards/export/" + id)
    .then(
    function success(res){
      $scope.downloadUrlId = res.data.skillname;
      $scope.downloadUrl = res.data.url + res.data.skillname ;
    },
    function error(data){
      console.log("Cannot pull instruction skills.");
  });
}

function exportInstruction(id){
  $http.get("/instructions/export/" + id)
    .then(
    function success(res){
      $scope.downloadUrlId = res.data.skillname;
      $scope.downloadUrl = res.data.url + res.data.skillname ;
    },
    function error(data){
      console.log("Cannot pull instruction skills.");
  });
}

}})();
