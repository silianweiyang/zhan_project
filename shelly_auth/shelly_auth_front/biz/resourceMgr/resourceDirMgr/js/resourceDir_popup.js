define(["jquery", "common", "compont", "wandaComp", "wandaCompR"], function ($, common, compont, wandaComp, wandaCompR) {
    //初始化页面信息
    var initPage = {
        init:function(param){
            $("#divModel").val(param["divModel"]);
            $("#pDirId").val(param["pDirId"]);
            $("#sourceDir_dirCode").removeAttr("readonly");
            $("#sourceDir_dirName").removeAttr("readonly");
            $("#sourceDir_isOpen").removeAttr("readonly");
            $("#sourceDir_hadFolder").removeAttr("readonly");
            $("#sourceDir_describe").removeAttr("readonly");
            //新增资源目录和资源根目录时
            if(param["divModel"]=="addDir"){
                $("#resourceDir_popup_wnd_title").text("新增资源目录");
                $("#dirLevel").val(param["dirLevel"])
                $("#sourceDir_dirCode").val("");
                $("#sourceDir_dirName").val("");
                $("#sourceDir_isOpen").val("");
                $("#sourceDir_hadFolder").val("");
                $("#sourceDir_describe").val("");
            }else if(param["divModel"]=="addRootDir"){
                $("#resourceDir_popup_wnd_title").text("新增资源根目录");
                $("#dirLevel").val(param["dirLevel"])
                $("#sourceDir_dirCode").val("");
                $("#sourceDir_dirName").val("");
                $("#sourceDir_isOpen").val("");
                $("#sourceDir_hadFolder").val("");
                $("#sourceDir_describe").val("");
            }
            //修改资源目录
            else if(param["divModel"]=="updateDir"){
                var dirId = param["dirId"];
                var initUpdatePage = function(data){
                    var resourceDir = data.datas;
                    $("#dirId").val(dirId);
                    $("#sourceDir_dirCode").val(resourceDir["dirCode"]);
                    $("#sourceDir_dirCode").attr("readonly","readonly");
                    $("#sourceDir_dirName").val(resourceDir["dirName"]);
                    checkRadio(resourceDir["isOpen"],"sourceDir_isOpen")
                    checkRadio(resourceDir["hadFolder"],"sourceDir_hadFolder")
                    $("#sourceDir_describe").val(resourceDir["describe"]);
                    $("#sourceDir_dirStatus").val(resourceDir["dirStatus"]);
                }
                var paramObj={
                    dirId:dirId
                };
                common.ajaxPost("resourceContentMgr/loadResourceDirById",paramObj,initUpdatePage,null,null,null);
            }else if(param["divModel"]=="detailDir"){
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
        }
    };

    //表单验证
    var verification = function(){
        if($("#sourceDir_dirCode").val()==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请输入资源目录代码！"
            });
            return false;
        }else{
            // common.ajaxPost("")
        }
        if($("#sourceDir_dirName").val()==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请输入资源目录名称！"
            });
            return false;
        }
        if(getRadioValue("sourceDir_isOpen")==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请选择资源目录开放性！"
            });
            return false;
        }
        if(getRadioValue("sourceDir_hadFolder")==""){
            common.jqConfirm.alert({
                title: 0,
                content: "请选择资源目录是否包含子目录！"
            });
            return false;
        }
       return true;
    };

    //获取表单提交参数
    var getFormValue = function (opt,btn) {
        var dirCode = $("#sourceDir_dirCode").val();
        var dirName = $("#sourceDir_dirName").val();
        var isOpen = getRadioValue("sourceDir_isOpen");
        var hadFolder = getRadioValue("sourceDir_hadFolder");
        var describe = $("#sourceDir_describe").val();
        if(opt == "addDir"){  //新增操作
            var dirStatus = "1";
            if(btn=="enable"){
                dirStatus = "2";
            }
            var level = $("#dirLevel").val();
            var dirLevel = parseInt(level)+parseInt(1);
            var params = {
                pdirId: $("#pDirId").val(),
                dirCode:dirCode,
                dirName:dirName,
                isOpen:isOpen,
                hadFolder:hadFolder,
                describe:describe,
                dirStatus:dirStatus,
                dirLevel:dirLevel+''
            };
            return params;
        }
        //新增根目录
        else if(opt=="addRootDir"){
            var dirStatus = "1";
            if(btn=="enable"){
                dirStatus = "2";
            }
            var params = {
                pdirId: $("#pDirId").val(),
                dirCode:dirCode,
                dirName:dirName,
                isOpen:isOpen,
                hadFolder:hadFolder,
                describe:describe,
                dirStatus:dirStatus,
                dirLevel:"1"
            };
            return params;
        }
        else if(opt =="updateDir"){//修改操作
            var params = {
                dirCode:dirCode,
                dirName:dirName,
                isOpen:isOpen,
                hadFolder:hadFolder,
                describe:describe,
                dirStatus:$("#sourceDir_dirStatus").val(),
                dirId:$("#dirId").val()
            };
            if(btn=="enable"){
                params = {
                    dirCode:dirCode,
                    dirName:dirName,
                    isOpen:isOpen,
                    hadFolder:hadFolder,
                    describe:describe,
                    dirStatus:"2",
                    dirId:$("#dirId").val()
                };
            }
            return params;
        }
    };

    //初始化启用按钮
    var enableBtn = {
        init:function(parentIds){
            $("#" + parentIds).find("#enable").unbind("click");
            $("#" + parentIds).find("#enable").click(function () {
                if (verification()) {
                    var _param = getFormValue($("#divModel").val(),"enable");
                    var alertFun =  function(data){
                        common.jqConfirm.alert({
                            title: 1,
                            content: data['msg'],
                            call:function(){
                                $("#" + parentIds).find("#enable").trigger("afterClick");
                            }
                        });
                    };
                    //判断是否为新增操作，传入对应url
                    if( $("#divModel").val() == "addDir"||$("#divModel").val()=="addRootDir"){
                        common.ajaxPost("resourceContentMgr/addResourceDir",_param,alertFun,null,null,null);
                    }else if($("#divModel").val() == "updateDir"){
                        common.ajaxPost("resourceContentMgr/updateResourceDir", _param,alertFun, null, null, null);
                    }
                }

            });
        }
    }

    //保存按钮初始化
    var saveBtn = {
        init: function (parentIds) {
            $("#" + parentIds).find("#submit").unbind("click");
            $("#" + parentIds).find("#submit").click(function () {
                if (verification()) {
                    var _param = getFormValue($("#divModel").val());
                    var alertFun =  function(data){
                        common.jqConfirm.alert({
                            title: 1,
                            content: data['msg'],
                            call:function(){
                                $("#" + parentIds).find("#submit").trigger("afterClick");
                            }
                        });
                    };
                    //判断是否为新增操作，传入对应url
                    if( $("#divModel").val() == "addDir"||$("#divModel").val()=="addRootDir"){
                        common.ajaxPost("resourceContentMgr/addResourceDir",_param,alertFun,null,null,null);
                    }else if($("#divModel").val() == "updateDir"){
                        common.ajaxPost("resourceContentMgr/updateResourceDir", _param,alertFun, null, null, null);
                    }
                }
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

    //获取单选框选中的值
    var getRadioValue = function(radioName){
        var radioValue = "";
        var obj=document.getElementsByName(radioName);
        for (var i=0;i<obj.length;i++){ //遍历Radio
            if(obj[i].checked){
                radioValue=obj[i].value;
            }
        }
        return radioValue;
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

    var init = function (parentId,param) {
        initPage.init(param);
        enableBtn.init(parentId);
        saveBtn.init(parentId);
        cancelBtn.init(parentId);
    };
    return {
        init: init
    }
});

