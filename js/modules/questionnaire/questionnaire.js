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
	.controller('questionnairesFormController', ['$scope', '$stateParams', '$state', 'questionRepository', 'formType', 'question', function($scope, $stateParams, $state, questionRepository, formType, question){
        if(formType === "CREATE"){
            $scope.title = "Ajouter une question";
        }else{
            $scope.title =  "Edition de la question";
            $scope.id_question = $stateParams.id_question;
        }
        $scope.formType = formType;
        $scope.question = question.question;
        $scope.id_session = $stateParams.id_session;
        $scope.deleted_response = [];
        $scope.addNewResponse = function() {
            var indice = $scope.deleted_response.length-1
            if(indice >= 0){
                $scope.question.propositions.push($scope.deleted_response[indice]);
                $scope.deleted_response.splice(indice, 1);
                return;
            }
            var newItemNo = $scope.question.propositions.length+1;
            $scope.question.propositions.push({'id': Math.floor((Math.random() * 10000) + 1), 'verdict': 0});
        };

        $scope.removeResponse = function(id) {
            var indice = (function(id){ 
                if(id == undefined)
                    return;
                for(var i = 0 ; i < $scope.question.propositions.length; i++){
                    if(parseInt($scope.question.propositions[i].id) == parseInt(id)){
                        return i;
                    }
                }
            })(id);
            $scope.deleted_response.push($scope.question.propositions[indice]);
            $scope.question.propositions.splice(indice, 1);
        };
        $scope.envoyer =function(){
            if($scope.formType =="CREATE")
                $scope.ajouter();
            else
                $scope.update();
        };

        $scope.update = function(){
            questionRepository.updateTitle($scope.id_question, $scope.question.title).then(function successCallback(success){
                $timeout(auto_update, 1000);
                console.log("update");
            },
            function errorsCallback(error){
                console.log(error);
            });
            var questionToInsert = [];
            var questionToUpdate = [];
            for(var i = 0; i < $scope.question.propositions.length; i++){
                //update
                if($scope.question.propositions[i].created_at == undefined){
                    questionToUpdate.push($scope.question.propositions[i]); 
                }else{
                    questionToInsert.push($scope.question.propositions[i]); 
                }
            }
            
        };
        $scope.ajouter = function(){
            var question = "";
            question+= '{"title":"' + $scope.question.title+ '", "propositions":{';
            for(var i = 0; i < $scope.question.propositions.length; i++){
                question += '"'+i+'":{"title" : "' + $scope.question.propositions[i].title+ '", "verdict": "' + $scope.question.propositions[i].verdict +'"},';
            }
            question = question.substring(0, question.length - 1);
            question += '}}';
            questionRepository.create($scope.id_session, question).then(function(response)
            {
                console.log(response);
                $state.go('ues.sessions.questions.statistique', {id_question:response.data.question.id});
            }, function(error){
                console.log(error);
            });;
        };

	}])
    .controller('questionNotClose', ['ues', '$scope', 'questionRepository', function(ues, $scope, questionRepository){

        $scope.propositions = {};
        $scope.ues = ues.data.ues;
        
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

questionnaire.factory('questionRepository', ['$http','$state', function ($http,$state) {

    return {
        getNew:function(){
        	return {
                question:{
                    id: 0,
                    title: '',
                    propositions:[
                        {
                            "id": "-1",
                            "verdict": 0,
                            "number": 0,
                            "title": "",
                        },
                        {
                            "id": "-2",
                            "verdict": 0,
                            "number": 1,
                            "title": "",
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
        updateTitle : function(question_id, title) {
            return $http({
                    method: 'PUT',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/questions/'+question_id,
                    data: 'title=' + title 
                });
        },
        updateProposition : function(proposition_id, title) {
            return $http({
                    method: 'PUT',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/propositions/' + proposition_id,
                    data: 'title=' + title 
                });
        },
        insertProposition : function(question_id, title) {
            return $http({
                    method: 'POST',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/question/' + question_id,
                    data: 'title=' + title 
                });
        },
        create: function (id_session, question) {
            return $http({
                method: 'POST',
                //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/",
                url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/sessions/'+id_session+"/questions",
                data:question
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
                url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/questions/switch/'+id
            }).then(function(response)
            {
                return response.data;
            });
        },
        getMyQuestionWithUeAndSessions: function(){
            return $http({
                method: 'GET',
                url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/questions/open'
            });
        }
    }
}]);



