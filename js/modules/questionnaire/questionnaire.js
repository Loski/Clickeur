'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule'])
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository', '$http', 'questionsList' , function($scope, $stateParams, questionRepository, $http,questionsList){
        
        $scope.id_session = $stateParams.id_session;
        $scope.id_ue = $stateParams.id_ue;
        $scope.questions = questionsList.data.session.questions;
        $scope.propositions = {};
        $scope.booleanLancer = false;
        $scope.lancer = function(question){
            question.opened = !question.opened;
            questionRepository.switchState(question.id);
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
	.controller('questionnairesFormController', ['$scope', '$stateParams', 'questionRepository', 'formType', 'question', function($scope, $stateParams, questionRepository, formType, question){
        $scope.title = (formType === "CREATE") ? "Ajouter une question" : "Edition de la question";
        $scope.formType = formType;
    //	$scope.propositions = [{id: 'response1', verdict: "false"}, {id: 'response2', verdict: "false"}];
        $scope.question = question.question;
        console.log($scope.question);
        console.log(question);
        $scope.id_session = $stateParams.id_session;

        $scope.addNewResponse = function() {
            var newItemNo = $scope.question.propositions.length+1;
            $scope.question.propositions.push({'id':'response'+newItemNo, 'verdict': false});
        };

        $scope.removeResponse = function() {
            var lastItem = $scope.question.propositions.length-1;
            $scope.question.propositions.splice(lastItem); 
        };
        $scope.envoyer =function(){
            ajouter();
        }
        $scope.ajouter = function(){
            var question = "";
            question+= '{"title":"' + $scope.question+ '", "propositions":{';
            for(var i = 0; i < $scope.propositions.length; i++){
                question += '"'+i+'":{"title" : "' + $scope.propositions[i].title+ '", "verdict": ' + $scope.propositions[i].verdict +'},';
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
                question:{
                    id: 0,
                    title: 'no title',
                    propositions:[
                        {
                            "id": "-1",
                            "verdict": 1,
                            "number": 0,
                            "title": "no title",
                        },
                        {
                            "id": "-2",
                            "verdict": 0,
                            "number": 1,
                            "title": "no title",
                        },
                    ]
                }
            };
        },
        getList:function(id_session) {
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/sessions/'+id_session+"/questions"
                });
         },
        getPropositions:function(question_id) {
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/questions/'+question_id+'/propositions'
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
                url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/sessions/'+id_session+"/questions",
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
            url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/questions/'+$id
            });
        },
        switchState: function(id){
            $http({
                method: 'PUT',
                url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/questions/'+id
            }).then(function(response)
            {
                return response.data;
            });
        }
    }
}]);



