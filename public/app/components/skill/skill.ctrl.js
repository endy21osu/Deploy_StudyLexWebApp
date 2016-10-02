
(function() {
  angular.module('myApp').controller('SkillCtrl', SkillCtrl)


  SkillCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function SkillCtrl ($scope, $http, $stateParams, $state, $rootScope) {

	console.log("SkillCtrl");

	$scope.skill = {};
  $scope.chooseSkill = true;
	$scope.viewCards = false;
	$scope.viewInstruction = false;
  $scope.viewInstructionSkill = viewInstructionSkill;
  $scope.viewLearningSkill = viewLearningSkill;

  getInstructionList();
  getLearningList();

  $scope.typeState = !!$stateParams.type;

	$scope.model="";

  function viewInstructionSkill(_id) {
    $state.go('skill', { type: 'instruction', id: _id});
  }

  function viewLearningSkill(_id) {
    $state.go('skill', { type: 'learning', id: _id});
  }

  function getInstructionList() {
    $http.get("/instructions").
      success(function(data){
        console.log(data);
        $scope.skill.instructions = data;
      })
      .error(function(){
        console.log("Cannot pull instruction skills.");
      });
  }

  function getLearningList() {
    $http.get("/flashcards").
      success(function(data){
        console.log(data);
        $scope.skill.sets = data;
      })
      .error(function(){
        console.log("Cannot pull instruction skills.");
      });
  }

}

})();
