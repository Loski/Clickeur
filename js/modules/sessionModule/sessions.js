/** Module UE **/
'use strict';

var session_module = angular.module('sessionModule', ['ngStorage','ui.router'])
    .factory('sessionService', ['$http',function($http){
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
            get: function(id){
                return $http({
                    method: 'GET',
                    url:'http://127.0.0.1:8000/api/sessions/'+$id,
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

            add: function($title,$number,$id)
            {
                return $http({
                    method: 'POST',
                    url:'http://127.0.0.1:8000/api/ues/'+$id+"/sessions/",
                    data: "title="+$title+"&number="+$number,
                });
            },

            getNew: function(){
                var item = {};
                item.data = {};
                item.data.session = {};
                return item;
            },
            update: function($code_ue,$nom_ue, $id)
            {
                return $http({
                    method: 'PUT',
                    /*url:'http://127.0.0.1:8000/api/ues/'+$id,
                    data: "code_ue="+$code_ue+"&name="+$nom_ue,*/
                });
            }
        }
    }])
    .controller('sessionController', ['$scope', 'sessionService','$stateParams', 'ues_list', function($scope, sessionService,$stateParams, ues_list){
        $scope.title ='';
        $scope.number = '';
        $scope.ues_list = ues_list.data;
        var id = $stateParams.id_ue;
        $scope.myue = ($scope.ues_list.my_ues[id] != undefined) ? $scope.ues_list.my_ues[id] : $scope.ues_list.other_ues[id];  
        $scope.id_ue = $stateParams.id_ue;

        $scope.loadList = function()
        {
            $scope.data = [];
            sessionService.get_session_list($scope,$stateParams.id_ue);
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
            sessionService.delete(sessionParam.id,$scope);
        }
        $scope.getPostIndex = function (post) {
            return  $scope.data.ue.sessions.indexOf(post); //this will return the index from the array
        }

    }])

    .controller('sessionFormController', ['$scope','sessionService', 'item', 'formType', '$stateParams', '$state', function($scope , sessionService, item, formType, $stateParams, $state){
        
        $scope.title = (formType === "CREATE") ? "Ajouter une session" : "Edition de la session";
        $scope.session_title = item.data.session.title || '';
        $scope.session_number = item.data.session.number || '';
        $scope.formType = formType;

        $scope.submit = function(){
            console.log("FDP");
            if($scope.formType === "CREATE"){
                $scope.add();
            }else{
                $scope.update();
            }
        }


        $scope.add = function()
        {
            sessionService.add($scope.session_title,$scope.session_number,$stateParams.id_ue).then(function successCallback(success){
                $scope.sessions.sessions.push(success.data.session);
                //console.log($scope.sessions.sessions);
                $state.go('ues.sessions');
            },
            function errorsCallback(error){
                console.log(error.data);
                /*$scope.ajouterUe.code_ue.$setValidity("size", false);
               $scope.error = error.data.error.message;*/
            });;
        }

        $scope.update = function()
        {

        }
 }
]);