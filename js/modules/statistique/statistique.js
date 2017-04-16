'use strict';


var statistique = angular.module('StatistiqueModule', ['ui.router'])
    .factory('statistiqueRepository', ['$http', function ($http) {
        console.log("j'entre");
        return {
            getQuestionWithStatistique: function(id_question) {
                 return $http({
                        method: 'GET',
                        url:'http://ec2-54-242-216-40.compute-1.amazonaws.com/api/stat/question/' + id_question
                });
            },
        }
    }])
    .controller('statsController', [ '$scope', 'questionWithStatistique' , function($scope, questionWithStatistique){
        console.log(questionWithStatistique);
    }]);


