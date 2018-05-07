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
                optionLabel: {
                    SERVICE_NAME: "--请选择--",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0
            });
            var param = {"isAuth": "yes"};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, api_serverName.successFun, null, null, $("#OrderMgrDetail"));
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
        init:function () {
            $("#APIMgr_inparamDemoTitle").click(function () {
                $("#APIMgr_inparamDemoContent").slideToggle("slow",function () {
                    if($('#APIMgr_inparamDemoContent').css('display')=="none"){
                        $("#APIMgr_inparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgr_inparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#APIMgr_outparamDemoTitle").click(function () {
                $("#APIMgr_outparamDemoContent").slideToggle("slow",function () {
                    if($('#APIMgr_outparamDemoContent').css('display')=="none"){
                        $("#APIMgr_outparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgr_outparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#descHighParamFilterTitle").click(function () {
                $("#descHighParamFilterContent").slideToggle("slow",function () {
                    if($('#descHighParamFilterContent').css('display')=="none"){
                        $("#descHighParamFilterTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
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
        value:"",
        getInst: function () {
            return $("#OrderMgrDetail_requestStyle").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_requestStyle.value = value;
            api_requestStyle.getInst().value(value);
        },
        successFun:function (data) {
            $("#OrderMgrDetail_requestStyle").data("wandaDropDownList").setDataSource(data);
            if(api_requestStyle.value){
                api_requestStyle.getInst().value(api_requestStyle.value);
            }
        },
        init: function () {
            $("#OrderMgrDetail_requestStyle").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
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
    //负载算法
    /*var api_loadBalance = {
     value:"",
     getInst: function () {
     return $("#OrderMgrDetail_loadBalance").data("wandaDropDownList");
     },
     setValue:function (value) {
     api_loadBalance.value = value;
     api_loadBalance.getInst().value(value);
     },
     successFun:function (data) {
     $("#OrderMgrDetail_loadBalance").data("wandaDropDownList").setDataSource(data);
     if(api_loadBalance.value){
     api_loadBalance.getInst().value(api_loadBalance.value);
     }
     },
     init: function () {
     $("#OrderMgrDetail_loadBalance").wandaDropDownList({
     dataTextField: "text",
     dataValueField: "value",
     index: 0,
     change:function (e) {
     var value = this.value();
     if(value != api_loadBalance.value){
     $("#OrderMgrDetail_isAddHis").val("yes");
     }else{
     $("#OrderMgrDetail_isAddHis").val("no");
     }
     }
     });
     var param = {"key": "loadFilter"};
     common.ajaxGet("syscommpara/getBaseAttr", param, api_loadBalance.successFun, null, null, $("#OrderMgrDetail"));
     }
     };*/
    //超时时间
    var api_waitTimeLimit = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_waitTimeLimit").data("wandaNumericTextBox");
        },
        init: function () {
            $("#OrderMgrDetail_waitTimeLimit").wandaNumericTextBox({
                format: "0 s",
                min: 0,
                change: function () {
                    var value = this.value();
                    if (value != api_waitTimeLimit.value) {
                        $("#OrderMgrDetail_isAddHis").val("yes");
                    } else {
                        $("#OrderMgrDetail_isAddHis").val("no");
                    }
                }
            });
        }
    };
    //最大并发数
    var api_concurrencyLimit = {
        value: "",
        getInst: function () {
            return $("#OrderMgrDetail_concurrencyLimit").data("wandaNumericTextBox");
        },
        init: function () {
            $("#OrderMgrDetail_concurrencyLimit").wandaNumericTextBox({
                format: "0",
                min: 0,
                change: function () {
                    var value = this.value();
                    if (value != api_concurrencyLimit.value) {
                        $("#OrderMgrDetail_isAddHis").val("yes");
                    } else {
                        $("#OrderMgrDetail_isAddHis").val("no");
                    }
                }
            });
        }
    };
    /*   //请求模式
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
     if (value != api_requestStyle.value) {
     $("#OrderMgrDetail_isAddHis").val("yes");
     } else {
     $("#OrderMgrDetail_isAddHis").val("no");
     }
     if ("2" == value) {
     $("#requestParamTitle").hide();
     $("#requestParamContent").hide();
     $("#requestOutParamTitle").hide();
     $("#requestOutParamContent").hide();

     /!*$("#descParamTitle").hide();
     $("#descParamContent").hide();
     $("#descOutParamTitle").hide();
     $("#descOutParamContent").hide();
     $("#descConstParamTitle").hide();
     $("#descConstParamContent").hide();
     $("#descSysParamTitle").hide();
     $("#descSysParamContent").hide();*!/
     } else {
     $("#requestParamTitle").show();
     $("#requestParamContent").show();
     $("#requestOutParamTitle").show();
     $("#requestOutParamContent").show();

     /!* $("#descParamTitle").show();
     $("#descParamContent").show();
     $("#descOutParamTitle").show();
     $("#descOutParamContent").show();
     $("#descConstParamTitle").show();
     $("#descConstParamContent").show();
     $("#descSysParamTitle").show();
     $("#descSysParamContent").show();*!/
     }
     }
     });
     var param = {"key": "requestStyle"};
     common.ajaxGet("syscommpara/getBaseAttr", param, api_requestStyle.successFun, null, null, $("#OrderMgrDetail"));
     }
     };*/
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
    },{
        "text":"json",
        "value":"json"
    },{
        "text":"xml",
        "value":"xml"
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
    //新增入参参数
    var requestParamGrid = {
        init: function () {
            $("#requestParamGrid").wandaGrid({
                columns: [
                    {
                        field: "paramName",
                        title: "参数名"
                    },
                    {
                        field: "location",
                        title: "参数位置",
                        editor: function (container, options) {
                            var a = $('<input  name="' + options.field + '"/>');
                            a.appendTo(container).wandaDropDownList({
                                autoBind: false,
                                dataTextField: "text",
                                dataValueField: "value",
                                index: 0,
                                change: function (e) {
                                    container.find("[name='" + options.field + "']").val("");
                                    //container.find("[name='" + options.field + "']").val(this.text());
                                    container.find("[name='" + options.field + "']").val(this.text() + "(" + this.value() + ")");
                                },
                                dataSource: location
                            });
                        }
                    },
                    {
                        field: "dataType",
                        title: "类型",
                        editor: function (container, options) {
                            var a = $('<input  name="' + options.field + '"/>');
                            a.appendTo(container).wandaDropDownList({
                                autoBind: false,
                                dataTextField: "text",
                                dataValueField: "value",
                                index: 0,
                                change: function (e) {
                                    container.find("[name='" + options.field + "']").val("");
                                    container.find("[name='" + options.field + "']").val(this.text() + "(" + this.value() + ")");
                                },
                                dataSource: dataType
                            });
                        }
                    }
                ],
                editable: false,
                remove: function (e) {
                    var param = e.model.paramName;
                    descParamGrid.deleteRow(param);
                    $("#OrderMgrDetail_isAddHis").val("yes");
                }/*,
                 noRecords: true,
                 messages: {
                 noRecords: "无数据！"
                 }*/
            });
        },
        getInst: function () {
            var data = requestParamGrid.getDataSource();
            return data.view();
        },
        getDataSource: function (number) {
            if (number) {
                return $("#requestParamGrid").data("wandaGrid").dataSource.at(number);
            } else {
                return $("#requestParamGrid").data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var grid = $("#requestParamGrid").data("wandaGrid");
            var dataView = requestParamGrid.getInst();
            grid.addRow();
            $("#OrderMgrDetail_isAddHis").val("yes");
        },
        addDataSource: function (dataArry) {
            var dataSource = requestParamGrid.getDataSource();
            if (dataArry) {
                for (var i = 0; i < dataArry.length; i++) {
                    dataSource.add({
                        "paramName": dataArry[i]["paramName"],
                        "location": dataArry[i]["location"],
                        "dataType": dataArry[i]["dataType"]
                    });
                }
            }
        }
    };
    //新增入参参数按钮
    var requestParamGrid_dataAdd = {
        init: function () {
            $("#requestParamGrid_dataAdd").click(function () {
                requestParamGrid.addRow();
            })
        }
    };
    //目标入参参数
    var descParamGrid = {
        init: function () {
            $("#descParamGrid").wandaGrid({
                columns: [
                    {
                        field: "desParamName",
                        title: "参数名"
                    },
                    {
                        field: "location",
                        title: "参数位置",
                        editor: function (container, options) {
                            var a = $('<input  name="' + options.field + '"/>');
                            a.appendTo(container).wandaDropDownList({
                                dataSource: location,
                                dataTextField: "text",
                                dataValueField: "value",
                                index: 0,
                                change: function (e) {
                                    container.find("[name='" + options.field + "']").val("");
                                    //container.find("[name='" + options.field + "']").val(this.text());
                                    container.find("[name='" + options.field + "']").val(this.text() + "(" + this.value() + ")");
                                }
                            });
                        }
                    },
                    {
                        field: "paramName",
                        title: "对应入参名称",
                        IsFkEnabled: false
                    },
                    {
                        field: "requestLocation",
                        title: "对应入参位置",
                        IsFkEnabled: false
                    },
                    {
                        field: "requestDataType",
                        title: "对应入参类型",
                        IsFkEnabled: false
                    }
                ],
                editable: false,
                /*noRecords: true,
                 messages: {
                 noRecords: "无数据！"
                 },*/
                edit: function (e) {
                    var fieldName = e.container.find("input").attr("name");
                    if (!isEditable(fieldName, e.model)) {
                        this.closeCell(); // prevent editing
                    }
                    function isEditable(fieldName, model) {
                        if (fieldName == "paramName" || fieldName == "requestLocation" || fieldName == "requestDataType") {
                            return model.hasOwnProperty("IsFkEnabled") && model.IsFkEnabled;
                        }
                        return true; // default to editable
                    }
                }
            });
        },
        getInst: function () {
            var data = descParamGrid.getDataSource();
            return data.view();
        },
        getDataSource: function (number) {
            if (number) {
                return $("#descParamGrid").data("wandaGrid").dataSource.at(number);
            } else {
                return $("#descParamGrid").data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var grid = $("#descParamGrid").data("wandaGrid");
            var dataView = descParamGrid.getInst();
            grid.addRow();
        },
        deleteRow: function (param) {
            var data = descParamGrid.getInst();
            var grid = $("#descParamGrid").data("wandaGrid");
            for (var i = 0; i < data.length; i++) {
                if (data[i]["paramName"] == param) {
                    var data = grid.dataSource.at(i);
                    grid.dataSource.remove(data);
                    break;
                }
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descParamGrid.getDataSource();
            var descData = descParamGrid.getInst();
            if (dataArry) {
                for (var i = 0; i < dataArry.length; i++) {
                    var ifExist = false;
                    for (var j = 0; j < descData.length; j++) {
                        if (descData[j]["paramName"] == dataArry[i]["paramName"]) {
                            ifExist = true;
                        }
                    }
                    if (!ifExist) {
                        dataSource.add({
                            "desParamName": dataArry[i]["desParamName"],
                            "location": dataArry[i]["location"],
                            "paramName": dataArry[i]["paramName"],
                            "requestLocation": dataArry[i]["requestLocation"] == undefined ? dataArry[i]["location"] : dataArry[i]["requestLocation"],
                            "requestDataType": dataArry[i]["dataType"]
                        });
                    }
                }
            }
        }
    };
    //目标常量参数
    var descConstParamGrid = {
        init: function () {
            $("#descConstParamGrid").wandaGrid({
                columns: [
                    {
                        field: "paramName",
                        title: "后端参数名"
                    },
                    {
                        field: "location",
                        title: "参数位置",
                        editor: function (container, options) {
                            var a = $('<input  name="' + options.field + '"/>');
                            a.appendTo(container).wandaDropDownList({
                                dataSource: location,
                                dataTextField: "text",
                                dataValueField: "value",
                                index: 0,
                                change: function (e) {
                                    container.find("[name='" + options.field + "']").val("");
                                    container.find("[name='" + options.field + "']").val(this.text() + "(" + this.value() + ")");
                                }
                            });
                        }
                    }
                ],
                editable: false,
                /*noRecords: true,
                 messages: {
                 noRecords: "无数据！"
                 },*/
                edit: function (e) {
                    var fieldName = e.container.find("input").attr("name");
                    if (!isEditable(fieldName, e.model)) {
                        this.closeCell(); // prevent editing
                    }
                    function isEditable(fieldName, model) {
                        if (fieldName == "requestName" || fieldName == "requestLocation" || fieldName == "requestDataType") {
                            return model.hasOwnProperty("IsFkEnabled") && model.IsFkEnabled;
                        }
                        return true; // default to editable
                    }
                }
            });
        },
        getInst: function () {
            var data = descConstParamGrid.getDataSource();
            return data.view();
        },
        getDataSource: function (number) {
            if (number) {
                return $("#descConstParamGrid").data("wandaGrid").dataSource.at(number);
            } else {
                return $("#descConstParamGrid").data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var grid = $("#descConstParamGrid").data("wandaGrid");
            var dataView = descConstParamGrid.getInst();
            grid.addRow();
            $("#OrderMgrDetail_isAddHis").val("yes");
        },
        addDataSource: function (dataArry) {
            var dataSource = descConstParamGrid.getDataSource();
            if (dataArry) {
                for (var i = 0; i < dataArry.length; i++) {
                    dataSource.add({
                        "paramName": dataArry[i]["paramName"],
                        "location": dataArry[i]["location"]
                    });
                }
            }
        }
    };
    //目标常量参数按钮
    var descConstParamGrid_dataAdd = {
        init: function () {
            $("#descConstParamGrid_dataAdd").click(function () {
                descConstParamGrid.addRow()
            })
        }
    };
    //目标系统参数
    var descSysParamGrid = {
        init: function () {
            $("#descSysParamGrid").wandaGrid({
                columns: [
                    {
                        field: "sysParamName",
                        title: "系统参数名",
                        editor: function (container, options) {
                            var a = $('<input  name="' + options.field + '"/>');
                            a.appendTo(container).wandaDropDownList({
                                dataSource: sysParam,
                                dataTextField: "text",
                                dataValueField: "value",
                                index: 0,
                                change: function (e) {
                                    container.find("[name='" + options.field + "']").val("");
                                    //container.find("[name='" + options.field + "']").val(this.text());
                                    container.find("[name='" + options.field + "']").val(this.text() + "(" + this.value() + ")");
                                }
                            });
                        }
                    },
                    {
                        field: "paramName",
                        title: "后端参数名称"
                    },
                    {
                        field: "location",
                        title: "参数位置",
                        editor: function (container, options) {
                            var a = $('<input  name="' + options.field + '"/>');
                            a.appendTo(container).wandaDropDownList({
                                dataSource: location,
                                dataTextField: "text",
                                dataValueField: "value",
                                index: 0,
                                change: function (e) {
                                    container.find("[name='" + options.field + "']").val("");
                                    //container.find("[name='" + options.field + "']").val(this.text());
                                    container.find("[name='" + options.field + "']").val(this.text() + "(" + this.value() + ")");
                                }
                            });
                        }
                    }
                ],
                editable: false,
                /*noRecords: true,
                 messages: {
                 noRecords: "无数据！"
                 },*/
                edit: function (e) {
                    var fieldName = e.container.find("input").attr("name");
                    if (!isEditable(fieldName, e.model)) {
                        this.closeCell(); // prevent editing
                    }
                    function isEditable(fieldName, model) {
                        if (fieldName == "requestName" || fieldName == "requestLocation" || fieldName == "requestDataType") {
                            return model.hasOwnProperty("IsFkEnabled") && model.IsFkEnabled;
                        }
                        return true; // default to editable
                    }
                }
            });
        },
        getInst: function () {
            var data = descSysParamGrid.getDataSource();
            return data.view();
        },
        getDataSource: function (number) {
            if (number) {
                return $("#descSysParamGrid").data("wandaGrid").dataSource.at(number);
            } else {
                return $("#descSysParamGrid").data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var grid = $("#descSysParamGrid").data("wandaGrid");
            var dataView = descSysParamGrid.getInst();
            grid.addRow();
            $("#OrderMgrDetail_isAddHis").val("yes");
        },
        addDataSource: function (dataArry) {
            var dataSource = descSysParamGrid.getDataSource();
            if (dataArry) {
                for (var i = 0; i < dataArry.length; i++) {
                    dataSource.add({
                        "sysParamName": dataArry[i]["paramName"],
                        "paramName": dataArry[i]["desParamName"],
                        "location": dataArry[i]["location"]
                    });
                }
            }
        }
    };
    //目标常量参数按钮
    var descSysParamGrid_dataAdd = {
        init: function () {
            $("#descSysParamGrid_dataAdd").click(function () {
                descSysParamGrid.addRow()
            })
        }
    };
    //新增出参参数
    var requestOutParamGrid = {
        init: function () {
            $("#requestOutParamGrid").wandaGrid({
                columns: [
                    {
                        field: "paramName",
                        title: "参数名"
                    },
                    {
                        field: "dataType",
                        title: "类型",
                        editor: function (container, options) {
                            var a = $('<input  name="' + options.field + '"/>');
                            a.appendTo(container).wandaDropDownList({
                                autoBind: false,
                                dataTextField: "text",
                                dataValueField: "value",
                                index: 0,
                                change: function (e) {
                                    container.find("[name='" + options.field + "']").val("");
                                    container.find("[name='" + options.field + "']").val(this.text() + "(" + this.value() + ")");
                                },
                                dataSource: dataType
                            });
                        }
                    }
                ],
                editable: false,
                remove: function (e) {
                    var param = e.model.paramName;
                    descOutParamGrid.deleteRow(param);
                    $("#OrderMgrDetail_isAddHis").val("yes");
                }/*,
                 noRecords: true,
                 messages: {
                 noRecords: "无数据！"
                 }*/
            });
        },
        getInst: function () {
            var data = requestOutParamGrid.getDataSource();
            return data.view();
        },
        getDataSource: function (number) {
            if (number) {
                return $("#requestOutParamGrid").data("wandaGrid").dataSource.at(number);
            } else {
                return $("#requestOutParamGrid").data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var grid = $("#requestOutParamGrid").data("wandaGrid");
            var dataView = requestOutParamGrid.getInst();
            grid.addRow();
            $("#OrderMgrDetail_isAddHis").val("yes");
        },
        addDataSource: function (dataArry) {
            var dataSource = requestOutParamGrid.getDataSource();
            if (dataArry) {
                for (var i = 0; i < dataArry.length; i++) {
                    dataSource.add({
                        "paramName": dataArry[i]["paramName"],
                        "dataType": dataArry[i]["dataType"]
                    });
                }
            }
        }
    };
    //新增出参参数按钮
    var requestOutParamGrid_dataAdd = {
        init: function () {
            $("#requestOutParamGrid_dataAdd").click(function () {
                requestOutParamGrid.addRow();
            })
        }
    };
    //新增目标出参参数
    var descOutParamGrid = {
        init: function () {
            $("#descOutParamGrid").wandaGrid({
                columns: [
                    {
                        field: "desParamName",
                        title: "参数名"
                    },
                    {
                        field: "paramName",
                        title: "对应出参名",
                        IsFkEnabled: false
                    },
                    {
                        field: "dataType",
                        title: "对应出参类型",
                        IsFkEnabled: false
                    }
                ],
                editable: false,
                /*noRecords: true,
                 messages: {
                 noRecords: "无数据！"
                 }*/
                edit: function (e) {
                    var fieldName = e.container.find("input").attr("name");
                    if (!isEditable(fieldName, e.model)) {
                        this.closeCell(); // prevent editing
                    }
                    function isEditable(fieldName, model) {
                        if (fieldName == "paramName" || fieldName == "dataType") {
                            return model.hasOwnProperty("IsFkEnabled") && model.IsFkEnabled;
                        }
                        return true; // default to editable
                    }
                }
            });
        },
        getInst: function () {
            var data = descOutParamGrid.getDataSource();
            return data.view();
        },
        getDataSource: function (number) {
            if (number) {
                return $("#descOutParamGrid").data("wandaGrid").dataSource.at(number);
            } else {
                return $("#descOutParamGrid").data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var grid = $("#descOutParamGrid").data("wandaGrid");
            var dataView = descOutParamGrid.getInst();
            grid.addRow();
        },
        deleteRow: function (param) {
            var data = descOutParamGrid.getInst();
            var grid = $("#descOutParamGrid").data("wandaGrid");
            for (var i = 0; i < data.length; i++) {
                if (data[i]["paramName"] == param) {
                    var data = grid.dataSource.at(i);
                    grid.dataSource.remove(data);
                    break;
                }
            }
        },
        addDataSource: function (dataArry) {
            var dataSource = descOutParamGrid.getDataSource();
            var descOutData = descOutParamGrid.getInst();
            if (dataArry) {
                for (var i = 0; i < dataArry.length; i++) {
                    var ifExist = false;
                    for (var j = 0; j < descOutData.length; j++) {
                        if (descOutData[j]["paramName"] == dataArry[i]["paramName"]) {
                            ifExist = true;
                        }
                    }
                    if (!ifExist) {
                        dataSource.add({
                            "desParamName": dataArry[i]["desParamName"],
                            "paramName": dataArry[i]["paramName"],
                            "dataType": dataArry[i]["dataType"]
                        });
                    }
                }
            }
        }
    };
    //封装参数
    var getFormValue = function () {
        var gateDesaddr = [], gateFilterApi = {}, protocolConvert = {}, requestParamConvert = {}, responseConvert = {};
        var isAdd = $("#OrderMgrDetail_isAdd").val();
        var OrderMgrDetail_isAddHis = $("#OrderMgrDetail_isAddHis").val();
        var OrderMgrDetail_apiId = $("#OrderMgrDetail_apiId").val();
        var OrderMgrDetail_serverName = $("#OrderMgrDetail_serverName").val();
        var OrderMgrDetail_name = $("#OrderMgrDetail_name").val();
        var OrderMgrDetail_state = $("#OrderMgrDetail_state").val();
        var OrderMgrDetail_desc = $("#OrderMgrDetail_desc").val();
        var OrderMgrDetail_path = $("#OrderMgrDetail_path").val();
        var OrderMgrDetail_transProto = $("#OrderMgrDetail_transProto").val();
        var OrderMgrDetail_contentProto = $("#OrderMgrDetail_contentProto").val();
        //var OrderMgrDetail_method = $("#OrderMgrDetail_method").val();
        var OrderMgrDetail_waitTimeLimit = $("#OrderMgrDetail_waitTimeLimit").val();
        var OrderMgrDetail_concurrencyLimit = $("#OrderMgrDetail_concurrencyLimit").val();
        var OrderMgrDetail_inparamDemo = $("#OrderMgrDetail_inparamDemo").val();
        var OrderMgrDetail_outparamDemo = $("#OrderMgrDetail_outparamDemo").val();
        var OrderMgrDetail_desTransProto = $("#OrderMgrDetail_desTransProto").val();
        var OrderMgrDetail_desContentProto = $("#OrderMgrDetail_desContentProto").val();
        var OrderMgrDetail_desMethod = $("#OrderMgrDetail_desMethod").val();
        var OrderMgrDetail_loadBalance = $("#OrderMgrDetail_loadBalance").val();

        //目标地址
        var descPathData = descPathGrid.getInst();
        if (descPathData.length > 0) {
            for (var i = 0; i < descPathData.length; i++) {
                gateDesaddr[i] = {};
                gateDesaddr[i]["ip"] = descPathData[i]["IP"];
                gateDesaddr[i]["port"] = descPathData[i]["PORT"];
                gateDesaddr[i]["uriPath"] = descPathData[i]["URI_PATH"];
                if (descPathData[i]["IP"] === undefined || descPathData[i]["PORT"] === undefined || descPathData[i]["URI_PATH"] === undefined) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成目标地址配置！"
                    });
                    return false;
                }
                if (isAdd == "false") {
                    gateDesaddr[i]["apiId"] = descPathData[i]["API_ID"] + "";
                    gateDesaddr[i]["addrId"] = descPathData[i]["ADDR_ID"] + "";
                }
            }
        } else {
            common.jqConfirm.alert({
                title: 0,
                content: "请完成目标地址配置！"
            });
            return false;
        }
        //入参列表
        var requestParamData = requestParamGrid.getInst();
        if (requestParamData.length > 0) {
            requestParamConvert["requestParam"] = [];
            for (var i = 0; i < requestParamData.length; i++) {
                requestParamConvert["requestParam"].push({
                    "paramName": requestParamData[i]["paramName"],
                    "location": filter(requestParamData[i]["location"]),
                    "dataType": filter(requestParamData[i]["dataType"]),
                    "type": "request"
                });
            }
        }
        //目标入参转换
        var desRequestParamData = descParamGrid.getInst();
        if (desRequestParamData.length > 0) {
            requestParamConvert["desRequestParam"] = [];
            for (var i = 0; i < desRequestParamData.length; i++) {
                if (desRequestParamData[i]["desParamName"] === undefined || desRequestParamData[i]["location"] === undefined) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成目标入参配置！"
                    });
                    return false;
                }
                requestParamConvert["desRequestParam"].push({
                    "paramName": desRequestParamData[i]["paramName"],
                    "desParamName": desRequestParamData[i]["desParamName"],
                    "location": filter(desRequestParamData[i]["location"]),
                    "requestLocation": filter(desRequestParamData[i]["requestLocation"]),
                    "dataType": filter(desRequestParamData[i]["requestDataType"]),
                    "type": "request"
                });
            }
        }
        //目标常量参数
        var descConstParamData = descConstParamGrid.getInst();
        if (descConstParamData.length > 0) {
            if (requestParamConvert["desRequestParam"] == null) {
                requestParamConvert["desRequestParam"] = [];
            }
            for (var i = 0; i < descConstParamData.length; i++) {
                if (descConstParamData[i]["paramName"] === undefined || descConstParamData[i]["location"] === undefined) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成常量参数配置！"
                    });
                    return false;
                }
                requestParamConvert["desRequestParam"].push({
                    "paramName": descConstParamData[i]["paramName"],
                    "desParamName": descConstParamData[i]["paramName"],
                    "location": filter(descConstParamData[i]["location"]),
                    "dataType": "String",
                    "type": "const"
                });
                requestParamConvert["requestParam"].push({
                    "paramName": descConstParamData[i]["paramName"],
                    "location": filter(descConstParamData[i]["location"]),
                    "dataType": "String",
                    "type": "const"
                });
            }
        }
        //目标系统参数
        var descSysParamData = descSysParamGrid.getInst();
        if (descSysParamData.length > 0) {
            if (requestParamConvert["desRequestParam"] == null) {
                requestParamConvert["desRequestParam"] = [];
            }
            for (var i = 0; i < descSysParamData.length; i++) {
                if (descSysParamData[i]["sysParamName"] === undefined || descSysParamData[i]["paramName"] === undefined || descSysParamData[i]["location"] === undefined) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成系统参数配置！"
                    });
                    return false;
                }
                requestParamConvert["desRequestParam"].push({
                    "paramName": filter(descSysParamData[i]["sysParamName"]),
                    "desParamName": descSysParamData[i]["paramName"],
                    "location": filter(descSysParamData[i]["location"]),
                    "dataType": "String",
                    "type": "sys"
                });
                requestParamConvert["requestParam"].push({
                    "paramName": filter(descSysParamData[i]["sysParamName"]),
                    "location": filter(descSysParamData[i]["location"]),
                    "dataType": "String",
                    "type": "sys"
                });
            }
        }
        //请求出参
        var requestOutParamData = requestOutParamGrid.getInst();
        if (requestOutParamData.length > 0) {
            responseConvert["response"] = [];
            for (var i = 0; i < requestOutParamData.length; i++) {
                responseConvert["response"].push({
                    "paramName": requestOutParamData[i]["paramName"],
                    "dataType": filter(requestOutParamData[i]["dataType"])
                });
            }
        }
        //请求出参
        var descOutParamData = descOutParamGrid.getInst();
        if (descOutParamData.length > 0) {
            responseConvert["desResponse"] = [];
            for (var i = 0; i < descOutParamData.length; i++) {
                if (descOutParamData[i]["desParamName"] === undefined) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成目标出参配置！"
                    });
                    return false;
                }
                responseConvert["desResponse"].push({
                    "paramName": descOutParamData[i]["paramName"],
                    "desParamName": descOutParamData[i]["desParamName"],
                    "dataType": filter(descOutParamData[i]["dataType"])
                });
            }
        }
        gateFilterApi["requestParamConvert"] = JSON.stringify(requestParamConvert);
        gateFilterApi["responseConvert"] = JSON.stringify(responseConvert);
        if (descPathData.length > 1) {
            //var loadBalance = '{"loadMethod":'+OrderMgrDetail_loadBalance+'}';
            var loadBalance = '{"loadMethod":' + 2 + '}';
            gateFilterApi["loadBalance"] = loadBalance; //负载过滤器
        }
        if (OrderMgrDetail_waitTimeLimit > 0) {
            var waitTimeLimit = '{"maxNumber":' + OrderMgrDetail_waitTimeLimit + '}';
            gateFilterApi["waitTimeLimit"] = waitTimeLimit; //超时过滤器
        }
        if (OrderMgrDetail_concurrencyLimit > 0) {
            var concurrencyLimit = '{"maxNumber":' + OrderMgrDetail_concurrencyLimit + '}';
            gateFilterApi["concurrencyLimit"] = concurrencyLimit;  //并发过滤器
        }
        protocolConvert["srcProtocol"] = {
            "trans": OrderMgrDetail_transProto,
            "content": OrderMgrDetail_contentProto,
            "method": ""
        }
        protocolConvert["desProtocol"] = {
            "trans": OrderMgrDetail_desTransProto,
            "content": OrderMgrDetail_desContentProto,
            "method": OrderMgrDetail_desMethod
        }
        gateFilterApi["protocolConvert"] = JSON.stringify(protocolConvert);
        var param = {
            "gateApi": {
                "serviceId": OrderMgrDetail_serverName,
                "apiName": OrderMgrDetail_name,
                "apiDesc": OrderMgrDetail_desc,
                "apiPath": OrderMgrDetail_path,
                "apiTransProto": OrderMgrDetail_transProto,
                "apiContentProto": OrderMgrDetail_contentProto,
                "apiMethod":"",
                "apiInparamDemo": OrderMgrDetail_inparamDemo,
                "apiOutparamDemo": OrderMgrDetail_outparamDemo,
                "desTransProto": OrderMgrDetail_desTransProto,
                "desContentProto": OrderMgrDetail_desContentProto,
                "desMethod": OrderMgrDetail_desMethod,
                "desInparamDemo": "",
                "desOutparamDemo": ""
            },
            "gateFilterApi": gateFilterApi,
            "gateDesaddr": gateDesaddr
        };
        if (isAdd == "false") { //修改时是否新增历史
            param["gateApi"]["apiId"] = OrderMgrDetail_apiId;
            param["isAddHis"] = "yes";
            if (OrderMgrDetail_isAddHis != "yes") {
                param["isAddHis"] = "no";
            }
        }
        return param;
    };
    var api_wsdlSearch = {
        services:[],
        servicesBings:[],
        bindAndOperations:[],
        portPortType:"",
        init:function () {
            $("#APIMgr_wsdlSearch").click(function () {
                var successFun = function (data) {
                    if(data){
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
                if(wsdlPath == ""){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请先输入WSDL地址！"
                    });
                    return false;
                }
                var param = {"wsdlPath": wsdlPath};
                common.ajaxGet("api/gateApi/getWSDLMess", param,successFun, null, null, $("#APIMgr"));
            });
        }
    }
    //获取wsdl的services
    var api_services = {
        value:"",
        getInst: function () {
            return $("#APIMgr_services").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_services.value = value;
            api_services.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgr_services").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgr_services").wandaDropDownList({
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_serviceBinds.setDataSource(api_wsdlSearch.servicesBings[value]);
                },
                select:function (e) {

                }
            });
        },
        setDataSource:function (dataSource) {
            api_services.getInst().setDataSource(dataSource);
        }
    }
    //获取wsdl的serviceBinds
    var api_serviceBinds = {
        value:"",
        getInst: function () {
            return $("#APIMgr_serviceBinds").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_serviceBinds.value = value;
            api_serviceBinds.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgr_serviceBinds").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgr_serviceBinds").wandaDropDownList({
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_bindOperations.setDataSource(api_wsdlSearch.bindAndOperations[value]["bindOperations"]);
                }
            });
        },
        setDataSource:function (dataSource) {
            api_serviceBinds.getInst().setDataSource(dataSource);
        }
    }
    //获取wsdl的bindOperations
    var api_bindOperations = {
        value:"",
        getInst: function () {
            return $("#APIMgr_bindOperations").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_bindOperations.value = value;
            api_bindOperations.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgr_bindOperations").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgr_bindOperations").wandaDropDownList({
                index: 0,
                change:function (e) {

                }
            });
        },
        setDataSource:function (dataSource) {
            api_bindOperations.getInst().setDataSource(dataSource);
        }
    }
    //下一步
    var OrderMgrDetail_nextBtn = {
        init: function () {
            $("#OrderMgrDetail_nextBtn").click(function () {
                var requestStyle = $("#OrderMgrDetail_requestStyle").val();
                var OrderMgrDetail_serverName = $("#OrderMgrDetail_serverName").val();
                var OrderMgrDetail_name = $("#OrderMgrDetail_name").val();
                var OrderMgrDetail_path = $("#OrderMgrDetail_path").val();
                var OrderMgrDetail_inparamDemo = $("#OrderMgrDetail_inparamDemo").val();
                var OrderMgrDetail_outparamDemo = $("#OrderMgrDetail_outparamDemo").val();

                if ("" == OrderMgrDetail_serverName && OrderMgrDetail_serverName.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择应用名称！"
                    });
                    $("#OrderMgrDetail_serverName").focus();
                    return false;
                }
                if ("" == OrderMgrDetail_name && OrderMgrDetail_name.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "API名称不能为空！"
                    });
                    $("#OrderMgrDetail_name").focus();
                    return false;
                }
                if ("" == OrderMgrDetail_path && OrderMgrDetail_path.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "API路径不能为空！"
                    });
                    $("#OrderMgrDetail_path").focus();
                    return false;
                }
                if ("" == OrderMgrDetail_inparamDemo && OrderMgrDetail_inparamDemo.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "入参样例不能为空！"
                    });
                    $("#OrderMgrDetail_inparamDemo").focus();
                    return false;
                }
                if ("" == OrderMgrDetail_outparamDemo && OrderMgrDetail_outparamDemo.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "出参样例不能为空！"
                    });
                    $("#OrderMgrDetail_outparamDemo").focus();
                    return false;
                }

                if ("1" == requestStyle) {
                    var requestData = requestParamGrid.getInst();
                    if (requestData && requestData.length > 0) {
                        for (var i = 0; i < requestData.length; i++) {
                            var flag = requestData[i]["paramName"] == "" || requestData[i]["location"] === undefined || requestData[i]["dataType"] === undefined;
                            if (flag === true) {
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "请完成入参配置！"
                                });
                                return false;
                            } else {
                                var paramName = requestData[i]["paramName"];
                                var location = requestData[i]["location"];
                                if (location == "Body(Body)") {
                                    var result = checkParam(OrderMgrDetail_contentProto, "$." + paramName, OrderMgrDetail_inparamDemo);
                                    if (!result) {
                                        $("#OrderMgrDetail_inparamDemo").focus();
                                        return false;
                                    } else {
                                        if (result.length == 0) {
                                            common.jqConfirm.alert({
                                                title: 0,
                                                content: "入参样例中必须包含" + paramName + "！"
                                            });
                                            return false;
                                        }
                                    }
                                }
                                /*if(location == "Query(Query)"){
                                 var reg = new RegExp("\\{(.| )+?\\}","igm");
                                 var matchStr = OrderMgrDetail_path.match(reg);
                                 if(matchStr && matchStr.length>0){
                                 var isExist = false;
                                 for(var k=0;k<matchStr.length;k++){
                                 if(matchStr[i].replace("{","").replace("}","") == paramName){
                                 isExist = true;
                                 }
                                 }
                                 if(!isExist){
                                 common.jqConfirm.alert({
                                 title: 0,
                                 content: "API路径中必须包含/{"+paramName+"}！"
                                 });
                                 return false;
                                 }
                                 }
                                 }*/
                            }
                        }
                    }
                    var outData = requestOutParamGrid.getInst();
                    if (outData && outData.length > 0) {
                        for (var i = 0; i < outData.length; i++) {
                            var flag = outData[i]["paramName"] == "" || outData[i]["dataType"] === undefined;
                            if (flag === true) {
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "请完成出参配置！"
                                });
                                return false;
                            } else {
                                var paramName = outData[i]["paramName"];
                                var paramNameAttr = paramName.split(".");
                                for (var j = 0; j < paramNameAttr.length; j++) {
                                    if ($("#OrderMgrDetail_outparamDemo").val().indexOf(paramNameAttr[j]) < 0) {
                                        common.jqConfirm.alert({
                                            title: 0,
                                            content: paramNameAttr[j] + "在出参样例中不存在！"
                                        });
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
                $("#baseInfoTitle").hide();
                $("#baseInfoContent").hide();
                $("#requestTitle").hide();
                $("#requestContent1").hide();
                $("#requestContent2").hide();
                $("#requestParamTitle").hide();
                $("#requestParamContent").hide();
                $("#requestOutParamTitle").hide();
                $("#requestOutParamContent").hide();
                $("#APIList_address_div").hide();
                $("#nextButton").hide();

                $("#descRequestTitle").show();
                $("#descRequestContent").show();
                $("#descRequestContent1").show();
                if ("2" == requestStyle) {
                    $("#descParamTitle").hide();
                    $("#descParamContent").hide();
                    $("#descOutParamTitle").hide();
                    $("#descOutParamContent").hide();
                    $("#descConstParamTitle").hide();
                    $("#descConstParamContent").hide();
                    $("#descSysParamTitle").hide();
                    $("#descSysParamContent").hide();
                } else {
                    $("#descParamTitle").show();
                    $("#descParamContent").show();
                    $("#descOutParamTitle").show();
                    $("#descOutParamContent").show();
                    $("#descConstParamTitle").show();
                    $("#descConstParamContent").show();
                    $("#descSysParamTitle").show();
                    $("#descSysParamContent").show();
                }

                $("#descPathTitle").show();
                $("#descPathContent").show();
                $("#saveButton").show();

                var data = requestParamGrid.getInst();
                descParamGrid.addDataSource(data);
                var descdata = requestOutParamGrid.getInst();
                descOutParamGrid.addDataSource(descdata);
            })
        }
    }
    //上一步
    var OrderMgrDetail_preBtn = {
        init: function () {
            $("#OrderMgrDetail_preBtn").click(function () {
                var requestStyle = $("#OrderMgrDetail_requestStyle").val();
                var contentProto = $("#OrderMgrDetail_contentProto").val();
                $("#baseInfoTitle").show();
                $("#baseInfoContent").show();
                $("#requestTitle").show();
                $("#requestContent1").show();
                $("#requestContent2").show();
                if ("2" == requestStyle) {
                    $("#requestParamTitle").hide();
                    $("#requestParamContent").hide();
                    $("#requestOutParamTitle").hide();
                    $("#requestOutParamContent").hide();
                } else {
                    $("#requestParamTitle").show();
                    $("#requestParamContent").show();
                    $("#requestOutParamTitle").show();
                    $("#requestOutParamContent").show();
                }
                if ("1" == contentProto) {
                    $("#APIList_address_div").hide();
                } else {
                    $("#APIList_address_div").show();
                }
                $("#nextButton").show();

                $("#descRequestTitle").hide();
                $("#descRequestContent").hide();
                $("#descRequestContent1").hide();
                $("#descParamTitle").hide();
                $("#descParamContent").hide();
                $("#descOutParamTitle").hide();
                $("#descOutParamContent").hide();
                $("#descConstParamTitle").hide();
                $("#descConstParamContent").hide();
                $("#descSysParamTitle").hide();
                $("#descSysParamContent").hide();
                $("#descPathTitle").hide();
                $("#descPathContent").hide();
                $("#saveButton").hide();
            })
        }
    };
    //保存按钮
    var OrderMgrDetail_orderBtn = {
        init: function () {
            $("#OrderMgrDetail_orderBtn").click(function () {
                //var _param = getFormValue();
                //if (_param) {
                var isOrder = $("#OrderMgrDetail_isOrder").val();
                if (isOrder === "true") {
                    var serverId = $("#OrderMgrDetail_orderServiceId").val();
                    var publishServiceId = $("#OrderMgrDetail_publishServiceId").val();
                    var apiId = [$("#OrderMgrDetail_apiId").val()];
                    var orderInfos = {"serviceId": serverId,"publishServiceId":publishServiceId, "apiIds": apiId};
                    var successFun = function (data) {
                        common.jqConfirm.alert({
                            title: 1,
                            content: "操作成功！",
                            call: function () {
                                var queryParam = $("#OrderMgrDetail_queryParam").val();
                                var param = JSON.parse(queryParam);
                                var routerKey = $("#OrderMgrDetail_menuCode").val();
                                if(param && param["opt"]){
                                    routerKey = routerKey + "?opt="+param["opt"];
                                }
                                common.setRouterParams(param);
                                router.navigate(routerKey);//API发现页面；
                            }
                        });
                    };
                    common.ajaxPost("api/gateApiOrder/addOrderApi", orderInfos, successFun);
                }
                //}
            });
        }
    };
    //取消按钮
    var OrderMgrDetail_closeBtn = {
        init: function () {
            $("#OrderMgrDetail_closeBtn").click(function () {
                var queryParam = $("#OrderMgrDetail_queryParam").val();
                var param = JSON.parse(queryParam);
                var routerKey = $("#OrderMgrDetail_menuCode").val();
                if(param && param["opt"]){
                    routerKey = routerKey + "?opt="+param["opt"];
                }
                common.setRouterParams(param);
                router.navigate(routerKey);//API发现页面；
            })
        }
    };

    var readOnlyFunc = function () {
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
        var timeOutFilter = $("#OrderMgrDetail_waitTimeLimit").data("wandaNumericTextBox");
        timeOutFilter.readonly();
        var totalNumFilter = $("#OrderMgrDetail_concurrencyLimit").data("wandaNumericTextBox");
        totalNumFilter.readonly();
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
        init: function (apiId) {
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                var gateFilterApi = data["gateFilterApi"];
                var gateDesaddr = data["gateDesaddr"];
                if(gateApi){//基本信息
                    $("#OrderMgrDetail_name").val(gateApi["API_NAME"]);
                    $("#OrderMgrDetail_desc").val(gateApi["API_DESC"]);
                    $("#OrderMgrDetail_path").val(gateApi["API_PATH"]);
                    $("#OrderMgrDetail_outparamDemo").val(gateApi["API_OUTPARAM_DEMO"]);
                    $("#OrderMgrDetail_userCode").val(gateApi["USER_CODE"]);
                    $("#OrderMgrDetail_ip").val(gateApi["IP"]);
                    $("#OrderMgrDetail_port").val(gateApi["PORT"]);
                    $("#OrderMgrDetail_apiaddrid").val(gateApi["API_ADDR_ID"]);
                    $("#OrderMgrDetail_GUID").val(gateApi["API_GUID"]);
                    api_serverName.setValue(gateApi["SERVICE_ID"]);
                    api_serverName.getInst().readonly();
                    api_state.setValue(gateApi["STATE"]);
                    api_method.setValue(gateApi["API_METHOD"]);
                    api_transProto.setValue(gateApi["API_TRANS_PROTO"]);
                    api_contentProto.setValue(gateApi["API_CONTENT_PROTO"]);
                    api_desTransProto.setValue(gateApi["DES_TRANS_PROTO"]);
                    api_desContentProto.setValue(gateApi["DES_CONTENT_PROTO"]);
                    api_desMethod.setValue(gateApi["DES_METHOD"]);
                    //api_contentProto.getInst().readonly(false);
                    //api_contentProto.getInst().trigger("change");

                    if(gateApi["API_INPARAM_DEMO"]){
                        try {
                            var inparamJson = JSON.parse(gateApi["API_INPARAM_DEMO"]);
                            if(inparamJson["Query"]){
                                $("#OrderMgrDetail_inparamDemo1").val(inparamJson["Query"]);
                            }
                            if(inparamJson["Head"]){
                                $("#OrderMgrDetail_inparamDemo2").val(inparamJson["Head"]);
                            }
                            if(inparamJson["Body"]){
                                $("#OrderMgrDetail_inparamDemo").val(inparamJson["Body"]);
                            }
                            $("#requestContent2").show();
                        }catch(e) {
                            $("#OrderMgrDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"]);
                        }
                    }
                }
                /*if(gateDesaddr && gateDesaddr.length>0){//目标地址
                 descPathGrid.addDataSource(gateDesaddr);
                 }*/
                if(gateFilterApi && gateFilterApi.length>0){ //过滤器
                    for(var i=0;i<gateFilterApi.length;i++){
                        var obj = gateFilterApi[i];
                        if("concurrencyLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            api_concurrencyLimit.getInst().value(maxNumber);
                            api_concurrencyLimit.value = maxNumber;
                        }else if("waitTimeLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            api_waitTimeLimit.getInst().value(maxNumber);
                            api_waitTimeLimit.value = maxNumber;
                        }else if("loadBalance" == obj["FILTER_TYPE"]){
                            var loadMethod = JSON.parse(obj["FILTER_VALUE"])["loadMethod"];
                            //api_loadBalance.setValue(loadMethod);
                        }else if("requestParamConvert" == obj["FILTER_TYPE"]){
                            /*var obj = JSON.parse(obj["FILTER_VALUE"]);
                             var requestParamData = obj["requestParam"];//入参
                             if(requestParamData && requestParamData.length>0){
                             var _initData = [];
                             for(var t=0;t<requestParamData.length;t++){
                             if(requestParamData[t]["type"]=="request"){
                             _initData.push(requestParamData[t]);
                             }
                             }
                             requestParamGrid.addDataSource(_initData);
                             }
                             var descParamData = obj["desRequestParam"];
                             if(descParamData && descParamData.length>0){
                             var _initData1 = [],_initData2 = [],_initData3 = [];
                             for(var t=0;t<descParamData.length;t++){
                             if(descParamData[t]["type"] == "request"){
                             _initData1.push(descParamData[t]);
                             }else if(descParamData[t]["type"] == "sys"){
                             _initData2.push(descParamData[t]);
                             }else if(descParamData[t]["type"] == "const"){
                             _initData3.push(descParamData[t]);
                             }
                             }
                             descParamGrid.addDataSource(_initData1);
                             descSysParamGrid.addDataSource(_initData2);
                             descConstParamGrid.addDataSource(_initData3);
                             }*/
                        }else if("responseConvert" == obj["FILTER_TYPE"]){
                            /* var obj = JSON.parse(obj["FILTER_VALUE"]);
                             var requestOutParamData = obj["response"];//请求出参
                             requestOutParamGrid.addDataSource(requestOutParamData);
                             var descOutParamData = obj["desResponse"]; //目标出参
                             descOutParamGrid.addDataSource(descOutParamData);*/
                        }else if("requestStyle" == obj["FILTER_TYPE"]){
                            var value = obj["FILTER_VALUE"];
                            api_requestStyle.setValue(value);
                            api_requestStyle.getInst().trigger("change");
                        }else if("wsdlPath" == obj["FILTER_TYPE"]){
                            /* $("#APIList_address").val(obj["FILTER_VALUE"]);
                             $("#APIList_address_div").show();*/
                        }else if("wsdl" == obj["FILTER_TYPE"]){
                            /*var obj = JSON.parse(obj["FILTER_VALUE"]);
                             api_services.setDataSource([obj["service"]]);
                             api_serviceBinds.setDataSource([obj["bind"]]);
                             api_bindOperations.setDataSource([obj["op"]]);
                             api_wsdlSearch.portPortType = obj["port"];
                             api_services.getInst().readonly();
                             api_serviceBinds.getInst().readonly();
                             api_bindOperations.getInst().readonly();
                             $("#APIList_soap_div").show();*/
                        }
                    }
                }
                readOnlyFunc();
            };
            var param = {"apiId": apiId};
            common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#OrderMgrDetail"));

        }
    };
    var checkParam = function (contentProto, path, str) {
        if ("1" == contentProto) {
            try {
                var ttt = JSON.parse(str);
                var result = JSONPath({
                    path: path,
                    json: JSON.parse(str)
                });
                return result;
            } catch (e) {
                console.log(e.name + ": " + e.message);
                common.jqConfirm.alert({
                    title: 0,
                    content: "请检查入参样例JSON格式！"
                });
                return false;
            }

        } else {
            try {
                var x2js = new X2JS();
                var jsonObj = x2js.xml_str2json(str);
                var result = JSONPath({
                    path: path,
                    json: jsonObj
                });
                if (result == undefined) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请检查入参样例XML格式！"
                    });
                    return false;
                }
                return result;
            } catch (e) {
                console.log(e.name + ": " + e.message);
                common.jqConfirm.alert({
                    title: 0,
                    content: "请检查入参样例XML格式！"
                });
                return false;
            }
        }

    };

    var initParam = function () {
        var _params = common.getRouterParams();
        $("#OrderMgrDetail_isAdd").val(_params["isAdd"]);

        $("#OrderMgrDetail_menuCode").val(_params["menuCode"]);
        $("#OrderMgrDetail_isOrder").val(_params["isOrder"]);
        $("#OrderMgrDetail_apiId").val(_params["apiId"]);
        $("#OrderMgrDetail_orderServiceId").val(_params["orderServiceId"]);
        $("#OrderMgrDetail_publishServiceId").val(_params["publishServiceId"]);
        $("#OrderMgrDetail_queryParam").val(_params["queryParam"]);

        apiDetail.init(_params["apiId"]);
        if (_params["isOrder"] === "true") {
            var subscribe = _params["subscribe"];
            if ("是" == subscribe){
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
        /*  if (_params["isAdd"] == "false") {
         $("#OrderMgrDetail_apiId").val(_params["apiId"]);
         $("#OrderMgrDetail_state_div").show();
         $("input:not([type])").bind("input propertychange",function(){
         $("#OrderMgrDetail_isAddHis").val("yes");
         });
         $("textarea").bind("input propertychange",function(){
         $("#OrderMgrDetail_isAddHis").val("yes");
         });
         } else {
         api_waitTimeLimit.getInst().value(3);
         api_concurrencyLimit.getInst().value(100);
         $("#OrderMgrDetail_state_div").hide();
         }*/
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
        //api_loadBalance.init();
        api_waitTimeLimit.init();
        api_concurrencyLimit.init();
        api_requestStyle.init();
        /*api_services.init();
         api_serviceBinds.init();
         api_bindOperations.init();*/
        //descPathGrid.init();
        //descPathGrid_dataAdd.init();
        //requestParamGrid.init();
        //requestParamGrid_dataAdd.init();
        //descParamGrid.init();
        //descConstParamGrid.init();
        //descConstParamGrid_dataAdd.init();
        //descSysParamGrid.init();
        //descSysParamGrid_dataAdd.init();
        //requestOutParamGrid.init();
        //requestOutParamGrid_dataAdd.init();
        //descOutParamGrid.init();
        OrderMgrDetail_orderBtn.init();
        OrderMgrDetail_closeBtn.init();
        /*  OrderMgrDetail_nextBtn.init();*/
        /* OrderMgrDetail_preBtn.init();*/
        initParam();
    };
    return {
        init: init
    }
});

