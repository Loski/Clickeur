'use strict';
var app = angular.module('clicker', ['ui.router', 'ngStorage', 'connexionUser', 'userAuthModule', 'ueModule', 'sessionModule', 'Questionnaire']);
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    // app routes
    $stateProvider
        .state('index', {
            url:'/',
            templateUrl: 'templates/connexion.html',
            controller:'connexion'
        })
        .state('login', {
            url:'/login',
            templateUrl: 'templates/connexion.html',
            controller:'connexion'
        })
        .state('ues', {
            url:'/ues',
            templateUrl: 'templates/ues.html',
            controller: 'ueController'
        })
        .state('ues/create', {
            url:'/ues/create',
            templateUrl: 'templates/ajouterUe.html',
            controller: 'ueController'
        })
        .state('ues/sessions', {
            url:'/ues/{id_ue}/sessions',
            templateUrl: 'templates/sessions.html',
            controller: 'sessionController'
        })
        .state('ues/sessions/create', {
            url:'/ues/{id_ue}/sessions/create',
            templateUrl: 'templates/ajouterSession.html',
            controller: 'sessionController'
        })
        .state('ues/sessions.questions', {
            url: '/{id_session}/question',
            views: {
              'questions': {
                templateUrl: 'templates/questionsListe.html',
                controller: 'questionnairesController'
                },
                'affichage1':{
                    template: '<span ui-view="affichage"></span>',
                    controller: 'questionnairesController',
                }
        }
        })
        .state('ues/sessions.questions.create', {
            url: '/create',
            views:{
                'affichage':{
                    templateUrl: 'templates/ajouterQuestion.html',
                    controller: 'questionnairesFormController'
                },
            }
        })
        /*.state('ue/:ueID/session/:sessionID/question/:idQuestionnaire/edit', {
            url: '/questionnaires',
            templateUrl: 'templates/ajouterQuestion.html',
            controller: 'questionnairesController',
            resolve: {
                item: ['$stateParams', 'questionRepository', function ($stateParams, questionRepository) {
                return questionRepository.get($stateParams.idQuestionnaire);
            }],
                formType: function () { return Enums.FormType.EDIT; },
            },
        })
        .state('question/create', {
            url: 'question/create',
            views: {
              'questions@': { 
                templateUrl: 'templates/ajouterQuestion.html',
                controller: 'questionnairesController', },
            },
            
        })*/
    // default route
  //  $urlRouterProvider.otherwise("/");
    //Interceptor of request and response
    $httpProvider.interceptors.push('APIInterceptor');
}).service('APIInterceptor', function($rootScope, $localStorage) {
        var service = this;
        service.request = function(config) {
            config.params = config.params || {};
            var access_token = $localStorage.token;
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

function run($rootScope, $location, $localStorage, $http, userAuth) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$localStorage.token || !userAuth.isIdentified()) {
            $location.path('/login');
        }
    });

    $rootScope.$on('$stateChangeStart',
        function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && !$localStorage.token || !userAuth.isIdentified()) {
            $location.path('/login');
        }
    });

    $rootScope.$on('$stateNotFound',
function(event, unfoundState, fromState, fromParams){
    console.log(unfoundState.to); // "lazy.state"
    console.log(unfoundState.toParams); // {a:1, b:2}
    console.log(unfoundState.options); // {inherit:false} + default options
})
}

app.run(run);


app.controller('navController',  ['$scope', 'userAuth','$localStorage', function($scope, userAuth, $localStorage){
    $scope.logout = function(){
        userAuth.logout();
    }

    console.log(userAuth.parseJwt($localStorage.token));
}]);