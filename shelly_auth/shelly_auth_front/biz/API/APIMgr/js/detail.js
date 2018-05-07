define(["jquery", "common","wandaComp", "wandaCompR","biz/API/APIMgr/js/edit_popup","biz/API/APIMgr/js/detailInparamSetting_popup","biz/API/APIMgr/js/detailOutparamSetting_popup","biz/API/APIMgr/js/detailRongduanSetting_popup","biz/API/APIMgr/js/detailCustomSetting_popup"], function ($, common,wandaComp, wandaCompR,edit_popup,inParam_popup,outParam_popup,rongduan_popup,custom_popup) {
    //应用名称
    var api_serverName = {
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_serverName.value = value;
            api_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#APIMgrDetail_serverName").data("wandaDropDownList").setDataSource(data);
            if(api_serverName.value){
                api_serverName.getInst().value(api_serverName.value);
            }
        },
        init: function () {
            $("#APIMgrDetail_serverName").wandaDropDownList({
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0
            });
            var param = {"isAuth":"yes"};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, api_serverName.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    //状态
    var api_state = {
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_state.value = value;
            api_state.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgrDetail_state").data("wandaDropDownList").setDataSource(data);
            if(api_state.value){
                api_state.getInst().value(api_state.value);
            }
        },
        init: function () {
            $("#APIMgrDetail_state").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_state.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    //是否公开
    var api_ispublic = {
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_ispublic").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_ispublic.value = value;
            api_ispublic.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgrDetail_ispublic").data("wandaDropDownList").setDataSource(data);
            if(api_ispublic.value){
                api_ispublic.getInst().value(api_ispublic.value);
            }
            if($("#APIMgrDetail_isAdd").val() != "false"){
                api_ispublic.getInst().select(1);
            }
        },
        init: function () {
            $("#APIMgrDetail_ispublic").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "ispublic"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_ispublic.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    // 传输协议
    var api_transProto = {
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_transProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_transProto.value = value;
            api_transProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgrDetail_transProto").data("wandaDropDownList").setDataSource(data);
            if(api_transProto.value){
                api_transProto.getInst().value(api_transProto.value);
            }else{
                if($("#APIMgrDetail_isAdd").val()!="false"){
                    api_transProto.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#APIMgrDetail_transProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_transProto.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    // Body协议
    var api_contentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_contentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_contentProto.value = value;
            api_contentProto.getInst().value(value);
        },
        setDataSource:function (dataSource) {
            api_contentProto.getInst().setDataSource(dataSource);
        },
        successFun:function (data) {
            api_contentProto.dataSource = data;
            api_contentProto.getInst().setDataSource(data);
            if(api_contentProto.value){
                api_contentProto.getInst().value(api_contentProto.value);
            }else{
                if($("#APIMgrDetail_isAdd").val()!="false"){
                    api_contentProto.getInst().select(0);
                }
            }
        },
        changeDataSource:function (methodValue,flag) {
            if("2" == methodValue){  //post的时候为全部
                api_contentProto.getInst().setDataSource(api_contentProto.dataSource);
            }else{  //get delet put 除去soap
                var newDataSource = [];
                $.each(api_contentProto.dataSource,function (index,value) {
                    if(index!=1&&index!=4){
                        newDataSource.push(value);
                    }
                });
                api_contentProto.getInst().setDataSource(newDataSource);
                if(flag){
                    api_contentProto.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#APIMgrDetail_contentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_contentProto.changeInPlaceholder(value);
                    api_desContentProto.changeDataSource(value,true);
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_contentProto.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    //API方法
    var api_method = {
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_method").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_method.value = value;
            api_method.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgrDetail_method").data("wandaDropDownList").setDataSource(data);
            if(api_method.value){
                api_method.getInst().value(api_method.value);
            }
            if($("#APIMgrDetail_isAdd").val() != "false"){
                api_method.getInst().select(1);
            }
        },
        init: function () {
            $("#APIMgrDetail_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_contentProto.changeDataSource(value,true);
                    api_contentProto.changeInPlaceholder($("#APIMgrDetail_contentProto").val());
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_method.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    //入参tabstrip
    var api_tabstrip = {
        init:function () {
            $("#APIMgrDetail_inparamDemoTitle").click(function () {
                $("#APIMgrDetail_inparamDemoContent").slideToggle("slow",function () {
                    if($('#APIMgrDetail_inparamDemoContent').css('display')=="none"){
                        $("#APIMgrDetail_inparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgrDetail_inparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#APIMgrDetail_outparamDemoTitle").click(function () {
                $("#APIMgrDetail_outparamDemoContent").slideToggle("slow",function () {
                    if($('#APIMgrDetail_outparamDemoContent').css('display')=="none"){
                        $("#APIMgrDetail_outparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgrDetail_outparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
        }
    };
    //wsdl地址获取
    var api_wsdl_EditPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 200,
            maxWidth: "",
            maxHeight: "",
            title: "方法配置",
            content: "biz/API/APIMgrDetail/html/edit_popup.html"
        },
        getInst: function () {
            if (api_wsdl_EditPopupWin.inst) {
                api_wsdl_EditPopupWin.inst = new wandaComp.wandaWindow("APIMgrDetail_wsdlSearch", "APIMgrDetail_wsdl_test", api_wsdl_EditPopupWin.optionObj);
            }
            return api_wsdl_EditPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var wsdlPath = $("#APIMgrDetail_wsdlPath").val();
            if(wsdlPath == ""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请先输入WSDL地址！"
                });
                return false;
            }
        },
        submitBtnCallBack: function (closeFun) {
            var bindingName = $("#APIMgrDetail_wsdl_test").find("#APIMgrDetail_popup_serviceBinds").val();
            var operationName = $("#APIMgrDetail_wsdl_test").find("#APIMgrDetail_popup_bindOperations").val();
            var obj = edit_popup.api_wsdlSearch.bindAndOperations[bindingName];
            var portTypeName = obj["portPortType"];
            var wsdlPath = obj["address"]+"?wsdl";
            var param = {
                "wsdlPath": wsdlPath,
                "portTypeName": portTypeName,
                "operationName": operationName,
                "bindingName": bindingName
            };
            var successFun = function (data) {
                common.jqConfirm.alert({
                    title: 1,
                    content: "操作成功！",
                    call: function () {
                        $("#APIMgrDetail_inparamDemo").val(data);
                        var APIMgrDetail_wsdl_test = $("#APIMgrDetail_wsdl_test").data("wandaWindow");
                        APIMgrDetail_wsdl_test.close();
                        $("#APIMgrDetail_services").val(serviceName);
                        $("#APIMgrDetail_serviceBinds").val(bindingName);
                        $("#APIMgrDetail_bindOperations").val(operationName);
                        $("#APIMgrDetail_soapDemo").val(data);
                        var APIMgr_wsdl_test = $("#APIMgrDetail_wsdl_test").data("wandaWindow");
                        APIMgr_wsdl_test.close();
                        descPathGrid.getInst().setDataSource(null);
                        descPathGrid.addRow();
                    }
                });
            };
            common.ajaxGet("api/gateApi/createXmlDemo", param, successFun);

        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            api_wsdl_EditPopupWin.getInst().init(function () {
                var isOk = api_wsdl_EditPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = edit_popup.init;
                common.initExeByAttr("APIMgrDetail_wsdl_test", "opt='submit'", function () {
                    initFun("APIMgrDetail_wsdl_test");
                });
            });
            api_wsdl_EditPopupWin.getInst().callBack("opt='submit'", api_wsdl_EditPopupWin.submitBtnCallBack, true);
            api_wsdl_EditPopupWin.getInst().callBack("opt='cancel'", api_wsdl_EditPopupWin.cancelBtnCallBack);
        }
    };
    var api_wsdlSearch = {
        services:[],
        servicesBings:[],
        bindAndOperations:[],
        portPortType:"",
        init:function () {
            $("#APIMgrDetail_wsdlSearch").click(function () {
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
                var wsdlPath = $("#APIMgrDetail_wsdlPath").val();
                if(wsdlPath == ""){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请先输入WSDL地址！"
                    });
                    return false;
                }
                var param = {"wsdlPath": wsdlPath};
                common.ajaxGet("api/gateApi/getWSDLMess", param,successFun, null, null, $("#APIMgrDetail"));
            });
        }
    }
    //获取wsdl的services
    var api_services = {
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_services").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_services.value = value;
            api_services.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgrDetail_services").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgrDetail_services").wandaDropDownList({
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
            return $("#APIMgrDetail_serviceBinds").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_serviceBinds.value = value;
            api_serviceBinds.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgrDetail_serviceBinds").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgrDetail_serviceBinds").wandaDropDownList({
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
            return $("#APIMgrDetail_bindOperations").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_bindOperations.value = value;
            api_bindOperations.getInst().value(value);
        },
        getInst: function () {
            return $("#APIMgrDetail_bindOperations").data("wandaDropDownList");
        },
        init:function () {
            $("#APIMgrDetail_bindOperations").wandaDropDownList({
                index: 0,
                change:function (e) {

                }
            });
        },
        setDataSource:function (dataSource) {
            api_bindOperations.getInst().setDataSource(dataSource);
        }
    }
    //目标API方法
    var api_desMethod = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_desMethod").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_desMethod.value = value;
            api_desMethod.getInst().value(value);
        },
        setDataSource:function (dataSource) {
            api_desMethod.getInst().setDataSource(dataSource);
        },
        successFun:function (data) {
            $("#APIMgrDetail_desMethod").data("wandaDropDownList").setDataSource(data);
            if(api_desMethod.value){
                api_desMethod.getInst().value(api_desMethod.value);
            }else{
                if($("#APIMgrDetail_isAdd").val()!="false"){
                    api_desMethod.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#APIMgrDetail_desMethod").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_desContentProto.changeDataSource(true);
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desMethod.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    //目标API传输协议
    var api_desTransProto = {
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_desTransProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_desTransProto.value = value;
            api_desTransProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgrDetail_desTransProto").data("wandaDropDownList").setDataSource(data);
            if(api_desTransProto.value){
                api_desTransProto.getInst().value(api_desTransProto.value);
            }
            if($("#APIMgrDetail").val()!="false"){
                api_desTransProto.getInst().select(0);
            }
        },
        init: function () {
            $("#APIMgrDetail_desTransProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desTransProto.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    //目标API Body协议
    var api_desContentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#APIMgrDetail_desContentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_desContentProto.value = value;
            api_desContentProto.getInst().value(value);
            if("2" == value || "5" == value){
                $("#APIList_address_div").show();
                $("#APIList_soap_div").show();
            }else{
                $("#APIList_address_div").hide();
                $("#APIList_soap_div").hide();
            }
        },
        setDataSource:function (dataSource) {
            api_desContentProto.getInst().setDataSource(dataSource);
        },
        changeDataSource:function (flag) {
            var newDataSource = [];
            var contentValue = $("#APIMgrDetail_contentProto").val();
            var desMethodValue = $("#APIMgrDetail_desMethod").val();
            if("2" == contentValue || "5" == contentValue){  //第一页body协议为soap时，第二页只能为soap
                if("2" == contentValue){
                    newDataSource.push(api_desContentProto.dataSource[1]);
                }else{
                    newDataSource.push(api_desContentProto.dataSource[4]);
                }
                api_desContentProto.getInst().setDataSource(newDataSource);
                api_desContentProto.getInst().select(0);
                if(flag){
                    api_desMethod.getInst().select(1);
                }
                api_desMethod.getInst().readonly();
            }else if("4" == contentValue){  //第一页body协议为text时，第二页只能为text
                newDataSource.push(api_desContentProto.dataSource[3]);
                api_desContentProto.getInst().setDataSource(newDataSource);
                api_desContentProto.getInst().select(0);
                api_desMethod.getInst().readonly(false);
            }else{   //其他情况，取决于第二页请求方法
                if("2" == desMethodValue){//目标post的时候没有 text
                    $.each(api_desContentProto.dataSource, function (index, value) {
                        if(index!=3){
                            newDataSource.push(value);
                        }
                    });
                }else{  //目标非post的时候  没有soap和text
                    newDataSource.push(api_desContentProto.dataSource[0]);
                    newDataSource.push(api_desContentProto.dataSource[2]);
                    newDataSource.push(api_desContentProto.dataSource[5]);
                }
                api_desContentProto.getInst().setDataSource(newDataSource);
                api_desMethod.getInst().readonly(false);
                if(flag){
                    api_desContentProto.getInst().select(0);
                }
            }
        },
        successFun:function (data) {
            api_desContentProto.dataSource = data;
            api_desContentProto.getInst().setDataSource(data);
            if(api_desTransProto.value){
                api_desContentProto.getInst().value(api_desContentProto.value);
            }
            if($("#APIMgrDetail_isAdd").val()!="false"){
                api_desContentProto.getInst().select(0);
                api_desContentProto.changeDataSource();
            }
        },
        init: function () {
            $("#APIMgrDetail_desContentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if("2" == value || "5" == value){
                        api_desMethod.setValue("2");
                        api_desMethod.getInst().readonly();
                        $("#APIList_address_div").show();
                        if($("#APIMgrDetail_isAdd").val() == "false"){
                            $("#APIList_soap_div").show();
                        }else{
                            $("#APIList_soap_div").hide();
                        }
                    }else{
                        api_desMethod.getInst().readonly(false);
                        $("#APIList_address_div").hide();
                        $("#APIList_soap_div").hide();
                    }
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desContentProto.successFun, null, null, $("#APIMgrDetail"));
        }
    };
    //目标地址
    var descPathGrid = {
        gridColums:[
            {field: "ADDR_ID", hidden: true},
            {field: "API_ID", hidden: true},
            {
                field: "IP",
                title: "<em class='color_red'>*</em>IP地址",
                width: "180px"
            },
            {
                field: "PORT",
                title: "<em class='color_red'>*</em>端口",
                width: "120px"
            },
            {
                field: "URI_PATH",
                title: "<em class='color_red'>*</em>访问地址"
            }
        ],
        init:function () {
            descPathGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descPathGrid.inst) {
                descPathGrid.inst = new wandaComp.wandaGrid("APIMgrDetail_descPathGrid", this.gridColums, false, this.pagerCallBack,null,false);
            }
            return descPathGrid.inst;
        },
        getDataSource: function (number) {
            if (number) {
                return descPathGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descPathGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            $("#APIMgrDetail_isAddHis").val("yes");
            var grid = $("#APIMgrDetail_descPathGrid").data("wandaGrid");
            var dataView = descPathGrid.getInst();
            var ip="",port="";
            if (dataView && dataView.length > 0) {
                ip = dataView[0]["IP"];
                port = dataView[0]["PORT"];
            }
            descPathGrid.getInst().addRow();
            var data = descPathGrid.getInst().data("wandaGrid").dataSource.at(0);
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
            $("#APIMgrDetail_descPathGrid_dataAdd").click(function () {
                descPathGrid.addRow();
            })
        }
    };
    //下一步
    var APIMgrDetail_nextBtn = {
        init:function () {
            $("#APIMgrDetail_nextBtn").click(function () {
                var APIMgrDetail_contentProto = $("#APIMgrDetail_contentProto").val();
                var APIMgrDetail_desContentProto = $("#APIMgrDetail_desContentProto").val();

                $("#baseInfoTitle").hide();
                $("#baseInfoContent").hide();
                $("#requestTitle").hide();
                $("#requestContent1").hide();
                $("#requestContent2").hide();
                $("#nextButton").hide();

                $("#descRequestTitle").show();
                $("#descRequestContent").show();
                $("#descHighParamTitle").show();//本次改造新增
                $("#descHighParamContent").show();
                $("#descPathTitle").show();
                $("#descPathContent").show();
                $("#saveButton").show();

                if(APIMgrDetail_contentProto!="2" && APIMgrDetail_contentProto!="5" &&
                    APIMgrDetail_desContentProto!="2" && APIMgrDetail_desContentProto!="5"){
                    $("#APIList_address_div").hide();
                    $("#APIList_soap_div").hide();
                }else{
                    $("#APIList_address_div").show();
                    $("#APIList_soap_div").show();
                }
            })
        }
    }
    //上一步
    var APIMgrDetail_preBtn = {
        init:function () {
            $("#APIMgrDetail_preBtn").click(function () {
                var requestStyle = $("#APIMgrDetail_requestStyle").val();
                var contentProto = $("#APIMgrDetail_contentProto").val();
                $("#baseInfoTitle").show();
                $("#baseInfoContent").show();
                $("#requestTitle").show();
                $("#requestContent1").show();
                $("#requestContent2").show();
                $("#nextButton").show();

                $("#descRequestTitle").hide();
                $("#descRequestContent").hide();
                $("#descPathTitle").hide();
                $("#descPathContent").hide();
                $("#descHighParamTitle").hide();//本次改造新增
                $("#descHighParamContent").hide();
                $("#saveButton").hide();
                $("#APIList_soap_div").hide();
            })
        }
    }
    //保存按钮
    var APIMgrDetail_saveCloseBtn = {
        init:function () {
            $("#APIMgrDetail_saveCloseBtn").click(function () {
                clearData();
                var queryParam = $("#APIMgrDetail_queryParam").val();
                var routerKey = $("#APIMgrDetail_menuCode").val();
                if(queryParam!=""){
                    var param = JSON.parse(queryParam);
                    if(param && param["opt"]){
                        routerKey = routerKey + "?opt="+param["opt"];
                    }
                }
                common.setRouterParams(param);
                router.navigate(routerKey);//API发现页面；
            });
        }
    };
    //取消按钮
    var APIMgrDetail_closeBtn = {
        init:function () {
            $("#APIMgrDetail_closeBtn1").click(function () {
                clearData();
                var queryParam = $("#APIMgrDetail_queryParam").val();
                var routerKey = $("#APIMgrDetail_menuCode").val();
                if(queryParam!=""){
                    var param = JSON.parse(queryParam);
                    if(param && param["opt"]){
                        routerKey = routerKey + "?opt="+param["opt"];
                    }
                }
                common.setRouterParams(param);
                router.navigate(routerKey);//API发现页面；
            });
        }
    };
    //修改获取API数据详情
    var apiDetail = {
        init: function (apiId,hisId) {
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                var gateFilterApi = data["gateFilterApi"];
                var gateDesaddr = data["gateDesaddr"];
                if(gateApi){//基本信息
                    $("#APIMgrDetail_name").val(gateApi["API_NAME"]);
                    $("#APIMgrDetail_desc").val(gateApi["API_DESC"]);
                    $("#APIMgrDetail_path").val(gateApi["API_PATH"]);
                    $("#APIMgrDetail_outparamDemo").val(gateApi["API_OUTPARAM_DEMO"]);
                    $("#APIMgrDetail_userCode").val(gateApi["USER_CODE"]);
                    $("#APIMgrDetail_ip").val(gateApi["IP"]);
                    $("#APIMgrDetail_port").val(gateApi["PORT"]);
                    $("#APIMgrDetail_apiaddrid").val(gateApi["API_ADDR_ID"]);
                    $("#APIMgrDetail_GUID").val(gateApi["API_GUID"]);
                    api_serverName.setValue(gateApi["SERVICE_ID"]);
                    api_serverName.getInst().readonly();
                    api_state.setValue(gateApi["STATE"]);
                    $("#APIMgrDetail_method").val(gateApi["API_METHOD"]);
                    $("#APIMgrDetail_contentProto").val(gateApi["API_CONTENT_PROTO"]);
                    $("#APIMgrDetail_desMethod").val(gateApi["DES_METHOD"]);
                    $("#APIMgrDetail_desContentProto").val(gateApi["DES_CONTENT_PROTO"]);

                    api_contentProto.changeDataSource(gateApi["API_METHOD"],false);
                    api_desContentProto.changeDataSource(false);

                    api_method.setValue(gateApi["API_METHOD"]);
                    api_transProto.setValue(gateApi["API_TRANS_PROTO"]);
                    api_contentProto.setValue(gateApi["API_CONTENT_PROTO"]);
                    api_desTransProto.setValue(gateApi["DES_TRANS_PROTO"]);
                    api_desMethod.setValue(gateApi["DES_METHOD"]);
                    api_desContentProto.setValue(gateApi["DES_CONTENT_PROTO"]);
                    api_ispublic.setValue(gateApi["ISPUBLIC"]);

                    if(gateApi["API_INPARAM_DEMO"]){
                        try {
                            var inparamJson = JSON.parse(gateApi["API_INPARAM_DEMO"]);
                            if(inparamJson["Body"] == undefined){
                                $("#APIMgrDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"])
                            }else{
                                $("#APIMgrDetail_inparamDemo").val(inparamJson["Body"]);
                            }
                        }catch(e) {
                            $("#APIMgrDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"]);
                        }
                    }
                }
                if(gateDesaddr && gateDesaddr.length>0){//目标地址
                    descPathGrid.addDataSource(gateDesaddr);
                }
                if(gateFilterApi && gateFilterApi.length>0){ //过滤器
                    for(var i=0;i<gateFilterApi.length;i++){
                        var obj = gateFilterApi[i];
                        if("concurrencyLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#APIMgrDetail_concurrencyLimit").val(maxNumber);
                        }else if("waitTimeLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#APIMgrDetail_waitTimeLimit").val(maxNumber);
                        }else if("loadBalance" == obj["FILTER_TYPE"]){
                            var loadMethod = JSON.parse(obj["FILTER_VALUE"])["loadMethod"];
                        }else if("requestParamConvert" == obj["FILTER_TYPE"]){
                            $("#APIMgrDetail_requestParamConvert").val(obj["FILTER_VALUE"]);
                            $('input[name="detailMgr_inParamType"][value='+JSON.parse(obj["FILTER_VALUE"])["processModel"]+']').prop("checked", "checked");
                        }else if("responseConvert" == obj["FILTER_TYPE"]){
                            $("#APIMgrDetail_responseParamConvert").val(obj["FILTER_VALUE"]);

                            var valueStr = JSON.parse(obj["FILTER_VALUE"]);
                            var value = [];
                            if(valueStr["delPath"] != undefined){
                                value = valueStr["delPath"];
                            }
                            if(value!=null&&value.length>0){
                                var count = value.length;
                                if(count == 1){
                                    $("#detailMgr_outParamFilterGrid").css("width","25%");
                                }else if(count == 2){
                                    $("#detailMgr_outParamFilterGrid").css("width","50%");
                                }else if(count == 3){
                                    $("#detailMgr_outParamFilterGrid").css("width","75%");
                                }else if(count >= 4){
                                    $("#detailMgr_outParamFilterGrid").css("width","100%");
                                }
                                if(count>0){
                                    for(var m=0;m<count;m++){
                                        if(m==0 || m%4 ==0){
                                            $("#detailMgr_outParamFilterGrid").append("<tr></tr>");
                                        }
                                        var item = value[m];
                                        item = item.trim().replace("\"","").replace("\"","");
                                        $("#detailMgr_outParamFilterGrid").find("tbody").find("tr:last").append("<td style='border: 0px;padding-left: 0px;padding-bottom:0px'><input class='k-textbox' style='width:85%' value='"+item+"'  readonly='readonly'/></td>");
                                    }
                                }

                            }else{
                                //$("#APIMgrDetail_descHighParamGrid").parent().parent().hide();
                            }

                        }else if("requestStyle" == obj["FILTER_TYPE"]){
                            /*var value = obj["FILTER_VALUE"];
                            api_requestStyle.setValue(value);
                            api_requestStyle.getInst().trigger("change");*/
                        }else if("wsdlPath" == obj["FILTER_TYPE"]){
                            $("#APIMgrDetail_wsdlPath").val(obj["FILTER_VALUE"]);
                        }else if("wsdl" == obj["FILTER_TYPE"]){
                            var value = JSON.parse(obj["FILTER_VALUE"]);
                            $("#APIMgrDetail_services").val(value["service"]);
                            $("#APIMgrDetail_serviceBinds").val(value["bind"]);
                            $("#APIMgrDetail_bindOperations").val(value["op"]);
                        }else if("extendFilter" == obj["FILTER_TYPE"]){     //自定义过滤器
                            $("#APIMgrDetail_extendFilter").val(obj["FILTER_VALUE"]);
                        }
                    }
                }
                setReadOnly();
            };
            if(hisId != null){
                var param = {"hisId": hisId};
                common.ajaxGet("api/gateHisApi/queryGateApiHisDetail", param, successFun, null, null, $("#APIMgrDetail"));
            }else{
                var param = {"apiId": apiId};
                common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#APIMgrDetail"));
            }
        }
    };
    // 入参转换设置
    var APIMgrDetail_inparamSettingPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 900,
            maxHeight: "",
            title: "入参设置",
            content: "biz/API/APIMgr/html/detailInparamSetting_popup.html"
        },
        getInst: function () {
            if (APIMgrDetail_inparamSettingPopupWin.inst) {
                APIMgrDetail_inparamSettingPopupWin.inst = new wandaComp.wandaWindow("APIMgrDetail_inparamSetting", "APIMgrDetail_inparamSettingPopup", APIMgrDetail_inparamSettingPopupWin.optionObj);
            }
            return APIMgrDetail_inparamSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var APIMgrDetail_contentProto = $("#APIMgrDetail_contentProto").val();
            if(APIMgrDetail_contentProto == "4"){
                common.jqConfirm.alert({
                    title: 0,
                    content: "选择的body协议不支持入参转换！"
                });
                return false;
            }
            var requestParamValue = $("#APIMgrDetail_requestParamConvert").val();
            if(requestParamValue){
                var dataJson = JSON.parse(requestParamValue);
                var addPath = dataJson["addPath"];
                if(addPath && addPath.length > 0){
                    inParam_popup.inConst.addDataSource(addPath);
                }
                var pathConvert = dataJson["pathConvert"];
                if(pathConvert && pathConvert.length > 0){
                    inParam_popup.inParam.addDataSource(pathConvert);
                }
                $("#APIMgrDetail_requestParamConvert").val("");
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#APIMgrDetail_inparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIMgrDetail_inparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            APIMgrDetail_inparamSettingPopupWin.getInst().init(function () {
                var initFun = inParam_popup.init;
                common.initExeByAttr("APIMgrDetail_inparamSettingPopup", "opt='cancel'", function () {
                    if(!isOk){
                        initFun("APIMgrDetail_inparamSettingPopup");
                    }
                });
                APIMgrDetail_inparamSettingPopupWin.setSubPageValue();
                isOk = true;
            });
            APIMgrDetail_inparamSettingPopupWin.getInst().callBack("opt='cancel'", APIMgrDetail_inparamSettingPopupWin.cancelBtnCallBack);
        }
    };
    //出参转换设置
    var APIMgrDetail_outparamSettingPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 900,
            maxHeight: "",
            title: "出参设置",
            content: "biz/API/APIMgr/html/detailOutparamSetting_popup.html"
        },
        getInst: function () {
            if (APIMgrDetail_outparamSettingPopupWin.inst) {
                APIMgrDetail_outparamSettingPopupWin.inst = new wandaComp.wandaWindow("APIMgrDetail_outparamSetting", "APIMgrDetail_outparamSettingPopup", APIMgrDetail_outparamSettingPopupWin.optionObj);
            }
            return APIMgrDetail_outparamSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var APIMgrDetail_contentProto = $("#APIMgrDetail_contentProto").val();
            if(APIMgrDetail_contentProto == "4"){
                common.jqConfirm.alert({
                    title: 0,
                    content: "选择的body协议不支持入参转换！"
                });
                return false;
            }
            var responseValue = $("#APIMgrDetail_responseParamConvert").val();
            if(responseValue){
                var value = JSON.parse(responseValue);
                var APIMgrDetail_outparamConvertData = value["pathConvert"];
                if(APIMgrDetail_outparamConvertData && APIMgrDetail_outparamConvertData.length>0){
                    outParam_popup.outParam.addDataSource(APIMgrDetail_outparamConvertData);
                }
                $("#APIMgrDetail_responseParamConvert").val("");
            }

        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#APIMgrDetail_outparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIMgrDetail_outparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            APIMgrDetail_outparamSettingPopupWin.getInst().init(function () {
                var initFun = outParam_popup.init;
                common.initExeByAttr("APIMgrDetail_outparamSettingPopup", "opt='cancel'", function () {
                    if (!isOk) {
                        initFun("APIMgrDetail_outparamSettingPopup");
                    }
                });
                APIMgrDetail_outparamSettingPopupWin.setSubPageValue();
                isOk = true;
            });
            APIMgrDetail_outparamSettingPopupWin.getInst().callBack("opt='cancel'", APIMgrDetail_outparamSettingPopupWin.cancelBtnCallBack);
        }
    };
    //熔断配置
    var APIMgrDetail_rongduanSettingPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 150,
            maxWidth: "",
            maxHeight: "",
            title: "熔断配置",
            content: "biz/API/APIMgr/html/detailRongduanSetting_popup.html"
        },
        getInst: function () {
            if (APIMgrDetail_rongduanSettingPopupWin.inst) {
                APIMgrDetail_rongduanSettingPopupWin.inst = new wandaComp.wandaWindow("APIMgrDetail_rongduanSetting", "APIMgrDetail_rongduanSettingPopup", APIMgrDetail_rongduanSettingPopupWin.optionObj);
            }
            return APIMgrDetail_rongduanSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var APIMgrDetail_waitTimeLimit = $("#APIMgrDetail_waitTimeLimit").val();
            var APIMgrDetail_concurrencyLimit = $("#APIMgrDetail_concurrencyLimit").val();
            if(APIMgrDetail_waitTimeLimit != ""){
                rongduan_popup.waitTime.getInst().value(APIMgrDetail_waitTimeLimit);
                rongduan_popup.waitTime.value = APIMgrDetail_waitTimeLimit;
                $("#APIMgrDetail_waitTimeLimit").val("");
            }
            if(APIMgrDetail_concurrencyLimit  != ""){
                rongduan_popup.concuy.getInst().value(APIMgrDetail_concurrencyLimit);
                rongduan_popup.concuy.value = APIMgrDetail_concurrencyLimit;
                $("#APIMgrDetail_concurrencyLimit").val("");
            }
            rongduan_popup.waitTime.getInst().readonly();
            rongduan_popup.concuy.getInst().readonly();
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#APIMgrDetail_rongduanSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIMgrDetail_rongduanSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            APIMgrDetail_rongduanSettingPopupWin.getInst().init(function () {
                var initFun = rongduan_popup.init;
                common.initExeByAttr("APIMgrDetail_rongduanSettingPopup", "opt='cancel'", function () {
                    if(!isOk){
                        initFun("APIMgrDetail_rongduanSettingPopup");
                    }
                });
                APIMgrDetail_rongduanSettingPopupWin.setSubPageValue();
                isOk = true;
            });
            APIMgrDetail_rongduanSettingPopupWin.getInst().callBack("opt='cancel'", APIMgrDetail_rongduanSettingPopupWin.cancelBtnCallBack);
        }
    };

    //自定义过滤器
    var APIMgrDetail_customSettingPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 150,
            maxWidth: "",
            maxHeight: "",
            title: "扩展插件",
            content: "biz/API/APIMgr/html/detailCustomSetting_popup.html"
        },
        getInst: function () {
            if (APIMgrDetail_customSettingPopupWin.inst) {
                APIMgrDetail_customSettingPopupWin.inst = new wandaComp.wandaWindow("APIMgrDetail_customSetting", "APIMgrDetail_customSettingPopup", APIMgrDetail_customSettingPopupWin.optionObj);
            }
            return APIMgrDetail_customSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            //初始化自定义过滤器的值
            var APIMgr_extendFilter = $("#APIMgrDetail_extendFilter").val();
            if(APIMgr_extendFilter && APIMgr_extendFilter.length > 0){
                var APIMgr_extendFilter_json = JSON.parse(APIMgr_extendFilter);
                custom_popup.inConst.addDataSource(APIMgr_extendFilter_json);
                $("#APIMgrDetail_extendFilter").val("");
            }
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIMgrDetail_customSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            APIMgrDetail_customSettingPopupWin.getInst().init(function () {
                var initFun = custom_popup.init;
                common.initExeByAttr("APIMgrDetail_customSettingPopup", "opt='cancel'", function () {
                    if(!isOk){
                        initFun("APIMgrDetail_customSettingPopup");
                    }
                });
                APIMgrDetail_customSettingPopupWin.setSubPageValue();
                isOk = true;
            });
            APIMgrDetail_customSettingPopupWin.getInst().callBack("opt='cancel'", APIMgrDetail_customSettingPopupWin.cancelBtnCallBack);
        }
    };

    var clearData = function () {
        api_serverName.value = "";
        api_state.value = "";
        api_method.value = "";
        api_transProto.value = "";
        api_contentProto.value = "";
        api_desContentProto.value = "";
        api_desMethod.value = "";
        api_desTransProto.value = "";
    };
    var setReadOnly = function () {
        $("#APIMgrDetail_GUID").attr("readonly","readonly");
        $("#APIMgrDetail_name").attr("readonly","readonly");
        api_state.getInst().readonly();
        $("#APIMgrDetail_desc").attr("readonly","readonly");
        api_transProto.getInst().readonly();
        $("#APIMgrDetail_path").attr("readonly","readonly");
        api_method.getInst().readonly();
        api_transProto.getInst().readonly();
        api_contentProto.getInst().readonly();
        $("#APIMgrDetail_inparamDemo").attr("readonly", "true").css("background-color", "white");
        $("#APIMgrDetail_outparamDemo").attr("readonly", "true").css("background-color", "white");

        api_desMethod.getInst().readonly();
        api_desContentProto.getInst().readonly();
        api_desTransProto.getInst().readonly();
        api_ispublic.getInst().readonly();
    };
    var initParam = function () {
        var _params = common.getRouterParams();
        $("#APIMgrDetail_isAdd").val(_params["isAdd"]);
        $("#APIMgrDetail_menuCode").val(_params["menuCode"]);
        $("#APIMgrDetail_queryParam").val(_params["queryParam"]);
        api_serverName.init();
        api_state.init();
        api_method.init();
        api_transProto.init();
        api_contentProto.init();
        api_tabstrip.init();
        api_desContentProto.init();
        api_desMethod.init();
        api_desTransProto.init();
        api_ispublic.init();
        //api_loadBalance.init();

        descPathGrid.init();
        descPathGrid_dataAdd.init();
        APIMgrDetail_saveCloseBtn.init();
        APIMgrDetail_closeBtn.init();
        APIMgrDetail_nextBtn.init();
        APIMgrDetail_preBtn.init();

        APIMgrDetail_inparamSettingPopupWin.init();
        APIMgrDetail_outparamSettingPopupWin.init();
        APIMgrDetail_rongduanSettingPopupWin.init();
        APIMgrDetail_customSettingPopupWin.init();

        if (_params["isAdd"] == "false") {
            $("#APIMgrDetail_apiId").val(_params["apiId"]);
            apiDetail.init(_params["apiId"],_params["hisId"]);
        } else {
            $("#APIMgrDetail_state_div").hide();
        }
    }
    var init = function () {
        wandaComp.elementControl($("#APIMgrDetail"));
        initParam();
    };
    return {
        init: init
    }
});

