/**
 * Created by Chat on 9/10/16.
 */
(function(){
    angular.module('myApp').controller('FooterCtrl', FooterCtrl)

    FooterCtrl.$inject = ['$scope','$http'];

    function FooterCtrl($scope, $http){

      $scope.placeholder = 'Email Address';
        $scope.emailList ={
            mailAddress:"",
            joined:""
        }

        $scope.submitEmail = function(form){
            var now = new Date().getTime();

            var contact = $scope.emailList;
            contact.joined = now;
            console.log(contact);

            $http.post("/account/savemail", contact)
              .success(function(data){
                $scope.emailList.mailAddress = undefined;
                $scope.placeholder = 'You have subscribed!';
              })
              .error(function(err){
                  console.log("Cannot save email");
              });
        }
    }

})();
