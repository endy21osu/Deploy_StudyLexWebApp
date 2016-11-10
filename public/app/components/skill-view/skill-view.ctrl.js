
(function() {
  angular.module('myApp').controller('SkillViewCtrl', SkillViewCtrl)


  SkillViewCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function SkillViewCtrl ($scope, $http, $stateParams, $state, $rootScope) {

	console.log("SkillViewCtrl");

	$scope.cardSet = [];
  $scope.deleteLearning = deleteLearning;
  $scope.deleteInstruction = deleteInstruction;
  $scope.deleteTasks = deleteTasks;
  $scope.editTasks = editTasks;
  $scope.editInstruction = editInstruction;
  $scope.editLearning = editLearning;
  $scope.exportTasks = exportTasks;
  $scope.exportLearning = exportLearning;
  $scope.exportInstruction = exportInstruction;

  $scope.typeOfInstruction = $stateParams.type === 'instruction';
  $scope.typeOfLearning = $stateParams.type === 'learning';
  $scope.typeOfTasks = $stateParams.type === 'tasks';

  if ($scope.typeOfInstruction) {
    getInstruction($stateParams.id);
  } else if ($scope.typeOfLearning) {
    getLearning($stateParams.id);
  } else if ($scope.typeOfTasks) {
    getTasks($stateParams.id);
  }

  function getTasks(id) {
    $http.get("/tasks/" + id).
      success(function(data){
        console.log(data);
        $scope.tasksApp = data[0];
      })
      .error(function(){
        console.log("Cannot pull tasks skills.");
      });
	};

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

  function editTasks(tasks_id){
    console.log(tasks_id);
    $state.go('edit', { type: 'tasks', id: tasks_id});
	}

	function editLearning(card_id){
    console.log(card_id);
    $state.go('edit', { type: 'learning', id: card_id});
	}

  function editInstruction(instruction_id){
    console.log(instruction_id);
    $state.go('edit', { type: 'instruction', id: instruction_id});
  }

  function deleteTasks(id) {
    $http.delete(
      "/tasks/"+id
      ).then(
      function success(){
        $state.go('skills');
      },
      function error(){
        console.log("Error. Cannot delete tasks")

        $state.go('home');

      });
  };

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

  function exportTasks(id){
    $rootScope.serverCall = true;
    $http.get("/tasks/export/" + id)
      .then(
      function success(res){
        $rootScope.serverCall = false;
        $scope.downloadUrlId = res.data.skillname;
        $scope.downloadUrl = res.data.url + res.data.skillname ;
      },
      function error(data){
        $rootScope.serverCall = false;
        console.log("Cannot pull tasks skills.");
    });
  }

function exportLearning(id){
  $rootScope.serverCall = true;
  $http.get("/flashcards/export/" + id)
    .then(
    function success(res){
      $rootScope.serverCall = false;
      $scope.downloadUrlId = res.data.skillname;
      $scope.downloadUrl = res.data.url + res.data.skillname ;
    },
    function error(data){
      $rootScope.serverCall = false;
      console.log("Cannot pull instruction skills.");
  });
}

function exportInstruction(id){
  $rootScope.serverCall = true;
  $http.get("/instructions/export/" + id)
    .then(
    function success(res){
      $rootScope.serverCall = false;
      $scope.downloadUrlId = res.data.skillname;
      $scope.downloadUrl = res.data.url + res.data.skillname ;
    },
    function error(data){
      $rootScope.serverCall = false;
      console.log("Cannot pull instruction skills.");
  });
}

}})();
