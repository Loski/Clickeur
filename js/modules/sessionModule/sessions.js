/** Module UE **/
'use strict';

var session_module = angular.module('sessionModule', ['ngStorage','ui.router'])
    .factory('session', ['$http',function($http){
        return{

            get_session_list: function($scope,$id){
                var that = this;
                $http({
                    method: 'GET',
                    url:'http://127.0.0.1:8000/api/ues/'+$id+"/sessions/",
                }).then(function(response)
                {
                    $scope.data = response.data;
                });
            },

            delete: function($id){
            },

            add: function($title,$number,$id,$scope)
            {
                var that = this;
                $http({
                    method: 'POST',
                    url:'http://127.0.0.1:8000/api/ues/'+$id+"/sessions/",
                    data: "title="+$title+"&number="+$number,
                }).then(function(response)
                {
                    $scope.data = response.data;
                });
            }
        }
    }])
    .controller('sessionController', ['$scope', 'session','$stateParams', function($scope, session,$stateParams){
        $scope.title ='';
        $scope.number = '';
        $scope.id_ue = $stateParams.id_ue;
        console.log($stateParams);
        $scope.loadList = function()
        {
            $scope.data = [];
            session.get_session_list($scope,$stateParams.id_ue);
            $scope.$watch('data', function(newVal) {
                $scope.data = newVal;

                $scope.sessions = $scope.data['sessions'];
                $scope.id_ue = $stateParams.id_ue;
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
            session.add($scope.title,$scope.number,$stateParams.id_ue,$scope);
            $scope.$watch('data', function(newVal) {
                $scope.data = newVal;

                if($scope.data.error.errors!=null)
                {
                    $scope.errors=$scope.data.error.errors;
                    console.log($scope.data.error.errors);
                }
            }); 
            
        }

}]);