
(function() {
  angular.module('myApp').controller('CreateViewCtrl', CreateViewCtrl)

  CreateViewCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function CreateViewCtrl ($scope, $http, $stateParams, $state, $rootScope) {

  $scope.addItem = addItem;
  $scope.submitApp = submitApp;
  $scope.deleteCard = deleteCard;
  $scope.deleteStep = deleteStep;

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

  $scope.newLearningApp = {
    date: "",
    appName:"",
    appDescription: "",
    subject:"",
    cards: [
      angular.copy($scope.newCard)
    ]
  }

  var editState = !!$stateParams.id;
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

  function submitApp(form) {
    if (editState) {
      if ($scope.typeOfInstruction) {
        updateInstruction();
      } else if ($scope.typeOfLearning) {
        updateLearning();
      }
    } else {
      if ($scope.typeOfInstruction) {
        submitInstructionApp(form);
      } else if ($scope.typeOfLearning) {
        submitLearningApp(form);
      }
    }
  }

  function submitLearningApp(form) {
		var now = new Date().getTime();
		var thisApp = angular.copy($scope.newLearningApp);
    thisApp.date = now;

    var l = thisApp.cards.length;

    while(l--) {
      thisApp.cards[l].questionNumber = thisApp.cards.length - l;
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
        console.log(data);
        $state.go('skills');
      })
      .error(function(){
        console.log("Cannot save flashcard.")
      });
  };

	function updateLearning(){
    var now = new Date().getTime();
    var thisApp = angular.copy($scope.newLearningApp);
    thisApp.date = now;

    var l = thisApp.cards.length;

    while(l--) {
      thisApp.cards[l].questionNumber = thisApp.cards.length - l;
      thisApp.cards[l].hints = [];
      thisApp.cards[l].hints.push(thisApp.cards[l].hint);
      delete thisApp.cards[l].hint;
    }

		$http.put("/flashcards", thisApp)
			.success(function(data){
        $state.go('skills');
				console.log("post success")
			})
			.error(function(){
				console.log("Cannot save flashcard.");
			});
	}


  function updateInstruction(){
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

      $http.put("/instructions", thisApp)
        .success(function(data){
          $state.go('skills');
          console.log("post success")
        })
        .error(function(){
          console.log("Cannot save flashcard.");
        });
  }

  function getLearningApp(id) {
      $http.get("/flashcards/" + id)
        .success(function(data){
          console.log(data);
          $scope.newLearningApp = data[0];
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
          $scope.newInstructionApp = data[0];
          console.log("post success");
        })
        .error(function(){
          console.log("Cannot save flashcard.");
        });
  }

  function deleteCard(index) {
    $scope.newLearningApp.cards.splice(index, 1);
  }

  function deleteStep(index) {
    $scope.newInstructionApp.steps.splice(index, 1);
  }

  if(editState){
    switch($stateParams.type) {
      case 'instruction': {
        getInstructionApp($stateParams.id);
        break;
      }
      default: {
        getLearningApp($stateParams.id);
      }
    }
  }
}

})();
