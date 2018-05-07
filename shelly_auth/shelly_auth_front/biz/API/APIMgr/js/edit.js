define(["jquery", "common","wandaComp", "wandaCompR","biz/API/APIMgr/js/edit_popup","biz/API/APIMgr/js/apiInparamSetting_popup","biz/API/APIMgr/js/apiOutparamSetting_popup","biz/API/APIMgr/js/apiRongduanSetting_popup","biz/API/APIMgr/js/apiCustomSetting_popup"], function ($, common,wandaComp, wandaCompR,edit_popup,inParam_popup,outParam_popup,rongduan_popup,custom_popup) {
    var validate = {
        helper:null,
        init:function (parentIds) {
            validate.helper =  wandaComp.commonValidator("APIMgr");
        }
    }
    //应用名称
    var api_serverName = {
        value:"",
        getInst: function () {
            return $("#APIMgr_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_serverName.value = value;
            api_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#APIMgr_serverName").data("wandaDropDownList").setDataSource(data);
            if(api_serverName.value){
                api_serverName.getInst().value(api_serverName.value);
            }
        },
        init: function () {
            $("#APIMgr_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "--请选择--",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#APIFound_serverName-list").css("height","auto");
                    $("#APIFound_serverName-list").css("overflow","hidden");
                }
            });
            var param = {"isAuth":"yes"};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, api_serverName.successFun, null, null, $("#APIMgr"));
        }
    };
    //状态
    var api_state = {
        value:"",
        getInst: function () {
            return $("#APIMgr_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_state.value = value;
            api_state.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgr_state").data("wandaDropDownList").setDataSource(data);
            if(api_state.value){
                api_state.getInst().value(api_state.value);
            }
        },
        init: function () {
            $("#APIMgr_state").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_state.successFun, null, null, $("#APIMgr"));
        }
    };
    //是否公开
    var api_ispublic = {
        value:"",
        getInst: function () {
            return $("#APIMgr_ispublic").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_ispublic.value = value;
            api_ispublic.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgr_ispublic").data("wandaDropDownList").setDataSource(data);
            if(api_ispublic.value){
                api_ispublic.getInst().value(api_ispublic.value);
            }
            if($("#APIMgr_isAdd").val() != "false"){
                api_ispublic.getInst().select(1);
            }
        },
        init: function () {
            $("#APIMgr_ispublic").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != api_ispublic.value){
                        $("#APIMgr_isAddHis").val("yes");
                    }else{
                        $("#APIMgr_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "ispublic"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_ispublic.successFun, null, null, $("#APIMgr"));
        }
    };
    // 传输协议
    var api_transProto = {
        value:"",
        getInst: function () {
            return $("#APIMgr_transProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_transProto.value = value;
            api_transProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgr_transProto").data("wandaDropDownList").setDataSource(data);
            if(api_transProto.value){
                api_transProto.getInst().value(api_transProto.value);
            }else{
                if($("#APIMgr_isAdd").val()!="false"){
                    api_transProto.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#APIMgr_transProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != api_transProto.value){
                        $("#APIMgr_isAddHis").val("yes");
                    }else{
                        $("#APIMgr_isAddHis").val("no");
                    }
                    if("1" == value){
                        api_ip.init("HTTP");
                    }else{
                        api_ip.init("HTTPS");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_transProto.successFun, null, null, $("#APIMgr"));
        }
    };
    // ip地址获取
    var api_ip = {
        successFun: function (data) {
            $("#APIMgr_ip").val(data["IP"]);
            $("#APIMgr_port").val(data["PORT"]);
            $("#APIMgr_apiaddrid").val(data["APIADDRID"]);
        },
        init: function (addrTrans) {
            var param = {"addrTrans": addrTrans};
            common.ajaxGet("api/gateApi/getApiAddr", param, api_ip.successFun, null, null, $("#APIMgr"));
        }
    };
    // Body协议
    var api_contentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#APIMgr_contentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_contentProto.value = value;
            api_contentProto.getInst().value(value);
        },
        successFun:function (data) {
            api_contentProto.dataSource = data;
            api_contentProto.getInst().setDataSource(data);
            if(api_contentProto.value){
                api_contentProto.getInst().value(api_contentProto.value);
            }else{
                if($("#APIMgr_isAdd").val()!="false"){
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
                var contentProto = $("#APIMgr_contentProto").val();
                if(flag){
                    var inArray = false;
                    for(var i = 0 ; i < newDataSource.length;i++){
                        if(newDataSource[i]["value"] == contentProto){
                            inArray = true;
                        }
                    }
                    if(!inArray){
                        api_contentProto.getInst().select(0);
                    }
                }
            }
            api_desContentProto.changeDataSource(true);
        },
        changeInPlaceholder:function (value) {
            if("1" == value){
                $("#APIMgr_inparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
                $("#APIMgr_outparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
            }else if("2" == value){
                $("#APIMgr_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n" +
                    "<s11:Body>\n" +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>\n<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>\n </ns1:param>\n " +
                    "</ns1:getSupportCity>\n " +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#APIMgr_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
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
                $("#APIMgr_inparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
                $("#APIMgr_outparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
            }else if("4" == value){
                $("#APIMgr_inparamDemo").attr("placeholder","This is a inParam demo");
                $("#APIMgr_outparamDemo").attr("placeholder","This is a outParam demo");
            }else if("5" == value){
                $("#APIMgr_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n " +
                    "<s11:Body>\n " +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt; </ns1:param> \n" +
                    "</ns1:getSupportCity> \n" +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#APIMgr_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
                    "<soap:Body>\n" +
                    "<ns2:sayStrResponse xmlns:ns2='ws.wondersgroup.com'>\n" +
                    "<return>&lt;Response&gt; &lt;MessageHeader&gt; &lt;code&gt;0&lt;/code&gt; &lt;desc&gt;成功&lt;/desc&gt; &lt;/MessageHeader&gt; &lt;/Response&gt;</return>\n" +
                    "</ns2:sayStrResponse>\n" +
                    "</soap:Body>\n" +
                    "</soap:Envelope>");
            }else if("6" == value){
                $("#APIMgr_inparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
                $("#APIMgr_outparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
            }
            if($("#APIMgr_method").val()=="1"){
                $("#APIMgr_inparamDemo").attr("placeholder","id=1&name=test");
            }
        },
        init: function () {
            $("#APIMgr_contentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_contentProto.changeInPlaceholder(value);
                    if(value != api_contentProto.value){
                        $("#APIMgr_isAddHis").val("yes");
                    }else{
                        $("#APIMgr_isAddHis").val("no");
                    }
                    api_desContentProto.changeDataSource(value,true);
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_contentProto.successFun, null, null, $("#APIMgr"));
        }
    };
    //API方法
    var api_method = {
        value:"",
        getInst: function () {
            return $("#APIMgr_method").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_method.value = value;
            api_method.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgr_method").data("wandaDropDownList").setDataSource(data);
            if(api_method.value){
                api_method.getInst().value(api_method.value);
            }
            if($("#APIMgr_isAdd").val() != "false"){
                api_method.getInst().select(1);
            }
        },
        init: function () {
            $("#APIMgr_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_contentProto.changeDataSource(value,true);
                    api_contentProto.changeInPlaceholder($("#APIMgr_contentProto").val());
                    if(value != api_method.value){
                        $("#APIMgr_isAddHis").val("yes");
                    }else{
                        $("#APIMgr_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_method.successFun, null, null, $("#APIMgr"));
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
            $("#APIMgr_descHighParamTitle").click(function () {
                $("#APIMgr_descHighParamContent").slideToggle("slow",function () {
                    if($('#descHighParamContent').css('display')=="none"){
                        $("#APIMgr_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgr_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#APIMgr_inConstConvertTitle").click(function () {
                $("#APIMgr_inConstConvertContent").slideToggle("slow",function () {
                    if($('#APIMgr_inConstConvertContent').css('display')=="none"){
                        $("#APIMgr_inConstConvertTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgr_inConstConvertTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#APIMgr_inparamConvertTitle").click(function () {
                $("#APIMgr_inparamConvertContent").slideToggle("slow",function () {
                    if($('#APIMgr_inparamConvertContent').css('display')=="none"){
                        $("#APIMgr_inparamConvertTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgr_inparamConvertTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#APIMgr_outparamConvertTitle").click(function () {
                $("#APIMgr_outparamConvertContent").slideToggle("slow",function () {
                    if($('#APIMgr_outparamConvertContent').css('display')=="none"){
                        $("#APIMgr_outparamConvertTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgr_outparamConvertTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#APIMgr_filterConvertTitle").click(function () {
                $("#APIMgr_filterConvertContent").slideToggle("slow",function () {
                    if($('#APIMgr_filterConvertContent').css('display')=="none"){
                        $("#APIMgr_filterConvertTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#APIMgr_filterConvertTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
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
            content: "biz/API/APIMgr/html/edit_popup.html"
        },
        getInst: function () {
            if (api_wsdl_EditPopupWin.inst) {
                api_wsdl_EditPopupWin.inst = new wandaComp.wandaWindow("APIMgr_wsdlSearch", "APIMgr_wsdl_test", api_wsdl_EditPopupWin.optionObj);
            }
            return api_wsdl_EditPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var wsdlPath = $("#APIMgr_wsdlPath").val();
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
            var serviceName = $("#APIMgr_wsdl_test").find("#APIMgr_popup_services").val();
            var bindingName = $("#APIMgr_wsdl_test").find("#APIMgr_popup_serviceBinds").val();
            var operationName = $("#APIMgr_wsdl_test").find("#APIMgr_popup_bindOperations").val();
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
                        $("#APIMgr_services").val(serviceName);
                        $("#APIMgr_serviceBinds").val(bindingName);
                        $("#APIMgr_bindOperations").val(operationName);
                        $("#APIMgr_soapDemo").val(data);
                        $("#APIMgr_isAddHis").val("yes");
                        $("#APIList_soap_div").show();
                        var APIMgr_wsdl_test = $("#APIMgr_wsdl_test").data("wandaWindow");
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
                common.initExeByAttr("APIMgr_wsdl_test", "opt='submit'", function () {
                    initFun("APIMgr_wsdl_test");
                });
            });
            api_wsdl_EditPopupWin.getInst().callBack("opt='submit'", api_wsdl_EditPopupWin.submitBtnCallBack, true);
            api_wsdl_EditPopupWin.getInst().callBack("opt='cancel'", api_wsdl_EditPopupWin.cancelBtnCallBack);
        }
    };
    //目标API方法
    var api_desMethod = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#APIMgr_desMethod").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_desMethod.value = value;
            api_desMethod.getInst().value(value);
        },
        successFun:function (data) {
            api_desMethod.dataSource = data;
            api_desMethod.getInst().setDataSource(data);
            if(api_desMethod.value){
                api_desMethod.getInst().value(api_desMethod.value);
            }else{
                if($("#APIMgr_isAdd").val()!="false"){
                    api_desMethod.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#APIMgr_desMethod").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    api_desContentProto.changeDataSource(true);
                    if(value != api_desMethod.value){
                        $("#APIMgr_isAddHis").val("yes");
                    }else{
                        $("#APIMgr_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desMethod.successFun, null, null, $("#APIMgr"));
        }
    };
    //目标API传输协议
    var api_desTransProto = {
        value:"",
        getInst: function () {
            return $("#APIMgr_desTransProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_desTransProto.value = value;
            api_desTransProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#APIMgr_desTransProto").data("wandaDropDownList").setDataSource(data);
            if(api_desTransProto.value){
                api_desTransProto.getInst().value(api_desTransProto.value);
            }
            if($("#APIMgr_isAdd").val()!="false"){
                api_desTransProto.getInst().select(0);
            }
        },
        init: function () {
            $("#APIMgr_desTransProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != api_desTransProto.value){
                        $("#APIMgr_isAddHis").val("yes");
                    }else{
                        $("#APIMgr_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desTransProto.successFun, null, null, $("#APIMgr"));
        }
    };
    //目标API Body协议
    var api_desContentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#APIMgr_desContentProto").data("wandaDropDownList");
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
        changeDataSource:function (flag) {
            var newDataSource = [],methodDateSource = [];
            var method = $("#APIMgr_method").val();
            var contentValue = $("#APIMgr_contentProto").val();
            var desMethodValue = $("#APIMgr_desMethod").val();
            var desContentProto = $("#APIMgr_desContentProto").val();
            if("2" == contentValue || "5" == contentValue){  //第一页body协议为soap时，第二页只能为soap
                if("2" == contentValue){
                    newDataSource.push(api_desContentProto.dataSource[1]);
                }else{
                    newDataSource.push(api_desContentProto.dataSource[4]);
                }
                api_desContentProto.getInst().setDataSource(newDataSource);
                api_desContentProto.getInst().select(0);

                api_desMethod.getInst().setDataSource(api_desMethod.dataSource);
                if(flag){
                    api_desMethod.getInst().select(1);
                }
                api_desMethod.getInst().readonly();
            }else if("4" == contentValue){  //第一页body协议为text时，第二页只能为text
                if("1" == method){   //如果第一页为请求方法是get，第二页只能是get
                    methodDateSource.push(api_desMethod.dataSource[0]);
                }else{
                    $.each(api_desMethod.dataSource,function (index,value) {
                        if(index!=0){
                            methodDateSource.push(value);
                        }
                    });
                }
                api_desMethod.getInst().setDataSource(methodDateSource);
                api_desMethod.getInst().select(0);
                api_desMethod.getInst().readonly(false);

                newDataSource.push(api_desContentProto.dataSource[3]);
                api_desContentProto.getInst().setDataSource(newDataSource);
                api_desContentProto.getInst().select(0);

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

                api_desMethod.getInst().setDataSource(api_desMethod.dataSource);
                api_desMethod.getInst().readonly(false);
                if(flag){
                    var inArray = false;
                    for(var i = 0 ; i < newDataSource.length;i++){
                        if(newDataSource[i]["value"] == desContentProto){
                            inArray = true;
                        }
                    }
                    if(desContentProto == "2"){
                        api_desMethod.getInst().readonly();
                    }
                    if(!inArray){
                        api_desContentProto.getInst().select(0);
                    }
                }
            }
        },
        successFun:function (data) {
            api_desContentProto.dataSource = data;
            api_desContentProto.getInst().setDataSource(data);
            if(api_desTransProto.value){
                api_desContentProto.getInst().value(api_desContentProto.value);
            }
            if($("#APIMgr_isAdd").val()!="false"){
                api_desContentProto.getInst().select(0);
                api_desContentProto.changeDataSource();
            }
        },
        init: function () {
            $("#APIMgr_desContentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != api_desContentProto.value){
                        $("#APIMgr_isAddHis").val("yes");
                    }else{
                        $("#APIMgr_isAddHis").val("no");
                    }
                    if("2" == value || "5" == value){
                        api_desMethod.setValue("2");
                        api_desMethod.getInst().readonly();
                        $("#APIList_address_div").show();
                        if($("#APIMgr_isAdd").val() == "false"){
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
            common.ajaxGet("syscommpara/getBaseAttr", param, api_desContentProto.successFun, null, null, $("#APIMgr"));
        }
    };
    //目标地址
    var descPathGrid = {
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
                width: "180px"
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
                        $("#APIMgr_isAddHis").val("yes");
                    }
                }], title: "操作", width: "60px"
            }
        ],
        init:function () {
            descPathGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descPathGrid.inst) {
                descPathGrid.inst = new wandaComp.wandaGrid("descPathGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,true);
            }
            return descPathGrid.inst;
        },
        isEditable:function (data) {
            var editArry = [];
            //var dataView = descPathGrid.getDataSource()["_data"];
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
            if(($("#APIMgr_desContentProto").val()=="2" || $("#APIMgr_desContentProto").val()=="5") && $("#APIMgr_wsdlPath").val()!=""){
                var str = $("#APIMgr_wsdlPath").val();
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
                return descPathGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descPathGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            $("#APIMgr_isAddHis").val("yes");
            descPathGrid.getInst().saveAll();
            var dataView = descPathGrid.getDataSource()["_data"];
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
            descPathGrid.getInst().addRow();
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
            $("#descPathGrid_dataAdd").unbind("click");
            $("#descPathGrid_dataAdd").click(function () {
                descPathGrid.addRow();
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
        var APIMgr_inparam = {},gateDesaddr = [],gateFilterApi = {},protocolConvert = {},requestParamConvert = {},
            responseConvert = {},wsdl = {},responseNodeRemove = "",delPath = [];
        var isAdd = $("#APIMgr_isAdd").val();
        var APIMgr_isAddHis = $("#APIMgr_isAddHis").val();
        var APIMgr_apiId = $("#APIMgr_apiId").val();
        var APIMgr_serverName = $("#APIMgr_serverName").val();
        var APIMgr_name = $("#APIMgr_name").val();
        var APIMgr_state = $("#APIMgr_state").val();
        var APIMgr_desc = $("#APIMgr_desc").val();
        var APIMgr_path = $("#APIMgr_path").val();
        var APIMgr_transProto = $("#APIMgr_transProto").val();
        var APIMgr_contentProto = $("#APIMgr_contentProto").val();
        var APIMgr_method = $("#APIMgr_method").val();
        var APIMgr_waitTimeLimit = $("#APIRongduanSetting_waitTimeLimit").val();
        var APIMgr_concurrencyLimit = $("#APIRongduanSetting_concurrencyLimit").val();
        var APIMgr_inparamDemo = $("#APIMgr_inparamDemo").val();
        var APIMgr_inparamDemo1 = $("#APIMgr_inparamDemo1").val();
        var APIMgr_inparamDemo2 = $("#APIMgr_inparamDemo2").val();
        var APIMgr_outparamDemo = $("#APIMgr_outparamDemo").val();
        var APIMgr_desTransProto = $("#APIMgr_desTransProto").val();
        var APIMgr_desContentProto = $("#APIMgr_desContentProto").val();
        var APIMgr_desMethod = $("#APIMgr_desMethod").val();
        var APIMgr_loadBalance = $("#APIMgr_loadBalance").val();
        var APIMgr_wsdlPath = $("#APIMgr_wsdlPath").val();
        var APIMgr_services = $("#APIMgr_services").val();
        var APIMgr_serviceBinds = $("#APIMgr_serviceBinds").val();
        var APIMgr_bindOperations = $("#APIMgr_bindOperations").val();
        var APIMgr_apiaddrid = $("#APIMgr_apiaddrid").val();
        var APIMgr_ispublic = $("#APIMgr_ispublic").val();
        APIMgr_inparam["Body"] = APIMgr_inparamDemo;
        if(APIMgr_path.charAt(0) != "/")
            APIMgr_path = "/"+APIMgr_path;

        /***************    SOAP时校验是否填写wsdl地址 *******************/
        if(APIMgr_desContentProto == "2" || APIMgr_desContentProto == "5"){
            if(APIMgr_wsdlPath==""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入WSDL地址进行测试！"
                });
                return false;
            }else if(APIMgr_services== "" ||APIMgr_serviceBinds=="" ||APIMgr_bindOperations==""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入正确的WSDL地址！"
                });
                return false;
            }else{
                gateFilterApi["wsdlPath"] = APIMgr_wsdlPath;
                var obj = edit_popup.api_wsdlSearch.bindAndOperations[APIMgr_serviceBinds];
                var portTypeName = "";
                if(obj){
                    portTypeName = obj["portPortType"];
                }else{
                    portTypeName = edit_popup.api_wsdlSearch.portPortType;
                }
                wsdl = {
                    "port": portTypeName,
                    "op": APIMgr_bindOperations,
                    "bind": APIMgr_serviceBinds,
                    "service":APIMgr_services,
                    "soapDemo":$("#APIMgr_soapDemo").val()
                }
                gateFilterApi["wsdl"] = JSON.stringify(wsdl);
            }
        }
        /*****************    目标地址校验    **********************/
        descPathGrid.getInst().saveAll();
        var descPathData = descPathGrid.getDataSource()["_data"];
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
                if(urlPathTemp.charAt(0) != "/"){
                    urlPathTemp = "/"+urlPathTemp;
                }
                gateDesaddr[i]["uriPath"] = urlPathTemp;
                if(isAdd == "false"){
                    if(descPathData[i]["API_ID"]){
                        gateDesaddr[i]["apiId"] = descPathData[i]["API_ID"]+"";
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
        var reqsourceData = $("#APIMgr_requestParamConvert").val();
        if(reqsourceData && reqsourceData != ""){    //如果没有打开窗口点击保存，那么直接拿初始值
            gateFilterApi["requestParamConvert"] = reqsourceData;
        }else{
            var inConstConvertData = [],sourcePathConvert = [],inConstDataSource = null; //常量转换
            var inparamDataSource = null,inparamConvertData = [];  //入参转换
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
            requestParamConvert["processModel"] = $('input[name="APIMgr_inParamType"]:checked ').val();

            gateFilterApi["requestParamConvert"] = JSON.stringify(requestParamConvert);
        }

        /******************   出参转换校验    **********************/
        var repSourceData = $("#APIMgr_responseParamConvert").val();
        if(repSourceData && repSourceData != ""){  //如果没有打开窗口点击保存，那么直接拿初始值
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
            $("#APIMgr_outParamFilterGrid").find("td").find("input").each(function (index) {
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
        if("" == $("#APIMgr_waitTimeLimit").val()){
            if(APIMgr_waitTimeLimit == ""){
                APIMgr_waitTimeLimit = "180";
            }
        }else{
            APIMgr_waitTimeLimit = $("#APIMgr_waitTimeLimit").val();
        }
        var waitTimeLimit = {"maxNumber":APIMgr_waitTimeLimit};
        gateFilterApi["waitTimeLimit"] = JSON.stringify(waitTimeLimit); //超时过滤器

        /******************* 并发过滤器   ****************************/
        if("" == $("#APIMgr_concurrencyLimit").val()){
            if(APIMgr_concurrencyLimit == ""){
                APIMgr_concurrencyLimit = "100";
            }
        }else{
            APIMgr_concurrencyLimit = $("#APIMgr_concurrencyLimit").val();
        }
        var concurrencyLimit = {"maxNumber":APIMgr_concurrencyLimit};
        gateFilterApi["concurrencyLimit"] = JSON.stringify(concurrencyLimit);  //并发过滤器

        /******************  协议转换过滤器  ******************************/
        protocolConvert["srcProtocol"] = {
            "trans": APIMgr_transProto,
            "content": APIMgr_contentProto,
            "method": APIMgr_method
        }
        protocolConvert["desProtocol"] = {
            "trans": APIMgr_desTransProto,
            "content": APIMgr_desContentProto,
            "method": APIMgr_desMethod
        }
        gateFilterApi["protocolConvert"] = JSON.stringify(protocolConvert);

        /***********************    自定义插件   *************************/
        var APIMgr_extendFilter = $("#APIMgr_extendFilter").val();
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
                "serviceId":APIMgr_serverName,
                "apiName":APIMgr_name,
                "apiDesc":APIMgr_desc,
                "apiPath":APIMgr_path,
                "apiTransProto":APIMgr_transProto,
                "apiContentProto":APIMgr_contentProto,
                "apiMethod":APIMgr_method,
                "apiInparamDemo":APIMgr_inparamDemo,
                "apiOutparamDemo":APIMgr_outparamDemo,
                "desTransProto":APIMgr_desTransProto,
                "desContentProto":APIMgr_desContentProto,
                "desMethod":APIMgr_desMethod,
                "desInparamDemo":"",
                "desOutparamDemo":"",
                "apiAddrId":APIMgr_apiaddrid,
                "isPublic":APIMgr_ispublic,
                "isRawApi":"1"   //1：普通api；2：组合api
            },
            "gateFilterApi":gateFilterApi,
            "gateDesaddr":gateDesaddr
        }
        if(isAdd == "false"){ //修改时是否新增历史
            param["gateApi"]["apiId"] = APIMgr_apiId;
            param["gateApi"]["state"] = APIMgr_state;
            param["isAddHis"] = "yes";
            if(APIMgr_isAddHis != "yes"){
                param["isAddHis"] = "no";
            }
        }
        return param;
    };
    //下一步
    var APIMgr_nextBtn = {
        init:function () {
            $("#APIMgr_nextBtn").click(function () {
                var APIMgr_serverName = $("#APIMgr_serverName").val();
                var APIMgr_name = $("#APIMgr_name").val();
                var APIMgr_path = $("#APIMgr_path").val();
                var APIMgr_contentProto = $("#APIMgr_contentProto").val();
                var APIMgr_desContentProto = $("#APIMgr_desContentProto").val();

                if ("" == APIMgr_serverName && APIMgr_serverName.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择应用名称！"
                    });
                    $("#APIMgr_serverName").focus();
                    return false;
                }
                if(validate.helper.validate()){
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

                    if (APIMgr_contentProto != "2" && APIMgr_contentProto != "5" &&
                        APIMgr_desContentProto != "2" && APIMgr_desContentProto != "5") {
                        $("#APIList_address_div").hide();
                        $("#APIList_soap_div").hide();
                    } else {
                        $("#APIList_address_div").show();
                        $("#APIList_soap_div").show();
                    }
                }
            });
        }
    }
    //上一步
    var APIMgr_preBtn = {
        init:function () {
            $("#APIMgr_preBtn").click(function () {
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
    var APIMgr_saveCloseBtn = {
        init:function () {
            $("#APIMgr_saveCloseBtn").click(function () {
                var _param = getFormValue();
                if(_param){
                    var isAdd = $("#APIMgr_isAdd").val();
                    if(isAdd == "false"){
                        common.ajaxPut("api/gateApi/updatePublishApi", _param, function () {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    clearData();
                                    router.navigate("100602");
                                }
                            });
                        }, null, null, $("#APIMgr"));
                    }else{
                        common.ajaxPost("api/gateApi/addPublishApi", _param, function () {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    clearData();
                                    router.navigate("100602");
                                }
                            });
                        }, null, null, $("#APIMgr"));
                    }
                }
            });
        }
    };
    //取消按钮
    var APIMgr_closeBtn = {
        init:function () {
            $("#APIMgr_closeBtn1").click(function () {
                clearData();
                router.navigate("100602");
            })
        }
    };
    //修改获取API数据详情
    var apiDetail = {
        init: function (apiId) {
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                var gateFilterApi = data["gateFilterApi"];
                var gateDesaddr = data["gateDesaddr"];
                if(gateApi){//基本信息
                    $("#APIMgr_name").val(gateApi["API_NAME"]);
                    $("#APIMgr_desc").val(gateApi["API_DESC"]);
                    $("#APIMgr_path").val(gateApi["API_PATH"]);
                    $("#APIMgr_outparamDemo").val(gateApi["API_OUTPARAM_DEMO"]);
                    $("#APIMgr_userCode").val(gateApi["USER_CODE"]);
                    $("#APIMgr_ip").val(gateApi["IP"]);
                    $("#APIMgr_port").val(gateApi["PORT"]);
                    $("#APIMgr_apiaddrid").val(gateApi["API_ADDR_ID"]);
                    api_serverName.setValue(gateApi["SERVICE_ID"]);
                    api_serverName.getInst().readonly();
                    api_state.setValue(gateApi["STATE"]);
                    $("#APIMgr_method").val(gateApi["API_METHOD"]);
                    $("#APIMgr_contentProto").val(gateApi["API_CONTENT_PROTO"]);
                    $("#APIMgr_desMethod").val(gateApi["DES_METHOD"]);
                    $("#APIMgr_desContentProto").val(gateApi["DES_CONTENT_PROTO"]);

                    api_contentProto.changeDataSource(gateApi["API_METHOD"],false);
                    api_desContentProto.changeDataSource(false);
                    api_contentProto.changeInPlaceholder(gateApi["API_CONTENT_PROTO"]);

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
                                $("#APIMgr_inparamDemo").val(gateApi["API_INPARAM_DEMO"])
                            }else{
                                $("#APIMgr_inparamDemo").val(inparamJson["Body"]);
                            }
                        }catch(e) {
                            $("#APIMgr_inparamDemo").val(gateApi["API_INPARAM_DEMO"]);
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
                            $("#APIMgr_concurrencyLimit").val(maxNumber);
                        }else if("waitTimeLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#APIMgr_waitTimeLimit").val(maxNumber);
                        }else if("loadBalance" == obj["FILTER_TYPE"]){
                            var loadMethod = JSON.parse(obj["FILTER_VALUE"])["loadMethod"];
                        }else if("requestParamConvert" == obj["FILTER_TYPE"]){
                            $("#APIMgr_requestParamConvert").val(obj["FILTER_VALUE"]);
                        }else if("responseConvert" == obj["FILTER_TYPE"]){
                            $("#APIMgr_responseParamConvert").val(obj["FILTER_VALUE"]);
                        }else if("requestStyle" == obj["FILTER_TYPE"]){
                            /*var value = obj["FILTER_VALUE"];
                            api_requestStyle.setValue(value);
                            api_requestStyle.getInst().trigger("change");*/
                        }else if("wsdlPath" == obj["FILTER_TYPE"]){
                            $("#APIMgr_wsdlPath").val(obj["FILTER_VALUE"]);
                        }else if("wsdl" == obj["FILTER_TYPE"]){
                            var value = JSON.parse(obj["FILTER_VALUE"]);
                            $("#APIMgr_services").val(value["service"]);
                            $("#APIMgr_serviceBinds").val(value["bind"]);
                            $("#APIMgr_bindOperations").val(value["op"]);
                            $("#APIMgr_soapDemo").val(value["soapDemo"]);
                        } else if("extendFilter" == obj["FILTER_TYPE"]){     //自定义过滤器
                            $("#APIMgr_extendFilter").val(obj["FILTER_VALUE"]);
                        }
                    }
                }
            };
            var param = {"apiId": apiId};
            common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#APIMgr"));

        }
    };
    //删除字段过滤table
    deleteNode = function (obj) {
        $(obj).parent().remove();
        //重置table
        var tableObj = $("#APIMgr_outParamFilterGrid").find("tbody").find("td");
        $("#APIMgr_outParamFilterGrid").find("tbody").empty();
        var count = tableObj.length;
        if(count == 1){
            $("#APIMgr_outParamFilterGrid").css("width","25%");
        }else if(count == 2){
            $("#APIMgr_outParamFilterGrid").css("width","50%");
        }else if(count == 3){
            $("#APIMgr_outParamFilterGrid").css("width","75%");
        }else if(count >= 4){
            $("#APIMgr_outParamFilterGrid").css("width","100%");
        }
        tableObj.each(function (index,obj) {
            if(index==0 || index %4 ==0){
                $("#APIMgr_outParamFilterGrid").append("<tr></tr>");
            }
            $("#APIMgr_outParamFilterGrid").find("tbody").find("tr:last").append("<td style='border: 0px;padding-left: 0px;padding-bottom:0px'><input class='k-textbox' style='width:85%' value='"+$(obj).find("input").val()+"' onchange='changeNode(this)'/><i class='fa fa-trash-o fa_icon' style='vertical-align: middle' title='删除' onclick='deleteNode(this)'></i></td>");
        });
        $("#APIMgr_isAddHis").val("yes");
    };
    changeNode = function (obj) {
        $("#APIMgr_isAddHis").val("yes");
    };
    // 入参转换设置
    var APIMgr_inparamSettingPopupWin = {
        inst: {},
        optionObj: {
            actions: [],
            minWidth: 500,
            minHeight: 250,
            maxWidth: "",
            maxHeight: "",
            title: "入参设置",
            content: "biz/API/APIMgr/html/apiInparamSetting_popup.html"
        },
        getInst: function () {
            if (APIMgr_inparamSettingPopupWin.inst) {
                APIMgr_inparamSettingPopupWin.inst = new wandaComp.wandaWindow("APIMgr_inparamSetting", "APIMgr_inparamSettingPopup", APIMgr_inparamSettingPopupWin.optionObj);
            }
            return APIMgr_inparamSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        openByCondition:function () {
            var APIMgr_contentProto = $("#APIMgr_contentProto").val();
            if(APIMgr_contentProto == "4"){
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
            var requestParamValue = $("#APIMgr_requestParamConvert").val();
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
                $('input[name="APIMgr_inParamType"][value='+dataJson["processModel"]+']').prop("checked", "checked");
                APIMgr_inparamSettingPopupWin.initValues = requestParamValue;
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#APIMgr_inparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var APIMgr_isAdd = $("#APIMgr_isAdd").val();
            if(APIMgr_isAdd == "false"){
                $("#APIMgr_requestParamConvert").val(APIMgr_inparamSettingPopupWin.initValues);
            }
            var plusPopup = $("#APIMgr_inparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            APIMgr_inparamSettingPopupWin.getInst().init(function () {
                var initFun = inParam_popup.init;
                if(APIMgr_inparamSettingPopupWin.openByCondition()){
                    common.initExeByAttr("APIMgr_inparamSettingPopup", "opt='submit'", function () {
                        if(!isOk){
                            initFun("APIMgr_inparamSettingPopup");
                        }
                    });
                    APIMgr_inparamSettingPopupWin.setSubPageValue();
                    isOk = true;
                }else{
                    return false;
                }
            });
            APIMgr_inparamSettingPopupWin.getInst().callBack("opt='submit'", APIMgr_inparamSettingPopupWin.submitBtnCallBack, true);
            APIMgr_inparamSettingPopupWin.getInst().callBack("opt='cancel'", APIMgr_inparamSettingPopupWin.cancelBtnCallBack);
        }
    };
    //出参转换设置
    var APIMgr_outparamSettingPopupWin = {
        inst: {},
        optionObj: {
            actions: [],
            minWidth: 500,
            minHeight: 250,
            maxWidth: "",
            maxHeight: "",
            title: "出参设置",
            content: "biz/API/APIMgr/html/apiOutparamSetting_popup.html"
        },
        getInst: function () {
            if (APIMgr_outparamSettingPopupWin.inst) {
                APIMgr_outparamSettingPopupWin.inst = new wandaComp.wandaWindow("APIMgr_outparamSetting", "APIMgr_outparamSettingPopup", APIMgr_outparamSettingPopupWin.optionObj);
            }
            return APIMgr_outparamSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        openByCondition:function () {
            var APIMgr_contentProto = $("#APIMgr_contentProto").val();
            if(APIMgr_contentProto == "4"){
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
            var responseValue = $("#APIMgr_responseParamConvert").val();
            if(responseValue && responseValue != ""){
                outParam_popup.outParam.getInst().setDataSource(null);
                $("#APIMgr_outParamFilterGrid").find("tbody").html("");
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
                        $("#APIMgr_outParamFilterGrid").css("width","25%");
                    }else if(count == 2){
                        $("#APIMgr_outParamFilterGrid").css("width","50%");
                    }else if(count == 3){
                        $("#APIMgr_outParamFilterGrid").css("width","75%");
                    }else if(count >= 4){
                        $("#APIMgr_outParamFilterGrid").css("width","100%");
                    }
                    if(count>0){
                        for(var m=0;m<count;m++){
                            if(m==0 || m%4 ==0){
                                $("#APIMgr_outParamFilterGrid").append("<tr></tr>");
                            }
                            var item = value[m];
                            item = item.trim().replace("\"","").replace("\"","");
                            $("#APIMgr_outParamFilterGrid").find("tbody").find("tr:last").append("<td style='border: 0px;padding-left: 0px;padding-bottom:0px'><input class='k-textbox' style='width:85%' value='"+item+"' onchange='changeNode(this)'/><i class='fa fa-trash-o fa_icon' style='vertical-align: middle' title='删除' onclick='deleteNode(this)'></i></td>");
                        }
                    }
                }
                APIMgr_outparamSettingPopupWin.initValues = responseValue;
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#APIMgr_outparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var APIMgr_isAdd = $("#APIMgr_isAdd").val();
            if(APIMgr_isAdd == "false"){
                $("#APIMgr_responseParamConvert").val(APIMgr_outparamSettingPopupWin.initValues);
            }
            var plusPopup = $("#APIMgr_outparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            APIMgr_outparamSettingPopupWin.getInst().init(function () {
                var initFun = outParam_popup.init;
                if(APIMgr_outparamSettingPopupWin.openByCondition()){
                    common.initExeByAttr("APIMgr_outparamSettingPopup", "opt='submit'", function () {
                        if (!isOk) {
                            initFun("APIMgr_outparamSettingPopup");
                        }
                    });
                    APIMgr_outparamSettingPopupWin.setSubPageValue();
                    isOk = true;
                }else{
                    return false;
                }
            });
            APIMgr_outparamSettingPopupWin.getInst().callBack("opt='submit'", APIMgr_outparamSettingPopupWin.submitBtnCallBack, true);
            APIMgr_outparamSettingPopupWin.getInst().callBack("opt='cancel'", APIMgr_outparamSettingPopupWin.cancelBtnCallBack);
        }
    };
    //熔断配置
    var APIMgr_rongduanSettingPopupWin = {
        inst: {},
        optionObj: {
            actions: [],
            minWidth: 500,
            minHeight: 150,
            maxWidth: "",
            maxHeight: "",
            title: "熔断配置",
            content: "biz/API/APIMgr/html/apiRongduanSetting_popup.html"
        },
        getInst: function () {
            if (APIMgr_rongduanSettingPopupWin.inst) {
                APIMgr_rongduanSettingPopupWin.inst = new wandaComp.wandaWindow("APIMgr_rongduanSetting", "APIMgr_rongduanSettingPopup", APIMgr_rongduanSettingPopupWin.optionObj);
            }
            return APIMgr_rongduanSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var APIMgr_waitTimeLimit = $("#APIMgr_waitTimeLimit").val();
            var APIMgr_concurrencyLimit = $("#APIMgr_concurrencyLimit").val();
            if(APIMgr_waitTimeLimit != ""){
                rongduan_popup.waitTime.getInst().value(APIMgr_waitTimeLimit);
                rongduan_popup.waitTime.value = APIMgr_waitTimeLimit;
            }
            if(APIMgr_concurrencyLimit  != ""){
                rongduan_popup.concuy.getInst().value(APIMgr_concurrencyLimit);
                rongduan_popup.concuy.value = APIMgr_concurrencyLimit;
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#APIMgr_rongduanSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#APIMgr_rongduanSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            APIMgr_rongduanSettingPopupWin.getInst().init(function () {
                var initFun = rongduan_popup.init;
                common.initExeByAttr("APIMgr_rongduanSettingPopup", "opt='submit'", function () {
                    if(!isOk){
                        initFun("APIMgr_rongduanSettingPopup");
                    }
                });
                APIMgr_rongduanSettingPopupWin.setSubPageValue();
                isOk = true;
            });
            APIMgr_rongduanSettingPopupWin.getInst().callBack("opt='submit'", APIMgr_rongduanSettingPopupWin.submitBtnCallBack, true);
            APIMgr_rongduanSettingPopupWin.getInst().callBack("opt='cancel'", APIMgr_rongduanSettingPopupWin.cancelBtnCallBack);
        }
    };

    //自定义过滤器
    var APIMgr_customSettingPopupWin = {
        inst: {},
        optionObj: {
            actions:[],
            minWidth: 500,
            minHeight: 150,
            maxWidth: "",
            maxHeight: "",
            title: "扩展插件",
            content: "biz/API/APIMgr/html/apiCustomSetting_popup.html"
        },
        getInst: function () {
            if (APIMgr_customSettingPopupWin.inst) {
                APIMgr_customSettingPopupWin.inst = new wandaComp.wandaWindow("APIMgr_customSetting", "APIMgr_customSettingPopup", APIMgr_customSettingPopupWin.optionObj);
            }
            return APIMgr_customSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        initValues:"",
        setSubPageValue: function () {
            //初始化自定义过滤器的值
            var APIMgr_extendFilter = $("#APIMgr_extendFilter").val();
            if(APIMgr_extendFilter && APIMgr_extendFilter.length > 0){
                var APIMgr_extendFilter_json = JSON.parse(APIMgr_extendFilter);
                custom_popup.inConst.addDataSource(APIMgr_extendFilter_json);
                APIMgr_customSettingPopupWin.initValues = APIMgr_extendFilter;
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#APIMgr_customSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var APIMgr_isAdd = $("#APIMgr_isAdd").val();
            if(APIMgr_isAdd == "false"){
                $("#APIMgr_extendFilter").val(APIMgr_customSettingPopupWin.initValues);
            }
            var plusPopup = $("#APIMgr_customSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            var isOk = false;
            APIMgr_customSettingPopupWin.getInst().init(function () {
                var initFun = custom_popup.init;
                common.initExeByAttr("APIMgr_customSettingPopup", "opt='submit'", function () {
                    if(!isOk){
                        initFun("APIMgr_customSettingPopup");
                    }
                });
                APIMgr_customSettingPopupWin.setSubPageValue();
                isOk = true;
            });
            APIMgr_customSettingPopupWin.getInst().callBack("opt='submit'", APIMgr_customSettingPopupWin.submitBtnCallBack, true);
            APIMgr_customSettingPopupWin.getInst().callBack("opt='cancel'", APIMgr_customSettingPopupWin.cancelBtnCallBack);
        }
    };

    //清除数据
    var clearData = function () {
        api_serverName.value = "";
        api_state.value = "";
        api_method.value = "";
        api_transProto.value = "";
        api_contentProto.value = "";
        api_desContentProto.value = "";
        api_desMethod.value = "";
        api_desTransProto.value = "";
    }
    var initParam = function () {
        var _params = common.getRouterParams();
        $("#APIMgr_isAdd").val(_params["isAdd"]);
        validate.init();
        api_serverName.init();
        api_state.init();
        api_method.init();
        api_transProto.init();
        api_contentProto.init();
        api_tabstrip.init();
        api_desContentProto.init();
        api_desMethod.init();
        api_desTransProto.init();
        descPathGrid.init();
        descPathGrid_dataAdd.init();
        api_ispublic.init();
        APIMgr_saveCloseBtn.init();
        APIMgr_closeBtn.init();
        APIMgr_nextBtn.init();
        APIMgr_preBtn.init();
        api_wsdl_EditPopupWin.init();

        APIMgr_inparamSettingPopupWin.init();
        APIMgr_outparamSettingPopupWin.init();
        APIMgr_rongduanSettingPopupWin.init();
        APIMgr_customSettingPopupWin.init();

        if (_params["isAdd"] == "false") {
            $("#APIMgr_apiId").val(_params["apiId"]);
            apiDetail.init(_params["apiId"]);
            $("#APIMgr_state_div").show();
            $("#APIMgr input:not([type])").bind("input propertychange",function(){
                $("#APIMgr_isAddHis").val("yes");
            });
            $("#APIMgr textarea").bind("input propertychange",function(){
                $("#APIMgr_isAddHis").val("yes");
            });

        } else {
            var serverId = _params["serverId"];
            if(serverId && serverId.length>0){
                api_serverName.setValue(serverId);
            }
            $("#APIMgr_state_div").hide();
            api_ip.init("HTTP");
        }
    }
    var init = function () {
        wandaComp.elementControl($("#APIMgr"));
        initParam();
    };
    return {
        init: init
    }
});

