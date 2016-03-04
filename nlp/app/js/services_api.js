'use strict';
/**
 * Created by roscoe on 15/4/14.
 */

var apiServices = angular.module('apiServices', []).value('version', '0.1');

apiServices.factory("apiServices", function($http){
    var service = {}

    service.getRelations = function(key, callback){
        $http({
            url: 'relation.action',
            method: "GET",
            params: {title: key}
        }).success(function (data, status) {
            callback(data, status)
        }).error(function (data, status) {
            alert("出错了")
            console.log(status, data)
        });
    }

    service.getEntityData = function(key, callback){
        $http({
            url: 'commonaction.action',
            method: "GET",
            params: {title: key}
        }).success(function (data, status) {
            callback(data, status)
        }).error(function (data, status) {
            alert("出错了")
            console.log(status, data)
        });
    }

    service.getSuggestion = function(key, callback){
        $http({
            url: 'api/suggestion',
            method: "GET",
            params: {keyword: key}
        }).success(function (data, status) {
            callback(data, status)
        }).error(function (data, status) {
            alert("出错了")
            console.log(status, data)
        });
    }

    service.search = function(key, callback){
        $http({
            url: 'api/search',
            method: "GET",
            params: {keyword: key}
        }).success(function (data, status) {
            callback(data, status)
        }).error(function (data, status) {
            alert("出错了")
            console.log(status, data)
        });
    }

    return service
})