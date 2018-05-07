define(["jquery", "common","flowchart","wandaComp", "wandaCompR","biz/test/linkOperate_popup","biz/test/descApi_popup","biz/test/decide_popup"], function ($, common,flowchart,wandaComp, wandaCompR,linkOperatePopup,descApiPopup,decidePopup) {
    var validate = {
        helper:null,
        init:function (parentIds) {
            validate.helper =  wandaComp.commonValidator("composeApiMgr");
        }
    }
    //应用名称
    var composeApiMgr_serverName = {
        value:"",
        getInst: function () {
            return $("#composeApiMgr_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgr_serverName.value = value;
            composeApiMgr_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#composeApiMgr_serverName").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgr_serverName.value){
                composeApiMgr_serverName.getInst().value(composeApiMgr_serverName.value);
            }
        },
        init: function () {
            $("#composeApiMgr_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "--请选择--",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#composeApiMgr_serverName-list").css("height","auto");
                    $("#composeApiMgr_serverName-list").css("overflow","hidden");
                }
            });
            var param = {"isAuth":"yes"};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, composeApiMgr_serverName.successFun, null, null, $("#composeApiMgr"));
        }
    };
    //状态
    var composeApiMgr_state = {
        value:"",
        getInst: function () {
            return $("#composeApiMgr_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgr_state.value = value;
            composeApiMgr_state.getInst().value(value);
        },
        successFun:function (data) {
            $("#composeApiMgr_state").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgr_state.value){
                composeApiMgr_state.getInst().value(composeApiMgr_state.value);
            }
        },
        init: function () {
            $("#composeApiMgr_state").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgr_state.successFun, null, null, $("#composeApiMgr"));
        }
    };
    //是否公开
    var composeApiMgr_ispublic = {
        value:"",
        getInst: function () {
            return $("#composeApiMgr_ispublic").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgr_ispublic.value = value;
            composeApiMgr_ispublic.getInst().value(value);
        },
        successFun:function (data) {
            $("#composeApiMgr_ispublic").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgr_ispublic.value){
                composeApiMgr_ispublic.getInst().value(composeApiMgr_ispublic.value);
            }
            if($("#composeApiMgr_isAdd").val() != "false"){
                composeApiMgr_ispublic.getInst().select(1);
            }
        },
        init: function () {
            $("#composeApiMgr_ispublic").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != composeApiMgr_ispublic.value){
                        $("#composeApiMgr_isAddHis").val("yes");
                    }else{
                        $("#composeApiMgr_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "ispublic"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgr_ispublic.successFun, null, null, $("#composeApiMgr"));
        }
    };
    // 传输协议
    var composeApiMgr_transProto = {
        value:"",
        getInst: function () {
            return $("#composeApiMgr_transProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgr_transProto.value = value;
            composeApiMgr_transProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#composeApiMgr_transProto").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgr_transProto.value){
                composeApiMgr_transProto.getInst().value(composeApiMgr_transProto.value);
            }else{
                if($("#composeApiMgr_isAdd").val()!="false"){
                    composeApiMgr_transProto.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#composeApiMgr_transProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != composeApiMgr_transProto.value){
                        $("#composeApiMgr_isAddHis").val("yes");
                    }else{
                        $("#composeApiMgr_isAddHis").val("no");
                    }
                    if("1" == value){
                        composeApiMgr_ip.init("HTTP");
                    }else{
                        composeApiMgr_ip.init("HTTPS");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgr_transProto.successFun, null, null, $("#composeApiMgr"));
        }
    };
    // ip地址获取
    var composeApiMgr_ip = {
        successFun: function (data) {
            $("#composeApiMgr_ip").val(data["IP"]);
            $("#composeApiMgr_port").val(data["PORT"]);
            $("#composeApiMgr_apiaddrid").val(data["APIADDRID"]);
        },
        init: function (addrTrans) {
            var param = {"addrTrans": addrTrans};
            common.ajaxGet("api/gateApi/getApiAddr", param, composeApiMgr_ip.successFun, null, null, $("#composeApiMgr"));
        }
    };
    // Body协议
    var composeApiMgr_contentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#composeApiMgr_contentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgr_contentProto.value = value;
            composeApiMgr_contentProto.getInst().value(value);
        },
        successFun:function (data) {
            var newDataSource = [];
            for(var i = 0 ; i < data.length; i++){
                if(data[i]["value"] != 4){
                    newDataSource.push(data[i]);
                }
            }
            composeApiMgr_contentProto.dataSource = newDataSource;
            composeApiMgr_contentProto.getInst().setDataSource(newDataSource);
            if(composeApiMgr_contentProto.value){
                composeApiMgr_contentProto.getInst().value(composeApiMgr_contentProto.value);
            }else{
                if($("#composeApiMgr_isAdd").val()!="false"){
                    composeApiMgr_contentProto.getInst().select(0);
                }
            }
        },
        changeDataSource:function (methodValue,flag) {
            if("2" == methodValue){  //post的时候为全部
                composeApiMgr_contentProto.getInst().setDataSource(composeApiMgr_contentProto.dataSource);
            }else{  //get delet put 除去soap
                var newDataSource = [];
                $.each(composeApiMgr_contentProto.dataSource,function (index,value) {
                    if(index!=1&&index!=4){
                        newDataSource.push(value);
                    }
                });
                composeApiMgr_contentProto.getInst().setDataSource(newDataSource);
                var contentProto = $("#composeApiMgr_contentProto").val();
                if(flag){
                    var inArray = false;
                    for(var i = 0 ; i < newDataSource.length;i++){
                        if(newDataSource[i]["value"] == contentProto){
                            inArray = true;
                        }
                    }
                    if(!inArray){
                        composeApiMgr_contentProto.getInst().select(0);
                    }
                }
            }
        },
        changeInPlaceholder:function (value) {
            if("1" == value){
                $("#composeApiMgr_inparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
                $("#composeApiMgr_outparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
            }else if("2" == value){
                $("#composeApiMgr_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n" +
                    "<s11:Body>\n" +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>\n<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>\n </ns1:param>\n " +
                    "</ns1:getSupportCity>\n " +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#composeApiMgr_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
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
                $("#composeApiMgr_inparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
                $("#composeApiMgr_outparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
            }else if("4" == value){
                $("#composeApiMgr_inparamDemo").attr("placeholder","This is a inParam demo");
                $("#composeApiMgr_outparamDemo").attr("placeholder","This is a outParam demo");
            }else if("5" == value){
                $("#composeApiMgr_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n " +
                    "<s11:Body>\n " +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt; </ns1:param> \n" +
                    "</ns1:getSupportCity> \n" +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#composeApiMgr_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
                    "<soap:Body>\n" +
                    "<ns2:sayStrResponse xmlns:ns2='ws.wondersgroup.com'>\n" +
                    "<return>&lt;Response&gt; &lt;MessageHeader&gt; &lt;code&gt;0&lt;/code&gt; &lt;desc&gt;成功&lt;/desc&gt; &lt;/MessageHeader&gt; &lt;/Response&gt;</return>\n" +
                    "</ns2:sayStrResponse>\n" +
                    "</soap:Body>\n" +
                    "</soap:Envelope>");
            }else if("6" == value){
                $("#composeApiMgr_inparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
                $("#composeApiMgr_outparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
            }
            if($("#composeApiMgr_method").val()=="1"){
                $("#composeApiMgr_inparamDemo").attr("placeholder","id=1&name=test");
            }
        },
        init: function () {
            $("#composeApiMgr_contentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    composeApiMgr_contentProto.changeInPlaceholder(value);
                    if(value != composeApiMgr_contentProto.value){
                        $("#composeApiMgr_isAddHis").val("yes");
                    }else{
                        $("#composeApiMgr_isAddHis").val("no");
                    }
                    //composeApiMgr_desContentProto.changeDataSource(value,true);
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgr_contentProto.successFun, null, null, $("#composeApiMgr"));
        }
    };
    //API方法
    var composeApiMgr_method = {
        value:"",
        getInst: function () {
            return $("#composeApiMgr_method").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgr_method.value = value;
            composeApiMgr_method.getInst().value(value);
        },
        successFun:function (data) {
            $("#composeApiMgr_method").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgr_method.value){
                composeApiMgr_method.getInst().value(composeApiMgr_method.value);
            }
            if($("#composeApiMgr_isAdd").val() != "false"){
                composeApiMgr_method.getInst().select(1);
            }
        },
        init: function () {
            $("#composeApiMgr_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    composeApiMgr_contentProto.changeDataSource(value,true);
                    composeApiMgr_contentProto.changeInPlaceholder($("#composeApiMgr_contentProto").val());
                    if(value != composeApiMgr_method.value){
                        $("#composeApiMgr_isAddHis").val("yes");
                    }else{
                        $("#composeApiMgr_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgr_method.successFun, null, null, $("#composeApiMgr"));
        }
    };
    //入参tabstrip
    var composeApiMgr_tabstrip = {
        init:function () {
            $("#composeApiMgr_inparamDemoTitle").click(function () {
                $("#composeApiMgr_inparamDemoContent").slideToggle("slow",function () {
                    if($('#composeApiMgr_inparamDemoContent').css('display')=="none"){
                        $("#composeApiMgr_inparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#composeApiMgr_inparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#composeApiMgr_outparamDemoTitle").click(function () {
                $("#composeApiMgr_outparamDemoContent").slideToggle("slow",function () {
                    if($('#composeApiMgr_outparamDemoContent').css('display')=="none"){
                        $("#composeApiMgr_outparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#composeApiMgr_outparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#composeApiMgr_descHighParamTitle").click(function () {
                $("#composeApiMgr_descHighParamContent").slideToggle("slow",function () {
                    if($('#descHighParamContent').css('display')=="none"){
                        $("#composeApiMgr_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#composeApiMgr_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
        }
    };

    //校验整个流程是否正确
    var checkRelation = function (gateLinks) {
        var decideChilds = [], descChilds = [],ifStart = false,ifEnd = false,result = true;
        $(".flowchart-operator").each(function (index, obj) {
            var id = $(this).attr("id");
            var data = $("#"+id).attr("data");
            var type = id.split("_")[2];
            var title = $('#composeApiMgr_bianpai_setting').flowchart('getOperatorTitle',id);
            var startFlag = false,endFlag = false,startCount = 0,endCount = 0;  //是否有 输入和输出连线以及输入输出个数
            for(var key in gateLinks){
                var obj = gateLinks[key];
                if(id == obj["fromOperator"]){
                    startFlag = true;
                    startCount++;
                }
            }
            for(var key in gateLinks){
                var obj = gateLinks[key];
                if(id == obj["toOperator"]){
                    endFlag = true;
                    endCount++;
                }
            }
            if(type == "start"){
                if(ifStart){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "一个完整的流程有且只有一个开始节点！"
                    });
                    result = false;
                }
                ifStart = true;
                if(!startFlag){
                    common.jqConfirm.alert({
                        title: 0,
                        content: title+"节点没有输出连线！"
                    });
                    result = false;
                }
                if(startCount>1){
                    common.jqConfirm.alert({
                        title: 0,
                        content: title+"节点只能有一个输出！"
                    });
                    result = false;
                }
            }else if(type == "end"){
                if(ifEnd){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "一个完整的流程有且只有一个结束节点！"
                    });
                    result = false;
                }
                ifEnd = true;
                if(!endFlag){
                    common.jqConfirm.alert({
                        title: 0,
                        content: title+"节点没有输入连线！"
                    });
                    result = false;
                }
            }else {
                if(data == undefined || data == null || data.length == 0){
                    var message = (type == "decide")?"判断":"API";
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请先配置"+message+"节点！"
                    });
                    result = false;
                }else{
                    if(!startFlag && endFlag){
                        common.jqConfirm.alert({
                            title: 0,
                            content: title+"节点没有输出连线！"
                        });
                        result = false;
                    }else if(startFlag && !endFlag){
                        common.jqConfirm.alert({
                            title: 0,
                            content: title+"节点没有输入连线！"
                        });
                        result = false;
                    }else if(!startFlag && !endFlag){
                        common.jqConfirm.alert({
                            title: 0,
                            content: title+"节点没有输入输出连线！"
                        });
                        result = false;
                    }
                    if(type == "process"){
                        if(startCount >1){
                            common.jqConfirm.alert({
                                title: 0,
                                content: title+"节点只能有一个输出！"
                            });
                            result = false;
                        }
                        var composeApiMgr_contentProto = $("#composeApiMgr_contentProto").val();
                        var contProto = JSON.parse(data)["contProto"];
                        if(composeApiMgr_contentProto == "2"){
                            if(contProto != "2"){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: title+"节点Body协议只能为SOAP！"
                                });
                                result = false;
                            }
                        }
                        if(composeApiMgr_contentProto == "5"){
                            if(contProto != "5"){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: title+"节点Body协议只能为SOAP_TEXT！"
                                });
                                result = false;
                            }
                        }
                    }
                }
            }
        });
        if(!ifStart){
            common.jqConfirm.alert({
                title: 0,
                content: "一个完整的流程有且只有一个开始节点！"
            });
            result = false;
        }
        if(!ifEnd){
            common.jqConfirm.alert({
                title: 0,
                content: "一个完整的流程有且只有一个结束节点！"
            });
            result = false;
        }
        $(".flowchart-link").each(function (index,obj) {
            var key = $(this).attr("data-link_id");
            var beforeLinks = findAllLinkBeforeThis(key);  //获取当前线前面的连线
            var lastElementName = "下节点入参";
            var ifEndLink = checkLinkIfEnd(key);   //判断是否是结束连线
            if(ifEndLink){
                lastElementName = "输出参数";
            }
            var resultLinks = [];
            for(var m = 0;m < beforeLinks.length; m++){ //之前的连线
                var data = $("#create_operator_link_"+beforeLinks[m]).attr("data");
                if(data){
                    var dataJson = JSON.parse(data);
                    if(dataJson && dataJson["sysParams"]){
                        for(var j = 0; j < dataJson["sysParams"].length; j++){
                            resultLinks.push(dataJson["sysParams"][j]["paramName"]);
                        }
                    }
                }
            }
            var currentData = $(this).attr("data");  //当前的连线
            if(currentData){
                var currentJson = JSON.parse(currentData);
                if(currentJson){
                    for(var j = 0; j < currentJson["sysParams"].length; j++){
                        resultLinks.push(currentJson["sysParams"][j]["paramName"]);
                    }
                    for(var j = 0; j < currentJson["inParams"].length; j++){
                        if(currentJson["inParams"][j]["paramType"] == "3"){
                            if($.inArray(currentJson["inParams"][j]["paramValue"], resultLinks) == -1){
                                common.jqConfirm.alert({
                                    title: 0,
                                    content: "参数配置："+key+"，"+lastElementName+"中的参数值\""+currentJson["inParams"][j]["paramValue"]+"\"在系统参数中不存在！"
                                });
                                result = false;
                            }
                        }

                    }
                }

            }
        });
        return result;
    };

    // 判断节点的所有输出连线都必须先设置
    var checkDecideLinkData = function (operatorId) {
        var toOperator = [];
        var gateInitData = $('#composeApiMgr_bianpai_setting').flowchart('getData');
        var gateLinks = gateInitData["links"];
        for (var key in gateLinks) {
            var obj = gateLinks[key];
            var toId = obj["toOperator"];
            var toType = toId.split("_")[2];

            if (obj["fromOperator"] == operatorId) {
                if (toType == "end") {
                    toOperator.push({
                        "id": toId,
                        "collectName": $('#composeApiMgr_bianpai_setting').flowchart('getOperatorTitle', toId),
                        "type": toType
                    });
                } else {
                    if ($("#" + toId).attr("data")) {
                        toOperator.push({
                            "id": toId,
                            "collectName": $('#composeApiMgr_bianpai_setting').flowchart('getOperatorTitle', toId),
                            "type": toType
                        });
                    } else {
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请确保此节点的输出节点都已配置！"
                        });
                        return false;
                    }
                }

            }
        }
        return toOperator;
    };

    // 判断是否是判断紧跟的连线
    var checkDecideLink = function (key) {
        var gateInitData = $('#composeApiMgr_bianpai_setting').flowchart('getData');
        var gateLinks = gateInitData["links"];
        var result = false;
        var startEle = gateLinks[key]["fromOperator"];
        if(startEle.split("_")[2] == "decide"){
            result = true;
        }
        return result;
    }

    // 判断当前连线是否是结束节点
    var checkLinkIfEnd = function (key) {
        var gateInitData = $('#composeApiMgr_bianpai_setting').flowchart('getData');
        var gateLinks = gateInitData["links"];
        var result = false;
        var endEle = gateLinks[key]["toOperator"];
        if(endEle.split("_")[2] == "end"){
            result = true;
        }
        return result;
    };
    
    // 获取当前连线前面的所有连线
    var findAllLinkBeforeThis = function (key,start) {
        var gateInitData = $('#composeApiMgr_bianpai_setting').flowchart('getData');
        var gateLinks = gateInitData["links"];
        var resultLinks = [],startEle = "";
        if(key == undefined || key == "" || key == null){
            startEle = start;
        }else{
            startEle = gateLinks[key]["fromOperator"];
        }

        var getResult = function (startEle) {
            for(var k in gateLinks){
                var obj = gateLinks[k];
                if(obj["toOperator"] == startEle){
                    if($.inArray(k, resultLinks) == -1){
                        resultLinks.push(k);
                    }
                    getResult(obj["fromOperator"]);
                }
            }
        }
        getResult(startEle);
        return resultLinks;
    }

    // 流程图最终生成tree结构
    var getRelation2 = function (gateDescLinksArry, startId, key) {
        var descJSON = {};
        for (var i = 0; i < gateDescLinksArry.length; i++) {
            if (gateDescLinksArry[i]["id"] == startId) {
                descJSON["id"] = gateDescLinksArry[i]["id"];
                descJSON["type"] = gateDescLinksArry[i]["id"].split("_")[2];
                if (key) {
                    descJSON["key"] = key;
                    descJSON["link"] = $("#create_operator_link_" + key).attr("data");
                    descJSON["data"] = $("#" + gateDescLinksArry[i]["id"]).attr("data");
                }

                if (descJSON["childs"] == undefined) {
                    descJSON["childs"] = [];
                }
                if (gateDescLinksArry[i]["to"].indexOf("end") != -1) {
                    descJSON["childs"].push({
                        "id": gateDescLinksArry[i]["to"],
                        "type": "end",
                        "key": gateDescLinksArry[i]["key"],
                        "link": $("#create_operator_link_" + gateDescLinksArry[i]["key"]).attr("data"),
                        "data": $("#" + gateDescLinksArry[i]["to"]).attr("data")
                    })
                } else {
                    descJSON["childs"].push(getRelation2(gateDescLinksArry, gateDescLinksArry[i]["to"], gateDescLinksArry[i]["key"]));
                }
            }
        }
        return descJSON;
    };

    // 给流程图赋值回显
    var setRelationData = function (dataArry) {
        if(dataArry){
            for(var i=0;i<dataArry.length;i++){
                var id = dataArry[i]["id"];
                var key = dataArry[i]["key"];
                var data = dataArry[i]["data"];
                var link = dataArry[i]["link"];
                if(data){
                    $("#"+id).attr("data",data);
                }
                if(link){
                    $("#create_operator_link_"+key).attr("data",link);
                }
                if(dataArry[i]["childs"]){
                    setRelationData(dataArry[i]["childs"]);
                }
            }
        }
    }

    //封装参数
    var getFormValue = function () {
        var composeApiMgr_inparam = {},gateDesaddr = [],gateFilterApi = {},protocolConvert = {},requestParamConvert = {},
            responseConvert = {},wsdl = {},responseNodeRemove = "",delPath = [];
        var isAdd = $("#composeApiMgr_isAdd").val();
        var composeApiMgr_isAddHis = $("#composeApiMgr_isAddHis").val();
        var composeApiMgr_apiId = $("#composeApiMgr_apiId").val();
        var composeApiMgr_serverName = $("#composeApiMgr_serverName").val();
        var composeApiMgr_name = $("#composeApiMgr_name").val();
        var composeApiMgr_state = $("#composeApiMgr_state").val();
        var composeApiMgr_desc = $("#composeApiMgr_desc").val();
        var composeApiMgr_path = $("#composeApiMgr_path").val();
        var composeApiMgr_transProto = $("#composeApiMgr_transProto").val();
        var composeApiMgr_contentProto = $("#composeApiMgr_contentProto").val();
        var composeApiMgr_method = $("#composeApiMgr_method").val();
        var composeApiMgr_waitTimeLimit = $("#APIRongduanSetting_waitTimeLimit").val();
        var composeApiMgr_concurrencyLimit = $("#APIRongduanSetting_concurrencyLimit").val();
        var composeApiMgr_inparamDemo = $("#composeApiMgr_inparamDemo").val();
        var composeApiMgr_inparamDemo1 = $("#composeApiMgr_inparamDemo1").val();
        var composeApiMgr_inparamDemo2 = $("#composeApiMgr_inparamDemo2").val();
        var composeApiMgr_outparamDemo = $("#composeApiMgr_outparamDemo").val();
        var composeApiMgr_desTransProto = $("#composeApiMgr_desTransProto").val();
        var composeApiMgr_desContentProto = $("#composeApiMgr_desContentProto").val();
        var composeApiMgr_desMethod = $("#composeApiMgr_desMethod").val();
        var composeApiMgr_loadBalance = $("#composeApiMgr_loadBalance").val();
        var composeApiMgr_wsdlPath = $("#composeApiMgr_wsdlPath").val();
        var composeApiMgr_services = $("#composeApiMgr_services").val();
        var composeApiMgr_serviceBinds = $("#composeApiMgr_serviceBinds").val();
        var composeApiMgr_bindOperations = $("#composeApiMgr_bindOperations").val();
        var composeApiMgr_apiaddrid = $("#composeApiMgr_apiaddrid").val();
        var composeApiMgr_ispublic = $("#composeApiMgr_ispublic").val();

        //入参分类
        composeApiMgr_inparam["Body"] = composeApiMgr_inparamDemo;

        if(composeApiMgr_path.charAt(0)!="/"){
            composeApiMgr_path = "/"+composeApiMgr_path;
        }
        if(composeApiMgr_desContentProto == "2" || composeApiMgr_desContentProto == "5"){
            if(composeApiMgr_wsdlPath==""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入WSDL地址进行测试！"
                });
                return false;
            }else if(composeApiMgr_services== "" ||composeApiMgr_serviceBinds=="" ||composeApiMgr_bindOperations==""){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请输入正确的WSDL地址！"
                });
                return false;
            }
        }
        //入参常量
        requestParamConvert["addPath"] = [];
        requestParamConvert["pathConvert"] = [];
        gateFilterApi["requestParamConvert"] = JSON.stringify(requestParamConvert); //入参转换过滤器

        responseConvert["pathConvert"] = [];
        responseConvert["delPath"] = delPath;
        gateFilterApi["responseConvert"]= JSON.stringify(responseConvert);   //出参转换过滤器

        var loadBalance = {
            "loadMethod":"2"
        };
        gateFilterApi["loadBalance"] = JSON.stringify(loadBalance); //负载过滤器

        var waitTimeLimit = {
            "maxNumber":"180"
        };
        gateFilterApi["waitTimeLimit"] = JSON.stringify(waitTimeLimit); //超时过滤器

        var concurrencyLimit = {
            "maxNumber":"100"
        };
        gateFilterApi["concurrencyLimit"] = JSON.stringify(concurrencyLimit);  //并发过滤器

        protocolConvert["srcProtocol"] = {
            "trans": composeApiMgr_transProto,
            "content": composeApiMgr_contentProto,
            "method": composeApiMgr_method
        }
        protocolConvert["desProtocol"] = {
            "trans": composeApiMgr_desTransProto,
            "content": composeApiMgr_desContentProto,
            "method": composeApiMgr_desMethod
        }
        gateFilterApi["protocolConvert"] = JSON.stringify(protocolConvert);

        //编排流程数据
        var gateInitData = $('#composeApiMgr_bianpai_setting').flowchart('getData');
        var gateLinks = gateInitData["links"];

        if(checkRelation(gateLinks)){
            var gateDescLinksArry = [], startId = "";
            for(var key in gateLinks){
                var text = gateLinks[key];
                var type = text["fromOperator"].split("_")[2];
                if("start" == type){
                    startId = text["fromOperator"];
                }
                gateDescLinksArry.push({
                    "id":text["fromOperator"],
                    "to":text["toOperator"],
                    "key":key
                });
            }
            var treeData = getRelation2(gateDescLinksArry,startId);
            gateFilterApi["combinApi"] = JSON.stringify(treeData);  //以后再转成string

            var param = {
                "gateApi":{
                    "serviceId":composeApiMgr_serverName,
                    "apiName":composeApiMgr_name,
                    "apiDesc":composeApiMgr_desc,
                    "apiPath":composeApiMgr_path,
                    "apiTransProto":composeApiMgr_transProto,
                    "apiContentProto":composeApiMgr_contentProto,
                    "apiMethod":composeApiMgr_method,
                    "apiInparamDemo":composeApiMgr_inparamDemo,
                    "apiOutparamDemo":composeApiMgr_outparamDemo,
                    "desTransProto":"",
                    "desContentProto":"",
                    "desMethod":"",
                    "desInparamDemo":"",
                    "desOutparamDemo":"",
                    "apiAddrId":composeApiMgr_apiaddrid,
                    "isPublic":composeApiMgr_ispublic,
                    "isRawApi":"2" //1：普通api；2：组合api
                },
                "gateFilterApi":gateFilterApi,
                "gateDesaddr":gateDesaddr,
                "combinApiMessage":JSON.stringify(gateInitData, null, 2)
            }
            if(isAdd == "false"){ //修改时是否新增历史
                param["gateApi"]["apiId"] = composeApiMgr_apiId;
                param["gateApi"]["state"] = composeApiMgr_state;
                param["isAddHis"] = "yes";
            }
            console.info(param);
            return param;
        }
    };
    //下一步
    var composeApiMgr_nextBtn = {
        init:function () {
            $("#composeApiMgr_nextBtn").click(function () {
                var composeApiMgr_serverName = $("#composeApiMgr_serverName").val();
                var composeApiMgr_name = $("#composeApiMgr_name").val();
                var composeApiMgr_path = $("#composeApiMgr_path").val();
                var composeApiMgr_contentProto = $("#composeApiMgr_contentProto").val();
                var composeApiMgr_desContentProto = $("#composeApiMgr_desContentProto").val();

                if(composeApiMgr_contentProto == "4"){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "Body协议不能为TEXT，请重新选择！"
                    });
                    return false;
                }
                if ("" == composeApiMgr_serverName && composeApiMgr_serverName.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择应用名称！"
                    });
                    $("#composeApiMgr_serverName").focus();
                    return false;
                }
                if(validate.helper.validate()){
                    $("#composeApiMgr_baseInfoTitle").hide();
                    $("#composeApiMgr_baseInfoContent").hide();
                    $("#composeApiMgr_requestTitle").hide();
                    $("#composeApiMgr_requestContent1").hide();
                    $("#composeApiMgr_requestContent2").hide();
                    $("#composeApiMgr_nextButton").hide();

                    $("#composeApiMgr_bianpai").show();
                    $("#composeApiMgr_saveButton").show();
                }
            });
        }
    }
    //上一步
    var composeApiMgr_preBtn = {
        init:function () {
            $("#composeApiMgr_preBtn").click(function () {
                $("#composeApiMgr_baseInfoTitle").show();
                $("#composeApiMgr_baseInfoContent").show();
                $("#composeApiMgr_requestTitle").show();
                $("#composeApiMgr_requestContent1").show();
                $("#composeApiMgr_requestContent2").show();
                $("#composeApiMgr_nextButton").show();

                $("#composeApiMgr_bianpai").hide();
                $("#composeApiMgr_saveButton").hide();
            })
        }
    }
    //保存按钮
    var composeApiMgr_saveCloseBtn = {
        init:function () {
            $("#composeApiMgr_saveCloseBtn").click(function () {
                var _param = getFormValue();
                if(_param){
                    var isAdd = $("#composeApiMgr_isAdd").val();
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
                        }, null, null, $("#composeApiMgr"));
                    }else{
                        common.ajaxPost("api/gateApi/addPublishApi", _param, function () {
                            common.jqConfirm.alert({
                                title: 1,
                                content: "操作成功！",
                                call: function () {
                                    clearData();
                                    $("#main-nav li[value='100602']").trigger("click");
                                }
                            });
                        }, null, null, $("#composeApiMgr"));
                    }
                }
            });
        }
    };
    //取消按钮
    var composeApiMgr_closeBtn = {
        init:function () {
            $("#composeApiMgr_closeBtn1").click(function () {
                clearData();
                router.navigate("100602");
            })
        }
    };

    //编辑区 初始化 flowchart
    var composeApiMgr_editSetting = {
        init:function () {
            $('#composeApiMgr_bianpai_setting').flowchart({
                linkWidth:8,
                defaultLinkColor:'#1b5a7a'
            });
        }
    }
    //top 工具区
    var composeApiMgr_tools = {
        count:0,
        init: function () {
            $(".tool-btn").click(function (e) {
                var flBtnID = $(this).attr('id');
                var data = null,floor = Math.floor(Math.random()*60+20);
                switch (flBtnID) {
                    case 'start':
                        data = {
                            top: 80+floor,
                            left: 20+floor,
                            properties: {
                                title: '开始',
                                class:"flowchart-"+flBtnID+"-operator",
                                inputs: {},
                                outputs: {
                                    output_1: {
                                        label: ''
                                    }
                                }
                            }
                        }
                        break;
                    case 'process':
                        data = {
                            top: 80+floor,
                            left: 300+floor,
                            properties: {
                                title: 'API',
                                class:"flowchart-"+flBtnID+"-operator",
                                inputs: {
                                    input_1: {
                                        label: ''
                                    }
                                },
                                outputs: {
                                    output_1: {
                                        label: ''
                                    }
                                }
                            }
                        }
                        break;
                    case 'decide':
                        data = {
                            top: 120+floor,
                            left: 200+floor,
                            properties: {
                                title: '判断',
                                class:"flowchart-"+flBtnID+"-operator",
                                inputs: {
                                    input_1: {
                                        label: ''
                                    }
                                },
                                outputs: {
                                    output_1: {
                                        label: ''
                                    }
                                }
                            }
                        }
                        break;
                    case 'end':
                        data = {
                            top: 80+floor,
                            left: 800+floor,
                            properties: {
                                title: '结束',
                                class:"flowchart-"+flBtnID+"-operator",
                                inputs: {
                                    input_1: {
                                        label: ''
                                    }
                                },
                                outputs: {}
                            }
                        }
                        break;
                }
                var operatorId = 'created_operator_' + flBtnID+'_'+composeApiMgr_tools.count;
                composeApiMgr_tools.count++;
                $('#composeApiMgr_bianpai_setting').flowchart('createOperator', operatorId, data,flBtnID);
            });
            $("#composeApiMgr_bianPai_delBtn").unbind("click");
            $("#composeApiMgr_bianPai_delBtn").click(function (e) {
                $('#composeApiMgr_bianpai_setting').flowchart('deleteSelected');
            });
        }
    };
    //连线点击弹出层
    var linkOperate_popupWin = {
        inst: {},
        optionObj: {
            minWidth: 900,
            minHeight: 250,
            maxWidth: 900,
            maxHeight: "",
            title: "参数配置",
            content: "biz/test/linkOperate_popup.html"
        },
        getInst: function () {
            if (linkOperate_popupWin.inst) {
                linkOperate_popupWin.inst = new wandaComp.wandaWindow("composeApiMgr_bianPai_linkOperateButton", "composeApiMgr_linkSetting_popup", linkOperate_popupWin.optionObj);
            }
            return linkOperate_popupWin.inst;
        },
        setSubPageValue: function () {
            linkOperatePopup.inParam.paramValueData = [];
            linkOperatePopup.systemParam.editArry = [];
            var operateId = $("#composeApiMgr_bianPai_linkOperateButton").attr("linkId");
            $("#linkOperatePopup_operatorId").val(operateId);
            var key = operateId.split("_")[3];
            $("#composeApiMgr_linkSetting_popup").data("wandaWindow").title("参数配置："+key);

            var result = checkLinkIfEnd(key);
            $("#linkOperatePopup_endFlag").val(result);

            var decideResult = checkDecideLink(key);
            $("#linkOperatePopup_decideFlag").val(decideResult);

            var beforeLinks = findAllLinkBeforeThis(key);
            for(var i= 0;i<beforeLinks.length;i++){
                var data = $("#create_operator_link_"+beforeLinks[i]).attr("data");
                if(data){
                    var dataJson = JSON.parse(data);
                    if(dataJson && dataJson["sysParams"]){
                        for(var j = 0; j < dataJson["sysParams"].length; j++){
                            linkOperatePopup.inParam.paramValueData.push({
                                "text":dataJson["sysParams"][j]["paramName"],
                                "value":dataJson["sysParams"][j]["paramName"]
                            })
                        }
                    }
                }
            }
            return $("#"+operateId).attr("data");
        },
        submitBtnCallBack: function (closeFun) {
        },
        cancelBtnCallBack: function () {

        },
        init: function () {
            linkOperate_popupWin.getInst().init(function () {
                var paramData = linkOperate_popupWin.setSubPageValue();
                var initFun = linkOperatePopup.init;
                common.initExeByAttr("composeApiMgr_linkSetting_popup", "opt='submit'", function () {
                    initFun("composeApiMgr_linkSetting_popup");
                    linkOperatePopup.systemParam.getInst().setDataSource(null);
                    linkOperatePopup.inParam.getInst().setDataSource(null);
                    if(paramData){
                        var paramJson = JSON.parse(paramData);
                        linkOperatePopup.systemParam.addDataSource(paramJson["sysParams"]);
                        linkOperatePopup.inParam.addDataSource(paramJson["inParams"]);
                    }
                });
            });
            linkOperate_popupWin.getInst().callBack("opt='submit'", linkOperate_popupWin.submitBtnCallBack);
            linkOperate_popupWin.getInst().callBack("opt='cancel'", linkOperate_popupWin.cancelBtnCallBack);
        }
    }
    // api点击弹出层
    var descAPi_popupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 200,
            maxWidth: 1000,
            maxHeight: "",
            title: "API配置",
            content: "biz/test/descApi_popup.html"
        },
        getInst: function (id,popup) {
            if (descAPi_popupWin.inst) {
                descAPi_popupWin.inst = new wandaComp.wandaWindow("composeApiMgr_bianPai_descApiButton","composeApiMgr_descApiSetting_popup", descAPi_popupWin.optionObj);
            }
            return descAPi_popupWin.inst;
        },
        setSubPageValue: function () {
            var operateId = $("#composeApiMgr_bianPai_descApiButton").attr("operateorId");
            $("#descApiPopup_operatorId").val(operateId);
            var apiData = $("#"+operateId).attr("data");
            if(apiData){
                $("#descApiPopup_apiId").val(JSON.parse(apiData)["apiId"]);
                $("#descApiPopup_apiGuid").val(JSON.parse(apiData)["apiGuid"]);
                $("#descApiPopup_serverId").val(JSON.parse(apiData)["serverId"]);
            }
        },
        submitBtnCallBack: function (closeFun) {
            $('#composeApiMgr_bianpai_setting').flowchart('setOperatorTitle', $("#descApiPopup_operatorId").val(), $("#descApiPopup_saveCloseBtn").attr("data"));
        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            descAPi_popupWin.getInst().init(function () {
                var isOk = descAPi_popupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = descApiPopup.init;
                common.initExeByAttr("composeApiMgr_descApiSetting_popup", "opt='submit'", function () {
                    initFun("composeApiMgr_descApiSetting_popup");
                });
            });
            descAPi_popupWin.getInst().callBack("opt='submit'", descAPi_popupWin.submitBtnCallBack);
            descAPi_popupWin.getInst().callBack("opt='cancel'", descAPi_popupWin.cancelBtnCallBack);
        }
    }
    // 判断节点 弹出层
    var decideAPi_popupWin = {
        inst: {},
        optionObj: {
            minWidth: 1200,
            minHeight: 480,
            maxWidth: 1200,
            maxHeight: "",
            title: "判断配置",
            content: "biz/test/decide_popup.html"
        },
        getInst: function (id,popup) {
            if (decideAPi_popupWin.inst) {
                decideAPi_popupWin.inst = new wandaComp.wandaWindow("composeApiMgr_bianPai_decideButton","composeApiMgr_decideSetting_popup", decideAPi_popupWin.optionObj);
            }
            return decideAPi_popupWin.inst;
        },
        setSubPageValue: function () {
            decidePopup.tabstrip.paramValueData = [];
            var operateId = $("#composeApiMgr_bianPai_decideButton").attr("operateorId");
            var toOperator = checkDecideLinkData(operateId);
            if(toOperator.length == 0){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请确保此节点输出节点已经配置！"
                });
                return false;
            }
            var beforeLinks = findAllLinkBeforeThis("",operateId);
            for(var i= 0;i<beforeLinks.length;i++){
                var data = $("#create_operator_link_"+beforeLinks[i]).attr("data");
                if(data){
                    var dataJson = JSON.parse(data);
                    if(dataJson && dataJson["sysParams"]){
                        for(var j = 0; j < dataJson["sysParams"].length; j++){
                            decidePopup.tabstrip.paramValueData.push({
                                "text":dataJson["sysParams"][j]["paramName"],
                                "value":dataJson["sysParams"][j]["paramName"]
                            })
                        }
                    }
                }
            }
            $("#decidePopup_tabstrip").html("");
            $("#decidePopup_operatorId").val(operateId);
            return toOperator;
        },
        submitBtnCallBack: function (closeFun) {
            $('#composeApiMgr_bianpai_setting').flowchart('setOperatorTitle', $("#decidePopup_operatorId").val(), $("#decidePopup_saveBtn").attr("data"));
        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            decideAPi_popupWin.getInst().init(function () {
                var isOk = decideAPi_popupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = decidePopup.init;
                common.initExeByAttr("composeApiMgr_decideSetting_popup", "opt='cancel'", function () {
                    initFun("composeApiMgr_decideSetting_popup");
                });
                decidePopup.tabstrip.append(isOk);
            });
            decideAPi_popupWin.getInst().callBack("opt='submit'", decideAPi_popupWin.submitBtnCallBack);
            decideAPi_popupWin.getInst().callBack("opt='cancel'", decideAPi_popupWin.cancelBtnCallBack);
        }
    };
    //修改获取API数据详情
    var composeApiMgrDetail = {
        init: function (apiId) {
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                var gateFilterApi = data["gateFilterApi"];
                var gateDesaddr = data["gateDesaddr"];
                var combinApiMessage = data["combinApiMessage"];
                if(combinApiMessage){
                    $("#composeApiMgr_bianpai").show();
                    $('#composeApiMgr_bianpai_setting').flowchart('setData', JSON.parse(combinApiMessage));
                    $("#composeApiMgr_bianpai").hide();
                }

                if(gateApi){//基本信息
                    $("#composeApiMgr_name").val(gateApi["API_NAME"]);
                    $("#composeApiMgr_desc").val(gateApi["API_DESC"]);
                    $("#composeApiMgr_path").val(gateApi["API_PATH"]);
                    $("#composeApiMgr_outparamDemo").val(gateApi["API_OUTPARAM_DEMO"]);
                    $("#composeApiMgr_userCode").val(gateApi["USER_CODE"]);
                    $("#composeApiMgr_ip").val(gateApi["IP"]);
                    $("#composeApiMgr_port").val(gateApi["PORT"]);
                    $("#composeApiMgr_apiaddrid").val(gateApi["API_ADDR_ID"]);
                    composeApiMgr_serverName.setValue(gateApi["SERVICE_ID"]);
                    composeApiMgr_serverName.getInst().readonly();
                    composeApiMgr_state.setValue(gateApi["STATE"]);
                    $("#composeApiMgr_method").val(gateApi["API_METHOD"]);
                    $("#composeApiMgr_contentProto").val(gateApi["API_CONTENT_PROTO"]);

                    composeApiMgr_contentProto.changeDataSource(gateApi["API_METHOD"],false);
                    composeApiMgr_contentProto.changeInPlaceholder(gateApi["API_CONTENT_PROTO"]);

                    composeApiMgr_method.setValue(gateApi["API_METHOD"]);
                    composeApiMgr_transProto.setValue(gateApi["API_TRANS_PROTO"]);
                    composeApiMgr_contentProto.setValue(gateApi["API_CONTENT_PROTO"]);
                    composeApiMgr_ispublic.setValue(gateApi["ISPUBLIC"]);

                    if(gateApi["API_INPARAM_DEMO"]){
                        try {
                            var inparamJson = JSON.parse(gateApi["API_INPARAM_DEMO"]);
                            if(inparamJson["Body"] == undefined){
                                $("#composeApiMgr_inparamDemo").val(gateApi["API_INPARAM_DEMO"])
                            }else{
                                $("#composeApiMgr_inparamDemo").val(inparamJson["Body"]);
                            }
                        }catch(e) {
                            $("#composeApiMgr_inparamDemo").val(gateApi["API_INPARAM_DEMO"]);
                        }
                    }
                }
                if(gateFilterApi && gateFilterApi.length>0){ //过滤器
                    for(var i=0;i<gateFilterApi.length;i++){
                        var obj = gateFilterApi[i];
                        if("concurrencyLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#composeApiMgr_concurrencyLimit").val(maxNumber);
                        }else if("waitTimeLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#composeApiMgr_waitTimeLimit").val(maxNumber);
                        }else if("loadBalance" == obj["FILTER_TYPE"]){
                            var loadMethod = JSON.parse(obj["FILTER_VALUE"])["loadMethod"];
                        }else if("wsdlPath" == obj["FILTER_TYPE"]){
                            $("#composeApiMgr_wsdlPath").val(obj["FILTER_VALUE"]);
                        }else if("wsdl" == obj["FILTER_TYPE"]){
                            var value = JSON.parse(obj["FILTER_VALUE"]);
                            $("#composeApiMgr_services").val(value["service"]);
                            $("#composeApiMgr_serviceBinds").val(value["bind"]);
                            $("#composeApiMgr_bindOperations").val(value["op"]);
                            $("#composeApiMgr_soapDemo").val(value["soapDemo"]);
                        }else if("combinApi" == obj["FILTER_TYPE"]){
                            var value = JSON.parse(obj["FILTER_VALUE"]);
                            setRelationData(value["childs"]);
                        }
                    }
                }
            };
            var param = {"apiId": apiId};
            common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#composeApiMgr"));

        }
    };

    //清除数据
    var clearData = function () {
        composeApiMgr_serverName.value = "";
        composeApiMgr_state.value = "";
        composeApiMgr_method.value = "";
        composeApiMgr_transProto.value = "";
        composeApiMgr_contentProto.value = "";
    }
    var initParam = function () {
        var _params = common.getRouterParams();

        validate.init();
        composeApiMgr_serverName.init();
        composeApiMgr_state.init();
        composeApiMgr_method.init();
        composeApiMgr_transProto.init();
        composeApiMgr_contentProto.init();
        composeApiMgr_tabstrip.init();
        composeApiMgr_ispublic.init();
        composeApiMgr_saveCloseBtn.init();
        composeApiMgr_closeBtn.init();
        composeApiMgr_nextBtn.init();
        composeApiMgr_preBtn.init();

        composeApiMgr_editSetting.init();
        composeApiMgr_tools.init();
        linkOperate_popupWin.init();
        descAPi_popupWin.init();
        decideAPi_popupWin.init();

        composeApiMgr_ip.init("HTTP");

        if(_params){
            if(_params["isAdd"] == "false"){
                $("#composeApiMgr_state_div").show();
                $("#composeApiMgr_closeBtn1").show();
            }else {
                $("#composeApiMgr_state_div").hide();
                $("#composeApiMgr_closeBtn1").hide();
            }
            $("#composeApiMgr_isAdd").val(_params["isAdd"]);
            $("#composeApiMgr_apiId").val(_params["apiId"]);
            composeApiMgrDetail.init(_params["apiId"]);
        }else{
            $("#composeApiMgr_state_div").hide();
            $("#composeApiMgr_closeBtn1").hide();
        }
    }
    var init = function () {
        initParam();
    };
    return {
        init: init
    }
});

