/** Module UE **/
'use strict';

var session_module = angular.module('sessionModule', ['ngStorage','ui.router'])
    .factory('sessionService', ['$http',function($http){
        return{
            query: function($id){
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/ues/'+$id+"/sessions/",
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/ues/'+$id+"/sessions"
                });
            },
            delete: function($id){
                return $http({
                    method: 'DELETE',
                    //url:'http://127.0.0.1:8000/api/sessions/'+$id,
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/sessions/'+$id
                });
            },

            add: function($title,$number,$id)
            {
                return $http({
                    method: 'POST',
                    //url:'http://127.0.0.1:8000/api/ues/'+$id+"/sessions/",
                     url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/ues/'+$id+"/sessions",
                    data: "title="+$title+"&number="+$number,
                });
            },

            getNew: function(){
                var item = {};
                item.data = {};
                item.data.session = {};
                return item;
            },
            update: function($title,$number, $id)
            {
                return $http({
                    method: 'PUT',
                    //url:'http://127.0.0.1:8000/api/sessions/'+$id,
                    url:'http://ec2-54-85-60-73.compute-1.amazonaws.com/api/sessions/'+$id,
                    data: "title="+$title+"&number="+$number,
                });
            }, 
            findMyUe: function(ueList, id){
                var myUe = ueList.my_ues.find(this.findById, 0, id);
                return (myUe != undefined) ? myUe : ueList.other_ues.find(this.findById, 0, id);
            },
            findById: function(listeUe, index, id){
                console.log(id);
                return listeUe.id == id;
            }
        }
    }])
    .controller('sessionController', ['$scope', 'sessionService','$stateParams', 'ues_list', 'sessionsList', function($scope, sessionService, $stateParams, ues_list, sessionsList){
        $scope.title ='';
        $scope.number = '';
        $scope.ues_list = ues_list.data;
        $scope.id_ue = $stateParams.id_ue;
        $scope.myue = sessionService.findMyUe($scope.ues_list, $scope.id_ue);
        $scope.sessions = sessionsList.data['ue'].sessions;
        console.log($scope.myue);

        $scope.delete = function(sessionParam)
        {
            var index = $scope.sessions.indexOf(sessionParam);

            sessionService.delete(sessionParam.id).then(function successCallback(success){ 
                $scope.sessions.splice(index,1);
                $state.go('ues.sessions');
            },
            function errorsCallback(error){
                console.log(error.data);
            });;
        }

    }])

    .controller('sessionFormController', ['$scope','sessionService', 'formType', '$stateParams', '$state',function($scope , sessionService, formType, $stateParams, $state){
        
        $scope.findIndex = function(id)
        {
            for(var i=0;i<$scope.sessions.length;i++)
            {
                if($scope.sessions[i].id==id)
                    return i;
            }

            return -1;
        }

        $scope.title = (formType === "CREATE") ? "Ajouter une session" : "Edition de la session";
        $scope.formType = formType;
        //$scope.sessions = sessionsList.data['ue'];

        if($scope.formType!== "CREATE")
        {
            $scope.indexOfSession = $scope.findIndex($stateParams.id_session);

            if($scope.indexOfSession!=-1)
            {
                $scope.session_title = $scope.sessions[$scope.indexOfSession].title;
                $scope.session_number = parseInt($scope.sessions[$scope.indexOfSession].number);
            }

            else
            {
                $state.go('ues.sessions');
            }
        }

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
                $scope.sessions.push(success.data.session);
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
            sessionService.update($scope.session_title,$scope.session_number,$stateParams.id_session).then(function successCallback(success){
                $scope.sessions[$scope.indexOfSession] = success.data.session;
                $state.go('ues.sessions');
            },
            function errorsCallback(error){
            });;
        }
 }
]);