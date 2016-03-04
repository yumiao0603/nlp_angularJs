'use strict';

/* Services */

var graphServices = angular.module('graphServices', []).value('version', '0.1');

var CONTENT_WIDTH = 942,
    SECTION_HEIGHT = 350,
    URL = location.href

graphServices.factory('Service', function (apiServices) {
    var service = {}

    service.drawGraphs = function (data) {

        angular.forEach(data, function (graphData, key) {
            // 主题分类
            if(key === "subjectType"){
                switch (graphData) {
                    case "city":
                        //getCityInfo(graphData);
                        break;
                    default :
                        break;
                }
            }

            // 内容
            if(graphData !== null){
            	switch (graphData.type) {
	                case "relations":
	                    drawRelations(graphData, apiServices);
	                    break;
	                case "timeline":
	                    drawTimeline(graphData);
	                    break;
	                case "map":
	                    drawMap(graphData);
	                    break;
	                case "bar":
	                    drawBar();
	                    break;
	                case "pie":
	                    drawPie();
	                    break;
	                case "line":
	                    drawLine();
	                    break;
	                default :
	                    break;
	            }
            }
        })
    }

    service.drawEntities = function(entities){

        var width = 960,
            height = 500

        var svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

        var force = d3.layout.force()
            .gravity(.05)
            .distance(200)
            .charge(-1000)
            .size([width, height])
            .friction(0.8)

        var nodeData = {
            "nodes":[
                {"name":"上海", "type": "entity", "radius":6,"icon": "img/shanghai.jpg"},
                {"name":"北京", "type": "entity", "radius":6,"icon": "img/beijing.jpg"},
                {"name":"城市", "type": "relation", "radius":2,"icon": "img/icon_node_bg.png"},
                {"name":"中国", "type": "relation", "radius":2,"icon": "img/icon_node_bg.png"},
                {"name":"季风", "type": "relation", "radius":2,"icon": "img/icon_node_bg.png"}
            ],
            "links":[
                {"source":0,"target":2,"value":1},
                {"source":0,"target":3,"value":8},
                {"source":0,"target":4,"value":10},
                {"source":1,"target":2,"value":1},
                {"source":1,"target":3,"value":8},
                {"source":1,"target":4,"value":10},
            ]
        }

        force
            .nodes(nodeData.nodes)
            .links(nodeData.links)
            .distance(240)
            .start();

        var link = svg.selectAll(".link")
            .data(nodeData.links)
            .enter().append("line")
            .attr("class", "link");

        var node = svg.selectAll(".node")
            .data(nodeData.nodes)
            .enter().append("g")
            .attr("class", "node")
            .call(force.drag);

        node.append("image")
            .attr("xlink:href", function(d) { return d.icon })
            .attr("x", function(d) { return - d.radius * 32 * 0.5 })
            .attr("y", function(d) { return - d.radius * 32 * 0.5 })
            .attr("width", function(d) { return d.radius * 32 })
            .attr("height", function(d) { return d.radius * 32 });

        node.append("rect")
            .attr("dy", ".35em")
            .attr("x", function(d) { return - d.radius * 32 * 0.5 })
            .attr("y", function(d) { return d.radius * 32 * 0.25 })
            .attr("width", function(d) { return d.type === "entity" ? d.radius * 32 : 0 })
            .attr("height", function(d) { return d.type === "entity" ? 30 : 0 })
            .style("fill","#fff")

        node.append("text")
            .attr("dy", function(d) { return d.type === "entity" ? "3.8em" : ".35em" })
            .text(function(d) { return d.name })
            .style("fill", function(d) { return d.type === "entity" ? "#444" : "#fff" })

        force.on("tick", function() {
            link.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

    }

    return service
})

function drawBar(){
    require.config({
        paths: {
            echarts: "js/lib/echarts/build/dist"
        }
    });

    // 使用
    require(
        [
            'echarts',
            'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('bar'));

            var option = {
                tooltip: {
                    show: true
                },
                legend: {
                    data:['评分']
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ["1分","2分","3分","4分","5分"]
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        "name":"评分",
                        "type":"bar",
                        "data":[500, 1000, 1500, 3000, 4000]
                    }
                ]
            };

            // 为echarts对象加载数据
            myChart.setOption(option);
        }
    );
}

function drawPie(){
    require.config({
        paths: {
            echarts: 'js/lib/echarts/build/dist'
        }
    });

    // 使用
    require(
        [
            'echarts',
            'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('pie'));

            var option = {
                calculable : true,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:500, name:'1分'},
                            {value:1000, name:'2分'},
                            {value:1500, name:'3分'},
                            {value:3000, name:'4分'},
                            {value:4000, name:'5分'}
                        ]
                    }
                ]
            };

            // 为echarts对象加载数据
            myChart.setOption(option);
        }
    );
}

