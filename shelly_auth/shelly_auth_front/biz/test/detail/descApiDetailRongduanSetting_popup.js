define(["jquery", "common", "wandaComp", "wandaCompR"], function ($, common, wandaComp,wandaCompR) {
    var descApiDetailRongduanSetting_saveBtn = {
        init: function (parentIds) {
            $("#descApiDetailRongduanSetting_saveBtn").unbind("click");
            $("#descApiDetailRongduanSetting_saveBtn").click(function () {
                $("#descApiDetailRongduanSetting_saveBtn").trigger("afterClick");
            });
        }
    };

    var descApiDetailRongduanSetting_cancelBtn = {
        init:function () {
            $("#descApiDetailRongduanSetting_cancelBtn").unbind("click");
            $("#descApiDetailRongduanSetting_cancelBtn").click(function () {
                $("#descApiDetailRongduanSetting_cancelBtn").trigger("afterClick");
            });
        }
    }
    //超时时间
    var api_waitTimeLimit = {
        value:"",
        getInst:function () {
            return $("#descApiDetailRongduanSetting_waitTimeLimit").data("wandaNumericTextBox");
        },
        init:function () {
            if(api_waitTimeLimit.getInst() == undefined){
                $("#descApiDetailRongduanSetting_waitTimeLimit").wandaNumericTextBox({
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
            return $("#descApiDetailRongduanSetting_concurrencyLimit").data("wandaNumericTextBox");
        },
        init:function () {
            if(api_concurrencyLimit.getInst() == undefined){
                $("#descApiDetailRongduanSetting_concurrencyLimit").wandaNumericTextBox({
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
        descApiDetailRongduanSetting_saveBtn.init();
        descApiDetailRongduanSetting_cancelBtn.init();
        api_waitTimeLimit.init();
        api_concurrencyLimit.init();
    };
    return {
        init: init,
        waitTime:api_waitTimeLimit,
        concuy:api_concurrencyLimit
    };
});

