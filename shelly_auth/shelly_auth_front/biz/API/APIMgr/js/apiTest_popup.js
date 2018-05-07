define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var saveBtn = {
        init: function (parentIds) {
            $("#APITest_popup_saveBtn").unbind("click");
            $("#APITest_popup_saveBtn").click(function () {
                var successFun = function (data) {
                    $("#APITest_popup_outparamDemo").val(data);
                }
                var method = $("#APITest_popup_method").val();

                var headerObj = {},paramObj = null;
                $("#headTable tr:gt(0)").each(function () {
                    var key = $(this).find("td:eq(0)").find("input").val();
                    var value = $(this).find("td:eq(1)").find("input").val();
                    if(key !="" && value !=""){
                        headerObj[key] = value;
                    }
                });
                if(method == "1"){
                    paramObj = {};
                    $("#paramTable tr:gt(0)").each(function () {
                        var key = $(this).find("td:eq(0)").find("input").val();
                        var value = $(this).find("td:eq(1)").find("input").val();
                        if(key !="" && value !=""){
                            paramObj[key] = value;
                        }
                    });
                }else{
                    paramObj = $("#APITest_popup_inparamDemo").val();
                }
                var testParam = {
                    "paramObj": paramObj,
                    "bodyProtocol":$("#APITest_popup_content").val(),
                    "descBodyProtocol":$("#APITest_popup_desContent").val(),
                    "method": method,
                    "protocol": $("#APITest_popup_protocol").val(),
                    "url": $("#APITest_popup_url").val(),
                    "header":headerObj
                }
                common.ajaxPost("api/apiTest/gateApiTest", testParam, successFun, null, null, $("#APITest_popup"));
            });
        }
    };
    //入参tabstrip
    var api_tabstrip = {
        getInst: function () {
            return $("#APITest_popup_tabstrip").data("wandaTabStrip");
        },
        init:function () {
            $("#APITest_popup_tabstrip").wandaTabStrip({
                tabPosition: "top",
                animation: {open: {effects: "fadeIn"}}
            });
            api_tabstrip.getInst().select("li:first");
        }
    };
    //API方法
    var api_method = {
        value:"",
        getInst: function () {
            return $("#APITest_popup_method").data("wandaDropDownList");
        },
        setValue:function (value) {
            api_method.value = value;
            api_method.getInst().value(value);
        },
        successFun:function (data) {
            $("#APITest_popup_method").data("wandaDropDownList").setDataSource(data);
            if(api_method.value){
                api_method.getInst().value(api_method.value);
            }
            api_method.getInst().readonly();
        },
        init: function () {
            $("#APITest_popup_method").wandaDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                index: 0
            });
            var param = {"key": "method"};
            common.ajaxGet("syscommpara/getBaseAttr", param, api_method.successFun, null, null, $("#APITest_popup"));
        }
    };
    var clearData = function () {
        $("#headTable").find("tr:gt(0):not(:last)").remove();
        $("#paramTable").find("tr:gt(0):not(:last)").remove();
        $("#headTable").find("input").val("");
        $("#paramTable").find("input").val("");
    };
    //获取详情
    var apiDetail = {
        init: function (apiId) {
            clearData();
            var successFun = function (data) {
                var gateApi = data["gateApi"];
                if(gateApi){//基本信息
                    var path = gateApi["API_PATH"];
                    var ip = gateApi["IP"];
                    var port = gateApi["PORT"];
                    var method = gateApi["API_METHOD"];
                    api_method.setValue(method);
                    $("#APITest_popup_url").val(gateApi["ADDR_TRANS"].toLowerCase()+"://"+ip+":"+port+path);
                    $("#APITest_popup_protocol").val(gateApi["API_TRANS_PROTO"]);
                    $("#APITest_popup_content").val(gateApi["API_CONTENT_PROTO"]);
                    if(gateApi["IS_RAW_API"] == "2"){
                        $("#APITest_popup_desContent").val(gateApi["API_CONTENT_PROTO"]);
                    }else{
                        $("#APITest_popup_desContent").val(gateApi["DES_CONTENT_PROTO"]);
                    }

                    if(method == "1"){
                        $("#headTable").show();
                        $("#paramTable").show();
                        $("#APITest_popup_inparamDemo").hide();
                        $("#APITest_popup_inparamDemo").parent("div").css("overflow","auto");
                    }else{
                        $("#headTable").show();
                        $("#paramTable").hide();
                        $("#APITest_popup_inparamDemo").show();
                        $("#APITest_popup_inparamDemo").parent("div").css("overflow","hidden");
                    }
                }
            };
            var param = {"apiId": apiId};
            common.ajaxGet("api/gateApi/queryGateApiDetail", param, successFun, null, null, $("#APITest_popup"));

        }
    };
    var optTable = {
        init:function () {
            $("#APITest_popup table").on("input propertychange","td input",function(){
                var tableCount = $(this).parent().parent().parent().find("tr").length;
                var currentIndex = $(this).parent().parent().index();
                var key = $(this).parent().parent().find("td:eq(0)").find("input").val();
                if(key != "" && $(this).val()!="" && tableCount-currentIndex == 1){
                  $(this).parent().parent().parent().append("<tr><td style='padding: 4px'><input class='k-textbox'/></td><td style='padding: 4px'><input class='k-textbox'/></td><td style='padding: 4px;vertical-align: inherit;text-align: center'></td></tr>");
                  $(this).parent().parent().find("td:last").append("<i class='fa fa-trash-o fa_icon deleteNode' style='vertical-align: middle' title='删除'></i>");
                }

            });
        }
    };
    var deleteRow = {
        init:function () {
            $("#headTable").on("click",".deleteNode",function () {
                $(this).parent().parent("tr").remove();
            });
            $("#paramTable").on("click",".deleteNode",function () {
                $(this).parent().parent("tr").remove();
            })
        }
    }
    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        api_tabstrip.init();
        saveBtn.init();
        api_method.init();
        optTable.init();
        deleteRow.init();
    };
    return {
        init: init,
        initDetail:apiDetail
    };
});

