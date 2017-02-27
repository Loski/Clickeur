angular.module("abstractRepository", ['Restangular']).factory('abstractRepository', [function () {

    function abstractRepository(restangular, route) {
        this.restangular = restangular;
        this.route = route;
    }

    abstractRepository.prototype = {
        getList: function (params) {
            return this.restangular.all(this.route).getList(params);
        },
        get: function (id) {
            return this.restangular.one(this.route, id).get();
        },
        getView: function (id) {
            return this.restangular.one(this.route, id).one(this.route + 'view').get();
        },
        update: function (updatedResource) {
            return updatedResource.put();
        },
        create: function (newResource) {
            return this.restangular.all(this.route).post(newResource);
        }
        // etc.
    };

    abstractRepository.extend = function (repository) {
        repository.prototype = Object.create(abstractRepository.prototype);
        repository.prototype.constructor = repository;
    };

    return abstractRepository;
}]);