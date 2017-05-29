'use strict';


var statistique = angular.module('StatistiqueModule', ['ui.router', 'nvd3'])
    .factory('statistiqueRepository', ['$http', function ($http) {
        console.log("j'entre");
        return {
            getQuestionWithStatistique: function(id_question) {
                 return $http({
                        method: 'GET',
                        url:'https://132.227.116.252/serveur/public/api/stat_tour/question/' + id_question
                });
            },
        }
    }])
    .controller('statsController', [ '$scope', 'questionWithStatistique','statistiqueRepository','questionRepository','$timeout','$state' , 'modalService', '$window',function($scope, questionWithStatistique,statistiqueRepository,questionRepository,$timeout,$state,modalService,$window){
        $scope.question = questionWithStatistique.data.question;
        $scope.propositions = $scope.question.propositions;
        $scope.tour_actuel = 1;
        $scope.tour_max = Object.keys($scope.propositions[0].stat.tour).length;

        $scope.rep_compare = {
            chart: {
                type: 'discreteBarChart',
                height: $window.innerHeight*0.25,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.0f')(d);
                },
                axisFormat: function(d){
                    return d3.format(',.0f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'Proposition'
                },
                yAxis: {
                    axisLabel: 'Nombre de réponses',
                    axisLabelDistance: -10,
                    tickFormat: function(d){
                        return d3.format(',.0f')(d);
                    },
                },
                noData:"Aucune statistique disponible",
                color: function(d){return d.color},
                tooltip: {
                    contentGenerator: function (e) {
                      var series = e.series[0];
                      if (series.value === null) return;

                      var rows = 
                        "<tr>" +
                          "<td class='key'> Nombre de réponses : <strong>" + series.value + "</strong></td>" +
                        "</tr>";

                    var title = e.data.title;

                    if(angular.isUndefined(e.data.title))
                        title=series.key;

                      var header = 
                        "<thead>" + 
                          "<tr>" +
                            "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                            "<td class='key'><strong>" + title + "</strong></td>" +
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

            $scope.propositions.sort(function(a, b) {
                return a.number - b.number;
            });

            $scope.values_per_proposition = [];
            $scope.true_false_values = [];

            var values = [];
            var dicStudents = {};
            var dicPropositions = {};
            var nb_reponse = [];
            nb_reponse[0]=0;
            nb_reponse[1]=0;
            $scope.students = [];

            /** Local Fix, delete quand serveur est ok et envoie à nouveau sans opinion**/
            values.push(
                        {
                            label: "Sans opinion",
                            title: "Sans opinion",
                            value: 0,
                            color : "gray"
                        }
                    );
            /****/

                for(var index in $scope.propositions)
                {
                    var proposition = $scope.propositions[index];
                    var stat = proposition.stat.tour;
                    stat= stat[$scope.tour_actuel];

                    var color = "red";

                    if(proposition.number==0)
                    {
                        dicPropositions[0] =
                        {
                            label: "sans opinion",
                            title: "sans opinion",
                            value: stat.count,
                            color : "gray"
                        }
                    }
                    else
                    {

                        var color = "red";
                        if(proposition.verdict==1)
                        {
                            nb_reponse[0] += stat.count;
                            color="green"; 
                        }
                        else
                        {
                            nb_reponse[1] += stat.count;
                        }
                        dicPropositions[proposition.number] =
                        {
                            label: "["+proposition.number+"]",
                            title: proposition.title,
                            value: stat.count,
                            color : color
                        }
                    }

                    for(var indexS in stat.users)
                    {
                        var student = stat.users[indexS];

                        $scope.students.push(
                        {
                            num_etu:student.username,
                            firstName:student.firstName,
                            lastName:student.lastName,
                            proposition:$scope.propositions[index].number,
                            proposition_juste:$scope.propositions[index].verdict
                        }
                        );
                    }

                    
                    /*else if(proposition.verdict==1)
                    {
                        color="green";

                        if($scope.question.propositions_true_count<2)
                            nb_reponse[0] += stat.count;
                    }
                    else
                    {
                        if($scope.question.propositions_true_count<2)
                             nb_reponse[1] += stat.count;
                    }*/
                }

                for(var index in dicPropositions)
                {
                    var prop = dicPropositions[index];
                    if($scope.question.propositions_true_count>=2)
                    {
                           
                    }

                    values.push(
                        dicPropositions[index]
                    );
                            
                }

                $scope.values_per_proposition = [
                    {
                        key:"key",
                        values:values
                    }
                ]

                if($scope.question.propositions_true_count>=2)
                {

                }


               values = [
                    {
                        label: "Sans opinion",
                        value: 0,
                        color: "gray"
                    },
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

                $scope.true_false_values = [
                    {
                        key:"key",
                        values:values
                    }
                ]

            if(nb_reponse[0]==0 && nb_reponse[1]==0)
            {
                $scope.true_false_values = [];
                $scope.values_per_proposition = [];
            }

        }

        $scope.updateChart();

        $scope.sortType     = 'num_etu'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchStudent   = '';     // set the default search/filter term

        $scope.updateStudents = function()
        {
            /* Array of Students*/
            
        }

        $scope.updateStudents();

        /* AUTO - UPDATE*/
        var update = function(auto)
        {
           statistiqueRepository.getQuestionWithStatistique($scope.question.id).then(function successCallback(success){
                
                console.log("UPDATE",$state);
                $scope.question = success.data.question;
                $scope.propositions = $scope.question.propositions;

                $scope.updateStudents();
                $scope.updateChart();

                if(auto && $scope.question.opened==1  && $state.is("app.ues.sessions.questions.statistique"))
                    $timeout(update.bind(null,true), 10000);
            },
            function errorsCallback(error){
                console.log(error);
            });
        }

        if($scope.question.opened==1)
            $timeout(update.bind(null,true), 10000);  

        $scope.lancer = function(question){
            question.opened = !question.opened;
            questionRepository.switchState(question.id);
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
                questionRepository.delete(question.id).then(
                    function successCallback(success){
                    //$scope.questions.splice(index,1);
                    $state.go("app.ues.sessions.questions");
                },
                function errorsCallback(error){
                    console.log(error);
                });
            }, function errorsCallback(error){
                console.log(error);
            });

        }

        $scope.updateAllData = function()
        {
            update(false);
        }

        $scope.previousTurn = function()
        {
            if($scope.tour_actuel>1)
            {
                $scope.tour_actuel--;
                $scope.updateAllData();
            }
        }

        $scope.nextTurn = function()
        {
            if($scope.tour_actuel<$scope.tour_max)
            {
                $scope.tour_actuel++;
                $scope.updateAllData();
            }
        }

}]);


