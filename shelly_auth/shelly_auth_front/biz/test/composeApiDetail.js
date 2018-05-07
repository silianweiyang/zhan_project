define(["jquery", "common","flowchart","wandaComp", "wandaCompR","biz/test/detail/linkOperateDetail_popup","biz/test/detail/descApiDetail_popup","biz/test/detail/decideDetail_popup"], function ($, common,flowchart,wandaComp, wandaCompR,linkOperatePopupDetail,descApiPopupDetail,decidePopupDetail) {
    var validate = {
        helper:null,
        init:function (parentIds) {
            validate.helper =  wandaComp.commonValidator("composeApiMgrDetail");
        }
    }
    //应用名称
    var composeApiMgrDetail_serverName = {
        value:"",
        getInst: function () {
            return $("#composeApiMgrDetail_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgrDetail_serverName.value = value;
            composeApiMgrDetail_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#composeApiMgrDetail_serverName").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgrDetail_serverName.value){
                composeApiMgrDetail_serverName.getInst().value(composeApiMgrDetail_serverName.value);
            }
        },
        init: function () {
            $("#composeApiMgrDetail_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "--请选择--",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#composeApiMgrDetail_serverName-list").css("height","auto");
                    $("#composeApiMgrDetail_serverName-list").css("overflow","hidden");
                }
            });
            var param = {"isAuth":"yes"};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, composeApiMgrDetail_serverName.successFun, null, null, $("#composeApiMgrDetail"));
        }
    };
    //状态
    var composeApiMgrDetail_state = {
        value:"",
        getInst: function () {
            return $("#composeApiMgrDetail_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgrDetail_state.value = value;
            composeApiMgrDetail_state.getInst().value(value);
        },
        successFun:function (data) {
            $("#composeApiMgrDetail_state").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgrDetail_state.value){
                composeApiMgrDetail_state.getInst().value(composeApiMgrDetail_state.value);
            }
        },
        init: function () {
            $("#composeApiMgrDetail_state").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgrDetail_state.successFun, null, null, $("#composeApiMgrDetail"));
        }
    };
    //是否公开
    var composeApiMgrDetail_ispublic = {
        value:"",
        getInst: function () {
            return $("#composeApiMgrDetail_ispublic").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgrDetail_ispublic.value = value;
            composeApiMgrDetail_ispublic.getInst().value(value);
        },
        successFun:function (data) {
            $("#composeApiMgrDetail_ispublic").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgrDetail_ispublic.value){
                composeApiMgrDetail_ispublic.getInst().value(composeApiMgrDetail_ispublic.value);
            }
            if($("#composeApiMgrDetail_isAdd").val() != "false"){
                composeApiMgrDetail_ispublic.getInst().select(1);
            }
        },
        init: function () {
            $("#composeApiMgrDetail_ispublic").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != composeApiMgrDetail_ispublic.value){
                        $("#composeApiMgrDetail_isAddHis").val("yes");
                    }else{
                        $("#composeApiMgrDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "ispublic"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgrDetail_ispublic.successFun, null, null, $("#composeApiMgrDetail"));
        }
    };
    // 传输协议
    var composeApiMgrDetail_transProto = {
        value:"",
        getInst: function () {
            return $("#composeApiMgrDetail_transProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgrDetail_transProto.value = value;
            composeApiMgrDetail_transProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#composeApiMgrDetail_transProto").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgrDetail_transProto.value){
                composeApiMgrDetail_transProto.getInst().value(composeApiMgrDetail_transProto.value);
            }else{
                if($("#composeApiMgrDetail_isAdd").val()!="false"){
                    composeApiMgrDetail_transProto.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#composeApiMgrDetail_transProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != composeApiMgrDetail_transProto.value){
                        $("#composeApiMgrDetail_isAddHis").val("yes");
                    }else{
                        $("#composeApiMgrDetail_isAddHis").val("no");
                    }
                    if("1" == value){
                        composeApiMgrDetail_ip.init("HTTP");
                    }else{
                        composeApiMgrDetail_ip.init("HTTPS");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgrDetail_transProto.successFun, null, null, $("#composeApiMgrDetail"));
        }
    };
    // Body协议
    var composeApiMgrDetail_contentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#composeApiMgrDetail_contentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgrDetail_contentProto.value = value;
            composeApiMgrDetail_contentProto.getInst().value(value);
        },
        successFun:function (data) {
            composeApiMgrDetail_contentProto.dataSource = data;
            composeApiMgrDetail_contentProto.getInst().setDataSource(data);
            if(composeApiMgrDetail_contentProto.value){
                composeApiMgrDetail_contentProto.getInst().value(composeApiMgrDetail_contentProto.value);
            }else{
                if($("#composeApiMgrDetail_isAdd").val()!="false"){
                    composeApiMgrDetail_contentProto.getInst().select(0);
                }
            }
        },
        changeDataSource:function (methodValue,flag) {
            if("2" == methodValue){  //post的时候为全部
                composeApiMgrDetail_contentProto.getInst().setDataSource(composeApiMgrDetail_contentProto.dataSource);
            }else{  //get delet put 除去soap
                var newDataSource = [];
                $.each(composeApiMgrDetail_contentProto.dataSource,function (index,value) {
                    if(index!=1&&index!=4){
                        newDataSource.push(value);
                    }
                });
                composeApiMgrDetail_contentProto.getInst().setDataSource(newDataSource);
                if(flag){
                    composeApiMgrDetail_contentProto.getInst().select(0);
                }
            }
        },
        changeInPlaceholder:function (value) {
            if("1" == value){
                $("#composeApiMgrDetail_inparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
                $("#composeApiMgrDetail_outparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
            }else if("2" == value){
                $("#composeApiMgrDetail_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n" +
                    "<s11:Body>\n" +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>\n<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>\n </ns1:param>\n " +
                    "</ns1:getSupportCity>\n " +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#composeApiMgrDetail_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
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
                $("#composeApiMgrDetail_inparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
                $("#composeApiMgrDetail_outparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
            }else if("4" == value){
                $("#composeApiMgrDetail_inparamDemo").attr("placeholder","This is a inParam demo");
                $("#composeApiMgrDetail_outparamDemo").attr("placeholder","This is a outParam demo");
            }else if("5" == value){
                $("#composeApiMgrDetail_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n " +
                    "<s11:Body>\n " +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt; </ns1:param> \n" +
                    "</ns1:getSupportCity> \n" +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#composeApiMgrDetail_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
                    "<soap:Body>\n" +
                    "<ns2:sayStrResponse xmlns:ns2='ws.wondersgroup.com'>\n" +
                    "<return>&lt;Response&gt; &lt;MessageHeader&gt; &lt;code&gt;0&lt;/code&gt; &lt;desc&gt;成功&lt;/desc&gt; &lt;/MessageHeader&gt; &lt;/Response&gt;</return>\n" +
                    "</ns2:sayStrResponse>\n" +
                    "</soap:Body>\n" +
                    "</soap:Envelope>");
            }else if("6" == value){
                $("#composeApiMgrDetail_inparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
                $("#composeApiMgrDetail_outparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
            }
            if($("#composeApiMgrDetail_method").val()=="1"){
                $("#composeApiMgrDetail_inparamDemo").attr("placeholder","id=1&name=test");
            }
        },
        init: function () {
            $("#composeApiMgrDetail_contentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    composeApiMgrDetail_contentProto.changeInPlaceholder(value);
                    if(value != composeApiMgrDetail_contentProto.value){
                        $("#composeApiMgrDetail_isAddHis").val("yes");
                    }else{
                        $("#composeApiMgrDetail_isAddHis").val("no");
                    }
                    //composeApiMgrDetail_desContentProto.changeDataSource(value,true);
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgrDetail_contentProto.successFun, null, null, $("#composeApiMgrDetail"));
        }
    };
    //API方法
    var composeApiMgrDetail_method = {
        value:"",
        getInst: function () {
            return $("#composeApiMgrDetail_method").data("wandaDropDownList");
        },
        setValue:function (value) {
            composeApiMgrDetail_method.value = value;
            composeApiMgrDetail_method.getInst().value(value);
        },
        successFun:function (data) {
            $("#composeApiMgrDetail_method").data("wandaDropDownList").setDataSource(data);
            if(composeApiMgrDetail_method.value){
                composeApiMgrDetail_method.getInst().value(composeApiMgrDetail_method.value);
            }
            if($("#composeApiMgrDetail_isAdd").val() != "false"){
                composeApiMgrDetail_method.getInst().select(1);
            }
        },
        init: function () {
            $("#composeApiMgrDetail_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    composeApiMgrDetail_contentProto.changeDataSource(value,true);
                    composeApiMgrDetail_contentProto.changeInPlaceholder($("#composeApiMgrDetail_contentProto").val());
                    if(value != composeApiMgrDetail_method.value){
                        $("#composeApiMgrDetail_isAddHis").val("yes");
                    }else{
                        $("#composeApiMgrDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, composeApiMgrDetail_method.successFun, null, null, $("#composeApiMgrDetail"));
        }
    };
    //入参tabstrip
    var composeApiMgrDetail_tabstrip = {
        init:function () {
            $("#composeApiMgrDetail_inparamDemoTitle").click(function () {
                $("#composeApiMgrDetail_inparamDemoContent").slideToggle("slow",function () {
                    if($('#composeApiMgrDetail_inparamDemoContent').css('display')=="none"){
                        $("#composeApiMgrDetail_inparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#composeApiMgrDetail_inparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#composeApiMgrDetail_outparamDemoTitle").click(function () {
                $("#composeApiMgrDetail_outparamDemoContent").slideToggle("slow",function () {
                    if($('#composeApiMgrDetail_outparamDemoContent').css('display')=="none"){
                        $("#composeApiMgrDetail_outparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#composeApiMgrDetail_outparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#composeApiMgrDetail_descHighParamTitle").click(function () {
                $("#composeApiMgrDetail_descHighParamContent").slideToggle("slow",function () {
                    if($('#descHighParamContent').css('display')=="none"){
                        $("#composeApiMgrDetail_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#composeApiMgrDetail_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
        }
    };

    //判断节点的数据和连接的APIID是否一致
    var checkRelation = function (gateLinks) {
        var decideChilds = [], descChilds = [],ifStart = false,ifEnd = false,result = true;
        $(".flowchart-operator").each(function (index, obj) {
            var id = $(this).attr("id");
            var type = id.split("_")[2];
            var title = $('#composeApiMgrDetail_bianpai_setting').flowchart('getOperatorTitle',id);
            var startFlag = false,endFlag = false,startCount = 0,endCount = 0;  //是否有 输入和输出连线
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
                if($("#"+id).attr("data") == undefined || $("#"+id).attr("data") == null || $("#"+id).attr("data").length == 0){
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
                    if(type == "process" && startCount >1){
                        common.jqConfirm.alert({
                            title: 0,
                            content: title+"节点只能有一个输出！"
                        });
                        result = false;
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
        return result;
    };

    // 判断当前连线是否是结束节点
    var checkLinkIfEnd = function (key) {
        var gateInitData = $('#composeApiMgrDetail_bianpai_setting').flowchart('getData');
        var gateLinks = gateInitData["links"];
        var result = false;
        var endEle = gateLinks[key]["toOperator"];
        if(endEle.split("_")[2] == "end"){
            result = true;
        }
        return result;
    };
    // 判断 判断节点是否有连线
    var checkDecideLink = function (operatorId) {
        var toOperator = [];
        var gateInitData = $('#composeApiMgrDetail_bianpai_setting').flowchart('getData');
        var gateLinks = gateInitData["links"];
        for(var key in gateLinks){
            var obj = gateLinks[key];
            var toType = obj["toOperator"].split("_")[2];
            var toId = obj["toOperator"];
            if(obj["fromOperator"] == operatorId){
                if(toType == "end"){
                    toOperator.push({
                        "id":toId,
                        "collectName":$('#composeApiMgrDetail_bianpai_setting').flowchart('getOperatorTitle',toId),
                        "type":toType/*,
                         "data":$("#"+obj["toOperator"]).attr("data")*/
                    });
                }else{
                    if($("#"+toId).attr("data")){
                        toOperator.push({
                            "id":toId,
                            "collectName":$('#composeApiMgrDetail_bianpai_setting').flowchart('getOperatorTitle',toId),
                            "type":toType/*,
                             "data":$("#"+obj["toOperator"]).attr("data")*/
                        });
                    }else{
                        common.jqConfirm.alert({
                            title: 0,
                            content: "请确保此节点的输出节点已配置！"
                        });
                        return false;
                    }
                }

            }
        }
        return toOperator;
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

    //下一步
    var composeApiMgrDetail_nextBtn = {
        init:function () {
            $("#composeApiMgrDetail_nextBtn").unbind("click");
            $("#composeApiMgrDetail_nextBtn").click(function () {
                var composeApiMgrDetail_serverName = $("#composeApiMgrDetail_serverName").val();
                var composeApiMgrDetail_name = $("#composeApiMgrDetail_name").val();
                var composeApiMgrDetail_path = $("#composeApiMgrDetail_path").val();
                var composeApiMgrDetail_contentProto = $("#composeApiMgrDetail_contentProto").val();
                var composeApiMgrDetail_desContentProto = $("#composeApiMgrDetail_desContentProto").val();

                if ("" == composeApiMgrDetail_serverName && composeApiMgrDetail_serverName.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择应用名称！"
                    });
                    $("#composeApiMgrDetail_serverName").focus();
                    return false;
                }
                if(validate.helper.validate()){
                    $("#composeApiMgrDetail_baseInfoTitle").hide();
                    $("#composeApiMgrDetail_baseInfoContent").hide();
                    $("#composeApiMgrDetail_requestTitle").hide();
                    $("#composeApiMgrDetail_requestContent1").hide();
                    $("#composeApiMgrDetail_requestContent2").hide();
                    $("#composeApiMgrDetail_nextButton").hide();

                    $("#composeApiMgrDetail_bianpai").show();
                    $("#composeApiMgrDetail_saveButton").show();
                }
            });
        }
    }
    //上一步
    var composeApiMgrDetail_preBtn = {
        init:function () {
            $("#composeApiMgrDetail_preBtn").unbind("click");
            $("#composeApiMgrDetail_preBtn").click(function () {
                $("#composeApiMgrDetail_baseInfoTitle").show();
                $("#composeApiMgrDetail_baseInfoContent").show();
                $("#composeApiMgrDetail_requestTitle").show();
                $("#composeApiMgrDetail_requestContent1").show();
                $("#composeApiMgrDetail_requestContent2").show();
                $("#composeApiMgrDetail_nextButton").show();

                $("#composeApiMgrDetail_bianpai").hide();
                $("#composeApiMgrDetail_saveButton").hide();
            })
        }
    }
    //保存按钮
    var composeApiMgrDetail_saveCloseBtn = {
        init:function () {
            $("#composeApiMgrDetail_saveCloseBtn").unbind("click");
            $("#composeApiMgrDetail_saveCloseBtn").click(function () {
                clearData();
                var queryParam = $("#composeApiMgrDetail_queryParam").val();
                var routerKey = $("#composeApiMgrDetail_menuCode").val();
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
    var composeApiMgrDetail_closeBtn = {
        init:function () {
            $("#composeApiMgrDetail_closeBtn1").click(function () {
                clearData();
                var queryParam = $("#composeApiMgrDetail_queryParam").val();
                var routerKey = $("#composeApiMgrDetail_menuCode").val();
                if(queryParam!=""){
                    var param = JSON.parse(queryParam);
                    if(param && param["opt"]){
                        routerKey = routerKey + "?opt="+param["opt"];
                    }
                }
                common.setRouterParams(param);
                router.navigate(routerKey);//API发现页面；
            })
        }
    };

    //编辑区 初始化 flowchart
    var composeApiMgrDetail_editSetting = {
        init:function () {
            $('#composeApiMgrDetail_bianpai_setting').flowchart({
                linkWidth:8,
                defaultLinkColor:'#1b5a7a'
            });
        }
    }
    //连线点击弹出层
    var linkOperate_popupWin = {
        inst: {},
        optionObj: {
            minWidth: 900,
            minHeight: 250,
            maxWidth: 900,
            maxHeight: "",
            title: "参数配置",
            content: "biz/test/detail/linkOperateDetail_popup.html"
        },
        getInst: function () {
            if (linkOperate_popupWin.inst) {
                linkOperate_popupWin.inst = new wandaComp.wandaWindow("composeApiMgrDetail_bianPai_linkOperateButton", "composeApiMgrDetail_linkSetting_popup", linkOperate_popupWin.optionObj);
            }
            return linkOperate_popupWin.inst;
        },
        setSubPageValue: function () {
            var operateId = $("#composeApiMgrDetail_bianPai_linkOperateButton").attr("linkId");
            $("#linkOperatePopupDetail_operatorId").val(operateId);
            var key = operateId.split("_")[3];
            var result = checkLinkIfEnd(key);
            $("#linkOperatePopupDetail_endFlag").val(result);

            return $("#"+operateId).attr("data");
        },
        submitBtnCallBack: function (closeFun) {
        },
        cancelBtnCallBack: function () {

        },
        init: function () {
            linkOperate_popupWin.getInst().init(function () {
                var paramData = linkOperate_popupWin.setSubPageValue();
                var initFun = linkOperatePopupDetail.init;
                common.initExeByAttr("composeApiMgrDetail_linkSetting_popup", "opt='cancel'", function () {
                    initFun("composeApiMgrDetail_linkSetting_popup");
                    linkOperatePopupDetail.systemParam.getInst().setDataSource(null);
                    linkOperatePopupDetail.inParam.getInst().setDataSource(null);
                    if(paramData){
                        var paramJson = JSON.parse(paramData);
                        linkOperatePopupDetail.systemParam.addDataSource(paramJson["sysParams"]);
                        linkOperatePopupDetail.inParam.addDataSource(paramJson["inParams"]);
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
            actions:[],
            minWidth: 500,
            minHeight: 200,
            maxWidth: 1000,
            maxHeight: "",
            title: "参数配置",
            content: "biz/test/detail/descApiDetail_popup.html"
        },
        getInst: function (id,popup) {
            if (descAPi_popupWin.inst) {
                descAPi_popupWin.inst = new wandaComp.wandaWindow("composeApiMgrDetail_bianPai_descApiButton","composeApiMgrDetail_descApiSetting_popup", descAPi_popupWin.optionObj);
            }
            return descAPi_popupWin.inst;
        },
        setSubPageValue: function () {
            var operateId = $("#composeApiMgrDetail_bianPai_descApiButton").attr("operateorId");
            $("#descApiPopupDetail_operatorId").val(operateId);
            var apiData = $("#"+operateId).attr("data");
            if(apiData){
                $("#descApiPopupDetail_apiId").val(JSON.parse(apiData)["apiId"]);
                $("#descApiPopupDetail_apiGuid").val(JSON.parse(apiData)["apiGuid"]);
                $("#descApiPopupDetail_serverId").val(JSON.parse(apiData)["serverId"]);
                return true;
            }else{
                return false;
            }
        },
        submitBtnCallBack: function (closeFun) {
        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            descAPi_popupWin.getInst().init(function () {
                var isOk = descAPi_popupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = descApiPopupDetail.init;
                common.initExeByAttr("composeApiMgrDetail_descApiSetting_popup", "opt='submit'", function () {
                    initFun("composeApiMgrDetail_descApiSetting_popup");
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
            title: "参数配置",
            content: "biz/test/detail/decideDetail_popup.html"
        },
        getInst: function (id,popup) {
            if (decideAPi_popupWin.inst) {
                decideAPi_popupWin.inst = new wandaComp.wandaWindow("composeApiMgrDetail_bianPai_decideButton","composeApiMgrDetail_decideSetting_popup", decideAPi_popupWin.optionObj);
            }
            return decideAPi_popupWin.inst;
        },
        setSubPageValue: function () {
            var operateId = $("#composeApiMgrDetail_bianPai_decideButton").attr("operateorId");
            var toOperator = checkDecideLink(operateId);
            if(toOperator.length == 0){
                common.jqConfirm.alert({
                    title: 0,
                    content: "请确保此节点输出节点已经配置！"
                });
                return false;
            }
            $("#decidePopupDetail_tabstrip").html("");
            $("#decidePopupDetail_operatorId").val(operateId);
            return toOperator;
        },
        submitBtnCallBack: function (closeFun) {
            $('#composeApiMgrDetail_bianpai_setting').flowchart('setOperatorTitle', $("#decidePopup_operatorId").val(), $("#decidePopup_saveBtn").attr("data"));
        },
        cancelBtnCallBack: function () {
        },
        init: function () {
            decideAPi_popupWin.getInst().init(function () {
                var isOk = decideAPi_popupWin.setSubPageValue();
                if (isOk == false)
                    return isOk;
                var initFun = decidePopupDetail.init;
                common.initExeByAttr("composeApiMgrDetail_decideSetting_popup", "opt='cancel'", function () {
                    initFun("composeApiMgrDetail_decideSetting_popup");
                });
                decidePopupDetail.tabstrip.append(isOk);
            });
            decideAPi_popupWin.getInst().callBack("opt='submit'", decideAPi_popupWin.submitBtnCallBack);
            decideAPi_popupWin.getInst().callBack("opt='cancel'", decideAPi_popupWin.cancelBtnCallBack);
        }
    };
    //修改获取API数据详情
    var composeApiMgrDetailDetail = {
        init: function (apiId,hisId) {
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                var gateFilterApi = data["gateFilterApi"];
                var gateDesaddr = data["gateDesaddr"];
                var combinApiMessage = data["combinApiMessage"];
                if(combinApiMessage){
                    $("#composeApiMgrDetail_bianpai").show();
                    $('#composeApiMgrDetail_bianpai_setting').flowchart('setData', JSON.parse(combinApiMessage));
                    $("#composeApiMgrDetail_bianpai").hide();
                }

                if(gateApi){//基本信息
                    $("#composeApiMgrDetail_name").val(gateApi["API_NAME"]);
                    $("#composeApiMgrDetail_desc").val(gateApi["API_DESC"]);
                    $("#composeApiMgrDetail_path").val(gateApi["API_PATH"]);
                    $("#composeApiMgrDetail_outparamDemo").val(gateApi["API_OUTPARAM_DEMO"]);
                    $("#composeApiMgrDetail_userCode").val(gateApi["USER_CODE"]);
                    $("#composeApiMgrDetail_ip").val(gateApi["IP"]);
                    $("#composeApiMgrDetail_port").val(gateApi["PORT"]);
                    $("#composeApiMgrDetail_apiaddrid").val(gateApi["API_ADDR_ID"]);
                    $("#composeApiMgrDetail_GUID").val(gateApi["API_GUID"]);
                    composeApiMgrDetail_serverName.setValue(gateApi["SERVICE_ID"]);
                    composeApiMgrDetail_serverName.getInst().readonly();
                    composeApiMgrDetail_state.setValue(gateApi["STATE"]);
                    $("#composeApiMgrDetail_method").val(gateApi["API_METHOD"]);
                    $("#composeApiMgrDetail_contentProto").val(gateApi["API_CONTENT_PROTO"]);

                    composeApiMgrDetail_contentProto.changeDataSource(gateApi["API_METHOD"],false);
                    composeApiMgrDetail_contentProto.changeInPlaceholder(gateApi["API_CONTENT_PROTO"]);

                    composeApiMgrDetail_method.setValue(gateApi["API_METHOD"]);
                    composeApiMgrDetail_transProto.setValue(gateApi["API_TRANS_PROTO"]);
                    composeApiMgrDetail_contentProto.setValue(gateApi["API_CONTENT_PROTO"]);
                    composeApiMgrDetail_ispublic.setValue(gateApi["ISPUBLIC"]);

                    if(gateApi["API_INPARAM_DEMO"]){
                        try {
                            var inparamJson = JSON.parse(gateApi["API_INPARAM_DEMO"]);
                            if(inparamJson["Body"] == undefined){
                                $("#composeApiMgrDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"])
                            }else{
                                $("#composeApiMgrDetail_inparamDemo").val(inparamJson["Body"]);
                            }
                        }catch(e) {
                            $("#composeApiMgrDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"]);
                        }
                    }
                }
                if(gateFilterApi && gateFilterApi.length>0){ //过滤器
                    for(var i=0;i<gateFilterApi.length;i++){
                        var obj = gateFilterApi[i];
                        if("concurrencyLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#composeApiMgrDetail_concurrencyLimit").val(maxNumber);
                        }else if("waitTimeLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#composeApiMgrDetail_waitTimeLimit").val(maxNumber);
                        }else if("loadBalance" == obj["FILTER_TYPE"]){
                            var loadMethod = JSON.parse(obj["FILTER_VALUE"])["loadMethod"];
                        }else if("wsdlPath" == obj["FILTER_TYPE"]){
                            $("#composeApiMgrDetail_wsdlPath").val(obj["FILTER_VALUE"]);
                        }else if("wsdl" == obj["FILTER_TYPE"]){
                            var value = JSON.parse(obj["FILTER_VALUE"]);
                            $("#composeApiMgrDetail_services").val(value["service"]);
                            $("#composeApiMgrDetail_serviceBinds").val(value["bind"]);
                            $("#composeApiMgrDetail_bindOperations").val(value["op"]);
                            $("#composeApiMgrDetail_soapDemo").val(value["soapDemo"]);
                        }else if("combinApi" == obj["FILTER_TYPE"]){
                            var value = JSON.parse(obj["FILTER_VALUE"]);
                            setRelationData(value["childs"]);
                        }
                    }
                }
                readOnly();
            };
            if(hisId != null){
                var param = {"hisId": hisId};
                common.ajaxGet("api/gateHisApi/queryGateApiHisDetail", param, successFun, null, null, $("#composeApiMgrDetail"));
            }else{
                var param = {"apiId": apiId};
                common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#composeApiMgrDetail"));
            }
        }
    };

    //清除数据
    var clearData = function () {
        composeApiMgrDetail_serverName.value = "";
        composeApiMgrDetail_state.value = "";
        composeApiMgrDetail_method.value = "";
        composeApiMgrDetail_transProto.value = "";
        composeApiMgrDetail_contentProto.value = "";
    }
    //
    var readOnly = function () {
        $("#composeApiMgrDetail_name").attr("readonly","readonly");
        $("#composeApiMgrDetail_desc").attr("readonly","readonly");
        $("#composeApiMgrDetail_path").attr("readonly","readonly");
        composeApiMgrDetail_serverName.getInst().readonly();
        composeApiMgrDetail_state.getInst().readonly();
        composeApiMgrDetail_transProto.getInst().readonly();
        composeApiMgrDetail_ispublic.getInst().readonly();
        composeApiMgrDetail_method.getInst().readonly();
        composeApiMgrDetail_contentProto.getInst().readonly();
        $("#composeApiMgrDetail_inparamDemo").attr("readonly", "true").css("background-color", "white");
        $("#composeApiMgrDetail_outparamDemo").attr("readonly", "true").css("background-color", "white");
    }
    var initParam = function () {
        var _params = common.getRouterParams();

        validate.init();
        composeApiMgrDetail_serverName.init();
        composeApiMgrDetail_state.init();
        composeApiMgrDetail_method.init();
        composeApiMgrDetail_transProto.init();
        composeApiMgrDetail_contentProto.init();
        composeApiMgrDetail_tabstrip.init();
        composeApiMgrDetail_ispublic.init();
        composeApiMgrDetail_saveCloseBtn.init();
        composeApiMgrDetail_closeBtn.init();
        composeApiMgrDetail_nextBtn.init();
        composeApiMgrDetail_preBtn.init();

        composeApiMgrDetail_editSetting.init();
        linkOperate_popupWin.init();
        descAPi_popupWin.init();
        decideAPi_popupWin.init();

        if(_params){
            if(_params["isAdd"] == "false"){
                $("#composeApiMgrDetail_state_div").show();
                $("#composeApiMgrDetail_closeBtn1").show();
            }else {
                $("#composeApiMgrDetail_state_div").hide();
                $("#composeApiMgrDetail_closeBtn1").hide();
            }
            $("#composeApiMgrDetail_isAdd").val(_params["isAdd"]);
            $("#composeApiMgrDetail_apiId").val(_params["apiId"]);
            $("#composeApiMgrDetail_menuCode").val(_params["menuCode"]);
            $("#composeApiMgrDetail_queryParam").val(_params["queryParam"]);
            composeApiMgrDetailDetail.init(_params["apiId"],_params["hisId"]);
        }else{
            $("#composeApiMgrDetail_state_div").hide();
            $("#composeApiMgrDetail_closeBtn1").hide();
        }
    }
    var init = function () {
        initParam();
    };
    return {
        init: init
    }
});

