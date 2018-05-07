define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    var logstashId_DropDownList = {
        value: "",
        setValue: function (value) {
            $("#logstashId").data("wandaDropDownList").value(value);
            logstashId_DropDownList.value = value;
        },
        successFun: function (data) {
            var logstashId = $("#logstashId").data("wandaDropDownList");
            logstashId.setDataSource(data.datas);
            logstashId_DropDownList.setValue(logstashId_DropDownList.value);
        },
        init: function () {
            $("#logstashId").wandaDropDownList({
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
            /*     replaceUrl(url);*/
            var param = {
                paramObj: {}
            };
            common.ajaxPost(url, param, logstashId_DropDownList.successFun, null, null, $("#logstashController"));
        }
    };

    var logstashStatus_DropDownList = {
        value: "",
        setValue: function (value) {
            $("#logstashStatus").data("wandaDropDownList").value(value);
            logstashStatus_DropDownList.value = value;
        },
        successFun: function (data) {
            var logstashStatus = $("#logstashStatus").data("wandaDropDownList");
            logstashStatus.setDataSource(data);
            logstashStatus_DropDownList.setValue(logstashStatus_DropDownList.value);
        },
        init: function () {
            $("#logstashStatus").wandaDropDownList({
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
                "key": "operationState"
            };
            common.ajaxGet(url, param, logstashStatus_DropDownList.successFun, null, null, $("#logstashController"));
        }
    };

    statusFunc = function (data) {
        var _class = "", msg = "", fontColor = "", status = data.STATUS;
        if (status === "online") {
            _class = "online";
            msg = "运行中";
            fontColor = "#090";
        } else if (status === "offline") {
            _class = "offline";
            msg = "已停止";
            fontColor = "#ccc";
        }
        return "<div style='text-align:center;color:" + fontColor + ";font-size: 10px;'><div class='" + _class + "'></div>" + msg + "</div>";
    };

    //列表Grid
    var logstashControllerGrid = {
        rows: "10",
        pagerParam: {},
        gridColums: [
            {
                field: "SERVICE_ID",
                title: "服务id"
            }, {
                field: "SERVICE_NAME",
                title: "采集代理"
            }, {
                field: "SERVICE_HOST",
                title: "ip地址",
                width: "120px"
            }, {
                field: "START_UP_TIME_FORMAT",
                title: "上次启动时间",
                width: "160px"
            }, {
                field: "STATUS",
                title: "运行状态",
                template: "#=statusFunc(data)#"
            }, {
                command: [{
                    className: "info",
                    name: "collectBtn",
                    imageClass: "",
                    iconClass: "",
                    text: "<i class=\"fa fa-search fa_icon\" title='查看采集任务'></i>",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        var menucode = window.location.hash.substr(1, window.location.hash.length);
                        var logstashId = $("#logstashId").val();
                        var logstashHost = $("#logstashHost").val();
                        var logstashStatus = $("#logstashStatus").val();
                        var _param = {
                            "serviceId": data.SERVICE_ID,
                            "prePageParam": {
                                "menuCode": menucode,
                                "logstashId": logstashId,
                                "logstashHost": logstashHost,
                                "logstashStatus": logstashStatus
                            }
                        };
                        common.setRouterParams(_param);
                        router.navigate('10070101');
                        return false;
                    }
                }], title: "操作", width: "100px"
            }],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                pageBean: {
                    page: page + "",
                    rows: logstashControllerGrid.rows
                },
                paramObj: logstashControllerGrid.pagerParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                logstashControllerGrid.getInst().setDataSource(gridData, pageBean);
            };
            var url = "logworker/logstash/queryLogStashInfoList";
            /*replaceUrl(url);*/
            common.ajaxPost(url, param, successFun, null, null, $("#logstashController"));
        },
        pagerCallBack: function (e) {
            logstashControllerGrid.refreshDatas(e.index);
        },
        inst: {},
        getInst: function () {
            if (logstashControllerGrid.inst) {
                logstashControllerGrid.inst = new wandaComp.wandaGrid("logstashControllerGrid", this.gridColums, true, this.pagerCallBack);
            }
            return logstashControllerGrid.inst;
        },
        init: function () {
            logstashControllerGrid.getInst().init();
            logstashControllerGrid.pagerParam = {
                "logstashId": "",
                "logstashHost": "",
                "logstashStatus": ""
            };
            logstashControllerGrid.refreshDatas();
        }
    };

    var logstashController_searchBtn = {
        init: function () {
            $("#searchBtn").click(function () {
                var logstashId = $("#logstashId").data("wandaDropDownList").value();
                var logstashHost = $("#logstashHost").val();
                var hostReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                var logstashStatus = $("#logstashStatus").data("wandaDropDownList").value();
                /*  var port = $("#port").val();
                 var portReg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;*/
                if (logstashHost !== "" && !hostReg.test(logstashHost)) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请输入正确的ip地址!"
                    });
                    return false;
                }/* else if (port !== "" && !portReg.test(port)) {
                 common.jqConfirm.alert({
                 title: 0,
                 content: "请输入正确的端口号！"
                 });
                 return false;
                 } */ else {
                    logstashControllerGrid.pagerParam = {
                        "logstashId": logstashId,
                        "logstashHost": logstashHost,
                        "logstashStatus": logstashStatus
                    };
                    logstashControllerGrid.refreshDatas();
                }
            });
        }
    };

    //新增btn——PopupWin
    /*var logstashController_addPopup = {
     inst: {},
     optionObj: {
     minWidth: 500,
     minHeight: 300,
     maxWidth: "",
     maxHeight: "",
     title: "新增",
     content: "biz/logSystem/logstashController_popup.html"
     },
     getInst: function() {
     if (logstashController_addPopup.inst) {
     logstashController_addPopup.inst = new wandaComp.wandaWindow("addBtn", "logstashController_addPopup", logstashController_addPopup.optionObj);
     }
     return logstashController_addPopup.inst;
     },
     setSubPageValue: function() {
     $("#logstashController_addPopup").find("#id").val("");
     $("#logstashController_addPopup").find("#serviceId").val("");
     $("#logstashController_addPopup").find("#port").val("");
     $("#logstashController_addPopup").find("#host").val("");
     },
     submitBtnCallBack: function(closeFun) {
     var name = $("#logstashController_addPopup").find("#id").val();
     var serviceId = $("#logstashController_addPopup").find("#serviceId").val();
     var port = $("#logstashController_addPopup").find("#port").val();
     var ip = $("#logstashController_addPopup").find("#host").val();
     var addPararm = {
     "name": name,
     "serviceId": serviceId,
     "port": port,
     "host": ip
     };
     var successFun = function(data) {
     common.jqConfirm.alert({
     title: 1,
     content: "操作成功！",
     call: function() {
     logstashControllerGrid.refreshDatas();
     var plusPopup = $("#logstashController_addPopup").data("wandaWindow");
     plusPopup.close();
     }
     });
     };
     var url = "logService/logworker/logstash";
     replaceUrl(url);
     common.ajaxPost(url, addPararm, successFun);
     },
     cancelBtnCallBack: function() {},
     init: function() {
     logstashController_addPopup.getInst().init(function() {
     logstashController_addPopup.setSubPageValue();
     var initFun = logstashController_popup.init;
     common.initExeByAttr("logstashController_addPopup", "opt='submit'", function() {
     initFun("logstashController_addPopup");
     });
     });
     logstashController_addPopup.getInst().callBack("opt='submit'", logstashController_addPopup.submitBtnCallBack, true);
     logstashController_addPopup.getInst().callBack("opt='cancel'", logstashController_addPopup.cancelBtnCallBack);
     }
     };*/

    //修改btn——PopupWin
    /* var logstashController_editPopup = {
     inst: {},
     optionObj: {
     minWidth: 500,
     minHeight: 300,
     maxWidth: "",
     maxHeight: "",
     title: "修改",
     content: "biz/logSystem/logstashController_popup.html"
     },
     getInst: function() {
     if (logstashController_editPopup.inst) {
     logstashController_editPopup.inst = new wandaComp.wandaWindow("editBtn", "logstashController_editPopup", logstashController_editPopup.optionObj);
     }
     return logstashController_editPopup.inst;
     },
     getGridSelectValue: function() {
     var selectEdit = logstashControllerGrid.getInst().getSelect();
     return selectEdit;
     },
     setSubPageValue: function() {
     var selectEdit = logstashController_editPopup.getGridSelectValue();
     if (selectEdit.length != 1) {
     common.jqConfirm.alert({
     title: 0,
     content: "请选择一条数据！"
     });
     return false;
     } else {
     $("#logstashController_editPopup").find("#id").val(selectEdit[0]["name"]);
     $("#logstashController_editPopup").find("#serviceId").val(selectEdit[0]["serviceId"]);
     $("#logstashController_editPopup").find("#port").val(selectEdit[0]["port"]);
     $("#logstashController_editPopup").find("#host").val(selectEdit[0]["host"]);
     $("#logstashController_editPopup").find("#id").val(selectEdit[0]["id"]);
     }
     },
     submitBtnCallBack: function(closeFun) {
     var name = $("#logstashController_editPopup").find("#id").val();
     var serviceId = $("#logstashController_editPopup").find("#serviceId").val();
     var port = $("#logstashController_editPopup").find("#port").val();
     var ip = $("#logstashController_editPopup").find("#host").val();
     var id = $("#logstashController_editPopup").find("#id").val();
     var editParam = {
     "id": parseInt(id),
     "name": name,
     "serviceId": serviceId,
     "port": port,
     "host": ip
     };
     var successFun = function(data) {
     common.jqConfirm.alert({
     title: 1,
     content: "操作成功！",
     call: function() {
     logstashControllerGrid.refreshDatas();
     var logstashController_editPopup = $("#logstashController_editPopup").data("wandaWindow");
     logstashController_editPopup.close();
     }
     });
     };
     var url = "logService/logworker/logstash/" + parseInt(id);
     replaceUrl(url);
     common.ajaxPut(url, editParam, successFun);
     },
     cancelBtnCallBack: function() {},
     init: function() {
     logstashController_editPopup.getInst().init(function() {
     var isOk = logstashController_editPopup.setSubPageValue();
     if (isOk == false)
     return isOk;
     var initFun = logstashController_popup.init;
     common.initExeByAttr("logstashController_editPopup", "opt='submit'", function() {
     initFun("logstashController_editPopup");
     });
     });
     logstashController_editPopup.getInst().callBack("opt='submit'", logstashController_editPopup.submitBtnCallBack, true);
     logstashController_editPopup.getInst().callBack("opt='cancel'", logstashController_editPopup.cancelBtnCallBack);
     }
     };*/

    /*var logstashController_deltBtn = {
     gridSelectValue: function() {
     var selectEdit = logstashControllerGrid.getInst().getSelect();
     return selectEdit;
     },
     init: function() {
     $("#deltBtn").on("click", function() {
     var selectDelet = logstashController_deltBtn.gridSelectValue();
     if (selectDelet.length == 1) {
     var deltParam = selectDelet[0]["id"];
     var successFun = function(data) {
     common.jqConfirm.alert({
     title: 1,
     content: "操作成功！",
     call: function() {
     logstashControllerGrid.refreshDatas();
     }
     });
     };
     common.jqConfirm.confirm({
     content: "是否确认删除？",
     call: function() {
     var url = "logService/logworker/logstash/" + deltParam;
     replaceUrl(url);
     common.ajaxDelete(url, deltParam, successFun, null, null, $("#logstashController"));
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
     };*/

    /*   var replaceUrl = function (url) {
     var ajaxFunc = $.ajax;
     $.ajax = function () {
     arguments[0].url = url;
     ajaxFunc.apply($, arguments);
     $.ajax = ajaxFunc;
     };
     };*/

    var initParams = function () {
        var _params = common.getRouterParams();
        if (_params) {
            var logstashId = _params["logstashId"] === undefined ? "" : _params["logstashId"];
            var logstashHost = _params["logstashHost"] === undefined ? "" : _params["logstashHost"];
            var logstashStatus = _params["logstashStatus"] === undefined ? "" : _params["logstashStatus"];
            logstashId_DropDownList.setValue(logstashId);
            $("#logstashHost").val(logstashHost);
            logstashStatus_DropDownList.setValue(logstashStatus);

            logstashControllerGrid.pagerParam = {
                "logstashId": logstashId,
                "logstashHost": logstashHost,
                "logstashStatus": logstashStatus
            };
            logstashControllerGrid.refreshDatas();
        }
    };

    var extendInit = function () {
        logstashId_DropDownList.value = "";
        $("#logstashHost").val("");
        logstashStatus_DropDownList.value = "";

        logstashId_DropDownList.init();
        logstashStatus_DropDownList.init();
        logstashController_searchBtn.init();
        /*    logstashController_addPopup.init();
         logstashController_editPopup.init();
         logstashController_deltBtn.init();*/
        logstashControllerGrid.init();
        initParams();

    };
    return {
        init: extendInit
    };
});