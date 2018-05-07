define(["jquery", "common","wandaComp", "wandaCompR","biz/test/detail/descApiDetailRongduanSetting_popup","biz/test/detail/descApiDetailInparamSetting_popup","biz/test/detail/descApiDetailOutparamSetting_popup","biz/test/detail/descApiDetailCustomSetting_popup"], function ($, common,wandaComp, wandaCompR,rongduanDetail_popup,inParamDetail_popup,outParamDetail_popup,customDetail_popup) {
    var descApiPopupDetail_validate = {
        helper:null,
        init:function (parentIds) {
            descApiPopupDetail_validate.helper =  wandaComp.commonValidator("descApiPopupDetail");
        }
    }
    //应用名称
    var descApiPopupDetail_serverName = {
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_serverName").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_serverName.value = value;
            descApiPopupDetail_serverName.getInst().value(value);
        },
        successFun: function (data) {
            $("#descApiPopupDetail_serverName").data("wandaDropDownList").setDataSource(data);
            if(descApiPopupDetail_serverName.value){
                descApiPopupDetail_serverName.getInst().value(descApiPopupDetail_serverName.value);
            }
        },
        init: function () {
            $("#descApiPopupDetail_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "--请选择--",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0,
                open:function (e) {
                    $("#descApiPopupDetail_serverName-list").css("height","auto");
                    $("#descApiPopupDetail_serverName-list").css("overflow","hidden");
                }
            });
            var param = {"isAuth":"yes"};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, descApiPopupDetail_serverName.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    //状态
    var descApiPopupDetail_state = {
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_state").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_state.value = value;
            descApiPopupDetail_state.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopupDetail_state").data("wandaDropDownList").setDataSource(data);
            if(descApiPopupDetail_state.value){
                descApiPopupDetail_state.getInst().value(descApiPopupDetail_state.value);
            }
        },
        init: function () {
            $("#descApiPopupDetail_state").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "state"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopupDetail_state.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    //是否公开
    var descApiPopupDetail_ispublic = {
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_ispublic").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_ispublic.value = value;
            descApiPopupDetail_ispublic.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopupDetail_ispublic").data("wandaDropDownList").setDataSource(data);
            if(descApiPopupDetail_ispublic.value){
                descApiPopupDetail_ispublic.getInst().value(descApiPopupDetail_ispublic.value);
            }
            if($("#descApiPopupDetail_isAdd").val() != "false"){
                descApiPopupDetail_ispublic.getInst().select(1);
            }
        },
        init: function () {
            $("#descApiPopupDetail_ispublic").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != descApiPopupDetail_ispublic.value){
                        $("#descApiPopupDetail_isAddHis").val("yes");
                    }else{
                        $("#descApiPopupDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "ispublic"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopupDetail_ispublic.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    // 传输协议
    var descApiPopupDetail_transProto = {
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_transProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_transProto.value = value;
            descApiPopupDetail_transProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopupDetail_transProto").data("wandaDropDownList").setDataSource(data);
            if(descApiPopupDetail_transProto.value){
                descApiPopupDetail_transProto.getInst().value(descApiPopupDetail_transProto.value);
            }else{
                if($("#descApiPopupDetail_isAdd").val()!="false"){
                    descApiPopupDetail_transProto.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#descApiPopupDetail_transProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != descApiPopupDetail_transProto.value){
                        $("#descApiPopupDetail_isAddHis").val("yes");
                    }else{
                        $("#descApiPopupDetail_isAddHis").val("no");
                    }
                    if("1" == value){
                        descApiPopupDetail_ip.init("HTTP");
                    }else{
                        descApiPopupDetail_ip.init("HTTPS");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopupDetail_transProto.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    // ip地址获取
    var descApiPopupDetail_ip = {
        successFun: function (data) {
            $("#descApiPopupDetail_ip").val(data["IP"]);
            $("#descApiPopupDetail_port").val(data["PORT"]);
            $("#descApiPopupDetail_apiaddrid").val(data["APIADDRID"]);
        },
        init: function (addrTrans) {
            var param = {"addrTrans": addrTrans};
            common.ajaxGet("api/gateApi/getApiAddr", param, descApiPopupDetail_ip.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    // Body协议
    var descApiPopupDetail_contentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_contentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_contentProto.value = value;
            descApiPopupDetail_contentProto.getInst().value(value);
        },
        successFun:function (data) {
            descApiPopupDetail_contentProto.dataSource = data;
            descApiPopupDetail_contentProto.getInst().setDataSource(data);
            if(descApiPopupDetail_contentProto.value){
                descApiPopupDetail_contentProto.getInst().value(descApiPopupDetail_contentProto.value);
            }else{
                if($("#descApiPopupDetail_isAdd").val()!="false"){
                    descApiPopupDetail_contentProto.getInst().select(0);
                }
            }
        },
        changeDataSource:function (methodValue,flag) {
            if("2" == methodValue){  //post的时候为全部
                descApiPopupDetail_contentProto.getInst().setDataSource(descApiPopupDetail_contentProto.dataSource);
            }else{  //get delet put 除去soap
                var newDataSource = [];
                $.each(descApiPopupDetail_contentProto.dataSource,function (index,value) {
                    if(index!=1&&index!=4){
                        newDataSource.push(value);
                    }
                });
                descApiPopupDetail_contentProto.getInst().setDataSource(newDataSource);
                if(flag){
                    descApiPopupDetail_contentProto.getInst().select(0);
                }
            }
            descApiPopupDetail_desContentProto.changeDataSource(true);
        },
        changeInPlaceholder:function (value) {
            if("1" == value){
                $("#descApiPopupDetail_inparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
                $("#descApiPopupDetail_outparamDemo").attr("placeholder","{\"id\":1,\"name\":\"test\"}");
            }else if("2" == value){
                $("#descApiPopupDetail_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n" +
                    "<s11:Body>\n" +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>\n<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>\n </ns1:param>\n " +
                    "</ns1:getSupportCity>\n " +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#descApiPopupDetail_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
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
                $("#descApiPopupDetail_inparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
                $("#descApiPopupDetail_outparamDemo").attr("placeholder","<map>\n<pageBean>\n<page>1</page>\n<rows>10</rows>\n</pageBean>\n</map>");
            }else if("4" == value){
                $("#descApiPopupDetail_inparamDemo").attr("placeholder","This is a inParam demo");
                $("#descApiPopupDetail_outparamDemo").attr("placeholder","This is a outParam demo");
            }else if("5" == value){
                $("#descApiPopupDetail_inparamDemo").attr("placeholder","<s11:Envelope xmlns:s11='http://schemas.xmlsoap.org/soap/envelope/'>\n " +
                    "<s11:Body>\n " +
                    "<ns1:getSupportCity xmlns:ns1='http://WebXml.com.cn/'>\n " +
                    "<ns1:param>&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt; </ns1:param> \n" +
                    "</ns1:getSupportCity> \n" +
                    "</s11:Body>\n " +
                    "</s11:Envelope>");
                $("#descApiPopupDetail_outparamDemo").attr("placeholder","<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope'>\n" +
                    "<soap:Body>\n" +
                    "<ns2:sayStrResponse xmlns:ns2='ws.wondersgroup.com'>\n" +
                    "<return>&lt;Response&gt; &lt;MessageHeader&gt; &lt;code&gt;0&lt;/code&gt; &lt;desc&gt;成功&lt;/desc&gt; &lt;/MessageHeader&gt; &lt;/Response&gt;</return>\n" +
                    "</ns2:sayStrResponse>\n" +
                    "</soap:Body>\n" +
                    "</soap:Envelope>");
            }else if("6" == value){
                $("#descApiPopupDetail_inparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
                $("#descApiPopupDetail_outparamDemo").attr("placeholder","&lt;map&gt;&lt;pageBean&gt;&lt;page&gt;1&lt;/page&gt;&lt;rows&gt;10&lt;/rows&gt;&lt;/pageBean&gt;&lt;/map&gt;");
            }
            if($("#descApiPopupDetail_method").val()=="1"){
                $("#descApiPopupDetail_inparamDemo").attr("placeholder","id=1&name=test");
            }
        },
        init: function () {
            $("#descApiPopupDetail_contentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    descApiPopupDetail_contentProto.changeInPlaceholder(value);
                    if(value != descApiPopupDetail_contentProto.value){
                        $("#descApiPopupDetail_isAddHis").val("yes");
                    }else{
                        $("#descApiPopupDetail_isAddHis").val("no");
                    }
                    descApiPopupDetail_desContentProto.changeDataSource(value,true);
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopupDetail_contentProto.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    //API方法
    var descApiPopupDetail_method = {
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_method").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_method.value = value;
            descApiPopupDetail_method.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopupDetail_method").data("wandaDropDownList").setDataSource(data);
            if(descApiPopupDetail_method.value){
                descApiPopupDetail_method.getInst().value(descApiPopupDetail_method.value);
            }
            if($("#descApiPopupDetail_isAdd").val() != "false"){
                descApiPopupDetail_method.getInst().select(1);
            }
        },
        init: function () {
            $("#descApiPopupDetail_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    descApiPopupDetail_contentProto.changeDataSource(value,true);
                    descApiPopupDetail_contentProto.changeInPlaceholder($("#descApiPopupDetail_contentProto").val());
                    if(value != descApiPopupDetail_method.value){
                        $("#descApiPopupDetail_isAddHis").val("yes");
                    }else{
                        $("#descApiPopupDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopupDetail_method.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    //入参tabstrip
    var descApiPopupDetail_tabstrip = {
        init:function () {
            $("#descApiPopupDetail_inparamDemoContent").unbind("slideToggle");
            $("#descApiPopupDetail_inparamDemoTitle").unbind("click");
            $("#descApiPopupDetail_inparamDemoTitle").click(function () {
                $("#descApiPopupDetail_inparamDemoContent").slideToggle("slow",function () {
                    if($('#descApiPopupDetail_inparamDemoContent').css('display')=="none"){
                        $("#descApiPopupDetail_inparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#descApiPopupDetail_inparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#descApiPopupDetail_outparamDemoContent").unbind("slideToggle");
            $("#descApiPopupDetail_outparamDemoTitle").unbind("click");
            $("#descApiPopupDetail_outparamDemoTitle").click(function () {
                $("#descApiPopupDetail_outparamDemoContent").slideToggle("slow",function () {
                    if($('#descApiPopupDetail_outparamDemoContent').css('display')=="none"){
                        $("#descApiPopupDetail_outparamDemoTitle").find("i").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#descApiPopupDetail_outparamDemoTitle").find("i").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });
            $("#descApiPopupDetail_descHighParamContent").unbind("slideToggle");
            $("#descApiPopupDetail_descHighParamTitle").unbind("click");
            $("#descApiPopupDetail_descHighParamTitle").click(function () {
                $("#descApiPopupDetail_descHighParamContent").slideToggle("slow",function () {
                    if($('#descHighParamContent').css('display')=="none"){
                        $("#descApiPopupDetail_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-up").addClass("fa-caret-down");
                    }else{
                        $("#descApiPopupDetail_descHighParamTitle").find(".fa_icon").removeClass("fa-caret-down").addClass("fa-caret-up");
                    }
                });
            });



        }
    };
    //目标API方法
    var descApiPopupDetail_desMethod = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_desMethod").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_desMethod.value = value;
            descApiPopupDetail_desMethod.getInst().value(value);
        },
        successFun:function (data) {
            descApiPopupDetail_desMethod.dataSource = data;
            descApiPopupDetail_desMethod.getInst().setDataSource(data);
            if(descApiPopupDetail_desMethod.value){
                descApiPopupDetail_desMethod.getInst().value(descApiPopupDetail_desMethod.value);
            }else{
                if($("#descApiPopupDetail_isAdd").val()!="false"){
                    descApiPopupDetail_desMethod.getInst().select(0);
                }
            }
        },
        init: function () {
            $("#descApiPopupDetail_desMethod").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    descApiPopupDetail_desContentProto.changeDataSource(true);
                    if(value != descApiPopupDetail_desMethod.value){
                        $("#descApiPopupDetail_isAddHis").val("yes");
                    }else{
                        $("#descApiPopupDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopupDetail_desMethod.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    //目标API传输协议
    var descApiPopupDetail_desTransProto = {
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_desTransProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_desTransProto.value = value;
            descApiPopupDetail_desTransProto.getInst().value(value);
        },
        successFun:function (data) {
            $("#descApiPopupDetail_desTransProto").data("wandaDropDownList").setDataSource(data);
            if(descApiPopupDetail_desTransProto.value){
                descApiPopupDetail_desTransProto.getInst().value(descApiPopupDetail_desTransProto.value);
            }
            if($("#descApiPopupDetail_isAdd").val()!="false"){
                descApiPopupDetail_desTransProto.getInst().select(0);
            }
        },
        init: function () {
            $("#descApiPopupDetail_desTransProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != descApiPopupDetail_desTransProto.value){
                        $("#descApiPopupDetail_isAddHis").val("yes");
                    }else{
                        $("#descApiPopupDetail_isAddHis").val("no");
                    }
                }
            });
            var param = {"key": "transProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopupDetail_desTransProto.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    //目标API Body协议
    var descApiPopupDetail_desContentProto = {
        dataSource:[],
        value:"",
        getInst: function () {
            return $("#descApiPopupDetail_desContentProto").data("wandaDropDownList");
        },
        setValue:function (value) {
            descApiPopupDetail_desContentProto.value = value;
            descApiPopupDetail_desContentProto.getInst().value(value);
            if("2" == value || "5" == value){
                $("#descApiPopupDetail_address_div").show();
                $("#descApiPopupDetail_soap_div").show();
            }else{
                $("#descApiPopupDetail_address_div").hide();
                $("#descApiPopupDetail_soap_div").hide();
            }
        },
        changeDataSource:function (flag) {
            var newDataSource = [],methodDateSource = [];
            var method = $("#descApiPopupDetail_method").val();
            var contentValue = $("#descApiPopupDetail_contentProto").val();
            var desMethodValue = $("#descApiPopupDetail_desMethod").val();
            if("2" == contentValue || "5" == contentValue){  //第一页body协议为soap时，第二页只能为soap
                if("2" == contentValue){
                    newDataSource.push(descApiPopupDetail_desContentProto.dataSource[1]);
                }else{
                    newDataSource.push(descApiPopupDetail_desContentProto.dataSource[4]);
                }
                descApiPopupDetail_desContentProto.getInst().setDataSource(newDataSource);
                descApiPopupDetail_desContentProto.getInst().select(0);

                descApiPopupDetail_desMethod.getInst().setDataSource(descApiPopupDetail_desMethod.dataSource);
                if(flag){
                    descApiPopupDetail_desMethod.getInst().select(1);
                }
                descApiPopupDetail_desMethod.getInst().readonly();
            }else if("4" == contentValue){  //第一页body协议为text时，第二页只能为text
                if("1" == method){   //如果第一页为请求方法是get，第二页只能是get
                    methodDateSource.push(descApiPopupDetail_desMethod.dataSource[0]);
                }else{
                    $.each(descApiPopupDetail_desMethod.dataSource,function (index,value) {
                        if(index!=0){
                            methodDateSource.push(value);
                        }
                    });
                }
                descApiPopupDetail_desMethod.getInst().setDataSource(methodDateSource);
                descApiPopupDetail_desMethod.getInst().select(0);
                descApiPopupDetail_desMethod.getInst().readonly(false);

                newDataSource.push(descApiPopupDetail_desContentProto.dataSource[3]);
                descApiPopupDetail_desContentProto.getInst().setDataSource(newDataSource);
                descApiPopupDetail_desContentProto.getInst().select(0);

            }else{   //其他情况，取决于第二页请求方法
                if("2" == desMethodValue){//目标post的时候没有 text
                    $.each(descApiPopupDetail_desContentProto.dataSource, function (index, value) {
                        if(index!=3){
                            newDataSource.push(value);
                        }
                    });
                }else{  //目标非post的时候  没有soap和text
                    newDataSource.push(descApiPopupDetail_desContentProto.dataSource[0]);
                    newDataSource.push(descApiPopupDetail_desContentProto.dataSource[2]);
                    newDataSource.push(descApiPopupDetail_desContentProto.dataSource[5]);
                }
                descApiPopupDetail_desContentProto.getInst().setDataSource(newDataSource);

                descApiPopupDetail_desMethod.getInst().setDataSource(descApiPopupDetail_desMethod.dataSource);
                descApiPopupDetail_desMethod.getInst().readonly(false);
                if(flag){
                    descApiPopupDetail_desContentProto.getInst().select(0);
                }
            }
        },
        successFun:function (data) {
            descApiPopupDetail_desContentProto.dataSource = data;
            descApiPopupDetail_desContentProto.getInst().setDataSource(data);
            if(descApiPopupDetail_desTransProto.value){
                descApiPopupDetail_desContentProto.getInst().value(descApiPopupDetail_desContentProto.value);
            }
            if($("#descApiPopupDetail_isAdd").val()!="false"){
                descApiPopupDetail_desContentProto.getInst().select(0);
                descApiPopupDetail_desContentProto.changeDataSource();
            }
        },
        init: function () {
            $("#descApiPopupDetail_desContentProto").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0,
                change:function (e) {
                    var value = this.value();
                    if(value != descApiPopupDetail_desContentProto.value){
                        $("#descApiPopupDetail_isAddHis").val("yes");
                    }else{
                        $("#descApiPopupDetail_isAddHis").val("no");
                    }
                    if("2" == value || "5" == value){
                        descApiPopupDetail_desMethod.setValue("2");
                        descApiPopupDetail_desMethod.getInst().readonly();
                        $("#descApiPopupDetail_address_div").show();
                        if($("#descApiPopupDetail_isAdd").val() == "false"){
                            $("#descApiPopupDetail_soap_div").show();
                        }else{
                            $("#descApiPopupDetail_soap_div").hide();
                        }
                    }else{
                        descApiPopupDetail_desMethod.getInst().readonly(false);
                        $("#descApiPopupDetail_address_div").hide();
                        $("#descApiPopupDetail_soap_div").hide();
                    }
                }
            });
            var param = {"key": "contentProto"};
            common.ajaxGet("syscommpara/getBaseAttr", param, descApiPopupDetail_desContentProto.successFun, null, null, $("#descApiPopupDetail"));
        }
    };
    //目标地址
    var descApiPopupDetail_descPathGrid = {
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
            }
        ],
        init:function () {
            descApiPopupDetail_descPathGrid.getInst().init();
        },
        inst: {},
        getInst: function () {
            if (descApiPopupDetail_descPathGrid.inst) {
                descApiPopupDetail_descPathGrid.inst = new wandaComp.wandaGrid("descApiPopupDetail_descPathGrid", this.gridColums, false, this.pagerCallBack,this.isEditable,false);
            }
            return descApiPopupDetail_descPathGrid.inst;
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
            if(($("#descApiPopupDetail_desContentProto").val()=="2" || $("#descApiPopupDetail_desContentProto").val()=="5") && $("#descApiPopupDetail_wsdlPath").val()!=""){
                var str = $("#descApiPopupDetail_wsdlPath").val();
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
                return descApiPopupDetail_descPathGrid.getInst().data("wandaGrid").dataSource.at(number);
            } else {
                return descApiPopupDetail_descPathGrid.getInst().data("wandaGrid").dataSource;
            }
        },
        addRow: function () {
            var dataView = descApiPopupDetail_descPathGrid.getDataSource()["_data"];
            descApiPopupDetail_descPathGrid.getInst().saveAll();
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
            descApiPopupDetail_descPathGrid.getInst().addRow();
        },
        addDataSource: function (dataArry) {
            var dataSource = descApiPopupDetail_descPathGrid.getDataSource();
            for (var i = 0; i < dataArry.length; i++) {
                dataSource.add({
                    "ADDR_ID": dataArry[i]["ADDR_ID"],
                    "descApiPopupDetail_ID": dataArry[i]["descApiPopupDetail_ID"],
                    "IP": dataArry[i]["IP"],
                    "PORT": dataArry[i]["PORT"],
                    "URI_PATH": dataArry[i]["URI_PATH"]
                });
            }
        }
    };

       //下一步
    var descApiPopupDetail_nextBtn = {
        init:function () {
            $("#descApiPopupDetail_nextBtn").unbind("click");
            $("#descApiPopupDetail_nextBtn").click(function () {
                var descApiPopupDetail_serverName = $("#descApiPopupDetail_serverName").val();
                var descApiPopupDetail_name = $("#descApiPopupDetail_name").val();
                var descApiPopupDetail_path = $("#descApiPopupDetail_path").val();
                var descApiPopupDetail_contentProto = $("#descApiPopupDetail_contentProto").val();
                var descApiPopupDetail_desContentProto = $("#descApiPopupDetail_desContentProto").val();

                if ("" == descApiPopupDetail_serverName && descApiPopupDetail_serverName.trim().length == 0) {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择应用名称！"
                    });
                    $("#descApiPopupDetail_serverName").focus();
                    return false;
                }
                if(descApiPopupDetail_validate.helper.validate()){
                    threePageShow();

                    if (descApiPopupDetail_contentProto != "2" && descApiPopupDetail_contentProto != "5" &&
                        descApiPopupDetail_desContentProto != "2" && descApiPopupDetail_desContentProto != "5") {
                        $("#descApiPopupDetail_address_div").hide();
                        $("#descApiPopupDetail_soap_div").hide();
                    } else {
                        $("#descApiPopupDetail_address_div").show();
                        $("#descApiPopupDetail_soap_div").show();
                    }
                }
            });
        }
    }
    //上一步
    var descApiPopupDetail_preBtn = {
        init: function () {
            $("#descApiPopupDetail_preBtn").unbind("click");
            $("#descApiPopupDetail_preBtn").click(function () {
                secondPageShow();
            })
        }
    };

    //第一页展示
    var firstPageShow = function () {
        $("#descApiPopupDetail_chonse_content").show();
        $("#descApiPopupDetail_choose_saveButton").show();

        $("#descApiPopupDetail_baseInfoTitle").hide();
        $("#descApiPopupDetail_baseInfoContent").hide();
        $("#descApiPopupDetail_requestTitle").hide();
        $("#descApiPopupDetail_requestContent1").hide();
        $("#descApiPopupDetail_requestContent2").hide();
        $("#descApiPopupDetail_nextButton").hide();

        $("#descApiPopupDetail_descRequestTitle").hide();
        $("#descApiPopupDetail_descRequestContent").hide();
        $("#descApiPopupDetail_descPathTitle").hide();
        $("#descApiPopupDetail_descPathContent").hide();
        $("#descApiPopupDetail_descHighParamTitle").hide();//本次改造新增
        $("#descApiPopupDetail_descHighParamContent").hide();
        $("#descApiPopupDetail_saveButton").hide();
        $("#descApiPopupDetail_descApiPopupDetail_soap_div").hide();
    }
    //第二页展示
    var secondPageShow = function () {
        $("#descApiPopupDetail_chonse_content").hide();
        $("#descApiPopupDetail_choose_saveButton").hide();

        $("#descApiPopupDetail_baseInfoTitle").show();
        $("#descApiPopupDetail_baseInfoContent").show();
        $("#descApiPopupDetail_requestTitle").show();
        $("#descApiPopupDetail_requestContent1").show();
        $("#descApiPopupDetail_requestContent2").show();
        $("#descApiPopupDetail_nextButton").show();

        $("#descApiPopupDetail_descRequestTitle").hide();
        $("#descApiPopupDetail_descRequestContent").hide();
        $("#descApiPopupDetail_descPathTitle").hide();
        $("#descApiPopupDetail_descPathContent").hide();
        $("#descApiPopupDetail_descHighParamTitle").hide();//本次改造新增
        $("#descApiPopupDetail_descHighParamContent").hide();
        $("#descApiPopupDetail_saveButton").hide();
        $("#descApiPopupDetail_descApiPopupDetail_soap_div").hide();
    }
    //第三页展示
    var threePageShow = function () {
        $("#descApiPopupDetail_chonse_content").hide();
        $("#descApiPopupDetail_choose_saveButton").hide();

        $("#descApiPopupDetail_baseInfoTitle").hide();
        $("#descApiPopupDetail_baseInfoContent").hide();
        $("#descApiPopupDetail_requestTitle").hide();
        $("#descApiPopupDetail_requestContent1").hide();
        $("#descApiPopupDetail_requestContent2").hide();
        $("#descApiPopupDetail_nextButton").hide();

        $("#descApiPopupDetail_descRequestTitle").show();
        $("#descApiPopupDetail_descRequestContent").show();
        $("#descApiPopupDetail_descHighParamTitle").show();//本次改造新增
        $("#descApiPopupDetail_descHighParamContent").show();
        $("#descApiPopupDetail_descPathTitle").show();
        $("#descApiPopupDetail_descPathContent").show();
        $("#descApiPopupDetail_saveButton").show();
    }
//取消按钮
    var descApiPopupDetail_closeBtn = {
        init:function () {
            $("#descApiPopupDetail_closeBtn1").unbind("click");
            $("#descApiPopupDetail_closeBtn1").click(function () {
                clearData();
                $("#descApiPopupDetail_closeBtn1").trigger("afterClick");
            })
        }
    };
    //保存按钮
    var descApiPopupDetail_saveCloseBtn = {
        init:function () {
            $("#descApiPopupDetail_saveCloseBtn").unbind("click");
            $("#descApiPopupDetail_saveCloseBtn").click(function () {
                clearData();
                $("#descApiPopupDetail_saveCloseBtn").trigger("afterClick");
            });
        }
    };
    //修改获取API数据详情
    var descApiPopupDetailDetail = {
        init: function (apiId) {
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                var gateFilterApi = data["gateFilterApi"];
                var gateDesaddr = data["gateDesaddr"];
                if(gateApi){//基本信息
                    $("#descApiPopupDetail_apiGuid").val(gateApi["API_GUID"]);
                    $("#descApiPopupDetail_name").val(gateApi["API_NAME"]);
                    $("#descApiPopupDetail_desc").val(gateApi["API_DESC"]);
                    $("#descApiPopupDetail_path").val(gateApi["API_PATH"]);
                    $("#descApiPopupDetail_outparamDemo").val(gateApi["API_OUTPARAM_DEMO"]);
                    $("#descApiPopupDetail_ip").val(gateApi["IP"]);
                    $("#descApiPopupDetail_port").val(gateApi["PORT"]);
                    $("#descApiPopupDetail_apiaddrid").val(gateApi["API_ADDR_ID"]);
                    descApiPopupDetail_serverName.setValue(gateApi["SERVICE_ID"]);
                    descApiPopupDetail_serverName.getInst().readonly();
                    descApiPopupDetail_state.setValue(gateApi["STATE"]);
                    $("#descApiPopupDetail_method").val(gateApi["API_METHOD"]);
                    $("#descApiPopupDetail_contentProto").val(gateApi["API_CONTENT_PROTO"]);
                    $("#descApiPopupDetail_desMethod").val(gateApi["DES_METHOD"]);
                    $("#descApiPopupDetail_desContentProto").val(gateApi["DES_CONTENT_PROTO"]);

                    descApiPopupDetail_contentProto.changeDataSource(gateApi["API_METHOD"],false);
                    descApiPopupDetail_desContentProto.changeDataSource(false);
                    descApiPopupDetail_contentProto.changeInPlaceholder(gateApi["API_CONTENT_PROTO"]);

                    descApiPopupDetail_method.setValue(gateApi["API_METHOD"]);
                    descApiPopupDetail_transProto.setValue(gateApi["API_TRANS_PROTO"]);
                    descApiPopupDetail_contentProto.setValue(gateApi["API_CONTENT_PROTO"]);
                    descApiPopupDetail_desTransProto.setValue(gateApi["DES_TRANS_PROTO"]);
                    descApiPopupDetail_desMethod.setValue(gateApi["DES_METHOD"]);
                    descApiPopupDetail_desContentProto.setValue(gateApi["DES_CONTENT_PROTO"]);
                    descApiPopupDetail_ispublic.setValue(gateApi["ISPUBLIC"]);

                    if(gateApi["API_INPARAM_DEMO"]){
                        try {
                            var inparamJson = JSON.parse(gateApi["API_INPARAM_DEMO"]);
                            if(inparamJson["Body"] == undefined){
                                $("#descApiPopupDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"])
                            }else{
                                $("#descApiPopupDetail_inparamDemo").val(inparamJson["Body"]);
                            }
                        }catch(e) {
                            $("#descApiPopupDetail_inparamDemo").val(gateApi["API_INPARAM_DEMO"]);
                        }
                    }
                }
                if(gateDesaddr && gateDesaddr.length>0){//目标地址
                    descApiPopupDetail_descPathGrid.getInst().setDataSource(null);
                    descApiPopupDetail_descPathGrid.addDataSource(gateDesaddr);
                }
                if(gateFilterApi && gateFilterApi.length>0){ //过滤器
                    for(var i=0;i<gateFilterApi.length;i++){
                        var obj = gateFilterApi[i];
                        if("concurrencyLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#descApiPopupDetail_concurrencyLimit").val(maxNumber);
                        }else if("waitTimeLimit" == obj["FILTER_TYPE"]){
                            var maxNumber = JSON.parse(obj["FILTER_VALUE"])["maxNumber"];
                            $("#descApiPopupDetail_waitTimeLimit").val(maxNumber);
                        }else if("loadBalance" == obj["FILTER_TYPE"]){
                            var loadMethod = JSON.parse(obj["FILTER_VALUE"])["loadMethod"];
                        }else if("requestParamConvert" == obj["FILTER_TYPE"]){
                            $("#descApiPopupDetail_requestParamConvert").val(obj["FILTER_VALUE"]);
                        }else if("responseConvert" == obj["FILTER_TYPE"]){
                            $("#descApiPopupDetail_responseParamConvert").val(obj["FILTER_VALUE"]);
                        }else if("wsdlPath" == obj["FILTER_TYPE"]){
                            $("#descApiPopupDetail_wsdlPath").val(obj["FILTER_VALUE"]);
                        }else if("wsdl" == obj["FILTER_TYPE"]){
                            var value = JSON.parse(obj["FILTER_VALUE"]);
                            $("#descApiPopupDetail_services").val(value["service"]);
                            $("#descApiPopupDetail_serviceBinds").val(value["bind"]);
                            $("#descApiPopupDetail_bindOperations").val(value["op"]);
                            $("#descApiPopupDetail_soapDemo").val(value["soapDemo"]);
                        }else if("extendFilter" == obj["FILTER_TYPE"]){     //自定义过滤器
                            $("#descApiPopupDetail_extendFilter").val(obj["FILTER_VALUE"]);
                        }
                    }
                }
            };
            var param = {"apiId": apiId};
            common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#descApiPopupDetail"));

        }
    };
    // 入参转换设置
    var descApiPopupDetail_inparamSettingPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 900,
            maxHeight: "",
            title: "入参设置",
            content: "biz/test/detail/descApiDetailInparamSetting_popup.html"
        },
        getInst: function () {
            if (descApiPopupDetail_inparamSettingPopupWin.inst) {
                descApiPopupDetail_inparamSettingPopupWin.inst = new wandaComp.wandaWindow("descApiPopupDetail_inparamSetting", "descApiPopupDetail_inparamSettingPopup", descApiPopupDetail_inparamSettingPopupWin.optionObj);
            }
            return descApiPopupDetail_inparamSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var APIMgrDetail_contentProto = $("#descApiPopupDetail_contentProto").val();
            if(APIMgrDetail_contentProto == "4"){
                common.jqConfirm.alert({
                    title: 0,
                    content: "选择的body协议不支持入参转换！"
                });
                return false;
            }
            var requestParamValue = $("#descApiPopupDetail_requestParamConvert").val();
            if(requestParamValue){
                var dataJson = JSON.parse(requestParamValue);
                var addPath = dataJson["addPath"];
                if(addPath && addPath.length > 0){
                    inParamDetail_popup.inConst.addDataSource(addPath);
                }
                var pathConvert = dataJson["pathConvert"];
                if(pathConvert && pathConvert.length > 0){
                    inParamDetail_popup.inParam.addDataSource(pathConvert);
                }
                $("#descApiPopupDetail_requestParamConvert").val("");
            }
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#descApiPopupDetail_inparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#descApiPopupDetail_inparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            descApiPopupDetail_inparamSettingPopupWin.getInst().init(function () {
                var initFun = inParamDetail_popup.init;
                common.initExeByAttr("descApiPopupDetail_inparamSettingPopup", "opt='cancel'", function () {
                    initFun("descApiPopupDetail_inparamSettingPopup");
                });
                descApiPopupDetail_inparamSettingPopupWin.setSubPageValue();
            });
            descApiPopupDetail_inparamSettingPopupWin.getInst().callBack("opt='cancel'", descApiPopupDetail_inparamSettingPopupWin.cancelBtnCallBack);
        }
    };
    //出参转换设置
    var descApiPopupDetail_outparamSettingPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 250,
            maxWidth: 900,
            maxHeight: "",
            title: "出参设置",
            content: "biz/test/detail/descApiDetailOutparamSetting_popup.html"
        },
        getInst: function () {
            if (descApiPopupDetail_outparamSettingPopupWin.inst) {
                descApiPopupDetail_outparamSettingPopupWin.inst = new wandaComp.wandaWindow("descApiPopupDetail_outparamSetting", "descApiPopupDetail_outparamSettingPopup", descApiPopupDetail_outparamSettingPopupWin.optionObj);
            }
            return descApiPopupDetail_outparamSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var APIMgrDetail_contentProto = $("#descApiPopupDetail_contentProto").val();
            if(APIMgrDetail_contentProto == "4"){
                common.jqConfirm.alert({
                    title: 0,
                    content: "选择的body协议不支持入参转换！"
                });
                return false;
            }
            var responseValue = $("#descApiPopupDetail_responseParamConvert").val();
            if(responseValue){
                var valueJSON = JSON.parse(responseValue);
                var APIMgrDetail_outparamConvertData = valueJSON["pathConvert"];
                if(APIMgrDetail_outparamConvertData && APIMgrDetail_outparamConvertData.length>0){
                    outParamDetail_popup.outParam.addDataSource(APIMgrDetail_outparamConvertData);
                }
                var value = [];
                if(valueJSON["delPath"] != undefined){
                    value = valueJSON["delPath"];
                }
                if(value!=null&&value.length>0){
                    var count = value.length;
                    if(count == 1){
                        $("#descApiDetailOutparamSetting_outParamFilterGrid").css("width","25%");
                    }else if(count == 2){
                        $("#descApiDetailOutparamSetting_outParamFilterGrid").css("width","50%");
                    }else if(count == 3){
                        $("#descApiDetailOutparamSetting_outParamFilterGrid").css("width","75%");
                    }else if(count >= 4){
                        $("#descApiDetailOutparamSetting_outParamFilterGrid").css("width","100%");
                    }
                    if(count>0){
                        for(var m=0;m<count;m++){
                            if(m==0 || m%4 ==0){
                                $("#descApiDetailOutparamSetting_outParamFilterGrid").append("<tr></tr>");
                            }
                            var item = value[m];
                            item = item.trim().replace("\"","").replace("\"","");
                            $("#descApiDetailOutparamSetting_outParamFilterGrid").find("tbody").find("tr:last").append("<td style='border: 0px;padding-left: 0px;padding-bottom:0px'><input class='k-textbox' style='width:85%' value='"+item+"'  readonly='readonly'/></td>");
                        }
                    }
                }
                $("#descApiPopupDetail_responseParamConvert").val("");
            }

        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#descApiPopupDetail_outparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#descApiPopupDetail_outparamSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            descApiPopupDetail_outparamSettingPopupWin.getInst().init(function () {
                var initFun = outParamDetail_popup.init;
                common.initExeByAttr("descApiPopupDetail_outparamSettingPopup", "opt='cancel'", function () {
                    initFun("descApiPopupDetail_outparamSettingPopup");
                });
                descApiPopupDetail_outparamSettingPopupWin.setSubPageValue();
            });
            descApiPopupDetail_outparamSettingPopupWin.getInst().callBack("opt='cancel'", descApiPopupDetail_outparamSettingPopupWin.cancelBtnCallBack);
        }
    };
    //熔断配置
    var descApiPopupDetail_rongduanSettingPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 150,
            maxWidth: "",
            maxHeight: "",
            title: "熔断配置",
            content: "biz/test/detail/descApiDetailRongduanSetting_popup.html"
        },
        getInst: function () {
            if (descApiPopupDetail_rongduanSettingPopupWin.inst) {
                descApiPopupDetail_rongduanSettingPopupWin.inst = new wandaComp.wandaWindow("descApiPopupDetail_rongduanSetting", "descApiPopupDetail_rongduanSettingPopup", descApiPopupDetail_rongduanSettingPopupWin.optionObj);
            }
            return descApiPopupDetail_rongduanSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            var descApiPopupDetail_waitTimeLimit = $("#descApiPopupDetail_waitTimeLimit").val();
            var descApiPopupDetail_concurrencyLimit = $("#descApiPopupDetail_concurrencyLimit").val();
            if(descApiPopupDetail_waitTimeLimit != ""){
                rongduanDetail_popup.waitTime.getInst().value(descApiPopupDetail_waitTimeLimit);
                rongduanDetail_popup.waitTime.value = descApiPopupDetail_waitTimeLimit;
                $("#descApiPopupDetail_waitTimeLimit").val("");
            }
            if(descApiPopupDetail_concurrencyLimit  != ""){
                rongduanDetail_popup.concuy.getInst().value(descApiPopupDetail_concurrencyLimit);
                rongduanDetail_popup.concuy.value = descApiPopupDetail_concurrencyLimit;
                $("#descApiPopupDetail_concurrencyLimit").val("");
            }
            rongduanDetail_popup.waitTime.getInst().readonly();
            rongduanDetail_popup.concuy.getInst().readonly();
        },
        submitBtnCallBack: function (closeFun) {
            var plusPopup = $("#descApiPopupDetail_rongduanSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#descApiPopupDetail_rongduanSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            descApiPopupDetail_rongduanSettingPopupWin.getInst().init(function () {
                var initFun = rongduanDetail_popup.init;
                common.initExeByAttr("descApiPopupDetail_rongduanSettingPopup", "opt='cancel'", function () {
                    initFun("descApiPopupDetail_rongduanSettingPopup");
                });
                descApiPopupDetail_rongduanSettingPopupWin.setSubPageValue();
                descApiPopupDetail_rongduanSettingPopupWin.getInst().callBack("opt='submit'", descApiPopupDetail_rongduanSettingPopupWin.submitBtnCallBack, true);
                descApiPopupDetail_rongduanSettingPopupWin.getInst().callBack("opt='cancel'", descApiPopupDetail_rongduanSettingPopupWin.cancelBtnCallBack);
            });
        }
    };
    //自定义过滤器
    var descApiPopupDetail_customSettingPopupWin = {
        inst: {},
        optionObj: {
            minWidth: 500,
            minHeight: 150,
            maxWidth: "",
            maxHeight: "",
            title: "扩展插件",
            content: "biz/test/detail/descApiDetailCustomSetting_popup.html"
        },
        getInst: function () {
            if (descApiPopupDetail_customSettingPopupWin.inst) {
                descApiPopupDetail_customSettingPopupWin.inst = new wandaComp.wandaWindow("descApiPopupDetail_customSetting", "descApiPopupDetail_customSettingPopup", descApiPopupDetail_customSettingPopupWin.optionObj);
            }
            return descApiPopupDetail_customSettingPopupWin.inst;
        },
        getGridSelectValue: function () {

        },
        setSubPageValue: function () {
            //初始化自定义过滤器的值
            var APIMgr_extendFilter = $("#descApiPopupDetail_extendFilter").val();
            if(APIMgr_extendFilter && APIMgr_extendFilter.length > 0){
                var APIMgr_extendFilter_json = JSON.parse(APIMgr_extendFilter);
                customDetail_popup.inConst.addDataSource(APIMgr_extendFilter_json);
                $("#descApiPopupDetail_extendFilter").val("");
            }
        },
        cancelBtnCallBack: function () {
            var plusPopup = $("#descApiPopupDetail_customSettingPopup").data("wandaWindow");
            plusPopup.close();
        },
        init: function () {
            descApiPopupDetail_customSettingPopupWin.getInst().init(function () {
                var initFun = customDetail_popup.init;
                common.initExeByAttr("descApiPopupDetail_customSettingPopup", "opt='cancel'", function () {
                        initFun("descApiPopupDetail_customSettingPopup");
                });
                descApiPopupDetail_customSettingPopupWin.setSubPageValue();
            });
            descApiPopupDetail_customSettingPopupWin.getInst().callBack("opt='cancel'", descApiPopupDetail_customSettingPopupWin.cancelBtnCallBack);
        }
    };

    var readOnly = function () {
        $("#descApiPopupDetail_name").attr("readonly","readonly");
        $("#descApiPopupDetail_desc").attr("readonly","readonly");
        $("#descApiPopupDetail_path").attr("readonly","readonly");
        $("#descApiPopupDetail_inparamDemo").attr("readonly", "true").css("background-color", "white");
        $("#descApiPopupDetail_outparamDemo").attr("readonly", "true").css("background-color", "white");

        descApiPopupDetail_serverName.getInst().readonly();
        descApiPopupDetail_state.getInst().readonly();
        descApiPopupDetail_transProto.getInst().readonly();
        descApiPopupDetail_method.getInst().readonly();
        descApiPopupDetail_contentProto.getInst().readonly();
        descApiPopupDetail_desMethod.getInst().readonly();
        descApiPopupDetail_desContentProto.getInst().readonly();
        descApiPopupDetail_desTransProto.getInst().readonly();
        descApiPopupDetail_ispublic.getInst().readonly();
    }
    //清除数据
    var clearData = function () {
        descApiPopupDetail_serverName.value = "";
        descApiPopupDetail_state.value = "";
        descApiPopupDetail_method.value = "";
        descApiPopupDetail_transProto.value = "";
        descApiPopupDetail_contentProto.value = "";
        descApiPopupDetail_desContentProto.value = "";
        descApiPopupDetail_desMethod.value = "";
        descApiPopupDetail_desTransProto.value = "";
        $("#descApiPopupDetail_serverId").val("");
        $("#descApiPopupDetail_apiId").val("");
        $("#descApiPopupDetail_apiGuid").val("");
        $("#descApiPopupDetail_name").val("");
        $("#descApiPopupDetail_path").val("");
        $("#descApiPopupDetail_desc").val("");
        $("#descApiPopupDetail_inparamDemo").val("");
        $("#descApiPopupDetail_outparamDemo").val("");
        descApiPopupDetail_descPathGrid.getInst().setDataSource(null);
        $("#descApiPopupDetail_name").removeClass("k-invalid");
        $("#descApiPopupDetail_path").removeClass("k-invalid");


        var plusPopup1 = $("#descApiPopupDetail_rongduanSettingPopup").data("wandaWindow");
        var plusPopup2 = $("#descApiPopupDetail_inparamSettingPopup").data("wandaWindow");
        var plusPopup3 = $("#descApiPopupDetail_outparamSettingPopup").data("wandaWindow");
        var plusPopup4 = $("#descApiPopupDetail_customSettingPopup").data("wandaWindow");
        var plusPopup5 = $("#descApiPopupDetail_wsdl_test").data("wandaWindow");
        if(plusPopup1 && plusPopup1 != null){
            plusPopup1.destroy();
            $("#descApiPopupDetail").after('<div id="descApiPopupDetail_rongduanSettingPopup"></div>');
        }
        if(plusPopup2 && plusPopup2 != null){
            plusPopup2.destroy();
            $("#descApiPopupDetail").after('<div id="descApiPopupDetail_inparamSettingPopup"></div>');
        }
        if(plusPopup3 && plusPopup3 != null){
            plusPopup3.destroy();
            $("#descApiPopupDetail").after('<div id="descApiPopupDetail_outparamSettingPopup"></div>');
        }
        if(plusPopup4 && plusPopup4 != null){
            plusPopup4.destroy();
            $("#descApiPopupDetail").after('<div id="descApiPopupDetail_customSettingPopup"></div>');
        }
        if(plusPopup5 && plusPopup5 != null){
            plusPopup5.destroy();
            $("#descApiPopupDetail").after('<div id="descApiPopupDetail_wsdl_test"></div>');
        }
    }
    var initParam = function () {
        var _params = common.getRouterParams();
        descApiPopupDetail_validate.init();
        descApiPopupDetail_serverName.init();
        descApiPopupDetail_state.init();
        descApiPopupDetail_method.init();
        descApiPopupDetail_transProto.init();
        descApiPopupDetail_contentProto.init();
        descApiPopupDetail_tabstrip.init();
        descApiPopupDetail_desContentProto.init();
        descApiPopupDetail_desMethod.init();
        descApiPopupDetail_desTransProto.init();
        descApiPopupDetail_descPathGrid.init();
        descApiPopupDetail_ispublic.init();
        descApiPopupDetail_closeBtn.init();
        descApiPopupDetail_saveCloseBtn.init();
        descApiPopupDetail_nextBtn.init();
        descApiPopupDetail_preBtn.init();
        descApiPopupDetail_rongduanSettingPopupWin.init();
        descApiPopupDetail_inparamSettingPopupWin.init();
        descApiPopupDetail_outparamSettingPopupWin.init();
        descApiPopupDetail_customSettingPopupWin.init();
        readOnly();
        secondPageShow();
        $("#descApiPopupDetail_isAdd").val("false");
        descApiPopupDetailDetail.init($("#descApiPopupDetail_apiId").val());
    }
    var init = function () {
        initParam();
    };
    return {
        init: init
    }
});