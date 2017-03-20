/** Module UE **/
'use strict';

var ue_module = angular.module('ueModule', ['ngStorage', 'ui.router', 'ngAnimate'])
    .factory('ueService', ['$http', function($http){
        return{
            query: function(){
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/ues/'
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/ues'
                });
            },
            get: function(id){
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/ues/'+id,
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/ues/'+id
                });
            },
            delete: function($id){
                $http({
                    method: 'DELETE',
                    //url:'http://127.0.0.1:8000/api/ues/'+$id,
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/ues/'+$id
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                  }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                  });
            },

            add: function($code_ue,$nom_ue,$scope)
            {
                return $http({
                    method: 'POST',
                    //url:'http://127.0.0.1:8000/api/ues/',
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/ues/'+$id,
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
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/ues/'+$id,
                    data: "code_ue="+$code_ue+"&name="+$nom_ue,
                });
            }
        }
    }])
    .controller('ueController', ['$scope','ueService','ues_list',  function($scope , ueService, ues_list){
        $scope.code_ue ='';
        $scope.nom_ue = '';
        $scope.ues_list = ues_list.data;
        console.log(ues_list);
        /*$scope.loadList = function()
        {
            $scope.data = [];
            ueService.get_ue_list($scope);
            $scope.$watch('data', function(newVal) {
                $scope.data = newVal;
                $scope.my_ues = $scope.data['my_ues'];
                $scope.other_ues = $scope.data['other_ues'];
            }); 
        }*/  

        $scope.delete = function(ueParam)
        {

            var indexOf_ue = $scope.ues_list.my_ues.indexOf(ueParam);

            console.log(indexOf_ue);

            if(indexOf_ue==-1)
            {
                indexOf_ue = $scope.ues_list.other_ues.indexOf(ueParam);
                $scope.ues_list.other_ues.splice(indexOf_ue,1);
            }
            else
            {
                $scope.ues_list.my_ues.splice(indexOf_ue,1);
            }
            
            ueService.delete(ueParam.id);
        }
    }])
     .controller('ueControllerForm', ['$scope','ueService', 'item', 'formType', '$stateParams', '$state', function($scope , ueService, item, formType, $stateParams, $state){

        $scope.title = (formType === "CREATE") ? "Ajouter un UE" : "Edition de l'UE";
        $scope.code_ue = item.data.ue.code_ue || '';
        $scope.nom_ue = item.data.ue.name || '';
        $scope.formType = formType;

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
                $state.go('ues');
            },
            function errorsCallback(error){
                $scope.ajouterUe.code_ue.$setValidity("size", false);
               $scope.error = error.data.error.message;
            });;
        }

        $scope.add = function()
        {
            ueService.add($scope.code_ue,$scope.nom_ue,$scope).then(function successCallback(success){
                $state.go('ues');
            },
            function errorsCallback(error){
                $scope.ajouterUe.code_ue.$setValidity("size", false);
               $scope.error = error.data.error.message;
            });;
        }
    }
]);