function drawLine(){
    require.config({
        paths: {
            echarts: "js/lib/echarts/build/dist"
        }
    });

    // 使用
    require(
        [
            'echarts',
            'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('line'));

            var option = {
                title : {
                    text: '未来一周气温变化'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['最高气温','最低气温']
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} °C'
                        }
                    }
                ],
                series : [
                    {
                        name:'最高气温',
                        type:'line',
                        data:[11, 11, 15, 13, 12, 13, 10],
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    },
                    {
                        name:'最低气温',
                        type:'line',
                        data:[1, -2, 2, 5, 3, 2, 0],
                        markPoint : {
                            data : [
                                {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name : '平均值'}
                            ]
                        }
                    }
                ]
            };

            // 为echarts对象加载数据
            myChart.setOption(option);
        }
    );
}

function drawTimeline(graphData) {
    var timeDataArr = []

    angular.forEach(graphData, function (time, event) {
        if (event !== "type") {
            var timeSplitArr = time.split(".", 3),
                date = new Date("1960", "1", "1")

            if (timeSplitArr.length === 1) {
                date.setFullYear(timeSplitArr[0])
            }
            if (timeSplitArr.length === 2) {
                date.setMonth(timeSplitArr[1])
            }

            timeDataArr.push({
                "color": "green",
                "label": event,
                "starting_time": date.getTime(),
                "ending_time": 1422580042874
            })

        }
    })

    //timeline
    var labelColorTestData = [
        {
            times: timeDataArr
        }
    ];

    var width = 900;

    function timelineRect() {
        var chart = d3.timeline()
            .tickFormat( //
            {
                format: d3.time.format("%Y"),
                tickTime: d3.time.years,
                tickInterval: 3,
                tickSize: 20
            })
            .display("circle"); // toggle between rectangles and circles

        var svg = d3.select(".timeline").append("svg").attr("width", width)
            .datum(labelColorTestData).call(chart);
    }

    timelineRect()
}

function drawMap(graphData){
    // 百度地图API功能
    var map = new BMap.Map("allmap");
    map.centerAndZoom(new BMap.Point(graphData.longitude, graphData.latitude),  graphData.zoom);
}

