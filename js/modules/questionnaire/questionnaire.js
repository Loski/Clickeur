'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule'])
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository', '$http' , function($scope, $stateParams, questionRepository, $http){
        
        $scope.data = [];
        $scope.dataRep = [];
        questionRepository.getList($scope,$stateParams.id_session);
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

        $scope.lancer = function(id){
            questionRepository.switchState(id);
        }

    }])
	.controller('questionnairesFormController', ['$scope', '$stateParams', 'questionRepository', function($scope, $stateParams, questionRepository){

    	$scope.responses = [{id: 'response1'}, {id: 'response2'}];
        $scope.question = "";
        $scope.id_session = $stateParams.id_session;
        $scope.title ="";
        $scope.addNewResponse = function() {
            var newItemNo = $scope.responses.length+1;
            $scope.responses.push({'id':'choice'+newItemNo});
        };

        $scope.removeResponse = function() {
            var lastItem = $scope.responses.length-1;
            $scope.responses.splice(lastItem);
        };

        $scope.envoyer = function(){
            questionRepository.create($scope.id_session, $scope.title);
        };
	}]);

questionnaire.factory('questionRepository', ['$http', function ($http) {
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
            return ;
        },
        update : function(updatedResource) {
            return;
        },
        create: function (id_session, $title) {
            var that = this;
            $http({
                method: 'POST',
                url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/",
                data: "title="+$title+"&number=5"+"&opened=0",
            }).then(function(response)
            {
                return response.data;
            });
        },
        switchState: function(id){
            $http({
                method: 'POST',
                url:'http://127.0.0.1:8000/api/questions/'+id
            }).then(function(response)
            {
                return response.data;
            });
        }
    }
}]);