'use strict';


var statistique = angular.module('StatistiqueModule', ['ui.router', 'nvd3'])
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
        $scope.question = questionWithStatistique.data.question;
        $scope.propositions = $scope.question.propositions;

        $scope.rep_compare = {
           chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                },
                color: function(d){return d.color},
                labelType:"percent",
                tooltip: {
         contentGenerator: function (e) {
              var series = e.series[0];
              if (series.value === null) return;

              var rows = 
                "<tr>" +
                  "<td class='key'> Nombre de réponses : " + series.value + "</td>" +
                "</tr>";

              var header = 
                "<thead>" + 
                  "<tr>" +
                    "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                    "<td class='key'><strong>" + series.key + "</strong></td>" +
                  "</tr>" + 
                "</thead>";

              return "<table>" +
                  header +
                  "<tbody>" + 
                    rows + 
                  "</tbody>" +
                "</table>";
            } 
            }
        }
        };


        $scope.values_per_proposition = [];
        var nb_reponse = [];
        nb_reponse[0] = 0;
        nb_reponse[1] = 0;
        for(var index in $scope.propositions)
        {
            var proposition = $scope.propositions[index];
            var color = "red";

            if(proposition.verdict==1)
            {
                color="green";
                nb_reponse[0] += proposition.stat.responses_count;
            }
            else
                nb_reponse[1] += proposition.stat.responses_count;

            $scope.values_per_proposition.push(
                {
                    label: proposition.title,
                    value: proposition.stat.responses_count,
                    color : color
                }
            );
        }


        $scope.values = [
            {
                label: "Bonne réponse",
                value: nb_reponse[0],
                color: "#11400d"
            },
            {
                label: "Mauvaise réponse",
                value: nb_reponse[1],
                color: "#420405"
            }
        ];

        $scope.data_to_show = $scope.values;

}]);


