define(["jquery", "common", "wandaComp"], function ($, common, wandaComp) {
    var saveBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#serverList_popup_save").unbind("click");
            $("#" + parentIds).find("#serverList_popup_save").click(function () {
                var nodeName = $("#" + parentIds).find("#nodeList_popup_nodeName").val();
                var ip = $("#" + parentIds).find("#nodeList_popup_ip").val();
                var mac = $("#"+parentIds).find("#nodeList_popup_macAddress").val();
                var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                var reg2 = /[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}/;
                if (nodeName == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请输入主机名称！"
                    });
                    return false;
                }else if (ip == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请输入主机IP！"
                    });
                    return false;
                }else if(!reg.test(ip)){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "主机IP格式不正确！"
                    });
                    return false;
                }else if (mac == "") {
                    common.jqConfirm.alert({
                        title: 0,
                        content: "请输入主机MAC！"
                    });
                    return false;
                }else if(!reg2.test(mac)){
                    common.jqConfirm.alert({
                        title: 0,
                        content: "主机MAC格式不正确！"
                    });
                    return false;
                } else {
                    $("#" + parentIds).find("#nodeList_popup_save").trigger("afterClick");
                }

            });
        }
    };
    var cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#serverList_popup_cancel").unbind("click");
            $("#" + parentIds).find("#serverList_popup_cancel").click(function () {
                $("#" + parentIds).find("#serverList_popup_cancel").trigger("afterClick");
            });
        }
    };

    var init = function (parentId) {
        if (common.debugTag) {
            debugger;
        }
        saveBtn.init(parentId);
        cancelBtn.init(parentId);
    };
    return {
        init: init
    };
});

