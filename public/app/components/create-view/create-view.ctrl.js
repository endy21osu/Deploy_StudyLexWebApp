
(function() {
  angular.module('myApp').controller('CreateViewCtrl', CreateViewCtrl)

  CreateViewCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function CreateViewCtrl ($scope, $http, $stateParams, $state, $rootScope) {

  $scope.addItem = addItem;
  $scope.submitApp = submitApp;
  $scope.deleteCard = deleteCard;
  $scope.deleteStep = deleteStep;
  $scope.deleteActivity = deleteActivity;

  $scope.newActivity = {
    name: '',
    taskCompleted: ''
  }

  $scope.newTasksApp = {
    date: "",
    appName:"",
    appDescription: "",
    subject:"",
    activities: [
      angular.copy($scope.newActivity)
    ]
  }

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
  $scope.typeOfTasks = $stateParams.type === 'tasks';
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
    } else if ($scope.typeOfTasks) {
      temp = angular.copy($scope.newActivity);
      $scope.newTasksApp.activities.push(temp);
    }
  }

  function submitApp(form) {
    if (editState) {
      if ($scope.typeOfInstruction) {
        updateInstruction();
      } else if ($scope.typeOfLearning) {
        updateLearning();
      } else if ($scope.typeOfTasks) {
        updateTasks();
      }
    } else {
      if ($scope.typeOfInstruction) {
        submitInstructionApp(form);
      } else if ($scope.typeOfLearning) {
        submitLearningApp(form);
      } else if ($scope.typeOfTasks) {
        submitTasksApp(form);
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
        $state.go('skills');
      })
      .error(function(){
        console.log("Cannot save flashcard.")
      });
  };

  function submitTasksApp(form) {
    var now = new Date().getTime();
    var thisApp = angular.copy($scope.newTasksApp);
    thisApp.date = now;
    thisApp.timeZone = new Date().getTimezoneOffset();

    $http.post("/tasks", thisApp)
      .success(function(data){
        $state.go('skills');
      })
      .error(function(){
        console.log("Cannot save tasks.")
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
			})
			.error(function(){
				console.log("Cannot save flashcard.");
			});
	}

  function updateTasks(){
      var now = new Date().getTime();
      var thisApp = angular.copy($scope.newTasksApp);
      thisApp.date = now;

      $http.put("/tasks", thisApp)
        .success(function(data){
          $state.go('skills');
        })
        .error(function(){
          console.log("Cannot save tasks.");
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
        })
        .error(function(){
          console.log("Cannot save flashcard.");
        });
  }

  function getLearningApp(id) {
      $http.get("/flashcards/" + id)
        .success(function(data){
          var thisApp = data[0];
          var l = thisApp.cards.length;

          while(l--) {
            thisApp.cards[l].hint =   thisApp.cards[l].hints[0];
            delete thisApp.cards[l].hints;
          }
          $scope.newLearningApp = thisApp;
        })
        .error(function(){
          console.log("Cannot save flashcard.");
        });
  }

  function getInstructionApp(id) {
      $http.get("/instructions/" + id)
        .success(function(data){
          var thisApp = data[0];
          var l = thisApp.steps.length;

          while(l--) {
              thisApp.steps[l].helplevelone = thisApp.steps[l].help[0];
              thisApp.steps[l].helpleveltwo = thisApp.steps[l].help[1];
              delete thisApp.steps[l].help;
          }

          $scope.newInstructionApp = thisApp;
        })
        .error(function(){
          console.log("Cannot save flashcard.");
        });
  }

  function getTasksApp (id) {
      $http.get("/tasks/" + id)
        .success(function(data){
          var thisApp = data[0];

          $scope.newTasksApp = thisApp;
        })
        .error(function(){
          console.log("Cannot pull tasks.");
        });
  }

  function deleteCard(index) {
    $scope.newLearningApp.cards.splice(index, 1);
  }

  function deleteStep(index) {
    $scope.newInstructionApp.steps.splice(index, 1);
  }

  function deleteActivity(index) {
    $scope.newTasksApp.activities.splice(index, 1);
  }

  if(editState){
    switch($stateParams.type) {
      case 'instruction': {
        getInstructionApp($stateParams.id);
        break
      }
      case 'tasks': {
        getTasksApp($stateParams.id);
        break;
      }
      default: {
        getLearningApp($stateParams.id);
      }
    }
  }
}

})();
