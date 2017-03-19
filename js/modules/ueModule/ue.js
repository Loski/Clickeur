/** Module UE **/
'use strict';

var ue_module = angular.module('ueModule', ['ngStorage', 'ui.router', 'ngResource'])
    .factory('ueService', ['$http', function($http){
        return{
            get_ue_list: function(){
                var that = this;
                return $http({
                    method: 'GET',
                    url:'http://127.0.0.1:8000/api/ues/'
                });
            },
            get: function(id){
                return $http({
                    method: 'GET',
                    url:'http://127.0.0.1:8000/api/ues/'+id,
                });
            },
            delete: function($id){
                console.log('im in');
                var that = this;
                $http({
                    method: 'DELETE',
                    url:'http://127.0.0.1:8000/api/ues/'+$id,
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
                var that = this;
                console.log('salut');
                $http({
                    method: 'POST',
                    url:'http://127.0.0.1:8000/api/ues/',
                    data: "code_ue="+$code_ue+"&name="+$nom_ue,
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                  }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
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
                var that = this;
                console.log('salut');
                $http({
                    method: 'PUT',
                    url:'http://127.0.0.1:8000/api/ues/'+$id,
                    data: "code_ue="+$code_ue+"&name="+$nom_ue,
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    // when the response is available
                  }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                  });
            }
        }
    }])
    .controller('ueController', ['$scope','ueService','ues_list',  function($scope , ueService, ues_list){
        $scope.code_ue ='';
        $scope.nom_ue = '';
        $scope.ues_list = ues_list.data;
        $scope.loadList = function()
        {
            $scope.data = [];
            ueService.get_ue_list($scope);
            $scope.$watch('data', function(newVal) {
                $scope.data = newVal;
                $scope.my_ues = $scope.data['my_ues'];
                $scope.other_ues = $scope.data['other_ues'];
            }); 
        }   

        $scope.delete = function(id)
        {
            ueService.delete(id);
            $scope.$watch('data', function(newVal) {
            }); 
        }
    }])
     .controller('ueControllerForm', ['$scope','ueService', 'item', 'formType', '$stateParams', function($scope , ueService, item, formType, $stateParams){

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
            ueService.update($scope.code_ue,$scope.nom_ue,$stateParams.id_ue);
        }

        $scope.add = function()
        {

            $scope.data = [];
            $scope.errors = [];
            ueService.add($scope.code_ue,$scope.nom_ue,$scope);
            $scope.$watch('data', function(newVal) {
                $scope.data = newVal;

            /*    if($scope.data.error.errors!=null)
                {
                    $scope.errors=$scope.data.error.errors;
                    console.log($scope.data.error.errors);
                }*/
            }); 
        }
    }
]);