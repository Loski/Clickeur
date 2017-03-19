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

            delete: function($id,$scope){
                var that = this;
                $http({
                    method: 'DELETE',
                    url:'http://127.0.0.1:8000/api/sessions/'+$id,
                }).then(function(response)
                {
                    //$scope.data = response.data;
                });
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
    .controller('sessionController', ['$scope', 'session','$stateParams', 'ues_list', function($scope, session,$stateParams, ues_list){
        $scope.title ='';
        $scope.number = '';
        $scope.ues_list = ues_list.data;
        var id = $stateParams.id_ue;
        $scope.myue = ($scope.ues_list.my_ues[id] != undefined) ? $scope.ues_list.my_ues[id] : $scope.ues_list.other_ues[id];  
        $scope.id_ue = $stateParams.id_ue;

        $scope.loadList = function()
        {
            $scope.data = [];
            session.get_session_list($scope,$stateParams.id_ue);
            $scope.$watch('data', function(newVal) {
                $scope.data = newVal;
                $scope.sessions = $scope.data['ue'];
                $scope.id_ue = $stateParams.id_ue;

            }); 
        }   

        $scope.delete = function(sessionParam)
        {
            var index = $scope.getPostIndex(sessionParam);
            $scope.data.ue.sessions.splice(index,1);
            session.delete(sessionParam.id,$scope);
        }
        $scope.getPostIndex = function (post) {
            return  $scope.data.ue.sessions.indexOf(post); //this will return the index from the array
        }

}]).controller('sessionsFormController', ['$scope', 'session','$stateParams', function($scope, session,$stateParams, ues_list){
        $scope.add = function()
        {

            $scope.data = [];
            $scope.errors = [];
            console.log($scope.number);
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

        $scope.update = function()
        {

        }
}])

;