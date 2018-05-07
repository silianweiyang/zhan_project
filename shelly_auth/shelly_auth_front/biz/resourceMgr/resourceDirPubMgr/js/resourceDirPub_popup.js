define(["jquery", "common", "compont", "wandaComp", "wandaCompR"], function ($, common, compont, wandaComp, wandaCompR) {
    //初始化页面信息
    var initPage = {
        init:function(param){
            $("#resourceDir_popup_wnd_title").text("查看资源目录");
            var dirId = param["dirId"];
            var initUpdatePage = function(data){
                var resourceDir = data.datas;
                $("#sourceDir_dirCode").val(resourceDir["dirCode"]);
                $("#sourceDir_dirName").val(resourceDir["dirName"]);
                checkRadio(resourceDir["isOpen"],"sourceDir_isOpen")
                checkRadio(resourceDir["hadFolder"],"sourceDir_hadFolder")
                $("#sourceDir_describe").val(resourceDir["describe"]);

                $("#sourceDir_dirCode").attr("readonly","readonly");
                $("#sourceDir_dirName").attr("readonly","readonly");
                $("#sourceDir_isOpen").attr("readonly","readonly");
                $("#sourceDir_hadFolder").attr("readonly","readonly");
                $("#sourceDir_describe").attr("readonly","readonly");
            }
            var paramObj={
                dirId:dirId
            };
            common.ajaxPost("resourceContentMgr/loadResourceDirById",paramObj,initUpdatePage,null,null,null);
        }
    };

    //选择单选框
    var checkRadio = function(checkValue,radioName){
        var obj = document.getElementsByName(radioName);
        for(var i=0;i<obj.length;i++){
            var radio = obj[i];
            if(radio.value==checkValue){
                radio.checked;
                radio.click();
            }
        }
    };

    //保存按钮初始化
    var submitBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#submit").unbind("click");
            $("#" + parentIds).find("#submit").click(function () {
                $("#" + parentIds).find("#submit").trigger("afterClick");
            });
        }

    };

    //取消按钮
    var cancelBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#cancel").unbind("click");
            $("#" + parentIds).find("#cancel").click(function () {
                $("#" + parentIds).find("#cancel").trigger("afterClick");
            });
        }

    };
    var init = function (parentId,param) {
        initPage.init(param);
        submitBtn.init(parentId);
        cancelBtn.init(parentId);
    };
    return {
        init: init
    }
});

