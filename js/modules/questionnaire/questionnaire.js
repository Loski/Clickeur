'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule', 'restangular'])
	.config(function(RestangularProvider){
		  RestangularProvider.setBaseUrl('http://127.0.0.1:8000/api/');
	})
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository' , function($scope, $stateParams, $questionRepository){
        $scope.questions = $questionRepository.getList($stateParams.id_session);
    }])
	.controller('questionnairesFormController', ['$scope', function($scope){
		console.log($scope);
	}]);

questionnaire.factory('questionRepository', ['Restangular', function (restangular) {
    console.log(restangular);
    return {
        getNew:function(){
        	return {
                name:'Réponse 1', val:''
            };
        },
        getList:function(id_session) {
            return restangular.one("sessions", id_session).getList("questions");
        },
        get:function(id_session, id_question) {
            return restangular.one("sessions", id_session).customGET("questions", id_question);
        },
        update : function(updatedResource) {
            return updatedResource.put();
        },
        create: function (newResource) {
            return restangular.all(this.route).post(newResource);
        }
    }
}]);