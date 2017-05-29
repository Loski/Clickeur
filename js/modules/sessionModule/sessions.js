/** Module UE **/
'use strict';

var session_module = angular.module('sessionModule', ['ngStorage','ui.router'])
    .factory('sessionService', ['$http',function($http){
        return{
            query: function($id){
                return $http({
                    method: 'GET',
                    //url:'http://127.0.0.1:8000/api/ues/'+$id+"/sessions/",
                    url:'https://132.227.116.252/serveur/public/api/ues/'+$id+"/sessions"
                });
            },
            delete: function($id){
                return $http({
                    method: 'DELETE',
                    //url:'http://127.0.0.1:8000/api/sessions/'+$id,
                    url:'https://132.227.116.252/serveur/public/api/sessions/'+$id
                });
            },

            add: function($title,$number,$id)
            {
                return $http({
                    method: 'POST',
                    //url:'http://127.0.0.1:8000/api/ues/'+$id+"/sessions/",
                     url:'https://132.227.116.252/serveur/public/api/ues/'+$id+"/sessions",
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
                    url:'https://132.227.116.252/serveur/public/api/sessions/'+$id,
                    data: "title="+$title+"&number="+$number,
                });
            }, 
            findMyUe: function(ueList, id){
                var myUe = this.findIndex(ueList.my_ues, id);
                return (myUe != -1) ? ueList.my_ues[myUe] : ueList.other_ues[this.findIndex(ueList.other_ues, id)];
            },
            findIndex: function(listeUe,id)
            {
                for(var i=0;i<listeUe.length;i++)
                {
                    if(listeUe[i].id==id)
                        return i;
                }
                return -1;
            }
            ,queryStudent: function(id_ue){
                return $http({
                    method: 'GET',
                    url:'https://132.227.116.252/serveur/public/api/sessions/'+id_ue,
                });
            }
        }
    }])
    .controller('sessionController', ['$scope', 'sessionService','$stateParams', 'ues_list', 'sessionsList','$state', 'modalService', function($scope, sessionService, $stateParams, ues_list, sessionsList,$state, modalService){
        $scope.title ='';
        $scope.number = '';
        $scope.ues_list = ues_list.data;
        $scope.id_ue = $stateParams.id_ue;
        $scope.myue = sessionService.findMyUe($scope.ues_list, $scope.id_ue);
        $scope.sessions = sessionsList.data['ue'].sessions;
        
        $scope.delete = function(sessionParam)
        {

            var modalOptions = {
                closeButtonText: 'Annuler',
                actionButtonText: 'Confirmer',
                headerText: 'Confirmation',
                bodyText: 'Êtes-vous sûr de vouloir supprimer cette session ?'
            };


            modalService.showModal({}, modalOptions).then(function (result) {
            var index = $scope.sessions.indexOf(sessionParam);
            sessionService.delete(sessionParam.id).then(function successCallback(success){ 
                $scope.sessions.splice(index,1);
                $state.go('app.ues.sessions');
            },
            function errorsCallback(error){
                console.log(error);
            });
            }, function errorsCallback(error){
                console.log(error);
            });
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

        $scope.findSeanceExistante = function(seance)
        {
            for(var i=0;i<$scope.sessions.length;i++)
            {
                if($scope.sessions[i].number==seance && $scope.indexOfSession!=i)
                    return true;
            }

            return false;
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
                $state.go('app.ues.sessions');
            }
        }

        $scope.alerts=[];

        $scope.addAlert = function(message) {
            $scope.alerts.push({msg: message});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };


        $scope.submit = function(){

            $scope.alerts=[];

            if($scope.findSeanceExistante($scope.session_number))
                $scope.addAlert("La séance "+$scope.session_number+" existe déjà");
            else
            {
                if($scope.formType === "CREATE"){
                    $scope.add();
                }else{
                    $scope.update();
                }
            }
        }

        $scope.add = function()
        {
            var id_ue = $stateParams.id_ue;
            sessionService.add($scope.session_title,$scope.session_number, id_ue).then(function successCallback(success){
                $scope.sessions.push(success.data.session);
                var id_session = success.data.session.id;
                $state.go('app.ues.sessions.questions', {id_ue:id_ue, id_session: id_session});
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
               var session = success.data.session;
               $scope.sessions[$scope.indexOfSession].title = session.title;
                $scope.sessions[$scope.indexOfSession].number = session.number;
                $state.go('app.ues.sessions');
            },
            function errorsCallback(error){
                console.log(error);
            });
        }

 }
]);