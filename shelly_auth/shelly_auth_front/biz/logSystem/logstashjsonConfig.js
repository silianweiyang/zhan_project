define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {


    var logWorkerName_DropDownList = {
        successFun: function (data) {
            var logWorkerName = $("#logWorkerName").data("wandaDropDownList");
            logWorkerName.setDataSource(data.datas);
        },
        init: function () {
            $("#logWorkerName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "--全部--",
                    LOGSTASHID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "LOGSTASHID",
                index: 0,
                change: function (e) {
                }
            });
            var url = "logworker/logstash/queryLogStashInfoAllList";
            /*replaceUrl(url);*/
            var param = {
                paramObj: {}
            };
            common.ajaxPost(url, param, logWorkerName_DropDownList.successFun, null, null, $("#logstashjsonConfig"));
        }
    };

    var deployState_DropDownList = {
        successFun: function (data) {
            var deployState = $("#deployState").data("wandaDropDownList");
            deployState.setDataSource(data);
        },
        init: function () {
            $("#deployState").wandaDropDownList({
                optionLabel: {
                    text: "--全部--",
                    value: ""
                },
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change: function (e) {

                }
            });
            var url = "syscommpara/getBaseAttr";
            /*replaceUrl(url);*/
            var param = {
                "key": "deployState"
            };
            common.ajaxGet(url, param, deployState_DropDownList.successFun, null, null, $("#logstashjsonConfig"));
        }
    };

    /*表格——部署状态*/
    deployStateFunc = function (data) {
        var _class = "", msg = "", fontColor = "", state = data.STATE;
        if (state === "0") {
            _class = "online";
            msg = "运行中";
            fontColor = "#090";
        } else if (state === "1") {
            _class = "offline";
            msg = "已停止";
            fontColor = "#ccc";
        } else if (state === "2") {
            _class = "abnormal";
            msg = "异常";
            fontColor = "blue";
        } else if (state === "3") {
            _class = "delete";
            msg = "已删除";
            fontColor = "red";
        }
        return "<div style='text-align:center;color:" + fontColor + ";font-size: 10px;'><div class='" + _class + "'></div>" + msg + "</div>";
    };

    /*表格——任务示意*/
    showFunc = function (data) {
        var data = JSON.parse(data.JSONCONFIG);
        var srcImg = data.input.type + ".svg";
        var dstImg = data.output.type + ".svg";
        return "<div style='text-align: center'><svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' " +
            "viewBox='0 0 180 50' width='150px' height='60px' xml:space='preserve'><g>	<g>		" +
            "<image opacity='1' x='0' y='0' width='60' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/" + srcImg + "'></image>" +
            "<image opacity='1' x='75' y='0' width='30' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/arrowBlack.svg'></image>	" +
            "	<image opacity='1' x='115' y='0' width='60' height='60' xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='svg/" + dstImg + "'></image>	</g></g></svg></div>";
    };

    /*表格——监控操作*/
    monitorSwitchFunc = function (e) {
        var data = $("#logstashjsonConfigGrid").data("wandaGrid").dataItem($(e).closest("tr"));
        successFun = function (data) {
            common.jqConfirm.alert({
                title: 1,
                content: "操作成功！",
                call: function () {
                    logstashjsonConfigGrid.refreshDatas();
                }
            });
        };
        var url = "logworker/logstash/monitor/startMonitor";
        /* replaceUrl(url);*/
        var params = {
            "serviceId": data.SERVICE_ID,
            "recordId": data.RECORDID,
            "monState": data.MONSTATE
        };
        common.ajaxPost(url, params, successFun, null, null, $("#logstashjsonConfig"));
    };

    /*表格——查看详情*/
    detailsFunc = function (e) {
        var data = $("#logstashjsonConfigGrid").data("wandaGrid").dataItem($(e).closest("tr"));
        var menucode = window.location.hash.substr(1, window.location.hash.length);
        var _param = {"isAdd": false, "menuCode": menucode, "RECORDID": data.RECORDID};
        common.setRouterParams(_param);
        router.navigate('10070201');
    };


    /*  monStateFunc = function (data) {
     var monState = data.monState;
     var value = "";
     if (monState === "0") {/!*开启*!/
     value = "关闭监控";
     /!*需要关闭*!/
     } else if (monState === "1") {/!*关闭*!/
     value = "开启监控";
     /!*需要开启*!/
     }
     switchFunc = function () {
     var successFun = function (data) {
     common.jqConfirm.alert({
     title: 1,
     content: "操作成功！",
     call: function () {
     logstashjsonConfigGrid.refreshDatas();
     }
     });
     };
     var url = "logService/logworker/logstash/monitor/startMonitor";
     replaceUrl(url);
     var params = {
     "serviceId": data.logWorker.serviceId,
     "recordId": data.id,
     "monState": data.monState
     };
     common.ajaxPost("url", params, successFun, null, null, $("#logstashjsonConfig"));
     };

     return '<input type="button" value="' + value + '" onclick="switchFunc()"/>';
     };
     */

    //列表Grid
    var logstashjsonConfigGrid = {
        rows: "5",
        pagerParam: {},
        gridColums: [
            /* {
             width: '60px',
             template: "<input type='checkbox' class='gridCheckBox' id='#= uid #'/>",
             headerTemplate: '<input type="checkbox" id="check-all" />全选'
             }, */{
                field: "SERVICE_NAME",
                title: "采集代理"
            }, {
                field: "NAME",
                title: "采集任务",
                width: 140
            }, {
                field: "SERVICE_HOST",
                title: "IP地址"
            }, {
                field: "JSONCONFIG",
                title: "任务示意",
                template: "#=showFunc(data)#",
                width: 260
            }, {
                field: "STATE",
                title: "部署状态",
                template: "#=deployStateFunc(data)#"
            },
            /*     {
             field: "monState",
             title: "是否监控1",
             template: "#=monStateFunc(data)#"
             },*/
            /* {
             field: "monState",
             title: "是否监控2",
             template: function (dataItems) {
             console.log(dataItems);

             var monState = dataItems.monState;
             var value = "";
             if (monState === "0") {/!*开启*!/
             value = "关闭监控";
             /!*需要关闭*!/
             } else if (monState === "1") {/!*关闭*!/
             value = "开启监控";
             /!*需要开启*!/
             }
             switchFunc11 = function () {
             var successFun = function (data) {
             common.jqConfirm.alert({
             title: 1,
             content: "操作成功！",
             call: function () {
             logstashjsonConfigGrid.refreshDatas();
             }
             });
             };
             var url = "logService/logworker/logstash/monitor/startMonitor";
             replaceUrl(url);
             var params = {
             "serviceId": dataItems.logWorker.serviceId,
             "recordId": dataItems.id,
             "monState": dataItems.monState
             };
             common.ajaxPost("url", params, successFun, null, null, $("#logstashjsonConfig"));
             };
             return '<input type="button" value="' + value + '" onclick="switchFunc11()"/>';
             }
             },*/
            /*   {
             command: [{
             /!* className: "info",*!/
             name: "monitorSwitchBtn",
             /!*     imageClass: "",
             iconClass: "",*!/
             text: "开启监控",
             click: function (e) {//缺点：只有点击事件才能触发；无法初始化该事件；
             var tr = $(e.target).closest("tr");
             var data = this.dataItem(tr);
             var monState = data.monState;
             if (monState === "0") {/!*开启*!/
             tr.find(".k-grid-monitorSwitchBtn").html("关闭监控");
             /!*需要关闭*!/
             } else if (monState === "1") {/!*关闭*!/
             tr.find(".k-grid-monitorSwitchBtn").html("开启监控");
             /!*需要开启*!/
             }
             e.preventDefault();// return false;

             }
             }], title: "开启监控3", width: "100px"/!*, locked: true, lockable: true*!/
             },*/
            {
                title: "监控操作",
                width: "100px",
                command: [{
                    template: "<button class='monitorSwitchBtn  k-button' onclick='monitorSwitchFunc(this)'></button>"
                }]
            }, {
                title: "查看详情",
                width: "70px",
                command: [{
                    template: "<i class=\"fa fa-search fa_icon\" title='查看详情'  style='cursor:pointer;' onclick='detailsFunc(this)'></i>"
                }]
            }
        ],

        dataBound: function () {
            var grid = this;
            grid.tbody.find('tr[role="row"]').each(function () {
                var row = this;
                var data = grid.dataItem(this);
                /*监控操作*/
                if (data.MONSTATE === "0") {/*开启*/
                    $(this).find(".monitorSwitchBtn").html("关闭监控").css("color", "red");
                    /*需要关闭*/
                } else if (data.MONSTATE === "1") {/*关闭*/
                    $(this).find(".monitorSwitchBtn").html("开启监控").css("color", "green");
                    /*需要开启*/
                }

                /*部署状态*/
                if (data.STATE === "1") {//部署状态已经停止；
                    $(this).find(".monitorSwitchBtn").hide();
                } else if (data.STATE === "0") {//部署状态已经开启；
                    /*可用*/
                } else if (data.STATE === "2") {//部署状态异常；
                    $(this).find(".monitorSwitchBtn").hide();
                } else if (data.STATE === "3") {//部署状态已经删除；
                    $(this).find(".monitorSwitchBtn").hide();
                }
            });
        },

        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: logstashjsonConfigGrid.rows
                },
                paramObj: logstashjsonConfigGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 5
                });
                logstashjsonConfigGrid.getInst().setDataSource(gridData, pageBean);
            };
            var url = "logworker/logstash/config/deploy/queryLogStashConfigRecordList";
            /*replaceUrl(url);*/
            common.ajaxPost(url, param, successFun, null, null, $("#logstashjsonConfig"));
        },
        pagerCallBack: function (e) {
            logstashjsonConfigGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (logstashjsonConfigGrid.inst) {
                logstashjsonConfigGrid.inst = new wandaComp.wandaGrid("logstashjsonConfigGrid", this.gridColums, true, this.pagerCallBack, null, null, this.dataBound);
            }
            return logstashjsonConfigGrid.inst;
        },
        init: function () {
            logstashjsonConfigGrid.getInst().init();
            logstashjsonConfigGrid.pagerParam = {
                "logstashId": "",
                "recordName": "",
                "recordStatus": ""
            };
            logstashjsonConfigGrid.refreshDatas();
        }
    };


    var logstashjsonConfig_searchBtn = {
        init: function () {
            $("#searchBtn").click(function () {
                var name = $("#name").val();
                var logWorkerName = $("#logWorkerName").val();
                var deployState = $("#deployState").val();
                logstashjsonConfigGrid.pagerParam = {
                    "logstashId": logWorkerName,
                    "recordName": name,
                    "recordStatus": deployState
                };
                logstashjsonConfigGrid.refreshDatas();
            });
        }
    };

    var logstashjsonConfig_addBtn = {
        /*  navigatePage: function () {
         var menucode = window.location.hash.substr(1, window.location.hash.length);
         var _param = {"isAdd": true, "menuCode": menucode};
         common.setRouterParams(_param);
         router.navigate('10070201');
         },*/
        init: function () {
            $("#addBtn").on("click", function () {
                var successFun = function (data) {
                    var data = data.datas;
                    if (data.length === 0) {
                        common.jqConfirm.alert({
                            title: 0,
                            content: "采集代理已下线，无法新增采集任务！"
                        });
                        return false;
                    } else {
                        /*  logstashjsonConfig_addBtn.navigatePage;*/
                        var menucode = window.location.hash.substr(1, window.location.hash.length);
                        var _param = {"isAdd": true, "menuCode": menucode};
                        common.setRouterParams(_param);
                        router.navigate('10070201');
                    }
                };
                var url = "logworker/logstash/queryLogStashInfoAllList";
                /*replaceUrl(url);*/
                var param = {
                    paramObj: {
                        "logstashId": "",
                        "logstashHost": "",
                        "logstashStatus": "online"
                    }
                };
                common.ajaxPost(url, param, successFun, null, null, $("#logstashjsonConfig"));
            });
        }
    };

    /*  var logstashjsonConfig_editBtn = {
     gridSelectValue: function () {
     var selectEdit = logstashjsonConfigGrid.getInst().getSelect();
     return selectEdit;
     },
     navigatePage: function () {
     var selectEdit = logstashjsonConfig_editBtn.gridSelectValue();
     if (selectEdit.length == 1) {
     var menucode = window.location.hash.substr(1, window.location.hash.length);
     var id = selectEdit[0]["id"];
     var _param = {"isAdd": false, "menuCode": menucode, "id": id};
     common.setRouterParams(_param);
     router.navigate('10070201');
     } else {
     common.jqConfirm.alert({
     title: 0,
     content: "请选择一条数据!"
     });
     }
     },
     init: function () {
     $("#editBtn").on("click", logstashjsonConfig_editBtn.navigatePage)
     }
     };*/

    var logstashjsonConfig_deltBtn = {
        gridSelectValue: function () {
            var selectDelet = logstashjsonConfigGrid.getInst().getSelect();
            return selectDelet;
        },
        init: function () {
            $("#deltBtn").on("click", function () {
                var selectDelet = logstashjsonConfig_deltBtn.gridSelectValue();
                if (selectDelet.length == 1) {
                    var deltParam = selectDelet[0].id;
                    var successFun = function (data) {
                        common.jqConfirm.alert({
                            title: 1,
                            content: "操作成功！",
                            call: function () {
                                logstashjsonConfigGrid.refreshDatas();
                            }
                        });
                    };
                    common.jqConfirm.confirm({
                        content: "是否确认删除？",
                        call: function () {
                            var url = "logService/logworker/logstash/config/deploy/" + deltParam;
                            /* replaceUrl(url);*/
                            common.ajaxDelete(url, deltParam, successFun, null, null, $("#logstashjsonConfig"));
                        }
                    });
                } else {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择一条数据！"
                    });
                    return false;
                }
            })
        }
    };

    /*    var replaceUrl = function (url) {
     var ajaxFunc = $.ajax;
     $.ajax = function () {
     arguments[0].url = url;
     ajaxFunc.apply($, arguments);
     $.ajax = ajaxFunc;
     };
     };*/

    var extendInit = function () {
        logWorkerName_DropDownList.init();
        deployState_DropDownList.init();
        logstashjsonConfig_searchBtn.init();
        /*     logstashjsonConfig_editBtn.init();*/
        logstashjsonConfig_deltBtn.init();
        logstashjsonConfigGrid.init();
        logstashjsonConfig_addBtn.init();
    };
    return {
        init: extendInit
    };
});