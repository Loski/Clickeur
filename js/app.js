'use strict';
/**
 * @ngdoc function
 * @name myFunc
 * @description
 * This is a sample function
 * @param {number} x - any number, don't matter which
 */
var app = angular.module('clicker', ['ui.router', 'ui.bootstrap', 'ngStorage', 'ngAnimate', 'nvd3', 'connexionUser', 'userAuthModule', 'ueModule', 'sessionModule', 'Questionnaire', 'StatistiqueModule', 'Student']);
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    // app routes
    $stateProvider
        .state('app', {
            url:"",
            abstract:true,
            views:{
                "header": {
                    templateUrl: 'templates/header.html',
                    controller: 'navController',
                }
            },
        })
        .state('app.index', {
            url:'/home',
            views:{
                "main@": {
                    templateUrl: 'templates/index.html',
                    controller: 'questionNotClose',
                }
            },
            resolve: {
                ues: ['questionRepository', function (questionRepository) {
                    return questionRepository.getMyQuestionWithUeAndSessions();
                }]},
        })
        .state('app.login', {
            url:'/login',

            views:{
                "main@": {
                    templateUrl: 'templates/connexion.html',
                    controller:'connexion',
                }
            },
        })
        .state('app.ues', {
            url:'/ues',
            views:{
                "main@": {
                    templateUrl: 'templates/ues.html',
                    controller: 'ueController',
                }
            },
            resolve: {
                ues_list : function(ueService){
                    return ueService.query();
                }
            }
        })
        .state('app.ues.create', {
            url:'/create',
            views:{
                "main@": {
                    templateUrl: 'templates/ajouterUe.html',
                    controller: 'ueControllerForm',
                }
            },
            resolve: {
                item: ['ueService', function (ueService) {
                    return ueService.getNew();
                }],
                formType: function () { return "CREATE"; }
            },
        })
        .state('app.ues.edit', {
            url:'/{id_ue}/edit',
            templateUrl: 'templates/ajouterUe.html',
            controller: 'ueControllerForm',
            resolve: {
                item: ['ueService', '$stateParams', function (ueService, $stateParams) {
                    return ueService.get($stateParams.id_ue);
                }],
                formType: function () { return "EDIT"; }
            },
            views:{
                "main@": {
                    templateUrl: 'templates/ajouterUe.html',
                    controller: 'ueControllerForm',
                }
            },
        })
        .state('app.ues.students', {
            url:'/{id_ue}/students',
            resolve: {
                students: ['ueService', '$stateParams', function(ueService, $stateParams){
                    console.log($stateParams.id_ue);
                    return ueService.getStudent($stateParams.id_ue);
                }]
            },
            views:{
                "main@": {
                    templateUrl: 'templates/students.html',
                    controller: 'studentController',
                }
            },
        })
        .state('app.ues.sessions', {
            url:'/{id_ue}/sessions',
            views:{
                "main@": {
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
        .state('app.ues.sessions.edit', {
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
        .state('app.ues.sessions.create', {
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
        .state('app.ues.sessions.questions', {
            url: '/{id_session}/questions',
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
        .state('app.ues.sessions.questions.create', {
            url: '/create',
            views:{
                "main@":{
                    templateUrl: 'templates/ajouterQuestion.html',
                    controller: 'questionnairesFormController'
                },

            },
            resolve: {
                    question: ['questionRepository', function (questionRepository) {
                        return questionRepository.getNew();
                    }],
                    formType: function () { return "CREATE"; }
            },
        })
        .state('app.ues.sessions.questions.edit', {
            url: '/{id_question}/edit',
            views:{
                "main@":{
                    templateUrl: 'templates/ajouterQuestion.html',
                    controller: 'questionnairesFormController'
                }
            },
            resolve: {
                question: ['questionRepository', '$stateParams', function (questionRepository, $stateParams) {
                    return questionRepository.getPropositions($stateParams.id_question).then(function(response){
                        return response.data;
                    }, function(error){
                        console.log("Impossible de réceptionner la question");
                    });
                }],
                formType: function () { return "EDIT"; }
            },

        })
        .state('app.ues.sessions.questions.statistique', {
            url: '/{id_question}/statistique',
            views:{
                "main@":{
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
}).service('modalService', ['$uibModal',
    function ($uibModal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'templates/confirmation.html'
        };

        var modalOptions = {
            closeButtonText: 'Annuler',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
                customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $uibModalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $uibModalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            }

            return $uibModal.open(tempModalDefaults).result;
        };

    }]).service('APIInterceptor', function($rootScope, $localStorage) {
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