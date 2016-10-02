
(function() {
  angular.module('myApp').controller('CreateViewCtrl', CreateViewCtrl)

  CreateViewCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function CreateViewCtrl ($scope, $http, $stateParams, $state, $rootScope) {

  $scope.addItem = addItem;
  $scope.submitApp = submitApp;

  $scope.newStep = {
    stepnumber: 1,
    instruction: '',
    helplevelone: '',
    helpleveltwo: ''
  }

  $scope.newInstructionApp = {
    date: "",
    appName:"",
    appDescription: "",
    steps: [
      angular.copy($scope.newStep)
    ]
  }

  $scope.newCard = {
    question:"",
    hint:"",
    answer:"",
    more:""
  }
  // hint

  $scope.newLearningApp = {
    date: "",
    appName:"",
    appDescription: "",
    subject:"",
    cards: [
      angular.copy($scope.newCard)
    ]
  }

  $scope.editState = !!$stateParams.id;
  $scope.typeOfInstruction = $stateParams.type === 'instruction';
  $scope.typeOfLearning = $stateParams.type === 'learning';
	$scope.card="";

  function addItem() {
    var temp;
    if ($scope.typeOfInstruction) {
      temp = angular.copy($scope.newStep);
      temp.stepnumber = $scope.newInstructionApp.steps.length + 1;
      $scope.newInstructionApp.steps.push(temp);
    } else if ($scope.typeOfLearning) {
      temp = angular.copy($scope.newCard);
      $scope.newLearningApp.cards.push(temp);
    }
  }

	function deleteRemoveCard(id) {
		$http.delete(
			"/flashcards/delete/"+id
			).then(
			function success(){
				$scope.getBlogPosts()
			},
			function error(){
				console.log("Error. Cannot delete flashcard")
			});
	};

  function submitApp(form) {
    if ($scope.typeOfInstruction) {
      submitInstructionApp(form);
    } else if ($scope.typeOfLearning) {
      submitLearningApp(form);
    }
  }

  function submitLearningApp(form) {
		var now = new Date().getTime();
		var thisApp = angular.copy($scope.newLearningApp);
    thisApp.time = now;

    var l = thisApp.cards.length;

    while(l--) {
        thisApp.cards[l].hints = [];
        thisApp.cards[l].hints.push(thisApp.cards[l].hint);
        delete thisApp.cards[l].hint;
    }

		$http.post("/flashcards", thisApp)
			.success(function(data) {
        $state.go('skills');
			})
			.error(function(){
        console.log("Cannot save flashcard.")
			});
	};

  function submitInstructionApp(form) {
    var now = new Date().getTime();
    var thisApp = angular.copy($scope.newInstructionApp);
    thisApp.date = now;

    var l = thisApp.steps.length;

    while(l--) {
        thisApp.steps[l].help = [];
        thisApp.steps[l].help.push(thisApp.steps[l].helplevelone);
        delete thisApp.steps[l].helplevelone;
        thisApp.steps[l].help.push(angular.copy(thisApp.steps[l].helpleveltwo));
        delete thisApp.steps[l].helpleveltwo;
    }

    $http.post("/instructions", thisApp)
      .success(function(data){
        $state.go('skills');
      })
      .error(function(){
        console.log("Cannot save flashcard.")
      });
  };

	// $scope.updateCard = function(){
	// 		$http.post("/flashcards/update/", $scope.newCard)
	// 			.success(function(data){
  //         $state.go('skill', { type: 'learning'});
	// 				console.log("post success")
	// 			})
	// 			.error(function(){
	// 				console.log("Cannot save flashcard.");
	// 			});
	// }
  //
  // $scope.updateInstruction = function(){
  //     $http.post("/instructions/update/", $scope.newCard)
  //       .success(function(data){
  //         $state.go('skill', { type: 'instruction'});
  //         console.log("post success")
  //       })
  //       .error(function(){
  //         console.log("Cannot save flashcard.");
  //       });
  // }

  function getLearningApp(id) {
      $http.get("/flashcards/" + id)
        .success(function(data){
          console.log(data);
          $scope.newCard = data[0];
          console.log("post success");
        })
        .error(function(){
          console.log("Cannot save flashcard.");
        });
  }

  function getInstructionApp(id) {
      $http.get("/instructions/" + id)
        .success(function(data){
          console.log(data);
          $scope.newInstruction = data[0];
          console.log("post success");
        })
        .error(function(){
          console.log("Cannot save flashcard.");
        });
  }

  // if($scope.editState){
  //   switch($stateParams.type) {
  //     case 'instruction': {
  //       $scope.chooseCreationSkill = false;
  //       $scope.createInstruction = true;
  //       $scope.getInstruction($stateParams.id);
  //       break;
  //     }
  //     default: {
  //       $scope.chooseCreationSkill = false;
  //       $scope.createLearning = true;
  //       $scope.getCard($stateParams.id);
  //     }
  //   }
  //
  // }
}

})();
