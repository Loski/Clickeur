'use strict';

var questionnaire = angular.module('questionnaire', ['ngStorage', 'userAuthModule', 'restangular'])
	.config(function(RestangularProvider){
		  RestangularProvider.setBaseUrl('http://127.0.0.1:8000/');
	})
	.controller('questionnairesFormController', ['$scope', function($scope){
		
	}]);


questionnaire.factory('questionRepository', ['Restangular', 'abstractRepository', function (restangular, abstractRepository) {

    function customerRepository() {
        abstractRepository.call(this, restangular, 'questions');
    }
    function getNew(){
    	return {
            name:'Réponse 1', val:''
        };
    }
    abstractRepository.extend(customerRepository);
    return new customerRepository();
}]);