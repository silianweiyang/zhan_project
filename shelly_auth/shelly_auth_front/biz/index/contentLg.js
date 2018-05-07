define(["jquery", "common", "wandaComp", "wandaCompR", "jqueryCorner", "echarts","d3","compont"], function ($, common, wandaComp, wandaCompR, jqueryCorner, ec,d3,compont) {
    var resizeWorldMapContainer = function (Dom,rightTotalWidth) {
        Dom.style.height = (window.innerHeight-40)/3+'px';
    };
    //左侧第一个  应用调用API次数
    var chart1 = {
        init: function (param,time) {
            var chart1Dom = document.getElementById('chart1');
            resizeWorldMapContainer(chart1Dom);
            var myChart = ec.init(chart1Dom);
            var title = "API调用次数TOP5";
            if("1" == param){
                title = "订阅API调用次数TOP5";
            }
            var successFun = function (data) {
                var y_datas=[];
                for(var i=0;i<data["data"].length;i++ ){
                    y_datas.push({
                        name:data["data"][i],
                        value:i+1
                    });
                }
                var color = ['#0071d6','#8a47be','#5bd5e7','#6cba5f','#ffe866','#fc7e3a','#fe5f5f'];
                var option = {
                    backgroundColor : "#fff",
                    title: {
                        text: title,
                        textStyle:{
                            fontSize:12
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params, ticket, callback) {
                            var name="";
                            for (var i in y_datas){
                                if( params[0].name==y_datas[i].value){
                                    name=y_datas[i].name;
                                    break;
                                }
                            }
                            var res = name;
                            for (var i = 0;i <params.length; i++) {
                                res += ' : ' + params[i].value ;//鼠标悬浮显示的字符串内容
                            }
                            setTimeout(function () {
                                // 仅为了模拟异步回调
                                callback(ticket, res);
                            }, 1000)
                            return res;
                        }
                    },
                    grid: {top:'15%', left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: {type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine: { lineStyle: { width: 2, color: '#666'} }
                    },
                    yAxis: {
                        type: 'category',
                        axisLine: { lineStyle: { width: 2, color: '#666'} },
                        data: y_datas
                    },
                    series: [
                        {
                            type: 'bar',
                            barMaxWidth:15,
                            barWidth:'40%',
                            itemStyle: {
                                normal: {
                                    color: new ec.graphic.LinearGradient(
                                        0, 0, 1, 1,
                                        [
                                            {offset: 0, color: '#2b9bff'},
                                            {offset: 1, color: '#5ad4e7'}
                                        ]
                                    )
                                },
                            },
                            data: data["value"]
                        }
                    ]
                };
                myChart.setOption(option);
                $("#chart1").resize(function(){
                    myChart.resize();
                });
            }
            var chart1Param = {
                "invokeType":param,
                "cycleTime":time
            }
            common.ajaxGet("api/firstReport/gateServiceInvokApiNum", chart1Param, successFun, null, null, $("#consumerMgr"));
        }
    };
    //左侧第二个  API调用者 应用调用API的故障信息
    var chart2 = {
        init: function (param,time) {
            var chart2Dom = document.getElementById('chart2');
            resizeWorldMapContainer(chart2Dom);
            var myChart = ec.init(chart2Dom);
            var successFun = function (data) {
                var color = ['#fc7e3a','#5bd5e7','#2a9aff','#c766ff','#6cba5f','#0071d6'],normalColor = "";
                var option = {
                    backgroundColor : "#fff",
                    color:color,
                    title : {
                        text: '订阅API故障信息',
                        textStyle:{
                            fontSize:12
                        }
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    grid: {top:'15%', left: '3%', right: '6%', bottom: '3%', containLabel: true},
                    xAxis : [
                        {
                            type : 'category',
                            nameLocation:'start',
                            splitLine : {show:true,lineStyle: { type :'dotted',color: ['#433a65'] } },
                            axisLine: { lineStyle: { width: 2, color: '#666'} },
                            boundaryGap: false,
                            data : data["data"]
                        }
                    ],
                    yAxis : [{
                        type : 'value',
                        splitLine : {show:true,interval :0,lineStyle: { type :'dotted',color: ['#555688'] } },
                        axisLine: { lineStyle: { width: 2, color: '#666'} },
                    }],
                    series : [
                        {
                            name:'故障信息',
                            type:'line',
                            areaStyle: {normal: {}},
                            data:data["value"]
                        }
                    ]
                };
                myChart.setOption(option);
                $("#chart2").resize(function(){
                    myChart.resize();
                });
            }
            var chart2Param = {
                "invokeType":param,
                "cycleTime":time
            }
            common.ajaxGet("api/firstReport/gateApiInvokFault", chart2Param, successFun, null, null, $("#consumerMgr"));
        }
    };
    //左侧第二个图  API提供者的API故障饼图
    var chart5 = {
        init: function (param,time) {
            var chart5Dom = document.getElementById('chart2');
            resizeWorldMapContainer(chart5Dom);
            var myChart = ec.init(chart5Dom);
            var successFun = function (data) {
                var option = {
                    backgroundColor : "#fff",
                    color:['#5bd5e7','#fda44a','#fc7e3a','#b0e917','#129398','#ffe866','#2a9aff','#c766ff','#ff66fd','#fe5f5f','#a70e0e','#194de3','#7d8593','#3862c3','#a4cec0'],
                    title : {
                        text: 'API故障',
                        x:'left',
                        textAlign:'left',
                        textStyle:{
                            fontSize:12
                        }
                    },
                    tooltip: {trigger: 'item', formatter: "{b}: {c} ({d}%)"},
                    legend: {type: 'scroll', orient: 'vertical', x: 'left', y: 'center', itemWidth : 20, itemHeight :8, data:data.data},
                    series: [
                        {
                            type:'pie',
                            center:['65%', '50%'],
                            radius: ['50%', '70%'],
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data:data.value
                        }
                    ]
                }
                myChart.setOption(option);
                $("#chart2").resize(function(){
                    myChart.resize();
                });
            }
            var chart2Param = {
                "invokeType":param,
                "cycleTime":time
            }
            common.ajaxGet("api/firstReport/gateApiInvokFault", chart2Param, successFun, null, null, $("#consumerMgr"));
        }
    }
    //左侧第三个  API调用耗时前TOP5
    var chart3 = {
        init: function (param,time) {
            var chart3Dom = document.getElementById('chart3');
            resizeWorldMapContainer(chart3Dom);
            var myChart = ec.init(chart3Dom);
            var title = "API耗时TOP5";
            if("1" == param){
                title = "订阅API耗时TOP5";
            }
            var successFun = function (data) {
                var y_datas=[];
                for(var i=0;i<data["data"].length;i++ ){
                    y_datas.push({
                        name:data["data"][i],
                        value:i+1
                    });
                }
                var option = {
                    backgroundColor : "#fff",
                    title: {
                        text: title,
                        textStyle:{
                            fontSize:12
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params, ticket, callback) {
                            var name="";
                            for (var i in y_datas){
                                if( params[0].name==y_datas[i].value){
                                    name=y_datas[i].name;
                                    break;
                                }
                            }
                            var res = name;
                            for (var i = 0;i <params.length; i++) {
                                res += ' : ' + params[i].value ;//鼠标悬浮显示的字符串内容
                            }
                            setTimeout(function () {
                                // 仅为了模拟异步回调
                                callback(ticket, res);
                            }, 1000)
                            return res;
                        }
                    },
                    grid: {top:'15%', left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine: { lineStyle: { width: 2, color: '#666'} },
                    },
                    yAxis: {
                        type: 'category',
                        axisLine: { lineStyle: { width: 2, color: '#666'} },
                        data: y_datas
                    },
                    series: [
                        {
                            type: 'bar',
                            barMaxWidth:15,
                            barWidth:'40%',
                            itemStyle: {
                                normal: {
                                    color: new ec.graphic.LinearGradient(
                                        0, 0, 1, 1,
                                        [
                                            {offset: 0, color: '#ea3448'},
                                            {offset: 1, color: '#ff6f6f'}
                                        ]
                                    )
                                }
                            },
                            data: data["value"]
                        }
                    ]
                };
                myChart.setOption(option);
                $("#chart3").resize(function(){
                    myChart.resize();
                });
            }
            var chart3Param = {
                "invokeType":param,
                "cycleTime":time
            }
            common.ajaxGet("api/firstReport/gateApiInvokTimeTop", chart3Param, successFun, null, null, $("#consumerMgr"));
        }
    };
    //中间 应用与API服务之间的关系图
    var chart4 = {
        init:function(param){
            var circleColor = "#64a4e3";
            if("1" == param){
                circleColor = '#64a4e3';
            }
            var changeWidthDOM = document.getElementById("chart4").offsetWidth;
            var margin = {top: 35, right: 20, bottom: 0, left: 120},
                width = changeWidthDOM - margin.right - margin.left,
                height = window.innerHeight-78-margin.top;

            var i = 0,
                duration = 400,
                root;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.y, d.x]; });

            var svg = d3.select("#chart4").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var update = function (source) {
                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                $.each(nodes,function (index,d) {
                    d.y = d.depth * (140*changeWidthDOM/720);
                })

                // Update the nodes…
                var node = svg.selectAll("g.node")
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    .on("click", click);

                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function(d) {
                        return d._children ? circleColor : "#fff"; });
                /*nodeEnter.append("svg:image")
                 .attr("xlink:href", "https://github.com/favicon.ico")
                 .attr("x", -8)
                 .attr("y", -8)
                 .attr("width", 16)
                 .attr("height", 16);*/

                nodeEnter.append("text")
                    .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                    .attr("dy", ".35em")
                    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                    .text(function(d) {
                        //alert(d.name);
                        return d.name;
                    })
                    .style("fill-opacity", 1e-6);

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function(d) {
                        if(d.connectState){
                            if(d.connectState == "0"){
                                return "#64a4e3";
                            }else if(d.connectState == "1"){
                                return "#90ee90";
                            }else if(d.connectState == "2"){
                                return "#fda44a";
                            }else if(d.connectState == "3"){
                                return "#ff0000";
                            }
                        }
                        return d._children ? circleColor : "#fff";
                    })
                    .style("-webkit-animation",function (d) {
                        if(d.connectState == "3"){
                            return "blink .95s linear infinite";
                        }
                    })
                ;

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links…
                var link = svg.selectAll("path.link")
                    .data(links, function(d) { return d.target.id; });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                $.each(nodes,function (index,d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                })

                //link.append("text").attr("x",20).attr("y",30).text("订阅");
            };
            var click = function (d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                    update(d);
                } else {
                    if(d.depth == 1){
                        $.each(root.children,function (index,val) {  //只显示一层
                            if(d["key"] != val["key"]){
                                collapse(val);
                            }else{
                                expand(val);
                            }
                        });
                        update(root);
                    }else{
                        d.children = d._children;
                        d._children = null;
                        update(d);
                    }
                }
            };
            var expand = function (d) {
                if (d._children) {
                    d.children = d._children;
                    $.each(d.children,function (index,val) {
                        expand(val);
                    })
                    d._children = null;
                }
            };
            var collapse = function(d) {
                if (d.children) {
                    d._children = d.children;
                    $.each(d._children,function (index,val) {
                        collapse(val);
                    })
                    d.children = null;
                }
            };
            var convertData = function (data) {
                var tempChild = [];
                for(var j=0;j<data.length;j++){
                    var tempData = {};
                    tempData["name"] = data[j]["name"];
                    tempData["key"] = data[j]["id"];
                    tempData["connectState"] = data[j]["connectState"];
                    if(data[j]["children"] && data[j]["children"].length>0){
                        tempData["children"] = convertData(data[j]["children"]);
                    }
                    tempChild[j] = tempData;
                }
                return tempChild;
            };
            var successFun = function (data) {
                var endData = {};
                if(data["datas"]){
                    endData["name"] = data.datas[0]["name"];
                    endData["key"] = data.datas[0]["id"];

                    if(data.datas[0]["children"] && data.datas[0]["children"].length>0){
                        endData["children"] = convertData(data.datas[0]["children"]);
                    }else{
                        endData["children"] = [];
                    }
                    root = endData;
                    root.x0 = height / 2;
                    root.y0 = 0;

                    $.each(root.children,function (index,val) {  //只显示一层
                        if(index>0){
                            collapse(val);
                        }
                    });
                    update(root);
                }
            }
            if("2" == param){
                $("#chart4").append("<div style='text-align: center;font-weight:bold;margin-top:10px;font-size:15px'>共享服务管理平台<i class=\"fa fa-long-arrow-right fa_icon\" style='color:"+circleColor+";vertical-align: middle;padding: 0px 10px'></i>应用<i class=\"fa fa-long-arrow-right fa_icon\" style='color:"+circleColor+";vertical-align: middle;padding: 0px 10px'></i>发布的API<i class=\"fa fa-long-arrow-right fa_icon\" style='color:"+circleColor+";vertical-align: middle;padding: 0px 10px'></i>订阅的应用</div>");
            }else{
                $("#chart4").append("<div style='text-align: center;font-weight:bold;margin-top:10px;font-size:15px'>共享服务管理平台<i class=\"fa fa-long-arrow-right fa_icon\" style='color:"+circleColor+";vertical-align: middle;padding: 0px 10px'></i>应用<i class=\"fa fa-long-arrow-right fa_icon\" style='color:"+circleColor+";vertical-align: middle;padding: 0px 10px'></i>依赖应用<i class=\"fa fa-long-arrow-right fa_icon\" style='color:"+circleColor+";vertical-align: middle;padding: 0px 10px'></i>订阅API</div>");
            }
            d3.select(self.frameElement).style("height", height+"px");
            var param = {
                invokeType:param
            }
            common.ajaxGet("api/firstReport/gateServiceApiRelation",param, successFun, null, null, $("#consumerMgr"));
        }
    };
    //右边 我的应用
    var chart6 = {
        init:function (param,height,width) {
            var successFun = function (data) {
                $("#consumerMgr_server").html("");
                $("#consumerMgr_api").html("");
                $("#consumerMgr_server").css("width",width+'px');
                $("#consumerMgr_api").css("width",width+'px');
                var datasource = data["datas"];
                $("#consumerMgr_serverCount").text(datasource["MYAPP"]);
                $("#consumerMgr_apiCount").text(datasource["MYAPI"]);
                var details = datasource["detail"];
                if(details){
                    var app = details["app"];
                    var api = details["api"];
                    var app_html = "",api_html = "";
                    var appCount = parseInt(height/35);
                    $("#consumerMgr_server").height(height+'px');
                    var apiCount = parseInt(height/35);
                    $("#consumerMgr_api").height(height+'px');

                    for(var i=0;i<app.length;i++){
                        app_html += "<li class='news-item'><a href=\"javascript:void(0);\" style=\"padding: 9px 3px;\" title='"+app[i]+"'>"+app[i]+"</a></li>";
                    }
                    $("#consumerMgr_server").html(app_html);

                    chart6.appPlay("consumerMgr_server",appCount,app.length);
                    for(var i=0;i<api.length;i++){
                        api_html += "<li class='news-item'><a href=\"javascript:void(0);\" style=\"padding: 9px 3px;\" title='"+api[i]+"'>"+api[i]+"</a></li>";
                    }
                    $("#consumerMgr_api").html(api_html);

                    chart6.appPlay("consumerMgr_api",apiCount,api.length);
                }
            }
            var param = {
                "invokeType":param
            };
            common.ajaxGet("api/firstReport/myAppAndApi", param, successFun, null, null, $("#consumerMgr"));
        },
        appPlay:function (dom,count,sum) {
            $("#"+dom).bootstrapNews({
                newsPerPage: count,
                autoplay: count>=sum?false:true,
                pauseOnHover: true,
                navigation: false,
                direction: 'up',
                newsTickerInterval: 4000
            });
        }
    }
    //订阅的API
    var myOrderApi = {
        init: function (param,height,width) {
            var successFun = function (data) {
                $("#consumerMgr_orderApi").html("");
                $("#consumerMgr_orderApi").css("width",width+'px');
                var datasource = data["datas"];
                $("#consumerMgr_orderApiCount").text(datasource["MYAPI"]);
                var details = datasource["detail"], msg_html = "";

                var megCount = parseInt(height/35);
                $("#consumerMgr_orderApi").css("height",height+'px');
                var orderApi = details["api"];
                for (var i = 0; i < orderApi.length; i++) {
                    var mess = orderApi[i];
                    msg_html += "<li class='news-item'><a href='javascript:void(0);' style=\"padding: 9px 3px;\" title='"+mess+"'>" + mess + "</a></li>";
                }
                $("#consumerMgr_orderApi").html(msg_html);
                myOrderApi.play(megCount,orderApi.length);
            }
            var msgParam = {
                "invokeType": "1"
            };
            common.ajaxGet("api/firstReport/myAppAndApi", msgParam, successFun, null, null,null);
        },
        play:function (count,sum) {
            $("#consumerMgr_orderApi").bootstrapNews({
                newsPerPage: count,
                autoplay: count>=sum?false:true,
                pauseOnHover: true,
                navigation: false,
                direction: 'up',
                newsTickerInterval: 4000
            });
        }
    };
    // 右侧 我的消息
    var myMessage = {
        init: function (param,height,width) {
            var successFun = function (data) {
                $("#consumerMgr_msg").html("");
                $("#consumerMgr_msg").css("width",width+'px');
                var datasource = data["datas"];
                $("#consumerMgr_msgCount").text(datasource["count"]);
                var details = datasource["detail"], msg_html = "";

                var megCount = parseInt(height/35);
                $("#consumerMgr_msg").css("height",height+'px');

                if(details && details.length>0){
                    for (var i = 0; i < details.length; i++) {
                        var mess = details[i]["mess"];
                        msg_html += "<li  class='news-item'><a href='javascript:void(0);' style=\"padding: 9px 3px;\" title='"+mess+"'><em style='width: auto;padding: 0px;display: inline-block' id='"+details[i]["id"]+"' class='consumerMgr_msg_closeBtn'>【关闭】</em>" + mess + "</a></li>";
                    }
                    $("#consumerMgr_msg").parent("li").find("i").attr("id","my_infor");
                }else{
                    $("#consumerMgr_msg").parent("li").find("i").removeAttr("id");
                }

                $("#consumerMgr_msg").html(msg_html);
                myMessage.play(megCount,details.length);
                myMessage.delete(param,height,width);
            }
            var msgParam = {
                "invokeType": param
            };
            common.ajaxGet("api/firstReport/getUserApiMess", msgParam, successFun, null, null, $("#consumerMgr"));
        },
        play:function (count,sum) {
            var newbox = $("#consumerMgr_msg").bootstrapNews({
                newsPerPage: count,
                autoplay: count >= sum ? false : true,
                pauseOnHover: true,
                navigation: false,
                direction: 'up',
                newsTickerInterval: 4000
            });

        },
        delete:function (param,height,width) {
            $("#consumerMgr_msg .consumerMgr_msg_closeBtn").unbind("click");
            $("#consumerMgr_msg .consumerMgr_msg_closeBtn").click(function () {
                var successFun = function (data) {
                    common.jqConfirm.alert({
                        title: 1,
                        content: "操作成功！",
                        call: function () {
                            myMessage.init(param,height,width);
                        }
                    });
                };
                var id = $(this).attr("id");
                var deleteParam = {"id": id};
                common.ajaxPut("api/firstReport/closeHandleMess", deleteParam, successFun, null, null, $("#consumerMgr"));
            });
        }
    };
    // 右侧 我的故障
    var myError = {
        init:function (param,height,width) {
            var successFun = function (data) {
                $("#consumerMgr_error").html("");
                $("#consumerMgr_error").css("width",width+'px');

                var datasource = data["datas"];
                $("#consumerMgr_errorCount").text(datasource["count"]);
                var details = datasource["detail"],error_html = "";

                var errorCount = parseInt(height/35);
                $("#consumerMgr_error").css("height",height+'px');

                if(details && details.length>0){
                    for(var i=0;i<details.length;i++){
                        var mess = details[i]["mess"];
                        error_html += "<li  class='news-item'><a href='javascript:void(0);' style=\"padding: 9px 3px;\" title='"+mess+"'><em style='width: auto;padding: 0px;display:inline-block' id='"+details[i]["id"]+"' class='consumerMgr_error_closeBtn'>【关闭】</em>"+mess+"</a></li>";
                    }
                    $("#consumerMgr_error").parent("li").find("i").attr("id","my_trouble");
                }else{
                    $("#consumerMgr_error").parent("li").find("i").removeAttr("id");
                }

                $("#consumerMgr_error").html(error_html);
                myError.delete(param,height,width);
                myError.play(errorCount,details.length);
            }
            var errorParam = {
                "invokeType":param
            };
            common.ajaxGet("api/firstReport/userFault", errorParam, successFun, null, null, $("#consumerMgr"));
        },
        play:function (count,sum) {
            $("#consumerMgr_error").bootstrapNews({
                newsPerPage: count,
                autoplay: count>=sum?false:true,
                pauseOnHover: true,
                navigation: false,
                direction: 'up',
                newsTickerInterval: 4000
            });
        },
        delete:function (param,height,width) {
            $("#consumerMgr_error .consumerMgr_error_closeBtn").unbind("click");
            $("#consumerMgr_error .consumerMgr_error_closeBtn").click(function (e) {
                var successFun = function (data) {
                    common.jqConfirm.alert({
                        title: 1,
                        content: "操作成功！",
                        call: function () {
                            myError.init(param,height,width);
                        }
                    });
                };
                var id = $(this).attr("id");
                var deleteParam = {"id": id};
                common.ajaxPut("api/firstReport/closeUserFault", deleteParam, successFun, null, null, $("#consumerMgr"));
            });
        }
    }
    //右边 角色切换
    var roleChange = {
        init: function () {
            $("#consumerMgr_role li").click(function (e) {
                var index = $(this).index();
                $("#chart4").html("");
                if (0 == index) {
                    $("#consumerMgr_role_id").val("2");
                    chart4.init("2");
                    leftContent("2");
                } else if (1 == index) {
                    $("#consumerMgr_role_id").val("1");
                    chart4.init("1");
                    leftContent("1");
                }
                $(this).find("a").addClass("a_hover");
                $(this).siblings().find("a").removeClass("a_hover");
            })
        }
    };
    //右侧我的应用初始化展开合并效果初始化
    var tabStrip = {
        init:function () {
            $("#demo-list li").click(function () {
                $(this).find("ul").slideDown("slow");
                $(this).siblings().find("ul").hide();
            })
        }
    }
    var clearRight = function(){
        $("#chart4").html("");
        $("#consumerMgr_server").html("");
        $("#consumerMgr_api").html("");
        $("#consumerMgr_msg").html("");
        $("#consumerMgr_error").html("");
        $("#consumerMgr_orderApi").html("");

        if ($("#consumerMgr_server") && $("#consumerMgr_server").length > 0) {
            if ($("#consumerMgr_server")[0].newsBox) {
                $("#consumerMgr_server")[0].newsBox.onPause();
            }
            if ($("#consumerMgr_api")[0].newsBox) {
                $("#consumerMgr_api")[0].newsBox.onPause();
            }
            if ($("#consumerMgr_orderApi")[0].newsBox) {
                $("#consumerMgr_orderApi")[0].newsBox.onPause();
            }
            if ($("#consumerMgr_msg")[0].newsBox) {
                $("#consumerMgr_msg")[0].newsBox.onPause();
            }
            if ($("#consumerMgr_error")[0].newsBox) {
                $("#consumerMgr_error")[0].newsBox.onPause();
            }
        }
    }
    var clearLeft = function(){
        $("#chart2").html("");
        $("#chart2").removeAttr("style");
        $("#chart2").removeAttr("_echarts_instance_");
    }
    var rightContent = function (param, div) {
        clearRight();
        var changDOM = document.getElementById(div);
        var heightDOM = changDOM.offsetHeight; //高度
        var widthDOM = changDOM.offsetWidth;  //宽度
        var height = window.innerHeight - 40 - 60 * 5 - 5;
        chart4.init(param);
        chart6.init(param, height, widthDOM);
        myOrderApi.init(param, height, widthDOM);
        myMessage.init(param, height, widthDOM);
        myError.init(param, height,widthDOM);
    };

    //左侧echart部分单独切换
    var leftContent = function(param){
        clearLeft();
        chart1.init(param, "month");
        if ("2" == param) {
            chart5.init(param, "month");
        } else {
            chart2.init(param, "month")
        }
        chart3.init(param, "month");
    }

    var init = function () {
        var roldId = compont.checkRole();
        var divDom = "";
        //console.info("roldId==="+roldId);
        //roldId = 3;
        if(3 == roldId){
            $("#consumerMgr_logo").show();
            $("#consumerMgr_role_id").val("2");
            rightContent("2","consumerMgr_list");
            leftContent("2");
            roleChange.init();
        }else if(2 == roldId){
            $("#consumerMgr_logo").hide();
            $("#consumerMgr_role_id").val("2");
            rightContent("2","consumerMgr_list");
            leftContent("2");
        }else if(1 == roldId){
            $("#consumerMgr_logo").hide();
            $("#consumerMgr_role_id").val("1");
            rightContent("1","consumerMgr_list");
            leftContent("1");
        }
        tabStrip.init();
        var res = null;
        $("#consumerMgr_list").resize(function () {
            if (res){clearTimeout(res)}
            res = setTimeout(function(){
                bz = $("#consumerMgr_role_id").val();
                rightContent(bz,"consumerMgr_list");
            },280);
        });
        var chart4Time = setTimeout(function () {
            $("#chart4").html("");
            chart4.init($("#consumerMgr_role_id").val());
        },1000*60*5);
    };
    return {
        init: init
    };
});




