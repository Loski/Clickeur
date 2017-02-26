'use strict';
var app = angular.module('clicker', ['ngResource', 'ui.router', 'ngStorage', 'connexionUser', 'userAuthModule']);
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    // app routes
    $stateProvider
        .state('home', {
            url:'/login',
            templateUrl: 'templates/connexion.html',
            controller:'connexion'
        })
        .state('ue', {
            url:'/ue',
            templateUrl: 'templates/ue.html',
            controller: 'UeController'
        })
        .state('addquestionnaires', {
            url: '/questionnaires/{id}',
            templateUrl: 'templates/questionnaires.html',
            controller: 'questionnairesController'
        })
        .state('questionnaires', {
            url: '/questionnaires',
            templateUrl: 'templates/ajouterQuestionnaire.html',
            controller: 'questionnairesController'
        })
    
    // default route
    $urlRouterProvider.otherwise("/");
    //Interceptor of request and response
    $httpProvider.interceptors.push('APIInterceptor');
}).service('APIInterceptor', function($rootScope, $localStorage) {
        var service = this;
        service.request = function(config) {
            config.params = config.params || {};
            var access_token =$localStorage.token;
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            if (access_token) {
                config.params.token = access_token;
            }else{
               config.params.token = "";
            }
            return config;
        };
        service.responseError = function(response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
            //TO DO AJOUTER LISTENER
        }
            return response;
        };
        service.response = function(response){
            //TODO REFRESH TOKEN
            return response;
        }
    });

function run($rootScope, $location, $localStorage, $http) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if ($localStorage.token) {
          //  $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;
        }
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$localStorage.currentUser) {
            $location.path('/login');
        }
    });
}

app.run(run);


app.controller('navController',  ['$scope', 'userAuth', function($scope, userAuth){
    $scope.logout = function(){
        console.log("michou");
        userAuth.logout();
    }
    $scope.walid = "walid";
}]);