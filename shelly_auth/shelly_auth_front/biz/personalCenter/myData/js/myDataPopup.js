define(["jquery", "common", "wandaComp", "wandaCompR"], function ($, common, wandaComp, wandaCompR) {
    var divId ="0";
    var addCondition_btn = {
        init: function (parentId) {
            $("#" + parentId).find("#addCondition_btn").click(function () {
                divId =  parseInt(divId)+parseInt(1);
                var itemId = "item"+divId;
                var connectorId = "connector"+divId;
                var column_fieldId = "column_field"+divId;
                var operatorId = "operator"+divId;
                var operatorValueId = "operatorValue"+divId;
                var html ="<div id=\'"+itemId+"\' name=\"dataInfo_searchItem\" style=\"width:100%;height: 40px;float: left;margin-top: 5px;\">\n" +
                    "                <div class=\"searchItemBig\">\n" +
                    "                    <select class=\"selectCss\" id='"+connectorId+"' name='connector'>\n" +
                    "                        <option value=''>请选择链接字符</option>\n" +
                    "                        <option value='and'>and</option>\n" +
                    "                        <option value='or'>or</option>\n" +
                    "                    </select>\n" +
                    "                </div>\n" +
                    "                <div class=\"searchItem\">\n" +
                    "                    <select class=\"selectCss\" id='"+column_fieldId+"' name='column_field'>\n" +
                    "                        <option value=''>请选择字段</option>\n" +
                                             getOptions()+
                    "                    </select>\n" +
                    "                </div>\n" +
                    "                <div class=\"searchItem\">\n" +
                    "                    <select class=\"selectCss\" id='"+operatorId+"' name='operator'>\n" +
                    "                        <option value=''>请选择条件</option>\n" +
                    "                        <option value='>'>大于</option>\n" +
                    "                        <option value='<'>小于</option>\n" +
                    "                        <option value='='>等于</option>\n" +
                    "                        <option value='>='>大于等于</option>\n" +
                    "                        <option value='<='>小于等于</option>\n" +
                    "                        <option value='!='>不等于</option>\n" +
                    "                    </select>\n" +
                    "                </div>\n" +
                    "                <div class=\"inputItem\" >\n" +
                    "                    <input type=\"text\" style=\"width: 80%;\" class=\"inputCss\"  id='"+operatorValueId+"' name='operatorValue' placeholder='请输入条件值'/>\n" +
                    "                </div>\n" +
                    "                <div class=\"searchItem\" style=\"width:15%; \">\n" +
                    "                    <button type=\"button\" style=\"display: block;float: left;\" onclick='removeCondition(\""+itemId+"\")' class=\"search_btn search_btn1 col-lg-12 p0\">删除</button>\n" +
                    "                </div>\n" +
                    "            </div>";
                $("#dataInfo_search").append(html);
            });
        }
    };
    var searchDiv = {
        init:function(parentId){
            var html =" <div name=\"dataInfo_searchItem\" style=\"width:100%;height: 40px;float: left;margin-top: 5px;\">\n" +
                "                <div class=\"searchItemBig\" style=\"height: 25px;line-height: 35px;vertical-align: middle;font-size: 16px;\">查询条件:</div>\n" +
                "                    <select type='hidden' style='display: none;' id='connector0' name='connector' class=\"selectCss\">\n" +
                "                        <option value=''>请选择链接字符</option>\n" +
                "                        <option value='and' selected='selected'>and</option>\n" +
                "                        <option value='or'>or</option>\n" +
                "                    </select>\n" +
                "                <div class=\"searchItem\" >\n" +
                "                    <select class=\"selectCss\" id='column_field0' name='column_field'>\n" +
                "                        <option value=''>请选择字段</option>\n" +
                                         getOptions() +
                "                    </select>\n" +
                "                </div>\n" +
                "                <div class=\"searchItem\">\n" +
                "                    <select class=\"selectCss\" id='operator0' name='operator'>\n" +
                "                        <option value=''>请选择条件</option>\n" +
                "                        <option value='>'>大于</option>\n" +
                "                        <option value='<'>小于</option>\n" +
                "                        <option value='='>等于</option>\n" +
                "                        <option value='>='>大于等于</option>\n" +
                "                        <option value='<='>小于等于</option>\n" +
                "                        <option value='!='>不等于</option>\n" +
                "                    </select>\n" +
                "                </div>\n" +
                "                <div class=\"inputItem\">\n" +
                "                    <input type=\"text\" style=\"width: 80%;\"class=\"inputCss\" name='operatorValue' value='' id='operatorValue0' placeholder='请输入条件值'/>\n" +
                "                </div>\n" +
                "                <div class=\"searchItem\" style=\"width:15%; \">\n" +
                "                    <button type=\"button\" id=\"addCondition_btn\" style=\"display: block;float: left;\" class=\"search_btn search_btn1 col-lg-12 p0\" >增加条件</button>\n" +
                "                </div>\n" +
                "            </div>";
            $("#" + parentId).find("#dataInfo_search").empty();
            $("#" + parentId).find("#dataInfo_search").append(html);
        }
    };
    //数据列表对应的对象
    var dataListGrid = {
        rows: "10",
        pageParam:{},
        gridColums: [],
        refreshDatas: function (index) {
            var page = "1";
            if (index) {
                page = index;
            }
            var param = {
                "pageBean": {
                    "page": page + "",
                    "rows": dataListGrid.rows
                },
                "paramObj": dataListGrid.pageParam
            };
            var successFun = function (data) {
                var pageBean = data.pageBean;
                var gridData = new wanda.data.DataSource({
                    data: data.datas,
                    pageSize: 10
                });
                dataListGrid.getInst().setDataSource(gridData, pageBean);
            };
            common.ajaxPost("myDataMgr/getDataList", param, successFun, null, false, $("#dataListGrid"));
        },
        pagerCallBack: function (e) {
            dataListGrid.refreshDatas(e.index);
        },
        getGridSelectValue: function () {
            var selectEdit = dataListGrid.getInst().getSelect();
            return selectEdit;

        },
        inst: {},
        getInst: function () {
            var cols = searchColumn.columns;
            var newGridColums = [];
            if(cols!=null && typeof (cols)!=undefined){
                for(var i=0;i<cols.length;i++){
                    var col = cols[i];
                    var field_name = col["FIELD_NAME"];
                    var newCommand = [];
                    newCommand["title"] = field_name;
                    newCommand["field"]=field_name;
                    newCommand["width"]="100px";
                    newGridColums.push(newCommand);
                }
            }
            dataListGrid.inst = new wandaComp.wandaGrid("dataListGrid", newGridColums, true, this.pagerCallBack);
            return dataListGrid.inst;
        },
        init: function () {
            dataListGrid.getInst().init();
            dataListGrid.refreshDatas();
        }
    };
    //查询按钮对应对象
    var dataInfo_searchBtn = {
        init:function(parentId,authId,resId){
            $("#" + parentId).find("#dataInfo_searchBtn").click(function () {
                var connectors = getValuesByElementName("connector");
                var column_fields = getValuesByElementName("column_field");
                var operators = getValuesByElementName("operator");
                var operatorValues = getValuesByElementName("operatorValue");
                if(validationCondition()){
                    //验证通过提交参数
                    var condition = getConditions();
                    dataListGrid.pageParam = {
                        "authId":authId,
                        "resId":resId,
                        "condition":condition
                    }
                    dataListGrid.refreshDatas();
                }
            });
        }
    };
    //获取查询条件
    function getConditions(){
        var searchLength = parseInt(divId)+parseInt("1");
        var searConditions = [];
        for(var i=0;i<searchLength;i++){
            var connectorId = "connector"+i;
            var column_fieldId = "column_field"+i;
            var operatorId = "operator"+i;
            var operatorValueId = "operatorValue"+i;
            var connector = $("#"+connectorId).val();
            var column_field = $("#"+column_fieldId).val();
            var operator = $("#"+operatorId).val();
            var operatorValue = $("#"+operatorValueId).val();
            var condition = {
                "connector":connector,
                "column_field":column_field,
                "operator":operator,
                "operatorValue":operatorValue
            }
            searConditions.push(condition);
        }
        return searConditions;
    }
    //申请数据按钮
    var dataInfo_applyBtn = {
        init:function(parentId,authId,resId){
            $("#" + parentId).find("#dataInfo_applyBtn").click(function () {
                if(validationCondition()){
                    //验证通过提交参数
                    var condition = getConditions();
                    var param = {
                        "authId":authId,
                        "resId":resId,
                        "condition":condition
                    }
                    var successFun = function(data){
                        var dataMsg = data.datas;
                        var html =  $("#dataListDiv").html();
                        var downLoad = dataMsg["download"];
                        var newTime = new Date(downLoad["loseTime"]);
                        $("#dataInfo_searchBtnDiv").html("");
                        var btnHtml = "<button type=\"button\" id=\"dataInfo_applyBtn\" disabled='disabled' opt=\"search\" class=\"search_btn search_btn1 col-lg-8 col-md-3 p0\" style=\"margin-top: 5px;margin-left: 10px;\" >\n" +
                            "                申请数据\n" +
                            "            </button>";
                        $("#dataInfo_searchBtnDiv").html(btnHtml);
                        var dataListDivHtml = "<div style='font-size: 18px;margin-left: 20px;margin-top: 10px;'>已申请数据条数"+downLoad["recordCount"]+"<br/><br/>数据包下载截止时间:"+parseDate(newTime)+"</div>";
                        dataListDivHtml += html;
                        $("#dataListDiv").html(dataListDivHtml);
                        if(dataMsg["code"]=="1"){
                            common.jqConfirm.alert({
                                title: 1,
                                content: dataMsg['msg']
                            });
                        }else{
                            common.jqConfirm.alert({
                                title: 0,
                                content: dataMsg['msg']
                            });
                        }
                    }
                    common.ajaxPost("myDataMgr/applyData", param, successFun, null, false, null);

                }
            });
        }
    };
    //条件框格式验证
    function validationCondition(){
        var searchLength = parseInt(divId)+parseInt("1");
        for(var i=0;i<searchLength;i++){
            var connectorId = "connector"+i;
            var column_fieldId = "column_field"+i;
            var operatorId = "operator"+i;
            var operatorValueId = "operatorValue"+i;
            var connector = $("#"+connectorId).val();
            var column_field = $("#"+column_fieldId).val();
            var operator = $("#"+operatorId).val();
            var operatorValue = $("#"+operatorValueId).val();
            if(connector!="" && column_field!="" && operator!="" && operatorValue!=""){

            }else if(i>1&&connector=="" && column_field=="" && operator=="" && operatorValue==""){

            }else if(i==0&&connector!="" && column_field=="" && operator=="" && operatorValue=="") {

            }else{
                    common.jqConfirm.alert({
                    title: 0,
                    content: "查询条件有误，请修改查询条件！"
                    })
                return false;
            };

        }
        return true;
    }
    //根据name获取对应的数据数组
    function getValuesByElementName(elementName){
        var elements = document.getElementsByName(elementName);
        var values = [];
        for(var i=0;i<elements.length;i++){
            var element = elements[i];
            var value = element.value;
            values.push(value);
        }
        return values;
    }
    //初始化字段名信息
    var searchColumn = {
        columns:{

        },
        init:function(authId,resId){
            var successFun = function(data){
                searchColumn.columns = data.datas;
            }
            var param = {
                "authId":authId,
                "resId":resId
            }
            common.ajaxPost("myDataMgr/getColumns", param, successFun, null, false, null);
        }
    };
    //初始化数据源名字
    var dataSourceInit ={
        init:function(resId){
            var successFun = function(data){
                var dataSource = data.datas;
                var sourceName = "数据源名称："+dataSource["dataSourceName"];
                $("#dataInfo_dataSourceName").html(sourceName);
            }
            var param = {
                "resId":resId
            }
            common.ajaxPost("myDataMgr/getDataSourceInfo", param, successFun, null, false, null);
        }
    };
    //初始化字段下拉框
    var getOptions = function(){
        var cols = searchColumn.columns;
        var option = "";
        if(cols!=null && typeof (cols)!=undefined){
            for(var i=0;i<cols.length;i++){
                var col = cols[i];
                option+="<option value='"+col["FIELD_NAME"]+"'>"+col["FIELD_NAME"]+"</option>";
            }
        }
        return option;
    };
    //删除条件按钮
    var deleteSearchCondition = {
        init:function(parentId){
            $("#" + parentId).find("#deleteSearchCondition").click(function () {
                divId = parseInt(divId)-parseInt(1);
            });
        }
    }
    //初始化查询按钮
    var dataInfoShow_searchBtnDiv = {
        init:function(){
            var html = "<button type=\"button\" id=\"dataInfo_searchBtn\" opt=\"search\" class=\"search_btn search_btn1 col-lg-8 col-md-3 p0\" style=\"margin-top: 5px;margin-left: 10px;\" >\n" +
                "                <i class=\"fa fa-search search fa_icon1 fa_icon_white fa_icon_blue p3\"></i>查询\n" +
                "            </button>";
            $("#dataInfo_searchBtnDiv").html(html);
        }
    };
    //初始化申请数据按钮
    var dataInfoApply_BtnDiv = {
        init:function(authId,resId){
            $("#dataListDiv").empty();
            var successFun = function(data){
                var codeAndObj = data.datas;
                if(codeAndObj["code"]=="1"){
                    var html = "<button type=\"button\" id=\"dataInfo_applyBtn\" disabled='disabled' opt=\"search\" class=\"search_btn search_btn1 col-lg-8 col-md-3 p0\" style=\"margin-top: 5px;margin-left: 10px;\" >\n" +
                        "                申请数据\n" +
                        "            </button>";
                    $("#dataInfo_searchBtnDiv").html(html);
                    $("#searchDiv").removeClass("showStyle");
                    $("#searchDiv").addClass("hidenStyle");
                    var dataListDivHtml =getWebServiceRequest(codeAndObj["resId"],codeAndObj["webserviceUrl"],codeAndObj["code"]);
                    $("#dataListDiv").html(dataListDivHtml);
                }else if(codeAndObj["code"]=="2"){//已申请过使用数据包获取数据
                    var downLoad = codeAndObj["download"];
                    var newTime = new Date(downLoad["loseTime"]);
                    var html = "<button type=\"button\" id=\"dataInfo_applyBtn\" disabled='disabled' opt=\"search\" class=\"search_btn search_btn1 col-lg-8 col-md-3 p0\" style=\"margin-top: 5px;margin-left: 10px;\" >\n" +
                        "                申请数据\n" +
                        "            </button>";
                    $("#dataInfo_searchBtnDiv").html(html);
                    var dataListDivHtml = "<div style='font-size: 18px;margin-left: 20px;margin-top: 10px;'>已申请数据条数"+downLoad["recordCount"]+"<br/><br/>数据包下载截止时间:"+parseDate(newTime)+"</div>";
                    $("#dataListDiv").html(dataListDivHtml);
                }else if(codeAndObj["code"]=="3"){//已申请数据包并使用数据包和webservice获取数据
                    var downLoad = codeAndObj["download"];
                    var newTime = new Date(downLoad["loseTime"]);
                    var html = "<button type=\"button\" id=\"dataInfo_applyBtn\" disabled='disabled' opt=\"search\" class=\"search_btn search_btn1 col-lg-8 col-md-3 p0\" style=\"margin-top: 5px;margin-left: 10px;\" >\n" +
                        "                申请数据\n" +
                        "            </button>";
                    $("#dataInfo_searchBtnDiv").html(html);

                    var dataListDivHtml = "<div style='font-size: 18px;margin-left: 20px;margin-top: 10px;'>已申请数据条数"+downLoad["recordCount"]+"<br/><br/>数据包下载截止时间:"+parseDate(newTime)+"</div>";
                    dataListDivHtml += getWebServiceRequest(codeAndObj["resId"],codeAndObj["webserviceUrl"],codeAndObj["code"]);
                    $("#dataListDiv").html(dataListDivHtml);
                }else if(codeAndObj["code"]=="4"){
                    var html = "<button type=\"button\" id=\"dataInfo_applyBtn\" opt=\"search\" class=\"search_btn search_btn1 col-lg-8 col-md-3 p0\" style=\"margin-top: 5px;margin-left: 10px;\" >\n" +
                        "                申请数据\n" +
                        "            </button>";
                    $("#dataInfo_searchBtnDiv").html(html);
                    var dataListDivHtml = "";
                    $("#dataListDiv").html(dataListDivHtml);
                }else if(codeAndObj["code"]=="5"){
                    var html = "<button type=\"button\" id=\"dataInfo_applyBtn\" opt=\"search\" class=\"search_btn search_btn1 col-lg-8 col-md-3 p0\" style=\"margin-top: 5px;margin-left: 10px;\" >\n" +
                        "                申请数据\n" +
                        "            </button>";
                    $("#dataInfo_searchBtnDiv").html(html);
                    var dataListDivHtml =getWebServiceRequest(codeAndObj["resId"],codeAndObj["webserviceUrl"],codeAndObj["code"]);
                    $("#dataListDiv").html(dataListDivHtml);
                }
            }
            var param = {
                "authId":authId,
                "resId":resId
            }
            common.ajaxPost("myDataMgr/queryIsApplyData", param, successFun, null, false, null);
        }
    };
    function getWebServiceRequest(resId,webserviceUrl,code){
        var html = "<div style='font-size:16px;margin-left: 20px;margin-top: 20px;'>";
        if(code=="1"){
            html +="由于您只选择了通过webservice方式获取数据信息，请通过webservice获取数据！";
        }else{
            html += "由于您选择了webservice方式和数据包下载的方式获取数据信息，您也可以通过webservice方式获取数据！"
        }

        html +="<br/>您选择的对应资源资源id为："+resId;
        html += "<br/>对应服务地址："+webserviceUrl;
        html += "<br/>消息范例：";
        html +="<br/>&emsp;&emsp;&emsp;&emsp;&emsp;{\n" +
            "<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\t\"resId\": \""+resId+"\",\n" +
            "<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\t\"loginName\": \"请输入用户名\",\n" +
            "<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\t\"authCode\": \"请输入授权码\",\n" +
            "<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\t\"searchParam\":\"\",\n" +
            "<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\t\"pageNo\": \"1\",\n" +
            "<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;\t\"pageSize\": \"50\"\n" +
            "<br/>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;}";
        html += "<br/>接口服务具体出入参信息，请咨询服务提供方获取接口文档！</div>";
        return html;
    }
    function parseDate(times) {
        return times.getFullYear() + "-" + (times.getMonth() + 1) + "-" + times.getDate() + " " + times.getHours() + ":" + times.getMinutes() + ":" + times.getSeconds() + "";
    };
    var init = function (parentId,authId,resId,endTime,model) {
        dataListGrid.pageParam={
            "authId":authId,
            "resId":resId
        };
        searchColumn.init(authId,resId);
        $("#dataInfo_authEndTime").html("授权截止时间："+endTime);
        dataSourceInit.init(resId);
        searchDiv.init(parentId);
        $("#searchDiv").removeClass("hidenStyle");
        $("#searchDiv").addClass("showStyle");
        if(model=="showData"){
            $("#resourceTable_popup_wnd_title").text("查看数据");
            $("#dataListDiv").empty();
            $("#dataListDiv").html("<div id=\"dataListGrid\"></div>\n" +
                "        <div id=\"dataListGridPager\"></div>");
            dataInfoShow_searchBtnDiv.init();
            dataListGrid.init();
        }
        if(model=="applyData"){
            $("#resourceTable_popup_wnd_title").text("申请数据");
            $("#dataListDiv").empty();
            dataInfoApply_BtnDiv.init(authId,resId);
        }
        addCondition_btn.init(parentId);
        dataInfo_searchBtn.init(parentId,authId,resId);
        dataInfo_applyBtn.init(parentId,authId,resId);
        deleteSearchCondition.init(parentId);
    };
    return {
        init: init
    }
});

function  removeCondition(itemId) {
    $("#"+itemId).remove();
    $("#deleteSearchCondition").trigger("click");
};