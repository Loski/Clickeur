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
                return{
                    code_ue:"",
                    name:""
                };
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
            console.log("im out");
            ueService.delete(id);
            $scope.$watch('data', function(newVal) {

            }); 
        }
    }])
     .controller('ueControllerForm', ['$scope','ueService', 'item', 'formType', function($scope , ueService, item, formType){

        $scope.title = (formType === "CREATE") ? "Ajouter un UE" : "Edition de l'UE";
        $scope.code_ue = item.code_ue;
        $scope.nom_ue = item.nom_ue;
        $scope.formType = formType;

        $scope.submit = function(){
            console.log($scope.formType);

            if($scope.formType === "CREATE"){
                $scope.add();
            }else{
                $scope.update();
            }
        }

        $scope.update = function()
        {

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