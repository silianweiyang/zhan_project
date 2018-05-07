define(["jquery", "common","wandaComp", "wandaCompR","biz/test/descApi_wsdl_popup","biz/test/descApiRongduanSetting_popup","biz/test/descApiInparamSetting_popup","biz/test/descApiOutparamSetting_popup","biz/test/descApiCustomSetting_popup"], function ($, common,wandaComp, wandaCompR,edit_popup,rongduan_popup,inParam_popup,outParam_popup,custom_popup) {
    var descApiPopup_validate = {
        helper:null,
        init:function (parentIds) {
            descApiPopup_validate.helper =  wandaComp.commonValidator("descApiPopup");
        }
    }
    // 第一页 创建方式选择
    var descApiPopup_choose_type = {
        getInst:function () {
            return $("#descApiPopup_choose_type").data("wandaDropDownList");
        },
        init: function () {
            $("#descApiPopup_choose_type").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                dataSource:[{
                    "text":"选择",
                    "value":"1"
                },{
                    "text":"新建",
                    "value":"2"
                }],
                change:function (e) {
                    var value = this.value();
                    if("1" == value){
                        $("#descApiPopup_choose_serverName_div").show();
                        $("#descApiPopup_choose_name_div").show();
                    }else{
                        $("#descApiPopup_choose_serverName_div").hide();
                        $("#descApiPopup_choose_name_div").hide();
                    }
                }
            });
        }
    };
    // 第一页 应用列表选择
    var descApiPopup_choose_serverName = {
        value:"",
        getInst: function () {
            return $("#descApiPopup_choose_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_choose_serverName.value = value;
            descApiPopup_choose_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#descApiPopup_choose_serverName").data("wandaDropDownList").setDataSource(data);
            if($("#descApiPopup_serverId").val()!=""){
                descApiPopup_choose_serverName.setValue($("#descApiPopup_serverId").val());
            }else{
                descApiPopup_choose_serverName.getInst().select(0);
            }

            if(descApiPopup_choose_serverName.value){
                descApiPopup_choose_serverName.getInst().value(descApiPopup_choose_serverName.value);
            }
            descApiPopup_choose_serverName.getInst().trigger("change");
        },
        init: function () {
            $("#descApiPopup_choose_serverName").wandaDropDownList({
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#descApiPopup_choose_serverName-list").css("height","auto");
                    $("#descApiPopup_choose_serverName-list").css("overflow","hidden");
                },
                change:function (e) {
                    descApiPopup_choose_name.setDataSource(this.value());
                    $("#descApiPopup_choose_name_div").show();
                }
            });
            var param = {"isAuth":"yes"};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, descApiPopup_choose_serverName.successFun, null, null, $("#descApiPopup"));
        }
    }
    //第一页 api列表选择
    var descApiPopup_choose_name = {
        value:"",
        getInst: function () {
            return $("#descApiPopup_choose_name").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_choose_name.value = value;
            descApiPopup_choose_name.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopup_choose_name").data("wandaDropDownList").setDataSource(data);
            if($("#descApiPopup_apiId").val()!=""){
                descApiPopup_choose_name.setValue($("#descApiPopup_apiId").val());
            }else{
                descApiPopup_choose_name.getInst().select(0);
            }

            if(descApiPopup_choose_name.value){
                descApiPopup_choose_name.getInst().value(descApiPopup_choose_name.value);
            }
        },
        setDataSource:function (serviceId) {
            var param = {"serviceId":serviceId};
            common.ajaxGet("api/gateApiFlow/queryGateApiByServiceId", param, descApiPopup_choose_name.successFun, null, null, $("#descApiPopup"));
        },
        init: function (serviceId) {
            $("#descApiPopup_choose_name").wandaDropDownList({
                dataTextField: "API_NAME",
                dataValueField: "API_ID",
                index: 0,
                open:function (e) {
                    $("#descApiPopup_choose_name-list").css("height","auto");
                    $("#descApiPopup_choose_name-list").css("overflow","hidden");
                }
            });
        }
    };
    
    //应用名称
    var descApiPopup_serverName = {
        value:"",
        getInst: function () {
            return $("#descApiPopup_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_serverName.value = value;
            descApiPopup_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#descApiPopup_serverName").data("wandaDropDownList").setDataSource(data);
            if(descApiPopup_serverName.value){
                descApiPopup_serverName.getInst().value(descApiPopup_serverName.value);
            }
        },
        init: function () {
            $("#descApiPopup_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "--请选择--",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#descApiPopup_serverName-list").css("height","auto");
                    $("#descApiPopup_serverName-list").css("overflow","hidden");
                }
            });
            var param = {"isAuth":"yes"};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, descApiPopup_serverName.successFun, null, null, $("#descApiPopup"));
        }
    };
    //状态
    var descApiPopup_state = {
        value:"",
        getInst: function () {
            return $("#descApiPopup_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_state.value = value;
            descApiPopup_state.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopup_state").data("wandaDropDownList").setDataSource(data);
            if(descApiPopup_state.value){
                descApiPopup_state.getInst().value(descApiPopup_state.value);
            }
        },
        init: function () {
            $("#descApiPopup_state").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopup_state.successFun, null, null, $("#descApiPopup"));
        }
    };
    //是否公开
    var descApiPopup_ispublic = {
        value:"",
        getInst: function () {
            return $("#descApiPopup_ispublic").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_ispublic.value = value;
            descApiPopup_ispublic.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopup_ispublic").data("wandaDropDownList").setDataSource(data);
            if(descApiPopup_ispublic.value){
                descApiPopup_ispublic.getInst().value(descApiPopup_ispublic.value);
            }
            if($("#descApiPopup_isAdd").val() != "false"){
                descApiPopup_ispublic.getInst().select(1);
            }
        },
        init: function () {
            $("#descApiPopup_ispublic").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != descApiPopup_ispublic.value){
                        $("#descApiPopup_isAddHis").val("yes");
                    }else{
                        $("#descApiPopup_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "ispublic"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopup_ispublic.successFun, null, null, $("#descApiPopup"));
        }
    };
    // 传输协议
    var descApiPopup_transProto = {
        value:"",
        getInst: function () {
            return $("#descApiPopup_transProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_transProto.value = value;
            descApiPopup_transProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopup_transProto").data("wandaDropDownList").setDataSource(data);
            if(descApiPopup_transProto.value){
                descApiPopup_transProto.getInst().value(descApiPopup_transProto.value);
            }else{
                if($("#descApiPopup_isAdd").val()!="false"){
                    descApiPopup_transProto.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#descApiPopup_transProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != descApiPopup_transProto.value){
                        $("#descApiPopup_isAddHis").val("yes");
                    }else{
                        $("#descApiPopup_isAddHis").val("no");
                    }
                    if("1" == value){
                        descApiPopup_ip.init("HTTP");
                    }else{
                        descApiPopup_ip.init("HTTPS");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopup_transProto.successFun, null, null, $("#descApiPopup"));
        }
    };
    // ip地址获取
    var descApiPopup_ip = {
        successFun: function (data) {
            $("#descApiPopup_ip").val(data["IP"]);
            $("#descApiPopup_port").val(data["PORT"]);
            $("#descApiPopup_apiaddrid").val(data["APIADDRID"]);
        },
        init: function (addrTrans) {
            var param = {"addrTrans": addrTrans};
            common.ajaxGet("api/gateApi/getApiAddr", param, descApiPopup_ip.successFun, null, null, $("#descApiPopup"));
        }
    };
    // Body协议
    var descApiPopup_contentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#descApiPopup_contentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_contentProto.value = value;
            descApiPopup_contentProto.getInst().value(value);
        },
        successFun:function (data) {
            descApiPopup_contentProto.dataSource = data;
            descApiPopup_contentProto.getInst().setDataSource(data);
            if(descApiPopup_contentProto.value){
                descApiPopup_contentProto.getInst().value(descApiPopup_contentProto.value);
            }else{
                if($("#descApiPopup_isAdd").val()!="false"){
                    var composeApiMgr_contentProto = $("#composeApiMgr_contentProto").val();
                    if(composeApiMgr_contentProto == "2" || composeApiMgr_contentProto == "5"){
                        descApiPopup_contentProto.getInst().select(parseInt(composeApiMgr_contentProto)-1);
                        descApiPopup_contentProto.getInst().readonly();
                        descApiPopup_method.getInst().readonly();
                    }else{
                        descApiPopup_contentProto.getInst().select(0);
                        descApiPopup_contentProto.getInst().readonly(false);
                        descApiPopup_method.getInst().readonly(false);
                    }
                }else{
                    descApiPopup_contentProto.getInst().readonly(false);
                    descApiPopup_method.getInst().readonly(false);
                }
            }
        },
        changeDataSource:function (methodValue,flag) {
            if("2" == methodValue){  //post的时候为全部
                descApiPopup_contentProto.getInst().setDataSource(descApiPopup_contentProto.dataSource);
            }else{  //get delet put 除去soap
                var newDataSource = [];
                $.each(descApiPopup_contentProto.dataSource,function (index,value) {
                    if(index!=1&&index!=4){
                        newDataSource.push(value);
                    }
                });
                descApiPopup_contentProto.getInst().setDataSource(newDataSource);
                var contentProto = $("#descApiPopup_contentProto").val();
                if(flag){
                    var inArray = false;
                    for(var i = 0 ; i < newDataSource.length;i++){
                        if(newDataSource[i]["value"] == contentProto){
                            inArray = true;
                        }
                    }
                    if(!inArray){
                        descApiPopup_contentProto.getInst().select(0);
                    }
                }
            }
            descApiPopup_desContentProto.changeDataSource(true);
        },
        changeInPlaceholder:function (value) {
            if("1" == value){
                $("#descApiPopup_inparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
                $("#descApiPopup_outparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
            }else if("2" == value){
                $("#descApiPopup_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n" +
                    "<s11:Body>\n" +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>\n<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>\n </ns1:param>\n " +
                    "</ns1:getSupportCity>\n " +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#descApiPopup_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
                    "<soap:Body>\n" +
                    "<ns2:sayStrResponse xmlns:ns2='ws.wondersgroup.com'>\n" +
                    "<return>\n" +
                    "<Response>\n " +
                    "<MessageHeader> \n" +
                    "<code>0</code>\n " +
                    "<desc>成功</desc>\n " +
                    "</MessageHeader>\n" +
                    " </Response>\n" +
                    "</return>\n" +
                    "</ns2:sayStrResponse>\n" +
                    "</soap:Body>\n" +
                    "</soap:Envelope>");
            }else if("3" == value){
                $("#descApiPopup_inparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
                $("#descApiPopup_outparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
            }else if("4" == value){
                $("#descApiPopup_inparamDemo").attr("placeholder","This is a inParam demo");
                $("#descApiPopup_outparamDemo").attr("placeholder","This is a outParam demo");
            }else if("5" == value){
                $("#descApiPopup_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n " +
                    "<s11:Body>\n " +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt; </ns1:param> \n" +
                    "</ns1:getSupportCity> \n" +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#descApiPopup_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
                    "<soap:Body>\n" +
                    "<ns2:sayStrResponse xmlns:ns2='ws.wondersgroup.com'>\n" +
                    "<return>&lt;Response&gt; &lt;MessageHeader&gt; &lt;code&gt;0&lt;/code&gt; &lt;desc&gt;成功&lt;/desc&gt; &lt;/MessageHeader&gt; &lt;/Response&gt;</return>\n" +
                    "</ns2:sayStrResponse>\n" +
                    "</soap:Body>\n" +
                    "</soap:Envelope>");
            }else if("6" == value){
                $("#descApiPopup_inparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
                $("#descApiPopup_outparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
            }
            if($("#descApiPopup_method").val()=="1"){
                $("#descApiPopup_inparamDemo").attr("placeholder","id=1&name=test");
            }
        },
        init: function () {
            $("#descApiPopup_contentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    descApiPopup_contentProto.changeInPlaceholder(value);
                    if(value != descApiPopup_contentProto.value){
                        $("#descApiPopup_isAddHis").val("yes");
                    }else{
                        $("#descApiPopup_isAddHis").val("no");
                    }
                    descApiPopup_desContentProto.changeDataSource(value,true);
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopup_contentProto.successFun, null, null, $("#descApiPopup"));
        }
    };
    //API方法
    var descApiPopup_method = {
        value:"",
        getInst: function () {
            return $("#descApiPopup_method").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_method.value = value;
            descApiPopup_method.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopup_method").data("wandaDropDownList").setDataSource(data);
            if(descApiPopup_method.value){
                descApiPopup_method.getInst().value(descApiPopup_method.value);
            }
            if($("#descApiPopup_isAdd").val() != "false"){
                descApiPopup_method.getInst().select(1);
            }
        },
        init: function () {
            $("#descApiPopup_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    descApiPopup_contentProto.changeDataSource(value,true);
                    descApiPopup_contentProto.changeInPlaceholder($("#descApiPopup_contentProto").val());
                    if(value != descApiPopup_method.value){
                        $("#descApiPopup_isAddHis").val("yes");
                    }else{
                        $("#descApiPopup_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopup_method.successFun, null, null, $("#descApiPopup"));
        }
    };
    //入参tabstrip
    var descApiPopup_tabstrip = {
        init:function () {
            $("#descApiPopup_inparamDemoContent").unbind("slideToggle");
            $("#descApiPopup_inparamDemoTitle").unbind("click");
            $("#descApiPopup_inparamDemoTitle").click(function () {
                $("#descApiPopup_inparamDemoContent").slideToggle("slow",function () {
                    if($('#descApiPopup_inparamDemoContent').css('display')=="none"){
                        $("#descApiPopup_inparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#descApiPopup_inparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#descApiPopup_outparamDemoContent").unbind("slideToggle");
            $("#descApiPopup_outparamDemoTitle").unbind("click");
            $("#descApiPopup_outparamDemoTitle").click(function () {
                $("#descApiPopup_outparamDemoContent").slideToggle("slow",function () {
                    if($('#descApiPopup_outparamDemoContent').css('display')=="none"){
                        $("#descApiPopup_outparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#descApiPopup_outparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#descApiPopup_descHighParamContent").unbind("slideToggle");
            $("#descApiPopup_descHighParamTitle").unbind("click");
            $("#descApiPopup_descHighParamTitle").click(function () {
                $("#descApiPopup_descHighParamContent").slideToggle("slow",function () {
                    if($('#descHighParamContent').css('display')=="none"){
                        $("#descApiPopup_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#descApiPopup_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });



        }
    };
    //wsdl地址获取
    var descApiPopup_wsdl_EditPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 200,
            maxWidth: "",
            maxHeight: "",
            title: "方法配置",
            content: "biz/test/descApi_wsdl_popup.html"
        },
        getInst: function () {
            if (descApiPopup_wsdl_EditPopupWin.inst) {
                descApiPopup_wsdl_EditPopupWin.inst = new wandaComp.wandaWindow("descApiPopup_wsdlSearch", "descApiPopup_wsdl_test", descApiPopup_wsdl_EditPopupWin.optionObj);
            }
            return descApiPopup_wsdl_EditPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var wsdlPath = $("#descApiPopup_wsdlPath").val();
            if(wsdlPath == ""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请先输入WSDL地址！"
                });
                return false;
            }else if(wsdlPath.indexOf("?wsdl")==-1){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请求地址格式不正确！地址应包含 ?wsdl"
                });
                return false;
            }
        },
        submitBtnCallBack: function (closeFun) {
            var serviceName = $("#descApiPopup_wsdl_test").find("#descApi_wsdl_popup_services").val();
            var bindingName = $("#descApiPopup_wsdl_test").find("#descApi_wsdl_popup_serviceBinds").val();
            var operationName = $("#descApiPopup_wsdl_test").find("#descApi_wsdl_popup_bindOperations").val();
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
                        $("#descApiPopup_services").val(serviceName);
                        $("#descApiPopup_serviceBinds").val(bindingName);
                        $("#descApiPopup_bindOperations").val(operationName);
                        $("#descApiPopup_soapDemo").val(data);
                        var descApiPopup_wsdl_test = $("#descApiPopup_wsdl_test").data("wandaWindow");
                        descApiPopup_wsdl_test.close();
                        descApiPopup_descPathGrid.getInst().setDataSource(null);
                        descApiPopup_descPathGrid.addRow();
                    }
                });
            };
            common.ajaxGet("api/gateApi/createXmlDemo", param, successFun);

        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            descApiPopup_wsdl_EditPopupWin.getInst().init(function () {
                var isOk = descApiPopup_wsdl_EditPopupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = edit_popup.init;
                common.initExeByAttr("descApiPopup_wsdl_test", "opt='submit'", function () {
                    initFun("descApiPopup_wsdl_test");
                });
            });
            descApiPopup_wsdl_EditPopupWin.getInst().callBack("opt='submit'", descApiPopup_wsdl_EditPopupWin.submitBtnCallBack, true);
            descApiPopup_wsdl_EditPopupWin.getInst().callBack("opt='cancel'", descApiPopup_wsdl_EditPopupWin.cancelBtnCallBack);
        }
    };
    //目标API方法
    var descApiPopup_desMethod = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#descApiPopup_desMethod").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_desMethod.value = value;
            descApiPopup_desMethod.getInst().value(value);
        },
        successFun:function (data) {
            descApiPopup_desMethod.dataSource = data;
            descApiPopup_desMethod.getInst().setDataSource(data);
            if(descApiPopup_desMethod.value){
                descApiPopup_desMethod.getInst().value(descApiPopup_desMethod.value);
            }else{
                if($("#descApiPopup_isAdd").val()!="false"){
                    var composeApiMgr_contentProto = $("#composeApiMgr_contentProto").val();
                    if(composeApiMgr_contentProto == "2" || composeApiMgr_contentProto == "5"){
                        descApiPopup_desMethod.getInst().select(1);
                        descApiPopup_desMethod.getInst().readonly();
                    }else{
                        descApiPopup_desMethod.getInst().select(0);
                        descApiPopup_desMethod.getInst().readonly(false);
                    }
                }
            }
        },
        init: function () {
            $("#descApiPopup_desMethod").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    descApiPopup_desContentProto.changeDataSource(true);
                    if(value != descApiPopup_desMethod.value){
                        $("#descApiPopup_isAddHis").val("yes");
                    }else{
                        $("#descApiPopup_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopup_desMethod.successFun, null, null, $("#descApiPopup"));
        }
    };
    //目标API传输协议
    var descApiPopup_desTransProto = {
        value:"",
        getInst: function () {
            return $("#descApiPopup_desTransProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_desTransProto.value = value;
            descApiPopup_desTransProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopup_desTransProto").data("wandaDropDownList").setDataSource(data);
            if(descApiPopup_desTransProto.value){
                descApiPopup_desTransProto.getInst().value(descApiPopup_desTransProto.value);
            }
            if($("#descApiPopup_isAdd").val()!="false"){
                descApiPopup_desTransProto.getInst().select(0);
            }
        },
        init: function () {
            $("#descApiPopup_desTransProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != descApiPopup_desTransProto.value){
                        $("#descApiPopup_isAddHis").val("yes");
                    }else{
                        $("#descApiPopup_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopup_desTransProto.successFun, null, null, $("#descApiPopup"));
        }
    };
    //目标API Body协议
    var descApiPopup_desContentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#descApiPopup_desContentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopup_desContentProto.value = value;
            descApiPopup_desContentProto.getInst().value(value);
            if("2" == value || "5" == value){
                $("#descApiPopup_address_div").show();
                $("#descApiPopup_soap_div").show();
            }else{
                $("#descApiPopup_address_div").hide();
                $("#descApiPopup_soap_div").hide();
            }
        },
        changeDataSource:function (flag) {
            var newDataSource = [],methodDateSource = [];
            var method = $("#descApiPopup_method").val();
            var contentValue = $("#descApiPopup_contentProto").val();
            var desMethodValue = $("#descApiPopup_desMethod").val();
            var desContentProto = $("#descApiPopup_desContentProto").val();
            if("2" == contentValue || "5" == contentValue){  //第一页body协议为soap时，第二页只能为soap
                if("2" == contentValue){
                    newDataSource.push(descApiPopup_desContentProto.dataSource[1]);
                }else{
                    newDataSource.push(descApiPopup_desContentProto.dataSource[4]);
                }
                descApiPopup_desContentProto.getInst().setDataSource(newDataSource);
                descApiPopup_desContentProto.getInst().select(0);

                descApiPopup_desMethod.getInst().setDataSource(descApiPopup_desMethod.dataSource);
                if(flag){
                    descApiPopup_desMethod.getInst().select(1);
                }
                descApiPopup_desMethod.getInst().readonly();
            }else if("4" == contentValue){  //第一页body协议为text时，第二页只能为text
                if("1" == method){   //如果第一页为请求方法是get，第二页只能是get
                    methodDateSource.push(descApiPopup_desMethod.dataSource[0]);
                }else{
                    $.each(descApiPopup_desMethod.dataSource,function (index,value) {
                        if(index!=0){
                            methodDateSource.push(value);
                        }
                    });
                }
                descApiPopup_desMethod.getInst().setDataSource(methodDateSource);
                descApiPopup_desMethod.getInst().select(0);
                descApiPopup_desMethod.getInst().readonly(false);

                newDataSource.push(descApiPopup_desContentProto.dataSource[3]);
                descApiPopup_desContentProto.getInst().setDataSource(newDataSource);
                descApiPopup_desContentProto.getInst().select(0);

            }else{   //其他情况，取决于第二页请求方法
                if("2" == desMethodValue){//目标post的时候没有 text
                    $.each(descApiPopup_desContentProto.dataSource, function (index, value) {
                        if(index!=3){
                            newDataSource.push(value);
                        }
                    });
                }else{  //目标非post的时候  没有soap和text
                    newDataSource.push(descApiPopup_desContentProto.dataSource[0]);
                    newDataSource.push(descApiPopup_desContentProto.dataSource[2]);
                    newDataSource.push(descApiPopup_desContentProto.dataSource[5]);
                }
                descApiPopup_desContentProto.getInst().setDataSource(newDataSource);

                descApiPopup_desMethod.getInst().setDataSource(descApiPopup_desMethod.dataSource);
                descApiPopup_desMethod.getInst().readonly(false);
                if(flag){
                    var inArray = false;
                    for(var i = 0 ; i < newDataSource.length;i++){
                        if(newDataSource[i]["value"] == desContentProto){
                            inArray = true;
                        }
                    }
                    if(desContentProto == "2"){
                        descApiPopup_desMethod.getInst().readonly();
                    }
                    if(!inArray){
                        descApiPopup_desContentProto.getInst().select(0);
                    }
                }
            }
        },
        successFun:function (data) {
            descApiPopup_desContentProto.dataSource = data;
            descApiPopup_desContentProto.getInst().setDataSource(data);
            if(descApiPopup_desTransProto.value){
                descApiPopup_desContentProto.getInst().value(descApiPopup_desContentProto.value);
            }
            if($("#descApiPopup_isAdd").val()!="false"){
                var composeApiMgr_contentProto = $("#composeApiMgr_contentProto").val();
                if(composeApiMgr_contentProto == "2" || composeApiMgr_contentProto == "5"){
                    descApiPopup_desContentProto.getInst().select(parseInt(composeApiMgr_contentProto)-1);
                    descApiPopup_desContentProto.getInst().readonly();
                }else{
                    descApiPopup_desContentProto.getInst().select(0);
                    descApiPopup_desContentProto.getInst().readonly(false);
                    descApiPopup_desContentProto.changeDataSource();
                }
            }
        },
        init: function () {
            $("#descApiPopup_desContentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != descApiPopup_desContentProto.value){
                        $("#descApiPopup_isAddHis").val("yes");
                    }else{
                        $("#descApiPopup_isAddHis").val("no");
                    }
                    if("2" == value || "5" == value){
                        descApiPopup_desMethod.setValue("2");
                        descApiPopup_desMethod.getInst().readonly();
                        $("#descApiPopup_address_div").show();
                        if($("#descApiPopup_isAdd").val() == "false"){
                            $("#descApiPopup_soap_div").show();
                        }else{
                            $("#descApiPopup_soap_div").hide();
                        }
                    }else{
                        descApiPopup_desMethod.getInst().readonly(false);
                        $("#descApiPopup_address_div").hide();
                        $("#descApiPopup_soap_div").hide();
                    }
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopup_desContentProto.successFun, null, null, $("#descApiPopup"));
        }
    };
    //目标地址
    var descApiPopup_descPathGrid = {
        gridColums:[
            {field: "ADDR_ID", hidden: true,width:"0px"},
            {field: "API_ID", hidden: true,width:"0px"},
            {
                field: "IP",
                title: "<em class='color_red'>*</em>IP地址",
                width: "220px"
            },
            {
                field: "PORT",
                title: "<em class='color_red'>*</em>端口",
                width: "100px"
            },
            {
                field: "URI_PATH",
                title: "<em class='color_red'>*</em>访问地址"
            },
            {
                command: [{
                    className: "info",
                    name: "delete",
                    text: "<i class=\"fa fa-trash-o fa_icon\" title='删除'></i>",
                    imageClass: "",
                    iconClass: "",
                    click:function (e) {
                        e.stopPropagation();
                        $("#descApiPopup_isAddHis").val("yes");
                    }
                }], title: "操作", width: "100px"
            }
        ],
        init:function () {
            descApiPopup_descPathGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descApiPopup_descPathGrid.inst) {
                descApiPopup_descPathGrid.inst = new wandaComp.wandaGrid("descApiPopup_descPathGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return descApiPopup_descPathGrid.inst;
        },
        isEditable:function (data) {
            var editArry = [];
            var dataView = data["dataView"];
            var ip="",port="";
            if (dataView && dataView.length > 0) {
                ip = dataView[0]["IP"];
                port = dataView[0]["PORT"];
            }
            editArry[0] = {
                "name":"IP",
                "type":"text",
                "readonly":false
            }
            editArry[1] = {
                "name":"PORT",
                "type":"text",
                "readonly":false
            }
            editArry[2] = {
                "name":"URI_PATH",
                "type":"text",
                "readonly":false,
            }
            if(($("#descApiPopup_desContentProto").val()=="2" || $("#descApiPopup_desContentProto").val()=="5") && $("#descApiPopup_wsdlPath").val()!=""){
                var str = $("#descApiPopup_wsdlPath").val();
                var convertStr = str.match(/([^\/]*\/){3}([^?]*)/)[2];
                var tempAttr = str.split(":");
                if(tempAttr && tempAttr.length>1){
                    var tempAttr1 = tempAttr[1];
                    var tempAttr2 = tempAttr[2];
                    if(tempAttr1!=null&&tempAttr1.length>0){
                        var tempIp = tempAttr1.substring(2,tempAttr1.length);
                        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                        if(reg.test(tempIp)){
                            editArry[0]["value"] = tempIp;
                        }
                    }
                    if(tempAttr2!=null && tempAttr2.length>0){
                        var tempPort = tempAttr2.substring(0,tempAttr2.indexOf("/"));
                        var reg2 = /^\d{2,}$/;
                        if(reg2.test(tempPort)){
                            editArry[1]["value"] = tempPort;
                        }
                    }
                }
                editArry[2]["value"] = "/"+convertStr;
                editArry[2]["readonly"] = true;
                editArry[2]["focus"] = true;
            }else{
                editArry[0]["value"] = ip;
                editArry[1]["value"] = port;
            }
            return editArry;
        },
        getDataSource: function (number) {
            if (number) {
                return descApiPopup_descPathGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiPopup_descPathGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var dataView = descApiPopup_descPathGrid.getDataSource()["_data"];
            descApiPopup_descPathGrid.getInst().saveAll();
            for(var i=0;i<dataView.length;i++){
                var url_path = dataView[i]["URI_PATH"];
                var reg = /^(?=[A-Za-z0-9/.\-_]*[A-Za-z][A-Za-z0-9/.\-_]*)[A-Za-z0-9/.\-_]{1,}$/;
                if(!reg.test(url_path)){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "访问地址只能由数字、字母及字符(/-_.)组成，字母至少出现一次！"
                    });
                    return false;
                }
            }
            descApiPopup_descPathGrid.getInst().addRow();
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiPopup_descPathGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "ADDR_ID": dataArry[i]["ADDR_ID"],
                    "descApiPopup_ID": dataArry[i]["descApiPopup_ID"],
                    "IP": dataArry[i]["IP"],
                    "PORT": dataArry[i]["PORT"],
                    "URI_PATH": dataArry[i]["URI_PATH"]
                });
            }
        }
    };
    //新增目标地址
    var descApiPopup_descPathGrid_dataAdd = {
        init: function () {
            $("#descApiPopup_descPathGrid_dataAdd").unbind("click");
            $("#descApiPopup_descPathGrid_dataAdd").click(function () {
                descApiPopup_descPathGrid.addRow();
            })
        }
    };
   //获取对象个数
    var objSize = function (datas) {
        var count = 0;
        for(var i in datas){
            count ++;
        }
        return count;
    };
    //封装参数
    var getFormValue = function () {
        var descApiPopup_inparam = {},gateDesaddr = [],gateFilterApi = {},protocolConvert = {},requestParamConvert = {},
            responseConvert = {},wsdl = {},responseNodeRemove = "",delPath = [];
        var isAdd = $("#descApiPopup_isAdd").val();
        var descApiPopup_isAddHis = $("#descApiPopup_isAddHis").val();
        var descApiPopup_apiId = $("#descApiPopup_apiId").val();
        var descApiPopup_serverName = $("#descApiPopup_serverName").val();
        var descApiPopup_name = $("#descApiPopup_name").val();
        var descApiPopup_state = $("#descApiPopup_state").val();
        var descApiPopup_desc = $("#descApiPopup_desc").val();
        var descApiPopup_path = $("#descApiPopup_path").val();
        var descApiPopup_transProto = $("#descApiPopup_transProto").val();
        var descApiPopup_contentProto = $("#descApiPopup_contentProto").val();
        var descApiPopup_method = $("#descApiPopup_method").val();
        var descApiPopup_waitTimeLimit = $("#descApiRongduanSetting_waitTimeLimit").val();
        var descApiPopup_concurrencyLimit = $("#descApiRongduanSetting_concurrencyLimit").val();
        var descApiPopup_inparamDemo = $("#descApiPopup_inparamDemo").val();
        var descApiPopup_inparamDemo1 = $("#descApiPopup_inparamDemo1").val();
        var descApiPopup_inparamDemo2 = $("#descApiPopup_inparamDemo2").val();
        var descApiPopup_outparamDemo = $("#descApiPopup_outparamDemo").val();
        var descApiPopup_desTransProto = $("#descApiPopup_desTransProto").val();
        var descApiPopup_desContentProto = $("#descApiPopup_desContentProto").val();
        var descApiPopup_desMethod = $("#descApiPopup_desMethod").val();
        var descApiPopup_loadBalance = $("#descApiPopup_loadBalance").val();
        var descApiPopup_wsdlPath = $("#descApiPopup_wsdlPath").val();
        var descApiPopup_services = $("#descApiPopup_services").val();
        var descApiPopup_serviceBinds = $("#descApiPopup_serviceBinds").val();
        var descApiPopup_bindOperations = $("#descApiPopup_bindOperations").val();
        var descApiPopup_apiaddrid = $("#descApiPopup_apiaddrid").val();
        var descApiPopup_ispublic = $("#descApiPopup_ispublic").val();
        descApiPopup_inparam["Body"] = descApiPopup_inparamDemo;

        if(descApiPopup_path.charAt(0)!="/")
            descApiPopup_path = "/"+descApiPopup_path;

        /***************    SOAP时校验是否填写wsdl地址 *******************/
        if(descApiPopup_desContentProto == "2" || descApiPopup_desContentProto == "5"){
            if(descApiPopup_wsdlPath==""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入WSDL地址进行测试！"
                });
                return false;
            }else if(descApiPopup_services== "" ||descApiPopup_serviceBinds=="" ||descApiPopup_bindOperations==""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入正确的WSDL地址！"
                });
                return false;
            }else{
                gateFilterApi["wsdlPath"] = descApiPopup_wsdlPath;
                var obj = edit_popup.api_wsdlSearch.bindAndOperations[descApiPopup_serviceBinds];
                var portTypeName = "";
                if(obj){
                    portTypeName = obj["portPortType"];
                }else{
                    portTypeName = edit_popup.api_wsdlSearch.portPortType;
                }
                wsdl = {
                    "port": portTypeName,
                    "op": descApiPopup_bindOperations,
                    "bind": descApiPopup_serviceBinds,
                    "service":descApiPopup_services,
                    "soapDemo":$("#descApiPopup_soapDemo").val()
                }
                gateFilterApi["wsdl"] = JSON.stringify(wsdl);
            }
        }

        /*****************    目标地址校验    **********************/
        descApiPopup_descPathGrid.getInst().saveAll();
        var descPathData = descApiPopup_descPathGrid.getDataSource()["_data"];
        if(descPathData.length > 0){
            for(var i=0;i<descPathData.length;i++){
                if(descPathData[i]["IP"]==""||descPathData[i]["PORT"]==""||descPathData[i]["URI_PATH"]==""){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成目标地址配置！"
                    });
                    return false;
                }else{
                    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                    if (!reg.test(descPathData[i]["IP"])) {
                        common.jqConfirm.alert({
                            title: 0,
                            content: "IP地址格式不正确！"
                        });
                        return false;
                    }
                    var reg = /^[0-9]*$/;
                    if(!reg.test(descPathData[i]["PORT"])){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "端口只能为数字！"
                        });
                        return false;
                    }
                    var reg = /^(?=[A-Za-z0-9/.\-_]*[A-Za-z][A-Za-z0-9/.\-_]*)[A-Za-z0-9/.\-_]{1,}$/;
                    if(!reg.test(descPathData[i]["URI_PATH"])){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "访问地址只能由数字、字母及字符(/-_.)组成，字母至少出现一次！"
                        });
                        return false;
                    }
                }
                var urlPathTemp = descPathData[i]["URI_PATH"];
                gateDesaddr[i] = {};
                gateDesaddr[i]["ip"] = descPathData[i]["IP"];
                gateDesaddr[i]["port"] = descPathData[i]["PORT"];
                if(urlPathTemp.charAt(0)!="/"){
                    urlPathTemp = "/"+urlPathTemp;
                }
                gateDesaddr[i]["uriPath"] = urlPathTemp;
                if(isAdd == "false"){
                    if(descPathData[i]["descApiPopup_ID"]){
                        gateDesaddr[i]["apiId"] = descPathData[i]["descApiPopup_ID"]+"";
                        gateDesaddr[i]["addrId"] = descPathData[i]["ADDR_ID"]+"";
                    }
                }
            }
        }else{
            common.jqConfirm.alert({
                title: 0,
                content: "请完成目标地址配置！"
            });
            return false;
        }

        /***************** 入参转换校验 ***************************/
        var reqourceData = $("#descApiPopup_requestParamConvert").val();
        if(reqourceData && reqourceData != ""){
            gateFilterApi["requestParamConvert"] = reqourceData;
        }else{
            var inConstConvertData = [],sourcePathConvert = [],inConstDataSource = null;
            var inparamDataSource = null,inparamConvertData = [];
            inParam_popup.inConst.getInst().saveAll();
            inParam_popup.inParam.getInst().saveAll();
            try{
                inConstDataSource = inParam_popup.inConst.getDataSource();
                if(inConstDataSource){
                    inConstConvertData = inParam_popup.inConst.getDataSource()["_data"];
                }
                inparamDataSource = inParam_popup.inParam.getDataSource();
                if(inparamDataSource){
                    inparamConvertData = inParam_popup.inParam.getDataSource()["_data"];
                }
            }catch(e){
                            }
            requestParamConvert["addPath"] = [];
            for(var i = 0;i<inConstConvertData.length;i++) {
                if (inConstConvertData[i]["path"] == "" || inConstConvertData[i]["value"] == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成入参常量转换配置！"
                    });
                    return false;
                }
                if(inConstConvertData[i]["type"] == "number"){
                    if(!Number(inConstConvertData[i]["value"])){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "常量转换的第"+(i+1)+"行的值不是number类型"
                        });
                        return false;
                    }
                }
                requestParamConvert["addPath"].push({
                    "path":inConstConvertData[i]["path"],
                    "value":inConstConvertData[i]["value"],
                    "type":inConstConvertData[i]["type"]
                });
            }

            requestParamConvert["pathConvert"] = [];
            for(var i = 0;i<inparamConvertData.length;i++) {
                if (inparamConvertData[i]["srcPath"] == "" || inparamConvertData[i]["desPath"] == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成入参参数转换配置！"
                    });
                    return false;
                }
                requestParamConvert["pathConvert"].push({
                    "srcPath":inparamConvertData[i]["srcPath"],
                    "desPath":inparamConvertData[i]["desPath"]
                });
            }
            requestParamConvert["processModel"] = $('input[name="descApiInparamSetting_inParamType"]:checked ').val();

            gateFilterApi["requestParamConvert"] = JSON.stringify(requestParamConvert);
        }

        /******************   出参转换校验    **********************/
        var repSourceData = $("#descApiPopup_responseParamConvert").val();
        if(repSourceData && repSourceData != ""){
            gateFilterApi["responseConvert"] = repSourceData;
        }else{
            outParam_popup.outParam.getInst().saveAll();
            var outparamDataSource = null,outparamConvertData = [];
            try {
                var outparamDataSource = outParam_popup.outParam.getDataSource();
                if(outparamDataSource){
                    outparamConvertData = outParam_popup.outParam.getDataSource()["_data"];
                }
            }catch(e){
            }
            responseConvert["pathConvert"] = [];
            for(var i = 0;i<outparamConvertData.length;i++) {
                if (outparamConvertData[i]["srcPath"] == "" || outparamConvertData[i]["desPath"] == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请完成出参参数转换配置！"
                    });
                    return false;
                }
                responseConvert["pathConvert"].push({
                    "srcPath":outparamConvertData[i]["srcPath"],
                    "desPath":outparamConvertData[i]["desPath"]
                });
            }
            //本次改造新增  字段过滤
            $("#descApiOutparamSetting_outParamFilterGrid").find("td").find("input").each(function (index) {
                if($(this).val()!=undefined && $(this).val().trim()!=""){
                    delPath.push($(this).val().trim());
                }
            });
            responseConvert["delPath"] = delPath;
            gateFilterApi["responseConvert"]= JSON.stringify(responseConvert);
        }
        /****************   负载过滤器   **********************/
        var loadBalance = {"loadMethod":"2"};
        gateFilterApi["loadBalance"] = JSON.stringify(loadBalance); //负载过滤器

        /****************** 超时过滤器    ***************************/
        if($("#descApiPopup_waitTimeLimit").val() == ""){
            if("" == descApiPopup_waitTimeLimit){
                descApiPopup_waitTimeLimit = "180";
            }
        }else{
            descApiPopup_waitTimeLimit = $("#descApiPopup_waitTimeLimit").val();
        }
        var waitTimeLimit = {"maxNumber":descApiPopup_waitTimeLimit};
        gateFilterApi["waitTimeLimit"] = JSON.stringify(waitTimeLimit); //超时过滤器

        /******************* 并发过滤器   ****************************/
        if($("#descApiPopup_concurrencyLimit").val() == ""){
            if("" == descApiPopup_concurrencyLimit){
                descApiPopup_concurrencyLimit = "100";
            }
        }else{
            descApiPopup_concurrencyLimit = $("#descApiPopup_concurrencyLimit").val();
        }
        var concurrencyLimit = {"maxNumber":descApiPopup_concurrencyLimit};
        gateFilterApi["concurrencyLimit"] = JSON.stringify(concurrencyLimit);  //并发过滤器

        /******************  协议转换过滤器  ******************************/
        protocolConvert["srcProtocol"] = {
            "trans": descApiPopup_transProto,
            "content": descApiPopup_contentProto,
            "method": descApiPopup_method
        }
        protocolConvert["desProtocol"] = {
            "trans": descApiPopup_desTransProto,
            "content": descApiPopup_desContentProto,
            "method": descApiPopup_desMethod
        }
        gateFilterApi["protocolConvert"] = JSON.stringify(protocolConvert);

        /***********************    自定义插件   *************************/
        var APIMgr_extendFilter = $("#descApiPopup_extendFilter").val();
        if(APIMgr_extendFilter && APIMgr_extendFilter != ""){
            gateFilterApi["extendFilter"] = APIMgr_extendFilter;
        }else{
            //自定义过滤器
            var customfilters = [];
            var customfiltersTemp = null;
            custom_popup.inConst.getInst().saveAll();
            try{
                customfiltersTemp = custom_popup.inConst.getDataSource();
                if(customfiltersTemp){
                    customfilters = custom_popup.inConst.getDataSource()["_data"];
                }
            }catch(e) {
            }
            //装载值
            var extendFilter = [];
            var json_str = {};
            if(customfilters.length > 0){
                for(var i=0;i<customfilters.length;i++){
                    var extendFilter_temp = {
                        "filterClass":customfilters[i]["filterClass"],
                        "filterId":customfilters[i]["filterId"],
                        "filterOrder":customfilters[i]["filterOrder"],
                        "filterPos":customfilters[i]["filterPos"],
                        "value":customfilters[i]["filterValue"] == undefined?"":customfilters[i]["filterValue"]
                    };
                    json_str[customfilters[i]["filterId"]] = "remove repetition";
                    extendFilter.push(extendFilter_temp);
                }
            }
            if(objSize(json_str) != extendFilter.length){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请完成扩展插件配置！"
                });
                return false;
            }
            gateFilterApi["extendFilter"] = JSON.stringify(extendFilter);
        }

        /********************* 传值  *************************/
        var param = {
            "gateApi":{
                "serviceId":descApiPopup_serverName,
                "apiName":descApiPopup_name,
                "apiDesc":descApiPopup_desc,
                "apiPath":descApiPopup_path,
                "apiTransProto":descApiPopup_transProto,
                "apiContentProto":descApiPopup_contentProto,
                "apiMethod":descApiPopup_method,
                "apiInparamDemo":descApiPopup_inparamDemo,
                "apiOutparamDemo":descApiPopup_outparamDemo,
                "desTransProto":descApiPopup_desTransProto,
                "desContentProto":descApiPopup_desContentProto,
                "desMethod":descApiPopup_desMethod,
                "desInparamDemo":"",
                "desOutparamDemo":"",
                "apiAddrId":descApiPopup_apiaddrid,
                "isPublic":"0",
                "isRawApi":"1" //1：普通api；2：组合api
            },
            "gateFilterApi":gateFilterApi,
            "gateDesaddr":gateDesaddr
        }
        if(isAdd == "false"){ //修改时是否新增历史
            param["gateApi"]["apiId"] = descApiPopup_apiId;
            param["gateApi"]["state"] = descApiPopup_state;
            param["isAddHis"] = "yes";
            if(descApiPopup_isAddHis != "yes"){
                param["isAddHis"] = "no";
            }
        }
        return param;
    };
    //下一步
    var descApiPopup_nextBtn = {
        init:function () {
            $("#descApiPopup_nextBtn").unbind("click");
            $("#descApiPopup_nextBtn").click(function () {
                var descApiPopup_serverName = $("#descApiPopup_serverName").val();
                var descApiPopup_name = $("#descApiPopup_name").val();
                var descApiPopup_path = $("#descApiPopup_path").val();
                var descApiPopup_contentProto = $("#descApiPopup_contentProto").val();
                var descApiPopup_desContentProto = $("#descApiPopup_desContentProto").val();

                if(descApiPopup_contentProto == "4"){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "Body协议不能为TEXT，请重新选择！"
                    });
                    return false;
                }
                if ("" == descApiPopup_serverName && descApiPopup_serverName.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择应用名称！"
                    });
                    $("#descApiPopup_serverName").focus();
                    return false;
                }
                if(descApiPopup_validate.helper.validate()){
                    threePageShow();

                    if (descApiPopup_contentProto != "2" && descApiPopup_contentProto != "5" &&
                        descApiPopup_desContentProto != "2" && descApiPopup_desContentProto != "5") {
                        $("#descApiPopup_address_div").hide();
                        $("#descApiPopup_soap_div").hide();
                    } else {
                        $("#descApiPopup_address_div").show();
                        $("#descApiPopup_soap_div").show();
                    }
                }
            });
        }
    }
    //上一步
    var descApiPopup_preBtn = {
        init: function () {
            $("#descApiPopup_preBtn").unbind("click");
            $("#descApiPopup_preBtn").click(function () {
                secondPageShow();
            })
        }
    };

    //第一页展示
    var firstPageShow = function () {
        $("#descApiPopup_chonse_content").show();
        $("#descApiPopup_choose_saveButton").show();
        descApiPopup_choose_type.getInst().select(0);
        descApiPopup_choose_type.getInst().trigger("change");

        $("#descApiPopup_baseInfoTitle").hide();
        $("#descApiPopup_baseInfoContent").hide();
        $("#descApiPopup_requestTitle").hide();
        $("#descApiPopup_requestContent1").hide();
        $("#descApiPopup_requestContent2").hide();
        $("#descApiPopup_nextButton").hide();

        $("#descApiPopup_descRequestTitle").hide();
        $("#descApiPopup_descRequestContent").hide();
        $("#descApiPopup_descPathTitle").hide();
        $("#descApiPopup_descPathContent").hide();
        $("#descApiPopup_descHighParamTitle").hide();//本次改造新增
        $("#descApiPopup_descHighParamContent").hide();
        $("#descApiPopup_saveButton").hide();
        $("#descApiPopup_descApiPopup_soap_div").hide();
    }
    //第二页展示
    var secondPageShow = function () {
        $("#descApiPopup_chonse_content").hide();
        $("#descApiPopup_choose_saveButton").hide();

        $("#descApiPopup_baseInfoTitle").show();
        $("#descApiPopup_baseInfoContent").show();
        $("#descApiPopup_requestTitle").show();
        $("#descApiPopup_requestContent1").show();
        $("#descApiPopup_requestContent2").show();
        $("#descApiPopup_nextButton").show();

        $("#descApiPopup_descRequestTitle").hide();
        $("#descApiPopup_descRequestContent").hide();
        $("#descApiPopup_descPathTitle").hide();
        $("#descApiPopup_descPathContent").hide();
        $("#descApiPopup_descHighParamTitle").hide();//本次改造新增
        $("#descApiPopup_descHighParamContent").hide();
        $("#descApiPopup_saveButton").hide();
        $("#descApiPopup_descApiPopup_soap_div").hide();
    }
    //第三页展示
    var threePageShow = function () {
        $("#descApiPopup_chonse_content").hide();
        $("#descApiPopup_choose_saveButton").hide();

        $("#descApiPopup_baseInfoTitle").hide();
        $("#descApiPopup_baseInfoContent").hide();
        $("#descApiPopup_requestTitle").hide();
        $("#descApiPopup_requestContent1").hide();
        $("#descApiPopup_requestContent2").hide();
        $("#descApiPopup_nextButton").hide();

        $("#descApiPopup_descRequestTitle").show();
        $("#descApiPopup_descRequestContent").show();
        $("#descApiPopup_descHighParamTitle").show();//本次改造新增
        $("#descApiPopup_descHighParamContent").show();
        $("#descApiPopup_descPathTitle").show();
        $("#descApiPopup_descPathContent").show();
        $("#descApiPopup_saveButton").show();
    }

    // 选择页面 去掉按钮
    var descApiPopup_choose_closeBtn = {
        init:function () {
            $("#descApiPopup_choose_closeBtn").unbind("click");
            $("#descApiPopup_choose_closeBtn").click(function () {
                clearData();
                $("#descApiPopup_closeBtn1").trigger("afterClick");
            })
        }
    }
    
    //选择页面 确定按钮
    var descApiPopup_choose_saveCloseBtn = {
        init:function () {
            $("#descApiPopup_choose_saveCloseBtn").unbind("click");
            $("#descApiPopup_choose_saveCloseBtn").click(function () {
                var descApiPopup_type = $("#descApiPopup_choose_type").val();
                var descApiPopup_apiList = $("#descApiPopup_choose_name").val();
                var descApiPopup_serverName = $("#descApiPopup_choose_serverName").val();
                initParam();
                if("1" == descApiPopup_type){
                    if(descApiPopup_serverName == ""){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请选择应用名称！"
                        });
                        return false;
                    }
                    if(descApiPopup_apiList == ""){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请选择API名称！"
                        });
                        return false;
                    }
                    $("#descApiPopup_nextBtn").hide();
                    $("#descApiPopup_confirmBtn").show();
                    $("#descApiPopup_state_div").show();

                    var operatorId = $("#descApiPopup_operatorId").val();
                    $("#descApiPopup_apiId").val(descApiPopup_apiList);
                    $("#descApiPopup_isAdd").val("false");
                    descApiPopupDetail.init(descApiPopup_apiList);
                }else{
                    $("#descApiPopup_state_div").hide();
                    $("#descApiPopup_isAdd").val("true");
                    $("#descApiPopup_nextBtn").show();
                    $("#descApiPopup_confirmBtn").hide();
                    removeOnly();
                }
                secondPageShow();
                var dialog = $("#composeApiMgr_descApiSetting_popup").data("wandaWindow");
                dialog.center();
            })
        }
    }
    //保存按钮
    var descApiPopup_saveCloseBtn = {
        init:function () {
            $("#descApiPopup_saveCloseBtn").unbind("click");
            $("#descApiPopup_saveCloseBtn").click(function () {
                var _param = getFormValue();
                if(_param){
                    var isAdd = $("#descApiPopup_isAdd").val();
                    if(isAdd == "false"){
                        common.ajaxPut("api/gateApi/updatePublishApi", _param, function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    $("#descApiPopup_saveCloseBtn").attr("data",$("#descApiPopup_name").val());
                                    var operatorId = $("#descApiPopup_operatorId").val();
                                    var apiData = {};
                                    apiData["apiGuid"] = data["apiGuid"];
                                    apiData["apiId"] = data["apiId"];
                                    apiData["serverId"] = $("#descApiPopup_serverName").val();
                                    apiData["contProto"] = data["apiContentProto"];
                                    $("#"+operatorId).attr("data",JSON.stringify(apiData));
                                    clearData();
                                    $("#descApiPopup_saveCloseBtn").trigger("afterClick");
                                }
                            });
                        }, null, null, $("#descApiPopup"));
                    }else{
                        common.ajaxPost("api/gateApi/addPublishApi", _param, function (data) {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    $("#descApiPopup_saveCloseBtn").attr("data",$("#descApiPopup_name").val());
                                    var operatorId = $("#descApiPopup_operatorId").val();
                                    var apiData = {};
                                        apiData["apiGuid"] = data["apiGuid"];
                                        apiData["apiId"] = data["apiId"];
                                        apiData["serverId"] = $("#descApiPopup_serverName").val();
                                        apiData["contProto"] = data["apiContentProto"];
                                    $("#"+operatorId).attr("data",JSON.stringify(apiData));
                                    clearData();
                                    $("#descApiPopup_saveCloseBtn").trigger("afterClick");
                                }
                            });
                        }, null, null, $("#descApiPopup"));
                    }
                }
            });
        }
    };
    //取消按钮
    var descApiPopup_closeBtn = {
        init:function () {
            $("#descApiPopup_closeBtn1").unbind("click");
            $("#descApiPopup_closeBtn1").click(function () {
                clearData();
                $("#descApiPopup_closeBtn1").trigger("afterClick");
            })
        }
    };
    // 选择API时候的确定按钮
    var descApiPopup_confirmBtn = {
        init:function () {
            $("#descApiPopup_confirmBtn").unbind("click");
            $("#descApiPopup_confirmBtn").click(function () {
               var descApiPopup_contentProto = $("#descApiPopup_contentProto").val();
                var composeApiMgr_contentProto = $("#composeApiMgr_contentProto").val();
                if(descApiPopup_contentProto == "4"){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "Body协议不能为TEXT，请重新选择！"
                    });
                    return false;
                }
                if(composeApiMgr_contentProto == "2"){
                    if(descApiPopup_contentProto != "2"){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "Body协议只能为SOAP，请重新选择！"
                        });
                        return false;
                    }
                }
                if(composeApiMgr_contentProto == "5"){
                    if(descApiPopup_contentProto != "5"){
                        common.jqConfirm.alert({
                            title: 0,
                            content: "Body协议只能为SOAP_TEXT，请重新选择！"
                        });
                        return false;
                    }
                }
                $("#descApiPopup_saveCloseBtn").attr("data",$("#descApiPopup_name").val());
                var operatorId = $("#descApiPopup_operatorId").val();
                var apiData = {};
                apiData["apiGuid"] = $("#descApiPopup_apiGuid").val();
                apiData["apiId"] = $("#descApiPopup_apiId").val();
                apiData["serverId"] = $("#descApiPopup_serverName").val();
                apiData["contProto"] = $("#descApiPopup_contentProto").val();
                $("#"+operatorId).attr("data",JSON.stringify(apiData));
                clearData();
                $("#descApiPopup_saveCloseBtn").trigger("afterClick");
            })
        }
    }
    //修改获取API数据详情
    var descApiPopupDetail = {
        init: function (apiId) {
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                var gateFilterApi = data["gateFilterApi"];
                var gateDesaddr = data["gateDesaddr"];
                if(gateApi){//基本信息
                    $("#descApiPopup_apiGuid").val(gateApi["API_GUID"]);
                    $("#descApiPopup_name").val(gateApi["API_NAME"]);
                    $("#descApiPopup_desc").val(gateApi["API_DESC"]);
                    $("#descApiPopup_path").val(gateApi["API_PATH"]);
                    $("#descApiPopup_outparamDemo").val(gateApi["API_OUTPARAM_DEMO"]);
                    $("#descApiPopup_ip").val(gateApi["IP"]);
                    $("#descApiPopup_port").val(gateApi["PORT"]);
                    $("#descApiPopup_apiaddrid").val(gateApi["API_ADDR_ID"]);
                    descApiPopup_serverName.setValue(gateApi["SERVICE_ID"]);
                    descApiPopup_serverName.getInst().readonly();
                    descApiPopup_state.setValue(gateApi["STATE"]);
                    $("#descApiPopup_method").val(gateApi["API_METHOD"]);
                    $("#descApiPopup_contentProto").val(gateApi["API_CONTENT_PROTO"]);
                    $("#descApiPopup_desMethod").val(gateApi["DES_METHOD"]);
                    $("#descApiPopup_desContentProto").val(gateApi["DES_CONTENT_PROTO"]);

                    descApiPopup_contentProto.changeDataSource(gateApi["API_METHOD"],false);
                    descApiPopup_desContentProto.changeDataSource(false);
                    descApiPopup_contentProto.changeInPlaceholder(gateApi["API_CONTENT_PROTO"]);

                    descApiPopup_method.setValue(gateApi["API_METHOD"]);
                    descApiPopup_transProto.setValue(gateApi["API_TRANS_PROTO"]);
                    descApiPopup_contentProto.setValue(gateApi["API_CONTENT_PROTO"]);
                    descApiPopup_desTransProto.setValue(gateApi["DES_TRANS_PROTO"]);
                    descApiPopup_desMethod.setValue(gateApi["DES_METHOD"]);
                    descApiPopup_desContentProto.setValue(gateApi["DES_CONTENT_PROTO"]);
                    descApiPopup_ispublic.setValue(gateApi["ISPUBLIC"]);

                    if(gateApi["API_INPARAM_DEMO"]){
                        try {
                            var inparamJson = JSON.parse(gateApi["API_INPARAM_DEMO"]);
                            if(inparamJson["Body"] == undefined){
                                $("#descApiPopup_inparamDemo").val(gateApi["API_INPARAM_DEMO"])
                            }else{
                                $("#descApiPopup_inparamDemo").val(inparamJson["Body"]);
                            }
                        }catch(e) {
                            $("#descApiPopup_inparamDemo").val(gateApi["API_INPARAM_DEMO"]);
                        }
                    }
                }
                if(gateDesaddr && gateDesaddr.length>0){//目标地址
                    descApiPopup_descPathGrid.getInst().setDataSource(null);
                    descApiPopup_descPathGrid.addDataSource(gateDesaddr);
                }
                if(gateFilterApi && gateFilterApi.length>0){ //过滤器
                    for(var i=0;i<gateFilterApi.length;i++){
                        var obj = gateFilterApi[i];
                        if("concurrencyLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#descApiPopup_concurrencyLimit").val(maxNumber);
                        }else if("waitTimeLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#descApiPopup_waitTimeLimit").val(maxNumber);
                        }else if("loadBalance" == obj["FILTER_TYPE"]){
                            var loadMethod = JSON.parse(obj["FILTER_VALUE"])["loadMethod"];
                        }else if("requestParamConvert" == obj["FILTER_TYPE"]){
                            $("#descApiPopup_requestParamConvert").val(obj["FILTER_VALUE"]);
                            $('input[name="descApiPopup_inParamType"][value='+JSON.parse(obj["FILTER_VALUE"])["processModel"]+']').prop("checked", "checked");
                        }else if("wsdlPath" == obj["FILTER_TYPE"]){
                            $("#descApiPopup_wsdlPath").val(obj["FILTER_VALUE"]);
                        }else if("wsdl" == obj["FILTER_TYPE"]){
                            var value = JSON.parse(obj["FILTER_VALUE"]);
                            $("#descApiPopup_services").val(value["service"]);
                            $("#descApiPopup_serviceBinds").val(value["bind"]);
                            $("#descApiPopup_bindOperations").val(value["op"]);
                            $("#descApiPopup_soapDemo").val(value["soapDemo"]);
                        }
                    }
                }
                readOnly();
            };
            var param = {"apiId": apiId};
            common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#descApiPopup"));

        }
    };

    //删除字段过滤table
    deleteNode = function (obj) {
        $(obj).parent().remove();
        //重置table
        var tableObj = $("#descApiOutparamSetting_outParamFilterGrid").find("tbody").find("td");
        $("#descApiOutparamSetting_outParamFilterGrid").find("tbody").empty();
        var count = tableObj.length;
        if(count == 1){
            $("#descApiOutparamSetting_outParamFilterGrid").css("width","25%");
        }else if(count == 2){
            $("#descApiOutparamSetting_outParamFilterGrid").css("width","50%");
        }else if(count == 3){
            $("#descApiOutparamSetting_outParamFilterGrid").css("width","75%");
        }else if(count >= 4){
            $("#descApiOutparamSetting_outParamFilterGrid").css("width","100%");
        }
        tableObj.each(function (index,obj) {
            if(index==0 || index %4 ==0){
                $("#descApiOutparamSetting_outParamFilterGrid").append("<tr></tr>");
            }
            $("#descApiOutparamSetting_outParamFilterGrid").find("tbody").find("tr:last").append("<td style='border: 0px;padding-left: 0px;padding-bottom:0px'><input class='k-textbox' style='width:85%' value='"+$(obj).find("input").val()+"' onchange='changeNode(this)'/><i class='fa fa-trash-o fa_icon' style='vertical-align: middle' title='删除' onclick='deleteNode(this)'></i></td>");
        });
        $("#descApiPopup_isAddHis").val("yes");
    };
    changeNode = function (obj) {
        $("#descApiPopup_isAddHis").val("yes");
    };
    //熔断配置
    var descApiPopup_rongduanSettingPopupWin = {
        inst: {},
        optionObj: {
            actions:[],
            minWidth: 500,
            minHeight: 150,
            maxWidth: "",
            maxHeight: "",
            title: "熔断配置",
            content: "biz/test/descApiRongduanSetting_popup.html"
        },
        getInst: function () {
            if (descApiPopup_rongduanSettingPopupWin.inst) {
                descApiPopup_rongduanSettingPopupWin.inst = new wandaComp.wandaWindow("descApiPopup_rongduanSetting", "descApiPopup_rongduanSettingPopup", descApiPopup_rongduanSettingPopupWin.optionObj);
            }
            return descApiPopup_rongduanSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var descApiPopup_waitTimeLimit = $("#descApiPopup_waitTimeLimit").val();
            var descApiPopup_concurrencyLimit = $("#descApiPopup_concurrencyLimit").val();
            if(descApiPopup_waitTimeLimit != ""){
                rongduan_popup.waitTime.getInst().value(descApiPopup_waitTimeLimit);
                rongduan_popup.waitTime.value = descApiPopup_waitTimeLimit;
            }
            if(descApiPopup_concurrencyLimit  != ""){
                rongduan_popup.concuy.getInst().value(descApiPopup_concurrencyLimit);
                rongduan_popup.concuy.value = descApiPopup_concurrencyLimit;
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#descApiPopup_rongduanSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            descApiPopup_rongduanSettingPopupWin.getInst().init(function () {
                var initFun = rongduan_popup.init;
                common.initExeByAttr("descApiPopup_rongduanSettingPopup", "opt='submit'", function () {
                    initFun("descApiPopup_rongduanSettingPopup");
                });
                descApiPopup_rongduanSettingPopupWin.setSubPageValue();
                descApiPopup_rongduanSettingPopupWin.getInst().callBack("opt='submit'", descApiPopup_rongduanSettingPopupWin.submitBtnCallBack, true);
                descApiPopup_rongduanSettingPopupWin.getInst().callBack("opt='cancel'", descApiPopup_rongduanSettingPopupWin.cancelBtnCallBack);;
            });
        }
    };

    // 入参转换设置
    var descApiPopup_inparamSettingPopupWin = {
        inst: {},
        optionObj: {
            actions: [],
            minWidth: 500,
            minHeight: 250,
            maxWidth: "",
            maxHeight: "",
            title: "入参设置",
            content: "biz/test/descApiInparamSetting_popup.html"
        },
        getInst: function () {
            if (descApiPopup_inparamSettingPopupWin.inst) {
                descApiPopup_inparamSettingPopupWin.inst = new wandaComp.wandaWindow("descApiPopup_inparamSetting", "descApiPopup_inparamSettingPopup", descApiPopup_inparamSettingPopupWin.optionObj);
            }
            return descApiPopup_inparamSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        openByCondition:function () {
            var descApiPopup_contentProto = $("#descApiPopup_contentProto").val();
            if(descApiPopup_contentProto == "4"){
                common.jqConfirm.alert({
                    title: 0,
                    content: "选择的body协议不支持入参转换！"
                });
                return false;
            }else{
                return true;
            }
        },
        initValues:"",
        setSubPageValue: function () {
            var requestParamValue = $("#descApiPopup_requestParamConvert").val();
            if(requestParamValue && requestParamValue != ""){
                inParam_popup.inConst.getInst().setDataSource(null);
                inParam_popup.inParam.getInst().setDataSource(null);
                var dataJson = JSON.parse(requestParamValue);
                var addPath = dataJson["addPath"];
                if(addPath && addPath.length > 0){
                    inParam_popup.inConst.addDataSource(addPath);
                }
                var pathConvert = dataJson["pathConvert"];
                if(pathConvert && pathConvert.length > 0){
                    inParam_popup.inParam.addDataSource(pathConvert);
                }
                $('input[name="descApiInparamSetting_inParamType"][value='+dataJson["processModel"]+']').prop("checked", "checked");
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#descApiPopup_inparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var descApiPopup_isAdd = $("#descApiPopup_isAdd").val();
            if(descApiPopup_isAdd == "false"){
                $("#descApiPopup_requestParamConvert").val(descApiPopup_inparamSettingPopupWin.initValues);
            }
            var plusPopup = $("#descApiPopup_inparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            descApiPopup_inparamSettingPopupWin.getInst().init(function () {
                var initFun = inParam_popup.init;
                if(descApiPopup_inparamSettingPopupWin.openByCondition()){
                    common.initExeByAttr("descApiPopup_inparamSettingPopup", "opt='submit'", function () {
                        if(!isOk){
                            initFun("descApiPopup_inparamSettingPopup");
                        }
                    });
                    descApiPopup_inparamSettingPopupWin.setSubPageValue();
                    isOk = true;
                }else{
                    return false;
                }
            });
            descApiPopup_inparamSettingPopupWin.getInst().callBack("opt='submit'", descApiPopup_inparamSettingPopupWin.submitBtnCallBack, true);
            descApiPopup_inparamSettingPopupWin.getInst().callBack("opt='cancel'", descApiPopup_inparamSettingPopupWin.cancelBtnCallBack);
        }
    };
    //出参转换设置
    var descApiPopup_outparamSettingPopupWin = {
        inst: {},
        optionObj: {
            actions: [],
            minWidth: 500,
            minHeight: 250,
            maxWidth: "",
            maxHeight: "",
            title: "出参设置",
            content: "biz/test/descApiOutparamSetting_popup.html"
        },
        getInst: function () {
            if (descApiPopup_outparamSettingPopupWin.inst) {
                descApiPopup_outparamSettingPopupWin.inst = new wandaComp.wandaWindow("descApiPopup_outparamSetting", "descApiPopup_outparamSettingPopup", descApiPopup_outparamSettingPopupWin.optionObj);
            }
            return descApiPopup_outparamSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        openByCondition:function () {
            var descApiPopup_contentProto = $("#descApiPopup_contentProto").val();
            if(descApiPopup_contentProto == "4"){
                common.jqConfirm.alert({
                    title: 0,
                    content: "选择的body协议不支持出参转换！"
                });
                return false;
            }else{
                return true;
            }
        },
        initValues:"",
        setSubPageValue: function () {
            var responseValue = $("#descApiPopup_responseParamConvert").val();
            if(responseValue && responseValue != ""){
                outParam_popup.outParam.getInst().setDataSource(null);
                $("#descApiOutparamSetting_outParamFilterGrid").find("tbody").html("");
                var valueJSON = JSON.parse(responseValue);
                var APIMgr_outparamConvertData = valueJSON["pathConvert"];
                if(APIMgr_outparamConvertData && APIMgr_outparamConvertData.length>0){
                    outParam_popup.outParam.addDataSource(APIMgr_outparamConvertData);
                }
                var value = [];
                if(valueJSON["delPath"] != undefined){
                    value = valueJSON["delPath"];
                }
                if(value!=null&&value.length>0){
                    var count = value.length;
                    if(count == 1){
                        $("#descApiOutparamSetting_outParamFilterGrid").css("width","25%");
                    }else if(count == 2){
                        $("#descApiOutparamSetting_outParamFilterGrid").css("width","50%");
                    }else if(count == 3){
                        $("#descApiOutparamSetting_outParamFilterGrid").css("width","75%");
                    }else if(count >= 4){
                        $("#descApiOutparamSetting_outParamFilterGrid").css("width","100%");
                    }
                    if(count>0){
                        for(var m=0;m<count;m++){
                            if(m==0 || m%4 ==0){
                                $("#descApiOutparamSetting_outParamFilterGrid").append("<tr></tr>");
                            }
                            var item = value[m];
                            item = item.trim().replace("\"","").replace("\"","");
                            $("#descApiOutparamSetting_outParamFilterGrid").find("tbody").find("tr:last").append("<td style='border: 0px;padding-left: 0px;padding-bottom:0px'><input class='k-textbox' style='width:85%' value='"+item+"' onchange='changeNode(this)'/><i class='fa fa-trash-o fa_icon' style='vertical-align: middle' title='删除' onclick='deleteNode(this)'></i></td>");
                        }
                    }
                }
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#descApiPopup_outparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var descApiPopup_isAdd = $("#descApiPopup_isAdd").val();
            if(descApiPopup_isAdd == "false"){
                $("#descApiPopup_responseParamConvert").val(descApiPopup_outparamSettingPopupWin.initValues);
            }
            var plusPopup = $("#descApiPopup_outparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            descApiPopup_outparamSettingPopupWin.getInst().init(function () {
                var initFun = outParam_popup.init;
                if(descApiPopup_outparamSettingPopupWin.openByCondition()){
                    common.initExeByAttr("descApiPopup_outparamSettingPopup", "opt='submit'", function () {
                        if (!isOk) {
                            initFun("descApiPopup_outparamSettingPopup");
                        }
                    });
                    descApiPopup_outparamSettingPopupWin.setSubPageValue();
                    isOk = true;
                }else{
                    return false;
                }
            });
            descApiPopup_outparamSettingPopupWin.getInst().callBack("opt='submit'", descApiPopup_outparamSettingPopupWin.submitBtnCallBack, true);
            descApiPopup_outparamSettingPopupWin.getInst().callBack("opt='cancel'", descApiPopup_outparamSettingPopupWin.cancelBtnCallBack);
        }
    };

    //自定义过滤器
    var descApiPopup_customSettingPopupWin = {
        inst: {},
        optionObj: {
            actions:[],
            minWidth: 500,
            minHeight: 150,
            maxWidth: "",
            maxHeight: "",
            title: "扩展插件",
            content: "biz/test/descApiCustomSetting_popup.html"
        },
        getInst: function () {
            if (descApiPopup_customSettingPopupWin.inst) {
                descApiPopup_customSettingPopupWin.inst = new wandaComp.wandaWindow("descApiPopup_customSetting", "descApiPopup_customSettingPopup", descApiPopup_customSettingPopupWin.optionObj);
            }
            return descApiPopup_customSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        initValues:"",
        setSubPageValue: function () {
            //初始化自定义过滤器的值
            var APIMgr_extendFilter = $("#descApiPopup_extendFilter").val();
            if(APIMgr_extendFilter && APIMgr_extendFilter.length > 0){
                var APIMgr_extendFilter_json = JSON.parse(APIMgr_extendFilter);
                custom_popup.inConst.addDataSource(APIMgr_extendFilter_json);
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#descApiPopup_customSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var descApiPopup_isAdd = $("#descApiPopup_isAdd").val();
            if(descApiPopup_isAdd == "false"){
                $("#descApiPopup_extendFilter").val(descApiPopup_customSettingPopupWin.initValues);
            }
            var plusPopup = $("#descApiPopup_customSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            descApiPopup_customSettingPopupWin.getInst().init(function () {
                var initFun = custom_popup.init;
                common.initExeByAttr("descApiPopup_customSettingPopup", "opt='submit'", function () {
                    if(!isOk){
                        initFun("descApiPopup_customSettingPopup");
                    }
                });
                descApiPopup_customSettingPopupWin.setSubPageValue();
                isOk = true;
            });
            descApiPopup_customSettingPopupWin.getInst().callBack("opt='submit'", descApiPopup_customSettingPopupWin.submitBtnCallBack, true);
            descApiPopup_customSettingPopupWin.getInst().callBack("opt='cancel'", descApiPopup_customSettingPopupWin.cancelBtnCallBack);
        }
    };

    var readOnly = function () {
        descApiPopup_serverName.getInst().readonly();
        $("#descApiPopup_name").attr("readonly","readonly");
        descApiPopup_state.getInst().readonly();
        $("#descApiPopup_desc").attr("readonly","readonly");
        descApiPopup_transProto.getInst().readonly();
        $("#descApiPopup_path").attr("readonly","readonly");
        descApiPopup_method.getInst().readonly();
        descApiPopup_contentProto.getInst().readonly();
        $("#descApiPopup_inparamDemo").attr("readonly", "true").css("background-color", "white");
        $("#descApiPopup_outparamDemo").attr("readonly", "true").css("background-color", "white");

        descApiPopup_desMethod.getInst().readonly();
        descApiPopup_desContentProto.getInst().readonly();
        descApiPopup_desTransProto.getInst().readonly();
        descApiPopup_ispublic.getInst().readonly();
    }
    var removeOnly = function () {
        descApiPopup_serverName.getInst().readonly(false);
        $("#descApiPopup_name").removeAttr("readonly");
        descApiPopup_state.getInst().readonly(false);
        $("#descApiPopup_desc").removeAttr("readonly");
        descApiPopup_transProto.getInst().readonly(false);
        $("#descApiPopup_path").removeAttr("readonly");
        descApiPopup_method.getInst().readonly(false);
        descApiPopup_contentProto.getInst().readonly(false);
        $("#descApiPopup_inparamDemo").removeAttr("readonly");
        $("#descApiPopup_outparamDemo").removeAttr("readonly");

        descApiPopup_desMethod.getInst().readonly(false);
        descApiPopup_desContentProto.getInst().readonly(false);
        descApiPopup_desTransProto.getInst().readonly(false);
        descApiPopup_ispublic.getInst().readonly(false);
    }
    //清除数据
    var clearData = function () {
        descApiPopup_choose_name.value = "";
        descApiPopup_choose_serverName.value = "";
        descApiPopup_serverName.value = "";
        descApiPopup_state.value = "";
        descApiPopup_method.value = "";
        descApiPopup_transProto.value = "";
        descApiPopup_contentProto.value = "";
        descApiPopup_desContentProto.value = "";
        descApiPopup_desMethod.value = "";
        descApiPopup_desTransProto.value = "";
        //descApiPopup_method.getInst().value("");
        $("#descApiPopup_serverId").val("");
        $("#descApiPopup_apiId").val("");
        $("#descApiPopup_apiGuid").val("");
        $("#descApiPopup_name").val("");
        $("#descApiPopup_path").val("");
        $("#descApiPopup_desc").val("");
        $("#descApiPopup_inparamDemo").val("");
        $("#descApiPopup_outparamDemo").val("");
        $("#descApiPopup_concurrencyLimit").val("");
        $("#descApiPopup_waitTimeLimit").val("");
        descApiPopup_descPathGrid.getInst().setDataSource(null);
        $("#descApiPopup_name").removeClass("k-invalid");
        $("#descApiPopup_path").removeClass("k-invalid");

        var plusPopup1 = $("#descApiPopup_rongduanSettingPopup").data("wandaWindow");
        var plusPopup2 = $("#descApiPopup_inparamSettingPopup").data("wandaWindow");
        var plusPopup3 = $("#descApiPopup_outparamSettingPopup").data("wandaWindow");
        var plusPopup4 = $("#descApiPopup_customSettingPopup").data("wandaWindow");
        var plusPopup5 = $("#descApiPopup_wsdl_test").data("wandaWindow");
        if(plusPopup1 && plusPopup1 != null){
            plusPopup1.destroy();
            $("#descApiPopup").after('<div id="descApiPopup_rongduanSettingPopup"></div>');
        }
        if(plusPopup2 && plusPopup2 != null){
            plusPopup2.destroy();
            $("#descApiPopup").after('<div id="descApiPopup_inparamSettingPopup"></div>');
        }
        if(plusPopup3 && plusPopup3 != null){
            plusPopup3.destroy();
            $("#descApiPopup").after('<div id="descApiPopup_outparamSettingPopup"></div>');
        }
        if(plusPopup4 && plusPopup4 != null){
            plusPopup4.destroy();
            $("#descApiPopup").after('<div id="descApiPopup_customSettingPopup"></div>');
        }
        if(plusPopup5 && plusPopup5 != null){
            plusPopup5.destroy();
            $("#descApiPopup").after('<div id="descApiPopup_wsdl_test"></div>');
        }
    }
    var initParam = function () {
        var _params = common.getRouterParams();
        descApiPopup_validate.init();
        descApiPopup_serverName.init();
        descApiPopup_state.init();
        descApiPopup_method.init();
        descApiPopup_transProto.init();
        descApiPopup_contentProto.init();
        descApiPopup_tabstrip.init();
        descApiPopup_desContentProto.init();
        descApiPopup_desMethod.init();
        descApiPopup_desTransProto.init();
        descApiPopup_descPathGrid.init();
        descApiPopup_descPathGrid_dataAdd.init();
        descApiPopup_ispublic.init();
        descApiPopup_saveCloseBtn.init();
        descApiPopup_closeBtn.init();
        descApiPopup_nextBtn.init();
        descApiPopup_preBtn.init();
        descApiPopup_confirmBtn.init();
        descApiPopup_wsdl_EditPopupWin.init();
        descApiPopup_rongduanSettingPopupWin.init();
        descApiPopup_inparamSettingPopupWin.init();
        descApiPopup_outparamSettingPopupWin.init();
        descApiPopup_customSettingPopupWin.init();
        descApiPopup_ip.init("HTTP");
    }
    var init = function () {
        descApiPopup_choose_type.init();
        descApiPopup_choose_serverName.init();
        descApiPopup_choose_name.init();
        //descApiPopup_choose_closeBtn.init();
        descApiPopup_choose_saveCloseBtn.init();
        firstPageShow();
    };
    return {
        init: init
    }
});