'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule', 'restangular'])
	.config(function(RestangularProvider){
        RestangularProvider.setBaseUrl('http://127.0.0.1:8000/api/');
        
	})
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository', '$http' , function($scope, $stateParams, $questionRepository, $http){
        
        $scope.data = [];
        $scope.dataRep = [];
        $questionRepository.getList($scope,$stateParams.id_session);
        $scope.id_session = $stateParams.id_session;
        $scope.id_ue = $stateParams.id_ue;
        $scope.$watch('data', function(newVal) {
            $scope.data = newVal;
            if(!angular.isUndefined($scope.data.session))
                $scope.questions = $scope.data.session.questions;
        }); 

        $scope.$watch('dataRep', function(newVal) {
            $scope.dataRep = newVal;
            if(!angular.isUndefined($scope.dataRep.question))
                $scope.propositions = $scope.dataRep.question.propositions;
        });

    }])
	.controller('questionnairesFormController', ['$scope', function($scope){
    	$scope.response = [{id: 'response1'}, {id: 'choice2'}];
        $scope.addNewResponse = function() {
            var newItemNo = $scope.choices.length+1;
            $scope.response.push({'id':'choice'+newItemNo});
        };

        $scope.removeResponse = function() {
            var lastItem = $scope.choices.length-1;
            $scope.choices.splice(lastItem);
        };
	}]);

questionnaire.factory('questionRepository', ['Restangular', '$http', function (restangular, $http) {
    console.log(restangular);
    return {
        getNew:function(){
        	return {
                name:'Réponse 1', val:''
            };
        },
        getList:function($scope,id_session) {
                var that = this;
                $http({
                    method: 'GET',
                    url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                }).then(function(response)
                {
                    $scope.data = response.data;

                    console.log($scope.data);

                    $http({
                        method: 'GET',
                        url:'http://127.0.0.1:8000/api/questions/'+response.data.session.questions[0].id+"/propositions/"
                    }).then(function(responseRep)
                    {
                        $scope.dataRep = responseRep.data;
                    });

                });
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