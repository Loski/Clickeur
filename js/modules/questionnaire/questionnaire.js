'use strict';

var questionnaire = angular.module('questionnaire', ['ngStorage', 'userAuthModule', 'restangular'])
	.config(function(RestangularProvider){
		  RestangularProvider.setBaseUrl('http://127.0.0.1:8000/api/');
	})
    .controller('questionnairesController', ['$scope', function($scope){
        
    }])
	.controller('questionnairesFormController', ['$scope', function($scope){
		
	}]);


questionnaire.factory('questionRepository', ['Restangular', 'abstractRepository', function (restangular, abstractRepository) {
    this.route = "sessions";
    function getNew(){
    	return {
            name:'Réponse 1', val:''
        };
    }
    function getList(id_session) {
            return this.restangular.all(this.route).customGETLIST("questions");
    }
    function get(id_session, id_question) {
            return this.restangular.one(this.route, id_session).customGET("questions", id_question);
    }
    function update(updatedResource) {
            return updatedResource.put();
    }
    function create(newResource) {
            return this.restangular.all(this.route).post(newResource);
    }
    return new customerRepository();
}]);