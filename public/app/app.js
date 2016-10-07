'use strict';

angular.module('myApp', [
    'ui.router'
])

.config(['$stateProvider','$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "./app/components/home/home.html"
            })
            .state("login", {
                url: "/login",
                templateUrl: "./app/components/login/login.html",
                controller: 'LoginCtrl'
            })
            .state("skill", {
              url: "/skill/:type/:id",
              templateUrl: './app/components/skill-view/skill-view.html',
              controller: 'SkillViewCtrl'
            })
            .state("skills", {
              url: "/skills",
              templateUrl: './app/components/skill/skill.html',
              controller: 'SkillCtrl'
            })
            .state("create", {
              url: "/create",
              templateUrl: './app/components/create/create.html',
              controller: 'CreateCtrl'
            })
            .state("create-view", {
              url: "/create/:type",
              templateUrl: './app/components/create-view/create-view.html',
              controller: 'CreateViewCtrl'
            })
            .state("edit", {
              url: "/edit/:type/:id",
              templateUrl: './app/components/create-view/create-view.html',
              controller: 'CreateViewCtrl'
            })
            .state("logout", {
                url: "/logout",
                templateUrl: "./app/components/logout/logout.html",
                controller: 'LogoutCtrl'
            })
            .state("register", {
              url: "/register",
              templateUrl: './app/components/register/register.html',
              controller: 'RegisterCtrl'
            })
            .state("guide",{
              url:"/guide",
              templateUrl:'./app/components/guide/guide.html'
            });
}])

// Debugging ui-router
.run(['$rootScope', function($rootScope) {

}]);
