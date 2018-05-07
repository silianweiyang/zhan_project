define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#serverMgrDetail_cancel").unbind("click");
            $("#" + parentIds).find("#serverMgrDetail_cancel").click(function () {
                $("#" + parentIds).find("#serverMgrDetail_cancel").trigger("afterClick");
            });
        }
    };

    var downLoadBtn = {
        init:function (parentIds) {
            $("#"+parentIds).find("#serverMgrDetail_download").unbind("click");
            $("#"+parentIds).find("#serverMgrDetail_download").click(function () {
                var serviceId = $("#serverMgrDetail_serverCode").val();
                try {
                    var elemIF = document.createElement("iframe");
                    elemIF.src = common.baseUrl+"api/gateService/downLoadRecommend?serviceId="+serviceId;
                    elemIF.style.display = "none";
                    document.body.appendChild(elemIF);
                    $(elemIF).load(function(e){                             //  等iframe加载完毕
                        var retData = $(this)[0]["contentDocument"]["activeElement"]["innerText"];
                        common.jqConfirm.alert({
                            title: 0,
                            content: JSON.parse(retData)["returnMsg"]
                        });
                    });
                }catch(e){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "文档不存在！"
                    });
                }
            });
        }
    }
    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        cancelBtn.init("serverList_plusPopup");
        downLoadBtn.init("serverList_plusPopup");
    };
    return {
        init: init
    };
});

