define(["jquery", "common", "wandaComp", "wandaCompR", "jqueryCorner", "echarts"], function ($, common, wandaComp, wandaCompR, jqueryCorner, ec) {
    var resizeWorldMapContainer = function (Dom) {
        Dom.style.height = (window.innerHeight-40)/3+'px';
    };
    //左侧第一个  API调用耗时前TOP5
    var chart1 = {
        init: function (time) {
            var chart1Dom = document.getElementById('chart1');
            //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
            //设置容器高宽
            resizeWorldMapContainer(chart1Dom);
            // 基于准备好的dom，初始化echarts实例
            var myChart = ec.init(chart1Dom);
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
                        text: 'API访问量TOP5',
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
            var param = {"cycleTime":time};
            common.ajaxGet("api/firstReport/gateApiInvokNumTop", param, successFun, null, null, $("#adminMgr"));
        }
    };
    //左侧第二个  总访问量
    var chart2 = {
        init: function (time) {
            var chart2Dom = document.getElementById('chart2');
            //用于使chart自适应高度和宽度,通过窗体高宽计算容器高宽
            //设置容器高宽
            resizeWorldMapContainer(chart2Dom);
            // 基于准备好的dom，初始化echarts实例
            var myChart = ec.init(chart2Dom);
            var successFun = function (data) {
                var option = {
                    backgroundColor : "#fff",
                    color:['#ff6666','#5bd5e7'],
                    title: {
                        text: '总访问量',
                        textStyle:{
                            fontSize:12
                        }
                    },
                    tooltip: {trigger: 'axis'},
                    grid: {top:'15%', left: '3%', right: '4%', bottom: '3%', containLabel: true},
                    xAxis: {
                        type: 'category',
                        axisLine: { lineStyle: { width: 2, color: '#666'} },
                        splitLine : {show:true,interval :0,lineStyle: { type :'dotted',color: ['#555688'] } },
                        data: data["data"]
                    },
                    yAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine: { lineStyle: { width: 2, color: '#666'} },
                        splitLine : {show:true,interval :0,lineStyle: { type :'dotted',color: ['#555688'] } }
                    },
                    series: [
                        {
                            type: 'line',
                            data: data["value"]
                        }
                    ]
                };
                myChart.setOption(option);
                $("#chart2").resize(function(){
                    myChart.resize();
                });
            };
            var param = {"cycleTime":time};
            common.ajaxGet("api/firstReport/getGateApiInvokCountNum",param, successFun, null, null,null);
        }
    };
    //左侧第一个  过去２４小时内故障分布
    var chart8 = {
        init: function (param,time) {
            var chart8Dom = document.getElementById('chart8');
            resizeWorldMapContainer(chart8Dom);
            var myChart = ec.init(chart8Dom);
            var successFun = function (data) {
                var option = {
                    backgroundColor : "#fff",
                    color:['#5bd5e7','#fda44a','#fc7e3a','#b0e917','#129398','#ffe866','#2a9aff','#c766ff','#ff66fd','#fe5f5f','#a70e0e','#194de3','#7d8593','#3862c3','#a4cec0'],
                    title : {
                        text: '24小时故障分布',
                        x:'left',
                        textAlign:'left',
                        textStyle:{
                            fontSize:12
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
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
                $("#chart8").resize(function(){
                   myChart.resize();
                 });
            }
            var chart8Param = {
                "invokeType":param,
                "cycleTime":time
            }
            common.ajaxGet("api/firstReport/gateApiInvokFault", chart8Param, successFun, null, null,null);
        }
    };
    //中间业务单位(echart矩形树图)
    var chart3 = {
        init: function (data) {
            var chart3Dom = document.getElementById('chart3');
           // var area1 = document.getElementById("relation_data_t").offsetHeight;
            var area2 = document.getElementById("top").offsetHeight;
            var height = window.innerHeight-area2;
            chart3Dom.style.height = height+'px';

            var myChart = ec.init(chart3Dom);
            var successFun = function (data) {
                var formatUtil = ec.format;
                var distinctData = [];
                distinctData = chart3.convert(data["datas"],distinctData);
                var option = {
                    backgroundColor : "#f8f9fb",
                    //color:['#395a7b','#04a3f5','#92c383','#83B2C3','#C38392','#B483C3','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3'],
                    color:['#395A7B'],
                    tooltip: {
                        formatter: function (info) {
                            var value = info.value;
                            var treePathInfo = info.treePathInfo;
                            var treePath = [];
                            for (var i = 1; i < treePathInfo.length; i++) {
                                treePath.push(treePathInfo[i].name);
                            }
                            var tipStr  = '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>';
                            if(info["data"]["publishNum"]){
                                tipStr += '发布的API: ' + info["data"]["publishNum"] + '<br/>';
                            }
                            if(info["data"]["orderNum"]){
                                tipStr += '订阅的API: ' + info["data"]["orderNum"] + '<br/>';
                            }
                            if(!info["data"]["publishNum"] && !info["data"]["orderNum"]){
                                //tipStr += '状态: 正常<br/>';
                            }

                            return tipStr;
                        }
                    },
                    animation : false,
                    series: [{
                        name: 'API总览',
                        type: 'treemap',
                        left:'left',
                        top:parseFloat(30/height*100)+"%",
                        width:'100%',
                        height:'100%',
                        visualMin:100,
                        visibleMin: 0,
                        childrenVisibleMin:0,
                        data: distinctData,
                        breadcrumb:{
                            show:true,
                            height:30,
                            top :'top',
                            left:'left',
                            backgroundColor:'#112233',
                            itemStyle:{
                                normal:{
                                    shadowBlur:0,
                                    textStyle:{
                                        fontSize:'12'
                                    }
                                }
                            }
                        },
                        itemStyle:{
                            normal: {
                                color: '#4a566e'
                            }
                        },
                        nodeClick:'link',
                        roam: false,
                        leafDepth: 1,
                        levels: [
                            {
                                itemStyle: {
                                    normal: {
                                        borderColorSaturation: 0.8,
                                        borderColor: '#4a566e',
                                        borderWidth: 1,
                                        gapWidth: 1
                                    }
                                }
                            },
                            {
                                itemStyle: {
                                    normal: {
                                        borderColorSaturation: 0.7,
                                        gapWidth: 1,
                                        borderWidth: 1,
                                        borderColor: '#4a566e'
                                    }
                                }
                            },
                            {
                                itemStyle: {
                                    normal: {
                                        borderColorSaturation: 0.6,
                                        gapWidth: 1,
                                        borderWidth: 1,
                                        borderColor: '#4a566e'
                                    }
                                }
                            }
                        ]
                    }]
                }
                myChart.setOption(option);
            }
            common.ajaxGet("api/firstReport/gateServiceRelation", {}, successFun, null, null,null);
        },
        convert:function (source,target) {
            for(var i=0;i<source.length;i++){
                var obj = source[i];
                target[i] = obj;

                if(obj["children"]){
                    obj["value"] = obj["children"].length;
                    target[i]["children"] = chart3.convert(obj["children"],[]);
                }else{
                    obj["value"] = 1;
                }
            }
            return target;
        }
    };
    //右边 我的应用
    var chart6 = {
        init:function (param,height,width) {
            var successFun = function (data) {
                $("#adminMgr_server").html("");
                $("#adminMgr_server").css("width",width+'px');
                var datasource = data["datas"];
                $("#adminMgr_serverCount").text(datasource["MYAPP"]);
                var details = datasource["detail"];
                if(details){
                    var app = details["app"];
                    var app_html = "",api_html = "";
                    var appCount = parseInt(height/35);
                    $("#adminMgr_server").height(height+'px');

                    for(var i=0;i<app.length;i++){
                        app_html += "<li class='news-item'><a href=\"javascript:void(0);\" style=\"padding: 9px 3px;\" title='"+app[i]+"'>"+app[i]+"</a></li>";
                    }
                    $("#adminMgr_server").html(app_html);
                    chart6.appPlay("adminMgr_server",appCount,app.length);
                }
            }
            common.ajaxGet("api/firstReport/myApp", {}, successFun, null, null, null);
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
    //我发布的API
    var myPublishApi = {
        init:function (param,height,width) {
            var successFun = function (data) {
                $("#adminMgr_api").html("");
                $("#adminMgr_api").css("width",width+'px');
                var datasource = data["datas"];
                $("#adminMgr_apiCount").text(datasource["MYAPI"]);
                var details = datasource["detail"];
                if(details){
                    var api = details["api"];
                    var app_html = "",api_html = "";
                    var apiCount = parseInt(height/35);
                    $("#adminMgr_api").height(height+'px');
                    for(var i=0;i<api.length;i++){
                        api_html += "<li class='news-item'><a href=\"javascript:void(0);\" style=\"padding: 9px 3px;\" title='"+api[i]+"'>"+api[i]+"</a></li>";
                    }
                    $("#adminMgr_api").html(api_html);

                    myPublishApi.appPlay("adminMgr_api",apiCount,api.length);
                }
            }
            var param = {
                "invokeType":param
            };
            common.ajaxGet("api/firstReport/myAppAndApi", param, successFun, null, null,null);
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
                $("#adminMgr_orderApi").html("");
                $("#adminMgr_orderApi").css("width",width+'px');
                var datasource = data["datas"];
                $("#adminMgr_orderApiCount").text(datasource["MYAPI"]);
                var details = datasource["detail"], msg_html = "";

                var megCount = parseInt(height/35);
                $("#adminMgr_orderApi").css("height",height+'px');
                var orderApi = details["api"];
                for (var i = 0; i < orderApi.length; i++) {
                    var mess = orderApi[i];
                    msg_html += "<li class='news-item'><a href='javascript:void(0)' style=\"padding: 9px 3px;\" title='"+mess+"'>" + mess + "</a></li>";
                }
                $("#adminMgr_orderApi").html(msg_html);
                myOrderApi.play(megCount,orderApi.length);
                //myOrderApi.delete(param,height,width);
            }
            var msgParam = {
                "invokeType": "1"
            };
            common.ajaxGet("api/firstReport/myAppAndApi", msgParam, successFun, null, null,null);
        },
        play:function (count,sum) {
            $("#adminMgr_orderApi").bootstrapNews({
                newsPerPage: count,
                autoplay: count>=sum?false:true,
                pauseOnHover: true,
                navigation: false,
                direction: 'up',
                newsTickerInterval: 4000
            });
        },
        delete:function (param,height,width) {
            $("#adminMgr_msg .adminMgr_orderApi_closeBtn").unbind("click");
            $("#adminMgr_msg .adminMgr_orderApi_closeBtn").click(function () {
                var successFun = function (data) {
                    common.jqConfirm.alert({
                        title: 1,
                        content: "操作成功！",
                        call: function () {
                            myOrderApi.init(param,height,width);
                        }
                    });
                };
                var id = $(this).attr("id");
                var deleteParam = {"id": id};
                common.ajaxPut("api/firstReport/closeHandleMess", deleteParam, successFun, null, null,null);
            });
        }
    };
    // 右侧 我的消息
    var myMessage = {
        init: function (param,height,width) {
            var successFun = function (data) {
                $("#adminMgr_msg").html("");
                $("#adminMgr_msg").css("width",width+'px');
                var datasource = data["datas"];
                $("#adminMgr_msgCount").text(datasource["count"]);
                var details = datasource["detail"], msg_html = "";

                var megCount = parseInt(height/35);
                $("#adminMgr_msg").css("height",height+'px');

                if(details && details.length>0){
                    for (var i = 0; i < details.length; i++) {
                        var mess = details[i]["mess"];
                        msg_html += "<li class='news-item'><a href='javascript:void(0)' style=\"padding: 9px 3px;\" title='"+mess+"'>" + mess + "</a></li>";
                    }
                    $("#adminMgr_msg").parent("li").find("i").attr("id","my_infor");
                }else{
                    $("#adminMgr_msg").parent("li").find("i").removeAttr("id");
                }

                $("#adminMgr_msg").html(msg_html);
                myMessage.play(megCount,details.length);
            }
            var msgParam = {
                "invokeType": param
            };
            common.ajaxGet("api/firstReport/getUserApiMess", msgParam, successFun, null, null, null);
        },
        play:function (count,sum) {
            $("#adminMgr_msg").bootstrapNews({
                newsPerPage: count,
                autoplay: count>=sum?false:true,
                pauseOnHover: true,
                navigation: false,
                direction: 'up',
                newsTickerInterval: 4000
            });
        },
        delete:function (param,height,width) {
            $("#adminMgr_msg .adminMgr_msg_closeBtn").unbind("click");
            $("#adminMgr_msg .adminMgr_msg_closeBtn").click(function () {
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
                common.ajaxPut("api/firstReport/closeHandleMess", deleteParam, successFun, null, null, null);
            });
        }
    };
    // 右侧 我的故障
    var myError = {
        init:function (param,height,width) {
            var successFun = function (data) {
                $("#adminMgr_error").html("");
                $("#adminMgr_error").css("width",width+'px');

                var datasource = data["datas"];
                $("#adminMgr_errorCount").text(datasource["count"]);
                var details = datasource["detail"],error_html = "";

                var errorCount = parseInt(height/35);
                $("#adminMgr_error").css("height",height+'px');
                if(details && details.length>0){
                    for(var i=0;i<details.length;i++){
                        var mess = details[i]["mess"];
                        error_html += "<li class='news-item'><a href='javascript:void(0)' style=\"padding: 9px 3px;\" title='"+mess+"'>"+mess+"</a></li>";
                    }
                    $("#adminMgr_error").parent("li").find("i").attr("id","my_trouble");
                }else{
                    $("#adminMgr_error").parent("li").find("i").removeAttr("id");
                }

                $("#adminMgr_error").html(error_html);
                myError.delete(param,height,width);
                myError.play(errorCount,details.length);
            }
            var errorParam = {
                "invokeType":param
            };
            common.ajaxGet("api/firstReport/userFault", errorParam, successFun, null, null,null);
        },
        play:function (count,sum) {
            $("#adminMgr_error").bootstrapNews({
                newsPerPage: count,
                autoplay: count>=sum?false:true,
                pauseOnHover: true,
                navigation: false,
                direction: 'up',
                newsTickerInterval: 4000
            });
        },
        delete:function (param,height,width) {
            $("#adminMgr_error .adminMgr_error_closeBtn").unbind("click");
            $("#adminMgr_error .adminMgr_error_closeBtn").click(function (e) {
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
                common.ajaxPut("api/firstReport/closeUserFault", deleteParam, successFun, null, null, null);
            });
        }
    }
    //cpu chart
    var cpu_chart = {
        init: function (param) {
            var cpu_chart = document.getElementById('cpu_chart');
            cpu_chart.style.height = document.getElementById("relation_li0").offsetHeight+'px';
            var data = [
                {value:param,name:"使用"},
                {value:100-param,name:"未使用"}
            ];
            var myChart = ec.init(cpu_chart);
            var option = {
                backgroundColor : "#fff",
                color:['#395a7b','#04a3f5'],
                series: [
                    {
                        name:'CPU使用率',
                        type:'pie',
                        animation:false,
                        center:['55%', '55%'],
                        radius: ['40%', '80%'],
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:data
                    }
                ]
            }
            myChart.setOption(option);
        }
    };
    //mem chart
    var mem_chart = {
        init: function (param) {
            var mem_chart = document.getElementById('mem_chart');
            mem_chart.style.height = document.getElementById("relation_li0").offsetHeight+'px';
            var data = [
                {value:param,name:"使用"},
                {value:100-param,name:"未使用"}
            ];
            var myChart = ec.init(mem_chart);
            var option = {
                backgroundColor : "#fff",
                color:['#395a7b','#04a3f5'],
                series: [
                    {
                        name:'内存使用率',
                        type:'pie',
                        animation:false,
                        center:['55%', '55%'],
                        radius: ['40%', '80%'],
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    fontSize: '14',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:data
                    }
                ]
            }
            myChart.setOption(option);
        }
    };
    //中间顶部
    var middleInit = {
         init:function () {
             var param = {};
             var successFun = function (data) {
                 $("#cpu_num").html(data["TOTAL_CPU"]);
                 $("#cpu_per").html(data["USED_CPU"]);
                 cpu_chart.init(data["USED_CPU"]);
                 $("#mem_count").html(data["TOTAL_MEMORY"]);
                 $("#mem_per").html(data["USED_MEMORY"]);
                 mem_chart.init(data["USED_MEMORY"]);
             };
             common.ajaxGet("api/firstReport/gateResource", param, successFun, null, null,null);
         }
    };
//右侧我的应用初始化
    var tabStrip = {
        init:function () {
            $("#demo-list li").click(function () {
                $(this).find("ul").slideDown("slow");
                $(this).siblings().find("ul").hide();
            })
        }
    }
    //清除
    var clearRight = function(){
        $("#chart3").html("");
        $("#chart3").removeAttr("style");
        $("#chart3").removeAttr("_echarts_instance_");
        $("#adminMgr_server").html("");
        $("#adminMgr_api").html("");
        $("#adminMgr_msg").html("");
        $("#adminMgr_error").html("");
        $("#adminMgr_orderApi").html("");

        if($("#adminMgr_server") && $("#adminMgr_server").length>0){
            if($("#adminMgr_server")[0].newsBox){
                $("#adminMgr_server")[0].newsBox.onPause();
            }
            if($("#adminMgr_api")[0].newsBox){
                $("#adminMgr_api")[0].newsBox.onPause();
            }
            if($("#adminMgr_msg")[0].newsBox){
                $("#adminMgr_msg")[0].newsBox.onPause();
            }
            if($("#adminMgr_error")[0].newsBox){
                $("#adminMgr_error")[0].newsBox.onPause();
            }
            if($("#adminMgr_orderApi")[0].newsBox){
                $("#adminMgr_orderApi")[0].newsBox.onPause();
            }
        }
    }
    //左侧初始化
    var leftContent = function(type,time){
        chart1.init(time);
        chart2.init(time);
        chart8.init(type,time);
    }
    //右侧初始化
    var rightContent = function (param) {
            clearRight();
            var changeDOM = document.getElementById("adminMgr_logo");
            var heightDOM = changeDOM.offsetHeight; //高度
            var widthDOM = changeDOM.offsetWidth;  //宽度
            var height = window.innerHeight-40-60*5-5;
            chart6.init(param,height,widthDOM);
            myPublishApi.init(param,height,widthDOM);
            myOrderApi.init(param,height,widthDOM);
            myMessage.init(param,height,widthDOM);
            myError.init(param,height,widthDOM);
            chart3.init();
    }
    var init = function () {
        leftContent("2","month");
        rightContent("2");
        //初始化中间顶部
       // middleInit.init();
        tabStrip.init()
        var res = null;
        $("#adminMgr_logo").resize(function () {
            if (res){clearTimeout(res)}
            res = setTimeout(function(){
                rightContent("2");
            },280);
        });
    };
    return {
        init: init
    };
});




