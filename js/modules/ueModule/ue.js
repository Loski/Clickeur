/** Module UE **/
'use strict';

var ue_module = angular.module('ueModule', ['ngStorage', 'ui.router'])
    .factory('ue', ['$http',function($http){
        return{

           /* succesGettingUe : function(response){
                console.log(response);
                return response;
            },

            errorGettingUe : function(response){
                console.log("ERROR : "+response);
                return [];
            },*/

            get_ue_list: function($scope){
                var that = this;
                $http({
                    method: 'GET',
                    url:'http://127.0.0.1:8000/api/ues/',
                }).then(function(response)
                {
                    $scope.data = response.data;
                });
            },

            delete: function($id){
                var that = this;
                $http({
                    method: 'DELETE',
                    url:'http://127.0.0.1:8000/api/ues/'+$id,
                }).then(function(response)
                {
                    
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
                }).then(function(response)
                {
                    $scope.data = response.data;
                    console.log(response);
                });
            }
        }
    }])
    .controller('ueController', ['$scope','ue',  function($scope , ue){
        $scope.code_ue ='';
        $scope.nom_ue = '';
        
        $scope.loadList = function()
        {
            $scope.data = [];
            ue.get_ue_list($scope);
            $scope.$watch('data', function(newVal) {
                $scope.data = newVal;
                $scope.my_ues = $scope.data['my_ues'];
                $scope.other_ues = $scope.data['other_ues'];
            }); 
        }   

        $scope.delete = function()
        {

        }

        $scope.update = function()
        {

        }

        $scope.add = function()
        {

            $scope.data = [];
            $scope.errors = [];
            ue.add($scope.code_ue,$scope.nom_ue,$scope);
            $scope.$watch('data', function(newVal) {
                $scope.data = newVal;

            /*    if($scope.data.error.errors!=null)
                {
                    $scope.errors=$scope.data.error.errors;
                    console.log($scope.data.error.errors);
                }*/
            }); 
            
        }
}]);