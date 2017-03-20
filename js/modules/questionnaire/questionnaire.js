'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule'])
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository', '$http', 'questionsList' , function($scope, $stateParams, questionRepository, $http,questionsList){
        
        $scope.id_session = $stateParams.id_session;
        $scope.id_ue = $stateParams.id_ue;
        $scope.questions = questionsList.data.session.questions;

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
        getList:function(id_session) {
            console.log(id_session);
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/sessions'+id_session+"/questions/"
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
                //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/",
                url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/sessions'+id_session+"/questions/",
                data: "title="+$title+"&number=5"+"&opened=0",
            }).then(function(response)
            {
                return response.data;
            });
        },
        switchState: function(id){
            $http({
                method: 'POST',
                //url:'http://127.0.0.1:8000/api/questions/'+id
                url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/questions/'+id
            }).then(function(response)
            {
                return response.data;
            });
        }
    }
}]);