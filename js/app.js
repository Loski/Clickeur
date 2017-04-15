'use strict';
var app = angular.module('clicker', ['ui.router', 'ngStorage', 'ngAnimate', 'connexionUser', 'userAuthModule', 'ueModule', 'sessionModule', 'Questionnaire', 'StatistiqueModule']);
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
            controller: 'ueController',
            resolve: {
                ues_list : function(ueService){
                    return ueService.query();
                }
            }
        })
        .state('ues/create', {
            url:'/ues/create',
            templateUrl: 'templates/ajouterUe.html',
            controller: 'ueControllerForm',
            resolve: {
                item: ['ueService', function (ueService) {
                    return ueService.getNew();
                }],
                formType: function () { return "CREATE"; }
            },
        })
        .state('ues/edit', {
            url:'/ues/edit/{id_ue}',
            templateUrl: 'templates/ajouterUe.html',
            controller: 'ueControllerForm',
            resolve: {
                item: ['ueService', '$stateParams', function (ueService, $stateParams) {
                    return ueService.get($stateParams.id_ue);
                }],
                formType: function () { return "EDIT"; }
            },
        })
        .state('ues.sessions', {
            url:'/{id_ue}/sessions',
            views:{
                "@": {
                    templateUrl: 'templates/sessions.html',
                    controller: 'sessionController',
                }
            },
            resolve:{
                sessionsList : ['sessionService', '$stateParams', function (sessionService, $stateParams) {
                    return sessionService.query($stateParams.id_ue);
                }],
            }
        })
        .state('ues.sessions.edit', {
            url:'/{id_session}/edit',
            views: {
                "questions":{
                    templateUrl: 'templates/ajouterSession.html',
                    controller: 'sessionFormController',
                }
            },
            resolve: {
                formType: function () { return "EDIT"; }
            },
        })
        .state('ues.sessions.create', {
            url:'/create',
            views: {
                "questions":{
                    templateUrl: 'templates/ajouterSession.html',
                    controller: 'sessionFormController'
                }
            },
            resolve: {
                formType: function () { return "CREATE"; }
            }
        })
        .state('ues.sessions.questions', {
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
            },
            resolve:{
                questionsList : ['questionRepository', '$stateParams', function (questionRepository, $stateParams) {
                    return questionRepository.getList($stateParams.id_session);
                }]
            }
        })
        .state('ues.sessions.questions.create', {
            url: '/create',
            views:{
                "@":{
                    templateUrl: 'templates/ajouterQuestion.html',
                    controller: 'questionnairesFormController'
                },

            },
            resolve: {
                    propositions: ['questionRepository', function (questionRepository) {
                        return questionRepository.getNew();
                    }],
                    formType: function () { return "CREATE"; }
            },
        })
        .state('ues.sessions.questions.edit', {
            url: '/{id_question}/edit',
            views:{
                "@":{
                    templateUrl: 'templates/ajouterQuestion.html',
                    controller: 'questionnairesFormController'
                }
            },
            resolve: {
                propositions: ['questionRepository', '$stateParams', function (questionRepository, $stateParams) {
                    return questionRepository.getPropositions($stateParams.id_question);
                }],
                formType: function () { return "EDIT"; }
            },

        })
        .state('ues.sessions.questions.stat', {
            url: '/{id_question}/stat',
            views:{
                "@":{
                    templateUrl: 'templates/stats.html',
                    controller: 'statsController'
                },
            },
            resolve: {
                questionWithStatistique: ['statistiqueRepository', '$stateParams', function (statistiqueRepository, $stateParams) {
                    return statistiqueRepository.getQuestionWithStatistique($stateParams.id_question);
                }],
            },
        })
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
            if (access_token !== undefined) {
                config.params.token = access_token;
            }else{
               config.params.token = "";
            }
            return config;
        };
       /* service.responseError = function(response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');
            //TO DO AJOUTER LISTENER
        }else if(response.status == 405){
            //console.log(response);
        }
            return response;
        };
        service.response = function(response){
            //TODO REFRESH TOKEN
            return response;
        }*/
    });

function run($rootScope, $location, $localStorage, $http, userAuth) {
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && (!$localStorage.token || !userAuth.isIdentified())) {
            $location.path('/login');
        }
    });

    $rootScope.$on('$stateChangeStart',
        function (event, next, current) {
        // redirect to login page if not logged in
        if ($location.path() !== '/login' && (!$localStorage.token || !userAuth.isIdentified())) {
            $location.path('/login');
            console.log("changement needed");
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
    $scope.auth = userAuth.isIdentified();
    console.log("is Authentified =" + $scope.auth);
}]);