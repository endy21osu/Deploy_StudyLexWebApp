
(function() {
  angular.module('myApp').controller('CreateCtrl', CreateCtrl)

  CreateCtrl.$inject = ['$scope', '$http', '$stateParams', '$state', '$rootScope'];
  function CreateCtrl ($scope, $http, $stateParams, $state, $rootScope) {

  $scope.createInstructionSkill = createInstructionSkill;
  $scope.createLearningSkill = createLearningSkill;

  function createInstructionSkill() {
    $state.go('create-view', { type: 'instruction'});
  }

  function createLearningSkill() {
    $state.go('create-view', { type: 'learning'});
  }

  }

})();
