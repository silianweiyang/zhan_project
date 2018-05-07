define(["jquery", "common", "wandaComp", "wandaCompR"], function ($, common, wandaComp,wandaCompR) {
    var APIRongduanSetting_saveBtn = {
        init: function (parentIds) {
            $("#APIRongduanSetting_saveBtn").unbind("click");
            $("#APIRongduanSetting_saveBtn").click(function () {
                $("#APIMgr_waitTimeLimit").val("");
                $("#APIMgr_concurrencyLimit").val("");
                $("#APIRongduanSetting_saveBtn").trigger("afterClick");
            });
        }
    };

    var APIRongduanSetting_cancelBtn = {
        init:function () {
            $("#APIRongduanSetting_cancelBtn").unbind("click");
            $("#APIRongduanSetting_cancelBtn").click(function () {
                if($("#APIMgr_isAdd").val() != "false"){
                    api_waitTimeLimit.getInst().value(180);
                    api_concurrencyLimit.getInst().value(100);
                }else{
                    api_waitTimeLimit.getInst().value(api_waitTimeLimit.value);
                    api_concurrencyLimit.getInst().value(api_concurrencyLimit.value);
                }
                $("#APIRongduanSetting_cancelBtn").trigger("afterClick");
            });
        }
    }
    //超时时间
    var api_waitTimeLimit = {
        value:"",
        getInst:function () {
            return $("#APIRongduanSetting_waitTimeLimit").data("wandaNumericTextBox");
        },
        init:function () {
            $("#APIRongduanSetting_waitTimeLimit").wandaNumericTextBox({
                format: "0 s",
                min: 0,
                value:180
            });
        }
    };
    //最大并发数
    var api_concurrencyLimit = {
        value:"",
        getInst:function () {
            return $("#APIRongduanSetting_concurrencyLimit").data("wandaNumericTextBox");
        },
        init:function () {
            $("#APIRongduanSetting_concurrencyLimit").wandaNumericTextBox({
                format: "0",
                min: 0,
                value:100
            });
        }
    };

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
        APIRongduanSetting_saveBtn.init();
        APIRongduanSetting_cancelBtn.init();
        api_waitTimeLimit.init();
        api_concurrencyLimit.init();
    };
    return {
        init: init,
        waitTime:api_waitTimeLimit,
        concuy:api_concurrencyLimit
    };
});

