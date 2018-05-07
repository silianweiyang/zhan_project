define(["jquery", "common", "compont", "wandaComp", "wandaCompR", "echarts","date_time_Picker"], function ($, common, compont, wandaComp, wandaCompR, echarts,myDatePicker) {
    //查询button
    var analysis_SearchBtn = {
        init: function () {
            $("#analysis_SearchBtn").click(function () {
                var analysis_startTime = $("#analysis_startTime").val();
                var analysis_endTime = $("#analysis_endTime").val();
                if(analysis_startTime == ""){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择开始日期！"
                    });
                    return false;
                }
                if(analysis_endTime == ""){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择结束日期！"
                    });
                    return false;
                }
                var apiId = $("#apiId").val();
                var param = {
                    "startDate":analysis_startTime,
                    "endDate":analysis_endTime,
                    "apiId":apiId,
                    "period":""
                };
                var successFun = function (data) {
                    analysisChart1.refreshDatas(data);
                    analysisChart2.refreshDatas(data);
                    analysisChart3.refreshDatas(data);
                    analysisChart4.refreshDatas(data);
                    $("#analysis").find("#timeRange").find("a").removeClass("active");
                };
                common.ajaxGet("api/logProcDetail/countAndConsumeAnalyze", param, successFun, null, null, $("#analysis"));
            });
        }
    };


    var analysisChart1 = {
        myChart: null,
        option: {
            title: {
                text: 'API访问耗时统计（单位：ms）',
                textStyle: {
                    fontSize: 14,
                    fontWeight: "bold",//normal
                    fontFamily: "microsoft yahei"
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [],
                textStyle: {
                    fontFamily: "microsoft yahei"
                },
                y: 'bottom'
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true}
                }
            },
            xAxis: [
                {
                    name: '',
                    type: 'category',
                    boundaryGap: false,
                    scale: true,
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '耗时',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: []

        },
        refreshDatas: function (data) {
            var times = data.times;
            if (times === null || times.length === 0) {
                $("#analysisChart1").next(".nodataChart").show();
                $("#analysisChart1").hide();
            } else {
                $("#analysisChart1").show();
                $("#analysisChart1").next(".nodataChart").hide();

                var _data = data.consumeTime;
                var legendData = [];
                var seriesData = [];
                for (var i = 0; i < _data.length; i++) {
                    legendData.push(_data[i].name);
                    seriesData.push({
                        name: _data[i].name,
                        type: 'line',
                        barMaxWidth: '20',
                        data: _data[i].values,
                        axisLabel: {
                            interval: 0
                        },
                        label:{
                            normal:{
                                show:true,
                                position:'top'
                            }
                        }
                    });
                }
                analysisChart1.option.legend.data = legendData;
                analysisChart1.option.series = seriesData;
                analysisChart1.option.xAxis[0].data = times;
                analysisChart1.getInst();
            }
        },
        getInst: function () {
            analysisChart1.myChart.setOption(analysisChart1.option);
        },
        init: function () {
            analysisChart1.myChart = echarts.init(document.getElementById('analysisChart1'));
            analysisChart1.getInst();
        }
    };

    var analysisChart2 = {
        myChart: null,
        option: {
            title: {
                text: '服务访问API平均耗时统计（单位：ms）',
                textStyle: {
                    fontSize: 14,
                    fontWeight: "bold",
                    fontFamily: "microsoft yahei"
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [],
                textStyle: {
                    fontFamily: "microsoft yahei"
                },
                y: 'bottom'
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true}
                }
            },
            xAxis: [
                {
                    name: '',
                    type: 'category',
                    boundaryGap: true,
                    scale: true,
                    data: ""
                }
            ],
            yAxis: [
                {
                    name: '耗时',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: []
        },
        refreshDatas: function (data) {
            var times = data.times;
            if (times === null || times.length === 0) {
                $("#analysisChart2").next(".nodataChart").show();
                $("#analysisChart2").hide();
            } else {
                $("#analysisChart2").show();
                $("#analysisChart2").next(".nodataChart").hide();

                var _data = data.consumeTimeOfGuestService;
                var legendData = [];
                var seriesData = [];
                for (var i = 0; i < _data.length; i++) {
                    legendData.push(_data[i].guestServiceName);
                    seriesData.push({
                        name: _data[i].guestServiceName,
                        type: 'bar',
                        data: _data[i].values,
                        barMaxWidth: '20',
                        axisLabel: {
                            interval: 0
                        },
                        label:{
                            normal:{
                                show:true,
                                position:'top'
                            }
                        }
                    });
                }
                analysisChart2.option.legend.data = legendData;
                analysisChart2.option.series = seriesData;
                analysisChart2.option.xAxis[0].data = times;
                analysisChart2.getInst();
            }
        },
        getInst: function () {
            analysisChart2.myChart.setOption(analysisChart2.option);
        },
        init: function () {
            analysisChart2.myChart = echarts.init(document.getElementById('analysisChart2'));
            analysisChart2.getInst();
        }
    };

    var analysisChart3 = {
        myChart: null,
        option: {
            title: {
                text: 'API总访问次数统计（单位：次）',
                textStyle: {
                    fontSize: 14,
                    fontWeight: "bold",
                    fontFamily: "microsoft yahei"
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [],
                textStyle: {
                    fontFamily: "microsoft yahei"
                },
                y: 'bottom'
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true}
                }
            },
            xAxis: [
                {
                    name: '',
                    type: 'category',
                    boundaryGap: false,
                    scale: true,
                    data: ""
                }
            ],
            yAxis: [
                {
                    name: '次数',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: []
        },
        refreshDatas: function (data) {
            var times = data.times;
            if (times === null || times.length === 0) {
                $("#analysisChart3").next(".nodataChart").show();
                $("#analysisChart3").hide();
            } else {
                $("#analysisChart3").show();
                $("#analysisChart3").next(".nodataChart").hide();

                var _data = data.totalCount;
                var legendData = [];
                var seriesData = [];
                var name = ["总调用次数"];
                legendData = name;
                seriesData.push({
                    name: name,
                    type: 'line',
                    barMaxWidth: '20',
                    data: _data,
                    axisLabel: {
                        interval: 0
                    },
                    label:{
                        normal:{
                            show:true,
                            position:'top'
                        }
                    }
                });
                analysisChart3.option.legend.data = legendData;
                analysisChart3.option.series = seriesData;
                analysisChart3.option.xAxis[0].data = times;
                analysisChart3.getInst();
            }
        },
        getInst: function () {
            analysisChart3.myChart.setOption(analysisChart3.option);
        },
        init: function () {
            analysisChart3.myChart = echarts.init(document.getElementById('analysisChart3'));
            analysisChart3.getInst();
        }
    };

    var analysisChart4 = {
        myChart: null,
        option: {
            title: {
                text: '服务访问API次数统计（单位：次）',
                textStyle: {
                    fontSize: 14,
                    fontWeight: "bold",
                    fontFamily: "microsoft yahei"
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [],
                textStyle: {
                    fontFamily: "microsoft yahei"
                },
                y: 'bottom'
            },
            toolbox: {
                show: true,
                feature: {
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true}
                }
            },
            xAxis: [
                {
                    name: '',
                    type: 'category',
                    boundaryGap: true,
                    scale: true,
                    data: ""
                }
            ],
            yAxis: [
                {
                    name: '次数',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: []
        },
        refreshDatas: function (data) {
            var times = data.times;
            if (times === null || times.length === 0) {
                $("#analysisChart4").next(".nodataChart").show();
                $("#analysisChart4").hide();
            } else {
                $("#analysisChart4").show();
                $("#analysisChart4").next(".nodataChart").hide();

                var _data = data.countOfGuestService;
                var legendData = [];
                var seriesData = [];
                for (var i = 0; i < _data.length; i++) {
                    legendData.push(_data[i].guestServiceName);
                    seriesData.push({
                        name: _data[i].guestServiceName,
                        data: _data[i].values,
                        type: 'bar',
                        barMaxWidth: '20',
                        axisLabel: {
                            interval: 0
                        },
                        label:{
                            normal:{
                                show:true,
                                position:'top'
                            }
                        }
                    });
                }
                analysisChart4.option.legend.data = legendData;
                analysisChart4.option.series = seriesData;
                analysisChart4.option.xAxis[0].data = times;
                analysisChart4.getInst();
            }
        },
        getInst: function () {
            analysisChart4.myChart.setOption(analysisChart4.option);
        },
        init: function () {
            analysisChart4.myChart = echarts.init(document.getElementById('analysisChart4'));
            analysisChart4.getInst();
        }
    };


    var selectCondition = {
        init: function () {
            $("#timeRange").find("a").click(function () {
                $("#timeRange").find(".active").removeClass("active");
                $("#timeRangeCond").val($(this).attr("value"));
                $(this).addClass("active");
                refreashCharts();
            });
        }
    };


    var refreashCharts = function () {
        var period = $("#timeRangeCond").val();
        var apiId = $("#apiId").val();
        var param = {
            "period": period,
            "apiId": apiId
        };
        if (period === "day") {
            analysisChart1.option.xAxis[0].name = "时间";
            analysisChart2.option.xAxis[0].name = "时间";
            analysisChart3.option.xAxis[0].name = "时间";
            analysisChart4.option.xAxis[0].name = "时间";
        } else if (period === "month") {
            analysisChart1.option.xAxis[0].name = "日期";
            analysisChart2.option.xAxis[0].name = "日期";
            analysisChart3.option.xAxis[0].name = "日期";
            analysisChart4.option.xAxis[0].name = "日期";
        }
        var successFun = function (data) {
            analysisChart1.refreshDatas(data);
            analysisChart2.refreshDatas(data);
            analysisChart3.refreshDatas(data);
            analysisChart4.refreshDatas(data);
        };
        common.ajaxGet("api/logProcDetail/countAndConsumeAnalyze", param, successFun, null, null, $("#analysis"));
    };


    //返回按钮
    var analysis_backBtn = {
        init: function () {
            $("#analysis_backBtn").click(function () {
                var queryParam = $("#analysis_queryParam").val();
                if (queryParam && queryParam.length > 0) {
                    var param = JSON.parse(queryParam);
                    common.setRouterParams(param);
                }
                router.navigate("100602");
            })
        }
    };

    var datePicker = {
        init:function () {
            new myDatePicker.wandaDatePicker("analysis_startTime", "").init();
            new myDatePicker.wandaDatePicker("analysis_endTime", "").init();
            var start = new myDatePicker.wandaDatePicker("analysis_startTime", "").getwandaDatePicker();
            var end = new myDatePicker.wandaDatePicker("analysis_endTime", "").getwandaDatePicker();
            new myDatePicker.validate("wandaDatePicker", "analysis_startTime","analysis_endTime").init();
            end.max(new Date());
        }
    }

    var advancedSrhBtn = {
        init:function () {
            $("#advancedSrhBtn").click(function () {
                if($("#analysis_hignSearchDiv").is(":hidden")){
                    $("#analysis_hignSearchDiv").show();
                    $("#analysis_SearchBtn").show();
                    $("#timeRange").find("a").hide();
                    $(".inquire").css("width","11%");
                    $("#advancedSrhBtn").html("<i class=\"fa fa-angle-double-up\"></i>&nbsp;&nbsp;普通搜索");
                }else{
                    $("#analysis_hignSearchDiv").hide();
                    $("#analysis_SearchBtn").hide();
                    $("#timeRange").find("a").show();
                    $(".inquire").css("width","20%");
                    $("#advancedSrhBtn").html("<i class=\"fa fa-angle-double-down\"></i>&nbsp;&nbsp;高级搜索");
                }

            })
        }
    }
    var initParam = function () {
        var _params = common.getRouterParams();
        $("#menuCode").val(_params["menuCode"]);
        if (_params && _params["apiId"]) {
            $("#apiId").val(_params["apiId"]);
            $("#analysis_queryParam").val(_params["queryParam"]);
        } else {
        }
        $("#timeRangeCond").val("day");
        refreashCharts();
    };

    var init = function () {
        initParam();
        selectCondition.init();
        analysisChart1.init();
        analysisChart2.init();
        analysisChart3.init();
        analysisChart4.init();
        analysis_backBtn.init();
        datePicker.init();
        analysis_SearchBtn.init();
        advancedSrhBtn.init();
    };
    return {
        init: init
    }
});

