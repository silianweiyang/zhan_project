define(["jquery", "common", "wandaComp", "wandaCompR", "jsonpath", "xml2json"], function ($, common, wandaComp, wandaCompR, JSONPath, X2JS) {
    //应用名称
    var api_serverName = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_serverName").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_serverName.value = value;
            api_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_serverName").data("wandaDropDownList").setDataSource(data);
            if (api_serverName.value) {
                api_serverName.getInst().value(api_serverName.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_serverName").wandaDropDownList({
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0
            });
            /*var param = {"isAuth": "yes"};*/
            /*common.ajaxGet("api/gateService/queryGateServiceAll", {}, api_serverName.successFun, null, null, $("#OrderMgrDetail"));*/
        }
    };
    //状态
    var api_state = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_state").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_state.value = value;
            api_state.getInst().value(value);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_state").data("wandaDropDownList").setDataSource(data);
            if (api_state.value) {
                api_state.getInst().value(api_state.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_state").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_state.successFun, null, null, $("#OrderMgrDetail"));
        }
    };
    //api方法
    var api_method = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_method").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_method.value = value;
            api_method.getInst().value(value);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_method").data("wandaDropDownList").setDataSource(data);
            if (api_method.value) {
                api_method.getInst().value(api_method.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change: function (e) {
                    var value = this.value();
                    if (value != api_method.value) {
                        $("#OrderMgrDetail_isAddHis").val("yes");
                    } else {
                        $("#OrderMgrDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_method.successFun, null, null, $("#OrderMgrDetail"));
        }
    };
    //入参tabstrip
    var api_tabstrip = {
        init: function () {
            $("#APIMgr_inparamDemoContent").unbind("slideToggle");
            $("#APIMgr_inparamDemoTitle").unbind("click");
            $("#APIMgr_inparamDemoTitle").click(function () {
                $("#APIMgr_inparamDemoContent").slideToggle("slow", function () {
                    if ($('#APIMgr_inparamDemoContent').css('display') == "none") {
                        $("#APIMgr_inparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    } else {
                        $("#APIMgr_inparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#APIMgr_outparamDemoContent").unbind("slideToggle");
            $("#APIMgr_outparamDemoTitle").unbind("click");
            $("#APIMgr_outparamDemoTitle").click(function () {
                $("#APIMgr_outparamDemoContent").slideToggle("slow", function () {
                    if ($('#APIMgr_outparamDemoContent').css('display') == "none") {
                        $("#APIMgr_outparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    } else {
                        $("#APIMgr_outparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#descHighParamFilterContent").unbind("slideToggle");
            $("#descHighParamFilterTitle").unbind("click");
            $("#descHighParamFilterTitle").click(function () {
                $("#descHighParamFilterContent").slideToggle("slow", function () {
                    if ($('#descHighParamFilterContent').css('display') == "none") {
                        $("#descHighParamFilterTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    } else {
                        $("#descHighParamFilterTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
        }
    };
    // 传输协议
    var api_transProto = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_transProto").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_transProto.value = value;
            api_transProto.getInst().value(value);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_transProto").data("wandaDropDownList").setDataSource(data);
            if (api_transProto.value) {
                api_transProto.getInst().value(api_transProto.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_transProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change: function (e) {
                    var value = this.value();
                    if (value != api_transProto.value) {
                        $("#OrderMgrDetail_isAddHis").val("yes");
                    } else {
                        $("#OrderMgrDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_transProto.successFun, null, null, $("#OrderMgrDetail"));
        }
    };
    // 报文协议
    var api_contentProto = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_contentProto").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_contentProto.value = value;
            api_contentProto.getInst().value(value);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_contentProto").data("wandaDropDownList").setDataSource(data);
            if (api_contentProto.value) {
                api_contentProto.getInst().value(api_contentProto.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_contentProto").wandaDropDownList({
                optionLabel: {
                    text: "--无--",
                    value: ""
                },
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_contentProto.successFun, null, null, $("#OrderMgrDetail"));
        }
    };
    //请求模式
    var api_requestStyle = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_requestStyle").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_requestStyle.value = value;
            api_requestStyle.getInst().value(value);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_requestStyle").data("wandaDropDownList").setDataSource(data);
            if (api_requestStyle.value) {
                api_requestStyle.getInst().value(api_requestStyle.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_requestStyle").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change: function (e) {
                    var value = this.value();
                    /*if("2" == value){
                     $("#requestContent2").hide();
                     }else{
                     $("#requestContent2").show();
                     }*/
                    /* if($("#APIMgr_contentProto").val()=="2"||$("#APIMgr_contentProto").val()=="3"){
                     $("#APIList_address_div").show();
                     $("#APIList_soap_div").show();
                     }else{
                     $("#APIList_address_div").hide();
                     $("#APIList_soap_div").hide();
                     }*/
                }
            });
            var param = {"key": "requestStyle"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_requestStyle.successFun, null, null, $("#OrderMgrDetail"));
        }
    };
    //目标API方法
    var api_desMethod = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_desMethod").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_desMethod.value = value;
            api_desMethod.getInst().value(value);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_desMethod").data("wandaDropDownList").setDataSource(data);
            if (api_desMethod.value) {
                api_desMethod.getInst().value(api_desMethod.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_desMethod").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change: function (e) {
                    var value = this.value();
                    if (value != api_desMethod.value) {
                        $("#OrderMgrDetail_isAddHis").val("yes");
                    } else {
                        $("#OrderMgrDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desMethod.successFun, null, null, $("#OrderMgrDetail"));
        }
    };
    //目标API传输协议
    var api_desTransProto = {
        dataSource: [],
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_desTransProto").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_desTransProto.value = value;
            api_desTransProto.getInst().value(value);
        },
        setDataSource: function (dataSource) {
            api_desContentProto.getInst().setDataSource(dataSource);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_desTransProto").data("wandaDropDownList").setDataSource(data);
            if (api_desTransProto.value) {
                api_desTransProto.getInst().value(api_desTransProto.value);
            }
            api_desContentProto.dataSource = data;
        },
        init: function () {
            $("#OrderMgrDetail_desTransProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change: function (e) {
                    var value = this.value();
                    if (value != api_desTransProto.value) {
                        $("#OrderMgrDetail_isAddHis").val("yes");
                    } else {
                        $("#OrderMgrDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desTransProto.successFun, null, null, $("#OrderMgrDetail"));
        }
    };
    //目标API报文协议
    var api_desContentProto = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_desContentProto").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_desContentProto.value = value;
            api_desContentProto.getInst().value(value);
        },
        successFun: function (data) {
            $("#OrderMgrDetail_desContentProto").data("wandaDropDownList").setDataSource(data);
            if (api_desTransProto.value) {
                api_desContentProto.getInst().value(api_desContentProto.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_desContentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change: function (e) {
                    var value = this.value();
                    if (value != api_desContentProto.value) {
                        $("#OrderMgrDetail_isAddHis").val("yes");
                    } else {
                        $("#OrderMgrDetail_isAddHis").val("no");
                    }
                    if ("1" != value) {
                        api_desMethod.setValue("2");
                        api_desMethod.getInst().readonly();
                    } else {
                        api_desMethod.setValue("1");
                        api_desMethod.getInst().readonly(false);
                    }
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desContentProto.successFun, null, null, $("#OrderMgrDetail"));
        }
    };
    //目标地址
    var descPathGrid = {
        init: function () {
            $("#descPathGrid").wandaGrid({
                columns: [
                    {field: "ADDR_ID", hidden: true},
                    {field: "API_ID", hidden: true},
                    {
                        field: "IP",
                        title: "IP地址"
                    },
                    {
                        field: "PORT",
                        title: "端口"
                    },
                    {
                        field: "URI_PATH",
                        title: "访问地址"
                    }
                ],
                editable: false, /*,
                 noRecords: true,
                 messages: {
                 noRecords: "无数据！"
                 }*/
            });
        },
        getInst: function () {
            var data = descPathGrid.getDataSource();
            return data.view();
        },
        getDataSource: function (number) {
            if (number) {
                return $("#descPathGrid").data("wandaGrid").dataSource.at(number);
            } else {
                return $("#descPathGrid").data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var grid = $("#descPathGrid").data("wandaGrid");
            var dataView = descPathGrid.getInst();
            var ip = "", port = "";
            if (dataView && dataView.length > 0) {
                ip = dataView[0]["IP"];
                port = dataView[0]["PORT"];
            }
            grid.addRow();
            var data = grid.dataSource.at(0);
            data.set("IP", ip);
            data.set("PORT", port);
            if (ip != "" && port != "") {
                grid.editCell($("#descPathGrid td:eq(4)"));
            } else if (ip != "") {
                grid.editCell($("#descPathGrid td:eq(3)"));
            } else {
                grid.editCell($("#descPathGrid td:eq(2)"));
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descPathGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "ADDR_ID": dataArry[i]["ADDR_ID"],
                    "API_ID": dataArry[i]["API_ID"],
                    "IP": dataArry[i]["IP"],
                    "PORT": dataArry[i]["PORT"],
                    "URI_PATH": dataArry[i]["URI_PATH"]
                });
            }
        }
    };
    //新增目标地址
    var descPathGrid_dataAdd = {
        init: function () {
            $("#descPathGrid_dataAdd").click(function () {
                descPathGrid.addRow();
            })
        }
    };
    var location = [{
        "text": "Query",
        "value": "Query"
    }, {
        "text": "Head",
        "value": "Head"
    }, {
        "text": "Body",
        "value": "Body"
    }];
    var conLocation = [{
        "text": "Path",
        "value": "Path"
    }, {
        "text": "Head",
        "value": "Head"
    }];
    var dataType = [{
        "text": "String",
        "value": "String"
    }, {
        "text": "number",
        "value": "number"
    }, {
        "text": "json",
        "value": "json"
    }, {
        "text": "xml",
        "value": "xml"
    }];
    var sysParam = [{
        "text": "ClientIp",
        "value": "ClientIp"
    }]
    var filter = function (param) {
        var result = param;
        var indexNbrStart = param.indexOf("(");
        var indexNbrEnd = param.indexOf(")");
        if (indexNbrStart > 0 && indexNbrEnd > 0) {
            result = param.substring(indexNbrStart + 1, indexNbrEnd);
        }
        return result;
    };
    var api_wsdlSearch = {
        services: [],
        servicesBings: [],
        bindAndOperations: [],
        portPortType: "",
        init: function () {
            $("#APIMgr_wsdlSearch").click(function () {
                var successFun = function (data) {
                    if (data) {
                        api_wsdlSearch.services = data["services"];
                        api_wsdlSearch.servicesBings = data["serviceBinds"];
                        api_wsdlSearch.bindAndOperations = data["bindAndOperations"];
                        api_services.setDataSource(api_wsdlSearch.services);
                        var services_index = api_wsdlSearch.services[0];
                        api_serviceBinds.setDataSource(api_wsdlSearch.servicesBings[services_index]);
                        var servicesBings_index = api_wsdlSearch.servicesBings[services_index][0];
                        api_bindOperations.setDataSource(api_wsdlSearch.bindAndOperations[servicesBings_index]["bindOperations"]);
                        api_services.getInst().readonly(false);
                        api_serviceBinds.getInst().readonly(false);
                        api_bindOperations.getInst().readonly(false);
                        $("#APIList_soap_div").show();
                    }
                };
                var wsdlPath = $("#APIMgr_wsdlPath").val();
                if (wsdlPath == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请先输入WSDL地址！"
                    });
                    return false;
                }
                var param = {"wsdlPath": wsdlPath};
                common.ajaxGet("api/gateApi/getWSDLMess", param, successFun, null, null, $("#APIMgr"));
            });
        }
    }
    //获取wsdl的services
    var api_services = {
        value: "",
        getInst: function () {
            return $("#APIMgr_services").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_services.value = value;
            api_services.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgr_services").data("wandaDropDownList");
        },
        init: function () {
            $("#APIMgr_services").wandaDropDownList({
                index: 0,
                change: function (e) {
                    var value = this.value();
                    api_serviceBinds.setDataSource(api_wsdlSearch.servicesBings[value]);
                },
                select: function (e) {

                }
            });
        },
        setDataSource: function (dataSource) {
            api_services.getInst().setDataSource(dataSource);
        }
    }
    //获取wsdl的serviceBinds
    var api_serviceBinds = {
        value: "",
        getInst: function () {
            return $("#APIMgr_serviceBinds").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_serviceBinds.value = value;
            api_serviceBinds.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgr_serviceBinds").data("wandaDropDownList");
        },
        init: function () {
            $("#APIMgr_serviceBinds").wandaDropDownList({
                index: 0,
                change: function (e) {
                    var value = this.value();
                    api_bindOperations.setDataSource(api_wsdlSearch.bindAndOperations[value]["bindOperations"]);
                }
            });
        },
        setDataSource: function (dataSource) {
            api_serviceBinds.getInst().setDataSource(dataSource);
        }
    }
    //获取wsdl的bindOperations
    var api_bindOperations = {
        value: "",
        getInst: function () {
            return $("#APIMgr_bindOperations").data("wandaDropDownList");
        },
        setValue: function (value) {
            api_bindOperations.value = value;
            api_bindOperations.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgr_bindOperations").data("wandaDropDownList");
        },
        init: function () {
            $("#APIMgr_bindOperations").wandaDropDownList({
                index: 0,
                change: function (e) {

                }
            });
        },
        setDataSource: function (dataSource) {
            api_bindOperations.getInst().setDataSource(dataSource);
        }
    }
    //关闭按钮
    var OrderMgrDetail_closeBtn = {
        init: function (parentIds) {
            $("#OrderMgrDetail_closeBtn").unbind("click");
            $("#OrderMgrDetail_closeBtn").click(function () {
                $("#OrderMgrDetail_closeBtn").trigger("afterClick");
            });
        }
    };

    var readOnlyFunc = function () {
        api_serverName.getInst().readonly();
        $("#OrderMgrDetail_GUID").attr("readonly", "true");
        var serverName = $("#OrderMgrDetail_serverName").data("wandaDropDownList");
        serverName.readonly();
        $("#OrderMgrDetail_name").attr("readonly", "true");
        var state = $("#OrderMgrDetail_state").data("wandaDropDownList");
        state.readonly();
        $("#OrderMgrDetail_desc").attr("readonly", "true");

        $("#OrderMgrDetail_path").attr("readonly", "true");
        var transProto = $("#OrderMgrDetail_transProto").data("wandaDropDownList");
        transProto.readonly();
        var contentProto = $("#OrderMgrDetail_contentProto").data("wandaDropDownList");
        contentProto.readonly();
        var method = $("#OrderMgrDetail_method").data("wandaDropDownList");
        method.readonly();
        /*var timeOutFilter = $("#OrderMgrDetail_waitTimeLimit").data("wandaNumericTextBox");
        timeOutFilter.readonly();
        var totalNumFilter = $("#OrderMgrDetail_concurrencyLimit").data("wandaNumericTextBox");
        totalNumFilter.readonly();*/
        var requestStyle = $("#OrderMgrDetail_requestStyle").data("wandaDropDownList");
        requestStyle.readonly();
        $("#OrderMgrDetail_inparamDemo1").attr("readonly", "true").css("background-color", "white");
        $("#OrderMgrDetail_inparamDemo2").attr("readonly", "true").css("background-color", "white");
        $("#OrderMgrDetail_inparamDemo").attr("readonly", "true").css("background-color", "white");
        $("#OrderMgrDetail_outparamDemo").attr("readonly", "true").css("background-color", "white");

        var desTransProto = $("#OrderMgrDetail_desTransProto").data("wandaDropDownList");
        desTransProto.readonly();
        var desContentProto = $("#OrderMgrDetail_desContentProto").data("wandaDropDownList");
        desContentProto.readonly();
        var desMethod = $("#OrderMgrDetail_desMethod").data("wandaDropDownList");
        desMethod.readonly();
    };

    //修改获取API数据详情
    var apiDetail = {
        init: function (apiId,hisId,ifHistory) {
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                var gateFilterApi = data["gateFilterApi"];
                var gateDesaddr = data["gateDesaddr"];
                if (gateApi) {//基本信息
                    $("#OrderMgrDetail_name").val(gateApi["API_NAME"]);
                    $("#OrderMgrDetail_desc").val(gateApi["API_DESC"]);
                    $("#OrderMgrDetail_path").val(gateApi["API_PATH"]);
                    $("#OrderMgrDetail_outparamDemo").val(gateApi["API_OUTPARAM_DEMO"]);
                    $("#OrderMgrDetail_userCode").val(gateApi["USER_CODE"]);
                    $("#OrderMgrDetail_ip").val(gateApi["IP"]);
                    $("#OrderMgrDetail_port").val(gateApi["PORT"]);
                    $("#OrderMgrDetail_apiaddrid").val(gateApi["API_ADDR_ID"]);
                    $("#OrderMgrDetail_GUID").val(gateApi["API_GUID"]);
                    api_serverName.getInst().setDataSource([{
                        "SERVICE_NAME":gateApi["SERVICE_NAME"],
                        "SERVICE_ID":gateApi["SERVICE_ID"],
                    }]);
                    api_serverName.setValue(gateApi["SERVICE_ID"]);

                    api_state.setValue(gateApi["STATE"]);
                    api_method.setValue(gateApi["API_METHOD"]);
                    api_transProto.setValue(gateApi["API_TRANS_PROTO"]);
                    api_contentProto.setValue(gateApi["API_CONTENT_PROTO"]);
                    api_desTransProto.setValue(gateApi["DES_TRANS_PROTO"]);
                    api_desContentProto.setValue(gateApi["DES_CONTENT_PROTO"]);
                    api_desMethod.setValue(gateApi["DES_METHOD"]);

                    if (gateApi["API_INPARAM_DEMO"]) {
                        try {
                            var inparamJson = JSON.parse(gateApi["API_INPARAM_DEMO"]);
                            if(inparamJson["Body"] == undefined){
                                $("#OrderMgrDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"])
                            }else{
                                $("#OrderMgrDetail_inparamDemo").val(inparamJson["Body"]);
                            }
                        }catch(e) {
                            $("#OrderMgrDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"]);
                        }
                    }
                }

                if (gateFilterApi && gateFilterApi.length > 0) { //过滤器
                    for (var i = 0; i < gateFilterApi.length; i++) {
                        var obj = gateFilterApi[i];
                        if ("requestStyle" == obj["FILTER_TYPE"]) {
                            var value = obj["FILTER_VALUE"];
                            api_requestStyle.setValue(value);
                            api_requestStyle.getInst().trigger("change");
                        }
                    }
                }
                readOnlyFunc();
            };
            if(ifHistory){
                var param = {"hisId": hisId};
                common.ajaxGet("api/gateHisApi/queryGateApiHisDetail", param, successFun, null, null, $("#OrderMgrDetail"));
            }else{
                var param = {"apiId": apiId};
                common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#OrderMgrDetail"));
            }


        }
    };
    var initParam = function () {
        if ($("#APIFound_hideBtn").attr("_param")) {
            var _params = JSON.parse($("#APIFound_hideBtn").attr("_param"));
        }

        var ifHistory = _params["ifHistory"];
        $("#OrderMgrDetail_isAdd").val(_params["isAdd"]);

        $("#OrderMgrDetail_menuCode").val(_params["menuCode"]);
        $("#OrderMgrDetail_isOrder").val(_params["isOrder"]);
        $("#OrderMgrDetail_apiId").val(_params["apiId"]);
        $("#OrderMgrDetail_orderServiceId").val(_params["orderServiceId"]);
        $("#OrderMgrDetail_publishServiceId").val(_params["publishServiceId"]);
        $("#OrderMgrDetail_queryParam").val(_params["queryParam"]);

        apiDetail.init(_params["apiId"],_params["hisId"],ifHistory);
        if (_params["isOrder"] === "true") {
            var subscribe = _params["subscribe"];
            if ("是" == subscribe) {
                $("#OrderMgrDetail_orderBtn").hide();
            }
            $("#OrderMgrDetail_apiId").val(_params["apiId"]);
            $("#OrderMgrDetail_state_div").show();
            $("input:not([type])").bind("input propertychange", function () {
                $("#OrderMgrDetail_isAddHis").val("yes");
            });
            $("textarea").bind("input propertychange", function () {
                $("#OrderMgrDetail_isAddHis").val("yes");
            });
        } else {
            $("#OrderMgrDetail_orderBtn").hide();
        }
    };
    var init = function () {
        wandaComp.elementControl($("#OrderMgrDetail"));
        api_serverName.init();
        api_state.init();
        api_method.init();
        api_tabstrip.init();
        api_transProto.init();
        api_contentProto.init();
        api_desContentProto.init();
        api_desMethod.init();
        api_desTransProto.init();
        api_requestStyle.init();
        OrderMgrDetail_closeBtn.init();
        initParam();
    };
    return {
        init: init
    }
});

