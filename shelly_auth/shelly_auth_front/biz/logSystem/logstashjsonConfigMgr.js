define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {

    var serviceId_DropDownList = {
        value: "",
        setValue: function (value) {
            $("#serviceId").data("wandaDropDownList").value(value);
            serviceId_DropDownList.value = value;
        },
        successFun: function (data) {
            if (data.datas.length === 0) {
                $("#saveCloseBtn").hide();
            } else {
                var serviceId = $("#serviceId").data("wandaDropDownList");
                serviceId.setDataSource(data.datas);
                serviceId_DropDownList.setValue(serviceId_DropDownList.value);
                serviceId.select(0);
            }
        },
        init: function () {
            $("#serviceId").wandaDropDownList({
                /*   optionLabel: {
                 name: "--请选择--",
                 id: ""
                 },*/
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                change: function (e) {

                }
            });
            var url = "logworker/logstash/queryLogStashInfoAllList";
            /* replaceUrl(url);*/
            var param = {};
            if ($("#isAdd").val() === "false") { //查详情
                param = {
                    paramObj: {}
                };
            } else {//新增；
                param = {
                    paramObj: {
                        "status": "online"
                    }
                };
            }
            common.ajaxPost(url, param, serviceId_DropDownList.successFun, null, null, $("#logstashjsonConfigMgr"));
        }
    };

    /* var isMonitor_DropDownList = {
     data: [{text: "是", value: "start"}, {text: "否", value: "stop"}],
     init: function () {
     $("#isMonitor").wandaDropDownList({
     /!*    optionLabel: {
     text: "--请选择--",
     value: ""
     },*!/
     dataTextField: "text",
     dataValueField: "value",
     dataSource: isMonitor_DropDownList.data,
     index: 0,
     change: function (e) {
     }
     });
     }
     };*/

    var input_type_DropDownList = {
        data: [{text: "file", value: "2"}, {text: "kafka", value: "1"}, {text: "http", value: "3"}],
        init: function () {
            $("#input_type").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: input_type_DropDownList.data,
                index: 0,
                cascade: function (e) {
                    var dataItem = this.dataItem();
                    input_messageShow(dataItem["value"]);
                }
            });
        }
    };
    var input_messageShow = function (param) {
        if (param == 1) {
            $("#input_kafkaDiv").show();
            $("#input_fileDiv").hide();
            $("#input_httpDiv").hide();
        } else if (param == 2) {
            $("#input_fileDiv").show();
            $("#input_kafkaDiv").hide();
            $("#input_httpDiv").hide();
        } else if (param == 3) {
            $("#input_httpDiv").show();
            $("#input_kafkaDiv").hide();
            $("#input_fileDiv").hide();
        }
    };

    var output_type_DropDownList = {
        data: [{text: "kafka", value: "1"}, {text: "http", value: "3"}, {text: "es", value: "2"}],
        init: function () {
            $("#output_type").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: output_type_DropDownList.data,
                index: 0,
                cascade: function (e) {
                    var dataItem = this.dataItem();
                    output_messageShow(dataItem["value"]);
                }
            });
        }
    };
    var output_messageShow = function (param) {
        if (param == 1) {
            $("#output_urlDiv").show();
            $("#output_topicDiv").show();
            $("#output_esDiv").hide();
            $("#output_methodDiv").hide();
        } else if (param == 2) {
            $("#output_esDiv").show();
            $("#output_urlDiv").hide();
            $("#output_topicDiv").hide();
            $("#output_methodDiv").hide();
        } else if (param == 3) {
            $("#output_urlDiv").show();
            $("#output_methodDiv").show();
            $("#output_topicDiv").hide();
            $("#output_esDiv").hide();
        }
    };

    var method_DropDownList = {
        data: [{text: "post", value: "1"}, {text: "get", value: "2"}],
        init: function () {
            $("#output_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: method_DropDownList.data,
                index: 0
            });
        }
    };

    var getFormValue = function () {

        var serviceId = $("#serviceId").val();
        var name = $("#name").val();
        /*var monState = $("#isMonitor").val();*/
        /*input*/
        var input_type_dropdownlist = $("#input_type").data("wandaDropDownList");
        var input_type_dataItem = input_type_dropdownlist.dataItem();
        var input_type = input_type_dataItem.text;
        var input_logId = $("#input_logId").val();
        var input_path = $("#input_path").val();
        var input_url = $("#input_url").val();
        var input_group = $("#input_group").val();
        var input_topic = $("#input_topic").val();
        var input_host = $("#input_host").val();
        var input_port = $("#input_port").val();
        /*filter*/
        var filter = [];
        var filter_match = $("#filter_match").val();
        var filter_tag = $("#filter_tag").val();
        if (filter_match !== "") {
            filter.push({
                "type": "grok",
                "matchFilter": filter_match
            })
        }
        if (filter_tag !== "") {
            filter.push({
                "type": "mutate",
                "tag": filter_tag
            })
        }
        /*output*/
        var output_type_dropdownlist = $("#output_type").data("wandaDropDownList");
        var output_type_dataItem = output_type_dropdownlist.dataItem();
        var output_type = output_type_dataItem.text;
        var output_url = $("#output_url").val();
        var output_topic = $("#output_topic").val();
        var output_host = $("#output_host").val();
        var output_index = $("#output_index").val();
        var output_doc = $("#output_doc").val();
        var output_method_dropdownlist = $("#output_method").data("wandaDropDownList");
        var output_method_dataItem = output_method_dropdownlist.dataItem();
        var output_method = output_method_dataItem.text;

        var params = {
            "serviceId": serviceId,
            "name": name,
            /* "monState": monState,*/
            "input": {
                "type": input_type,
                "path": input_path,
                "url": input_url,
                "group": input_group,
                "topic": input_topic,
                "host": input_host,
                "port": input_port,
                "logId": input_logId
            },
            "filter": filter,
            "output": {
                "type": output_type,
                "url": output_url,
                "topic": output_topic,
                "host": output_host,
                "index": output_index,
                "doc": output_doc,
                "method": output_method
            }
        };
        if ($("#isAdd").val() === "false") { //修改
            params.recordId = $("#recordId").val();
        }
        return params;
    };

    var verification = function (param) {
        if (param.serviceId === "") {
            common.jqConfirm.alert({
                title: 0,
                content: "请选择采集代理！"
            });
            return false;
        }

        if (param.name === "") {
            common.jqConfirm.alert({
                title: 0,
                content: "请输入名称！"
            });
            return false;
        }
        /*      if (param.monState === "") {
         common.jqConfirm.alert({
         title: 0,
         content: "请选择是否监控！"
         });
         return false;
         }*/
        /*input*/
        if (param.input.logId === "") {
            common.jqConfirm.alert({
                title: 0,
                content: "请输入日志标识！"
            });
            return false;
        }
        var input_type = param.input.type;
        if (input_type === "kafka") {
            if (param.input.url === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入URL地址！"
                });
                return false;
            }
            if (param.input.group === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入组名称！"
                });
                return false;
            }
            if (param.input.topic === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入主题名称！"
                });
                return false;
            }
        } else if (input_type === "file") {
            if (param.input.path === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入文件路径！"
                });
                return false;
            }
        } else if (input_type === "http") {
            var hostReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            var portReg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
            if (param.input.host === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入服务IP地址！"
                });
                return false;
            } else if (!hostReg.test(param.input.host)) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入正确的服务IP地址!"
                });
                return false;
            }
            if (param.input.port === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入服务端口号！"
                });
                return false;
            } else if (!portReg.test(param.input.port)) {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入正确的端口号！"
                });
                return false;
            }
        }
        /*output*/
        var out_type = param.output.type;
        if (out_type === "kafka") {
            if (param.output.url === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入URL地址！"
                });
                return false;
            }
            if (param.output.topic === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入主题名称！"
                });
                return false;
            }
        } else if (out_type === "es") {
            if (param.output.host === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入服务IP地址！"
                });
                return false;
            }
            if (param.output.index === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入索引名称！"
                });
                return false;
            }
            if (param.output.doc === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入文档名称！"
                });
                return false;
            }

        } else if (out_type === "http") {
            if (param.output.method === "") {
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入提交方法！"
                });
                return false;
            }
        }
        return true;
    };

    var refreshPage = function () {
        $("#serviceId").val("");
        $("#name").val("");
        /*  $("#isMonitor").val("");*/
        /*input*/
        var input_type_dropdownlist = $("#input_type").data("wandaDropDownList");
        input_type_dropdownlist.select(0);
        $("#input_logId").val("");
        $("#input_path").val("");
        $("#input_url").val("");
        $("#input_group").val("");
        $("#input_topic").val("");
        $("#input_host").val("");
        $("#input_port").val("");
        /*filter*/
        $("#filter_tag").val("");
        $("#filter_match").val("");
        /*output*/
        var output_type_dropdownlist = $("#output_type").data("wandaDropDownList");
        output_type_dropdownlist.select(0);
        $("#output_url").val("");
        $("#output_topic").val("");
        $("#output_host").val("");
        $("#output_index").val("");
        $("#output_doc").val();
        var output_method_dropdownlist = $("#output_method").data("wandaDropDownList");
        output_method_dropdownlist.select(0);
    };

    var queryJsonConfigDetail = {
        init: function (id) {
            var successFun = function (data) {
                var data = data.datas;
                serviceId_DropDownList.setValue(data.SERVICE_ID);
                $("#name").val(data.NAME);
                /*  $("#isMonitor").val(data.monState);*/

                /*input*/
                var jsonConfig = JSON.parse(data.JSONCONFIG);

                var input_type_dropdownlist = $("#input_type").data("wandaDropDownList");
                if (jsonConfig.input.type === "kafka") {
                    input_type_dropdownlist.value("1");
                } else if (jsonConfig.input.type === "file") {
                    input_type_dropdownlist.value("2");
                } else if (jsonConfig.input.type === "http") {
                    input_type_dropdownlist.value("3");
                }
                $("#input_logId").val(jsonConfig.input.logId);
                $("#input_path").val(jsonConfig.input.path);
                $("#input_url").val(jsonConfig.input.url);
                $("#input_group").val(jsonConfig.input.group);
                $("#input_topic").val(jsonConfig.input.topic);
                $("#input_host").val(jsonConfig.input.host);
                $("#input_port").val(jsonConfig.input.port);
                /*filter*/
                /*       for (var i = 0; i < data.filter.length; i++) {
                 if (data.filter[i].matchFilter) {
                 $("#filter_match").val(data.filter[i].matchFilter);
                 }
                 if (data.filter[i].tag) {
                 $("#filter_tag").val(data.filter[i].tag);
                 }
                 }*/
                /*output*/
                var out_type_dropdownlist = $("#output_type").data("wandaDropDownList");
                if (jsonConfig.output.type === "kafka") {
                    out_type_dropdownlist.value("1");
                } else if (jsonConfig.output.type === "es") {
                    out_type_dropdownlist.value("2");
                } else if (jsonConfig.output.type === "http") {
                    out_type_dropdownlist.value("3");
                }
                $("#output_url").val(jsonConfig.output.url);
                $("#output_topic").val(jsonConfig.output.topic);
                $("#output_host").val(jsonConfig.output.host);
                $("#output_index").val(jsonConfig.output.index);
                $("#output_doc").val(jsonConfig.output.doc);
                var output_method_dropdownlist = $("#output_method").data("wandaDropDownList");
                if (jsonConfig.output.method === "post") {
                    output_method_dropdownlist.value("1");
                } else if (jsonConfig.output.method === "get") {
                    output_method_dropdownlist.value("2");
                }

                var serviceId = $("#serviceId").data("wandaDropDownList");
                serviceId.readonly();
                input_type_dropdownlist.readonly();
                out_type_dropdownlist.readonly();
                output_method_dropdownlist.readonly();
                $("#input_logId,#input_path,#input_url,#input_group,#input_topic,#input_host,#input_port").attr("readonly", "readonly");
                $("#output_url,#output_topic,#output_host,#output_index,#output_doc").attr("readonly", "readonly");


            };
            var url = "logworker/logstash/config/deploy/queryLogStashConfigRecordAllList";
            /*  replaceUrl(url);*/
            var param = {
                paramObj: {
                    "recordId": id
                }
            };
            common.ajaxPost(url, param, successFun, null, null, $("#logstashjsonConfigMgr"));
        }
    };

    var saveAndCloseBtn = {
        init: function () {
            $("#saveCloseBtn").click(function () {
                var _param = getFormValue();
                if (verification(_param)) {
                    var isAdd = $("#isAdd").val();
                    if (isAdd === "true") {
                        var url = "logworker/logstash/config/deploy/deployLogStashConfigRecord";
                        /*  replaceUrl(url);*/
                        common.ajaxPost(url, _param, function () {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    router.navigate($("#menuCode").val());
                                }
                            });
                        }, null, null, null);
                    }
                    /* else {
                     var _params = common.getRouterParams();
                     var id = _params["id"];
                     var url = "logService/logworker/logstash/config/deploy/" + id;
                     replaceUrl(url);
                     common.ajaxPut(url, _param, function () {
                     common.jqConfirm.alert({
                     title: 1,
                     content: "操作成功！",
                     call: function () {
                     router.navigate($("#menuCode").val());
                     }
                     });
                     }, null, null, null);
                     }*/
                }
            });
        }
    };

    var closeBtn = {
        init: function () {
            $("#closeBtn").click(function () {
                router.navigate($("#menuCode").val());
            });
        }
    };

    /*  var replaceUrl = function (url) {
     var ajaxFunc = $.ajax;
     $.ajax = function () {
     arguments[0].url = url;
     ajaxFunc.apply($, arguments);
     $.ajax = ajaxFunc;
     };
     };*/


    var backButon = {
        init: function () {
            $("#backButon").click(function () {
                router.navigate($("#menuCode").val());
            })
        }
    };

    var initParams = function () {
        var _params = common.getRouterParams();
        $("#menuCode").val(_params["menuCode"]);
        $("#isAdd").val(_params.isAdd);
        if ($("#isAdd").val() === "false") { //查详情；
            $(".editNoShow").hide();
            $("#backButonDiv").show();
            queryJsonConfigDetail.init(_params["RECORDID"]);
        } else {
            $(".editNoShow").show();
            closeBtn.init();
            saveAndCloseBtn.init();
        }
    };


    var extendInit = function () {
        initParams();
        serviceId_DropDownList.init();
        /*  isMonitor_DropDownList.init();*/
        input_type_DropDownList.init();
        output_type_DropDownList.init();
        method_DropDownList.init();
        backButon.init();
    };
    return {
        init: extendInit
    };
});