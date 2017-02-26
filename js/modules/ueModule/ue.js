/** Module UE **/
'use strict';

var ue_module = angular.module('ueModule', ['ngStorage'])
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
        }
    }])
    .controller('ueController', ['$scope', 'ue', function($scope, ue){
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
}]);