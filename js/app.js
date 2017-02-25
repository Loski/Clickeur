'use strict';
var app = angular.module('clicker', ['ngResource', 'ui.router', 'ngStorage', 'connexionUser']);
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
})
.service('APIInterceptor', function($rootScope, $localStorage) {
        var service = this;
        service.request = function(config) {
            var access_token =$localStorage.token;
            if (access_token) {
                config.headers.authorization = access_token;
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

function run($rootScope, $location, $localStorage) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.token;
        }

        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$localStorage.currentUser) {
            $location.path('/login');
        }
    });
}
app.run(run);
/** Module Connexion **/
var connexionModule = angular.module('connexionUser', ['ui.router', 'ngStorage'])
    .factory('connexionModule', ['$localStorage', '$http', function($localStorage, $http){
        return{
            'login' : function(usernameUser, passwordUser){
                $http.defaults.useXDomain = true;
                $http({
                	method: 'POST',
                	url:'http://127.0.0.1:8000/api/auth',
                	headers : {
           				'Content-Type': 'application/x-www-form-urlencoded'
        			},
        			data: "username="+usernameUser+"&password="+passwordUser
 		   		}).then(function(response){
                   // saveToken(response.token);
                })
            },
            'logout' : function(){
              //  $http.get('http://127.0.0.1:8000/api/auth', {token: $localStoragetoken});
                $localStorage = {};
            },
            'saveToken' : function(token){
                $localStorage.token = token;
            },
            'errorLogin' : function(response){
                console.log('michel');
            },
            'isIdentified' : function(){
                var token = this.getToken();
                if(token) {
                    var params = this.parseJwt(token);
                    return Math.round(new Date().getTime() / 1000) <= params.exp;
                } else {
                    return false;
                }
            },
            'logout' : function(){
                userService.clearCookies();
            },
            'getUser': function(){
                $http.get('http://127.0.0.1:8000/api/user');
            },
            getToken: function(){
                return $localStorage.token;
            },
            parseJwt : function(token) {
              var base64Url = token.split('.')[1];
              var base64 = base64Url.replace('-', '+').replace('_', '/');
              return JSON.parse($window.atob(base64));
            }
        }
    }])
    .controller('connexion', ['$scope', 'connexionModule', function($scope, connexionModule){
    $scope.password ='';
    $scope.username = '';
    $scope.login = function(){
        connexionModule.login($scope.username, $scope.password);
    }
    }]);