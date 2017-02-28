'use strict';

var questionnaire = angular.module('Questionnaire', ['ngStorage', 'userAuthModule', 'restangular'])
	.config(function(RestangularProvider){
        RestangularProvider.setBaseUrl('http://127.0.0.1:8000/api/');
        RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            var extractedData;
            if (operation === "getList") {
                extractedData = data.result;
            } else {
                extractedData = data;
            }
            return extractedData;
        });
	})
    .controller('questionnairesController', ['$scope', '$stateParams', 'questionRepository' , function($scope, $stateParams, $questionRepository){
        $scope.questions = $questionRepository.getList($stateParams.id_session);
        $scope.id_session = $stateParams.id_session;
        $scope.id_ue = $stateParams.id_ue;

        $scope.addNewResponse = function() {
            var newItemNo = $scope.choices.length+1;
            $scope.choices.push({'id':'choice'+newItemNo});
        };

        $scope.removeResponse = function() {
            var lastItem = $scope.choices.length-1;
            $scope.choices.splice(lastItem);
        };

    }])
	.controller('questionnairesFormController', ['$scope', function($scope){
		console.log($scope);
	}]);

questionnaire.factory('questionRepository', ['Restangular', function (restangular) {
    console.log(restangular);
    return {
        getNew:function(){
        	return {
                name:'Réponse 1', val:''
            };
        },
        getList:function(id_session) {
            return restangular.one("sessions", id_session).getList("questions");
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