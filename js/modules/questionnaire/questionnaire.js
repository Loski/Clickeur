'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule'])
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository', '$http', 'questionsList', 'modalService' , function($scope, $stateParams, questionRepository, $http, questionsList, modalService){
        
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
            var modalOptions = {
                closeButtonText: 'Annuler',
                actionButtonText: 'Confirmer',
                headerText: 'Confirmation',
                bodyText: 'Êtes-vous sûr sur de vouloir supprimer cette question ?'
            };

            modalService.showModal({}, modalOptions).then(function (result) {
                var index = $scope.questions.indexOf(question);
                    questionRepository.delete(question.id).then(
                    function successCallback(success){
                        $scope.questions.splice(index,1);
                    },
                    function errorsCallback(error){
                        console.log(error);
                    });
                    }, function errorsCallback(error){
                        console.log(error);
                    });
        }

        $scope.open_all = function()
        {
            for(var i = 0 ; i < $scope.questions.length; i++)
            {
                if(!$scope.questions[i].opened)
                {
                    $scope.lancer($scope.questions[i]);
                }
            }
        }

        $scope.close_all = function()
        {
            for(var i = 0 ; i < $scope.questions.length; i++)
            {
                if($scope.questions[i].opened)
                {
                    $scope.lancer($scope.questions[i]);
                }
            }
        }


    }])
	.controller('questionnairesFormController', ['$scope', '$stateParams', '$state', 'questionRepository', 'formType', 'question', 'questionsList',  function($scope, $stateParams, $state, questionRepository, formType, question, questionsList){
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
        $scope.alerts = [];

        $scope.addNewResponse = function() {
            var newItemNo = $scope.question.propositions.length+1;
            $scope.question.propositions.push({'id': Math.floor((Math.random() * 10000) + 1), 'verdict': 0, 'title':""});
        };


        $scope.addOldResponse = function(indice) {
            if(indice >= 0){
                $scope.question.propositions.push($scope.deleted_response[indice]);
                $scope.deleted_response.splice(indice, 1);
                return;
            }
        }

        $scope.removeResponse = function(indice) {
            if($scope.question.propositions[indice].created_at === undefined && $scope.question.propositions[indice].title ==""){
                console.log("im in");
            }else{
                $scope.deleted_response.push($scope.question.propositions[indice]);
            }
            $scope.question.propositions.splice(indice, 1);
        };

        $scope.envoyer =function(){
            var checked = false, error = false;
            $scope.alerts = [];

            if($scope.question.propositions.length < 2){
                error = true;
                $scope.addAlert("Rentrer au moins deux propositions");
            }
            for(var i = 0 ; i < $scope.question.propositions.length; i++){
                if($scope.question.propositions[i].verdict == 1){
                    checked = true;
                    break;
                }
            }
            if(!checked){
                $scope.addAlert("Impossible d'envoyer une proposition avec aucune proposition bonne");
                return;
            }

            if(error){
                return;
            }
            if($scope.formType =="CREATE")
                $scope.ajouter();
            else
                $scope.update();
        };

        $scope.update = function(){
            questionRepository.updateTitle($scope.id_question, $scope.question.title).then(function successCallback(success){

            },
            function errorsCallback(error){
                console.log(error);
            });
            var questionToInsert = [];
            var questionToUpdate = [];
            var questionToDelete = [];

            // find change
            for(var i = 0; i < $scope.question.propositions.length; i++){
                if($scope.question.propositions[i].created_at === undefined){
                    questionToInsert.push($scope.question.propositions[i]); 
                    console.log(questionToInsert[0]);
                }else{
                    questionToUpdate.push($scope.question.propositions[i]); 
                }
            }

            //to delete
            for(var i = 0; i < $scope.deleted_response.length; i++){
                if($scope.deleted_response[i].created_at !== undefined){
                    questionToDelete.push($scope.deleted_response[i]); 
                }
            }


            //envoi insert
            for(var i = 0; i < questionToInsert.length; i++){
                questionRepository.insertProposition($scope.id_question, questionToInsert[i].title, questionToInsert[i].verdict).then(function successCallback(success){
                },
                function errorsCallback(error){
                    console.log(error);
                });
            }

            //envoie update
            for(var i = 0; i < questionToUpdate.length; i++){
                questionRepository.updateProposition(questionToUpdate[i].id, questionToUpdate[i].title, questionToUpdate[i].verdict).then(function successCallback(success){
                },
                function errorsCallback(error){
                    console.log(error);
                });
            }

            //envoie delete
            for(var i = 0; i < questionToDelete.length; i++){
                questionRepository.deleteProposition(questionToDelete[i].id).then(function successCallback(success){
                
                },
                function errorsCallback(error){
                    console.log(error);
                });
            }
        };
        $scope.ajouter = function(){
            var question = "";
            var objectQuestion = {};
            objectQuestion.propositions = [];
            objectQuestion.title = $scope.question.title;
            question+= '{"title":"' + $scope.question.title+ '", "propositions":{';
            for(var i = 0; i < $scope.question.propositions.length; i++){
                question += '"'+i+'":{"title" : "' + $scope.question.propositions[i].title+ '", "verdict": "' + $scope.question.propositions[i].verdict +'"},';
                objectQuestion.propositions.push({
                    'title': $scope.question.propositions[i].title,
                    'verdict': $scope.question.propositions[i].verdict
                }); 
            }
            question = question.substring(0, question.length - 1);
            question += '}}';
            questionRepository.create($scope.id_session, question).then(function(response)
            {
                var id = response.data.question.id;
                objectQuestion.id = id;
                questionsList.data.session.questions.push(objectQuestion);
                $state.go('^.statistique', {id_question:id});
            }, function(error){
                console.log(error);
            });;
        };


        $scope.addAlert = function(message) {
            $scope.alerts.push({msg: message});
        };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

	}])
    .controller('questionNotClose', ['ues', '$scope', 'questionRepository', '$state', 'modalService', function(ues, $scope, questionRepository, $state, modalService){

        $scope.propositions = {};
        $scope.ues = ues.data.ues;
        var verification = function(ues){
            console.log(ues);
            if(ues === undefined || ues.lenght < 1){
                $state.go("app.ues");
            }
        }

        verification($scope.ues);
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
            var modalOptions = {
                closeButtonText: 'Annuler',
                actionButtonText: 'Confirmer',
                headerText: 'Confirmation',
                bodyText: 'Êtes-vous sûr sur de vouloir supprimer cette question ?'
            };

            modalService.showModal({}, modalOptions).then(
                function (result) {
                var index = $scope.questions.indexOf(question);
                     questionRepository.delete(question.id).then(
                        function successCallback(success){
                            $scope.ues.splice(index,1);
                            verification($scope.ues);
                        },function errorsCallback(error){
                            console.log(error);
                        });
                }, function errorsCallback(error){
                        console.log(error);
                });
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
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/sessions/'+id_session+"/questions"
                });
         },
        getPropositions:function(question_id) {
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/questions/'+question_id+'/propositions'
                });
         },
        get:function(id_session, id_question) {
            return ;
        },
        updateTitle : function(question_id, title) {
            return $http({
                    method: 'PUT',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/questions/'+question_id,
                    data: "title=" + title 
                });
        },
        updateProposition : function(proposition_id, title, verdict) {
            return $http({
                    method: 'PUT',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/propositions/' + proposition_id,
                    data: 'title=' + title+"&verdict="+verdict 
                });
        },
        insertProposition : function(question_id, title, verdict) {
            return $http({
                    method: 'POST',
                    //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/questions/' + question_id+"/propositions",
                    data: 'title=' + title +"&verdict="+verdict
                });
        },
        deleteProposition: function($id){
            return $http({
            method: 'DELETE',
            //url:'http://127.0.0.1:8000/api/sessions/'+$id,
            url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/propositions/'+$id
            });
        },
        create: function (id_session, question) {
            return $http({
                method: 'POST',
                //url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/",
                url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/sessions/'+id_session+"/questions",
                data:question
            });
        },
        delete: function($id){
            return $http({
            method: 'DELETE',
            //url:'http://127.0.0.1:8000/api/sessions/'+$id,
            url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/questions/'+$id
            });
        },
        switchState: function(id){
            $http({
                method: 'PUT',
                url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/questions/switch/'+id
            }).then(function(response)
            {
                return response.data;
            });
        },
        getMyQuestionWithUeAndSessions: function(){
            return $http({
                method: 'GET',
                url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/questions/open'
            });
        }
    }
}]);



