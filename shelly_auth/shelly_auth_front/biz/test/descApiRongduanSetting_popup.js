define(["jquery", "common", "wandaComp", "wandaCompR"], function ($, common, wandaComp,wandaCompR) {
    var descApiRongduanSetting_saveBtn = {
        init: function (parentIds) {
            $("#descApiRongduanSetting_saveBtn").unbind("click");
            $("#descApiRongduanSetting_saveBtn").click(function () {
                $("#descApiPopup_waitTimeLimit").val("");
                $("#descApiPopup_concurrencyLimit").val("");
                $("#descApiRongduanSetting_saveBtn").trigger("afterClick");
            });
        }
    };

    var descApiRongduanSetting_cancelBtn = {
        init:function () {
            $("#descApiRongduanSetting_cancelBtn").unbind("click");
            $("#descApiRongduanSetting_cancelBtn").click(function () {
                if($("#descApiPopup_isAdd").val() != "false"){
                    api_waitTimeLimit.getInst().value(180);
                    api_concurrencyLimit.getInst().value(100);
                }else{
                    api_waitTimeLimit.getInst().value(api_waitTimeLimit.value);
                    api_concurrencyLimit.getInst().value(api_concurrencyLimit.value);
                }
                $("#descApiRongduanSetting_cancelBtn").trigger("afterClick");
            });
        }
    }
    //超时时间
    var api_waitTimeLimit = {
        value:"",
        getInst:function () {
            return $("#descApiRongduanSetting_waitTimeLimit").data("wandaNumericTextBox");
        },
        init:function () {
            if(api_waitTimeLimit.getInst() == undefined){
                $("#descApiRongduanSetting_waitTimeLimit").wandaNumericTextBox({
                    format: "0 s",
                    min: 0,
                    value:180
                });
            }
        }
    };
    //最大并发数
    var api_concurrencyLimit = {
        value:"",
        getInst:function () {
            return $("#descApiRongduanSetting_concurrencyLimit").data("wandaNumericTextBox");
        },
        init:function () {
            if(api_concurrencyLimit.getInst() == undefined){
                $("#descApiRongduanSetting_concurrencyLimit").wandaNumericTextBox({
                    format: "0",
                    min: 0,
                    value:100
                });
            }
        }
    };

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        descApiRongduanSetting_saveBtn.init();
        descApiRongduanSetting_cancelBtn.init();
        api_waitTimeLimit.init();
        api_concurrencyLimit.init();
    };
    return {
        init: init,
        waitTime:api_waitTimeLimit,
        concuy:api_concurrencyLimit
    };
});

