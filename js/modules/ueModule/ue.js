/** Module UE **/
'use strict';

var ue_module = angular.module('ueModule', ['ngStorage', 'ui.router', 'ngAnimate'])
    .factory('ueService', ['$http', function($http){
        return{
            query: function(){
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/ues/'
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/ues'
                });
            },
            get: function(id){
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/ues/'+id,
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/ues/'+id
                });
            },
            delete: function($id){
                return $http({
                    method: 'DELETE',
                    //url:'http://127.0.0.1:8000/api/ues/'+$id,
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/ues/'+$id
                });
            },

            add: function($code_ue,$nom_ue,$scope)
            {
                return $http({
                    method: 'POST',
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/ues',
                    data: "code_ue="+$code_ue+"&name="+$nom_ue,
                });
            },

            getNew: function(){
                var item = {};
                item.data = {};
                item.data.ue = {};
                return item;
            },
            update: function($code_ue,$nom_ue, $id)
            {
                return $http({
                    method: 'PUT',
                    //url:'http://127.0.0.1:8000/api/ues/'+$id,
                    url:'http://ec2-34-201-121-8.compute-1.amazonaws.com/api/ues/'+$id,
                    data: "code_ue="+$code_ue+"&name="+$nom_ue,
                });
            }
        }
    }])
    .controller('ueController', ['$scope','ueService','ues_list',  function($scope , ueService, ues_list){
        $scope.code_ue ='';
        $scope.nom_ue = '';
        $scope.ues_list = ues_list.data;

        $scope.delete = function(ueParam)
        {

            ueService.delete(ueParam.id).then(function successCallback(success){
                var indexOf_ue = $scope.ues_list.my_ues.indexOf(ueParam);
                if(indexOf_ue==-1)
                {
                    indexOf_ue = $scope.ues_list.other_ues.indexOf(ueParam);
                    $scope.ues_list.other_ues.splice(indexOf_ue,1);
                }
                else
                {
                    $scope.ues_list.my_ues.splice(indexOf_ue,1);
                }
            },
            function errorsCallback(error){
            });;

        }
    }])
     .controller('ueControllerForm', ['$scope','ueService', 'item', 'formType', 'ues_list', '$stateParams', '$state', function($scope , ueService, item, formType, ues_list, $stateParams, $state){

        $scope.title = (formType === "CREATE") ? "Ajouter une UE" : "Edition de l'UE";
        $scope.code_ue = item.data.ue.code_ue || '';
        $scope.nom_ue = item.data.ue.name || '';
        $scope.formType = formType;
                console.log(ues_list);

        $scope.submit = function(){
            if($scope.formType === "CREATE"){
                $scope.add();
            }else{
                $scope.update();
            }
        }

        $scope.update = function()
        {
            ueService.update($scope.code_ue,$scope.nom_ue,$stateParams.id_ue).then(function successCallback(success){
                $state.go('app.ues');
            },
            function errorsCallback(error){
                $scope.ajouterUe.code_ue.$setValidity("size", false);
               $scope.error = error.data.error.message;
            });;
        }

        $scope.add = function()
        {
            ueService.add($scope.code_ue,$scope.nom_ue,$scope).then(function successCallback(success){
                var id_ue = success.data.ue.id;
                console.log(ues_list);
                ues_list.data.my_ues.push({
                    'code_ue': $scope.code_ue,
                    'name' : $scope.nom_ue,
                    'id' :id_ue
                });
                console.log(ues_list);
                $state.go('app.ues.sessions', {id_ue:id_ue});
            },
            function errorsCallback(error){
                $scope.ajouterUe.code_ue.$setValidity("size", false);
               $scope.error = error.data.error.message;
            });;
        }
    }
]);