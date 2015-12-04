/**
 * Created by qoder on 15-12-1.
 */
angular.module('myService', [])
    .factory('doList', function () {
        var data = $http.get('./message.json')
            .success(function (data) {
                return data;
            })
            .error(function () {
                console.log("error");
            })
        return {
            all: function () {
                var allFri = window.localStorage['persons'];
                if (allFri) {
                    return angular.fromJson(allFri);
                }
            },
            deteFri: function (index) {
                var item = angular.fromJson(window.localStorage['persons']);
                item.splice(index, 1);
                window.localStorage['persons'] = angular.toJson(item);
            },
            addFir: function (item) {
                window.localStorage['persons'] = angular.fromJson(window.localStorage['persons']).unshift(item)
            }
        }
    })