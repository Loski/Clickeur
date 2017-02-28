'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule', 'restangular'])
	.config(function(RestangularProvider){
        RestangularProvider.setBaseUrl('http://127.0.0.1:8000/api/');
        
	})
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository', '$http' , function($scope, $stateParams, $questionRepository, $http){
        $scope.questions = $questionRepository.getList($stateParams.id_session);
        $scope.id_session = $stateParams.id_session;
        $scope.id_ue = $stateParams.id_ue;
        console.log($scope.questions);


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
        getList:function(id_session) {
                var that = this;
                $http({
                    method: 'GET',
                    url:'http://127.0.0.1:8000/api/sessions/'+id_session+"/questions/"
                }).then(function(response)
                {
                    return response.data;
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