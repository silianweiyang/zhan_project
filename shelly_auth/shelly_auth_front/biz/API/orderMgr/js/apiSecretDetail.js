/**
 * Created by 01053895 on 2018-01-22.
 */
define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    //关闭
    var orderSecretDetail_closeBtn = {
        init: function () {
            $("#orderSecretDetail_closeBtn").unbind("click");
            $("#orderSecretDetail_closeBtn").click(function () {
                $("#orderSecretDetail_closeBtn").trigger("afterClick");
            });
        }
    };
    //只读
    var readOnlyFunc = function () {
        $("#secret_code").attr("readonly", "true");
        $("#secret_sign").attr("readonly", "true");
    };
    //赋值
    var apiSecretDetail = {
        init:function (orderId) {
            var successFun = function (datas) {
                var info = datas["datas"];
                //赋值
                $("#secret_code").val(info["appCode"]);
                $("#secret_sign").val(info["sign"]);
                //只读
                readOnlyFunc();
            };
            var param = {
                "order_id":orderId
            };
            common.ajaxGet("api/gateApiOrder/showOrderKeyInfo", param, successFun, null, null, $("#APIMgr"));
        }
    };
    var initParam = function () {
        var _params = JSON.parse($("#APISecretFound_hideBtn").attr("_param"));
        var orderId = _params["orderId"];
        apiSecretDetail.init(orderId);
    };
    var init = function () {
        wandaComp.elementControl($("#apiSecretDetail"));
        orderSecretDetail_closeBtn.init();
        initParam();
    };
    return {
        init: init
    }
});