function drawRelations(ret, apiServices){
	URL = location.href
	
    // Data Defination
    var data = [],
    	nodesId = 1;

    // 参数
    var nodeRadius = 30,
        colorTheme = "#e13c6e",
        fillAnimation = [],
        width = CONTENT_WIDTH,
        height = 250

    // Get link data
    data.forEach(function (item) {
        item.clickable = true
    })
    
    var hoverNodeIndex = null
    
    var svg = d3.select(".expansion").select("svg")
            .attr("width", width)
            .attr("height", height),
        fill = d3.scale.category10()

    var nodes = [],
        links = [],
        foci = [{x: 0, y: 150}, {x: 350, y: 150}, {x: 200, y: 150}],
        defs = svg.append("defs").attr("id", "imgdefs")


    var node = svg.selectAll("g"),
        link = svg.selectAll('.link')

    var force = d3.layout.force()
        .nodes(nodes)
        .links(links)
        .charge(-3000)
        .linkDistance(width / 5)
        .gravity(0.2)
        .friction(0.8)
        .size([width, height * 3])
        .on("tick", tick);

    var path = svg.append("g").selectAll("path")
    var marker = svg.append("defs").append("marker")
        .attr("id", location.hash.substring(1) + "arrow")
        .attr("class", "marker-white")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", nodeRadius + 6)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");
    
    var markerActive = svg.append("defs").append("marker")
	    .attr("id", location.hash.substring(1) + "arrowActive")
	    .attr("class", "marker-active")
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", nodeRadius + 6)
	    .attr("refY", 0)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	    .append("path")
	    .attr("d", "M0,-5L10,0L0,5");

    // 准备图片
    var dataLen = data.length
    for(var i = 0; i < dataLen; i++){
        // 图片包装
        var imgWrap = defs.append("pattern")
            .attr("id", "expansionid_" + data[i].id)
            .attr("height", 1)
            .attr("width", 1)
            .attr("x", "0")
            .attr("y", "0")

        // 加入图片
        imgWrap.append("svg:image")
            .attr("class", "avatar")
            .attr("xlink:href", data[i].avatar)
            .attr("width", nodeRadius * 2 + "px")
            .attr("height", nodeRadius * 2 + "px")
    }

    // 单个帧动作
    function tick(e) {
        var k = .1 * e.alpha;

        // Push nodes toward their designated focus.
        nodes.forEach(function (o) {
            o.y += (foci[1].y - o.y) * k;
            o.x += (foci[1].x - o.x) * k;
        });

        node.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        path.attr("d", function(d){
        	if(typeof d.source.x !== "undefined"){
        		return "M" + d.source.x  + "," + d.source.y + " L" + d.target.x + "," + d.target.y;
        	}
        });
    }
    
    setInterval(function(){
    	path = path.data(force.links())
    	var paths = path[0]
    	angular.forEach(paths, function(item){
    		var pathData = item["__data__"]
    		if(pathData.source.id === hoverNodeIndex){
    			d3.select(item).style("stroke", "#e13c6e").attr('marker-end', "url(" + URL + "arrowActive)")
    		} else{
    			d3.select(item).style("stroke", "#fff").attr('marker-end', "url(" + URL + "arrow)")
    		}
    	})
    })

    // 加入第一个点
    var entityName = d3.select("#entity_name")[0][0].innerHTML
    var sourceNode = {
        "id": 0,
        "name": entityName,
        "relation": "",
        "group": [],
        "clickable": false
    }

    data[0] = sourceNode
    var item = data[0];
    nodes.push(item);
    node = node.data(nodes);

    // 加入与第一个节点连接的节点
    var relatedNodes = ret.data
    angular.forEach(relatedNodes, function(relation, i){
    	relation.id = nodesId++
    	
        relation.group = []

        data[relation.id] = relation
        data[0].group.push(relation.id)

    })
    
    addRelations(0)

    function getInvitedPeople(nodeIndex) {

        apiServices.getRelations(data[nodeIndex].name, function(result){
            if(result.ret){
                var relations = result.data

                angular.forEach(relations, function(relation){
                	relation.id = nodesId++
                	
                    relation.group = []
        			
                	
                	if(typeof data[relation.id] === "undefined" && relation.name !== entityName){
                		data[relation.id] = relation
                        data[nodeIndex].group.push(relation.id)
                	} else{
                		if(relation.name === entityName){
                			links.push({source: nodeIndex, target: 0})
                		} else{
                			links.push({source: nodeIndex, target: relation.id})
                		}
                		
                		var timeStamp = "_" + Date.now()
                		path = path.data(force.links());
                        path.exit().remove();
                        path.enter().append("path")
                            .attr("id", location.hash.substring(1) + "path" + relation.id + timeStamp)
                            .attr("class", "link")
                            .style("stroke-width", "2px")
                            .style("stroke", "#e13c6e")
                            .attr("marker-end", "url(" + URL + "arrow)");

                        if(relation.relation !== ""){
                            // Add a text label.
                            var text = svg.append("text")
                                .attr("dx", 80)
                                .style("font-size", "14")

                            text.append("textPath")
                                .attr("xlink:href", URL + "path" + relation.id + timeStamp)
                                .text(relation.relation);
                        }
                	}
                })
                
                addRelations(nodeIndex)
            }
        })
    }

    function addRelations(nodeIndex){
        var inviteNodeGroup = data[nodeIndex]["group"]

        var counter = 0
        

        // 逐点加入
        var timer = setInterval(function () {

            if (counter > inviteNodeGroup.length - 1) {
                clearInterval(timer);
                return;
            }

            // 获取下一个节点
            var inviteNode = data[inviteNodeGroup[counter]];

            nodes.push(inviteNode);
            node = node.data(nodes);

            // 获取下一个链接并加入
            links.push({source: nodeIndex, target: nodes.length - 1});

            // Compute the data join. This returns the update selection.
            path = path.data(force.links());

            // Remove any outgoing/old paths.
            path.exit().remove();

            // Compute new attributes for entering and updating paths.
            path.enter().append("path")
                .attr("id", location.hash.substring(1) + "path" + inviteNode.id)
                .attr("class", "link")
                .style("stroke-width", "2px")
                .style("stroke", "#fff")
                .attr("marker-end", "url(" + URL + "arrow)");

            if(inviteNode.relation !== ""){
                // Add a text label.
                var text = svg.append("text")
                    .attr("dx", 80)
                    .style("font-size", "14")

                text.append("textPath")
                    .attr("xlink:href", URL + "path" + inviteNode.id)
                    .text(inviteNode.relation);
            }

            redraw()
            counter++;

        }, 200);
    }

    function resize() {
        width = document.body.clientWidth;
        force.size([width, height]);
        force.start();
    }

    function redraw() {
        // 重新开始
        force.start();

        // 包装节点
        var n = node.enter().append("g")
            .attr("class", "node")
            .attr("data-index", function (d){
                return d.id
            })
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .style('cursor', 'pointer')
            .on('click', function (d) { //点击
                var nodeIndex = d.id,
                    clickable = data[d.id].clickable

                if(clickable === true || clickable === "true"){
                    getInvitedPeople(nodeIndex)
                    data[nodeIndex]["clickable"] = false
                }
            })
            .on('mouseenter', function(d){
                var sel = d3.select(this);
                hoverNodeIndex = d.id
                sel.selectAll("circle").attr("r", nodeRadius * 1.2).style({
                    "stroke": colorTheme,
                    'stroke-width': 2
                });
            })
            .on('mouseout', function(d){
                var sel = d3.select(this);
                hoverNodeIndex = null
                sel.selectAll("circle").attr("r", nodeRadius).style({
                    "stroke":"#999",
                    'stroke-width': 2
                });
            })
            .call(force.drag); // 监听拖动

        //为节点加入circle
        n.append("circle")
            .attr("r", nodeRadius)
            .style("fill", function (d) {
                return "url(" + URL + "#expansionid_" + d.id + ")";
            })

        // 节点活动遮罩
        var circleMasks = n.append("circle")
            .attr("r", nodeRadius)
            .style("fill", colorTheme)
            .style("fill-opacity", "0")

        // 文字背景
        var circleMasks = n.append("circle")
            .attr("r", nodeRadius)
            .style("fill", "#000")
            .style("fill-opacity", "0.3")

        // 为节点加入文字
        n.append("text")
            .text(function (d) {
                return d.name;
            })
            .style("font-size", function () {
                return 14;
//                    return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 16) + "px";
            })
            .attr("dy", ".35em");

        // 重新append source node
        var sourceNodeArr = document.querySelectorAll(".node"),
            sourceNodeArrlen = sourceNodeArr.length;

        fillAnimation.forEach(function(i){
            clearInterval(i)
        })

        for (var i = 0; i < sourceNodeArrlen; i++) {
            // 重新append到后面，以覆盖箭头连线
            sourceNodeArr[i].parentNode.appendChild(sourceNodeArr[i]);

            // 获取节点对应的index
            var nodeIndex = d3.select(sourceNodeArr[i]).attr("data-index")

            // 检测data中group不为空 && 可点击的节点
            if(data[nodeIndex].clickable === true || data[nodeIndex].clickable === "true"){
            	
                // 获取节点的circle
                var selectNode = d3.select(sourceNodeArr[i]),
                    childCircle = d3.select(selectNode[0][0]["childNodes"][1]),
                    animationTime = 1500

                // 设置动画
                var circleSpark = function(circle){
                    circle.transition()
                        .style("fill-opacity", 0.9)
                        .duration(animationTime / 2)
                        .transition()
                        .style("fill-opacity", 0.0)
                        .duration(animationTime)
                }

                circleSpark(childCircle)
                fillAnimation[nodeIndex] = setInterval((function(circle){
                    return function(){
                        circleSpark(circle)
                    }
                })(childCircle), animationTime * 1.5)
            }
        }
    }
}