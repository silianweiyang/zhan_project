define(["jquery", "common", "wandaComp", "wandaCompR"], function ($, common, wandaComp,wandaCompR) {
    var APIRongduanSetting_cancelBtn = {
        init:function () {
            $("#detailRongduanSetting_cancelBtn").unbind("click");
            $("#detailRongduanSetting_cancelBtn").click(function () {
                $("#detailRongduanSetting_cancelBtn").trigger("afterClick");
            });
        }
    }
    //超时时间
    var api_waitTimeLimit = {
        value:"",
        getInst:function () {
            return $("#detailRongduanSetting_waitTimeLimit").data("wandaNumericTextBox");
        },
        init:function () {
            $("#detailRongduanSetting_waitTimeLimit").wandaNumericTextBox({
                format: "0 s",
                min: 0
            });
        }
    };
    //最大并发数
    var api_concurrencyLimit = {
        value:"",
        getInst:function () {
            return $("#detailRongduanSetting_concurrencyLimit").data("wandaNumericTextBox");
        },
        init:function () {
            $("#detailRongduanSetting_concurrencyLimit").wandaNumericTextBox({
                format: "0",
                min: 0
            });
        }
    };

    var init = function () {
        if (common.debugTag) {
            debugger;
        }
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

