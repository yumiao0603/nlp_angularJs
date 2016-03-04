'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('myApp', [
    'ngRoute',
    'graphCtrls',
    'myApp.filters',
    'graphServices',
    'apiServices',
    'myApp.directives'
]).config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/s/:keyword', {
        templateUrl: 'partials/subject.html',
        controller: 'subjectCtrl',
        resolve: {
            // 延迟页面加载并显示动画
            //delay: function($q, $timeout) {
            //  var delay = $q.defer();
            //  $timeout(delay.resolve, 1000);
            //  return delay.promise;
            //}
        }
    }).when('/r/:keyword', {
        templateUrl: 'partials/relation.html',
        controller: 'relationCtrl'
    }).when('/search/list', {
        templateUrl: 'partials/search_list.html',
        controller: 'searchListCtrl'
    }).otherwise({
        templateUrl: 'partials/home.html',
        redirectTo: '/'
    });

});

