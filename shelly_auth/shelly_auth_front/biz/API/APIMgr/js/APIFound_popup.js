define(["jquery", "common", "wandaComp", "wandaCompR", "biz/js/orgInfo_popup"], function ($, common, wandaComp, wandaCompR, orgInfo_popup) {

    //应用名称
    var APIFound_popup_serverName = {
        successFun: function (data) {
            $("#APIFound_popup_serverName").data("wandaDropDownList").setDataSource(data);
        },
        init: function () {
            $("#APIFound_popup_serverName").wandaDropDownList({
                optionLabel: {
                    SERVICE_NAME: "--请选择--",
                    SERVICE_ID: ""
                },
                dataTextField: "SERVICE_NAME",
                dataValueField: "SERVICE_ID",
                index: 0
            });
            var param = {};
            common.ajaxGet("api/gateService/queryGateServiceAll", param, APIFound_popup_serverName.successFun, null, null, $("#APIList"));
        }
    };


    var saveBtn = {
        init: function () {
            $("#APIFound_popup_saveBtn").unbind("click");
            $("#APIFound_popup_saveBtn").click(function () {
                //if(validat.helper.validate()){
                //$("#" + parentIds).find("#APIFound_popup_saveBtn").trigger("afterClick");
                //}
                var serverName = $("#APIFound_popup_serverName").val();
                if (serverName == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请选择应用名称！"
                    });
                    return false;
                } else {
                    $("#APIFound_popup_saveBtn").trigger("afterClick");
                }

            });
        }
    };

    var cancelBtn = {
        init: function () {
            $("#APIFound_popup_cancelBtn").unbind("click");
            $("#APIFound_popup_cancelBtn").click(function () {
                $("#APIFound_popup_cancelBtn").trigger("afterClick");
            });
        }
    };

    var init = function () {
        APIFound_popup_serverName.init();
        saveBtn.init();
        cancelBtn.init();
    };
    return {
        init: init
    }
});