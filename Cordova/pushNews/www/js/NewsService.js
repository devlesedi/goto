(function () {
  function _NewsService($q, config, $http) {

    function getOne(id) {
      var deferred = $q.defer();

      $http.get(config.server + '/news/' + id)
        .success(function (data) {
          if (data.error || !data.news) {
            deferred.reject(data.error);
          }

          deferred.resolve(data.news);
        })
        .error(function () {
          deferred.reject('error');
        });

        return deferred.promise;
      }

      function getAll() {
        var deferred = $q.defer();

        $http.get(config.server + '/news')
          .success(function (data) {
            if (data.error || !data.news) {
              deferred.reject(data.error);
            }

            deferred.resolve(data.news);
          })
          .error(function () {
            deferred.reject('error');
          });

          return deferred.promise;
      }

      function add(entry) {
        return $http.post(config.server + '/news', entry).then(function(response) {
          return response.data;
        });
      };

      function update(entry) {
        return $http.put(config.server + '/news/' + entry.id, entry).then(function(response) {
          return response.data;
        });
      };

      return {
        one: getOne,
        all: getAll,
        add: add,
        update: update
      };
  }

  _NewsService.$inject = ['$q', 'Config', '$http'];

  angular.module('starter.services')
    .factory('NewsService', _NewsService);

})();