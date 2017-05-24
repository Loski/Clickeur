var student = angular.module('Student', [])
    .controller('studentController', ['$scope', '$stateParams', 'students', function($scope, $stateParams, students){
        $scope.students = students.data.users;
        console.log($scope.students);
  	}]);