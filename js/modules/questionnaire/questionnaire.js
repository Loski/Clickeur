'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule'])
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository', '$http', 'questionsList' , function($scope, $stateParams, questionRepository, $http,questionsList){
        
        $scope.id_session = $stateParams.id_session;
        $scope.id_ue = $stateParams.id_ue;
        $scope.questions = questionsList.data.session.questions;
        $scope.propositions = {};
        console.log($scope.questions);
        $scope.lancer = function(id){

            questionRepository.switchState(id);
        }

        $scope.getPropositions = function(id)
        {
            if (typeof $scope.propositions[id] == 'undefined')
            {
                questionRepository.getPropositions(id).then(
                    function successCallback(success){
                        $scope.propositions[id]=success.data.question.propositions;
                        $scope.propositions[id].booleanVal=true;
                    },
                    function errorsCallback(error){
                        console.log(error.data);
                    });;
            }
            else
            {
                $scope.propositions[id].booleanVal=!$scope.propositions[id].booleanVal;
            }            
        }

        $scope.delete = function(question)
        {
            var index = $scope.questions.indexOf(question);
            questionRepository.delete(question.id).then(
                function successCallback(success){
                    $scope.questions.splice(index,1);
                },
                function errorsCallback(error){
                    console.log(error.data);
                });;
        }
    }])
	.controller('questionnairesFormController', ['$scope', '$stateParams', 'questionRepository', function($scope, $stateParams, questionRepository){

    	$scope.responses = [{id: 'response1', verdict: "false"}, {id: 'response2', verdict: "false"}];
        $scope.question = "";
        $scope.id_session = $stateParams.id_session;
        $scope.title ="";
        console.log($scope.questions);

        $scope.addNewResponse = function() {
            var newItemNo = $scope.responses.length+1;
            $scope.responses.push({'id':'response'+newItemNo, 'verdict': false});
        };

        $scope.removeResponse = function() {
            var lastItem = $scope.responses.length-1;
            $scope.responses.splice(lastItem);
        };

        $scope.envoyer = function(){
            var question = "";
            question+= '{"title":"' + $scope.title+ '", "propositions":{';
            for(var i = 0; i < $scope.responses.length; i++){
                question += '"'+i+'":{"title" : "' + $scope.responses[i].name+ '", "verdict": ' + $scope.responses[i].verdict +'},';
            }
            question = question.substring(0, question.length - 1);
            question += '}}';
            questionRepository.create($scope.id_session, question);
        };

	}]);

questionnaire.factory('questionRepository', ['$http','$state', function ($http,$state) {


    return {
        getNew:function(){
        	return {
                name:'Réponse 1', val:''
            };
        },
        getList:function(id_session) {
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/sessions/'+id_session+"/questions"
                });
         },
        getPropositions:function(question_id) {
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/questions/'+question_id+'/propositions'
                });
         },
        get:function(id_session, id_question) {
            return ;
        },
        update : function(updatedResource) {
            return;
        },
        create: function (id_session, question) {
            $http({
                method: 'POST',
                //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/",
                url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/sessions/'+id_session+"/questions",
                data:question
            }).then(function(response)
            {
                $state.go('ues.sessions.questions', true);
                //return response.data;
            }, function(error){
                console.log(error);
            });
        },
        delete: function($id){
            return $http({
            method: 'DELETE',
            //url:'http://127.0.0.1:8000/api/sessions/'+$id,
            url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/questions/'+$id
            });
        },
        switchState: function(id){
            $http({
                method: 'PUT',
                url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/questions/'+id
            }).then(function(response)
            {
                return response.data;
            });
        }
    }
}]);



