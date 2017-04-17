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
    .controller('statsController', [ '$scope', 'questionWithStatistique','statistiqueRepository','questionRepository','$timeout','$state' , function($scope, questionWithStatistique,statistiqueRepository,questionRepository,$timeout,$state){
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
                //labelSunbeamLayout: true,
                noData:"Aucune statistique disponible",
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                },
                color: function(d){return d.color},
                labelType:function(d){
                    var percent = (d.endAngle - d.startAngle) / (2 * Math.PI);
                    return d3.format('.2%')(percent);
                },
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

        $scope.updateChart = function()
        {

            $scope.values_per_proposition = [];
            $scope.true_false_values = [];
            var nb_reponse = [];
            nb_reponse[0] = 0;
            nb_reponse[1] = 0;

            console.log("JEY");
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

            $scope.true_false_values = [
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

            if(nb_reponse[0]==0 && nb_reponse[1]==0)
            {
                $scope.true_false_values = [];
                $scope.values_per_proposition = [];
            }
        }

        $scope.updateChart();

        $scope.updateStudents = function()
        {
            /* Array of Students*/
            $scope.sortType     = 'num_etu'; // set the default sort type
            $scope.sortReverse  = false;  // set the default sort order
            $scope.searchStudent   = '';     // set the default search/filter term

            $scope.students = [];

            for(var indexProp in $scope.propositions)
            {
                var stat = $scope.propositions[indexProp].stat;

                for(var index in stat.users)
                {
                    var student = stat.users[index];

                    $scope.students.push(
                    {
                        num_etu:student.username,
                        firstName:student.firstName,
                        lastName:student.lastName,
                        proposition:parseInt(indexProp)+1,
                        proposition_juste:$scope.propositions[indexProp].verdict
                    }
                    );
                }
            }
        }

        $scope.updateStudents();

        /* AUTO - UPDATE*/
        var auto_update = function()
        {
           statistiqueRepository.getQuestionWithStatistique($scope.question.id).then(function successCallback(success){
                
                console.log("UPDATE");
                $scope.question = success.data.question;
                $scope.propositions = $scope.question.propositions;

                $scope.updateStudents();
                $scope.updateChart();

                if($scope.question.opened==1  && $state.is("ues.sessions.questions.statistique"))
                    $timeout(auto_update, 10000);
            },
            function errorsCallback(error){
                console.log(error);
            });
        }

        if($scope.question.opened==1)
            $timeout(auto_update, 10000);  

        $scope.lancer = function(question){
            question.opened = !question.opened;
            questionRepository.switchState(question.id);
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

}]);


