/** Module Connexion **/
'use strict';

var connexionModule = angular.module('connexionUser', ['ngStorage', 'userAuthModule'])
    .factory('connexionModule', ['$localStorage', '$http', 'userAuth', function($localStorage, $http, userAuth){
        return{
            login : function(usernameUser, passwordUser){
                var that = this;
                $http({
                	method: 'POST',
                	url:'http://127.0.0.1:8000/api/auth',
        			data: "username="+usernameUser+"&password="+passwordUser,
 		   		}).then(that.successLogin.bind(that), that.errorLogin);
            },
            logout : function(){
              //  $http.get('http://127.0.0.1:8000/api/auth', {token: $localStoragetoken});
                $localStorage = {};
            },
            successLogin : function(response){
                userAuth.saveToken(response.data.token);
            },
            errorLogin : function(response){
                console.log('michel');
            },
            getUser: function(){
                $http.get('http://127.0.0.1:8000/api/user');
            },
        }
    }])
    .controller('connexion', ['$scope', 'connexionModule', function($scope, connexionModule){
    $scope.password ='';
    $scope.username = '';
    $scope.login = function(){
        connexionModule.login($scope.username, $scope.password);
    }
}]);

var informationUser = angular.module('userAuthModule', ['ngStorage'])
.factory('userAuth', ['$localStorage', function($localStorage){
    return{
            getToken: function(){
                return $localStorage.token;
            },
            parseJwt: function(token) {
              var base64Url = token.split('.')[1];
              var base64 = base64Url.replace('-', '+').replace('_', '/');
              return JSON.parse($window.atob(base64));
            },
            isIdentified : function(){
                var token = this.getToken();
                if(token) {
                    var params = this.parseJwt(token);
                    return Math.round(new Date().getTime() / 1000) <= params.exp;
                } else {
                    return false;
                }
            },
            saveToken : function(token){
                $localStorage.token = token;
            },
            logout : function(){
              //  $http.get('http://127.0.0.1:8000/api/auth', {token: $localStoragetoken});
                $localStorage = {};
                console.log($localStorage.token + "delete");
            },
        }
}])