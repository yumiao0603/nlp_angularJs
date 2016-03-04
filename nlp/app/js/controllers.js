'use strict';

/* Controllers */

var graphCtrls = angular.module('graphCtrls', []);
graphCtrls.controller('AppCtrl', function ($scope, apiServices) {
    // 搜索
    $scope.searchKey = ""
    $scope.search = function(){
        var searchKey = $scope.searchKey

        // single entity
        if(searchKey.indexOf("&") === -1){
            //location.href = "/search/list?key=" + searchKey
        	location.href = "#/s/" + searchKey
        }

        // multiple entity
        else{
            // TODO multiple entity page
            location.href = "/r/" + searchKey
        }
    }

    $scope.searchByEnter = function(keyEvent) {
        if (keyEvent.which === 13){
            $scope.search()
        }
    }

    // TODO getSuggestion
    $scope.suggestions = []
    $scope.getSuggestion = function(){
        if($scope.searchKey !== ""){
            //apiServices.getSuggestion($scope.searchKey, function(data){
                //$scope.suggestions = data.result
            //})
        } else{
            $scope.suggestions = []
        }
    }

    $scope.hideSuggestion = function(){

        $scope.suggestions = []

    }

    $scope.preventBlur = function(e){

        e.preventDefault();

    }
});

graphCtrls.controller('subjectCtrl', function ($scope, $routeParams, Service, apiServices) {
    var keyword = $routeParams.keyword

    $scope.title = keyword
    $scope.subjectData = {}
    $scope.dataKeys = []
    
    $scope.loadingTextVisible = true
    

    // 获取数据
    apiServices.getEntityData(keyword, function(data, status){
    	$scope.loadingTextVisible = false
    	
        if(data.ret){
            $scope.subjectData = data.data
            $scope.dataKeys = Object.keys($scope.subjectData);

            setTimeout(function () {
                Service.drawGraphs(data.data)
            }, 500)
        } else{
            alert("服务器出了点问题")
        }

    })
});

graphCtrls.controller('relationCtrl', function ($scope, $routeParams, Service, apiServices) {
    var keyword = $routeParams.keyword,
        entityNames = keyword.split("&")

    $scope.title = keyword

    // 获取数据
    var entityLen = entityNames.length,
        entityArr = []
    for(var i = 0; i < entityLen; i++){
        var entityName = entityNames[i]

        ;(function(index){
            apiServices.getEntityData(entityName, function(data, status){
                entityArr.push(data)

                // 当所有数据获取完毕时开始渲染
                if(index === entityLen - 1){
                    Service.drawEntities(entityArr)
                }
            })
        })(i)
    }
});

graphCtrls.controller('searchListCtrl', function ($scope, $routeParams, Service, apiServices) {
    var searchKey = $routeParams.key

    $scope.resultList = []

    apiServices.search(searchKey, function(data){

        if(data.ret){

            $scope.resultList = data.data
        }
    })

});
